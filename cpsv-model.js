export function buildCpsvCatalog(data) {
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
    .map((node) => normalizeService(node, index))
    .sort((a, b) => a.title.localeCompare(b.title, "it"));

  const addresseeOptions = [...new Set(services.flatMap((service) => service.addressees.map((a) => a.label)))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, "it"));

  return {
    raw: data,
    organization: organizations[0] ?? null,
    organizations,
    services,
    addresseeOptions,
    serviceById: new Map(services.map((service) => [service.id, service])),
  };
}

function normalizeService(node, index) {
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
    channels,
    inputs,
    processingTime,
    externalUrl,
    identifier: normalizeLiteral(node["dct:identifier"]) || null,
    serviceCode: normalizeLiteral(node["cpsv:otherServiceCode"]) || null,
    issued: normalizeLiteral(node["dct:issued"]) || null,
    modified: normalizeLiteral(node["dct:modified"]) || null,
    language: normalizeLiteral(node["dct:language"]) || null,
    searchText: [title, abstract, description, orgNode ? getNodeTitle(orgNode) : "", ...addressees.map((a) => a.label)]
      .join(" ")
      .toLowerCase(),
  };
}

export function filterServices(catalog, { search = "", addressee = "all" } = {}) {
  const query = search.trim().toLowerCase();
  return catalog.services.filter((service) => {
    const matchesSearch = !query || service.searchText.includes(query);
    const matchesAddressee =
      addressee === "all" || service.addressees.some((entry) => entry.label === addressee);
    return matchesSearch && matchesAddressee;
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
