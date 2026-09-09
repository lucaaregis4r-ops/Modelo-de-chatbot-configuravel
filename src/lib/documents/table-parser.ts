import * as XLSX from "xlsx";

const MAX_ROWS = 5000;

export function parseTable(input: { name: string; size: number; data: Buffer }) {
  const workbook = XLSX.read(input.data, { type: "buffer", cellDates: true });
  const sections: string[] = [];
  let rows = 0;
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const matrix = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: "" });
    if (matrix.length < 2) continue;
    const headers = matrix[0].map((value) => String(value).trim());
    for (let index = 1; index < matrix.length && rows < MAX_ROWS; index += 1) {
      const values = matrix[index];
      if (!values.some((value) => String(value).trim())) continue;
      const fields = headers.map((header, column) => `${header || `coluna_${column + 1}`}: ${String(values[column] ?? "").trim()}`).join(" | ");
      sections.push(`[aba: ${sheetName}, linha: ${index + 1}] ${fields}`);
      rows += 1;
    }
  }
  if (rows >= MAX_ROWS) sections.push(`[aviso] Apenas as primeiras ${MAX_ROWS} linhas foram ingeridas.`);
  const text = sections.join("\n").trim();
  if (!text) throw new Error("A tabela não contém linhas relevantes.");
  return { name: input.name, size: input.size, mimeType: input.name.toLowerCase().endsWith(".csv") ? "text/csv" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", text };
}
