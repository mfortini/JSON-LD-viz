/** Euristiche testo libero → campi tipizzati (solo slot vuoti). */

import {
  composeDuration,
  parseDurationUi,
  formatDurationLabel,
} from "./scheda-cpsv-model.js";

export { composeDuration, parseDurationUi, formatDurationLabel };

const IO = "https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/service-input-output";

const INPUT_RULES = [
  { typeId: `${IO}/IDDEC`, re: /carta\s+d['’]?identit|documento\s+di\s+identit|\bcie\b|passaporto|carta\s+identit|identit[aà]/i },
  { typeId: `${IO}/REQ`, re: /istanza|domanda|richiesta|modulo\s+di\s+richiesta|formular/i },
  { typeId: `${IO}/PAYMENTDEC`, re: /ricevut|quietanza|pagamento\s+effettuato|marca\s+da\s+bollo|attestazione\s+di\s+pagamento/i },
  { typeId: `${IO}/CERT`, re: /certificat|attestazion|attestato/i },
  { typeId: `${IO}/AUTHACT`, re: /autorizzazion|atto\s+autorizz|permesso|licenza/i },
  { typeId: `${IO}/CODE`, re: /codice\s+fiscale|\bcf\b|codice\s+identific|\bspid\b|pin\b/i },
  { typeId: `${IO}/ADMINDOC`, re: /documentazione\s+amministr|visura|estratto|dichiarazion|autocertificazion/i },
  { typeId: `${IO}/OTHDOC`, re: /documento|documentazione|pdf\b|allegat/i },
];

const OUTPUT_RULES = [
  { typeId: `${IO}/CERT`, re: /certificat|attestato|attestazion/i },
  { typeId: `${IO}/AUTHACT`, re: /autorizzazion|permesso|licenza|atto\s+autorizz/i },
  { typeId: `${IO}/PAYMENTDEC`, re: /bollettin|pagamento|pago\s*pa|f24|quietanza/i },
  { typeId: `${IO}/CODE`, re: /codice|protocollo|identificativo/i },
  { typeId: `${IO}/IDDEC`, re: /carta|tessera|documento\s+di\s+identit/i },
  { typeId: `${IO}/REQ`, re: /ricevuta\s+di\s+richiesta|conferma\s+di\s+invio/i },
  { typeId: `${IO}/ADMINDOC`, re: /documentazione|visura|estratto|dichiarazion/i },
  { typeId: `${IO}/OTHDOC`, re: /document|scaric|pdf|esito|pratica/i },
];

/** Allowlist concetti OntoPiA (allineata a structure/typed.py). */
const CONCEPT_RULES = [
  {
    conceptId: "https://w3id.org/italia/onto/CPV/taxCode",
    re: /codice\s+fiscale|\bcf\b/i,
  },
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

function itemConceptId(item) {
  if (!item || typeof item === "string") return "";
  return String(item.conceptId || "").trim();
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

export function suggestConcept(text) {
  const t = String(text || "");
  for (const rule of CONCEPT_RULES) {
    if (rule.re.test(t)) return rule.conceptId;
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
    if (n > 0) return `P${n}W`;
  }
  const months = t.match(/(\d+)\s*mes[ei]/);
  if (months) {
    const n = Number(months[1]);
    if (n > 0) return `P${n}M`;
  }
  return "";
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
    let typeId = itemTypeId(item);
    let conceptId = itemConceptId(item);
    const base =
      typeof item === "string" ? { text: item, typeId: "", conceptId: "" } : { ...item, text, typeId, conceptId };
    if (!text) return base;
    let localChanged = false;
    if (!typeId) {
      const suggested = suggestInputType(text);
      if (suggested) {
        typeId = suggested;
        localChanged = true;
      }
    }
    if (!conceptId) {
      const suggestedConcept = suggestConcept(text);
      if (suggestedConcept) {
        conceptId = suggestedConcept;
        localChanged = true;
      }
    }
    if (localChanged) changed += 1;
    return { ...base, text, typeId, conceptId };
  });

  next.outputs = (next.outputs || []).map((item) => {
    const text = itemText(item);
    let typeId = itemTypeId(item);
    let conceptId = itemConceptId(item);
    const base =
      typeof item === "string" ? { text: item, typeId: "", conceptId: "" } : { ...item, text, typeId, conceptId };
    if (!text) return base;
    let localChanged = false;
    if (!typeId) {
      const suggested = suggestOutputType(text);
      if (suggested) {
        typeId = suggested;
        localChanged = true;
      }
    }
    if (!conceptId) {
      const suggestedConcept = suggestConcept(text);
      if (suggestedConcept) {
        conceptId = suggestedConcept;
        localChanged = true;
      }
    }
    if (localChanged) changed += 1;
    return { ...base, text, typeId, conceptId };
  });

  const timeText =
    typeof next.processingTime === "string"
      ? next.processingTime
      : String(next.processingTime?.text || "");
  const timeKind =
    typeof next.processingTime === "object" ? String(next.processingTime?.kind || "") : "";
  const timeDuration =
    typeof next.processingTime === "object" ? String(next.processingTime?.duration || "") : "";
  if (timeText && !timeKind && !timeDuration) {
    const duration = suggestDuration(timeText);
    if (duration) {
      const parsed = parseDurationUi(duration);
      next.processingTime = {
        text: timeText,
        duration,
        kind: parsed.kind,
        amount: parsed.amount,
      };
      changed += 1;
    }
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
