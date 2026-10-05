import {
  clearDraftStorage,
  documentToForm,
  draftHasContent,
  emptyDraft,
  emptyTypedItem,
  filenameForCatalog,
  filenameForDraft,
  formToDocument,
  labelMapEntries,
  listPublicServices,
  loadSessionFromStorage,
  mergeDraftIntoCatalog,
  normalizeDraft,
  parseJsonLdText,
  playgroundUrl,
  saveSessionToStorage,
  validateDraft,
} from "./scheda-cpsv-model.js";
import { applySuggestions } from "./scheda-cpsv-suggest.js";

const root = document.getElementById("editor-root");
const statusEl = document.getElementById("app-status");
const pasteDialog = document.getElementById("paste-dialog");
const pasteInput = document.getElementById("paste-input");
const pickDialog = document.getElementById("pick-dialog");
const pickList = document.getElementById("pick-list");
const exportCatalogBtn = document.getElementById("btn-export-catalog");

let draft = emptyDraft();
let catalogDoc = null;
let activeServiceId = null;
let catalogFilter = "";
let lifeEvents = [];
let themes = [];
let inputTypes = [];
let outputTypes = [];
let concepts = [];
let pendingDoc = null;
let saveTimer = null;

function toast(message) {
  statusEl.textContent = message;
  statusEl.classList.add("is-visible");
  window.clearTimeout(toast._t);
  toast._t = window.setTimeout(() => {
    statusEl.classList.remove("is-visible");
  }, 3200);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function stripHtml(value) {
  const tmp = document.createElement("div");
  tmp.innerHTML = value || "";
  return tmp.textContent || tmp.innerText || "";
}

function catalogServices() {
  return catalogDoc ? listPublicServices(catalogDoc) : [];
}

function hasMultiCatalog() {
  return catalogServices().length > 1;
}

function persistSession() {
  const result = saveSessionToStorage({
    draft,
    catalogDoc: hasMultiCatalog() ? catalogDoc : null,
    activeServiceId,
  });
  updateExportVisibility();
  return result;
}

function scheduleSave() {
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    const result = persistSession();
    if (hasMultiCatalog() && result.savedCatalog === false) {
      toast("Catalogo troppo grande per la bozza locale: resta solo la scheda corrente.");
    }
  }, 300);
}

function updateExportVisibility() {
  exportCatalogBtn.hidden = !hasMultiCatalog();
}

function commitDraftToCatalog() {
  if (!catalogDoc || !activeServiceId) return;
  readFormIntoDraft();
  catalogDoc = mergeDraftIntoCatalog(catalogDoc, draft, activeServiceId);
  activeServiceId = draft.serviceId;
}

function readFormIntoDraft() {
  const form = root.querySelector("#scheda-form");
  if (!form) return;
  const data = new FormData(form);
  draft.serviceId = String(data.get("serviceId") || "").trim();
  draft.title = String(data.get("title") || "").trim();
  draft.abstract = String(data.get("abstract") || "").trim();
  draft.description = String(data.get("description") || "").trim();
  draft.orgId = String(data.get("orgId") || "").trim();
  draft.orgName = String(data.get("orgName") || "").trim();
  draft.orgHomepage = String(data.get("orgHomepage") || "").trim();
  draft.audience = String(data.get("audience") || "").trim();
  draft.processingTime = {
    text: String(data.get("processingTime") || "").trim(),
    kind: String(form.querySelector("#durationKind")?.value || "").trim(),
    amount: String(form.querySelector("#durationAmount")?.value || "").trim(),
  };
  const amountRaw = String(data.get("costAmount") || "").trim();
  draft.cost = {
    text: String(data.get("cost") || "").trim(),
    amount: amountRaw === "" ? "" : Number(amountRaw.replace(",", ".")),
    currency: String(data.get("costCurrency") || "EUR").trim() || "EUR",
  };
  if (amountRaw !== "" && Number.isNaN(draft.cost.amount)) draft.cost.amount = "";
  draft.pageUrl = String(data.get("pageUrl") || "").trim();
  draft.ioServiceId = String(data.get("ioServiceId") || "").trim();
  draft.howTo = String(data.get("howTo") || "").trim();
  draft.inputs = [...form.querySelectorAll("[data-typed='inputs']")].map((row) => ({
    text: row.querySelector('[name="inputText"]')?.value || "",
    typeId: row.querySelector('[name="inputType"]')?.value || "",
    conceptId: row.querySelector('[name="inputConcept"]')?.value || "",
  }));
  draft.outputs = [...form.querySelectorAll("[data-typed='outputs']")].map((row) => ({
    text: row.querySelector('[name="outputText"]')?.value || "",
    typeId: row.querySelector('[name="outputType"]')?.value || "",
    conceptId: row.querySelector('[name="outputConcept"]')?.value || "",
  }));
  draft.onlineUrls = [...form.querySelectorAll('[name="onlineUrls"]')].map((el) => el.value);
  draft.lifeEvents = [...form.querySelectorAll("#lifeEvents option:checked")].map(
    (opt) => opt.value,
  );
  draft.themes = [...form.querySelectorAll("#themes option:checked")].map((opt) => opt.value);
  draft = normalizeDraft(draft);
}

function conceptOptionsHtml(entries, selected) {
  const opts = [
    `<option value="">— concetto (opzionale) —</option>`,
    ...entries.map(
      (e) =>
        `<option value="${escapeHtml(e.id)}" ${e.id === selected ? "selected" : ""}>${escapeHtml(e.label)}</option>`,
    ),
  ];
  return opts.join("");
}

function typeOptionsHtml(entries, selected) {
  const opts = [
    `<option value="">— tipo (opzionale) —</option>`,
    ...entries.map(
      ({ id, label }) =>
        `<option value="${escapeHtml(id)}" ${selected === id ? "selected" : ""}>${escapeHtml(label)}</option>`,
    ),
  ];
  if (selected && !entries.some((e) => e.id === selected)) {
    opts.push(
      `<option value="${escapeHtml(selected)}" selected>${escapeHtml(selected)}</option>`,
    );
  }
  return opts.join("");
}

function optionsHtml(entries, selected) {
  const selectedSet = new Set(selected || []);
  return entries
    .map(
      ({ id, label }) =>
        `<option value="${escapeHtml(id)}" ${selectedSet.has(id) ? "selected" : ""}>${escapeHtml(label)}</option>`,
    )
    .join("");
}

function listRows(name, values, placeholder) {
  return (values?.length ? values : [""])
    .map(
      (value, index) => `
      <div class="scheda-list-row" data-list="${name}" data-index="${index}">
        <textarea name="${name}" rows="2" placeholder="${escapeHtml(placeholder)}">${escapeHtml(value)}</textarea>
        <button type="button" data-remove="${name}" data-index="${index}" aria-label="Rimuovi">Rimuovi</button>
      </div>`,
    )
    .join("");
}

function isVocabIri(value) {
  return typeof value === "string" && /^https?:\/\//i.test(value.trim());
}

/** Link alla scheda del concetto di vocabolario controllato (IRI http/https). */
function vocabConceptLink(id, label, className = "") {
  const text = label || id;
  if (!isVocabIri(id)) return escapeHtml(text);
  const cls = className ? ` class="${escapeHtml(className)}"` : "";
  return `<a${cls} href="${escapeHtml(id)}" target="_blank" rel="noopener noreferrer">${escapeHtml(text)}<span class="visually-hidden"> (scheda vocabolario)</span></a>`;
}

function typedListRows(kind, values, placeholder, typeEntries) {
  const items = values?.length ? values : [emptyTypedItem()];
  const textName = kind === "inputs" ? "inputText" : "outputText";
  const typeName = kind === "inputs" ? "inputType" : "outputType";
  const conceptName = kind === "inputs" ? "inputConcept" : "outputConcept";
  return items
    .map((item, index) => {
      const typeId = item.typeId || "";
      const conceptId = item.conceptId || "";
      const vocab =
        typeId && isVocabIri(typeId)
          ? `<a class="scheda-vocab-link" href="${escapeHtml(typeId)}" target="_blank" rel="noopener noreferrer">Scheda tipo nel vocabolario</a>`
          : "";
      const conceptLink =
        conceptId && isVocabIri(conceptId)
          ? `<a class="scheda-vocab-link" href="${escapeHtml(conceptId)}" target="_blank" rel="noopener noreferrer">Scheda concetto</a>`
          : "";
      return `
      <div class="scheda-list-row scheda-list-row--typed" data-typed="${kind}" data-index="${index}">
        <div class="scheda-typed-fields">
          <textarea name="${textName}" rows="2" placeholder="${escapeHtml(placeholder)}">${escapeHtml(item.text || "")}</textarea>
          <select name="${typeName}" aria-label="Tipo">${typeOptionsHtml(typeEntries, typeId)}</select>
          <select name="${conceptName}" aria-label="Concetto">${conceptOptionsHtml(concepts, conceptId)}</select>
          ${vocab}
          ${conceptLink}
        </div>
        <button type="button" data-remove="${kind}" data-index="${index}" aria-label="Rimuovi">Rimuovi</button>
      </div>`;
    })
    .join("");
}

function classificationLinksHtml(ids, entries, emptyLabel) {
  const selected = (ids || []).filter(Boolean);
  if (!selected.length) return `<p class="hint">${escapeHtml(emptyLabel)}</p>`;
  return `<ul class="scheda-vocab-list">${selected
    .map((id) => {
      const label = entries.find((e) => e.id === id)?.label || id;
      return `<li>${vocabConceptLink(id, label, "scheda-vocab-link")}</li>`;
    })
    .join("")}</ul>`;
}

function durationFieldsHtml(processingTime) {
  const kind = String(processingTime?.kind || "").trim();
  const amount = processingTime?.amount;
  const needsAmount = Boolean(kind && kind !== "immediate");
  return `
    <div class="scheda-field scheda-field--inline">
      <div>
        <label for="durationKind">Durata strutturata</label>
        <select id="durationKind" name="durationKind">
          <option value="" ${!kind ? "selected" : ""}>Non specificata</option>
          <option value="immediate" ${kind === "immediate" ? "selected" : ""}>Immediato</option>
          <option value="hours" ${kind === "hours" ? "selected" : ""}>Ore</option>
          <option value="days" ${kind === "days" ? "selected" : ""}>Giorni</option>
          <option value="weeks" ${kind === "weeks" ? "selected" : ""}>Settimane</option>
          <option value="months" ${kind === "months" ? "selected" : ""}>Mesi</option>
        </select>
      </div>
      <div>
        <label for="durationAmount">Quantità</label>
        <input
          id="durationAmount"
          name="durationAmount"
          type="number"
          min="1"
          step="1"
          value="${needsAmount && amount !== "" && amount != null ? escapeHtml(String(amount)) : ""}"
          ${needsAmount ? "" : "disabled"}
          placeholder="es. 30"
        />
      </div>
    </div>
    <p class="hint">Scegli unità e numero: nel JSON-LD viene salvata automaticamente come durata standard.</p>`;
}

function previewVocabPillsHtml() {
  const pills = [
    ...(draft.lifeEvents || []).map((id) => ({
      id,
      label: lifeEvents.find((e) => e.id === id)?.label || id,
    })),
    ...(draft.themes || []).map((id) => ({
      id,
      label: themes.find((e) => e.id === id)?.label || id,
    })),
  ].filter((p) => p.label);
  if (!pills.length) return "";
  return `<div class="scheda-pills">${pills
    .map((p) =>
      isVocabIri(p.id)
        ? `<a class="scheda-pill scheda-pill--link" href="${escapeHtml(p.id)}" target="_blank" rel="noopener noreferrer">${escapeHtml(p.label)}<span class="visually-hidden"> (scheda vocabolario)</span></a>`
        : `<span class="scheda-pill">${escapeHtml(p.label)}</span>`,
    )
    .join("")}</div>`;
}

function filteredCatalogServices() {
  const q = catalogFilter.trim().toLocaleLowerCase("it");
  const all = catalogServices();
  if (!q) return all;
  return all.filter((service) => {
    const hay = `${service.title} ${service.id}`.toLocaleLowerCase("it");
    return hay.includes(q);
  });
}

function catalogListHtml() {
  if (!hasMultiCatalog()) return "";
  const services = filteredCatalogServices();
  const items = services
    .map((service) => {
      const active = service.id === activeServiceId ? "is-active" : "";
      return `
        <li>
          <button type="button" class="${active}" data-switch-id="${escapeHtml(service.id)}">
            ${escapeHtml(service.title)}
            <span class="meta">${escapeHtml(service.id)}</span>
          </button>
        </li>`;
    })
    .join("");
  return `
    <aside class="scheda-panel scheda-catalog" aria-labelledby="catalog-heading">
      <h2 id="catalog-heading">Servizi nel catalogo</h2>
      <p class="scheda-catalog__meta">
        ${catalogServices().length} servizi — stai editando uno alla volta.
      </p>
      <input
        type="search"
        class="scheda-catalog__search"
        id="catalog-search"
        placeholder="Filtra per titolo o IRI"
        value="${escapeHtml(catalogFilter)}"
      />
      <ul class="scheda-catalog__list">${items || "<li>Nessun risultato</li>"}</ul>
    </aside>`;
}

function catalogMobileHtml() {
  if (!hasMultiCatalog()) return "";
  const options = catalogServices()
    .map(
      (service) =>
        `<option value="${escapeHtml(service.id)}" ${service.id === activeServiceId ? "selected" : ""}>${escapeHtml(service.title)}</option>`,
    )
    .join("");
  return `
    <div class="scheda-panel scheda-catalog-mobile">
      <label for="catalog-select"><strong>Cambia servizio</strong></label>
      <select id="catalog-select">${options}</select>
    </div>`;
}

function render() {
  const errors = validateDraft(draft);
  const doc = formToDocument(draft);
  const json = JSON.stringify(doc, null, 2);
  const orgLine = draft.orgName || draft.orgId || "Ente non indicato";
  const previewTitle = draft.title || "Titolo del servizio";
  const previewAbstract = draft.abstract || "";
  const previewBody = draft.description
    ? stripHtml(draft.description)
    : "Descrizione non ancora compilata.";
  const ctaHref = draft.pageUrl || draft.serviceId || "#";
  const ctaDisabled = !(draft.pageUrl || draft.serviceId);
  const multi = hasMultiCatalog();

  root.className = multi ? "scheda-layout" : "scheda-layout scheda-layout--solo";
  root.innerHTML = `
    ${catalogListHtml()}
    <section class="scheda-panel" aria-labelledby="form-heading">
      ${catalogMobileHtml()}
      <h2 id="form-heading">Scheda servizio</h2>
      <p class="scheda-panel__hint">
        ${
          multi
            ? `Catalogo con ${catalogServices().length} servizi. Le modifiche restano nel catalogo quando cambi scheda.`
            : "Compila i campi usati dal catalogo CPSV. L’anteprima a destra si aggiorna subito."
        }
      </p>
      ${
        errors.length
          ? `<div class="scheda-errors" role="alert">${errors.map((e) => escapeHtml(e)).join("<br>")}</div>`
          : ""
      }
      <form id="scheda-form" novalidate>
        <fieldset class="scheda-section">
          <legend>Identità</legend>
          <div class="scheda-field">
            <label for="serviceId">Identificativo servizio (@id)</label>
            <input id="serviceId" name="serviceId" required value="${escapeHtml(draft.serviceId)}" />
          </div>
          <div class="scheda-field">
            <label for="title">Titolo</label>
            <input id="title" name="title" required value="${escapeHtml(draft.title)}" />
          </div>
          <div class="scheda-field">
            <label for="abstract">Abstract <span class="hint">(teaser in elenco)</span></label>
            <textarea id="abstract" name="abstract" rows="2">${escapeHtml(draft.abstract)}</textarea>
          </div>
          <div class="scheda-field">
            <label for="description">Descrizione <span class="hint">(testo o HTML ridotto)</span></label>
            <textarea id="description" name="description" rows="6">${escapeHtml(draft.description)}</textarea>
          </div>
        </fieldset>

        <fieldset class="scheda-section">
          <legend>Ente competente</legend>
          <div class="scheda-field">
            <label for="orgId">Identificativo ente</label>
            <input id="orgId" name="orgId" value="${escapeHtml(draft.orgId)}" />
          </div>
          <div class="scheda-field">
            <label for="orgName">Nome ente</label>
            <input id="orgName" name="orgName" value="${escapeHtml(draft.orgName)}" />
          </div>
          <div class="scheda-field">
            <label for="orgHomepage">Homepage</label>
            <input id="orgHomepage" name="orgHomepage" type="url" value="${escapeHtml(draft.orgHomepage)}" />
          </div>
        </fieldset>

        <fieldset class="scheda-section">
          <legend>Destinatario, input, output, tempi e costi</legend>
          <p class="scheda-panel__hint">
            Con tipo, durata o importo valorizzati il testo libero è opzionale: puoi lasciarlo vuoto.
            <button type="button" class="scheda-add" data-suggest="structure">Suggerisci struttura</button>
          </p>
          <div class="scheda-field">
            <label for="audience">A chi è rivolto</label>
            <textarea id="audience" name="audience" rows="2">${escapeHtml(draft.audience)}</textarea>
          </div>
          <div class="scheda-field">
            <label>Cosa serve (input)</label>
            <p class="hint">Testo libero opzionale se scegli un tipo dal vocabolario.</p>
            <div class="scheda-list">${typedListRows("inputs", draft.inputs, "Documento di identità (opzionale)", inputTypes)}</div>
            <button type="button" class="scheda-add" data-add="inputs">Aggiungi input</button>
          </div>
          <div class="scheda-field">
            <label>Cosa si ottiene (output)</label>
            <p class="hint">Testo libero opzionale se scegli un tipo dal vocabolario.</p>
            <div class="scheda-list">${typedListRows("outputs", draft.outputs, "Certificato (opzionale)", outputTypes)}</div>
            <button type="button" class="scheda-add" data-add="outputs">Aggiungi output</button>
          </div>
          <div class="scheda-field">
            <label for="processingTime">Tempi (testo, opzionale)</label>
            <input id="processingTime" name="processingTime" value="${escapeHtml(draft.processingTime?.text || "")}" placeholder="Opzionale se hai una durata strutturata" />
          </div>
          ${durationFieldsHtml(draft.processingTime)}
          <div class="scheda-field">
            <label for="cost">Costi (testo, opzionale)</label>
            <input id="cost" name="cost" value="${escapeHtml(draft.cost?.text || "")}" placeholder="Opzionale se hai un importo" />
          </div>
          <div class="scheda-field scheda-field--inline">
            <div>
              <label for="costAmount">Importo</label>
              <input id="costAmount" name="costAmount" type="number" step="0.01" min="0" value="${draft.cost?.amount === 0 || draft.cost?.amount ? escapeHtml(String(draft.cost.amount)) : ""}" />
            </div>
            <div>
              <label for="costCurrency">Valuta</label>
              <input id="costCurrency" name="costCurrency" value="${escapeHtml(draft.cost?.currency || "EUR")}" maxlength="3" />
            </div>
          </div>
        </fieldset>

        <fieldset class="scheda-section">
          <legend>Canali</legend>
          <div class="scheda-field">
            <label for="pageUrl">Pagina ufficiale / scheda</label>
            <input id="pageUrl" name="pageUrl" type="url" value="${escapeHtml(draft.pageUrl)}" />
          </div>
          <div class="scheda-field">
            <label>Canali applicativi (URL)</label>
            <div class="scheda-list">${listRows("onlineUrls", draft.onlineUrls, "https://…")}</div>
            <button type="button" class="scheda-add" data-add="onlineUrls">Aggiungi URL</button>
          </div>
        </fieldset>

        <fieldset class="scheda-section">
          <legend>Classificazione</legend>
          <div class="scheda-field">
            <label for="lifeEvents">Eventi della vita</label>
            <select id="lifeEvents" name="lifeEvents" multiple>
              ${optionsHtml(lifeEvents, draft.lifeEvents)}
            </select>
            <span class="hint">Tieni Ctrl/Cmd per selezioni multiple</span>
            ${classificationLinksHtml(draft.lifeEvents, lifeEvents, "Nessun evento selezionato.")}
          </div>
          <div class="scheda-field">
            <label for="themes">Temi</label>
            <select id="themes" name="themes" multiple>
              ${optionsHtml(themes, draft.themes)}
            </select>
            ${classificationLinksHtml(draft.themes, themes, "Nessun tema selezionato.")}
          </div>
        </fieldset>

        <details class="scheda-advanced">
          <summary>Avanzati</summary>
          <div class="scheda-field">
            <label for="ioServiceId">Identificativo App IO</label>
            <input id="ioServiceId" name="ioServiceId" value="${escapeHtml(draft.ioServiceId)}" />
          </div>
          <div class="scheda-field">
            <label for="howTo">Come fare (how-to)</label>
            <textarea id="howTo" name="howTo" rows="3">${escapeHtml(draft.howTo)}</textarea>
          </div>
        </details>
      </form>
    </section>

    <aside class="scheda-preview-stack">
      <section class="scheda-panel scheda-card-preview" aria-labelledby="preview-heading">
        <h2 id="preview-heading">Anteprima scheda</h2>
        <p class="org">${escapeHtml(orgLine)}</p>
        <h3>${escapeHtml(previewTitle)}</h3>
        ${previewVocabPillsHtml()}
        ${previewAbstract ? `<p class="abstract">${escapeHtml(previewAbstract)}</p>` : ""}
        <p class="body">${escapeHtml(previewBody)}</p>
        <a
          class="scheda-cta"
          href="${escapeHtml(ctaHref)}"
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled="${ctaDisabled ? "true" : "false"}"
        >Vai al servizio</a>
      </section>

      <section class="scheda-panel" aria-labelledby="json-heading">
        <h2 id="json-heading">JSON-LD scheda</h2>
        <p class="scheda-panel__hint">Slice del servizio corrente (export scheda / Playground).</p>
        <div class="scheda-json-wrap">
          <pre class="scheda-json" id="json-preview">${escapeHtml(json)}</pre>
        </div>
      </section>
    </aside>
  `;
  updateExportVisibility();
}

function updatePreviewOnly() {
  const errors = validateDraft(draft);
  const doc = formToDocument(draft);
  const json = JSON.stringify(doc, null, 2);
  const orgLine = draft.orgName || draft.orgId || "Ente non indicato";
  const previewTitle = draft.title || "Titolo del servizio";
  const previewAbstract = draft.abstract || "";
  const previewBody = draft.description
    ? stripHtml(draft.description)
    : "Descrizione non ancora compilata.";
  const ctaHref = draft.pageUrl || draft.serviceId || "#";
  const ctaDisabled = !(draft.pageUrl || draft.serviceId);

  const formPanel = root.querySelector("#scheda-form")?.closest(".scheda-panel");
  let alert = formPanel?.querySelector(".scheda-errors");
  if (errors.length) {
    if (!alert && formPanel) {
      alert = document.createElement("div");
      alert.className = "scheda-errors";
      alert.setAttribute("role", "alert");
      formPanel.querySelector(".scheda-panel__hint")?.after(alert);
    }
    if (alert) alert.innerHTML = errors.map((e) => escapeHtml(e)).join("<br>");
  } else if (alert) {
    alert.remove();
  }

  const card = root.querySelector(".scheda-card-preview");
  if (card) {
    card.querySelector(".org").textContent = orgLine;
    card.querySelector("h3").textContent = previewTitle;
    let pills = card.querySelector(".scheda-pills");
    const pillsHtml = previewVocabPillsHtml();
    if (pillsHtml) {
      if (!pills) {
        pills = document.createElement("div");
        pills.className = "scheda-pills";
        card.querySelector("h3").after(pills);
      }
      pills.outerHTML = pillsHtml;
    } else if (pills) {
      pills.remove();
    }
    let abstractEl = card.querySelector(".abstract");
    if (previewAbstract) {
      if (!abstractEl) {
        abstractEl = document.createElement("p");
        abstractEl.className = "abstract";
        card.querySelector(".body")?.before(abstractEl);
      }
      abstractEl.textContent = previewAbstract;
    } else if (abstractEl) {
      abstractEl.remove();
    }
    const body = card.querySelector(".body");
    if (body) body.textContent = previewBody;
    const cta = card.querySelector(".scheda-cta");
    if (cta) {
      cta.setAttribute("href", ctaHref);
      cta.setAttribute("aria-disabled", ctaDisabled ? "true" : "false");
    }
  }
  const pre = root.querySelector("#json-preview");
  if (pre) pre.textContent = json;
}

function syncFromForm() {
  readFormIntoDraft();
  if (catalogDoc && activeServiceId) {
    // keep active id in sync if user edits @id field before switch
  }
  scheduleSave();
  updatePreviewOnly();
}

function openService(serviceId) {
  draft = documentToForm(catalogDoc || formToDocument(draft), serviceId);
  activeServiceId = draft.serviceId;
  persistSession();
  render();
}

function switchToService(nextId) {
  if (!nextId || nextId === activeServiceId) return;
  const errors = validateDraft(
    (() => {
      readFormIntoDraft();
      return draft;
    })(),
  );
  if (errors.length) {
    toast(`Salva prima la scheda corrente: ${errors[0]}`);
    render();
    return;
  }
  commitDraftToCatalog();
  openService(nextId);
  toast("Scheda cambiata. Le modifiche precedenti sono nel catalogo.");
}

function applyImportedDocument(doc, serviceId = null) {
  const services = listPublicServices(doc);
  if (!services.length) {
    throw new Error("Nel documento non c’è nessun cpsv:PublicService.");
  }
  if (services.length > 1 && !serviceId) {
    pendingDoc = doc;
    pickList.innerHTML = services
      .map(
        (service) => `
        <button type="button" data-pick-id="${escapeHtml(service.id)}">
          ${escapeHtml(service.title)}
          <span class="meta">${escapeHtml(service.id)}</span>
        </button>`,
      )
      .join("");
    pickDialog.showModal();
    return;
  }
  catalogDoc = structuredClone(doc);
  const chosen = serviceId || services[0].id;
  draft = documentToForm(catalogDoc, chosen);
  activeServiceId = draft.serviceId;
  const result = persistSession();
  render();
  if (services.length > 1 && result.savedCatalog === false) {
    toast("Catalogo importato (bozza locale senza catalogo: file troppo grande).");
  } else {
    toast(
      services.length > 1
        ? `Catalogo importato: ${services.length} servizi.`
        : "Scheda importata.",
    );
  }
}

async function importFile(file) {
  const text = await file.text();
  const doc = parseJsonLdText(text);
  applyImportedDocument(doc);
}

function downloadBlob(filename, obj) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], {
    type: "application/ld+json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function downloadCurrent() {
  readFormIntoDraft();
  const errors = validateDraft(draft);
  if (errors.length) {
    toast(errors[0]);
    render();
    return;
  }
  if (catalogDoc && activeServiceId) {
    commitDraftToCatalog();
    persistSession();
  }
  downloadBlob(filenameForDraft(draft), formToDocument(draft));
  toast("Scheda esportata.");
}

function downloadCatalog() {
  readFormIntoDraft();
  const errors = validateDraft(draft);
  if (errors.length) {
    toast(errors[0]);
    render();
    return;
  }
  if (!catalogDoc) {
    toast("Nessun catalogo multi-servizio caricato.");
    return;
  }
  commitDraftToCatalog();
  persistSession();
  downloadBlob(filenameForCatalog(), catalogDoc);
  toast("Catalogo esportato.");
}

async function copyCurrent() {
  readFormIntoDraft();
  const doc = formToDocument(draft);
  await navigator.clipboard.writeText(JSON.stringify(doc, null, 2));
  toast("JSON-LD della scheda copiato.");
}

function openPlayground() {
  readFormIntoDraft();
  const errors = validateDraft(draft);
  if (errors.length) {
    toast(errors[0]);
    render();
    return;
  }
  window.open(playgroundUrl(formToDocument(draft)), "_blank", "noopener,noreferrer");
}

function resetDraft() {
  if (draftHasContent(draft) || hasMultiCatalog()) {
    const ok = window.confirm(
      hasMultiCatalog()
        ? "Scartare il catalogo e la scheda corrente?"
        : "Scartare la bozza corrente e creare una scheda vuota?",
    );
    if (!ok) return;
  }
  draft = emptyDraft();
  catalogDoc = null;
  activeServiceId = null;
  catalogFilter = "";
  clearDraftStorage();
  render();
  toast("Nuova scheda.");
}

root.addEventListener("input", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  if (target.id === "catalog-search") {
    catalogFilter = target.value;
    const list = root.querySelector(".scheda-catalog__list");
    if (list) {
      const services = filteredCatalogServices();
      list.innerHTML = services
        .map((service) => {
          const active = service.id === activeServiceId ? "is-active" : "";
          return `<li><button type="button" class="${active}" data-switch-id="${escapeHtml(service.id)}">${escapeHtml(service.title)}<span class="meta">${escapeHtml(service.id)}</span></button></li>`;
        })
        .join("") || "<li>Nessun risultato</li>";
    }
    return;
  }
  if (!target.closest("#scheda-form")) return;
  syncFromForm();
});

root.addEventListener("change", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  if (target.id === "catalog-select") {
    switchToService(target.value);
    return;
  }
  if (!target.closest("#scheda-form")) return;
  const needsRerender =
    target.id === "durationKind" ||
    target.id === "lifeEvents" ||
    target.id === "themes" ||
    target.name === "inputType" ||
    target.name === "outputType" ||
    target.name === "inputConcept" ||
    target.name === "outputConcept";
  syncFromForm();
  if (needsRerender) {
    render();
    return;
  }
});

root.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const switchBtn = target.closest("[data-switch-id]");
  if (switchBtn) {
    event.preventDefault();
    switchToService(switchBtn.getAttribute("data-switch-id"));
    return;
  }
  const add = target.getAttribute("data-add");
  if (add) {
    event.preventDefault();
    readFormIntoDraft();
    if (add === "inputs") draft.inputs = [...(draft.inputs || []), emptyTypedItem()];
    if (add === "outputs") draft.outputs = [...(draft.outputs || []), emptyTypedItem()];
    if (add === "onlineUrls") draft.onlineUrls = [...(draft.onlineUrls || []), ""];
    scheduleSave();
    render();
    return;
  }
  if (target.getAttribute("data-suggest") === "structure") {
    event.preventDefault();
    readFormIntoDraft();
    const result = applySuggestions(draft);
    draft = normalizeDraft(result.draft);
    scheduleSave();
    render();
    toast(
      result.changed
        ? `Struttura suggerita: ${result.changed} campo/i aggiornati.`
        : "Nessun suggerimento applicabile (campi tipizzati già valorizzati o testo insufficiente).",
    );
    return;
  }
  const remove = target.getAttribute("data-remove");
  if (remove) {
    event.preventDefault();
    const index = Number(target.getAttribute("data-index"));
    readFormIntoDraft();
    const list = draft[remove] || [];
    list.splice(index, 1);
    if (remove === "inputs" || remove === "outputs") {
      draft[remove] = list.length ? list : [emptyTypedItem()];
    } else {
      draft[remove] = list.length ? list : [""];
    }
    scheduleSave();
    render();
  }
});

document.getElementById("btn-new").addEventListener("click", resetDraft);
document.getElementById("file-import").addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;
  try {
    await importFile(file);
  } catch (error) {
    toast(error.message || "Import non riuscito.");
  }
});
document.getElementById("btn-paste").addEventListener("click", () => {
  pasteInput.value = "";
  pasteDialog.showModal();
  pasteInput.focus();
});
document.getElementById("paste-cancel").addEventListener("click", () => pasteDialog.close());
document.getElementById("paste-apply").addEventListener("click", () => {
  try {
    const doc = parseJsonLdText(pasteInput.value);
    pasteDialog.close();
    applyImportedDocument(doc);
  } catch (error) {
    toast(error.message || "Import non riuscito.");
  }
});
document.getElementById("pick-cancel").addEventListener("click", () => {
  pendingDoc = null;
  pickDialog.close();
});
pickList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-pick-id]");
  if (!button || !pendingDoc) return;
  const id = button.getAttribute("data-pick-id");
  pickDialog.close();
  applyImportedDocument(pendingDoc, id);
  pendingDoc = null;
});
document.getElementById("btn-export").addEventListener("click", downloadCurrent);
exportCatalogBtn.addEventListener("click", downloadCatalog);
document.getElementById("btn-copy").addEventListener("click", () => {
  copyCurrent().catch(() => toast("Copia non riuscita."));
});
document.getElementById("btn-playground").addEventListener("click", openPlayground);

async function loadCatalogFromQuery(catalogUrl, serviceId) {
  const response = await fetch(catalogUrl, { credentials: "same-origin" });
  if (!response.ok) throw new Error(`Catalogo non raggiungibile (HTTP ${response.status}).`);
  const doc = parseJsonLdText(JSON.stringify(await response.json()));
  applyImportedDocument(doc, serviceId || null);
}

async function boot() {
  const [lifeRes, themeRes, inputRes, outputRes, conceptRes] = await Promise.all([
    fetch("./life-events.json"),
    fetch("./themes.json"),
    fetch("./input-types.json"),
    fetch("./output-types.json"),
    fetch("./concepts.json"),
  ]);
  lifeEvents = labelMapEntries(await lifeRes.json());
  themes = labelMapEntries(await themeRes.json());
  inputTypes = labelMapEntries(await inputRes.json());
  outputTypes = labelMapEntries(await outputRes.json());
  concepts = conceptRes.ok ? labelMapEntries(await conceptRes.json()) : [];

  const params = new URLSearchParams(window.location.search);
  const catalogParam = params.get("catalog");
  const serviceParam = params.get("service");

  if (catalogParam) {
    try {
      const catalogUrl = new URL(catalogParam, window.location.href).href;
      await loadCatalogFromQuery(catalogUrl, serviceParam);
      if (window.history.replaceState) {
        const clean = new URL(window.location.href);
        clean.search = "";
        window.history.replaceState({}, "", clean.pathname + clean.hash);
      }
      return;
    } catch (error) {
      toast(error.message || "Deep-link catalogo non riuscito.");
    }
  }

  const session = loadSessionFromStorage();
  if (session) {
    draft = normalizeDraft(session.draft);
    catalogDoc = session.catalogDoc;
    activeServiceId = session.activeServiceId || draft.serviceId;
    if (catalogDoc && activeServiceId) {
      try {
        draft = documentToForm(catalogDoc, activeServiceId);
        activeServiceId = draft.serviceId;
      } catch {
        catalogDoc = null;
      }
    }
    if (serviceParam && catalogDoc) {
      try {
        openService(serviceParam);
        return;
      } catch (error) {
        toast(error.message || "Servizio non trovato nel catalogo in sessione.");
      }
    }
  } else {
    draft = emptyDraft();
  }
  render();
}

boot().catch((error) => {
  console.error(error);
  toast("Impossibile caricare i vocabolari.");
  render();
});
