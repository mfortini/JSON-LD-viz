import { getTypeColor, getTypeLabel } from "./graph-core.js";

const NODE_W = {
  org: 240,
  office: 260,
  officeCompressed: 112,
  person: 180,
  serviceBranch: 168,
  service: 260,
  io: 210,
  aux: 190,
};
const ROW = { l0: 70, l1: 190, l2: 340 };

function getFocusedOfficeIndex(offices, focusedOfficeId) {
  const index = offices.findIndex((office) => office["@id"] === focusedOfficeId);
  return index >= 0 ? index : 0;
}

function getOfficeCenterX(index, focusIndex, focusCenterX, bridge, officeSpan) {
  if (index === focusIndex) return focusCenterX;
  if (index < focusIndex) {
    const slot = focusIndex - index;
    return focusCenterX - bridge - (slot - 1) * officeSpan;
  }
  const slot = index - focusIndex;
  return focusCenterX + bridge + (slot - 1) * officeSpan;
}

function getFocusedBranchHalfWidth({
  officeId,
  personsByOffice,
  servicesByOffice,
  personsVisible,
  servicesVisible,
}) {
  let branchHalf = NODE_W.office / 2;
  const persons = personsByOffice.get(officeId) || [];
  const services = servicesByOffice.get(officeId) || [];

  if (personsVisible && persons.length) {
    const cols = Math.min(4, persons.length);
    const bandWidth = Math.max(NODE_W.office, cols * (NODE_W.person + 14));
    branchHalf = Math.max(branchHalf, bandWidth / 2);
  }

  if (servicesVisible && services.length) {
    const cols = Math.min(4, services.length);
    const bandWidth = Math.max(NODE_W.office, cols * (NODE_W.serviceBranch + 10));
    branchHalf = Math.max(branchHalf, bandWidth / 2);
  }

  return branchHalf;
}

function getLayoutBounds(nodes) {
  let minX = Infinity;
  let maxX = -Infinity;

  for (const node of nodes) {
    const halfW = (node.w || 40) / 2 + 10;
    minX = Math.min(minX, node.x - halfW);
    maxX = Math.max(maxX, node.x + halfW);
  }

  return { minX, maxX };
}

function computeTreeViewBox({ width, height, focusOfficeX, viewportWidth }) {
  const viewWidth = Math.max(720, viewportWidth);
  const viewX = Math.max(0, Math.min(focusOfficeX - viewWidth / 2, width - viewWidth));
  return {
    x: viewX,
    y: 0,
    width: width <= viewWidth ? viewWidth : viewWidth,
    height,
  };
}

export function buildOrgTreeLayout({
  organization,
  offices = [],
  focusedOfficeId = null,
  personsByOffice,
  servicesByOffice,
  personsVisible = true,
  servicesVisible = true,
  viewportWidth = 1120,
  getTitle,
}) {
  const edges = [];
  const gap = 10;
  const officeSpan = NODE_W.officeCompressed + gap;
  const bridge = NODE_W.office / 2 + gap + NODE_W.officeCompressed / 2;
  const rootId = organization?.["@id"] || "__org__";
  const rootLabel = organization ? getTitle(organization) : "Organizzazione";

  if (!offices.length) {
    const width = 960;
    const focusCenterX = width / 2;
    return {
      nodes: [
        {
          id: rootId,
          label: rootLabel,
          type: "cov:PublicOrganization",
          role: "root",
          x: focusCenterX,
          y: ROW.l0,
          w: NODE_W.org,
          h: 48,
        },
      ],
      edges,
      width,
      height: 220,
      hasFocus: false,
      focusOfficeX: focusCenterX,
      focusOfficeY: ROW.l1,
      officeCount: 0,
      personCount: 0,
      serviceCount: 0,
    };
  }

  const focusIndex = getFocusedOfficeIndex(offices, focusedOfficeId);
  const effectiveFocusId = offices[focusIndex]["@id"];
  const leftCount = focusIndex;
  const rightCount = offices.length - focusIndex - 1;
  const leftReach =
    leftCount > 0 ? bridge + (leftCount - 1) * officeSpan + NODE_W.officeCompressed / 2 : 0;
  const rightReach =
    rightCount > 0 ? bridge + (rightCount - 1) * officeSpan + NODE_W.officeCompressed / 2 : 0;
  const branchHalf = getFocusedBranchHalfWidth({
    officeId: effectiveFocusId,
    personsByOffice,
    servicesByOffice,
    personsVisible,
    servicesVisible,
  });
  const halfWidth = Math.max(NODE_W.office / 2, leftReach, rightReach, branchHalf);
  let width = Math.max(960, halfWidth * 2 + 160, viewportWidth);
  const focusCenterX = width / 2;
  const focusOfficeX = focusCenterX;
  const focusOfficeY = ROW.l1;
  let maxY = ROW.l1;

  const rootNode = {
    id: rootId,
    label: rootLabel,
    type: "cov:PublicOrganization",
    role: "root",
    x: focusCenterX,
    y: ROW.l0,
    w: NODE_W.org,
    h: 48,
  };

  const compressedNodes = [];
  const foregroundNodes = [];
  const branchEdges = [];

  offices.forEach((office, index) => {
    const officeId = office["@id"];
    const isFocused = officeId === effectiveFocusId;
    const persons = (personsByOffice.get(officeId) || []).sort((a, b) =>
      getTitle(a).localeCompare(getTitle(b), "it"),
    );
    const services = (servicesByOffice.get(officeId) || []).sort((a, b) =>
      getTitle(a).localeCompare(getTitle(b), "it"),
    );
    const x = getOfficeCenterX(index, focusIndex, focusCenterX, bridge, officeSpan);
    const officeNode = {
      id: officeId,
      label: getTitle(office),
      type: "cov:Office",
      role: isFocused ? "office-focused" : "office-compressed",
      x,
      y: ROW.l1,
      w: isFocused ? NODE_W.office : NODE_W.officeCompressed,
      h: isFocused ? 58 : 38,
      personCount: persons.length,
      serviceCount: services.length,
      summary: isFocused ? truncate(office["cov:mainFunction"] || "", 88) : "",
      compressedLabel: truncate(getTitle(office), 16),
    };

    edges.push({ from: rootId, to: officeId, kind: isFocused ? "org-office-focus" : "org-office" });

    if (isFocused) {
      foregroundNodes.push(officeNode);
      let branchY = ROW.l2;

      if (personsVisible && persons.length) {
        const cols = Math.min(4, persons.length);
        const personSpan = NODE_W.person + 14;
        const bandWidth = Math.max(NODE_W.office, cols * personSpan);
        const startX = x - bandWidth / 2 + personSpan / 2;
        const rows = Math.ceil(persons.length / cols);

        persons.forEach((person, personIndex) => {
          const col = personIndex % cols;
          const row = Math.floor(personIndex / cols);
          const personId = person["@id"];
          const px = startX + col * personSpan;
          const py = ROW.l2 + row * 72;
          foregroundNodes.push({
            id: personId,
            label: getTitle(person),
            type: "cpv:Person",
            role: "person",
            x: px,
            y: py,
            w: NODE_W.person,
            h: 44,
            parentOfficeId: officeId,
            subtitle: formatPersonSubtitle(person),
          });
          branchEdges.push({ from: officeId, to: personId, kind: "office-person" });
          maxY = Math.max(maxY, py);
        });
        branchY = ROW.l2 + (rows - 1) * 72 + 58;
      }

      if (servicesVisible && services.length) {
        const cols = Math.min(4, services.length);
        const serviceSpan = NODE_W.serviceBranch + 10;
        const bandWidth = Math.max(NODE_W.office, cols * serviceSpan);
        const startX = x - bandWidth / 2 + serviceSpan / 2;
        const rows = Math.ceil(services.length / cols);

        services.forEach((service, serviceIndex) => {
          const col = serviceIndex % cols;
          const row = Math.floor(serviceIndex / cols);
          const serviceId = service["@id"];
          const sx = startX + col * serviceSpan;
          const sy = branchY + row * 64;
          foregroundNodes.push({
            id: serviceId,
            label: getTitle(service),
            type: "cpsv:PublicService",
            role: "service-branch",
            x: sx,
            y: sy,
            w: NODE_W.serviceBranch,
            h: 40,
            parentOfficeId: officeId,
            subtitle: service["cpsv:status"] || "",
          });
          branchEdges.push({ from: officeId, to: serviceId, kind: "office-service" });
          maxY = Math.max(maxY, sy);
        });
      }
      return;
    }

    compressedNodes.push(officeNode);
  });

  const nodes = [rootNode, ...compressedNodes, ...foregroundNodes];
  edges.push(...branchEdges);

  const bounds = getLayoutBounds(nodes);
  if (Number.isFinite(bounds.minX) && Number.isFinite(bounds.maxX)) {
    width = Math.max(
      width,
      bounds.maxX - bounds.minX + 120,
      2 * Math.max(focusCenterX - bounds.minX, bounds.maxX - focusCenterX) + 120,
    );
  }

  const height = maxY + 120;
  const viewBox = computeTreeViewBox({
    width,
    height,
    focusOfficeX,
    viewportWidth,
  });

  const focusedPersonCount = (personsByOffice.get(effectiveFocusId) || []).length;
  const focusedServiceCount = (servicesByOffice.get(effectiveFocusId) || []).length;

  return {
    nodes,
    edges,
    width,
    height,
    viewBox,
    hasFocus: true,
    focusOfficeX,
    focusOfficeY,
    officeCount: offices.length,
    personCount: focusedPersonCount,
    serviceCount: focusedServiceCount,
  };
}

export function renderOrgTreeSvg(layout, { selectedNodeId, escapeHtml }) {
  if (!layout.officeCount) {
    return `
      <div class="comune-tree-placeholder">
        <p>Nessun ufficio corrisponde ai filtri attivi.</p>
      </div>
    `;
  }

  const edgeMarkup = layout.edges
    .map((edge) => {
      const from = layout.nodes.find((node) => node.id === edge.from);
      const to = layout.nodes.find((node) => node.id === edge.to);
      if (!from || !to) return "";
      const fromHalfH = (from.h || 40) / 2;
      const toHalfH = (to.h || 40) / 2;
      const y1 = from.y + fromHalfH;
      const y2 = to.y - toHalfH;
      const midY = (y1 + y2) / 2;
      const edgeClass =
        edge.kind === "org-office-focus"
          ? "special-edge--org-office-focus"
          : `special-edge--${edge.kind}`;
      return `
        <path
          class="special-edge ${edgeClass} ${edge.kind === "org-office" ? "is-compressed" : ""}"
          d="M ${from.x} ${y1} V ${midY} H ${to.x} V ${y2}"
          fill="none"
        ></path>
      `;
    })
    .join("");

  const nodeMarkup = layout.nodes
    .map((node) => renderOrgTreeNode(node, { selectedNodeId, escapeHtml }))
    .join("");

  const viewBox = layout.viewBox || {
    x: 0,
    y: 0,
    width: layout.width,
    height: layout.height,
  };

  return `
    <svg
      class="comune-special-svg comune-special-svg--tree"
      width="100%"
      height="${layout.height}"
      viewBox="${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}"
      preserveAspectRatio="xMidYMin meet"
      data-focus-x="${layout.focusOfficeX}"
      data-focus-y="${layout.focusOfficeY ?? ROW.l1}"
      role="img"
      aria-label="Albero organizzativo con uffici compressi"
    >
      <rect width="${layout.width}" height="${layout.height}" class="special-canvas"></rect>
      ${edgeMarkup}
      ${nodeMarkup}
    </svg>
  `;
}

function renderOrgTreeNode(node, { selectedNodeId, escapeHtml }) {
  const selected = node.id === selectedNodeId;
  const color = getTypeColor(node.type);
  const halfW = node.w / 2;
  const boxH = node.h || 44;
  const isCompressed = node.role === "office-compressed";
  const isFocused = node.role === "office-focused";
  let clickAttr = `data-special-node="${escapeHtml(node.id)}"`;
  if (isCompressed) {
    clickAttr = `data-tree-office-id="${escapeHtml(node.id)}"`;
  } else if (node.role === "person") {
    clickAttr = `data-goto-persone-person="${escapeHtml(node.id)}"`;
  } else if (node.role === "service-branch") {
    clickAttr = `data-goto-servizi-service="${escapeHtml(node.id)}"`;
  }

  let labelMarkup = "";
  if (isCompressed) {
    labelMarkup = `
      <text class="special-node__label special-node__label--compressed" y="3" text-anchor="middle">
        <tspan x="0" dy="0">${escapeHtml(node.compressedLabel)}</tspan>
        <tspan x="0" dy="13" class="special-node__meta">${node.personCount}p · ${node.serviceCount}s</tspan>
      </text>
    `;
  } else if (isFocused) {
    labelMarkup = `
      <text class="special-node__label" y="${node.summary ? -6 : 4}" text-anchor="middle">
        <tspan x="0" dy="0">${escapeHtml(truncate(node.label, 34))}</tspan>
        ${
          node.summary
            ? `<tspan x="0" dy="16" class="special-node__meta">${escapeHtml(node.summary)}</tspan>`
            : `<tspan x="0" dy="16" class="special-node__meta">${node.personCount} persone · ${node.serviceCount} servizi</tspan>`
        }
      </text>
    `;
  } else if (node.role === "service-branch") {
    labelMarkup = `
      <text class="special-node__label" y="${node.subtitle ? -2 : 4}" text-anchor="middle">
        <tspan x="0" dy="0">${escapeHtml(truncate(node.label, 22))}</tspan>
        ${
          node.subtitle
            ? `<tspan x="0" dy="14" class="special-node__meta">${escapeHtml(truncate(node.subtitle, 20))}</tspan>`
            : ""
        }
      </text>
    `;
  } else if (node.role === "person") {
    labelMarkup = `
      <text class="special-node__label" y="4" text-anchor="middle">
        <tspan x="0" dy="0">${escapeHtml(truncate(node.label, 24))}</tspan>
        ${
          node.subtitle
            ? `<tspan x="0" dy="14" class="special-node__meta">${escapeHtml(node.subtitle)}</tspan>`
            : ""
        }
      </text>
    `;
  } else {
    labelMarkup = `
      <text class="special-node__label" y="4" text-anchor="middle">
        <tspan x="0" dy="0">${escapeHtml(truncate(node.label, 30))}</tspan>
      </text>
    `;
  }

  return `
    <g
      class="special-node special-node--${node.role} ${selected ? "is-selected" : ""}"
      ${clickAttr}
      transform="translate(${node.x}, ${node.y})"
    >
      <rect
        class="special-node__box"
        x="${-halfW}"
        y="${-boxH / 2}"
        width="${node.w}"
        height="${boxH}"
        rx="${isCompressed ? 10 : 14}"
        fill="${color}"
      ></rect>
      ${labelMarkup}
      <title>${escapeHtml(`${node.label} (${getTypeLabel(node.type)}${node.personCount != null ? ` · ${node.personCount} persone · ${node.serviceCount} servizi` : ""})`)}</title>
    </g>
  `;
}

export function buildServiceIoLayout({ service, index, getTitle, refId, refIds }) {
  if (!service) return null;

  const serviceId = service["@id"];
  const inputs = refIds(service["cpsv:hasInput"])
    .map((id) => index.get(id))
    .filter(Boolean);
  const outputs = refIds(service["cpsv:producesOutput"])
    .map((id) => index.get(id))
    .filter(Boolean);
  const processing = index.get(refId(service["cpsv:hasProcessingTime"]));
  const channel = index.get(refId(service["cpsv:hasChannel"]));
  const office = index.get(refId(service["cov:hasOrganization"]));

  const nodes = [];
  const edges = [];
  const width = 1040;
  const centerX = width / 2;
  const centerY = 230;

  if (office) {
    nodes.push(makeIoNode({
      id: office["@id"],
      label: getTitle(office),
      type: "cov:Office",
      lane: "top",
      x: centerX,
      y: 58,
      w: NODE_W.aux,
      body: "",
      linkToOrganigramma: true,
    }));
    edges.push({ from: office["@id"], to: serviceId, kind: "office-service", label: "erogato da" });
  }

  nodes.push(
    makeIoNode({
      id: serviceId,
      label: getTitle(service),
      type: "cpsv:PublicService",
      lane: "center",
      x: centerX,
      y: centerY,
      w: NODE_W.service,
      body: normalizeShort(service["dct:description"] || service["l0:description"]),
      meta: service["cpsv:status"] || "",
    }),
  );

  const inputYStart = centerY - ((inputs.length - 1) * 92) / 2;
  inputs.forEach((input, inputIndex) => {
    const id = input["@id"];
    nodes.push(
      makeIoNode({
        id,
        label: "Input richiesto",
        type: "cpsv:Input",
        lane: "input",
        x: 150,
        y: inputYStart + inputIndex * 92,
        w: NODE_W.io,
        body: normalizeShort(input["l0:description"]),
      }),
    );
    edges.push({ from: id, to: serviceId, kind: "input-service", label: "hasInput" });
  });

  const outputYStart = centerY - ((outputs.length - 1) * 92) / 2;
  outputs.forEach((output, outputIndex) => {
    const id = output["@id"];
    nodes.push(
      makeIoNode({
        id,
        label: "Output prodotto",
        type: "cpsv:Output",
        lane: "output",
        x: width - 150,
        y: outputYStart + outputIndex * 92,
        w: NODE_W.io,
        body: normalizeShort(output["l0:description"]),
      }),
    );
    edges.push({ from: serviceId, to: id, kind: "service-output", label: "producesOutput" });
  });

  if (processing) {
    nodes.push(
      makeIoNode({
        id: processing["@id"],
        label: "Tempo di lavorazione",
        type: "cpsv:ServiceProcessingTime",
        lane: "bottom-left",
        x: centerX - 170,
        y: 390,
        w: NODE_W.aux,
        body: normalizeShort(processing["l0:description"]),
      }),
    );
    edges.push({
      from: serviceId,
      to: processing["@id"],
      kind: "service-aux",
      label: "hasProcessingTime",
    });
  }

  if (channel) {
    nodes.push(
      makeIoNode({
        id: channel["@id"],
        label: getTitle(channel),
        type: "cpsv:Channel",
        lane: "bottom-right",
        x: centerX + 170,
        y: 390,
        w: NODE_W.aux,
        body: channel["sm:URL"] || "",
      }),
    );
    edges.push({ from: serviceId, to: channel["@id"], kind: "service-aux", label: "hasChannel" });
  }

  const maxY = Math.max(...nodes.map((node) => node.y + node.collapsedH / 2), 430);
  return { nodes, edges, width, height: maxY + 80, serviceId };
}

export function renderServiceIoSvg(layout, { selectedNodeId, expandedNodeIds = new Set(), escapeHtml }) {
  if (!layout) {
    return `<p class="comune-empty">Seleziona un servizio per visualizzare input e output.</p>`;
  }

  const edgeMarkup = layout.edges
    .map((edge) => {
      const from = layout.nodes.find((node) => node.id === edge.from);
      const to = layout.nodes.find((node) => node.id === edge.to);
      if (!from || !to) return "";
      const path = buildIoEdgePath(from, to, edge.kind);
      return `
        <g class="special-io-edge-group">
          <path class="special-edge special-edge--${edge.kind}" d="${path}" fill="none"></path>
          <text class="special-edge__label" x="${(from.x + to.x) / 2}" y="${(from.y + to.y) / 2 - 8}" text-anchor="middle">
            ${escapeHtml(humanizePredicate(edge.label))}
          </text>
        </g>
      `;
    })
    .join("");

  const laneTitles = `
    <text class="special-lane-title" x="150" y="28" text-anchor="middle">Input richiesti</text>
    <text class="special-lane-title special-lane-title--center" x="${layout.width / 2}" y="28" text-anchor="middle">Servizio</text>
    <text class="special-lane-title" x="${layout.width - 150}" y="28" text-anchor="middle">Output prodotti</text>
  `;

  const nodeMarkup = layout.nodes
    .map((node) => renderIoNode(node, { selectedNodeId, expandedNodeIds, escapeHtml }))
    .join("");

  return `
    <svg
      class="comune-special-svg comune-special-svg--io"
      viewBox="0 0 ${layout.width} ${layout.height}"
      role="img"
      aria-label="Diagramma input e output del servizio"
    >
      <rect width="${layout.width}" height="${layout.height}" class="special-canvas"></rect>
      <line class="special-lane-divider" x1="340" y1="40" x2="340" y2="${layout.height - 24}"></line>
      <line class="special-lane-divider" x1="${layout.width - 340}" y1="40" x2="${layout.width - 340}" y2="${layout.height - 24}"></line>
      ${laneTitles}
      ${edgeMarkup}
      ${nodeMarkup}
    </svg>
    <p class="comune-io-hint">Clicca una casella per espanderla. L'ufficio erogatore porta all'organigramma; «Apri nel grafo» esplora le relazioni semantiche.</p>
  `;
}

function renderIoNode(node, { selectedNodeId, expandedNodeIds, escapeHtml }) {
  const selected = node.id === selectedNodeId;
  const expanded = expandedNodeIds.has(node.id);
  const color = getTypeColor(node.type);
  const hasBody = Boolean(node.body);
  const canExpand = hasBody && node.body.length > 48;
  const boxW = expanded ? Math.max(node.w, 300) : node.w;
  const boxH = expanded ? estimateExpandedHeight(node) : node.collapsedH;
  const orgLinkBtn = node.linkToOrganigramma
    ? `<button type="button" class="special-io-card__btn" data-goto-organigramma-office="${escapeHtml(node.id)}">Vai all'organigramma</button>`
    : "";

  return `
    <g
      class="special-node special-node--${node.lane} ${selected ? "is-selected" : ""} ${expanded ? "is-expanded" : ""}"
      transform="translate(${node.x}, ${node.y})"
    >
      <rect
        class="special-node__box"
        x="${-boxW / 2}"
        y="${-boxH / 2}"
        width="${boxW}"
        height="${boxH}"
        rx="14"
        fill="${color}"
      ></rect>
      ${
        expanded
          ? `
        <foreignObject x="${-boxW / 2 + 8}" y="${-boxH / 2 + 8}" width="${boxW - 16}" height="${boxH - 16}">
          <div xmlns="http://www.w3.org/1999/xhtml" class="special-io-card">
            <div class="special-io-card__head">
              <strong>${escapeHtml(node.label)}</strong>
              ${node.meta ? `<span class="special-io-card__meta">${escapeHtml(node.meta)}</span>` : ""}
            </div>
            <p class="special-io-card__body">${escapeHtml(node.body)}</p>
            <div class="special-io-card__actions">
              <button type="button" class="special-io-card__btn" data-io-node-toggle="${escapeHtml(node.id)}">Comprimi</button>
              ${orgLinkBtn}
              <button type="button" class="special-io-card__btn special-io-card__btn--primary" data-node-id="${escapeHtml(node.id)}">Apri nel grafo</button>
            </div>
          </div>
        </foreignObject>
      `
          : `
        <foreignObject x="${-boxW / 2 + 8}" y="${-boxH / 2 + 8}" width="${boxW - 16}" height="${boxH - 16}">
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            class="special-io-card special-io-card--compact ${canExpand || node.linkToOrganigramma ? "is-clickable" : ""}"
            ${canExpand ? `data-io-node-toggle="${escapeHtml(node.id)}"` : ""}
            ${node.linkToOrganigramma && !canExpand ? `data-goto-organigramma-office="${escapeHtml(node.id)}"` : ""}
          >
            <strong>${escapeHtml(node.label)}</strong>
            ${node.meta ? `<span class="special-io-card__meta">${escapeHtml(node.meta)}</span>` : ""}
            ${hasBody ? `<p class="special-io-card__preview">${escapeHtml(truncate(node.body, 72))}</p>` : ""}
            ${canExpand ? `<span class="special-io-card__more">Clicca per espandere</span>` : ""}
            ${node.linkToOrganigramma ? `<span class="special-io-card__more">Clicca per aprire nell'organigramma</span>` : ""}
          </div>
        </foreignObject>
      `
      }
      <title>${escapeHtml(`${node.label}${node.body ? `: ${node.body}` : ""}`)}</title>
    </g>
  `;
}

function makeIoNode({ id, label, type, lane, x, y, w, body, meta = "", linkToOrganigramma = false }) {
  return {
    id,
    label,
    type,
    lane,
    x,
    y,
    w,
    body,
    meta,
    linkToOrganigramma,
    collapsedH: body ? 68 : linkToOrganigramma ? 56 : 48,
  };
}

function estimateExpandedHeight(node) {
  const lines = Math.max(3, Math.ceil(node.body.length / 46));
  return Math.min(280, 96 + lines * 18);
}

function formatPersonSubtitle(person) {
  const given = person["cpv:givenName"] || "";
  const family = person["cpv:familyName"] || "";
  if (given && family) return `${given} · ${family}`;
  return "";
}

function buildIoEdgePath(from, to, kind) {
  const fromH = from.collapsedH || 68;
  const toH = to.collapsedH || 68;
  if (kind === "input-service") {
    return `M ${from.x + from.w / 2} ${from.y} C ${from.x + 130} ${from.y}, ${to.x - 130} ${to.y}, ${to.x - to.w / 2} ${to.y}`;
  }
  if (kind === "service-output") {
    return `M ${from.x + from.w / 2} ${from.y} C ${from.x + 130} ${from.y}, ${to.x - 130} ${to.y}, ${to.x - to.w / 2} ${to.y}`;
  }
  if (kind === "office-service") {
    return `M ${from.x} ${from.y + fromH / 2} V ${to.y - toH / 2}`;
  }
  const midY = (from.y + to.y) / 2;
  return `M ${from.x} ${from.y + fromH / 2} V ${midY} H ${to.x} V ${to.y - toH / 2}`;
}

function normalizeShort(value) {
  if (value == null) return "";
  if (Array.isArray(value)) return normalizeShort(value.join(" • "));
  if (typeof value === "object" && value["@value"]) return String(value["@value"]).trim();
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

function truncate(text, limit) {
  if (!text || text.length <= limit) return text || "";
  return `${text.slice(0, limit - 1).trimEnd()}…`;
}
