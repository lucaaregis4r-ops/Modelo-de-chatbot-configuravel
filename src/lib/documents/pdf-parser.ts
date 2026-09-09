import { PDFParse } from "pdf-parse";

export async function parsePdf(input: { name: string; size: number; data: Buffer }) {
  const parser = new PDFParse({ data: input.data });
  try {
    const result = await parser.getText();
    const text = result.text.replace(/\r\n?/g, "\n").replace(/[ \t]+$/gm, "").replace(/\n{3,}/g, "\n\n").trim();
    if (!text) throw new Error("O PDF não contém texto extraível. PDFs escaneados exigem OCR.");
    return { name: input.name, size: input.size, mimeType: "application/pdf", text };
  } finally {
    await parser.destroy();
  }
}
