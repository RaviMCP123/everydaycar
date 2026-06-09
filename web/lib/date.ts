export function getTodayISO(): string {
  return new Date().toISOString().split("T")[0];
}

export function formatDateToDisplay(date: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return "";
  }

  const [year, month, day] = date.split("-");
  return `${day} / ${month} / ${year}`;
}

export function formatDateToApi(date: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return "";
  }

  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}
