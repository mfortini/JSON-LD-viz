export const PERMALINK_VIEWS = [
  "panoramica",
  "organigramma",
  "persone",
  "uffici",
  "servizi",
  "eventi",
  "luoghi",
];

export function parsePermalink(hash) {
  const raw = (hash || "").replace(/^#/, "").trim();
  if (!raw) {
    return { view: "panoramica", itemId: null, nodeId: null };
  }

  const queryIndex = raw.indexOf("?");
  const viewPart = queryIndex >= 0 ? raw.slice(0, queryIndex) : raw;
  const view = PERMALINK_VIEWS.includes(viewPart) ? viewPart : "panoramica";
  let itemId = null;
  let nodeId = null;

  if (queryIndex >= 0) {
    const params = new URLSearchParams(raw.slice(queryIndex + 1));
    itemId = params.get("id");
    nodeId = params.get("node");
  }

  return { view, itemId, nodeId };
}

export function buildPermalinkUrl(view, itemId, nodeId) {
  const safeView = PERMALINK_VIEWS.includes(view) ? view : "panoramica";
  const params = new URLSearchParams();
  if (itemId) params.set("id", itemId);
  if (nodeId && nodeId !== itemId) params.set("node", nodeId);
  const query = params.toString();
  const base = `${window.location.pathname}${window.location.search}`;
  return `${base}#${safeView}${query ? `?${query}` : ""}`;
}

export function getPermalinkItemForView(view, state) {
  switch (view) {
    case "organigramma":
      return state.treeFocusedOfficeId;
    case "persone":
      return state.selectedPersonId;
    case "uffici":
      return state.selectedOfficeId;
    case "servizi":
      return state.selectedServiceId;
    case "eventi":
      return state.selectedEventId;
    case "luoghi":
      return state.selectedPoiId;
    default:
      return null;
  }
}

export function applyPermalinkToState(permalink, state, { hasNode }) {
  state.current = permalink.view;

  if (!permalink.itemId || !hasNode(permalink.itemId)) {
    return;
  }

  switch (permalink.view) {
    case "organigramma":
      state.treeFocusedOfficeId = permalink.itemId;
      state.selectedOfficeId = permalink.itemId;
      break;
    case "persone":
      state.selectedPersonId = permalink.itemId;
      break;
    case "uffici":
      state.selectedOfficeId = permalink.itemId;
      break;
    case "servizi":
      state.selectedServiceId = permalink.itemId;
      state.expandedIoNodes = new Set();
      break;
    case "eventi":
      state.selectedEventId = permalink.itemId;
      break;
    case "luoghi":
      state.selectedPoiId = permalink.itemId;
      break;
    default:
      break;
  }
}

export function resolveGraphNodeId(permalink, state, hasGraphNode) {
  if (permalink.nodeId && hasGraphNode(permalink.nodeId)) {
    return permalink.nodeId;
  }
  if (permalink.itemId && hasGraphNode(permalink.itemId)) {
    return permalink.itemId;
  }
  return state.selectedNodeId;
}
