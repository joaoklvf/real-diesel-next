export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

export const formatDateToLocal = (value: Date) =>
  value.toLocaleDateString('pt-BR').toString();

export const removeNonNumericCaracteres = (value: string) =>
  value.replaceAll(/\D/g, "")

export const formatDecimal = (value: string | number | null) => {
  const amountNumber = Number(removeNonNumericCaracteres(String(value))) / 100;
  return amountNumber.toLocaleString('pt-BR', { style: 'decimal', minimumFractionDigits: 2 });
}

export const formatAmount = (value: string) =>
  Number(value?.replaceAll('.', '').replace(',', '.')).toFixed(2);

export const formatCurrency = (value?: number | null) =>
  (value ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const formatDecimalCurrency = (value: string | number | null) => {
  const amountNumber = Number(removeNonNumericCaracteres(String(value))) / 100;
  return formatCurrency(Number(amountNumber));
}

export const formatPercent = (value: string | number) => {
  const decimalNumber = formatDecimal(value);
  return `${decimalNumber}%`;
}

export const convertDateStr = (value?: string | Date | null) => {
  if (!value) return null;

  if (typeof value === 'string' && value.includes('/')) {
    const valueSplitted = value.split('/');
    return `${valueSplitted[2]}-${valueSplitted[1]}-${valueSplitted[0]}`;
  }

  const date = new Date(value).toLocaleDateString();
  const dateSplitted = date.split('/');
  return dateSplitted ? `${dateSplitted[2]}-${dateSplitted[0]}-${dateSplitted[1]}` : null;
}

export const convertDecimalStr = (value?: string | null) => {
  if (!value) return 0;
  return Number(formatAmount(removeNonNumericCaracteres(value || ''))) / 100;
}

export const convertDatabaseDate = (value?: string | null) => {
  const currentDate = new Date(`${value} `)
  currentDate.setDate(currentDate.getDate() + 1);
  return formatDateToLocal(currentDate);
}

export const convertDatabaseDecimal = (value?: number | null) => {
  if (!value) return 0;
  return formatDecimal(value * 100);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function stringifyObject<T extends Record<string, any>>(obj: T): { [K in keyof T]: string } {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, value ? String(value) : ''])
  ) as { [K in keyof T]: string };
}

