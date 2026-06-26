export const CPSV_VIEWS = ["catalog", "servizio"];

export function parseCpsvPermalink(hash) {
  const raw = (hash || "").replace(/^#/, "").trim();
  if (!raw || raw === "catalog") {
    return { view: "catalog", serviceId: null };
  }

  const queryIndex = raw.indexOf("?");
  const viewPart = queryIndex >= 0 ? raw.slice(0, queryIndex) : raw;
  const view = CPSV_VIEWS.includes(viewPart) ? viewPart : "catalog";
  let serviceId = null;

  if (queryIndex >= 0) {
    const params = new URLSearchParams(raw.slice(queryIndex + 1));
    serviceId = params.get("id");
  }

  return { view, serviceId };
}

export function buildCpsvPermalinkUrl(view, serviceId) {
  const safeView = CPSV_VIEWS.includes(view) ? view : "catalog";
  const base = `${window.location.pathname}${window.location.search}`;

  if (safeView === "servizio" && serviceId) {
    const params = new URLSearchParams({ id: serviceId });
    return `${base}#servizio?${params.toString()}`;
  }

  return `${base}#catalog`;
}
