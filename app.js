const TYPE_META = {
  "cov:PublicOrganization": {
    label: "Organizzazione",
    color: "#0059b3",
  },
  "cov:Office": {
    label: "Ufficio",
    color: "#0073e6",
  },
  "cpsv:PublicService": {
    label: "Servizio",
    color: "#00695c",
  },
  "cpsv:Input": {
    label: "Input",
    color: "#2e7d32",
  },
  "cpsv:Output": {
    label: "Output",
    color: "#558b2f",
  },
  "cpsv:ServiceProcessingTime": {
    label: "Tempo di lavorazione",
    color: "#7cb342",
  },
  "poi:PointOfInterest": {
    label: "Luogo",
    color: "#8e24aa",
  },
  "clv:Address": {
    label: "Indirizzo",
    color: "#ab47bc",
  },
  "clv:Feature": {
    label: "Feature geografica",
    color: "#6a1b9a",
  },
  "access:AccessCondition": {
    label: "Condizione di accesso",
    color: "#d81b60",
  },
  "cpev:PublicEvent": {
    label: "Evento",
    color: "#ef6c00",
  },
  "cpev:Audience": {
    label: "Pubblico",
    color: "#fb8c00",
  },
  "dcatapit:Dataset": {
    label: "Dataset",
    color: "#455a64",
  },
  "dcatapit:Distribution": {
    label: "Distribuzione",
    color: "#607d8b",
  },
  "foaf:Document": {
    label: "Documento",
    color: "#3949ab",
  },
  "cpv:Person": {
    label: "Persona",
    color: "#c62828",
  },
};

const GRAPH_FLOW_META = {
  incoming: {
    label: "Entranti",
    color: "#c62828",
  },
  outgoing: {
    label: "Uscenti",
    color: "#00796b",
  },
  neutral: {
    label: "Altre relazioni",
    color: "rgba(92, 111, 130, 0.35)",
  },
};

const PERSISTED_SOURCE_KEY = "semantic-graph:last-source";

const state = {
  raw: null,
  nodes: [],
  visibleNodes: [],
  links: [],
  filteredType: "all",
  searchText: "",
  selectedId: null,
  layoutCacheKey: null,
  layoutCache: null,
  animationDirection: "none",
  prefixMap: {},
  lastGraphClickTime: 0,
  lastGraphClickedNodeId: null,
};

const elements = {
  statsPanel: document.querySelector("#stats-panel"),
  typeFilter: document.querySelector("#type-filter"),
  typePills: document.querySelector("#type-pills"),
  resultsSummary: document.querySelector("#results-summary"),
  nodeList: document.querySelector("#node-list"),
  nodeDetail: document.querySelector("#node-detail"),
  graphLegend: document.querySelector("#graph-legend"),
  graphSvg: document.querySelector("#graph-svg"),
  searchInput: document.querySelector("#search-input"),
  filePicker: document.querySelector("#file-picker"),
  appStatus: document.querySelector("#app-status"),
  pasteBtn: document.querySelector("#paste-btn"),
  pasteDialog: document.querySelector("#paste-dialog"),
  pasteTextarea: document.querySelector("#paste-textarea"),
  pasteCancel: document.querySelector("#paste-cancel"),
  pasteConfirm: document.querySelector("#paste-confirm"),
};

let toastTimer = null;

boot();

function boot() {
  bindUi();
  const urlParams = new URLSearchParams(window.location.search);
  const dataToLoad = urlParams.get("data");

  if (dataToLoad) {
    loadFromData(dataToLoad);
  } else if (restorePersistedSource()) {
    return;
  } else if (elements.filePicker.files.length > 0) {
    handleFileLoad(elements.filePicker.files[0]);
  } else {
    showStatus(
      "Apri un file JSON-LD o incollane il codice per visualizzare il grafo semantico.",
    );
    renderEmptyState();
  }
}

async function handleFileLoad(file) {
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    initializeApp(data, "Codice caricato correttamente");
    persistSource(text);
    await storeDataInUrlIfSmall(text);
  } catch (error) {
    showStatus("Il file selezionato non sembra un JSON valido.");
    console.error(error);
  }
}

function bindUi() {
  elements.searchInput.addEventListener("input", (event) => {
    state.searchText = event.target.value.trim().toLowerCase();
    updateVisibleNodes();
    renderAll();
  });

  elements.typeFilter.addEventListener("change", (event) => {
    state.filteredType = event.target.value;
    updateVisibleNodes();
    ensureSelectionIsVisible();
    renderAll();
  });

  elements.filePicker.addEventListener("change", async (event) => {
    const [file] = event.target.files ?? [];
    if (!file) return;
    await handleFileLoad(file);
  });

  elements.pasteBtn.addEventListener("click", () => {
    elements.pasteTextarea.value = "";
    elements.pasteDialog.showModal();
  });

  elements.pasteCancel.addEventListener("click", () => {
    elements.pasteDialog.close();
  });

  elements.pasteConfirm.addEventListener("click", async () => {
    const text = elements.pasteTextarea.value.trim();
    if (!text) {
      elements.pasteDialog.close();
      return;
    }
    
    try {
      const data = JSON.parse(text);
      elements.pasteDialog.close();
      initializeApp(data, "Codice caricato correttamente");
      persistSource(text);
      await storeDataInUrlIfSmall(text);
    } catch (error) {
      alert("Il testo incollato non è un JSON valido.");
      console.error(error);
    }
  });

  window.addEventListener("resize", debounce(() => renderGraph(), 120));

  window.addEventListener("popstate", () => {
    const hashId = window.location.hash.slice(1);
    if (hashId && state.nodes.some((n) => n.id === hashId)) {
      state.selectedId = hashId;
      renderAll(false);
    }
  });
}

async function loadFromData(compressedData) {
  try {
    showStatus("Decompressione dei dati dall'URL...");
    const text = await decompressData(compressedData);
    const data = JSON.parse(text);
    initializeApp(data, "Dati caricati dall'URL");
    persistSource(text);
  } catch (error) {
    showStatus("Impossibile caricare i dati dall'URL. Formato non valido.");
    renderEmptyState();
    console.error(error);
  }
}

async function storeDataInUrlIfSmall(text) {
  showStatus("Compressione URL in corso...");
  const compressed = await compressData(text);
  const newUrl = new URL(window.location.href);
  
  if (compressed.length <= 8000) {
    newUrl.searchParams.set("data", compressed);
    window.history.replaceState(null, "", newUrl.toString());
    showStatus("Sorgente caricata e salvata nell'URL");
  } else {
    newUrl.searchParams.delete("data");
    window.history.replaceState(null, "", newUrl.toString());
    showStatus("Dati in memoria (sorgente troppo grande per condivisione link)");
  }
}

function persistSource(text) {
  try {
    const payload = JSON.stringify({
      text,
      savedAt: new Date().toISOString(),
    });
    window.localStorage.setItem(PERSISTED_SOURCE_KEY, payload);
  } catch (error) {
    console.warn("Impossibile salvare i dati nel browser.", error);
  }
}

function restorePersistedSource() {
  try {
    const stored = window.localStorage.getItem(PERSISTED_SOURCE_KEY);
    if (!stored) return false;

    const parsed = JSON.parse(stored);
    if (!parsed?.text) return false;

    const data = JSON.parse(parsed.text);
    initializeApp(data, "Dati ripristinati dall'archivio locale del browser");
    return true;
  } catch (error) {
    window.localStorage.removeItem(PERSISTED_SOURCE_KEY);
    console.warn("Archivio locale non valido, rimosso.", error);
    return false;
  }
}

async function compressData(jsonString) {
  const stream = new Blob([jsonString]).stream().pipeThrough(new CompressionStream("gzip"));
  const response = new Response(stream);
  const buffer = await response.arrayBuffer();
  
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function decompressData(base64str) {
  let b64 = base64str.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
  const response = new Response(stream);
  return await response.text();
}

function initializeApp(data, message) {
  const parsed = parseGraph(data);
  state.raw = data;
  state.prefixMap = buildPrefixMap(data["@context"]);
  state.nodes = parsed.nodes;
  state.links = parsed.links;
  state.filteredType = "all";
  state.searchText = "";
  
  const hashId = window.location.hash.slice(1);
  const isValidHash = parsed.nodes.some(n => n.id === hashId);
  state.selectedId = isValidHash ? hashId : (parsed.nodes[0]?.id ?? null);

  elements.searchInput.value = "";
  elements.typeFilter.value = "all";

  populateTypeFilter(parsed.typeCounts);
  updateVisibleNodes();
  renderLegend(parsed.typeCounts);
  renderAll();
  showStatus(message);
}

function parseGraph(data) {
  const graph = Array.isArray(data?.["@graph"]) ? data["@graph"] : [];
  const incoming = new Map();
  const links = [];

  for (const node of graph) {
    const source = node["@id"];
    for (const [predicate, value] of Object.entries(node)) {
      if (predicate === "@id" || predicate === "@type") continue;
      const relationTargets = extractRelationTargets(value);
      for (const target of relationTargets) {
        links.push({ source, target, predicate });
        if (!incoming.has(target)) {
          incoming.set(target, []);
        }
        incoming.get(target).push({ source, target, predicate });
      }
    }
  }

  const typeCounts = new Map();
  const nodes = graph.map((node) => {
    const rawType = node["@type"];
    const type = (Array.isArray(rawType) ? rawType[0] : rawType) || "Altro";
    typeCounts.set(type, (typeCounts.get(type) || 0) + 1);

    const outgoing = links.filter((link) => link.source === node["@id"]);
    const incomingLinks = incoming.get(node["@id"]) || [];

    return {
      id: node["@id"],
      type,
      title: getDisplayTitle(node),
      summary: getSummary(node),
      searchableText: buildSearchableText(node),
      raw: node,
      attributes: extractAttributes(node),
      outgoing,
      incoming: incomingLinks,
      degree: outgoing.length + incomingLinks.length,
    };
  });

  return { nodes, links, typeCounts };
}

function updateVisibleNodes() {
  state.visibleNodes = state.nodes.filter((node) => {
    const matchesType =
      state.filteredType === "all" || node.type === state.filteredType;
    const matchesSearch =
      !state.searchText || node.searchableText.includes(state.searchText);
    return matchesType && matchesSearch;
  });
}

function ensureSelectionIsVisible() {
  if (state.visibleNodes.some((node) => node.id === state.selectedId)) return;
  state.selectedId = state.visibleNodes[0]?.id ?? null;
}

function renderAll(pushHistory = false) {
  renderStats();
  renderTypePills();
  renderResultsSummary();
  renderNodeList();
  renderDetail();
  renderGraph();

  if (state.selectedId) {
    if (pushHistory) {
      window.history.pushState(null, "", `#${state.selectedId}`);
    } else {
      window.history.replaceState(null, "", `#${state.selectedId}`);
    }
  }
}

function scrollToDetailPanel() {
  requestAnimationFrame(() => {
    document
      .querySelector("#detail-panel")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function renderStats() {
  const uniqueTypes = new Set(state.nodes.map((node) => node.type)).size;
  const selectedNode = state.nodes.find((node) => node.id === state.selectedId);
  const stats = [
    { value: state.nodes.length, label: "Nodi nel grafo" },
    { value: state.links.length, label: "Relazioni estratte" },
    { value: uniqueTypes, label: "Tipi distinti" },
    {
      value: selectedNode ? selectedNode.degree : 0,
      label: selectedNode ? "Collegamenti del nodo attivo" : "Nessun nodo attivo",
    },
  ];

  elements.statsPanel.innerHTML = stats
    .map(
      (stat) => `
        <article class="stat-card">
          <span class="stat-card__value">${stat.value}</span>
          <span class="stat-card__label">${stat.label}</span>
        </article>
      `,
    )
    .join("");
}

function populateTypeFilter(typeCounts) {
  const options = [...typeCounts.entries()]
    .sort((a, b) => a[0].localeCompare(b[0], "it"))
    .map(
      ([type, count]) =>
        `<option value="${escapeHtml(type)}">${getTypeLabel(type)} (${count})</option>`,
    );

  elements.typeFilter.innerHTML = `
    <option value="all">Tutti i tipi</option>
    ${options.join("")}
  `;
}

function renderTypePills() {
  const counts = countVisibleByType();
  elements.typePills.innerHTML = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([type, count]) => {
      const isActive = state.filteredType === type;
      return `
        <button
          class="type-pill ${isActive ? "is-active" : ""}"
          type="button"
          data-type="${escapeHtml(type)}"
        >
          <span class="swatch" style="background:${getTypeColor(type)}"></span>
          <span>${getTypeLabel(type)}</span>
          <strong>${count}</strong>
        </button>
      `;
    })
    .join("");

  for (const button of elements.typePills.querySelectorAll(".type-pill")) {
    button.addEventListener("click", () => {
      const { type } = button.dataset;
      state.filteredType = state.filteredType === type ? "all" : type;
      elements.typeFilter.value = state.filteredType;
      updateVisibleNodes();
      ensureSelectionIsVisible();
      renderAll();
    });
  }
}

function renderResultsSummary() {
  const total = state.visibleNodes.length;
  const totalBase = state.nodes.length;
  elements.resultsSummary.textContent =
    total === totalBase
      ? `Stai vedendo tutti i ${totalBase} nodi del grafo.`
      : `Stai vedendo ${total} nodi su ${totalBase}.`;
}

function renderNodeList() {
  if (!state.visibleNodes.length) {
    elements.nodeList.innerHTML = `
      <li class="empty-state">
        Nessun risultato con i filtri attuali. Prova a cambiare tipo o parola chiave.
      </li>
    `;
    return;
  }

  elements.nodeList.innerHTML = state.visibleNodes
    .slice()
    .sort((a, b) => b.degree - a.degree || a.title.localeCompare(b.title, "it"))
    .map((node) => {
      const isSelected = node.id === state.selectedId;
      return `
        <li>
          <button
            type="button"
            class="entity-card ${isSelected ? "is-selected" : ""}"
            data-node-id="${escapeHtml(node.id)}"
            style="border-top-color:${getTypeColor(node.type)}"
          >
            <div class="entity-card__eyebrow">
              <span class="swatch" style="background:${getTypeColor(node.type)}"></span>
              <span>${getTypeLabel(node.type)}</span>
            </div>
            <h3 class="entity-card__title">${escapeHtml(node.title)}</h3>
            <p class="entity-card__summary">${escapeHtml(node.summary)}</p>
            <div class="entity-card__meta">
              <span class="meta-chip">${node.outgoing.length} link uscenti</span>
              <span class="meta-chip">${node.incoming.length} link entranti</span>
            </div>
          </button>
        </li>
      `;
    })
    .join("");

  for (const button of elements.nodeList.querySelectorAll(".entity-card")) {
    button.addEventListener("click", () => {
      state.selectedId = button.dataset.nodeId;
      renderAll(true);
      scrollToDetailPanel();
    });
  }
}

function renderDetail() {
  const node = state.nodes.find((entry) => entry.id === state.selectedId);

  if (!node) {
    elements.nodeDetail.className = "detail-empty";
    elements.nodeDetail.textContent =
      "Seleziona una scheda o un nodo nel grafo per vedere attributi e collegamenti.";
    return;
  }

  elements.nodeDetail.className = "";
  elements.nodeDetail.innerHTML = `
    <div class="smart-viewer">
      <div class="smart-column smart-column--incoming">
        <h4><span class="flow-chip flow-chip--incoming">${node.incoming.length} Entranti</span></h4>
        <div class="relation-cards">
          ${
            node.incoming.length
              ? node.incoming.map((relation) => renderRelationCard(relation, "incoming")).join("")
              : '<p class="panel__intro">Nessuna relazione entrante rilevata.</p>'
          }
        </div>
      </div>

      <div class="smart-column smart-column--current ${state.animationDirection === 'left' ? 'slide-from-left' : state.animationDirection === 'right' ? 'slide-from-right' : ''}">
        <div class="detail-header">
          <div class="detail-header__top">
            <div class="type-pill is-active" style="width:max-content">
              <span class="swatch" style="background:${getTypeColor(node.type)}"></span>
              <span>${getTypeLabel(node.type)}${renderLinkIcon(node.type)}</span>
            </div>
            <button type="button" class="source-toggle" data-source-id="__current__" title="Mostra sorgente JSON-LD">&lt;/&gt;</button>
          </div>
          <h3>${escapeHtml(node.title)}</h3>
          <p class="panel__intro">${escapeHtml(node.summary)}</p>
          <code><a href="${escapeHtml(node.id)}" target="_blank" rel="noopener noreferrer">${escapeHtml(node.id)}</a></code>
        </div>
        <div class="detail-sections">
          <section class="detail-box">
            <h4>Attributi</h4>
            <div class="kv-list">
              ${
                node.attributes.length
                  ? node.attributes.map(renderAttribute).join("")
                  : '<p class="panel__intro">Questo nodo espone quasi esclusivamente relazioni verso altri nodi.</p>'
              }
            </div>
          </section>
          <section class="detail-box source-box" hidden>
            <h4>Sorgente JSON-LD</h4>
            <pre class="source-pre">${escapeHtml(JSON.stringify(node.raw, null, 2))}</pre>
          </section>
        </div>
      </div>

      <div class="smart-column smart-column--outgoing">
        <h4><span class="flow-chip flow-chip--outgoing">${node.outgoing.length} Uscenti</span></h4>
        <div class="relation-cards">
          ${
            node.outgoing.length
              ? node.outgoing.map((relation) => renderRelationCard(relation, "outgoing")).join("")
              : '<p class="panel__intro">Nessuna relazione uscente rilevata.</p>'
          }
        </div>
      </div>
    </div>
  `;

  for (const card of elements.nodeDetail.querySelectorAll(".rel-card")) {
    card.addEventListener("click", (e) => {
      if (e.target.closest(".relation-button")) return;
      card.classList.toggle("is-expanded");
    });
  }

  // Source toggle for the current (center) node
  const sourceToggle = elements.nodeDetail.querySelector(".source-toggle[data-source-id='__current__']");
  const sourceBox = elements.nodeDetail.querySelector(".source-box");
  if (sourceToggle && sourceBox) {
    sourceToggle.addEventListener("click", () => {
      const isHidden = sourceBox.hasAttribute("hidden");
      if (isHidden) {
        sourceBox.removeAttribute("hidden");
        sourceToggle.classList.add("is-active");
      } else {
        sourceBox.setAttribute("hidden", "");
        sourceToggle.classList.remove("is-active");
      }
    });
  }

  // Source toggles for each rel-card
  for (const btn of elements.nodeDetail.querySelectorAll(".source-toggle--inline")) {
    const card = btn.closest(".rel-card");
    const panel = card?.querySelector(".rel-card__source");
    if (!panel) continue;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isHidden = panel.hasAttribute("hidden");
      if (isHidden) {
        panel.removeAttribute("hidden");
        btn.classList.add("is-active");
      } else {
        panel.setAttribute("hidden", "");
        btn.classList.remove("is-active");
      }
    });
  }

  for (const button of elements.nodeDetail.querySelectorAll(".relation-button")) {
    button.addEventListener("click", () => {
      const card = button.closest(".rel-card");
      if (card) {
        state.animationDirection = card.classList.contains("rel-card--incoming") ? "left" : "right";
      }
      state.selectedId = button.dataset.nodeId;
      renderAll(true);
      state.animationDirection = "none";
      scrollToDetailPanel();
    });
  }
}

function isUrl(value) {
  return /^https?:\/\//.test(value);
}

function buildPrefixMap(context) {
  const map = {};
  if (!context) return map;
  const contexts = Array.isArray(context) ? context : [context];
  for (const ctx of contexts) {
    if (ctx && typeof ctx === "object") {
      for (const [prefix, uri] of Object.entries(ctx)) {
        if (prefix.startsWith("@")) continue;
        if (typeof uri === "string" && isUrl(uri)) {
          map[prefix] = uri;
        }
      }
    }
  }
  return map;
}

function resolvePrefixedUri(value) {
  if (!value || isUrl(value)) return value;
  // Match prefix:localPart, but not absolute URIs like http://
  const match = /^([a-zA-Z][a-zA-Z0-9_-]*):([^/].*)$/.exec(value);
  if (!match) return value;
  const [, prefix, local] = match;
  const base = state.prefixMap[prefix];
  return base ? base + local : value;
}

function renderAttributeValue(value) {
  const resolved = resolvePrefixedUri(value);
  if (isUrl(resolved)) {
    return `<a href="${escapeHtml(resolved)}" target="_blank" rel="noopener noreferrer">${escapeHtml(resolved)}</a>`;
  }
  return escapeHtml(value);
}

function renderPredicateLink(predicate) {
  const label = escapeHtml(humanizePredicate(predicate));
  const uri = resolvePrefixedUri(predicate);
  const icon = isUrl(uri) ? ` <a href="${escapeHtml(uri)}" target="_blank" rel="noopener noreferrer" class="term-link-icon" title="${escapeHtml(uri)}">&#x1F517;</a>` : "";
  return `<span class="rel-card__predicate">${label}${icon}</span>`;
}

function renderLinkIcon(term) {
  const uri = resolvePrefixedUri(term);
  if (!isUrl(uri)) return "";
  return ` <a href="${escapeHtml(uri)}" target="_blank" rel="noopener noreferrer" class="term-link-icon" title="${escapeHtml(uri)}">&#x1F517;</a>`;
}

function renderAttribute(attribute) {
  return `
    <div class="kv-item">
      <div class="kv-key">${escapeHtml(humanizePredicate(attribute.key))}${renderLinkIcon(attribute.key)}</div>
      <div class="kv-value">${renderAttributeValue(attribute.value)}</div>
    </div>
  `;
}

function renderRelationCard(relation, direction) {
  const counterpartId = direction === "incoming" ? relation.source : relation.target;
  const counterpart = state.nodes.find((node) => node.id === counterpartId);
  const counterpartLabel = counterpart ? counterpart.title : counterpartId;
  const counterpartType = counterpart ? getTypeLabel(counterpart.type) : "Nodo esterno";
  const typeColor = counterpart ? getTypeColor(counterpart.type) : "#ccc";
  const counterpartSummary = counterpart ? escapeHtml(counterpart.summary) : "";
  const isIncoming = direction === "incoming";
  const cardClass = isIncoming ? "rel-card rel-card--incoming" : "rel-card rel-card--outgoing";
  const styleAttr = isIncoming 
    ? `border-right-color: ${typeColor}; border-left-color: var(--panel-border);`
    : `border-left-color: ${typeColor}; border-right-color: var(--panel-border);`;

  const sourceRaw = counterpart ? escapeHtml(JSON.stringify(counterpart.raw, null, 2)) : null;

  return `
    <div class="${cardClass}" style="${styleAttr}">
      <div class="rel-card__summary">
        ${isIncoming ? `
          <div class="rel-card__main">
            <div class="rel-card__header">
              <button type="button" class="relation-button rel-card__title" data-node-id="${escapeHtml(counterpartId)}">${escapeHtml(counterpartLabel)}</button>
              <span class="rel-card__type">${escapeHtml(counterpartType)}${counterpart ? renderLinkIcon(counterpart.type) : ""}</span>
            </div>
            ${counterpartSummary ? `<div class="rel-card__desc">${counterpartSummary}</div>` : ""}
          </div>
          <div class="rel-card__band">
            ${renderPredicateLink(relation.predicate)}
            ${sourceRaw ? `<button type="button" class="source-toggle source-toggle--inline" title="Sorgente JSON-LD">&lt;/&gt;</button>` : ""}
          </div>
        ` : `
          <div class="rel-card__band">
            ${renderPredicateLink(relation.predicate)}
            ${sourceRaw ? `<button type="button" class="source-toggle source-toggle--inline" title="Sorgente JSON-LD">&lt;/&gt;</button>` : ""}
          </div>
          <div class="rel-card__main" style="text-align: right;">
            <div class="rel-card__header">
              <button type="button" class="relation-button rel-card__title" data-node-id="${escapeHtml(counterpartId)}">${escapeHtml(counterpartLabel)}</button>
              <span class="rel-card__type">${escapeHtml(counterpartType)}${counterpart ? renderLinkIcon(counterpart.type) : ""}</span>
            </div>
            ${counterpartSummary ? `<div class="rel-card__desc">${counterpartSummary}</div>` : ""}
          </div>
        `}
      </div>
      ${sourceRaw ? `<div class="rel-card__source" hidden><pre class="source-pre">${sourceRaw}</pre></div>` : ""}
    </div>
  `;
}

function renderLegend(typeCounts) {
  const typeLegend = [...typeCounts.keys()]
    .sort((a, b) => a.localeCompare(b, "it"))
    .map(
      (type) => `
        <span class="legend-chip">
          <span class="swatch" style="background:${getTypeColor(type)}"></span>
          <span>${getTypeLabel(type)}</span>
        </span>
      `,
    )
    .join("");

  const flowLegend = Object.entries(GRAPH_FLOW_META)
    .map(
      ([key, meta]) => `
        <span class="legend-chip legend-chip--flow legend-chip--${key}">
          <span class="legend-line legend-line--${key}"></span>
          <span>${meta.label}</span>
        </span>
      `,
    )
    .join("");

  elements.graphLegend.innerHTML = `${flowLegend}${typeLegend}`;
}

function renderGraph() {
  const visibleIds = new Set(state.visibleNodes.map((node) => node.id));
  const graphNodes = state.visibleNodes.map((node) => ({ ...node }));
  const graphLinks = state.links.filter(
    (link) => visibleIds.has(link.source) && visibleIds.has(link.target),
  );

  if (!graphNodes.length) {
    elements.graphSvg.innerHTML = "";
    return;
  }

  const { width, height } = getGraphSize();
  const layout = computeLayout(graphNodes, graphLinks, width, height);
  const selectedId = state.selectedId;
  const highlightedIds = collectHighlightedIds(selectedId, graphLinks);

  const linkMarkup = graphLinks
    .map((link) => {
      const source = layout.nodeMap.get(link.source);
      const target = layout.nodeMap.get(link.target);
      const direction = getLinkDirection(link, selectedId);
      const highlighted = direction !== "neutral";
      const dimmed =
        selectedId && !highlightedIds.has(link.source) && !highlightedIds.has(link.target);
      return `
        <line
          class="graph-link graph-link--${direction} ${highlighted ? "is-highlighted" : ""} ${dimmed ? "is-dimmed" : ""}"
          x1="${source.x.toFixed(1)}"
          y1="${source.y.toFixed(1)}"
          x2="${target.x.toFixed(1)}"
          y2="${target.y.toFixed(1)}"
          marker-end="url(#arrow-${direction})"
          data-source-id="${escapeHtml(link.source)}"
          data-target-id="${escapeHtml(link.target)}"
        >
          <title>${escapeHtml(`${source.title} → ${humanizePredicate(link.predicate)} → ${target.title}`)}</title>
        </line>
      `;
    })
    .join("");

  const nodeMarkup = layout.nodes
    .map((node) => {
      const selected = node.id === selectedId;
      const dimmed = selectedId && !highlightedIds.has(node.id);
      const relationRole = getNodeRelationRole(node.id, selectedId, graphLinks);
      const radius = 8 + Math.min(node.degree, 8);
      const showLabel = selected || node.degree >= 4 || layout.nodes.length <= 18;
      return `
        <g class="graph-node graph-node--${relationRole} ${dimmed ? "is-dimmed" : ""}" data-node-id="${escapeHtml(node.id)}">
          <circle
            class="graph-node__circle ${selected ? "is-selected" : ""}"
            cx="${node.x.toFixed(1)}"
            cy="${node.y.toFixed(1)}"
            r="${radius}"
            fill="${getTypeColor(node.type)}"
          >
            <title>${escapeHtml(`${node.title} (${getTypeLabel(node.type)})`)}</title>
          </circle>
          ${
            showLabel
              ? `<text class="graph-node__label" x="${(node.x + radius + 6).toFixed(1)}" y="${(node.y + 4).toFixed(1)}">${escapeHtml(truncate(node.title, 34))}</text>`
              : ""
          }
        </g>
      `;
    })
    .join("");

  elements.graphSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  elements.graphSvg.innerHTML = `
    <defs>
      ${renderArrowMarkers()}
    </defs>
    <rect width="${width}" height="${height}" fill="transparent"></rect>
    ${linkMarkup}
    ${nodeMarkup}
  `;

  let draggedNodeId = null;
  let dragStartX = 0;
  let dragStartY = 0;
  let initialNodeX = 0;
  let initialNodeY = 0;
  let isDragging = false;

  const onMouseMove = (e) => {
    if (!draggedNodeId) return;
    isDragging = true;
    const svgRect = elements.graphSvg.getBoundingClientRect();
    const viewBox = elements.graphSvg.viewBox.baseVal;
    const scaleX = viewBox.width / svgRect.width;
    const scaleY = viewBox.height / svgRect.height;

    const dx = (e.clientX - dragStartX) * scaleX;
    const dy = (e.clientY - dragStartY) * scaleY;

    const node = layout.nodeMap.get(draggedNodeId);
    if (!node) return;

    node.x = initialNodeX + dx;
    node.y = initialNodeY + dy;

    // Update DOM directly for smooth drag
    const group = elements.graphSvg.querySelector(`.graph-node[data-node-id="${draggedNodeId}"]`);
    if (group) {
      const circle = group.querySelector("circle");
      if (circle) {
        circle.setAttribute("cx", node.x.toFixed(1));
        circle.setAttribute("cy", node.y.toFixed(1));
      }
      const text = group.querySelector("text");
      if (text) {
        const radius = 8 + Math.min(node.degree, 8);
        text.setAttribute("x", (node.x + radius + 6).toFixed(1));
        text.setAttribute("y", (node.y + 4).toFixed(1));
      }
    }

    // Update lines connected to this node
    const lines = elements.graphSvg.querySelectorAll("line.graph-link");
    for (const line of lines) {
      if (line.dataset.sourceId === draggedNodeId) {
        line.setAttribute("x1", node.x.toFixed(1));
        line.setAttribute("y1", node.y.toFixed(1));
      }
      if (line.dataset.targetId === draggedNodeId) {
        line.setAttribute("x2", node.x.toFixed(1));
        line.setAttribute("y2", node.y.toFixed(1));
      }
    }
  };

  const onMouseUp = () => {
    draggedNodeId = null;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
    setTimeout(() => { isDragging = false; }, 0);
  };

  for (const group of elements.graphSvg.querySelectorAll(".graph-node")) {
    group.addEventListener("mousedown", (e) => {
      draggedNodeId = group.dataset.nodeId;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      const node = layout.nodeMap.get(draggedNodeId);
      if (node) {
        initialNodeX = node.x;
        initialNodeY = node.y;
      }
      isDragging = false;
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      e.stopPropagation();
    });

    group.addEventListener("click", (e) => {
      if (isDragging) {
        e.stopPropagation();
        return;
      }
      
      const now = Date.now();
      const nodeId = group.dataset.nodeId;
      
      if (state.lastGraphClickedNodeId === nodeId && now - state.lastGraphClickTime < 400) {
        state.lastGraphClickTime = 0;
        scrollToDetailPanel();
        return;
      }
      
      state.lastGraphClickTime = now;
      state.lastGraphClickedNodeId = nodeId;
      
      state.selectedId = nodeId;
      renderAll(true);
      scrollToDetailPanel();
    });
  }
}

function computeLayout(nodes, links, width, height) {
  const cacheKey = nodes.map((n) => n.id).sort().join("|") + width + "x" + height;
  if (state.layoutCacheKey === cacheKey) {
    // Return cached layout so nodes don't move around when clicking a new active node
    return state.layoutCache;
  }

  const centerX = width / 2;
  const centerY = height / 2;
  const typeList = [...new Set(nodes.map((node) => node.type))];
  const typeCenters = new Map();

  typeList.forEach((type, index) => {
    const angle = (Math.PI * 2 * index) / Math.max(typeList.length, 1);
    typeCenters.set(type, {
      x: centerX + Math.cos(angle) * Math.min(width, height) * 0.24,
      y: centerY + Math.sin(angle) * Math.min(width, height) * 0.2,
    });
  });

  const nodeMap = new Map(
    nodes.map((node, index) => {
      const cluster = typeCenters.get(node.type);
      return [
        node.id,
        {
          ...node,
          x: cluster.x + Math.cos(index * 0.9) * 40,
          y: cluster.y + Math.sin(index * 1.1) * 36,
          vx: 0,
          vy: 0,
        },
      ];
    }),
  );

  for (let tick = 0; tick < 220; tick += 1) {
    for (const source of nodeMap.values()) {
      const cluster = typeCenters.get(source.type);
      source.vx += (cluster.x - source.x) * 0.0009;
      source.vy += (cluster.y - source.y) * 0.0009;
      source.vx += (centerX - source.x) * 0.00012;
      source.vy += (centerY - source.y) * 0.00012;
    }

    const values = [...nodeMap.values()];
    for (let i = 0; i < values.length; i += 1) {
      for (let j = i + 1; j < values.length; j += 1) {
        const a = values[i];
        const b = values[j];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let distanceSq = dx * dx + dy * dy;
        if (distanceSq < 1) distanceSq = 1;
        const force = 900 / distanceSq;
        dx /= Math.sqrt(distanceSq);
        dy /= Math.sqrt(distanceSq);
        a.vx -= dx * force;
        a.vy -= dy * force;
        b.vx += dx * force;
        b.vy += dy * force;
      }
    }

    for (const link of links) {
      const source = nodeMap.get(link.source);
      const target = nodeMap.get(link.target);
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const distance = Math.sqrt(dx * dx + dy * dy) || 1;
      const desired = 84;
      const force = (distance - desired) * 0.0034;
      const nx = dx / distance;
      const ny = dy / distance;
      source.vx += nx * force;
      source.vy += ny * force;
      target.vx -= nx * force;
      target.vy -= ny * force;
    }

    for (const node of nodeMap.values()) {
      node.vx *= 0.82;
      node.vy *= 0.82;
      node.x = clamp(node.x + node.vx, 32, width - 32);
      node.y = clamp(node.y + node.vy, 32, height - 32);
    }
  }

  const layout = { nodes: [...nodeMap.values()], nodeMap };
  state.layoutCacheKey = cacheKey;
  state.layoutCache = layout;
  return layout;
}

function collectHighlightedIds(selectedId, links) {
  if (!selectedId) {
    return new Set(state.visibleNodes.map((node) => node.id));
  }

  const highlighted = new Set([selectedId]);
  for (const link of links) {
    if (link.source === selectedId) highlighted.add(link.target);
    if (link.target === selectedId) highlighted.add(link.source);
  }
  return highlighted;
}

function getLinkDirection(link, selectedId) {
  if (!selectedId) return "neutral";
  if (link.source === selectedId) return "outgoing";
  if (link.target === selectedId) return "incoming";
  return "neutral";
}

function getNodeRelationRole(nodeId, selectedId, links) {
  if (!selectedId) return "neutral";
  if (nodeId === selectedId) return "selected";

  let hasIncoming = false;
  let hasOutgoing = false;
  for (const link of links) {
    if (link.source === selectedId && link.target === nodeId) hasOutgoing = true;
    if (link.target === selectedId && link.source === nodeId) hasIncoming = true;
  }

  if (hasIncoming && hasOutgoing) return "both";
  if (hasOutgoing) return "outgoing";
  if (hasIncoming) return "incoming";
  return "neutral";
}

function renderArrowMarkers() {
  return Object.entries(GRAPH_FLOW_META)
    .map(
      ([key, meta]) => `
        <marker
          id="arrow-${key}"
          markerWidth="10"
          markerHeight="10"
          refX="8"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L9,3 z" fill="${meta.color}"></path>
        </marker>
      `,
    )
    .join("");
}

function getGraphSize() {
  const box = elements.graphSvg.getBoundingClientRect();
  const width = Math.max(860, Math.round(box.width || 960));
  const height = width < 900 ? 540 : 640;
  return { width, height };
}

function renderEmptyState() {
  elements.statsPanel.innerHTML = `
    <article class="stat-card">
      <span class="stat-card__value">0</span>
      <span class="stat-card__label">Dati caricati</span>
    </article>
  `;
  elements.typePills.innerHTML = "";
  elements.graphLegend.innerHTML = "";
  elements.resultsSummary.textContent =
    "Apri manualmente un file JSON-LD per popolare la pagina.";
  elements.nodeList.innerHTML = `
    <li class="empty-state">
      Il browser non è riuscito a leggere automaticamente <code>comune.jsonld</code>.
      Questo succede spesso aprendo il file direttamente da disco. La pagina resta comunque pronta per l'upload manuale.
    </li>
  `;
  elements.nodeDetail.className = "detail-empty";
  elements.nodeDetail.innerHTML =
    "Dopo il caricamento vedrai qui gli attributi del nodo e le relazioni entranti e uscenti.";
  elements.graphSvg.innerHTML = "";
}

function countVisibleByType() {
  const counts = new Map();
  for (const node of state.visibleNodes) {
    counts.set(node.type, (counts.get(node.type) || 0) + 1);
  }
  return counts;
}

function getDisplayTitle(node) {
  const candidates = [
    node["dct:title"],
    node["l0:name"],
    node["foaf:name"],
    node["poi:POIofficialName"],
    node["cpev:eventTitle"],
    node["schema:name"],
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }

  return getLastSegment(node["@id"]);
}

function getSummary(node) {
  const candidates = [
    node["dct:description"],
    node["poi:POIdescription"],
    node["cpev:eventAbstract"],
    node["l0:description"],
    node["cpsv:referenceDoc"],
  ];

  for (const candidate of candidates) {
    const value = normalizeLiteral(candidate);
    if (value) return truncate(value, 190);
  }

  return "Nessuna descrizione sintetica disponibile.";
}

function buildSearchableText(node) {
  return Object.values(node)
    .flatMap((value) => flattenValue(value))
    .join(" ")
    .toLowerCase();
}

function extractAttributes(node) {
  const attributes = [];

  for (const [key, value] of Object.entries(node)) {
    if (key === "@id" || key === "@type") continue;
    if (extractRelationTargets(value).length) continue;
    const normalized = normalizeLiteral(value);
    if (!normalized) continue;
    attributes.push({ key, value: normalized });
  }

  return attributes;
}

function extractRelationTargets(value) {
  if (Array.isArray(value)) {
    return value.flatMap((entry) => extractRelationTargets(entry));
  }
  if (value && typeof value === "object" && typeof value["@id"] === "string") {
    return [value["@id"]];
  }
  return [];
}

function flattenValue(value) {
  if (Array.isArray(value)) {
    return value.flatMap((entry) => flattenValue(entry));
  }
  if (value && typeof value === "object") {
    if (typeof value["@id"] === "string") return [value["@id"]];
    return Object.values(value).flatMap((entry) => flattenValue(entry));
  }
  if (value == null) return [];
  return [String(value)];
}

function normalizeLiteral(value) {
  if (Array.isArray(value)) {
    return value
      .map((entry) => normalizeLiteral(entry))
      .filter(Boolean)
      .join(" • ");
  }
  if (value && typeof value === "object") {
    if (typeof value["@value"] === "string") return value["@value"];
    return "";
  }
  if (value == null) return "";
  return String(value).trim();
}

function humanizePredicate(predicate) {
  const noPrefix = predicate.includes(":") ? predicate.split(":")[1] : predicate;
  return noPrefix
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getTypeLabel(type) {
  return TYPE_META[type]?.label || humanizePredicate(type);
}

function getTypeColor(type) {
  return TYPE_META[type]?.color || "#5c6f82";
}

function getLastSegment(uri) {
  return uri
    .replace(/[#/]+$/, "")
    .split(/[#/]/)
    .filter(Boolean)
    .pop();
}

function truncate(text, limit) {
  if (text.length <= limit) return text;
  return `${text.slice(0, limit - 1).trimEnd()}…`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function debounce(fn, delay) {
  let timer = null;
  return (...args) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), delay);
  };
}

function showStatus(message) {
  elements.appStatus.textContent = message;
  elements.appStatus.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    elements.appStatus.classList.remove("is-visible");
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
