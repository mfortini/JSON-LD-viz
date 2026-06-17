export const TYPE_META = {
  "cov:PublicOrganization": { label: "Organizzazione", color: "#0059b3" },
  "cov:Office": { label: "Ufficio", color: "#0073e6" },
  "cpsv:PublicService": { label: "Servizio", color: "#00695c" },
  "cpsv:Input": { label: "Input", color: "#2e7d32" },
  "cpsv:Output": { label: "Output", color: "#558b2f" },
  "cpsv:ServiceProcessingTime": { label: "Tempo di lavorazione", color: "#7cb342" },
  "poi:PointOfInterest": { label: "Luogo", color: "#8e24aa" },
  "clv:Address": { label: "Indirizzo", color: "#ab47bc" },
  "clv:Feature": { label: "Feature geografica", color: "#6a1b9a" },
  "access:AccessCondition": { label: "Condizione di accesso", color: "#d81b60" },
  "cpev:PublicEvent": { label: "Evento", color: "#ef6c00" },
  "cpev:Audience": { label: "Pubblico", color: "#fb8c00" },
  "dcatapit:Dataset": { label: "Dataset", color: "#455a64" },
  "dcatapit:Distribution": { label: "Distribuzione", color: "#607d8b" },
  "foaf:Document": { label: "Documento", color: "#3949ab" },
  "cpv:Person": { label: "Persona", color: "#c62828" },
  "cov:ContactPoint": { label: "Contatto", color: "#1565c0" },
  "skos:Concept": { label: "Concetto", color: "#6d4c41" },
};

const GRAPH_FLOW_META = {
  incoming: { label: "Entranti", color: "#c62828" },
  outgoing: { label: "Uscenti", color: "#00796b" },
  neutral: { label: "Altre relazioni", color: "rgba(92, 111, 130, 0.35)" },
};

export function parseGraph(data) {
  const graph = Array.isArray(data?.["@graph"]) ? data["@graph"] : [];
  const incoming = new Map();
  const links = [];

  for (const node of graph) {
    const source = node["@id"];
    for (const [predicate, value] of Object.entries(node)) {
      if (predicate === "@id" || predicate === "@type") continue;
      for (const target of extractRelationTargets(value)) {
        links.push({ source, target, predicate });
        if (!incoming.has(target)) incoming.set(target, []);
        incoming.get(target).push({ source, target, predicate });
      }
    }
  }

  const typeCounts = new Map();
  const nodes = graph.map((node) => {
    const rawType = node["@type"];
    const type = (Array.isArray(rawType) ? rawType[0] : rawType) || "Altro";
    typeCounts.set(type, (typeCounts.get(type) || 0) + 1);
    const id = node["@id"];
    const outgoing = links.filter((link) => link.source === id);
    const incomingLinks = incoming.get(id) || [];
    return {
      id,
      type,
      title: getDisplayTitle(node),
      summary: getSummary(node),
      raw: node,
      attributes: extractAttributes(node),
      outgoing,
      incoming: incomingLinks,
      degree: outgoing.length + incomingLinks.length,
    };
  });

  return {
    nodes,
    links,
    typeCounts,
    prefixMap: buildPrefixMap(data?.["@context"]),
  };
}

export function extractNeighborhood(centerId, allNodes, allLinks, maxNodes = 56) {
  const nodeById = new Map(allNodes.map((node) => [node.id, node]));
  if (!nodeById.has(centerId)) {
    return { nodes: [], links: [] };
  }

  const included = new Set([centerId]);
  const queue = [centerId];

  while (queue.length && included.size < maxNodes) {
    const id = queue.shift();
    for (const link of allLinks) {
      let neighbor = null;
      if (link.source === id) neighbor = link.target;
      else if (link.target === id) neighbor = link.source;
      if (neighbor && !included.has(neighbor) && nodeById.has(neighbor)) {
        included.add(neighbor);
        queue.push(neighbor);
        if (included.size >= maxNodes) break;
      }
    }
  }

  const ids = included;
  return {
    nodes: [...ids].map((id) => nodeById.get(id)).filter(Boolean),
    links: allLinks.filter((link) => ids.has(link.source) && ids.has(link.target)),
  };
}

export class GraphExplorer {
  constructor({ detailEl, svgEl, legendEl, onSelect }) {
    this.detailEl = detailEl;
    this.svgEl = svgEl;
    this.legendEl = legendEl;
    this.onSelect = onSelect;
    this.allNodes = [];
    this.allLinks = [];
    this.nodes = [];
    this.links = [];
    this.nodeById = new Map();
    this.prefixMap = {};
    this.selectedId = null;
    this.animationDirection = "none";
    this.filterDetailToSubgraph = false;
    this.layoutCacheKey = null;
    this.layoutCache = null;
    this.lastGraphClickTime = 0;
    this.lastGraphClickedNodeId = null;
  }

  setData({ nodes, links, typeCounts, prefixMap }) {
    this.allNodes = nodes;
    this.allLinks = links;
    this.typeCounts = typeCounts;
    this.prefixMap = prefixMap || {};
    this.nodeById = new Map(nodes.map((node) => [node.id, node]));
    this.layoutCacheKey = null;
    this.layoutCache = null;
  }

  select(nodeId, { rerender = true, maxNodes = 56, filterDetailToSubgraph = false } = {}) {
    if (!this.nodeById.has(nodeId)) return false;
    this.selectedId = nodeId;
    const neighborhood = extractNeighborhood(nodeId, this.allNodes, this.allLinks, maxNodes);
    this.nodes = neighborhood.nodes;
    this.links = neighborhood.links;
    this.filterDetailToSubgraph = filterDetailToSubgraph;
    this.layoutCacheKey = null;
    if (rerender) this.render();
    return true;
  }

  render() {
    this.renderLegend();
    this.renderDetail();
    this.renderGraph();
  }

  renderLegend() {
    if (!this.legendEl || !this.typeCounts) return;
    const activeTypes = new Set(this.nodes.map((node) => node.type));
    const typeLegend = [...this.typeCounts.keys()]
      .filter((type) => activeTypes.has(type))
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

    this.legendEl.innerHTML = `${flowLegend}${typeLegend}`;
  }

  renderDetail() {
    const node = this.nodeById.get(this.selectedId);
    if (!node) {
      this.detailEl.className = "detail-empty";
      this.detailEl.textContent =
        "Seleziona una persona, un ufficio o un altro elemento per vedere attributi e collegamenti entranti e uscenti.";
      return;
    }

    const visibleIds = this.filterDetailToSubgraph
      ? new Set(this.nodes.map((entry) => entry.id))
      : null;
    const incoming = visibleIds
      ? node.incoming.filter((relation) => visibleIds.has(relation.source))
      : node.incoming;
    const outgoing = visibleIds
      ? node.outgoing.filter((relation) => visibleIds.has(relation.target))
      : node.outgoing;

    this.detailEl.className = "";
    this.detailEl.innerHTML = `
      <div class="smart-viewer">
        <div class="smart-column smart-column--incoming">
          <h4><span class="flow-chip flow-chip--incoming">${incoming.length} Entranti</span></h4>
          <div class="relation-cards">
            ${
              incoming.length
                ? incoming.map((relation) => this.renderRelationCard(relation, "incoming")).join("")
                : '<p class="panel__intro">Nessuna relazione entrante rilevata.</p>'
            }
          </div>
        </div>
        <div class="smart-column smart-column--current ${this.animationDirection === "left" ? "slide-from-left" : this.animationDirection === "right" ? "slide-from-right" : ""}">
          <div class="detail-header">
            <div class="detail-header__top">
              <div class="type-pill is-active" style="width:max-content">
                <span class="swatch" style="background:${getTypeColor(node.type)}"></span>
                <span>${getTypeLabel(node.type)}${renderLinkIcon(node.type, this.prefixMap)}</span>
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
                    ? node.attributes.map((attr) => renderAttribute(attr, this.prefixMap)).join("")
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
          <h4><span class="flow-chip flow-chip--outgoing">${outgoing.length} Uscenti</span></h4>
          <div class="relation-cards">
            ${
              outgoing.length
                ? outgoing.map((relation) => this.renderRelationCard(relation, "outgoing")).join("")
                : '<p class="panel__intro">Nessuna relazione uscente rilevata.</p>'
            }
          </div>
        </div>
      </div>
    `;

    this.bindDetailEvents();
    this.animationDirection = "none";
  }

  renderRelationCard(relation, direction) {
    const counterpartId = direction === "incoming" ? relation.source : relation.target;
    const counterpart = this.nodeById.get(counterpartId);
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
          ${
            isIncoming
              ? `
            <div class="rel-card__main">
              <div class="rel-card__header">
                <button type="button" class="relation-button rel-card__title" data-node-id="${escapeHtml(counterpartId)}">${escapeHtml(counterpartLabel)}</button>
                <span class="rel-card__type">${escapeHtml(counterpartType)}${counterpart ? renderLinkIcon(counterpart.type, this.prefixMap) : ""}</span>
              </div>
              ${counterpartSummary ? `<div class="rel-card__desc">${counterpartSummary}</div>` : ""}
            </div>
            <div class="rel-card__band">
              ${renderPredicateLink(relation.predicate, this.prefixMap)}
              ${sourceRaw ? `<button type="button" class="source-toggle source-toggle--inline" title="Sorgente JSON-LD">&lt;/&gt;</button>` : ""}
            </div>
          `
              : `
            <div class="rel-card__band">
              ${renderPredicateLink(relation.predicate, this.prefixMap)}
              ${sourceRaw ? `<button type="button" class="source-toggle source-toggle--inline" title="Sorgente JSON-LD">&lt;/&gt;</button>` : ""}
            </div>
            <div class="rel-card__main" style="text-align: right;">
              <div class="rel-card__header">
                <button type="button" class="relation-button rel-card__title" data-node-id="${escapeHtml(counterpartId)}">${escapeHtml(counterpartLabel)}</button>
                <span class="rel-card__type">${escapeHtml(counterpartType)}${counterpart ? renderLinkIcon(counterpart.type, this.prefixMap) : ""}</span>
              </div>
              ${counterpartSummary ? `<div class="rel-card__desc">${counterpartSummary}</div>` : ""}
            </div>
          `
          }
        </div>
        ${sourceRaw ? `<div class="rel-card__source" hidden><pre class="source-pre">${sourceRaw}</pre></div>` : ""}
      </div>
    `;
  }

  bindDetailEvents() {
    for (const card of this.detailEl.querySelectorAll(".rel-card")) {
      card.addEventListener("click", (event) => {
        if (event.target.closest(".relation-button")) return;
        card.classList.toggle("is-expanded");
      });
    }

    const sourceToggle = this.detailEl.querySelector(".source-toggle[data-source-id='__current__']");
    const sourceBox = this.detailEl.querySelector(".source-box");
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

    for (const btn of this.detailEl.querySelectorAll(".source-toggle--inline")) {
      const card = btn.closest(".rel-card");
      const panel = card?.querySelector(".rel-card__source");
      if (!panel) continue;
      btn.addEventListener("click", (event) => {
        event.stopPropagation();
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

    for (const button of this.detailEl.querySelectorAll(".relation-button")) {
      button.addEventListener("click", () => {
        const card = button.closest(".rel-card");
        if (card) {
          this.animationDirection = card.classList.contains("rel-card--incoming") ? "left" : "right";
        }
        this.onSelect?.(button.dataset.nodeId, { scroll: true });
      });
    }
  }

  renderGraph() {
    if (!this.nodes.length) {
      this.svgEl.innerHTML = "";
      return;
    }

    const { width, height } = this.getGraphSize();
    const layout = this.computeLayout(this.nodes, this.links, width, height);
    const selectedId = this.selectedId;
    const highlightedIds = collectHighlightedIds(selectedId, this.links);

    const linkMarkup = this.links
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
        const relationRole = getNodeRelationRole(node.id, selectedId, this.links);
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

    this.svgEl.setAttribute("viewBox", `0 0 ${width} ${height}`);
    this.svgEl.innerHTML = `
      <defs>${renderArrowMarkers()}</defs>
      <rect width="${width}" height="${height}" fill="transparent"></rect>
      ${linkMarkup}
      ${nodeMarkup}
    `;

    this.bindGraphEvents(layout);
  }

  bindGraphEvents(layout) {
    let draggedNodeId = null;
    let dragStartX = 0;
    let dragStartY = 0;
    let initialNodeX = 0;
    let initialNodeY = 0;
    let isDragging = false;

    const onMouseMove = (event) => {
      if (!draggedNodeId) return;
      isDragging = true;
      const svgRect = this.svgEl.getBoundingClientRect();
      const viewBox = this.svgEl.viewBox.baseVal;
      const scaleX = viewBox.width / svgRect.width;
      const scaleY = viewBox.height / svgRect.height;
      const dx = (event.clientX - dragStartX) * scaleX;
      const dy = (event.clientY - dragStartY) * scaleY;
      const node = layout.nodeMap.get(draggedNodeId);
      if (!node) return;
      node.x = initialNodeX + dx;
      node.y = initialNodeY + dy;
      const group = this.svgEl.querySelector(`.graph-node[data-node-id="${draggedNodeId}"]`);
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
      for (const line of this.svgEl.querySelectorAll("line.graph-link")) {
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
      setTimeout(() => {
        isDragging = false;
      }, 0);
    };

    for (const group of this.svgEl.querySelectorAll(".graph-node")) {
      group.addEventListener("mousedown", (event) => {
        draggedNodeId = group.dataset.nodeId;
        dragStartX = event.clientX;
        dragStartY = event.clientY;
        const node = layout.nodeMap.get(draggedNodeId);
        if (node) {
          initialNodeX = node.x;
          initialNodeY = node.y;
        }
        isDragging = false;
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        event.stopPropagation();
      });

      group.addEventListener("click", (event) => {
        if (isDragging) {
          event.stopPropagation();
          return;
        }
        const now = Date.now();
        const nodeId = group.dataset.nodeId;
        if (this.lastGraphClickedNodeId === nodeId && now - this.lastGraphClickTime < 400) {
          this.lastGraphClickTime = 0;
          this.onSelect?.(nodeId, { scroll: true });
          return;
        }
        this.lastGraphClickTime = now;
        this.lastGraphClickedNodeId = nodeId;
        this.onSelect?.(nodeId, { scroll: false });
      });
    }
  }

  computeLayout(nodes, links, width, height) {
    const cacheKey = `${nodes.map((n) => n.id).sort().join("|")}|${width}x${height}`;
    if (this.layoutCacheKey === cacheKey) return this.layoutCache;

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
    this.layoutCacheKey = cacheKey;
    this.layoutCache = layout;
    return layout;
  }

  getGraphSize() {
    const box = this.svgEl.getBoundingClientRect();
    const width = Math.max(860, Math.round(box.width || 960));
    const height = width < 900 ? 540 : 640;
    return { width, height };
  }
}

function buildPrefixMap(context) {
  const map = {};
  if (!context) return map;
  const contexts = Array.isArray(context) ? context : [context];
  for (const ctx of contexts) {
    if (!ctx || typeof ctx !== "object") continue;
    for (const [prefix, uri] of Object.entries(ctx)) {
      if (prefix.startsWith("@")) continue;
      if (typeof uri === "string" && /^https?:\/\//.test(uri)) map[prefix] = uri;
    }
  }
  return map;
}

function extractRelationTargets(value) {
  if (Array.isArray(value)) return value.flatMap((entry) => extractRelationTargets(entry));
  if (value && typeof value === "object" && typeof value["@id"] === "string") return [value["@id"]];
  return [];
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

function getDisplayTitle(node) {
  for (const candidate of [
    node["dct:title"],
    node["l0:name"],
    node["foaf:name"],
    node["poi:POIofficialName"],
    node["cpev:eventTitle"],
  ]) {
    if (typeof candidate === "string" && candidate.trim()) return candidate.trim();
  }
  return getLastSegment(node["@id"]);
}

function getSummary(node) {
  for (const candidate of [
    node["dct:description"],
    node["poi:POIdescription"],
    node["cpev:eventAbstract"],
    node["l0:description"],
    node["cpsv:referenceDoc"],
  ]) {
    const value = normalizeLiteral(candidate);
    if (value) return truncate(value, 190);
  }
  return "Nessuna descrizione sintetica disponibile.";
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

function collectHighlightedIds(selectedId, links) {
  if (!selectedId) return new Set();
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
        <marker id="arrow-${key}" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="${meta.color}"></path>
        </marker>
      `,
    )
    .join("");
}

function renderAttribute(attribute, prefixMap) {
  return `
    <div class="kv-item">
      <div class="kv-key">${escapeHtml(humanizePredicate(attribute.key))}${renderLinkIcon(attribute.key, prefixMap)}</div>
      <div class="kv-value">${renderAttributeValue(attribute.value, prefixMap)}</div>
    </div>
  `;
}

function renderAttributeValue(value, prefixMap) {
  const resolved = resolvePrefixedUri(value, prefixMap);
  if (/^https?:\/\//.test(resolved)) {
    return `<a href="${escapeHtml(resolved)}" target="_blank" rel="noopener noreferrer">${escapeHtml(resolved)}</a>`;
  }
  return escapeHtml(value);
}

function renderPredicateLink(predicate, prefixMap) {
  const label = escapeHtml(humanizePredicate(predicate));
  const uri = resolvePrefixedUri(predicate, prefixMap);
  const icon = /^https?:\/\//.test(uri)
    ? ` <a href="${escapeHtml(uri)}" target="_blank" rel="noopener noreferrer" class="term-link-icon" title="${escapeHtml(uri)}">&#x1F517;</a>`
    : "";
  return `<span class="rel-card__predicate">${label}${icon}</span>`;
}

function renderLinkIcon(term, prefixMap) {
  const uri = resolvePrefixedUri(term, prefixMap);
  if (!/^https?:\/\//.test(uri)) return "";
  return ` <a href="${escapeHtml(uri)}" target="_blank" rel="noopener noreferrer" class="term-link-icon" title="${escapeHtml(uri)}">&#x1F517;</a>`;
}

function resolvePrefixedUri(value, prefixMap) {
  if (!value || /^https?:\/\//.test(value)) return value;
  const match = /^([a-zA-Z][a-zA-Z0-9_-]*):([^/].*)$/.exec(value);
  if (!match) return value;
  const [, prefix, local] = match;
  const base = prefixMap[prefix];
  return base ? base + local : value;
}

export function getTypeLabel(type) {
  return TYPE_META[type]?.label || humanizePredicate(type);
}

export function getTypeColor(type) {
  return TYPE_META[type]?.color || "#5c6f82";
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
  return uri.replace(/[#/]+$/, "").split(/[#/]/).filter(Boolean).pop();
}

function truncate(text, limit) {
  if (text.length <= limit) return text;
  return `${text.slice(0, limit - 1).trimEnd()}…`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
