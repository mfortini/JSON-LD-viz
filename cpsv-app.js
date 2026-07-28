import { parseGraphFile } from "./graph-file-loader.js";
import {
  buildCpsvCatalog,
  filterServices,
  loadLifeEventLabels,
  mergeCpsvDocuments,
  truncate,
} from "./cpsv-model.js";
import { buildCpsvPermalinkUrl, parseCpsvPermalink } from "./cpsv-permalinks.js";

const ui = {
  orgLead: document.querySelector("#org-lead"),
  statsPanel: document.querySelector("#stats-panel"),
  viewRoot: document.querySelector("#view-root"),
  filePicker: document.querySelector("#file-picker"),
  appStatus: document.querySelector("#app-status"),
  loadModeDialog: document.querySelector("#load-mode-dialog"),
  loadModeFilename: document.querySelector("#load-mode-filename"),
  loadModeAppend: document.querySelector("#load-mode-append"),
  loadModeReplace: document.querySelector("#load-mode-replace"),
  loadModeCancel: document.querySelector("#load-mode-cancel"),
};

const state = {
  catalog: null,
  view: "catalog",
  selectedServiceId: null,
  search: "",
  addresseeFilter: "all",
  organizationFilter: "all",
  lifeEventFilter: "all",
  lifeEventLabels: {},
  sources: [],
};

let toastTimer = null;
let pendingFile = null;
let lifeEventLabelsReady = loadLifeEventLabels().then((labels) => {
  state.lifeEventLabels = labels;
  return labels;
});

init();

function init() {
  ui.filePicker.addEventListener("change", onFileSelected);
  ui.viewRoot.addEventListener("click", onViewClick);
  ui.viewRoot.addEventListener("input", onViewInput);
  ui.viewRoot.addEventListener("change", onViewChange);
  window.addEventListener("hashchange", syncFromHash);
  window.addEventListener("popstate", syncFromHash);

  ui.loadModeAppend?.addEventListener("click", () => finalizePendingLoad("append"));
  ui.loadModeReplace?.addEventListener("click", () => finalizePendingLoad("replace"));
  ui.loadModeCancel?.addEventListener("click", cancelPendingLoad);
  ui.loadModeDialog?.addEventListener("cancel", cancelPendingLoad);

  renderEmpty();
}

async function onFileSelected(event) {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;

  if (state.catalog) {
    pendingFile = file;
    if (ui.loadModeFilename) {
      ui.loadModeFilename.textContent = file.name;
    }
    ui.loadModeDialog?.showModal();
    return;
  }

  await loadCatalogFile(file, { mode: "replace" });
}

function cancelPendingLoad(event) {
  event?.preventDefault();
  pendingFile = null;
  ui.loadModeDialog?.close();
}

async function finalizePendingLoad(mode) {
  const file = pendingFile;
  pendingFile = null;
  ui.loadModeDialog?.close();
  if (!file) return;
  await loadCatalogFile(file, { mode });
}

async function loadCatalogFile(file, { mode }) {
  try {
    await lifeEventLabelsReady;
    showStatus(`Caricamento di ${file.name}…`);
    const incoming = await parseGraphFile(file);
    const loadedAt = new Date().toISOString();

    let document = incoming;
    let mergeStats = null;

    if (mode === "append" && state.catalog) {
      const result = mergeCpsvDocuments(state.catalog.raw, incoming, {
        filename: file.name,
        loadedAt,
      });
      document = result.document;
      mergeStats = result.stats;
    } else {
      const result = mergeCpsvDocuments(null, incoming, {
        filename: file.name,
        loadedAt,
      });
      document = result.document;
      mergeStats = result.stats;
    }

    state.catalog = buildCpsvCatalog(document, { lifeEventLabels: state.lifeEventLabels });
    state.sources = state.catalog.sources;
    state.search = "";
    state.addresseeFilter = "all";
    state.organizationFilter = "all";
    state.lifeEventFilter = "all";
    state.view = "catalog";
    state.selectedServiceId = null;
    updatePermalink({ replace: true });
    render();

    if (mode === "append" && mergeStats) {
      showStatus(
        `Catalogo aggiornato: +${mergeStats.addedServices} servizi, ${mergeStats.updatedNodes} nodi aggiornati. Totale: ${state.catalog.services.length}.`,
      );
      return;
    }

    showStatus(
      `Catalogo caricato: ${state.catalog.services.length} servizi${
        state.catalog.organization ? ` di ${state.catalog.organization.title}` : ""
      }.`,
    );
  } catch (error) {
    showStatus("Il file selezionato non contiene un catalogo CPSV valido.");
    console.error(error);
  }
}

function syncFromHash() {
  const permalink = parseCpsvPermalink(window.location.hash);
  state.view = permalink.view;
  state.selectedServiceId = permalink.serviceId;

  if (state.view === "servizio" && state.selectedServiceId && state.catalog) {
    if (!state.catalog.serviceById.has(state.selectedServiceId)) {
      state.view = "catalog";
      state.selectedServiceId = null;
      updatePermalink({ replace: true });
    }
  }

  render();
  if (state.view === "servizio") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function updatePermalink({ replace = false } = {}) {
  const url = buildCpsvPermalinkUrl(state.view, state.selectedServiceId);
  if (replace) {
    window.history.replaceState(null, "", url);
  } else {
    window.history.pushState(null, "", url);
  }
}

function onViewClick(event) {
  const card = event.target.closest("[data-service-id]");
  if (card && state.view === "catalog") {
    state.view = "servizio";
    state.selectedServiceId = card.dataset.serviceId;
    updatePermalink();
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const back = event.target.closest("[data-goto-catalog]");
  if (back) {
    event.preventDefault();
    state.view = "catalog";
    state.selectedServiceId = null;
    updatePermalink();
    render();
    return;
  }

  const orgFilter = event.target.closest("[data-organization-pick]");
  if (orgFilter && state.view === "catalog") {
    state.organizationFilter = orgFilter.dataset.organizationPick;
    updateCatalogResults();
  }
}

function onViewInput(event) {
  if (event.target.matches("[data-search]")) {
    state.search = event.target.value;
    updateCatalogResults();
  }
}

function onViewChange(event) {
  if (event.target.matches("[data-addressee-filter]")) {
    state.addresseeFilter = event.target.value;
    updateCatalogResults();
  }
  if (event.target.matches("[data-organization-filter]")) {
    state.organizationFilter = event.target.value;
    updateCatalogResults();
  }
  if (event.target.matches("[data-life-event-filter]")) {
    state.lifeEventFilter = event.target.value;
    updateCatalogResults();
  }
}

function render() {
  renderHero();
  if (!state.catalog) {
    renderEmpty();
    return;
  }

  if (state.view === "servizio" && state.selectedServiceId) {
    ui.viewRoot.innerHTML = renderServiceDetail(state.catalog.serviceById.get(state.selectedServiceId));
    return;
  }

  ui.viewRoot.innerHTML = renderCatalogShell();
  updateCatalogResults();
}

function renderCatalogShell() {
  const orgBadges = state.catalog.organizations
    .map(
      (org) =>
        `<button type="button" class="cpsv-stat cpsv-stat--filter${
          state.organizationFilter === org.id ? " is-active" : ""
        }" data-organization-pick="${escapeHtml(org.id)}" title="Filtra per ${escapeHtml(org.title)}">${escapeHtml(org.title)}</button>`,
    )
    .join("");

  const sourceBadges = state.catalog.sources
    .map(
      (source) =>
        `<span class="cpsv-stat cpsv-stat--source" title="${escapeHtml(source.fullTitle || source.label)}">${escapeHtml(source.label)}</span>`,
    )
    .join("");

  const organizationFilter =
    state.catalog.organizations.length > 0
      ? `
        <label class="field field--select">
          <span class="field__label">Ente che pubblica</span>
          <select data-organization-filter>
            <option value="all">Tutti gli enti</option>
            ${state.catalog.organizations
              .map(
                (org) =>
                  `<option value="${escapeHtml(org.id)}" ${state.organizationFilter === org.id ? "selected" : ""}>${escapeHtml(org.title)}</option>`,
              )
              .join("")}
            <option value="none" ${state.organizationFilter === "none" ? "selected" : ""}>Senza ente indicato</option>
          </select>
        </label>
      `
      : "";

  const lifeEventFilter = state.catalog.lifeEventOptions.length
    ? `
        <label class="field field--select">
          <span class="field__label">Evento della vita</span>
          <select data-life-event-filter>
            <option value="all">Tutti gli eventi della vita</option>
            ${state.catalog.lifeEventOptions
              .map(
                (label) =>
                  `<option value="${escapeHtml(label)}" ${state.lifeEventFilter === label ? "selected" : ""}>${escapeHtml(label)}</option>`,
              )
              .join("")}
          </select>
        </label>
      `
    : "";

  const toolbarClass =
    organizationFilter || lifeEventFilter ? "cpsv-toolbar cpsv-toolbar--multi" : "cpsv-toolbar";

  return `
    <section class="cpsv-view">
      <div class="cpsv-stats" data-catalog-stats>
        <span class="cpsv-stat" data-visible-count></span>
        ${orgBadges}
        ${sourceBadges}
      </div>
      <div class="${toolbarClass}">
        <label class="field">
          <span class="field__label">Cerca servizio</span>
          <input
            type="search"
            data-search
            value="${escapeHtml(state.search)}"
            placeholder="Titolo, descrizione o destinatario"
          />
        </label>
        ${organizationFilter}
        <label class="field field--select">
          <span class="field__label">Destinatario</span>
          <select data-addressee-filter>
            <option value="all">Tutti i destinatari</option>
            ${state.catalog.addresseeOptions
              .map(
                (label) =>
                  `<option value="${escapeHtml(label)}" ${state.addresseeFilter === label ? "selected" : ""}>${escapeHtml(label)}</option>`,
              )
              .join("")}
          </select>
        </label>
        ${lifeEventFilter}
      </div>
      ${renderLifeEventLegend(state.catalog)}
      <div data-service-results></div>
    </section>
  `;
}

function updateCatalogResults() {
  const root = ui.viewRoot.querySelector(".cpsv-view");
  if (!root || !state.catalog) return;

  const services = filterServices(state.catalog, {
    search: state.search,
    addressee: state.addresseeFilter,
    organization: state.organizationFilter,
    lifeEvent: state.lifeEventFilter,
  });

  const countEl = root.querySelector("[data-visible-count]");
  if (countEl) {
    countEl.textContent = `${services.length} servizi visibili su ${state.catalog.services.length}`;
  }

  const searchEl = root.querySelector("[data-search]");
  if (searchEl && document.activeElement !== searchEl) {
    searchEl.value = state.search;
  }

  const filterEl = root.querySelector("[data-addressee-filter]");
  if (filterEl && document.activeElement !== filterEl) {
    filterEl.value = state.addresseeFilter;
  }

  const organizationEl = root.querySelector("[data-organization-filter]");
  if (organizationEl && document.activeElement !== organizationEl) {
    organizationEl.value = state.organizationFilter;
  }

  const lifeEventEl = root.querySelector("[data-life-event-filter]");
  if (lifeEventEl && document.activeElement !== lifeEventEl) {
    lifeEventEl.value = state.lifeEventFilter;
  }

  const resultsEl = root.querySelector("[data-service-results]");
  if (!resultsEl) return;

  resultsEl.innerHTML = services.length
    ? `<ul class="cpsv-grid">
        ${services.map((service) => renderServiceCard(service)).join("")}
      </ul>`
    : `<section class="cpsv-empty"><p>Nessun servizio corrisponde ai filtri impostati.</p></section>`;
}

function renderHero() {
  const shell = document.querySelector(".page-shell");
  shell?.classList.toggle("cpsv-shell--detail", Boolean(state.catalog && state.view === "servizio"));
  shell?.classList.toggle("cpsv-shell--loaded", Boolean(state.catalog));

  if (!state.catalog) {
    ui.orgLead.textContent =
      "Carica un file JSON-LD CPSV-AP (.jsonld o .gz) per esplorare il catalogo servizi.";
    ui.statsPanel.innerHTML = `
      <article class="stat-card">
        <span class="stat-card__value">—</span>
        <span class="stat-card__label">In attesa di un catalogo CPSV</span>
      </article>
    `;
    return;
  }

  const orgCount = state.catalog.organizations.length;
  const orgLabel =
    orgCount === 0
      ? "ente non indicato"
      : orgCount === 1
        ? state.catalog.organizations[0].title
        : `${orgCount} enti`;
  ui.orgLead.textContent = `${state.catalog.services.length} servizi · ${orgLabel} · ${state.catalog.sources.length} fonti`;
  ui.statsPanel.innerHTML = `
    <article class="stat-card">
      <span class="stat-card__value">${state.catalog.services.length}</span>
      <span class="stat-card__label">Servizi</span>
    </article>
    <article class="stat-card">
      <span class="stat-card__value">${orgCount}</span>
      <span class="stat-card__label">Enti</span>
    </article>
    <article class="stat-card">
      <span class="stat-card__value">${state.catalog.servicesWithLifeEvents}</span>
      <span class="stat-card__label">Con eventi vita</span>
    </article>
    <article class="stat-card">
      <span class="stat-card__value">${state.catalog.sources.length}</span>
      <span class="stat-card__label">Fonti</span>
    </article>
  `;
}

function renderEmpty() {
  ui.viewRoot.innerHTML = `
    <section class="cpsv-empty">
      <h2>Nessun catalogo caricato</h2>
      <p>Usa <strong>Carica catalogo</strong> per aprire un file JSON-LD CPSV-AP compresso o in chiaro.</p>
    </section>
  `;
}

function renderServiceCard(service) {
  const orgLabel = service.organization?.title || "Ente non indicato";
  const addresseeLabel =
    service.addressees.length === 1
      ? service.addressees[0].label
      : `${service.addressees.length} destinatari`;

  const lifeEventChips = service.lifeEvents
    .map((event) => `<span class="cpsv-chip cpsv-chip--life-event">${escapeHtml(event.label)}</span>`)
    .join("");

  const mappingBadge = renderLifeEventMappingBadge(service.lifeEventMapping);

  return `
    <li>
      <button type="button" class="cpsv-service-card" data-service-id="${escapeHtml(service.id)}">
        <span class="cpsv-service-card__org">${escapeHtml(orgLabel)}</span>
        <h2 class="cpsv-service-card__title">${escapeHtml(service.title)}</h2>
        <p class="cpsv-service-card__abstract">${escapeHtml(truncate(service.abstract || service.description, 160))}</p>
        <div class="cpsv-service-card__meta">
          <span class="cpsv-chip">${escapeHtml(addresseeLabel)}</span>
          ${mappingBadge}
          ${lifeEventChips}
          ${service.modified ? `<span class="cpsv-chip">Aggiornato ${escapeHtml(service.modified)}</span>` : ""}
        </div>
      </button>
    </li>
  `;
}

function renderServiceDetail(service) {
  if (!service) {
    return `
      <section class="cpsv-empty">
        <p>Servizio non trovato nel catalogo caricato.</p>
        <button type="button" class="ghost-button" data-goto-catalog>Torna al catalogo</button>
      </section>
    `;
  }

  const orgTitle = service.organization?.title || "Ente non indicato";
  const mappingBadge = renderLifeEventMappingBadge(service.lifeEventMapping);
  const addresseeChips = service.addressees
    .map((entry) => `<span class="cpsv-chip">${escapeHtml(entry.label)}</span>`)
    .join("");
  const lifeEventChips = service.lifeEvents
    .map((entry) => `<span class="cpsv-chip cpsv-chip--life-event">${escapeHtml(entry.label)}</span>`)
    .join("");

  const metaChips = [
    mappingBadge,
    service.modified ? `<span class="cpsv-chip">Aggiornato ${escapeHtml(formatDate(service.modified))}</span>` : "",
    service.language ? `<span class="cpsv-chip">${escapeHtml(shortLanguage(service.language))}</span>` : "",
  ]
    .filter(Boolean)
    .join("");

  return `
    <article class="cpsv-sheet">
      <nav class="cpsv-breadcrumb" aria-label="Percorso">
        <button type="button" data-goto-catalog>← Catalogo</button>
      </nav>

      <header class="cpsv-sheet__header">
        <p class="cpsv-sheet__org">${escapeHtml(orgTitle)}</p>
        <div class="cpsv-sheet__title-row">
          <h1 class="cpsv-sheet__title">${escapeHtml(service.title)}</h1>
          ${
            service.externalUrl
              ? `<a class="cpsv-cta cpsv-cta--header" href="${escapeHtml(service.externalUrl)}" target="_blank" rel="noopener noreferrer">Vai al servizio</a>`
              : ""
          }
        </div>
        ${
          service.abstract
            ? `<p class="cpsv-sheet__lead">${escapeHtml(service.abstract)}</p>`
            : ""
        }
        ${metaChips ? `<div class="cpsv-chip-row">${metaChips}</div>` : ""}
      </header>

      <div class="cpsv-sheet__body">
        ${
          service.description
            ? `<section class="cpsv-sheet__section">
                <h2>Descrizione</h2>
                <p class="cpsv-sheet__prose">${escapeHtml(service.description)}</p>
              </section>`
            : ""
        }

        <section class="cpsv-sheet__section">
          <h2>Informazioni</h2>
          <dl class="cpsv-sheet__facts">
            ${renderFact("Ente che pubblica", orgTitle)}
            ${renderFact("Codice servizio", service.serviceCode || service.identifier)}
            ${renderFact("Pubblicato", formatDate(service.issued))}
            ${renderFact("Ultimo aggiornamento", formatDate(service.modified))}
            ${renderFact("Lingua", shortLanguage(service.language))}
          </dl>
        </section>

        ${
          service.addressees.length
            ? `<section class="cpsv-sheet__section">
                <h2>Destinatari</h2>
                <div class="cpsv-chip-row">${addresseeChips}</div>
              </section>`
            : ""
        }

        ${
          service.lifeEvents.length || service.lifeEventMapping
            ? `<section class="cpsv-sheet__section">
                <h2>Eventi della vita</h2>
                ${renderLifeEventMappingDetail(service.lifeEventMapping)}
                ${lifeEventChips ? `<div class="cpsv-chip-row">${lifeEventChips}</div>` : ""}
              </section>`
            : ""
        }

        ${
          service.channels.length
            ? `<section class="cpsv-sheet__section">
                <h2>Canali di accesso</h2>
                <ul class="cpsv-channel-cards">
                  ${service.channels
                    .map(
                      (channel) => `
                        <li class="cpsv-channel-card">
                          <span class="cpsv-channel-card__type">${escapeHtml(channel.label)}</span>
                          ${
                            channel.url
                              ? `<a href="${escapeHtml(channel.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(channel.url)}</a>`
                              : `<span class="cpsv-channel-card__missing">URL non disponibile</span>`
                          }
                        </li>`,
                    )
                    .join("")}
                </ul>
              </section>`
            : ""
        }

        ${
          service.inputs.length
            ? `<section class="cpsv-sheet__section">
                <h2>Requisiti e condizioni</h2>
                <ul class="cpsv-sheet__requirements">
                  ${service.inputs.map((input) => renderRequirement(input.label)).join("")}
                </ul>
              </section>`
            : ""
        }

        ${
          service.processingTime
            ? `<section class="cpsv-sheet__section">
                <h2>Tempi di lavorazione</h2>
                <p class="cpsv-sheet__prose">${escapeHtml(service.processingTime)}</p>
              </section>`
            : ""
        }
      </div>

      <footer class="cpsv-sheet__footer">
        ${
          service.externalUrl
            ? `<a class="cpsv-cta" href="${escapeHtml(service.externalUrl)}" target="_blank" rel="noopener noreferrer">Vai al servizio online</a>`
            : `<span class="cpsv-cta is-disabled" aria-disabled="true">Vai al servizio</span>
               <p class="cpsv-cta-note">Nessun URL pubblico disponibile per questo servizio.</p>`
        }
      </footer>
    </article>
  `;
}

function renderRequirement(label) {
  const match = String(label).match(/^([^:]{2,60}):\s*([\s\S]+)$/);
  if (match) {
    return `
      <li class="cpsv-sheet__requirement">
        <strong>${escapeHtml(match[1].trim())}</strong>
        <p>${escapeHtml(match[2].trim())}</p>
      </li>`;
  }
  return `<li class="cpsv-sheet__requirement"><p>${escapeHtml(label)}</p></li>`;
}

function renderFact(label, value) {
  if (!value) return "";
  return `
    <div class="cpsv-sheet__fact">
      <dt>${escapeHtml(label)}</dt>
      <dd>${escapeHtml(value)}</dd>
    </div>
  `;
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
}

function shortLanguage(value) {
  if (!value) return "";
  if (/ITA|it\b/i.test(value)) return "Italiano";
  if (/ENG|en\b/i.test(value)) return "English";
  return getLastPathSegment(value);
}

function getLastPathSegment(value) {
  try {
    return decodeURIComponent(String(value)).split(/[#/]/).filter(Boolean).pop() || String(value);
  } catch {
    return String(value);
  }
}

function renderLifeEventMappingBadge(mapping) {
  if (!mapping?.methodLabel) return "";
  const badgeClass = mapping.badge ? `cpsv-chip--mapping-${mapping.badge}` : "cpsv-chip--mapping-unknown";
  return `<span class="cpsv-chip cpsv-chip--mapping ${badgeClass}" title="${escapeHtml(mapping.note || mapping.sourceValue || "")}">${escapeHtml(mapping.methodLabel)}</span>`;
}

function renderLifeEventMappingDetail(mapping) {
  if (!mapping?.methodLabel) return "";
  const badgeClass = mapping.badge ? `cpsv-chip--mapping-${mapping.badge}` : "cpsv-chip--mapping-unknown";
  return `
    <div class="cpsv-mapping-detail">
      <span class="cpsv-chip cpsv-chip--mapping ${badgeClass}">${escapeHtml(mapping.methodLabel)}</span>
      ${
        mapping.sourceValue
          ? `<p class="cpsv-mapping-detail__meta"><strong>Fonte:</strong> ${escapeHtml(mapping.sourceField || "—")} → ${escapeHtml(mapping.sourceValue)}</p>`
          : ""
      }
      ${
        mapping.note
          ? `<p class="cpsv-mapping-detail__note">${escapeHtml(mapping.note)}</p>`
          : ""
      }
    </div>
  `;
}

function renderLifeEventLegend(catalog) {
  const counts = catalog.lifeEventMappingCounts || {};
  if (!Object.keys(counts).length && !catalog.lifeEventOptions.length) return "";

  return `
    <aside class="cpsv-life-event-legend" aria-label="Legenda collegamenti eventi della vita">
      <p class="cpsv-life-event-legend__title">Come sono stati collegati gli eventi della vita</p>
      <ul class="cpsv-life-event-legend__list">
        <li><span class="cpsv-chip cpsv-chip--mapping cpsv-chip--mapping-ade">Curato · categoria catalogo AdE</span> ${counts.ade || 0} servizi</li>
        <li><span class="cpsv-chip cpsv-chip--mapping cpsv-chip--mapping-draft">Bozza · area breadcrumb INPS</span> ${counts.draft || 0} servizi — crosswalk provvisorio</li>
        <li><span class="cpsv-chip cpsv-chip--mapping cpsv-chip--mapping-manual">Manuale · override INAIL</span> ${counts.manual || 0} servizi — revisione umana</li>
      </ul>
    </aside>
  `;
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
  if (value == null || value === "undefined" || value === "null") return "";
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
