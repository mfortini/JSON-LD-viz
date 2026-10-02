/** Stato form ↔ documento JSON-LD CPSV (forma di produzione). */

export const CONTEXT = {
  cpsv: "https://w3id.org/italia/onto/CPSV#",
  cv: "http://data.europa.eu/m8g/",
  dct: "http://purl.org/dc/terms/",
  foaf: "http://xmlns.com/foaf/0.1/",
  io: "https://io.italia.it/onto/io#",
  ex: "https://example.org/onto/ex#",
};

const STORAGE_KEY = "cpsv-scheda-session";
const STORAGE_MAX_BYTES = 4 * 1024 * 1024;

export function storageKey() {
  return STORAGE_KEY;
}

function lit(value) {
  const text = String(value ?? "").trim();
  if (!text) return null;
  return { "@language": "it", "@value": text };
}

function readLit(node) {
  if (node == null) return "";
  if (typeof node === "string") return node;
  if (typeof node === "object") {
    if (typeof node.it === "string") return node.it;
    if (typeof node["@value"] === "string") return node["@value"];
    if (Array.isArray(node)) {
      for (const item of node) {
        const text = readLit(item);
        if (text) return text;
      }
    }
  }
  return "";
}

function refId(value) {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value === "object" && value["@id"]) return String(value["@id"]);
  return null;
}

function asList(value) {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

function typeIncludes(node, needle) {
  const types = asList(node?.["@type"]).map(String);
  return types.some(
    (t) =>
      t === needle ||
      t.endsWith(`:${needle.split(":").pop()}`) ||
      t.endsWith(`/${needle.split(":").pop()}`) ||
      t.endsWith(`#${needle.split(":").pop()}`),
  );
}

function isPublicService(node) {
  return typeIncludes(node, "cpsv:PublicService") || typeIncludes(node, "PublicService");
}

function stripSlash(id) {
  return String(id || "").replace(/\/+$/, "");
}

function fragmentId(base, fragment) {
  const root = stripSlash(base);
  if (!root) return `#${fragment}`;
  if (root.includes("#")) return `${root}-${fragment}`;
  return `${root}#${fragment}`;
}

function isHttpUrl(value) {
  if (!value || typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function emptyDraft() {
  return {
    serviceId: "https://example.org/servizi/nuovo-servizio/",
    title: "",
    abstract: "",
    description: "",
    orgId: "https://example.org/",
    orgName: "",
    orgHomepage: "https://example.org/",
    audience: "",
    inputs: [""],
    outputs: [""],
    processingTime: "",
    cost: "",
    pageUrl: "",
    onlineUrls: [""],
    lifeEvents: [],
    themes: [],
    ioServiceId: "",
    howTo: "",
  };
}

export function cloneDraft(draft) {
  return structuredClone(draft);
}

export function draftHasContent(draft) {
  if (!draft) return false;
  const keys = [
    "title",
    "abstract",
    "description",
    "orgName",
    "audience",
    "processingTime",
    "cost",
    "pageUrl",
    "ioServiceId",
    "howTo",
  ];
  if (keys.some((k) => String(draft[k] || "").trim())) return true;
  if ((draft.inputs || []).some((v) => String(v || "").trim())) return true;
  if ((draft.outputs || []).some((v) => String(v || "").trim())) return true;
  if ((draft.onlineUrls || []).some((v) => String(v || "").trim())) return true;
  if ((draft.lifeEvents || []).length || (draft.themes || []).length) return true;
  return false;
}

export function validateDraft(draft) {
  const errors = [];
  if (!String(draft.serviceId || "").trim()) {
    errors.push("L’identificativo del servizio (@id) è obbligatorio.");
  } else if (!isHttpUrl(draft.serviceId) && !String(draft.serviceId).includes(":")) {
    errors.push("L’identificativo del servizio deve essere un IRI (http/https o CURIE).");
  }
  if (!String(draft.title || "").trim()) {
    errors.push("Il titolo è obbligatorio.");
  }
  for (const [label, value] of [
    ["Homepage ente", draft.orgHomepage],
    ["Pagina ufficiale", draft.pageUrl],
    ...((draft.onlineUrls || []).map((url, i) => [`Canale online ${i + 1}`, url])),
  ]) {
    const text = String(value || "").trim();
    if (text && !isHttpUrl(text)) {
      errors.push(`${label}: URL non valido (serve http o https).`);
    }
  }
  return errors;
}

function compactTexts(values) {
  return (values || []).map((v) => String(v || "").trim()).filter(Boolean);
}

export function formToDocument(draft) {
  const serviceId = String(draft.serviceId || "").trim();
  const titleLit = lit(draft.title);
  const orgId = String(draft.orgId || "").trim() || fragmentId(serviceId, "ente");
  const graph = [];

  const service = {
    "@id": serviceId,
    "@type": "cpsv:PublicService",
  };
  if (titleLit) {
    service["cpsv:name"] = titleLit;
    service["dct:title"] = titleLit;
  }
  const abstractLit = lit(draft.abstract);
  if (abstractLit) service["dct:abstract"] = abstractLit;
  const descriptionLit = lit(draft.description);
  if (descriptionLit) service["dct:description"] = descriptionLit;

  service["cpsv:producedBy"] = { "@id": orgId };
  service["cv:hasCompetentAuthority"] = { "@id": orgId };

  const pageUrl = String(draft.pageUrl || "").trim() || serviceId;
  service["foaf:page"] = pageUrl;

  const org = {
    "@id": orgId,
    "@type": "cv:PublicOrganisation",
  };
  const orgTitle = lit(draft.orgName);
  if (orgTitle) org["dct:title"] = orgTitle;
  const homepage = String(draft.orgHomepage || "").trim();
  if (homepage) org["foaf:homepage"] = homepage;
  graph.push(org);

  const audienceText = String(draft.audience || "").trim();
  if (audienceText) {
    const agentId = fragmentId(serviceId, "addressee");
    service["cv:addressee"] = { "@id": agentId };
    graph.push({
      "@id": agentId,
      "@type": "cv:Agent",
      "dct:description": lit(audienceText),
    });
  }

  const inputs = compactTexts(draft.inputs);
  if (inputs.length) {
    const refs = inputs.map((text, index) => {
      const id = fragmentId(serviceId, `input-${index}`);
      graph.push({
        "@id": id,
        "@type": "cpsv:Input",
        "dct:description": lit(text),
      });
      return { "@id": id };
    });
    service["cpsv:hasInput"] = refs.length === 1 ? refs[0] : refs;
  }

  const outputs = compactTexts(draft.outputs);
  if (outputs.length) {
    const refs = outputs.map((text, index) => {
      const id = fragmentId(serviceId, `output-${index}`);
      graph.push({
        "@id": id,
        "@type": "cpsv:Output",
        "dct:description": lit(text),
      });
      return { "@id": id };
    });
    service["cpsv:hasOutput"] = refs.length === 1 ? refs[0] : refs;
  }

  const processing = String(draft.processingTime || "").trim();
  if (processing) {
    const timeId = fragmentId(serviceId, "processing-time");
    service["cpsv:hasProcessingTime"] = { "@id": timeId };
    graph.push({
      "@id": timeId,
      "@type": "cpsv:ServiceProcessingTime",
      "dct:description": lit(processing),
    });
  }

  const costLit = lit(draft.cost);
  if (costLit) service["cpsv:hasCost"] = costLit;

  if (pageUrl) {
    const websiteId = fragmentId(serviceId, "channel-website");
    service["cpsv:hasWebSiteChannel"] = { "@id": websiteId };
    graph.push({
      "@id": websiteId,
      "@type": "cpsv:WebSiteChannel",
      "dct:title": lit("Scheda sul sito"),
      "foaf:page": pageUrl,
    });
  }

  const onlineUrls = compactTexts(draft.onlineUrls);
  if (onlineUrls.length) {
    const refs = onlineUrls.map((url, index) => {
      const id = fragmentId(serviceId, `channel-online-${index}`);
      graph.push({
        "@id": id,
        "@type": "cpsv:OtherElectronicChannel",
        "foaf:page": url,
      });
      return { "@id": id };
    });
    service["cpsv:hasOtherElectronicChannel"] = refs.length === 1 ? refs[0] : refs;
  }

  const lifeEvents = (draft.lifeEvents || []).filter(Boolean);
  if (lifeEvents.length) {
    const refs = lifeEvents.map((id) => ({ "@id": id }));
    service["cpsv:isPartOfEvent"] = refs.length === 1 ? refs[0] : refs;
  }
  const themes = (draft.themes || []).filter(Boolean);
  if (themes.length) {
    const refs = themes.map((id) => ({ "@id": id }));
    service["cpsv:hasTheme"] = refs.length === 1 ? refs[0] : refs;
  }

  const ioId = String(draft.ioServiceId || "").trim();
  if (ioId) service["io:serviceId"] = ioId;
  const howTo = lit(draft.howTo);
  if (howTo) service["ex:howTo"] = howTo;

  graph.unshift(service);
  return {
    "@context": { ...CONTEXT },
    "@graph": graph,
  };
}

function nodeById(graph, id) {
  if (!id) return null;
  return graph.find((node) => node && node["@id"] === id) || null;
}

function textsFromRefs(graph, refs) {
  return asList(refs)
    .map((ref) => {
      const id = refId(ref);
      const node = nodeById(graph, id);
      return readLit(node?.["dct:description"]) || readLit(node?.["dct:title"]) || "";
    })
    .filter(Boolean);
}

function idsFromRefs(refs) {
  return asList(refs)
    .map((ref) => refId(ref))
    .filter(Boolean);
}

export function listPublicServices(doc) {
  const graph = Array.isArray(doc?.["@graph"]) ? doc["@graph"] : [];
  return graph
    .filter(isPublicService)
    .map((node) => ({
      id: node["@id"],
      title: readLit(node["dct:title"]) || readLit(node["cpsv:name"]) || node["@id"],
    }))
    .sort((a, b) => String(a.title).localeCompare(String(b.title), "it"));
}

function collectRefIds(node) {
  const ids = [];
  const walk = (value) => {
    if (!value || typeof value !== "object") return;
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    if (typeof value["@id"] === "string") ids.push(value["@id"]);
    for (const [key, child] of Object.entries(value)) {
      if (key === "@id" || key === "@context") continue;
      walk(child);
    }
  };
  for (const [key, child] of Object.entries(node || {})) {
    if (key === "@id" || key === "@context") continue;
    walk(child);
  }
  return ids;
}

/** PublicService + nodi referenziati; non segue altri PublicService. */
export function serviceSlice(doc, serviceId) {
  const graph = Array.isArray(doc?.["@graph"]) ? doc["@graph"] : [];
  const byId = new Map();
  for (const node of graph) {
    if (node?.["@id"]) byId.set(String(node["@id"]), node);
  }
  const service =
    byId.get(serviceId) ||
    graph.find((node) => node?.["@id"] === serviceId && isPublicService(node));
  if (!service || !isPublicService(service)) {
    throw new Error(`Servizio non trovato: ${serviceId}`);
  }
  const included = [];
  const seen = new Set();
  const queue = [service];
  while (queue.length) {
    const node = queue.pop();
    const id = node?.["@id"] ? String(node["@id"]) : null;
    if (id && seen.has(id)) continue;
    if (id) seen.add(id);
    included.push(node);
    for (const ref of collectRefIds(node)) {
      if (seen.has(ref)) continue;
      const next = byId.get(ref);
      if (!next) continue;
      if (next !== service && isPublicService(next)) continue;
      queue.push(next);
    }
  }
  return {
    "@context": doc?.["@context"] || { ...CONTEXT },
    "@graph": included,
  };
}

/**
 * Sostituisce lo slice del servizio precedente con i nodi della bozza.
 * I nodi condivisi (es. ente usato da altri servizi) restano e vengono aggiornati.
 */
export function mergeDraftIntoCatalog(catalogDoc, draft, previousServiceId) {
  if (!catalogDoc || !Array.isArray(catalogDoc["@graph"])) {
    return formToDocument(draft);
  }
  const catalog = structuredClone(catalogDoc);
  const graph = catalog["@graph"];
  const oldSlice = serviceSlice(catalog, previousServiceId);
  const sliceIds = new Set(
    oldSlice["@graph"].map((node) => node?.["@id"]).filter(Boolean).map(String),
  );

  const referencedByOthers = new Set();
  for (const node of graph) {
    if (!isPublicService(node)) continue;
    if (String(node["@id"]) === String(previousServiceId)) continue;
    for (const id of collectRefIds(node)) referencedByOthers.add(id);
    // include nodes reachable from other services
    try {
      const otherSlice = serviceSlice(catalog, node["@id"]);
      for (const n of otherSlice["@graph"]) {
        if (n?.["@id"]) referencedByOthers.add(String(n["@id"]));
      }
    } catch {
      /* ignore broken refs */
    }
  }

  const newDoc = formToDocument(draft);
  const newById = new Map(
    newDoc["@graph"]
      .filter((node) => node?.["@id"])
      .map((node) => [String(node["@id"]), node]),
  );

  const kept = [];
  for (const node of graph) {
    const id = node?.["@id"] ? String(node["@id"]) : null;
    if (!id || !sliceIds.has(id)) {
      kept.push(node);
      continue;
    }
    if (id === String(previousServiceId)) continue;
    if (referencedByOthers.has(id) && id !== String(previousServiceId)) {
      if (newById.has(id)) {
        kept.push(newById.get(id));
        newById.delete(id);
      } else {
        kept.push(node);
      }
      continue;
    }
    // exclusive to previous slice — drop
  }

  for (const node of newById.values()) {
    kept.push(node);
  }

  const prevContext =
    catalog["@context"] && typeof catalog["@context"] === "object" && !Array.isArray(catalog["@context"])
      ? catalog["@context"]
      : {};
  catalog["@context"] = { ...CONTEXT, ...prevContext };
  catalog["@graph"] = kept;
  return catalog;
}

export function catalogServiceCount(doc) {
  return listPublicServices(doc).length;
}

export function documentToForm(doc, serviceId = null) {
  const graph = Array.isArray(doc?.["@graph"]) ? doc["@graph"] : [];
  let service = null;
  if (serviceId) {
    service = graph.find((node) => node?.["@id"] === serviceId && isPublicService(node));
  }
  if (!service) {
    service = graph.find(isPublicService);
  }
  if (!service && doc && !doc["@graph"] && isPublicService(doc)) {
    return documentToForm({ "@graph": [doc] }, serviceId);
  }
  if (!service) {
    throw new Error("Nel documento non c’è nessun cpsv:PublicService.");
  }

  const draft = emptyDraft();
  draft.serviceId = service["@id"] || draft.serviceId;
  draft.title = readLit(service["dct:title"]) || readLit(service["cpsv:name"]);
  draft.abstract = readLit(service["dct:abstract"]);
  draft.description = readLit(service["dct:description"]);
  draft.pageUrl = typeof service["foaf:page"] === "string" ? service["foaf:page"] : "";
  draft.cost = readLit(service["cpsv:hasCost"]);
  draft.ioServiceId =
    typeof service["io:serviceId"] === "string" ? service["io:serviceId"] : "";
  draft.howTo = readLit(service["ex:howTo"]);

  const orgRef =
    refId(service["cv:hasCompetentAuthority"]) || refId(service["cpsv:producedBy"]);
  const org = nodeById(graph, orgRef);
  if (org) {
    draft.orgId = org["@id"] || orgRef;
    draft.orgName = readLit(org["dct:title"]);
    draft.orgHomepage =
      typeof org["foaf:homepage"] === "string" ? org["foaf:homepage"] : "";
  } else if (orgRef) {
    draft.orgId = orgRef;
  }

  const audienceTexts = textsFromRefs(graph, service["cv:addressee"]);
  draft.audience = audienceTexts[0] || "";

  const inputs = textsFromRefs(graph, service["cpsv:hasInput"]);
  draft.inputs = inputs.length ? inputs : [""];
  const outputs = textsFromRefs(graph, service["cpsv:hasOutput"]);
  draft.outputs = outputs.length ? outputs : [""];

  const times = textsFromRefs(graph, service["cpsv:hasProcessingTime"]);
  draft.processingTime = times[0] || "";

  const websitePages = asList(service["cpsv:hasWebSiteChannel"])
    .map((ref) => nodeById(graph, refId(ref)))
    .map((node) => (typeof node?.["foaf:page"] === "string" ? node["foaf:page"] : ""))
    .filter(Boolean);
  if (!draft.pageUrl && websitePages[0]) draft.pageUrl = websitePages[0];

  const online = [];
  for (const key of ["cpsv:hasOtherElectronicChannel", "cpsv:hasChannel"]) {
    for (const ref of asList(service[key])) {
      const node = nodeById(graph, refId(ref));
      if (node && typeof node["foaf:page"] === "string") online.push(node["foaf:page"]);
      else if (typeof ref === "object" && typeof ref["foaf:page"] === "string") {
        online.push(ref["foaf:page"]);
      }
    }
  }
  draft.onlineUrls = online.length ? [...new Set(online)] : [""];

  draft.lifeEvents = idsFromRefs(service["cpsv:isPartOfEvent"]);
  draft.themes = idsFromRefs(service["cpsv:hasTheme"]);

  return draft;
}

export function parseJsonLdText(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch (error) {
    throw new Error(`JSON non valido: ${error.message}`);
  }
  if (!data || typeof data !== "object") {
    throw new Error("Il JSON-LD deve essere un oggetto.");
  }
  if (Array.isArray(data)) {
    return { "@context": { ...CONTEXT }, "@graph": data };
  }
  if (!data["@graph"] && isPublicService(data)) {
    return {
      "@context": data["@context"] || { ...CONTEXT },
      "@graph": [data],
    };
  }
  if (!Array.isArray(data["@graph"])) {
    throw new Error("Serve un documento con @graph (array) o un singolo PublicService.");
  }
  return data;
}

export function filenameForDraft(draft) {
  const raw = String(draft.title || "").trim() || "scheda";
  const slug = raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  return `scheda-${slug || "cpsv"}.jsonld`;
}

export function playgroundUrl(document) {
  const json = JSON.stringify(document, null, 2);
  const hash = new URLSearchParams();
  hash.set("json-ld", json);
  hash.set("startTab", "tab-expanded");
  return `https://json-ld.org/playground/#${hash.toString()}`;
}

export function loadSessionFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // migrazione bozza legacy
      const legacy = localStorage.getItem("cpsv-scheda-draft");
      if (!legacy) return null;
      const data = JSON.parse(legacy);
      return {
        draft: { ...emptyDraft(), ...data },
        catalogDoc: null,
        activeServiceId: data.serviceId || null,
        catalogPersisted: false,
      };
    }
    const data = JSON.parse(raw);
    return {
      draft: { ...emptyDraft(), ...(data.draft || {}) },
      catalogDoc: data.catalogDoc || null,
      activeServiceId: data.activeServiceId || data.draft?.serviceId || null,
      catalogPersisted: Boolean(data.catalogDoc),
    };
  } catch {
    return null;
  }
}

/** @deprecated usa loadSessionFromStorage */
export function loadDraftFromStorage() {
  return loadSessionFromStorage()?.draft || null;
}

export function saveSessionToStorage({ draft, catalogDoc, activeServiceId }) {
  const base = {
    draft,
    activeServiceId: activeServiceId || draft?.serviceId || null,
    catalogDoc: null,
  };
  try {
    if (catalogDoc) {
      const withCatalog = { ...base, catalogDoc };
      const json = JSON.stringify(withCatalog);
      if (json.length <= STORAGE_MAX_BYTES) {
        localStorage.setItem(STORAGE_KEY, json);
        return { savedCatalog: true };
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(base));
    return { savedCatalog: false };
  } catch {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(base));
    } catch {
      /* quota */
    }
    return { savedCatalog: false };
  }
}

export function saveDraftToStorage(draft) {
  saveSessionToStorage({ draft, catalogDoc: null, activeServiceId: draft?.serviceId });
}

export function clearDraftStorage() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem("cpsv-scheda-draft");
}

export function filenameForCatalog() {
  return "catalogo-cpsv.jsonld";
}

export function labelMapEntries(map) {
  return Object.entries(map || {}).map(([id, label]) => ({ id, label }));
}
