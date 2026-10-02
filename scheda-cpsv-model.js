/** Stato form ↔ documento JSON-LD CPSV (forma di produzione). */

export const CONTEXT = {
  cpsv: "https://w3id.org/italia/onto/CPSV#",
  cv: "http://data.europa.eu/m8g/",
  dct: "http://purl.org/dc/terms/",
  foaf: "http://xmlns.com/foaf/0.1/",
  io: "https://io.italia.it/onto/io#",
  ex: "https://example.org/onto/ex#",
  xsd: "http://www.w3.org/2001/XMLSchema#",
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

/** Interpreta xsd:duration → UI (unità + quantità). */
export function parseDurationUi(duration) {
  const raw = String(duration || "").trim().toUpperCase();
  if (!raw) return { kind: "", amount: "" };
  if (raw === "PT0S" || raw === "P0D" || raw === "PT0H") {
    return { kind: "immediate", amount: "" };
  }
  const weeks = raw.match(/^P(\d+)W$/);
  if (weeks) return { kind: "weeks", amount: Number(weeks[1]) };
  const months = raw.match(/^P(\d+)M$/);
  if (months) return { kind: "months", amount: Number(months[1]) };
  const days = raw.match(/^P(\d+)D$/);
  if (days) return { kind: "days", amount: Number(days[1]) };
  const hours = raw.match(/^PT(\d+)H$/);
  if (hours) return { kind: "hours", amount: Number(hours[1]) };
  const dayPart = raw.match(/P(\d+)D/);
  if (dayPart) return { kind: "days", amount: Number(dayPart[1]) };
  const hourPart = raw.match(/PT(\d+)H/);
  if (hourPart) return { kind: "hours", amount: Number(hourPart[1]) };
  return { kind: "", amount: "" };
}

/** Compone xsd:duration da UI assistita. */
export function composeDuration(kind, amount) {
  const k = String(kind || "");
  if (k === "immediate") return "PT0S";
  if (!k) return "";
  const n = Number(amount);
  if (!Number.isFinite(n) || n <= 0) return "";
  const int = Math.round(n);
  if (k === "hours") return `PT${int}H`;
  if (k === "days") return `P${int}D`;
  if (k === "weeks") return `P${int}W`;
  if (k === "months") return `P${int}M`;
  return "";
}

export function formatDurationLabel(duration) {
  const ui = parseDurationUi(duration);
  if (ui.kind === "immediate") return "Immediato";
  if (ui.kind === "hours") return ui.amount === 1 ? "1 ora" : `${ui.amount} ore`;
  if (ui.kind === "days") return ui.amount === 1 ? "1 giorno" : `${ui.amount} giorni`;
  if (ui.kind === "weeks") return ui.amount === 1 ? "1 settimana" : `${ui.amount} settimane`;
  if (ui.kind === "months") return ui.amount === 1 ? "1 mese" : `${ui.amount} mesi`;
  return String(duration || "");
}

export function emptyTypedItem() {
  return { text: "", typeId: "" };
}

export function emptyProcessingTime() {
  return { text: "", kind: "", amount: "", duration: "" };
}

export function emptyCost() {
  return { text: "", amount: "", currency: "EUR" };
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
    inputs: [emptyTypedItem()],
    outputs: [emptyTypedItem()],
    processingTime: emptyProcessingTime(),
    cost: emptyCost(),
    pageUrl: "",
    onlineUrls: [""],
    lifeEvents: [],
    themes: [],
    ioServiceId: "",
    howTo: "",
  };
}

function normalizeTypedList(values) {
  const list = Array.isArray(values) ? values : [];
  const mapped = list.map((item) => {
    if (typeof item === "string") return { text: item, typeId: "" };
    return {
      text: String(item?.text ?? "").trim() ? String(item.text) : String(item?.text || ""),
      typeId: String(item?.typeId || "").trim(),
    };
  });
  return mapped.length ? mapped : [emptyTypedItem()];
}

function normalizeProcessingTime(value) {
  if (typeof value === "string") {
    return { text: value, kind: "", amount: "", duration: "" };
  }
  let kind = String(value?.kind || "").trim();
  let amount =
    value?.amount === 0 || value?.amount === "0"
      ? 0
      : value?.amount == null || value?.amount === ""
        ? ""
        : Number(value.amount);
  if (amount !== "" && Number.isNaN(amount)) amount = "";
  let duration = String(value?.duration || "").trim();
  if (!kind && duration) {
    const parsed = parseDurationUi(duration);
    kind = parsed.kind;
    amount = parsed.amount === "" ? "" : parsed.amount;
  }
  if (kind) duration = composeDuration(kind, amount);
  return {
    text: String(value?.text || ""),
    kind,
    amount,
    duration,
  };
}

function normalizeCost(value) {
  if (typeof value === "string") return { text: value, amount: "", currency: "EUR" };
  const amount = value?.amount;
  return {
    text: String(value?.text || ""),
    amount: amount === 0 || amount === "0" ? 0 : amount == null || amount === "" ? "" : amount,
    currency: String(value?.currency || "EUR").trim() || "EUR",
  };
}

/** Normalizza bozze legacy (stringhe) verso la forma tipizzata. */
export function normalizeDraft(draft) {
  const base = { ...emptyDraft(), ...(draft || {}) };
  base.inputs = normalizeTypedList(base.inputs);
  base.outputs = normalizeTypedList(base.outputs);
  base.processingTime = normalizeProcessingTime(base.processingTime);
  base.cost = normalizeCost(base.cost);
  return base;
}

export function cloneDraft(draft) {
  return structuredClone(normalizeDraft(draft));
}

export function draftHasContent(draft) {
  if (!draft) return false;
  const d = normalizeDraft(draft);
  const keys = ["title", "abstract", "description", "orgName", "audience", "pageUrl", "ioServiceId", "howTo"];
  if (keys.some((k) => String(d[k] || "").trim())) return true;
  if (
    String(d.processingTime?.text || "").trim() ||
    String(d.processingTime?.duration || "").trim() ||
    String(d.processingTime?.kind || "").trim()
  ) {
    return true;
  }
  if (
    String(d.cost?.text || "").trim() ||
    d.cost?.amount === 0 ||
    (d.cost?.amount !== "" && d.cost?.amount != null)
  ) {
    return true;
  }
  if ((d.inputs || []).some((v) => String(v.text || "").trim() || String(v.typeId || "").trim())) {
    return true;
  }
  if ((d.outputs || []).some((v) => String(v.text || "").trim() || String(v.typeId || "").trim())) {
    return true;
  }
  if ((d.onlineUrls || []).some((v) => String(v || "").trim())) return true;
  if ((d.lifeEvents || []).length || (d.themes || []).length) return true;
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

function compactTypedItems(values) {
  return normalizeTypedList(values).filter(
    (item) => String(item.text || "").trim() || String(item.typeId || "").trim(),
  );
}

function readDuration(value) {
  if (value == null) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "object") {
    if (typeof value["@value"] === "string") return value["@value"].trim();
    if (typeof value["@value"] === "number") return String(value["@value"]);
  }
  return "";
}

function readAmount(value) {
  if (value == null || value === "") return "";
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim()) {
    const n = Number(value.replace(",", "."));
    return Number.isNaN(n) ? "" : n;
  }
  if (typeof value === "object" && value["@value"] != null) return readAmount(value["@value"]);
  return "";
}

function typedItemsFromRefs(graph, refs) {
  return asList(refs)
    .map((ref) => {
      const id = refId(ref);
      const node = nodeById(graph, id) || (typeof ref === "object" && !ref["@id"] ? ref : null);
      if (!node && typeof ref === "string") return null;
      const text =
        readLit(node?.["dct:description"]) ||
        readLit(node?.["dct:title"]) ||
        readLit(node?.["rdfs:comment"]) ||
        "";
      const typeId = refId(node?.["dct:type"]) || "";
      if (!text && !typeId) return null;
      return { text, typeId };
    })
    .filter(Boolean);
}

export function formToDocument(draft) {
  const d = normalizeDraft(draft);
  const serviceId = String(d.serviceId || "").trim();
  const titleLit = lit(d.title);
  const orgId = String(d.orgId || "").trim() || fragmentId(serviceId, "ente");
  const graph = [];

  const service = {
    "@id": serviceId,
    "@type": "cpsv:PublicService",
  };
  if (titleLit) {
    service["cpsv:name"] = titleLit;
    service["dct:title"] = titleLit;
  }
  const abstractLit = lit(d.abstract);
  if (abstractLit) service["dct:abstract"] = abstractLit;
  const descriptionLit = lit(d.description);
  if (descriptionLit) service["dct:description"] = descriptionLit;

  service["cpsv:producedBy"] = { "@id": orgId };
  service["cv:hasCompetentAuthority"] = { "@id": orgId };

  const pageUrl = String(d.pageUrl || "").trim() || serviceId;
  service["foaf:page"] = pageUrl;

  const org = {
    "@id": orgId,
    "@type": "cv:PublicOrganisation",
  };
  const orgTitle = lit(d.orgName);
  if (orgTitle) org["dct:title"] = orgTitle;
  const homepage = String(d.orgHomepage || "").trim();
  if (homepage) org["foaf:homepage"] = homepage;
  graph.push(org);

  const audienceText = String(d.audience || "").trim();
  if (audienceText) {
    const agentId = fragmentId(serviceId, "addressee");
    service["cv:addressee"] = { "@id": agentId };
    graph.push({
      "@id": agentId,
      "@type": "cv:Agent",
      "dct:description": lit(audienceText),
    });
  }

  const inputs = compactTypedItems(d.inputs);
  if (inputs.length) {
    const refs = inputs.map((item, index) => {
      const id = fragmentId(serviceId, `input-${index}`);
      const node = {
        "@id": id,
        "@type": "cpsv:Input",
      };
      const desc = lit(item.text);
      if (desc) node["dct:description"] = desc;
      if (item.typeId) node["dct:type"] = { "@id": item.typeId };
      graph.push(node);
      return { "@id": id };
    });
    service["cpsv:hasInput"] = refs.length === 1 ? refs[0] : refs;
  }

  const outputs = compactTypedItems(d.outputs);
  if (outputs.length) {
    const refs = outputs.map((item, index) => {
      const id = fragmentId(serviceId, `output-${index}`);
      const node = {
        "@id": id,
        "@type": "cpsv:Output",
      };
      const desc = lit(item.text);
      if (desc) node["dct:description"] = desc;
      if (item.typeId) node["dct:type"] = { "@id": item.typeId };
      graph.push(node);
      return { "@id": id };
    });
    service["cpsv:hasOutput"] = refs.length === 1 ? refs[0] : refs;
  }

  const processingText = String(d.processingTime?.text || "").trim();
  const processingDuration =
    composeDuration(d.processingTime?.kind, d.processingTime?.amount) ||
    String(d.processingTime?.duration || "").trim();
  if (processingText || processingDuration || d.processingTime?.kind === "immediate") {
    const timeId = fragmentId(serviceId, "processing-time");
    service["cpsv:hasProcessingTime"] = { "@id": timeId };
    const timeNode = {
      "@id": timeId,
      "@type": "cpsv:ServiceProcessingTime",
    };
    const desc = lit(processingText);
    if (desc) timeNode["dct:description"] = desc;
    const durationValue =
      processingDuration ||
      (d.processingTime?.kind === "immediate" ? "PT0S" : "");
    if (durationValue) {
      timeNode["cv:value"] = { "@type": "xsd:duration", "@value": durationValue };
    }
    graph.push(timeNode);
  }

  const costText = String(d.cost?.text || "").trim();
  const costAmount = d.cost?.amount;
  const hasAmount =
    costAmount === 0 || (costAmount !== "" && costAmount != null && !Number.isNaN(Number(costAmount)));
  const costCurrency = String(d.cost?.currency || "").trim() || "EUR";
  if (hasAmount) {
    const costId = fragmentId(serviceId, "cost");
    service["cpsv:hasCost"] = { "@id": costId };
    const costNode = {
      "@id": costId,
      "@type": "cv:Cost",
    };
    const desc = lit(costText);
    if (desc) costNode["dct:description"] = desc;
    costNode["cv:value"] = Number(costAmount);
    costNode["cv:currency"] = costCurrency;
    graph.push(costNode);
  } else {
    const costLit = lit(costText);
    if (costLit) service["cpsv:hasCost"] = costLit;
  }

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

  const onlineUrls = compactTexts(d.onlineUrls);
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

  const lifeEvents = (d.lifeEvents || []).filter(Boolean);
  if (lifeEvents.length) {
    const refs = lifeEvents.map((id) => ({ "@id": id }));
    service["cpsv:isPartOfEvent"] = refs.length === 1 ? refs[0] : refs;
  }
  const themes = (d.themes || []).filter(Boolean);
  if (themes.length) {
    const refs = themes.map((id) => ({ "@id": id }));
    service["cpsv:hasTheme"] = refs.length === 1 ? refs[0] : refs;
  }

  const ioId = String(d.ioServiceId || "").trim();
  if (ioId) service["io:serviceId"] = ioId;
  const howTo = lit(d.howTo);
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

  const inputs = typedItemsFromRefs(graph, service["cpsv:hasInput"]);
  draft.inputs = inputs.length ? inputs : [emptyTypedItem()];
  const outputs = typedItemsFromRefs(graph, service["cpsv:hasOutput"]);
  draft.outputs = outputs.length ? outputs : [emptyTypedItem()];

  const timeRef = refId(asList(service["cpsv:hasProcessingTime"])[0]);
  const timeNode = nodeById(graph, timeRef);
  if (timeNode) {
    const duration = readDuration(timeNode["cv:value"]);
    const parsed = parseDurationUi(duration);
    draft.processingTime = {
      text: readLit(timeNode["dct:description"]) || readLit(timeNode["dct:title"]),
      duration,
      kind: parsed.kind,
      amount: parsed.amount,
    };
  } else {
    const aciTime = readLit(service["aci:processingTime"]);
    if (aciTime) draft.processingTime = { text: aciTime, duration: "", kind: "", amount: "" };
  }

  const costRaw = service["cpsv:hasCost"];
  const costId = refId(costRaw);
  const costNode = costId ? nodeById(graph, costId) : null;
  if (costNode) {
    draft.cost = {
      text: readLit(costNode["dct:description"]) || readLit(costNode["dct:title"]),
      amount: readAmount(costNode["cv:value"]),
      currency:
        typeof costNode["cv:currency"] === "string"
          ? costNode["cv:currency"]
          : readLit(costNode["cv:currency"]) || "EUR",
    };
  } else {
    const costText = readLit(costRaw) || readLit(service["aci:costDescription"]);
    draft.cost = { text: costText, amount: "", currency: "EUR" };
  }

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

  return normalizeDraft(draft);
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
        draft: normalizeDraft({ ...emptyDraft(), ...data }),
        catalogDoc: null,
        activeServiceId: data.serviceId || null,
        catalogPersisted: false,
      };
    }
    const data = JSON.parse(raw);
    return {
      draft: normalizeDraft({ ...emptyDraft(), ...(data.draft || {}) }),
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
