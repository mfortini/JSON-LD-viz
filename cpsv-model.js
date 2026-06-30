let lifeEventLabelsPromise = null;

export function loadLifeEventLabels() {
  if (!lifeEventLabelsPromise) {
    lifeEventLabelsPromise = fetch("./life-event-labels.json")
      .then((response) => (response.ok ? response.json() : {}))
      .catch(() => ({}));
  }
  return lifeEventLabelsPromise;
}

export function buildCpsvCatalog(data, { lifeEventLabels = {} } = {}) {
  const graph = Array.isArray(data?.["@graph"]) ? data["@graph"] : [];
  const index = new Map(graph.map((node) => [node["@id"], node]));

  const organizationNodes = graph.filter(
    (node) =>
      node["@type"] === "cv:PublicOrganisation" || node["@type"] === "cov:PublicOrganization",
  );

  const organizations = organizationNodes
    .map((node) => ({
      id: node["@id"],
      title: getNodeTitle(node),
      homepage: normalizeLiteral(node["foaf:homepage"]) || null,
    }))
    .sort((a, b) => a.title.localeCompare(b.title, "it"));

  const services = graph
    .filter((node) => node["@type"] === "cpsv:PublicService")
    .map((node) => normalizeService(node, index, lifeEventLabels))
    .sort((a, b) => a.title.localeCompare(b.title, "it"));

  const addresseeOptions = [...new Set(services.flatMap((service) => service.addressees.map((a) => a.label)))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, "it"));

  const lifeEventOptions = [...new Set(services.flatMap((service) => service.lifeEvents.map((e) => e.label)))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, "it"));

  const servicesWithLifeEvents = services.filter((service) => service.lifeEvents.length > 0).length;

  const sources = Array.isArray(data?.["cpsv-portalone:sourceCatalogs"])
    ? data["cpsv-portalone:sourceCatalogs"]
    : Array.isArray(data?.sources)
      ? data.sources
      : [];

  return {
    raw: data,
    organization: organizations[0] ?? null,
    organizations,
    services,
    addresseeOptions,
    lifeEventOptions,
    servicesWithLifeEvents,
    sources,
    serviceById: new Map(services.map((service) => [service.id, service])),
  };
}

export function mergeCpsvDocuments(existing, incoming, { filename, loadedAt } = {}) {
  if (!existing) {
    const catalog = buildCpsvCatalog(incoming);
    return {
      document: attachSourceMeta(incoming, {
        filename,
        loadedAt,
        serviceCount: catalog.services.length,
      }),
      stats: { addedServices: catalog.services.length, updatedNodes: 0 },
    };
  }

  const existingIds = new Set(
    (existing["@graph"] || [])
      .filter((node) => node["@type"] === "cpsv:PublicService" && node["@id"])
      .map((node) => node["@id"]),
  );

  const merged = structuredClone(existing);
  merged["@context"] = mergeContext(existing["@context"], incoming["@context"]);
  merged["@graph"] = mergeGraph(existing["@graph"] || [], incoming["@graph"] || []);

  for (const key of Object.keys(incoming)) {
    if (key.startsWith("@") || key === "dct:source" || key === "dct:title" || key === "dct:modified") {
      continue;
    }
    if (key.endsWith(":unmappedSections") && incoming[key] && typeof incoming[key] === "object") {
      merged[key] = { ...(merged[key] || {}), ...structuredClone(incoming[key]) };
    }
  }

  const incomingCatalog = buildCpsvCatalog(incoming);
  const addedServices = incomingCatalog.services.filter((service) => !existingIds.has(service.id)).length;
  const updatedNodes = countUpdatedNodes(existing["@graph"] || [], incoming["@graph"] || [], existingIds);

  const document = attachSourceMeta(merged, {
    filename,
    loadedAt,
    serviceCount: incomingCatalog.services.length,
  });

  return {
    document,
    stats: { addedServices, updatedNodes },
  };
}

function attachSourceMeta(document, { filename, loadedAt, serviceCount }) {
  const copy = structuredClone(document);
  const entry = {
    filename: filename || "catalogo.jsonld",
    loadedAt: loadedAt || new Date().toISOString(),
    serviceCount: serviceCount ?? 0,
  };

  const existing = Array.isArray(copy.sources) ? copy.sources : [];
  copy.sources = [...existing, entry];

  if (!copy["cpsv-portalone:sourceCatalogs"]) {
    copy["@context"] = {
      ...(copy["@context"] || {}),
      "cpsv-portalone": "urn:cpsv-portalone:",
    };
  }

  const provenance = Array.isArray(copy["cpsv-portalone:sourceCatalogs"])
    ? [...copy["cpsv-portalone:sourceCatalogs"]]
    : [];
  provenance.push({
    "@id": `urn:cpsv-portalone:source:${filename || "catalogo"}`,
    "dct:title": filename || "catalogo.jsonld",
    "dct:modified": entry.loadedAt,
  });
  copy["cpsv-portalone:sourceCatalogs"] = provenance;

  return copy;
}

function countUpdatedNodes(existingGraph, incomingGraph, existingServiceIds) {
  const byId = new Map(existingGraph.filter((node) => node["@id"]).map((node) => [node["@id"], node]));
  let updated = 0;

  for (const node of incomingGraph) {
    const nodeId = node["@id"];
    if (!nodeId || !byId.has(nodeId)) continue;
    if (node["@type"] === "cpsv:PublicService" && !existingServiceIds.has(nodeId)) continue;
    if (stableJson(node) !== stableJson(byId.get(nodeId))) {
      updated += 1;
    }
  }

  return updated;
}

function mergeContext(...contexts) {
  const merged = {};
  for (const context of contexts) {
    if (!context || typeof context !== "object") continue;
    for (const [prefix, uri] of Object.entries(context)) {
      if (prefix.startsWith("@")) continue;
      if (typeof uri === "string" && !(prefix in merged)) {
        merged[prefix] = uri;
      }
    }
  }
  return merged;
}

function mergeGraph(existingGraph, incomingGraph) {
  const byId = new Map();
  const ordered = [];

  for (const graph of [existingGraph, incomingGraph]) {
    for (const node of graph) {
      const nodeId = node?.["@id"];
      if (!nodeId) {
        ordered.push(structuredClone(node));
        continue;
      }
      if (byId.has(nodeId)) {
        const mergedNode = mergeNode(byId.get(nodeId), node);
        byId.set(nodeId, mergedNode);
        const index = ordered.findIndex((entry) => entry["@id"] === nodeId);
        if (index >= 0) ordered[index] = mergedNode;
        continue;
      }
      const copy = structuredClone(node);
      byId.set(nodeId, copy);
      ordered.push(copy);
    }
  }

  return ordered;
}

function mergeNode(existing, incoming) {
  const merged = structuredClone(existing);
  for (const [key, value] of Object.entries(incoming)) {
    if (key === "@id") continue;
    if (!(key in merged)) {
      merged[key] = structuredClone(value);
      continue;
    }
    const current = merged[key];
    if (stableJson(current) === stableJson(value)) continue;
    if (Array.isArray(current) && Array.isArray(value)) {
      const seen = new Set(current.map((item) => stableJson(item)));
      for (const item of value) {
        const encoded = stableJson(item);
        if (!seen.has(encoded)) {
          current.push(structuredClone(item));
          seen.add(encoded);
        }
      }
      continue;
    }
    if (Array.isArray(current)) {
      const encoded = stableJson(value);
      if (!current.some((item) => stableJson(item) === encoded)) {
        current.push(structuredClone(value));
      }
      continue;
    }
    if (Array.isArray(value)) {
      merged[key] = [structuredClone(current), ...structuredClone(value)];
      continue;
    }
    merged[key] = structuredClone(value);
  }
  return merged;
}

function stableJson(value) {
  return JSON.stringify(value);
}

function normalizeService(node, index, lifeEventLabels) {
  const id = node["@id"];
  const orgRef = refId(node["cv:hasCompetentAuthority"] ?? node["cov:hasOrganization"]);
  const orgNode = orgRef ? index.get(orgRef) : null;

  const addresseeIds = refIds(node["cv:addressee"]);
  const addressees = addresseeIds
    .map((addresseeId) => {
      const addressee = index.get(addresseeId);
      if (!addressee) return null;
      const label =
        normalizeLiteral(addressee["skos:prefLabel"]) ||
        normalizeLiteral(addressee["dct:title"]) ||
        getLastSegment(addresseeId);
      if (!label || label.startsWith("addressee-")) return null;
      return { id: addresseeId, label };
    })
    .filter(Boolean);

  const lifeEventIds = refIds(node["cpsv:isPartOfEvent"]);
  const lifeEvents = lifeEventIds
    .map((eventId) => ({
      id: eventId,
      label: lifeEventLabels[eventId] || getLastSegment(eventId),
    }))
    .filter((entry) => entry.label);

  const websiteChannelId = refId(node["cpsv:hasWebSiteChannel"]);
  const websiteChannel = websiteChannelId ? index.get(websiteChannelId) : null;
  const electronicChannelIds = refIds(node["cpsv:hasOtherElectronicChannel"]);
  const electronicChannels = electronicChannelIds
    .map((channelId) => {
      const channel = index.get(channelId);
      if (!channel) return null;
      return {
        id: channelId,
        type: channel["@type"] || "cpsv:Channel",
        url: normalizeLiteral(channel["foaf:page"]) || null,
        label: getChannelLabel(channel),
      };
    })
    .filter(Boolean);

  const legacyChannelId = refId(node["cpsv:hasChannel"]);
  const legacyChannel = legacyChannelId ? index.get(legacyChannelId) : null;

  const channels = [];
  if (websiteChannel) {
    channels.push({
      id: websiteChannel["@id"],
      type: websiteChannel["@type"] || "cpsv:WebSiteChannel",
      url: normalizeLiteral(websiteChannel["foaf:page"]) || null,
      label: "Sito web",
    });
  }
  for (const channel of electronicChannels) {
    channels.push(channel);
  }
  if (legacyChannel) {
    channels.push({
      id: legacyChannel["@id"],
      type: legacyChannel["@type"] || "cpsv:Channel",
      url: normalizeLiteral(legacyChannel["sm:URL"] ?? legacyChannel["foaf:page"]) || null,
      label: getChannelLabel(legacyChannel),
    });
  }

  const inputIds = refIds(node["cpsv:hasInput"]);
  const inputs = inputIds
    .map((inputId) => {
      const input = index.get(inputId);
      if (!input) return null;
      return {
        id: inputId,
        label: normalizeLiteral(input["l0:description"]) || normalizeLiteral(input["dct:title"]) || "Input richiesto",
      };
    })
    .filter(Boolean);

  const processingId = refId(node["cpsv:hasProcessingTime"]);
  const processingNode = processingId ? index.get(processingId) : null;
  const processingTime = processingNode
    ? normalizeLiteral(processingNode["l0:description"]) ||
      normalizeLiteral(processingNode["dct:description"]) ||
      null
    : null;

  const externalUrl =
    normalizeLiteral(node["foaf:page"]) ||
    (websiteChannel ? normalizeLiteral(websiteChannel["foaf:page"]) : null) ||
    electronicChannels.find((channel) => channel.url)?.url ||
    (legacyChannel ? normalizeLiteral(legacyChannel["sm:URL"] ?? legacyChannel["foaf:page"]) : null) ||
    null;

  const title = getNodeTitle(node);
  const abstract = normalizeLiteral(node["dct:abstract"]);
  const description = normalizeLiteral(node["dct:description"] || node["l0:description"]);

  return {
    id,
    title,
    abstract,
    description,
    organization: orgNode
      ? { id: orgNode["@id"], title: getNodeTitle(orgNode) }
      : null,
    addressees,
    lifeEvents,
    channels,
    inputs,
    processingTime,
    externalUrl,
    identifier: normalizeLiteral(node["dct:identifier"]) || null,
    serviceCode: normalizeLiteral(node["cpsv:otherServiceCode"]) || null,
    issued: normalizeLiteral(node["dct:issued"]) || null,
    modified: normalizeLiteral(node["dct:modified"]) || null,
    language: normalizeLiteral(node["dct:language"]) || null,
    searchText: [
      title,
      abstract,
      description,
      orgNode ? getNodeTitle(orgNode) : "",
      ...addressees.map((a) => a.label),
      ...lifeEvents.map((e) => e.label),
    ]
      .join(" ")
      .toLowerCase(),
  };
}

export function filterServices(catalog, { search = "", addressee = "all", lifeEvent = "all" } = {}) {
  const query = search.trim().toLowerCase();
  return catalog.services.filter((service) => {
    const matchesSearch = !query || service.searchText.includes(query);
    const matchesAddressee =
      addressee === "all" || service.addressees.some((entry) => entry.label === addressee);
    const matchesLifeEvent =
      lifeEvent === "all" || service.lifeEvents.some((entry) => entry.label === lifeEvent);
    return matchesSearch && matchesAddressee && matchesLifeEvent;
  });
}

function getNodeTitle(node) {
  for (const candidate of [
    node["dct:title"],
    node["skos:prefLabel"],
    node["l0:name"],
    node["foaf:name"],
  ]) {
    const value = normalizeLiteral(candidate);
    if (value) return value;
  }
  return getLastSegment(node["@id"]);
}

function getChannelLabel(channel) {
  if (channel["@type"] === "cpsv:WebSiteChannel") return "Sito web";
  if (channel["@type"] === "cpsv:OtherElectronicChannel") return "Canale elettronico";
  return normalizeLiteral(channel["dct:title"]) || "Canale";
}

function refId(value) {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value === "object" && typeof value["@id"] === "string") return value["@id"];
  return null;
}

function refIds(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((entry) => refId(entry)).filter(Boolean);
  const single = refId(value);
  return single ? [single] : [];
}

function normalizeLiteral(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => normalizeLiteral(entry)).filter(Boolean).join(" • ");
  }
  if (value && typeof value === "object") {
    if (typeof value["@value"] === "string") return value["@value"].trim();
    return "";
  }
  if (value == null) return "";
  return String(value).trim();
}

function getLastSegment(uri) {
  try {
    const decoded = decodeURIComponent(uri);
    return decoded
      .replace(/[#/]+$/, "")
      .split(/[#/]/)
      .filter(Boolean)
      .pop();
  } catch {
    return uri
      .replace(/[#/]+$/, "")
      .split(/[#/]/)
      .filter(Boolean)
      .pop();
  }
}

export function truncate(text, max = 160) {
  if (!text || text.length <= max) return text || "";
  return `${text.slice(0, max - 1).trim()}…`;
}
