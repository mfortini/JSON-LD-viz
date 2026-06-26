import { parseGraphFile } from "./graph-file-loader.js";
import { buildCpsvCatalog, filterServices, truncate } from "./cpsv-model.js";
import { buildCpsvPermalinkUrl, parseCpsvPermalink } from "./cpsv-permalinks.js";

const ui = {
  orgLead: document.querySelector("#org-lead"),
  statsPanel: document.querySelector("#stats-panel"),
  viewRoot: document.querySelector("#view-root"),
  filePicker: document.querySelector("#file-picker"),
  appStatus: document.querySelector("#app-status"),
};

const state = {
  catalog: null,
  view: "catalog",
  selectedServiceId: null,
  search: "",
  addresseeFilter: "all",
};

let toastTimer = null;

init();

function init() {
  ui.filePicker.addEventListener("change", onFileSelected);
  ui.viewRoot.addEventListener("click", onViewClick);
  ui.viewRoot.addEventListener("input", onViewInput);
  ui.viewRoot.addEventListener("change", onViewChange);
  window.addEventListener("hashchange", syncFromHash);
  window.addEventListener("popstate", syncFromHash);
  renderEmpty();
}

async function onFileSelected(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    showStatus(`Caricamento di ${file.name}…`);
    const data = await parseGraphFile(file);
    state.catalog = buildCpsvCatalog(data);
    state.search = "";
    state.addresseeFilter = "all";
    state.view = "catalog";
    state.selectedServiceId = null;
    updatePermalink({ replace: true });
    render();
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
  }
}

function onViewInput(event) {
  if (event.target.matches("[data-search]")) {
    state.search = event.target.value;
    render();
  }
}

function onViewChange(event) {
  if (event.target.matches("[data-addressee-filter]")) {
    state.addresseeFilter = event.target.value;
    render();
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

  ui.viewRoot.innerHTML = renderCatalog();
}

function renderHero() {
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

  const orgTitle = state.catalog.organization?.title || "Ente non indicato";
  ui.orgLead.textContent = `Catalogo di ${orgTitle}: ${state.catalog.services.length} servizi pubblici in formato CPSV-AP.`;
  ui.statsPanel.innerHTML = `
    <article class="stat-card">
      <span class="stat-card__value">${state.catalog.services.length}</span>
      <span class="stat-card__label">Servizi</span>
    </article>
    <article class="stat-card">
      <span class="stat-card__value">${state.catalog.addresseeOptions.length}</span>
      <span class="stat-card__label">Destinatari</span>
    </article>
    <article class="stat-card">
      <span class="stat-card__value">${state.catalog.organization ? "1" : "0"}</span>
      <span class="stat-card__label">Enti</span>
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

function renderCatalog() {
  const services = filterServices(state.catalog, {
    search: state.search,
    addressee: state.addresseeFilter,
  });

  return `
    <section class="cpsv-view">
      <div class="cpsv-stats">
        <span class="cpsv-stat">${services.length} servizi visibili su ${state.catalog.services.length}</span>
        ${
          state.catalog.organization
            ? `<span class="cpsv-stat">${escapeHtml(state.catalog.organization.title)}</span>`
            : ""
        }
      </div>
      <div class="cpsv-toolbar">
        <label class="field">
          <span class="field__label">Cerca servizio</span>
          <input
            type="search"
            data-search
            value="${escapeHtml(state.search)}"
            placeholder="Titolo, descrizione o destinatario"
          />
        </label>
        <label class="field">
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
      </div>
      ${
        services.length
          ? `<ul class="cpsv-grid">
              ${services.map((service) => renderServiceCard(service)).join("")}
            </ul>`
          : `<section class="cpsv-empty"><p>Nessun servizio corrisponde ai filtri impostati.</p></section>`
      }
    </section>
  `;
}

function renderServiceCard(service) {
  const orgLabel = service.organization?.title || state.catalog.organization?.title || "Ente";
  const addresseeLabel =
    service.addressees.length === 1
      ? service.addressees[0].label
      : `${service.addressees.length} destinatari`;

  return `
    <li>
      <button type="button" class="cpsv-service-card" data-service-id="${escapeHtml(service.id)}">
        <span class="cpsv-service-card__org">${escapeHtml(orgLabel)}</span>
        <h2 class="cpsv-service-card__title">${escapeHtml(service.title)}</h2>
        <p class="cpsv-service-card__abstract">${escapeHtml(truncate(service.abstract || service.description, 160))}</p>
        <div class="cpsv-service-card__meta">
          <span class="cpsv-chip">${escapeHtml(addresseeLabel)}</span>
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

  const orgTitle = service.organization?.title || state.catalog.organization?.title || "—";

  return `
    <article class="cpsv-detail">
      <nav class="cpsv-breadcrumb" aria-label="Percorso">
        <button type="button" data-goto-catalog>Catalogo</button>
        <span aria-hidden="true">→</span>
        <span>${escapeHtml(service.title)}</span>
      </nav>

      <h1 class="cpsv-detail__title">${escapeHtml(service.title)}</h1>
      ${
        service.abstract
          ? `<p class="cpsv-detail__lead">${escapeHtml(service.abstract)}</p>`
          : ""
      }
      ${
        service.description
          ? `<p class="cpsv-detail__body">${escapeHtml(service.description)}</p>`
          : ""
      }

      <div class="cpsv-kv">
        ${renderKv("Ente", orgTitle)}
        ${renderKv("Codice servizio", service.serviceCode || service.identifier || "—")}
        ${renderKv("Pubblicato", service.issued || "—")}
        ${renderKv("Ultimo aggiornamento", service.modified || "—")}
        ${renderKv("Lingua", service.language || "—")}
      </div>

      ${
        service.addressees.length
          ? `<section class="cpsv-section">
              <h2>Destinatari</h2>
              <div class="cpsv-chip-row">
                ${service.addressees.map((entry) => `<span class="cpsv-chip">${escapeHtml(entry.label)}</span>`).join("")}
              </div>
            </section>`
          : ""
      }

      ${
        service.channels.length
          ? `<section class="cpsv-section">
              <h2>Canali</h2>
              <ul class="cpsv-channel-list">
                ${service.channels
                  .map(
                    (channel) =>
                      `<li><strong>${escapeHtml(channel.label)}</strong>${
                        channel.url
                          ? `: <a href="${escapeHtml(channel.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(channel.url)}</a>`
                          : " — URL non disponibile"
                      }</li>`,
                  )
                  .join("")}
              </ul>
            </section>`
          : ""
      }

      ${
        service.inputs.length
          ? `<section class="cpsv-section">
              <h2>Input richiesti</h2>
              <ul class="cpsv-channel-list">
                ${service.inputs.map((input) => `<li>${escapeHtml(input.label)}</li>`).join("")}
              </ul>
            </section>`
          : ""
      }

      ${
        service.processingTime
          ? `<section class="cpsv-section">
              <h2>Tempi di lavorazione</h2>
              <p>${escapeHtml(service.processingTime)}</p>
            </section>`
          : ""
      }

      <section class="cpsv-section">
        ${
          service.externalUrl
            ? `<a class="cpsv-cta" href="${escapeHtml(service.externalUrl)}" target="_blank" rel="noopener noreferrer">Vai al servizio</a>`
            : `<span class="cpsv-cta is-disabled" aria-disabled="true">Vai al servizio</span>
               <p class="cpsv-cta-note">Nessun URL pubblico disponibile per questo servizio.</p>`
        }
      </section>
    </article>
  `;
}

function renderKv(label, value) {
  return `
    <div class="cpsv-kv__row">
      <div class="cpsv-kv__label">${escapeHtml(label)}</div>
      <div class="cpsv-kv__value">${escapeHtml(value)}</div>
    </div>
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
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
