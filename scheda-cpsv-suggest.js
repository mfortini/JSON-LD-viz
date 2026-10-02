/** Euristiche testo libero → campi tipizzati (solo slot vuoti). */

const EX = "https://example.org/onto/ex#";

const INPUT_RULES = [
  { typeId: `${EX}InputType-identity-document`, re: /carta\s+d['’]?identit|documento\s+di\s+identit|\bcie\b|passaporto|carta\s+identit/i },
  { typeId: `${EX}InputType-spid`, re: /\bspid\b|cie\s*id|eidas|identit[aà]\s+digitale/i },
  { typeId: `${EX}InputType-codice-fiscale`, re: /codice\s+fiscale|\bcf\b/i },
  { typeId: `${EX}InputType-iban`, re: /\biban\b|coordinate\s+bancarie|conto\s+corrente/i },
  { typeId: `${EX}InputType-form`, re: /modulo|formular|compilare|pdf\b|modello\b/i },
  { typeId: `${EX}InputType-certificate`, re: /certificat|attestazion|attestato/i },
  { typeId: `${EX}InputType-receipt`, re: /ricevut|quietanza|pagamento\s+effettuato|marca\s+da\s+bollo/i },
  { typeId: `${EX}InputType-photo`, re: /fotogra|foto\s+tessera|fototessera/i },
  { typeId: `${EX}InputType-declaration`, re: /dichiarazion|autocertificazion/i },
];

const OUTPUT_RULES = [
  { typeId: `${EX}OutputType-certificate`, re: /certificat|attestato|attestazion/i },
  { typeId: `${EX}OutputType-payment`, re: /bollettin|pagamento|pago\s*pa|f24/i },
  { typeId: `${EX}OutputType-appointment`, re: /appuntament|prenotazion|calendario/i },
  { typeId: `${EX}OutputType-registration`, re: /iscrizion|registrazion|iscriv/i },
  { typeId: `${EX}OutputType-card`, re: /tessera|carta\s+fisica|carta\s+digitale/i },
  { typeId: `${EX}OutputType-status`, re: /esito|stato\s+della\s+pratica|conferma/i },
  { typeId: `${EX}OutputType-document`, re: /document|scaric|pdf|ricevut/i },
];

function itemText(item) {
  if (item == null) return "";
  if (typeof item === "string") return item;
  return String(item.text || "").trim();
}

function itemTypeId(item) {
  if (!item || typeof item === "string") return "";
  return String(item.typeId || "").trim();
}

export function suggestInputType(text) {
  const t = String(text || "");
  for (const rule of INPUT_RULES) {
    if (rule.re.test(t)) return rule.typeId;
  }
  return "";
}

export function suggestOutputType(text) {
  const t = String(text || "");
  for (const rule of OUTPUT_RULES) {
    if (rule.re.test(t)) return rule.typeId;
  }
  return "";
}

/** @returns {{ amount: number|null, currency: string }} */
export function suggestCost(text) {
  const t = String(text || "").toLocaleLowerCase("it");
  if (!t.trim()) return { amount: null, currency: "" };
  if (/gratuit|a\s+titolo\s+gratuit|senza\s+costi|non\s+ha\s+costo|nessun\s+costo|gratis/.test(t)) {
    return { amount: 0, currency: "EUR" };
  }
  const match =
    t.match(/(?:€|eur(?:o)?)\s*(\d+(?:[.,]\d{1,2})?)/i) ||
    t.match(/(\d+(?:[.,]\d{1,2})?)\s*(?:€|eur(?:o)?)/i);
  if (match) {
    const amount = Number(String(match[1]).replace(",", "."));
    if (!Number.isNaN(amount)) return { amount, currency: "EUR" };
  }
  return { amount: null, currency: "" };
}

/** @returns {string} xsd:duration or "" */
export function suggestDuration(text) {
  const t = String(text || "").toLocaleLowerCase("it");
  if (!t.trim()) return "";
  if (/immediat|istantane|in\s+tempo\s+reale|online\s+subito/.test(t)) return "PT0S";
  if (/\bora\b|1\s*h\b|un['’]?\s*ora/.test(t) && !/giorn/.test(t)) return "PT1H";
  const rangeDays = t.match(/(\d+)\s*[-–—]\s*(\d+)\s*giorn/);
  if (rangeDays) {
    const max = Math.max(Number(rangeDays[1]), Number(rangeDays[2]));
    if (max > 0) return `P${max}D`;
  }
  const days = t.match(/(\d+)\s*giorn/);
  if (days) {
    const n = Number(days[1]);
    if (n > 0) return `P${n}D`;
  }
  const weeks = t.match(/(\d+)\s*settiman/);
  if (weeks) {
    const n = Number(weeks[1]);
    if (n > 0) return `P${n * 7}D`;
  }
  const months = t.match(/(\d+)\s*mes[ei]/);
  if (months) {
    const n = Number(months[1]);
    if (n > 0) return `P${n}M`;
  }
  return "";
}

/**
 * Interpreta un xsd:duration in campi UI (valore + unità).
 * @returns {{ kind: ""|"immediate"|"hours"|"days"|"weeks"|"months", amount: number|"" }}
 */
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
  // fallback: giorni se solo PnD con altro (es. P1DT2H) → arrotonda ai giorni interi
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

/** Etichetta leggibile per una durata (catalogo / anteprima). */
export function formatDurationLabel(duration) {
  const ui = parseDurationUi(duration);
  if (ui.kind === "immediate") return "Immediato";
  if (ui.kind === "hours") return ui.amount === 1 ? "1 ora" : `${ui.amount} ore`;
  if (ui.kind === "days") return ui.amount === 1 ? "1 giorno" : `${ui.amount} giorni`;
  if (ui.kind === "weeks") return ui.amount === 1 ? "1 settimana" : `${ui.amount} settimane`;
  if (ui.kind === "months") return ui.amount === 1 ? "1 mese" : `${ui.amount} mesi`;
  return String(duration || "");
}

/**
 * Applica suggerimenti solo agli slot tipizzati vuoti.
 * @returns {{ draft: object, changed: number }}
 */
export function applySuggestions(draft) {
  const next = structuredClone(draft);
  let changed = 0;

  next.inputs = (next.inputs || []).map((item) => {
    const text = itemText(item);
    const typeId = itemTypeId(item);
    if (!text || typeId) return typeof item === "string" ? { text: item, typeId: "" } : item;
    const suggested = suggestInputType(text);
    if (!suggested) return { text, typeId: "" };
    changed += 1;
    return { text, typeId: suggested };
  });

  next.outputs = (next.outputs || []).map((item) => {
    const text = itemText(item);
    const typeId = itemTypeId(item);
    if (!text || typeId) return typeof item === "string" ? { text: item, typeId: "" } : item;
    const suggested = suggestOutputType(text);
    if (!suggested) return { text, typeId: "" };
    changed += 1;
    return { text, typeId: suggested };
  });

  const timeText =
    typeof next.processingTime === "string"
      ? next.processingTime
      : String(next.processingTime?.text || "");
  const timeDuration =
    typeof next.processingTime === "object" ? String(next.processingTime?.duration || "") : "";
  if (timeText && !timeDuration) {
    const duration = suggestDuration(timeText);
    if (duration) {
      next.processingTime = { text: timeText, duration };
      changed += 1;
    } else {
      next.processingTime = { text: timeText, duration: "" };
    }
  } else if (typeof next.processingTime === "string") {
    next.processingTime = { text: timeText, duration: timeDuration };
  }

  const costText =
    typeof next.cost === "string" ? next.cost : String(next.cost?.text || "");
  const costAmount =
    typeof next.cost === "object" && next.cost?.amount != null && next.cost.amount !== ""
      ? next.cost.amount
      : null;
  const costCurrency =
    typeof next.cost === "object" ? String(next.cost?.currency || "") : "";
  if (costText && (costAmount == null || costAmount === "")) {
    const suggested = suggestCost(costText);
    if (suggested.amount != null) {
      next.cost = {
        text: costText,
        amount: suggested.amount,
        currency: costCurrency || suggested.currency || "EUR",
      };
      changed += 1;
    } else {
      next.cost = { text: costText, amount: "", currency: costCurrency || "EUR" };
    }
  } else if (typeof next.cost === "string") {
    next.cost = { text: costText, amount: costAmount ?? "", currency: costCurrency || "EUR" };
  }

  return { draft: next, changed };
}
