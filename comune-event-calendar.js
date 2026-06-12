const WEEKDAY_LABELS = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

const MONTH_LABELS = [
  "Gennaio",
  "Febbraio",
  "Marzo",
  "Aprile",
  "Maggio",
  "Giugno",
  "Luglio",
  "Agosto",
  "Settembre",
  "Ottobre",
  "Novembre",
  "Dicembre",
];

export function parseEventDateValue(value) {
  if (!value) return null;
  const parsed = new Date(String(value).trim());
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function toDayKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function toMonthKey(year, monthIndex) {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
}

export function parseMonthKey(monthKey) {
  const [year, month] = String(monthKey || "").split("-").map(Number);
  if (!year || !month || month < 1 || month > 12) {
    const now = new Date();
    return { year: now.getFullYear(), monthIndex: now.getMonth() };
  }
  return { year, monthIndex: month - 1 };
}

export function shiftMonthKey(monthKey, delta) {
  const { year, monthIndex } = parseMonthKey(monthKey);
  const date = new Date(year, monthIndex + delta, 1);
  return toMonthKey(date.getFullYear(), date.getMonth());
}

export function getCurrentMonthKey() {
  const now = new Date();
  return toMonthKey(now.getFullYear(), now.getMonth());
}

export function resolveCalendarMonthKey(preferredEventId, events = []) {
  if (preferredEventId) {
    const preferred = events.find((event) => event.id === preferredEventId);
    const preferredDate = parseEventDateValue(preferred?.start || preferred?.end);
    if (preferredDate) {
      return toMonthKey(preferredDate.getFullYear(), preferredDate.getMonth());
    }
  }
  return getCurrentMonthKey();
}

export function filterEventsInMonth(events, monthKey) {
  return events.filter((event) => eventOccursInMonth(event, monthKey));
}

export function getEventDayKeys(event) {
  const start = parseEventDateValue(event.start);
  const end = parseEventDateValue(event.end) || start;
  if (!start) return [];

  const cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const last = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  const keys = [];

  while (cursor <= last) {
    keys.push(toDayKey(cursor));
    cursor.setDate(cursor.getDate() + 1);
    if (keys.length > 370) break;
  }

  return keys;
}

export function eventOccursInMonth(event, monthKey) {
  const { year, monthIndex } = parseMonthKey(monthKey);
  const prefix = `${year}-${String(monthIndex + 1).padStart(2, "0")}-`;
  return getEventDayKeys(event).some((dayKey) => dayKey.startsWith(prefix));
}

export function countEventsInMonth(events, monthKey) {
  return events.filter((event) => eventOccursInMonth(event, monthKey)).length;
}

export function groupEventsByDay(events) {
  const byDay = new Map();
  const undated = [];

  for (const event of events) {
    const dayKeys = getEventDayKeys(event);
    if (!dayKeys.length) {
      undated.push(event);
      continue;
    }
    for (const dayKey of dayKeys) {
      if (!byDay.has(dayKey)) byDay.set(dayKey, []);
      byDay.get(dayKey).push(event);
    }
  }

  for (const dayEvents of byDay.values()) {
    dayEvents.sort((a, b) => String(a.start).localeCompare(String(b.start)));
  }
  undated.sort((a, b) => a.title.localeCompare(b.title, "it"));

  return { byDay, undated };
}

export function formatEventTime(value) {
  const date = parseEventDateValue(value);
  if (!date) return "";
  return date.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
}

export function renderEventCalendar({
  events,
  monthKey,
  selectedEventId,
  escapeHtml,
}) {
  const { year, monthIndex } = parseMonthKey(monthKey);
  const { byDay, undated } = groupEventsByDay(events);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstWeekday = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
  const todayKey = toDayKey(new Date());
  const cells = [];

  for (let i = 0; i < firstWeekday; i += 1) {
    cells.push('<div class="event-calendar__day event-calendar__day--empty" aria-hidden="true"></div>');
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const dayKey = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayEvents = byDay.get(dayKey) || [];
    const isToday = dayKey === todayKey;
    const hasSelected = dayEvents.some((event) => event.id === selectedEventId);

    cells.push(`
      <div class="event-calendar__day ${isToday ? "is-today" : ""} ${hasSelected ? "has-selected" : ""}">
        <div class="event-calendar__day-head">
          <span class="event-calendar__day-num">${day}</span>
          ${dayEvents.length ? `<span class="event-calendar__day-count">${dayEvents.length}</span>` : ""}
        </div>
        <div class="event-calendar__day-events">
          ${dayEvents
            .map((event) => {
              const active = event.id === selectedEventId ? "is-active" : "";
              const time = formatEventTime(event.start);
              return `
                <button
                  type="button"
                  class="event-calendar__event ${active}"
                  data-event-id="${escapeHtml(event.id)}"
                  title="${escapeHtml(event.title)}"
                >
                  ${time ? `<span class="event-calendar__event-time">${escapeHtml(time)}</span>` : ""}
                  <span class="event-calendar__event-title">${escapeHtml(event.title)}</span>
                </button>
              `;
            })
            .join("")}
        </div>
      </div>
    `);
  }

  const undatedMarkup = undated.length
    ? `
      <section class="event-calendar__undated">
        <h3 class="event-calendar__undated-title">Senza data (${undated.length})</h3>
        <div class="event-calendar__undated-list">
          ${undated
            .map((event) => {
              const active = event.id === selectedEventId ? "is-active" : "";
              return `
                <button type="button" class="event-calendar__undated-item ${active}" data-event-id="${escapeHtml(event.id)}">
                  ${escapeHtml(event.title)}
                </button>
              `;
            })
            .join("")}
        </div>
      </section>
    `
    : "";

  return `
    <div class="event-calendar">
      <div class="event-calendar__weekdays">
        ${WEEKDAY_LABELS.map((label) => `<span class="event-calendar__weekday">${label}</span>`).join("")}
      </div>
      <div class="event-calendar__grid">${cells.join("")}</div>
      ${undatedMarkup}
    </div>
  `;
}

export function formatCalendarMonthLabel(monthKey) {
  const { year, monthIndex } = parseMonthKey(monthKey);
  return `${MONTH_LABELS[monthIndex]} ${year}`;
}
