import { GraphExplorer, parseGraph } from "./graph-core.js";
import {
  applyPermalinkToState,
  buildPermalinkUrl,
  getPermalinkItemForView,
  parsePermalink,
  resolveGraphNodeId,
} from "./comune-permalinks.js";
import {
  countEventsInMonth,
  eventOccursInMonth,
  formatCalendarMonthLabel,
  renderEventCalendar,
  resolveCalendarMonthKey,
  shiftMonthKey,
} from "./comune-event-calendar.js";
import {
  buildOrgTreeLayout,
  buildServiceIoLayout,
  renderOrgTreeSvg,
  renderServiceIoSvg,
} from "./comune-special-views.js";

const VIEWS = [
  { id: "panoramica", label: "Panoramica" },
  { id: "organigramma", label: "Organigramma" },
  { id: "persone", label: "Persone" },
  { id: "uffici", label: "Uffici" },
  { id: "servizi", label: "Servizi" },
  { id: "eventi", label: "Eventi" },
  { id: "luoghi", label: "Luoghi" },
];

const store = {
  raw: null,
  index: new Map(),
  graph: null,
  organization: null,
  offices: [],
  persons: [],
  services: [],
  events: [],
  pois: [],
  eventsByPoi: new Map(),
  personsByOffice: new Map(),
  servicesByOffice: new Map(),
  themesByOffice: new Map(),
};

const ui = {
  statsPanel: document.querySelector("#stats-panel"),
  orgLead: document.querySelector("#org-lead"),
  viewNav: document.querySelector("#view-nav"),
  viewRoot: document.querySelector("#view-root"),
  graphExplorer: document.querySelector("#graph-explorer"),
  filePicker: document.querySelector("#file-picker"),
  appStatus: document.querySelector("#app-status"),
};

const viewState = {
  current: "panoramica",
  selectedNodeId: null,
  selectedOfficeId: null,
  selectedServiceId: null,
  selectedPersonId: null,
  selectedEventId: null,
  selectedPoiId: null,
  calendarMonth: null,
  search: "",
  themeFilter: "all",
  statusFilter: "all",
  officeFilter: "all",
  treeFocusedOfficeId: null,
  treePersonsVisible: true,
  treeServicesVisible: true,
  expandedIoNodes: new Set(),
  orgTreeViewportWidth: null,
  map: null,
  mapCluster: null,
};

const graphExplorer = new GraphExplorer({
  detailEl: document.querySelector("#node-detail"),
  svgEl: document.querySelector("#graph-svg"),
  legendEl: document.querySelector("#graph-legend"),
  onSelect: (nodeId, options = {}) => openNodeInThematicView(nodeId, options),
});

let toastTimer = null;
let orgTreeResizeTimer = null;
let isApplyingPermalink = false;

init();

function init() {
  ui.viewNav.addEventListener("click", onNavClick);
  ui.statsPanel.addEventListener("click", onStatsClick);
  ui.viewRoot.addEventListener("click", onViewClick);
  ui.viewRoot.addEventListener("input", onViewInput);
  ui.viewRoot.addEventListener("change", onViewChange);
  ui.filePicker.addEventListener("change", onFileSelected);
  window.addEventListener("hashchange", syncViewFromHash);
  window.addEventListener("popstate", syncViewFromHash);
  window.addEventListener("resize", onOrgTreeResize);

  syncViewFromHash();
  if (!store.raw) {
    renderStatsEmpty();
  }
}

function loadGraph(data) {
  buildStore(data);
  graphExplorer.setData(store.graph);
  applyPermalinkFromLocation();
  if (!viewState.selectedNodeId) {
    const defaultNodeId =
      store.organization?.["@id"] ||
      store.offices[0]?.["@id"] ||
      store.persons[0]?.["@id"] ||
      null;
    if (defaultNodeId) {
      selectGraphNode(defaultNodeId, {
        scroll: false,
        syncViewSelection: false,
        updateUrl: false,
      });
    }
  }
  renderFromPermalink({ replaceUrl: true });
  showStatus(`Grafo caricato: ${getTitle(store.organization) || "comune"}.`);
}

function buildStore(data) {
  const graph = Array.isArray(data?.["@graph"]) ? data["@graph"] : [];
  store.raw = data;
  store.graph = parseGraph(data);
  store.index = new Map(graph.map((node) => [node["@id"], node]));
  store.offices = graph.filter((node) => node["@type"] === "cov:Office");
  store.persons = graph.filter((node) => node["@type"] === "cpv:Person");
  store.services = graph.filter((node) => node["@type"] === "cpsv:PublicService");
  store.events = graph
    .filter((node) => node["@type"] === "cpev:PublicEvent")
    .map((event) => ({
      node: event,
      id: event["@id"],
      title: getTitle(event),
      start: event["ti:startTime"] ?? "",
      end: event["ti:endTime"] ?? "",
      abstract: normalizeLiteral(event["cpev:eventAbstract"] || event["l0:description"]),
      officeId: refId(event["cov:hasOrganization"]),
      geo: resolveEventGeo(event),
    }))
    .sort((a, b) => String(a.start).localeCompare(String(b.start)));

  store.pois = graph
    .filter((node) => node["@type"] === "poi:PointOfInterest")
    .map((poi) => ({
      node: poi,
      id: poi["@id"],
      title: getTitle(poi),
      description: normalizeLiteral(poi["poi:POIdescription"] || poi["l0:description"]),
      officeId: refId(poi["cov:hasOrganization"]),
      geo: resolvePoiGeo(poi),
    }))
    .filter((poi) => poi.geo);

  store.eventsByPoi = new Map();
  for (const event of store.events) {
    const poiId = refId(event.node["cpev:takesPlaceIn"]);
    if (!poiId) continue;
    if (!store.eventsByPoi.has(poiId)) {
      store.eventsByPoi.set(poiId, []);
    }
    store.eventsByPoi.get(poiId).push(event);
  }
  for (const events of store.eventsByPoi.values()) {
    events.sort((a, b) => String(a.start).localeCompare(String(b.start)));
  }

  store.organization =
    graph.find((node) => node["@type"] === "cov:PublicOrganization") ?? null;

  store.personsByOffice = new Map();
  for (const person of store.persons) {
    const officeId = refId(person["cov:hasOrganization"]);
    if (!officeId) continue;
    if (!store.personsByOffice.has(officeId)) {
      store.personsByOffice.set(officeId, []);
    }
    store.personsByOffice.get(officeId).push(person);
  }

  store.servicesByOffice = new Map();
  for (const service of store.services) {
    for (const officeId of refIds(service["cov:hasOrganization"])) {
      if (!store.servicesByOffice.has(officeId)) {
        store.servicesByOffice.set(officeId, []);
      }
      store.servicesByOffice.get(officeId).push(service);
    }
  }

  store.themesByOffice = new Map();
  for (const office of store.offices) {
    const themes = refIds(office["cpsv:hasTheme"]).map((themeId) => {
      const themeNode = store.index.get(themeId);
      return themeNode?.["skos:prefLabel"] || humanizePredicate(themeId);
    });
    store.themesByOffice.set(office["@id"], themes);
  }

  if (store.offices.length && !viewState.selectedOfficeId) {
    viewState.selectedOfficeId = store.offices[0]["@id"];
  }
  if (store.persons.length && !viewState.selectedPersonId) {
    viewState.selectedPersonId = store.persons[0]["@id"];
  }
  if (store.services.length && !viewState.selectedServiceId) {
    viewState.selectedServiceId = store.services[0]["@id"];
  }
  if (store.events.length && !viewState.selectedEventId) {
    viewState.selectedEventId = store.events[0].id;
  }
  if (store.pois.length && !viewState.selectedPoiId) {
    viewState.selectedPoiId = store.pois[0].id;
  }

  if (!viewState.treeFocusedOfficeId) {
    viewState.treeFocusedOfficeId = store.offices[0]?.["@id"] ?? null;
  }
  viewState.treePersonsVisible = true;
  viewState.treeServicesVisible = true;
  viewState.expandedIoNodes = new Set();

  if (store.organization) {
    ui.orgLead.textContent = `Esplora organigramma, uffici, servizi, eventi e luoghi del grafo JSON-LD di ${getTitle(store.organization)}.`;
  }
}

function applyPermalinkFromLocation() {
  const permalink = parsePermalink(window.location.hash);
  applyPermalinkToState(permalink, viewState, {
    hasNode: (nodeId) => store.index.has(nodeId),
  });
  viewState.selectedNodeId = resolveGraphNodeId(permalink, viewState, (nodeId) =>
    store.graph?.nodes.some((node) => node.id === nodeId),
  );
  if (permalink.view === "eventi") {
    viewState.calendarMonth = permalink.itemId
      ? resolveCalendarMonthKey(permalink.itemId, store.events)
      : null;
  }
}

function renderFromPermalink({ replaceUrl = false } = {}) {
  isApplyingPermalink = true;
  updateNav();
  if (!store.raw) {
    ui.graphExplorer.hidden = true;
    renderEmptyState();
    isApplyingPermalink = false;
    return;
  }
  ensureDefaultSelectionForView(viewState.current);
  renderCurrentView();
  renderStats();
  if (viewState.selectedNodeId) {
    ui.graphExplorer.hidden = false;
    selectGraphExplorerNode(viewState.selectedNodeId);
  } else {
    ui.graphExplorer.hidden = true;
  }
  if (replaceUrl) {
    updatePermalink({ replace: true });
  }
  isApplyingPermalink = false;
}

function syncViewFromHash() {
  applyPermalinkFromLocation();
  renderFromPermalink();
}

function updatePermalink({ replace = false, view, itemId, nodeId } = {}) {
  if (isApplyingPermalink) return;
  const currentView = view || viewState.current;
  const currentItem = itemId !== undefined ? itemId : getPermalinkItemForView(currentView, viewState);
  const currentNode = nodeId !== undefined ? nodeId : viewState.selectedNodeId;
  const url = buildPermalinkUrl(currentView, currentItem, currentNode);
  window.history[replace ? "replaceState" : "pushState"](null, "", url);
}

function ensureDefaultSelectionForView(view) {
  if (!store.raw) return;
  switch (view) {
    case "organigramma":
      if (!viewState.treeFocusedOfficeId) {
        viewState.treeFocusedOfficeId = store.offices[0]?.["@id"] ?? null;
      }
      break;
    case "persone":
      if (!viewState.selectedPersonId) {
        viewState.selectedPersonId = store.persons[0]?.["@id"] ?? null;
      }
      break;
    case "uffici":
      if (!viewState.selectedOfficeId) {
        viewState.selectedOfficeId = store.offices[0]?.["@id"] ?? null;
      }
      if (viewState.selectedOfficeId) {
        viewState.selectedNodeId = viewState.selectedOfficeId;
      }
      break;
    case "servizi":
      if (!viewState.selectedServiceId) {
        viewState.selectedServiceId = store.services[0]?.["@id"] ?? null;
      }
      break;
    case "eventi":
      if (!viewState.selectedEventId) {
        viewState.selectedEventId = store.events[0]?.id ?? null;
      }
      break;
    case "luoghi":
      if (!viewState.selectedPoiId) {
        viewState.selectedPoiId = store.pois[0]?.id ?? null;
      }
      break;
    default:
      break;
  }
}

function navigateToView(viewId) {
  viewState.current = viewId;
  if (viewId === "eventi") {
    viewState.calendarMonth = null;
  }
  ensureDefaultSelectionForView(viewState.current);
  updatePermalink({ replace: false });
  renderFromPermalink();
}

function onNavClick(event) {
  const link = event.target.closest("[data-view]");
  if (!link) return;
  event.preventDefault();
  navigateToView(link.dataset.view);
}

function onStatsClick(event) {
  const link = event.target.closest("[data-goto-view]");
  if (!link || !store.raw) return;
  event.preventDefault();
  navigateToView(link.dataset.gotoView);
}

function onFileSelected(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      loadGraph(data);
      showStatus(`Grafo caricato da ${file.name} (${store.index.size} nodi).`);
    } catch {
      showStatus("Il file selezionato non contiene JSON valido.");
    }
  };
  reader.readAsText(file);
}

function updateNav() {
  for (const link of ui.viewNav.querySelectorAll("[data-view]")) {
    link.classList.toggle("is-active", link.dataset.view === viewState.current);
  }
}

function renderCurrentView() {
  destroyMap();
  const renderers = {
    panoramica: renderPanoramica,
    organigramma: renderOrganigramma,
    persone: renderPersone,
    uffici: renderUffici,
    servizi: renderServizi,
    eventi: renderEventi,
    luoghi: renderLuoghi,
  };
  ui.viewRoot.innerHTML = renderers[viewState.current]?.() ?? "";
  if (viewState.current === "eventi" || viewState.current === "luoghi") {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => initMapForCurrentView());
    });
  }
  if (viewState.current === "organigramma") {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => syncOrgTreeViewport());
    });
  }
}

function syncOrgTreeViewport() {
  const measured = getOrgTreeViewportWidth();
  if (measured > 0 && measured !== viewState.orgTreeViewportWidth) {
    viewState.orgTreeViewportWidth = measured;
    ui.viewRoot.innerHTML = renderOrganigramma();
  }
  scrollOrgTreeToFocus();
}

function getOrgTreeViewportWidth() {
  const stage = document.querySelector(".comune-special-stage--tree");
  if (stage?.clientWidth > 0) return stage.clientWidth;
  return Math.min(1400, Math.max(880, document.documentElement.clientWidth - 160));
}

function onOrgTreeResize() {
  if (viewState.current !== "organigramma") return;
  window.clearTimeout(orgTreeResizeTimer);
  orgTreeResizeTimer = window.setTimeout(() => {
    renderCurrentView();
  }, 160);
}

function scrollOrgTreeToFocus() {
  const stage = document.querySelector(".comune-special-stage--tree");
  const svg = stage?.querySelector(".comune-special-svg--tree");
  if (!stage || !svg) return;
  const focusY = Number(svg.dataset.focusY);
  if (!Number.isFinite(focusY)) return;
  const viewBox = svg.viewBox.baseVal;
  if (!viewBox.height) return;
  const rendered = svg.getBoundingClientRect();
  if (!rendered.height) return;
  const scaleY = rendered.height / viewBox.height;
  const focusPy = (focusY - viewBox.y) * scaleY;
  stage.scrollTop = Math.max(0, focusPy - stage.clientHeight / 3);
}

function onViewClick(event) {
  const gotoOrgOffice = event.target.closest("[data-goto-organigramma-office]");
  if (gotoOrgOffice) {
    event.preventDefault();
    goToOrganigrammaOffice(gotoOrgOffice.dataset.gotoOrganigrammaOffice);
    return;
  }

  const gotoLuoghiPoi = event.target.closest("[data-goto-luoghi-poi]");
  if (gotoLuoghiPoi) {
    event.preventDefault();
    event.stopPropagation();
    goToLuoghiPoi(gotoLuoghiPoi.dataset.gotoLuoghiPoi);
    return;
  }

  const gotoEventiEvent = event.target.closest("[data-goto-eventi-event]");
  if (gotoEventiEvent) {
    event.preventDefault();
    event.stopPropagation();
    goToEventiEvent(gotoEventiEvent.dataset.gotoEventiEvent);
    return;
  }

  const gotoPersonePerson = event.target.closest("[data-goto-persone-person]");
  if (gotoPersonePerson) {
    event.preventDefault();
    event.stopPropagation();
    goToPersonePerson(gotoPersonePerson.dataset.gotoPersonePerson);
    return;
  }

  const gotoServiziService = event.target.closest("[data-goto-servizi-service]");
  if (gotoServiziService) {
    event.preventDefault();
    event.stopPropagation();
    goToServiziService(gotoServiziService.dataset.gotoServiziService);
    return;
  }

  const ioToggle = event.target.closest("[data-io-node-toggle]");
  if (ioToggle) {
    event.stopPropagation();
    const nodeId = ioToggle.dataset.ioNodeToggle;
    if (viewState.expandedIoNodes.has(nodeId)) {
      viewState.expandedIoNodes.delete(nodeId);
    } else {
      viewState.expandedIoNodes.add(nodeId);
    }
    renderCurrentView();
    return;
  }

  const treeOffice = event.target.closest("[data-tree-office-id]");
  if (treeOffice) {
    const officeId = treeOffice.dataset.treeOfficeId;
    viewState.treeFocusedOfficeId = officeId;
    viewState.selectedOfficeId = officeId;
    viewState.treePersonsVisible = true;
    selectGraphNode(officeId, {
      scroll: false,
      syncViewSelection: false,
      updateUrl: false,
    });
    updatePermalink({ replace: false });
    renderCurrentView();
    return;
  }

  const treeNav = event.target.closest("[data-tree-nav]");
  if (treeNav) {
    const offices = filterOrgOffices();
    const currentIndex = offices.findIndex(
      (office) => office["@id"] === viewState.treeFocusedOfficeId,
    );
    const delta = treeNav.dataset.treeNav === "next" ? 1 : -1;
    const nextOffice = offices[currentIndex + delta];
    if (nextOffice) {
      const officeId = nextOffice["@id"];
      viewState.treeFocusedOfficeId = officeId;
      viewState.selectedOfficeId = officeId;
      selectGraphNode(officeId, { scroll: false, syncViewSelection: false, updateUrl: false });
      updatePermalink({ replace: false });
      renderCurrentView();
    }
    return;
  }

  const personsToggle = event.target.closest("[data-tree-persons-toggle]");
  if (personsToggle) {
    viewState.treePersonsVisible = !viewState.treePersonsVisible;
    renderCurrentView();
    return;
  }

  const servicesToggle = event.target.closest("[data-tree-services-toggle]");
  if (servicesToggle) {
    viewState.treeServicesVisible = !viewState.treeServicesVisible;
    renderCurrentView();
    return;
  }

  const specialNode = event.target.closest("[data-special-node]");
  if (specialNode) {
    openNodeInThematicView(specialNode.dataset.specialNode);
    return;
  }

  const nodeTrigger = event.target.closest("[data-node-id]");
  if (nodeTrigger) {
    openNodeInThematicView(nodeTrigger.dataset.nodeId);
    return;
  }

  const officeToggle = event.target.closest("[data-office-toggle]");
  if (officeToggle) {
    const card = officeToggle.closest(".comune-office-card");
    const body = card?.querySelector("[data-office-body]");
    if (!body) return;
    const expanded = officeToggle.getAttribute("aria-expanded") === "true";
    officeToggle.setAttribute("aria-expanded", String(!expanded));
    body.hidden = expanded;
    return;
  }

  const officeItem = event.target.closest("[data-office-id]");
  if (officeItem && viewState.current === "uffici") {
    const officeId = officeItem.dataset.officeId;
    viewState.selectedOfficeId = officeId;
    selectGraphNode(officeId, { scroll: true, syncViewSelection: false, updateUrl: false });
    updatePermalink({ replace: false });
    renderCurrentView();
    scrollThematicListItem(officeId, "officeId");
    return;
  }

  const personItem = event.target.closest("[data-person-id]");
  if (personItem && viewState.current === "persone") {
    const personId = personItem.dataset.personId;
    viewState.selectedPersonId = personId;
    selectGraphNode(personId, { scroll: true, syncViewSelection: false, updateUrl: false });
    updatePermalink({ replace: false });
    renderCurrentView();
    return;
  }

  const serviceItem = event.target.closest("[data-service-id]");
  if (serviceItem && viewState.current === "servizi") {
    const serviceId = serviceItem.dataset.serviceId;
    viewState.selectedServiceId = serviceId;
    viewState.expandedIoNodes = new Set();
    selectGraphNode(serviceId, { scroll: true, syncViewSelection: false, updateUrl: false });
    updatePermalink({ replace: false });
    renderCurrentView();
    return;
  }

  const calendarNav = event.target.closest("[data-calendar-nav]");
  if (calendarNav && viewState.current === "eventi") {
    const delta = calendarNav.dataset.calendarNav === "next" ? 1 : -1;
    viewState.calendarMonth = shiftMonthKey(
      getEventiCalendarMonthKey(),
      delta,
    );
    renderCurrentView();
    return;
  }

  const eventItem = event.target.closest("[data-event-id]");
  if (eventItem && viewState.current === "eventi" && !eventItem.closest("#comune-map")) {
    selectEventItem(eventItem.dataset.eventId);
    return;
  }

  const poiItem = event.target.closest("[data-poi-id]");
  if (poiItem && viewState.current === "luoghi" && !poiItem.closest("#comune-map")) {
    selectPoiItem(poiItem.dataset.poiId);
    return;
  }

  const viewLink = event.target.closest("[data-goto-view]");
  if (viewLink) {
    event.preventDefault();
    navigateToView(viewLink.dataset.gotoView);
  }
}

function onViewInput(event) {
  if (event.target.matches("[data-search]")) {
    viewState.search = event.target.value.trim().toLowerCase();
    renderCurrentView();
  }
}

function onViewChange(event) {
  if (event.target.matches("[data-theme-filter]")) {
    viewState.themeFilter = event.target.value;
    renderCurrentView();
  }
  if (event.target.matches("[data-status-filter]")) {
    viewState.statusFilter = event.target.value;
    renderCurrentView();
  }
  if (event.target.matches("[data-office-filter]")) {
    viewState.officeFilter = event.target.value;
    renderCurrentView();
  }
}

function getGraphExplorerSelectOptions(nodeId) {
  if (viewState.current === "uffici" && getNodeType(nodeId) === "cov:Office") {
    return { maxNodes: 28, filterDetailToSubgraph: true };
  }
  return { maxNodes: 56, filterDetailToSubgraph: false };
}

function selectGraphExplorerNode(nodeId) {
  graphExplorer.select(nodeId, getGraphExplorerSelectOptions(nodeId));
}

function selectGraphNode(
  nodeId,
  { scroll = false, syncViewSelection = true, updateUrl = true } = {},
) {
  if (!nodeId || !store.graph?.nodes.some((node) => node.id === nodeId)) return;
  viewState.selectedNodeId = nodeId;
  ui.graphExplorer.hidden = false;
  selectGraphExplorerNode(nodeId);

  if (syncViewSelection) {
    const raw = store.index.get(nodeId);
    const type = raw?.["@type"];
    if (type === "cov:Office") {
      viewState.selectedOfficeId = nodeId;
      if (viewState.current === "organigramma") {
        viewState.treeFocusedOfficeId = nodeId;
      }
    }
    if (type === "cpv:Person") viewState.selectedPersonId = nodeId;
    if (type === "cpsv:PublicService") {
      viewState.selectedServiceId = nodeId;
      viewState.expandedIoNodes = new Set();
    }
    if (type === "cpev:PublicEvent") viewState.selectedEventId = nodeId;
    if (type === "poi:PointOfInterest") viewState.selectedPoiId = nodeId;
  }

  if (updateUrl) {
    updatePermalink({ replace: false });
  }

  if (scroll) scrollToExplorer();
}

function scrollToExplorer() {
  requestAnimationFrame(() => {
    ui.graphExplorer?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

const THEMATIC_NODE_TYPES = [
  "cov:Office",
  "cpv:Person",
  "cpsv:PublicService",
  "cpev:PublicEvent",
  "poi:PointOfInterest",
];

function getNodeType(nodeId) {
  const raw = store.index.get(nodeId);
  const types = Array.isArray(raw?.["@type"])
    ? raw["@type"]
    : raw?.["@type"]
      ? [raw["@type"]]
      : [];
  return THEMATIC_NODE_TYPES.find((type) => types.includes(type)) ?? types[0] ?? null;
}

function scrollThematicListItem(id, datasetKey) {
  requestAnimationFrame(() => {
    const item = [...ui.viewRoot.querySelectorAll(`[data-${datasetKey}]`)].find(
      (el) => el.dataset[datasetKey] === id,
    );
    item?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  });
}

function openNodeInThematicView(nodeId, options = {}) {
  if (!nodeId || !store.index.get(nodeId)) return;
  const type = getNodeType(nodeId);
  switch (type) {
    case "cov:Office":
      goToOrganigrammaOffice(nodeId);
      return;
    case "cpv:Person":
      goToPersonePerson(nodeId);
      return;
    case "cpsv:PublicService":
      goToServiziService(nodeId);
      return;
    case "cpev:PublicEvent":
      goToEventiEvent(nodeId);
      return;
    case "poi:PointOfInterest":
      goToLuoghiPoi(nodeId);
      return;
    default:
      selectGraphNode(nodeId, options);
  }
}

function goToOrganigrammaOffice(officeId) {
  if (!officeId || !store.index.get(officeId)) return;
  viewState.current = "organigramma";
  viewState.treeFocusedOfficeId = officeId;
  viewState.selectedOfficeId = officeId;
  viewState.treePersonsVisible = true;
  viewState.treeServicesVisible = true;
  viewState.selectedNodeId = officeId;
  updatePermalink({ replace: false, view: "organigramma", itemId: officeId, nodeId: officeId });
  renderFromPermalink();
  scrollThematicListItem(officeId, "treeOfficeId");
}

function goToPersonePerson(personId) {
  if (!personId || !store.index.get(personId)) return;
  viewState.current = "persone";
  viewState.selectedPersonId = personId;
  viewState.selectedNodeId = personId;
  viewState.search = "";
  updatePermalink({ replace: false, view: "persone", itemId: personId, nodeId: personId });
  renderFromPermalink();
  scrollThematicListItem(personId, "personId");
}

function goToServiziService(serviceId) {
  if (!serviceId || !store.index.get(serviceId)) return;
  viewState.current = "servizi";
  viewState.selectedServiceId = serviceId;
  viewState.selectedNodeId = serviceId;
  viewState.expandedIoNodes = new Set();
  viewState.search = "";
  updatePermalink({ replace: false, view: "servizi", itemId: serviceId, nodeId: serviceId });
  renderFromPermalink();
  scrollThematicListItem(serviceId, "serviceId");
}

function goToLuoghiPoi(poiId) {
  if (!poiId || !store.index.get(poiId)) return;
  viewState.current = "luoghi";
  viewState.selectedPoiId = poiId;
  viewState.selectedNodeId = poiId;
  viewState.search = "";
  updatePermalink({ replace: false, view: "luoghi", itemId: poiId, nodeId: poiId });
  renderFromPermalink();
  scrollThematicListItem(poiId, "poiId");
}

function goToEventiEvent(eventId) {
  if (!eventId || !store.index.get(eventId)) return;
  viewState.current = "eventi";
  viewState.selectedEventId = eventId;
  viewState.selectedNodeId = eventId;
  viewState.search = "";
  viewState.calendarMonth = resolveCalendarMonthKey(eventId, store.events);
  updatePermalink({ replace: false, view: "eventi", itemId: eventId, nodeId: eventId });
  renderFromPermalink();
  scrollThematicListItem(eventId, "eventId");
}

function renderStats() {
  const stats = [
    { value: store.offices.length, label: "Uffici", view: "uffici" },
    { value: store.persons.length, label: "Persone", view: "persone" },
    { value: store.services.length, label: "Servizi", view: "servizi" },
    { value: store.events.length, label: "Eventi", view: "eventi" },
    { value: store.pois.length, label: "Luoghi geolocalizzati", view: "luoghi" },
  ];

  ui.statsPanel.innerHTML = stats
    .map(
      (stat) => `
        <a class="stat-card stat-card--link" href="#${stat.view}" data-goto-view="${stat.view}">
          <span class="stat-card__value">${stat.value}</span>
          <span class="stat-card__label">${stat.label}</span>
        </a>
      `,
    )
    .join("");
}

function renderPanoramica() {
  const orgTitle = store.organization ? getTitle(store.organization) : "Comune";
  const eventsWithGeo = store.events.filter((event) => event.geo).length;

  return `
    <section class="comune-view">
      <article class="comune-panel">
        <h2 class="comune-section-title">${escapeHtml(orgTitle)}</h2>
        <p class="comune-section-intro">
          Il grafo contiene ${store.index.size} nodi semantici. Usa le viste tematiche
          per esplorare l'amministrazione comunale senza navigare l'intero grafo generico.
        </p>
        <div class="comune-cards">
          ${renderOverviewCard("Organigramma", `${store.offices.length} uffici e ${store.persons.length} persone`, "organigramma")}
          ${renderOverviewCard("Persone", `${store.persons.length} persone con grafo relazioni`, "persone")}
          ${renderOverviewCard("Uffici", "Struttura organizzativa e contatti", "uffici")}
          ${renderOverviewCard("Servizi", `${store.services.length} servizi al cittadino`, "servizi")}
          ${renderOverviewCard("Eventi", `${eventsWithGeo} eventi su mappa`, "eventi")}
          ${renderOverviewCard("Luoghi", `${store.pois.length} punti di interesse`, "luoghi")}
        </div>
      </article>
    </section>
  `;
}

function renderOverviewCard(title, description, viewId) {
  return `
    <a class="comune-card-link" href="#${viewId}" data-goto-view="${viewId}">
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(description)}</p>
    </a>
  `;
}

function renderOrganigramma() {
  const offices = filterOrgOffices();
  if (
    offices.length &&
    !offices.some((office) => office["@id"] === viewState.treeFocusedOfficeId)
  ) {
    viewState.treeFocusedOfficeId = offices[0]["@id"];
  }
  const focusedOffice = store.index.get(viewState.treeFocusedOfficeId);
  const focusedIndex = offices.findIndex((office) => office["@id"] === viewState.treeFocusedOfficeId);
  const treeLayout = buildOrgTreeLayout({
    organization: store.organization,
    offices,
    focusedOfficeId: viewState.treeFocusedOfficeId,
    personsByOffice: store.personsByOffice,
    servicesByOffice: store.servicesByOffice,
    personsVisible: viewState.treePersonsVisible,
    servicesVisible: viewState.treeServicesVisible,
    viewportWidth: viewState.orgTreeViewportWidth || getOrgTreeViewportWidth(),
    getTitle,
  });
  const orgTitle = store.organization ? getTitle(store.organization) : "Organizzazione";

  return `
    <section class="comune-view">
      <article class="comune-panel">
        <h2 class="comune-section-title">Uffici</h2>
        <p class="comune-section-intro">
          ${offices.length} uffici su ${store.offices.length}. L'ufficio selezionato resta al centro in primo piano;
          gli altri restano compressi ai lati. Scorri l'albero per esplorare rami ampi.
        </p>
        <label class="field">
          <span class="field__label">Cerca ufficio o persona</span>
          <input type="search" data-search value="${escapeHtml(viewState.search)}" placeholder="Nome ufficio o persona" />
        </label>
        <ul class="comune-list comune-list--offices">
          ${offices
            .map((office) => {
              const officeId = office["@id"];
              const active = officeId === viewState.treeFocusedOfficeId ? "is-active" : "";
              const persons = store.personsByOffice.get(officeId)?.length ?? 0;
              const services = store.servicesByOffice.get(officeId)?.length ?? 0;
              return `
                <li>
                  <button type="button" class="comune-list__item ${active}" data-tree-office-id="${escapeHtml(officeId)}">
                    <span class="comune-list__title">${escapeHtml(getTitle(office))}</span>
                    <span class="comune-list__meta">${persons} persone · ${services} servizi</span>
                  </button>
                </li>
              `;
            })
            .join("")}
        </ul>
      </article>
      <article class="comune-panel comune-panel--tree">
        <h2 class="comune-section-title">Albero organizzativo</h2>
        <div class="comune-tree-nav">
          <button type="button" class="comune-tree-nav__btn" data-tree-nav="prev" ${focusedIndex <= 0 ? "disabled" : ""}>← Precedente</button>
          <p class="comune-tree-breadcrumb">
            <button type="button" class="comune-node-link" data-node-id="${escapeHtml(store.organization?.["@id"] || "")}">${escapeHtml(orgTitle)}</button>
            ${focusedOffice ? ` → <span>${escapeHtml(getTitle(focusedOffice))}</span>` : ""}
          </p>
          <button type="button" class="comune-tree-nav__btn" data-tree-nav="next" ${focusedIndex < 0 || focusedIndex >= offices.length - 1 ? "disabled" : ""}>Successivo →</button>
        </div>
        ${
          focusedOffice
            ? `
          <div class="comune-tree-controls">
            <button type="button" class="comune-chip comune-chip--clickable" data-tree-persons-toggle>
              ${viewState.treePersonsVisible ? "Nascondi persone" : `Mostra persone (${treeLayout.personCount})`}
            </button>
            <button type="button" class="comune-chip comune-chip--clickable comune-chip--service" data-tree-services-toggle>
              ${viewState.treeServicesVisible ? "Nascondi servizi" : `Mostra servizi (${treeLayout.serviceCount})`}
            </button>
            <span class="comune-detail__meta">${focusedIndex + 1} di ${offices.length} uffici filtrati</span>
          </div>
        `
            : ""
        }
        <div class="comune-special-stage comune-special-stage--tree">
          ${renderOrgTreeSvg(treeLayout, { selectedNodeId: viewState.selectedNodeId, escapeHtml })}
        </div>
      </article>
    </section>
  `;
}

function filterOrgOffices() {
  return [...store.offices]
    .filter((office) => {
      if (!viewState.search) return true;
      const officeId = office["@id"];
      const persons = store.personsByOffice.get(officeId) || [];
      const services = store.servicesByOffice.get(officeId) || [];
      const haystack = [
        getTitle(office),
        office["cov:mainFunction"],
        ...persons.map(getTitle),
        ...services.map(getTitle),
      ]
        .map((value) => String(value || "").toLowerCase())
        .join(" ");
      return haystack.includes(viewState.search);
    })
    .sort((a, b) => getTitle(a).localeCompare(getTitle(b), "it"));
}

function renderPersone() {
  const offices = [...store.offices].sort((a, b) =>
    getTitle(a).localeCompare(getTitle(b), "it"),
  );
  const persons = filterPersons();

  return `
    <section class="comune-view comune-split">
      <article class="comune-panel">
        <h2 class="comune-section-title">Persone</h2>
        <p class="comune-section-intro">
          Elenco del personale amministrativo. Ogni persona è cliccabile e apre
          il dettaglio con relazioni entranti e uscenti verso uffici e altri nodi.
        </p>
        <div class="comune-toolbar">
          <label class="field">
            <span class="field__label">Cerca persona</span>
            <input type="search" data-search value="${escapeHtml(viewState.search)}" placeholder="Nome o cognome" />
          </label>
          <label class="field">
            <span class="field__label">Ufficio</span>
            <select data-office-filter>
              <option value="all">Tutti gli uffici</option>
              ${offices
                .map((office) => {
                  const officeId = office["@id"];
                  return `<option value="${escapeHtml(officeId)}" ${viewState.officeFilter === officeId ? "selected" : ""}>${escapeHtml(getTitle(office))}</option>`;
                })
                .join("")}
            </select>
          </label>
        </div>
        <ul class="comune-list">
          ${persons
            .map((person) => {
              const personId = person["@id"];
              const active = personId === viewState.selectedPersonId ? "is-active" : "";
              const office = store.index.get(refId(person["cov:hasOrganization"]));
              return `
                <li>
                  <button type="button" class="comune-list__item ${active}" data-person-id="${escapeHtml(personId)}">
                    <span class="comune-list__title">${escapeHtml(getTitle(person))}</span>
                    <span class="comune-list__meta">${escapeHtml(office ? getTitle(office) : "Ufficio non indicato")}</span>
                  </button>
                </li>
              `;
            })
            .join("")}
        </ul>
      </article>
      <article class="comune-panel comune-detail">
        ${renderPersonDetail(viewState.selectedPersonId)}
      </article>
    </section>
  `;
}

function renderPersonDetail(personId) {
  const person = store.index.get(personId);
  if (!person) {
    return '<p class="comune-empty">Seleziona una persona dall\'elenco.</p>';
  }

  const office = store.index.get(refId(person["cov:hasOrganization"]));
  const graphNode = store.graph?.nodes.find((node) => node.id === personId);
  const givenName = person["cpv:givenName"] || "";
  const familyName = person["cpv:familyName"] || "";
  const displayTitle = person["dct:title"] || getTitle(person);
  const formattedName =
    familyName && givenName
      ? `${familyName} ${givenName}`
      : displayTitle;

  return `
    <div class="comune-person-card">
      <div class="comune-person-card__head">
        <span class="type-pill is-active" style="width:max-content">
          <span class="swatch" style="background:#c62828"></span>
          <span>Persona</span>
        </span>
        <h3>${escapeHtml(formattedName)}</h3>
        ${
          displayTitle && displayTitle !== formattedName
            ? `<p class="comune-detail__meta">Denominazione: ${escapeHtml(displayTitle)}</p>`
            : ""
        }
      </div>
      <div class="comune-kv">
        ${renderKv("Nome", givenName || "—")}
        ${renderKv("Cognome", familyName || "—")}
        ${renderKv(
          "Ufficio di appartenenza",
          office
            ? `<button type="button" class="comune-node-link" data-node-id="${escapeHtml(office["@id"])}">${escapeHtml(getTitle(office))}</button>`
            : "—",
          true,
        )}
        ${renderKv("Ruolo / note", normalizeLiteral(person["l0:description"]) || "—")}
        ${renderKv(
          "Collegamenti nel grafo",
          graphNode
            ? `${graphNode.incoming.length} entranti · ${graphNode.outgoing.length} uscenti`
            : "—",
        )}
        ${renderKv("Identificativo", personId)}
      </div>
      ${
        office
          ? `
        <div class="comune-related">
          <h4>Ufficio collegato</h4>
          <p class="comune-detail__meta">${escapeHtml(normalizeLiteral(office["cov:mainFunction"]) || "Nessuna funzione indicata.")}</p>
        </div>
      `
          : ""
      }
    </div>
  `;
}

function renderUffici() {
  const themes = [...new Set([...store.themesByOffice.values()].flat())].sort((a, b) =>
    a.localeCompare(b, "it"),
  );
  const offices = filterOffices();

  return `
    <section class="comune-view comune-split comune-split--uffici">
      <article class="comune-panel">
        <h2 class="comune-section-title">Uffici</h2>
        <p class="comune-section-intro">
          ${offices.length} uffici su ${store.offices.length}. Seleziona una riga per aprire la scheda
          e il sotto-grafo con i soli nodi collegati a quell'ufficio.
        </p>
        <div class="comune-toolbar comune-toolbar--uffici">
          <label class="field">
            <span class="field__label">Cerca ufficio</span>
            <input type="search" data-search value="${escapeHtml(viewState.search)}" placeholder="Nome, funzione o tema" />
          </label>
          <label class="field">
            <span class="field__label">Tema</span>
            <select data-theme-filter>
              <option value="all">Tutti i temi</option>
              ${themes.map((theme) => `<option value="${escapeHtml(theme)}" ${viewState.themeFilter === theme ? "selected" : ""}>${escapeHtml(theme)}</option>`).join("")}
            </select>
          </label>
        </div>
        <div class="comune-table-wrap" role="region" aria-label="Elenco uffici" tabindex="0">
          <table class="comune-table comune-office-table">
            <thead>
              <tr>
                <th scope="col">Ufficio</th>
                <th scope="col">Funzione</th>
                <th scope="col">Persone</th>
                <th scope="col">Servizi</th>
                <th scope="col">Temi</th>
              </tr>
            </thead>
            <tbody>
              ${offices
                .map((office) => {
                  const officeId = office["@id"];
                  const active = officeId === viewState.selectedOfficeId ? "is-active" : "";
                  const persons = store.personsByOffice.get(officeId)?.length ?? 0;
                  const services = store.servicesByOffice.get(officeId)?.length ?? 0;
                  const themesForOffice = store.themesByOffice.get(officeId) ?? [];
                  const functionLabel = normalizeLiteral(
                    office["cov:mainFunction"] || office["l0:description"],
                  );
                  return `
                    <tr class="comune-office-row ${active}" data-office-id="${escapeHtml(officeId)}" tabindex="0" role="button" aria-pressed="${active ? "true" : "false"}">
                      <th scope="row" class="comune-office-table__name">${escapeHtml(getTitle(office))}</th>
                      <td>${escapeHtml(functionLabel || "—")}</td>
                      <td class="comune-office-table__num">${persons}</td>
                      <td class="comune-office-table__num">${services}</td>
                      <td>${escapeHtml(themesForOffice.join(" · ") || "—")}</td>
                    </tr>
                  `;
                })
                .join("")}
            </tbody>
          </table>
        </div>
      </article>
      <article class="comune-panel comune-detail">
        ${renderOfficeDetail(viewState.selectedOfficeId)}
      </article>
    </section>
  `;
}

function renderOfficeDetail(officeId) {
  const office = store.index.get(officeId);
  if (!office) {
    return '<p class="comune-empty">Seleziona un ufficio dall\'elenco.</p>';
  }

  const persons = store.personsByOffice.get(officeId) ?? [];
  const services = store.servicesByOffice.get(officeId) ?? [];
  const contact = getContactForOffice(office);
  const geo = resolveOfficeGeo(office);
  const themes = store.themesByOffice.get(officeId) ?? [];

  return `
    <h3><button type="button" class="comune-node-link" data-node-id="${escapeHtml(officeId)}">${escapeHtml(getTitle(office))}</button></h3>
    <p class="comune-detail__meta">${escapeHtml(normalizeLiteral(office["cov:mainFunction"] || office["l0:description"]))}</p>
    <div class="comune-kv">
      ${renderKv("Temi", themes.join(" · ") || "—")}
      ${renderKv("Sede", geo?.title || "—")}
      ${renderKv("Telefono", contact?.phone || "—")}
      ${renderKv("Email", contact?.email || "—")}
    </div>
    <div class="comune-related">
      <h4>Persone (${persons.length})</h4>
      <div class="comune-chip-row">
        ${
          persons.length
            ? persons
                .sort((a, b) => getTitle(a).localeCompare(getTitle(b), "it"))
                .map(
                  (person) =>
                    `<button type="button" class="comune-chip comune-chip--clickable" data-node-id="${escapeHtml(person["@id"])}">${escapeHtml(getTitle(person))}</button>`,
                )
                .join("")
            : '<span class="comune-chip">Nessuna persona collegata</span>'
        }
      </div>
    </div>
    <div class="comune-related">
      <h4>Servizi collegati (${services.length})</h4>
      <div class="comune-chip-row">
        ${
          services.length
            ? services
                .slice(0, 12)
                .map(
                  (service) =>
                    `<button type="button" class="comune-chip comune-chip--clickable comune-chip--service" data-node-id="${escapeHtml(service["@id"])}">${escapeHtml(getTitle(service))}</button>`,
                )
                .join("") +
              (services.length > 12 ? `<span class="comune-chip">+${services.length - 12} altri</span>` : "")
            : '<span class="comune-chip">Nessun servizio collegato</span>'
        }
      </div>
    </div>
  `;
}

function renderServizi() {
  const statuses = [...new Set(store.services.map((service) => service["cpsv:status"]).filter(Boolean))].sort();
  const services = filterServices();
  const selectedService = store.index.get(viewState.selectedServiceId);
  const ioLayout = buildServiceIoLayout({
    service: selectedService,
    index: store.index,
    getTitle,
    refId,
    refIds,
  });

  return `
    <section class="comune-view">
      <div class="comune-split">
        <article class="comune-panel">
          <h2 class="comune-section-title">Servizi</h2>
          <div class="comune-toolbar">
            <label class="field">
              <span class="field__label">Cerca servizio</span>
              <input type="search" data-search value="${escapeHtml(viewState.search)}" placeholder="Titolo o descrizione" />
            </label>
            <label class="field">
              <span class="field__label">Stato</span>
              <select data-status-filter>
                <option value="all">Tutti gli stati</option>
                ${statuses.map((status) => `<option value="${escapeHtml(status)}" ${viewState.statusFilter === status ? "selected" : ""}>${escapeHtml(status)}</option>`).join("")}
              </select>
            </label>
          </div>
          <ul class="comune-list">
            ${services
              .map((service) => {
                const serviceId = service["@id"];
                const active = serviceId === viewState.selectedServiceId ? "is-active" : "";
                const office = store.index.get(refId(service["cov:hasOrganization"]));
                return `
                  <li>
                    <button type="button" class="comune-list__item ${active}" data-service-id="${escapeHtml(serviceId)}">
                      <span class="comune-list__title">${escapeHtml(getTitle(service))}</span>
                      <span class="comune-list__meta">${escapeHtml(office ? getTitle(office) : "Ufficio non indicato")}</span>
                    </button>
                  </li>
                `;
              })
              .join("")}
          </ul>
        </article>
        <article class="comune-panel comune-detail">
          ${renderServiceDetail(viewState.selectedServiceId)}
        </article>
      </div>
      <article class="comune-panel comune-panel--special">
        <h3 class="comune-section-title">Flusso input → servizio → output</h3>
        <p class="comune-section-intro">
          Vista dedicata CPSV: a sinistra gli <code>cpsv:Input</code>, al centro il servizio,
          a destra gli <code>cpsv:producesOutput</code>.
        </p>
        <div class="comune-special-stage comune-special-stage--io">
          ${renderServiceIoSvg(ioLayout, {
            selectedNodeId: viewState.selectedNodeId,
            expandedNodeIds: viewState.expandedIoNodes,
            escapeHtml,
          })}
        </div>
      </article>
    </section>
  `;
}

function renderServiceDetail(serviceId) {
  const service = store.index.get(serviceId);
  if (!service) {
    return '<p class="comune-empty">Seleziona un servizio dall\'elenco.</p>';
  }

  const officeIds = refIds(service["cov:hasOrganization"]);
  const offices = officeIds.map((id) => store.index.get(id)).filter(Boolean);
  const channel = store.index.get(refId(service["cpsv:hasChannel"]));
  const contact = store.index.get(refId(service["cov:hasContactPoint"]));
  const place = store.index.get(refId(service["cpsv:isPhysicallyAvailableAt"]));

  return `
    <h3><button type="button" class="comune-node-link" data-node-id="${escapeHtml(serviceId)}">${escapeHtml(getTitle(service))}</button></h3>
    <p class="comune-detail__meta">${escapeHtml(normalizeLiteral(service["dct:description"] || service["l0:description"]))}</p>
    <div class="comune-kv">
      ${renderKv("Stato", service["cpsv:status"] || "—")}
      ${renderKv(
        "Ufficio",
        offices.length
          ? offices
              .map(
                (office) =>
                  `<button type="button" class="comune-node-link" data-goto-organigramma-office="${escapeHtml(office["@id"])}">${escapeHtml(getTitle(office))}</button>`,
              )
              .join(" · ")
          : "—",
        true,
      )}
      ${renderKv("Canale", channel ? `${getTitle(channel)} (${channel["sm:URL"] || "URL non disponibile"})` : "—")}
      ${renderKv("Contatti", contact ? `${contact["sm:telephone"] || ""} ${normalizeLiteral(contact["sm:email"])}`.trim() : "—")}
      ${renderKv("Luogo", place ? getTitle(place) : "—")}
      ${renderKv("Documentazione", normalizeLiteral(service["cpsv:referenceDoc"]) || "—")}
    </div>
  `;
}

function renderEventDetail(eventId) {
  const event = store.events.find((entry) => entry.id === eventId);
  if (!event) {
    return '<p class="comune-empty">Seleziona un evento dall\'elenco o dalla mappa.</p>';
  }

  const placeId = event.geo?.poiId || refId(event.node["cpev:takesPlaceIn"]);
  const place = placeId ? store.index.get(placeId) : null;
  const office = event.officeId ? store.index.get(event.officeId) : null;

  return `
    <h3><button type="button" class="comune-node-link" data-node-id="${escapeHtml(event.id)}">${escapeHtml(event.title)}</button></h3>
    <p class="comune-detail__meta">${escapeHtml(event.abstract || "Nessuna descrizione disponibile.")}</p>
    <div class="comune-kv">
      ${renderKv("Periodo", formatDateRange(event.start, event.end))}
      ${renderKv(
        "Luogo",
        place
          ? `<button type="button" class="comune-node-link" data-goto-luoghi-poi="${escapeHtml(placeId)}">${escapeHtml(getTitle(place))}</button>`
          : "—",
        true,
      )}
      ${renderKv(
        "Ufficio",
        office
          ? `<button type="button" class="comune-node-link" data-goto-organigramma-office="${escapeHtml(office["@id"])}">${escapeHtml(getTitle(office))}</button>`
          : "—",
        true,
      )}
      ${renderKv("Coordinate", event.geo ? `${event.geo.lat.toFixed(5)}, ${event.geo.lng.toFixed(5)}` : "—")}
    </div>
  `;
}

function renderEventsListPanel(events) {
  return `
    <article class="comune-panel">
      <h2 class="comune-section-title">Eventi</h2>
        <p class="comune-section-intro">${events.filter((event) => event.geo).length} eventi geolocalizzati su ${events.length} totali. La mappa segue il mese visualizzato nel calendario.</p>
      <label class="field">
        <span class="field__label">Cerca evento</span>
        <input type="search" data-search value="${escapeHtml(viewState.search)}" placeholder="Titolo o luogo" />
      </label>
      <ul class="comune-list">
        ${events
          .map((event) => {
            const active = event.id === viewState.selectedEventId ? "is-active" : "";
            return `
              <li>
                <button type="button" class="comune-list__item ${active}" data-event-id="${escapeHtml(event.id)}">
                  <span class="comune-list__title">${escapeHtml(event.title)}</span>
                  <span class="comune-list__meta">${escapeHtml(formatDateRange(event.start, event.end))}${event.geo ? ` · ${escapeHtml(event.geo.placeTitle || event.geo.title)}` : " · senza coordinate"}</span>
                </button>
              </li>
            `;
          })
          .join("")}
      </ul>
    </article>
  `;
}

function getEventiCalendarMonthKey() {
  return viewState.calendarMonth ?? resolveCalendarMonthKey(null, store.events);
}

function filterEventsForMap() {
  const monthKey = getEventiCalendarMonthKey();
  return store.events.filter(
    (event) => event.geo && eventOccursInMonth(event, monthKey),
  );
}

function renderEventi() {
  const events = filterEvents();
  const calendarEvents = store.events;
  const monthKey = getEventiCalendarMonthKey();
  const monthEventCount = countEventsInMonth(calendarEvents, monthKey);
  const monthMapCount = filterEventsForMap().length;

  return `
    <section class="comune-view comune-split comune-split--geo">
      ${renderEventsListPanel(events)}
      <article class="comune-panel comune-detail">
        ${renderEventDetail(viewState.selectedEventId)}
      </article>
      <div class="comune-events-geo">
        <div class="comune-panel comune-panel--map">
          <div id="comune-map" class="comune-map" role="application" aria-label="Mappa eventi"></div>
        </div>
        <article class="comune-panel comune-panel--calendar">
          <div class="event-calendar__header">
            <button type="button" class="event-calendar__nav" data-calendar-nav="prev" aria-label="Mese precedente">←</button>
            <div class="event-calendar__heading">
              <h3 class="event-calendar__month">${escapeHtml(formatCalendarMonthLabel(monthKey))}</h3>
              <p class="event-calendar__summary">${monthEventCount} eventi in questo mese · ${monthMapCount} sulla mappa</p>
            </div>
            <button type="button" class="event-calendar__nav" data-calendar-nav="next" aria-label="Mese successivo">→</button>
          </div>
          ${renderEventCalendar({
            events: calendarEvents,
            monthKey,
            selectedEventId: viewState.selectedEventId,
            escapeHtml,
          })}
        </article>
      </div>
    </section>
  `;
}

function renderPoiDetail(poiId) {
  const poi = store.pois.find((entry) => entry.id === poiId);
  const poiNode = store.index.get(poiId);
  if (!poi && !poiNode) {
    return '<p class="comune-empty">Seleziona un luogo dall\'elenco o dalla mappa.</p>';
  }

  const title = poi?.title || getTitle(poiNode);
  const description = poi?.description || normalizeLiteral(poiNode?.["poi:POIdescription"] || poiNode?.["l0:description"]);
  const geo = poi?.geo || (poiNode ? resolvePoiGeo(poiNode) : null);
  const events = store.eventsByPoi.get(poiId) || [];

  return `
    <h3><button type="button" class="comune-node-link" data-node-id="${escapeHtml(poiId)}">${escapeHtml(title)}</button></h3>
    <p class="comune-detail__meta">${escapeHtml(description || "Nessuna descrizione disponibile.")}</p>
    <div class="comune-kv">
      ${renderKv("Indirizzo", geo?.address || "—")}
      ${renderKv("Coordinate", geo ? `${geo.lat.toFixed(5)}, ${geo.lng.toFixed(5)}` : "—")}
      ${renderKv(
        "Eventi",
        events.length
          ? `<ul class="comune-related-list">${events
              .map(
                (event) => `
                  <li>
                    <button type="button" class="comune-node-link" data-goto-eventi-event="${escapeHtml(event.id)}">${escapeHtml(event.title)}</button>
                    <span class="comune-related-list__meta">${escapeHtml(formatDateRange(event.start, event.end))}</span>
                  </li>
                `,
              )
              .join("")}</ul>`
          : "Nessun evento collegato",
        true,
      )}
    </div>
  `;
}

function renderLuoghi() {
  const pois = filterPois();

  return `
    <section class="comune-view comune-split comune-split--geo">
      <article class="comune-panel">
        <h2 class="comune-section-title">Luoghi</h2>
        <p class="comune-section-intro">Punti di interesse con coordinate da <code>clv:Feature</code>.</p>
        <label class="field">
          <span class="field__label">Cerca luogo</span>
          <input type="search" data-search value="${escapeHtml(viewState.search)}" placeholder="Nome o descrizione" />
        </label>
        <ul class="comune-list">
          ${pois
            .map((poi) => {
              const active = poi.id === viewState.selectedPoiId ? "is-active" : "";
              const eventCount = store.eventsByPoi.get(poi.id)?.length ?? 0;
              return `
                <li>
                  <button type="button" class="comune-list__item ${active}" data-poi-id="${escapeHtml(poi.id)}">
                    <span class="comune-list__title">${escapeHtml(poi.title)}</span>
                    <span class="comune-list__meta">${escapeHtml(poi.description || poi.geo.title || "Luogo")}${eventCount ? ` · ${eventCount} event${eventCount === 1 ? "o" : "i"}` : ""}</span>
                  </button>
                </li>
              `;
            })
            .join("")}
        </ul>
      </article>
      <article class="comune-panel comune-detail">
        ${renderPoiDetail(viewState.selectedPoiId)}
      </article>
      <div class="comune-panel comune-panel--map">
        <div id="comune-map" class="comune-map" role="application" aria-label="Mappa luoghi"></div>
      </div>
    </section>
  `;
}

function selectEventItem(eventId, { scrollList = false } = {}) {
  viewState.selectedEventId = eventId;
  viewState.calendarMonth = resolveCalendarMonthKey(eventId, store.events);
  selectGraphNode(eventId, { scroll: true, syncViewSelection: false, updateUrl: false });
  updatePermalink({ replace: false });
  renderCurrentView();
  if (scrollList) scrollThematicListItem(eventId, "eventId");
}

function selectPoiItem(poiId, { scrollList = false } = {}) {
  viewState.selectedPoiId = poiId;
  selectGraphNode(poiId, { scroll: true, syncViewSelection: false, updateUrl: false });
  updatePermalink({ replace: false });
  renderCurrentView();
  if (scrollList) scrollThematicListItem(poiId, "poiId");
}

function buildMapPopupHtml(item) {
  const isEvent = viewState.current === "eventi";
  const idAttr = isEvent ? "data-event-id" : "data-poi-id";
  const meta = isEvent
    ? formatDateRange(item.start, item.end)
    : item.description || item.geo.title || "";
  let crossLinks = "";

  if (isEvent && item.geo?.poiId) {
    const place = store.index.get(item.geo.poiId);
    crossLinks = `
      <button type="button" class="map-popup__link" data-goto-luoghi-poi="${escapeHtml(item.geo.poiId)}">
        Luogo: ${escapeHtml(place ? getTitle(place) : item.geo.placeTitle || "Apri scheda")}
      </button>
    `;
  } else if (!isEvent) {
    const events = store.eventsByPoi.get(item.id) || [];
    if (events.length) {
      crossLinks = `
        <div class="map-popup__links">
          ${events
            .slice(0, 3)
            .map(
              (event) => `
                <button type="button" class="map-popup__link" data-goto-eventi-event="${escapeHtml(event.id)}">
                  ${escapeHtml(event.title)}
                </button>
              `,
            )
            .join("")}
          ${events.length > 3 ? `<span class="map-popup__more">+${events.length - 3} eventi</span>` : ""}
        </div>
      `;
    }
  }

  return `
    <div class="map-popup">
      <button type="button" class="map-popup__title" ${idAttr}="${escapeHtml(item.id)}">
        ${escapeHtml(item.title)}
      </button>
      ${meta ? `<p class="map-popup__meta">${escapeHtml(meta)}</p>` : ""}
      ${crossLinks}
    </div>
  `;
}

function bindMapPopupClicks(mapEl) {
  if (mapEl.dataset.popupClicksBound) return;
  mapEl.dataset.popupClicksBound = "1";
  mapEl.addEventListener("click", (event) => {
    const gotoPoi = event.target.closest("[data-goto-luoghi-poi]");
    if (gotoPoi) {
      event.stopPropagation();
      goToLuoghiPoi(gotoPoi.dataset.gotoLuoghiPoi);
      return;
    }

    const gotoEvent = event.target.closest("[data-goto-eventi-event]");
    if (gotoEvent) {
      event.stopPropagation();
      goToEventiEvent(gotoEvent.dataset.gotoEventiEvent);
      return;
    }

    const titleBtn = event.target.closest(".map-popup__title");
    if (!titleBtn) return;
    event.stopPropagation();
    if (viewState.current === "eventi" && titleBtn.dataset.eventId) {
      selectEventItem(titleBtn.dataset.eventId, { scrollList: true });
    } else if (viewState.current === "luoghi" && titleBtn.dataset.poiId) {
      selectPoiItem(titleBtn.dataset.poiId, { scrollList: true });
    }
  });
}

function initMapForCurrentView() {
  const mapEl = document.querySelector("#comune-map");
  if (!mapEl || typeof L === "undefined") return;
  bindMapPopupClicks(mapEl);

  const items =
    viewState.current === "eventi" ? filterEventsForMap() : filterPois();

  const defaultCenter = items[0]?.geo ?? { lat: 46.07, lng: 11.12 };
  viewState.map = L.map(mapEl, { scrollWheelZoom: true }).setView(
    [defaultCenter.lat, defaultCenter.lng],
    12,
  );

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(viewState.map);

  viewState.mapCluster = L.markerClusterGroup();
  const markerById = new Map();

  for (const item of items) {
    const geo = item.geo;
    if (!geo) continue;
    const marker = L.marker([geo.lat, geo.lng], {
      title: item.title,
    });
    marker.bindPopup(buildMapPopupHtml(item));
    markerById.set(item.id, marker);
    viewState.mapCluster.addLayer(marker);
  }

  viewState.map.addLayer(viewState.mapCluster);
  viewState.markerById = markerById;

  const selectedId =
    viewState.current === "eventi" ? viewState.selectedEventId : viewState.selectedPoiId;
  const selectedMarker = markerById.get(selectedId);

  if (selectedMarker) {
    focusSelectedMarker();
  } else if (viewState.mapCluster.getLayers().length) {
    viewState.map.fitBounds(viewState.mapCluster.getBounds().pad(0.08));
  } else if (viewState.current === "eventi") {
    viewState.map.setView([46.07, 11.12], 12);
  }
}

function focusSelectedMarker() {
  if (!viewState.map || !viewState.markerById) return;
  const selectedId =
    viewState.current === "eventi" ? viewState.selectedEventId : viewState.selectedPoiId;
  const marker = viewState.markerById.get(selectedId);
  if (!marker) return;
  const latLng = marker.getLatLng();
  viewState.map.invalidateSize();
  viewState.map.flyTo(latLng, 15, { duration: 0.45 });
  marker.openPopup();
}

function destroyMap() {
  if (viewState.map) {
    viewState.map.remove();
    viewState.map = null;
    viewState.mapCluster = null;
    viewState.markerById = null;
  }
}

function filterPersons() {
  return [...store.persons]
    .filter((person) => {
      const officeId = refId(person["cov:hasOrganization"]);
      const matchesOffice =
        viewState.officeFilter === "all" || officeId === viewState.officeFilter;
      const office = officeId ? store.index.get(officeId) : null;
      const haystack = [
        getTitle(person),
        person["cpv:givenName"],
        person["cpv:familyName"],
        office ? getTitle(office) : "",
      ]
        .map((value) => String(value || "").toLowerCase())
        .join(" ");
      const matchesSearch = !viewState.search || haystack.includes(viewState.search);
      return matchesOffice && matchesSearch;
    })
    .sort((a, b) => getTitle(a).localeCompare(getTitle(b), "it"));
}

function filterOffices() {
  return [...store.offices]
    .filter((office) => {
      const officeId = office["@id"];
      const themes = store.themesByOffice.get(officeId) ?? [];
      const matchesTheme =
        viewState.themeFilter === "all" || themes.includes(viewState.themeFilter);
      const haystack = [
        getTitle(office),
        office["cov:mainFunction"],
        office["l0:description"],
        ...themes,
      ]
        .map((value) => String(value || "").toLowerCase())
        .join(" ");
      const matchesSearch = !viewState.search || haystack.includes(viewState.search);
      return matchesTheme && matchesSearch;
    })
    .sort((a, b) => getTitle(a).localeCompare(getTitle(b), "it"));
}

function filterServices() {
  return [...store.services]
    .filter((service) => {
      const matchesStatus =
        viewState.statusFilter === "all" || service["cpsv:status"] === viewState.statusFilter;
      const office = store.index.get(refId(service["cov:hasOrganization"]));
      const haystack = [
        getTitle(service),
        service["dct:description"],
        service["l0:description"],
        office ? getTitle(office) : "",
      ]
        .map((value) => String(value || "").toLowerCase())
        .join(" ");
      const matchesSearch = !viewState.search || haystack.includes(viewState.search);
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => getTitle(a).localeCompare(getTitle(b), "it"));
}

function filterEvents() {
  return store.events.filter((event) => {
    const haystack = [
      event.title,
      event.abstract,
      event.geo?.placeTitle,
      event.geo?.title,
    ]
      .map((value) => String(value || "").toLowerCase())
      .join(" ");
    return !viewState.search || haystack.includes(viewState.search);
  });
}

function filterPois() {
  return store.pois.filter((poi) => {
    const haystack = [poi.title, poi.description, poi.geo?.title]
      .map((value) => String(value || "").toLowerCase())
      .join(" ");
    return !viewState.search || haystack.includes(viewState.search);
  });
}

function getContactForOffice(office) {
  const contact = store.index.get(refId(office["cov:hasContactPoint"]));
  if (!contact) return null;
  return {
    phone: contact["sm:telephone"] || "",
    email: normalizeLiteral(contact["sm:email"]),
  };
}

function resolveOfficeGeo(office) {
  const coverageId = refId(office["clv:hasSpatialCoverage"]);
  return coverageId ? resolveFeatureGeo(coverageId) : null;
}

function resolvePoiGeo(poi) {
  const coverageId = refId(poi["clv:hasSpatialCoverage"]);
  return coverageId ? resolveFeatureGeo(coverageId) : null;
}

function resolveEventGeo(event) {
  const placeId = refId(event["cpev:takesPlaceIn"]);
  if (!placeId) return null;
  const poi = store.index.get(placeId);
  if (!poi) return null;
  const geo = resolvePoiGeo(poi);
  if (!geo) return null;
  return { ...geo, placeTitle: getTitle(poi), poiId: placeId };
}

function resolveFeatureGeo(featureId) {
  const feature = store.index.get(featureId);
  if (!feature) return null;
  const lat = parseFloat(feature["clv:lat"]);
  const lng = parseFloat(feature["clv:long"]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  const addressNode = store.index.get(refId(feature["clv:hasAddress"]));
  return {
    lat,
    lng,
    title: getTitle(feature),
    address: addressNode?.["clv:officialStreetName"] || "",
    id: featureId,
  };
}

function renderKv(key, value, allowHtml = false) {
  const rendered = allowHtml ? String(value || "—") : escapeHtml(String(value || "—"));
  return `
    <div class="comune-kv__row">
      <div class="comune-kv__key">${escapeHtml(key)}</div>
      <div class="comune-kv__value">${rendered}</div>
    </div>
  `;
}

function renderEmptyState() {
  ui.viewRoot.innerHTML = `
    <section class="comune-view">
      <article class="comune-panel">
        <h2 class="comune-section-title">Carica un grafo JSON-LD</h2>
        <p class="comune-section-intro">
          Nessun dato in memoria. Usa il pulsante <strong>Carica grafo</strong>
          per selezionare un file <code>.json</code> o <code>.jsonld</code> con il grafo
          del comune. I dati restano nel browser e non vengono inviati a server esterni.
        </p>
      </article>
    </section>
  `;
}

function renderStatsEmpty() {
  ui.statsPanel.innerHTML = `
    <article class="stat-card">
      <span class="stat-card__value">—</span>
      <span class="stat-card__label">In attesa di un grafo JSON-LD</span>
    </article>
  `;
}

function refId(value) {
  const ids = refIds(value);
  return ids[0] ?? null;
}

function refIds(value) {
  if (!value) return [];
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) {
    return value.flatMap((entry) => refIds(entry));
  }
  if (typeof value === "object" && typeof value["@id"] === "string") {
    return [value["@id"]];
  }
  return [];
}

function getTitle(node) {
  const candidates = [
    node["dct:title"],
    node["cpev:eventTitle"],
    node["poi:POIofficialName"],
    node["foaf:name"],
  ];
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }
  return getLastSegment(node["@id"]);
}

function normalizeLiteral(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => normalizeLiteral(entry)).filter(Boolean).join(" • ");
  }
  if (value && typeof value === "object") {
    if (typeof value["@value"] === "string") return value["@value"];
    return "";
  }
  if (value == null) return "";
  return String(value).trim();
}

function formatDateRange(start, end) {
  if (!start && !end) return "Data non indicata";
  if (start && end && start !== end) return `${start} → ${end}`;
  return start || end;
}

function humanizePredicate(predicate) {
  const noPrefix = predicate.includes(":") ? predicate.split(":")[1] : predicate;
  return noPrefix
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getLastSegment(uri) {
  return uri
    .replace(/[#/]+$/, "")
    .split(/[#/]/)
    .filter(Boolean)
    .pop();
}

function showStatus(message) {
  ui.appStatus.textContent = message;
  ui.appStatus.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    ui.appStatus.classList.remove("is-visible");
  }, 2800);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
