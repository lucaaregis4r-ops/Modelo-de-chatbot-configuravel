import mammoth from "mammoth";

export async function parseDocx(input: { name: string; size: number; data: Buffer }) {
  const result = await mammoth.extractRawText({ buffer: input.data });
  const text = result.value.replace(/\r\n?/g, "\n").replace(/[ \t]+$/gm, "").replace(/\n{3,}/g, "\n\n").trim();
  if (!text) throw new Error("O DOCX não contém texto útil para indexação.");
  return { name: input.name, size: input.size, mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", text };
}
