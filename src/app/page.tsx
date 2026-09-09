"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import type { AssistantConfig } from "@/lib/contracts";
import type { SourceRef } from "@/lib/contracts";
import type { Question } from "@/lib/questions";
import type { Evaluation } from "@/lib/evaluator";
import { parseAssistantExport, serializeAssistant } from "@/lib/export-import";

type Message = { id: number; role: "user" | "assistant"; content: string };

export default function Home() {
  const [assistant, setAssistant] = useState<AssistantConfig>({
    id: "default",
    name: "Assistente local",
    description: "Um assistente configurável.",
    instructions: "Seja claro, direto e prestativo.",
    providerId: "local",
    model: "local",
    mode: "consulta",
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [form, setForm] = useState(assistant);
  const [formError, setFormError] = useState("");
  const [saved, setSaved] = useState(false);
  const [documents, setDocuments] = useState<Array<{ id: string; name: string; size?: number }>>([]);
  const [uploadMessage, setUploadMessage] = useState("");
  const [sources, setSources] = useState<SourceRef[]>([]);
  const [trainingQuestions, setTrainingQuestions] = useState<Question[]>([]);
  const [trainingIndex, setTrainingIndex] = useState(0);
  const [trainingAnswer, setTrainingAnswer] = useState("");
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [trainingMessage, setTrainingMessage] = useState("");
  const [assistantSummaries, setAssistantSummaries] = useState<Array<{ id: string; name: string; documentCount: number; threadCount: number }>>([]);
  const [history, setHistory] = useState<Array<{ id: string; createdAt: string; messageCount: number }>>([]);

  async function loadDocuments(assistantId: string) {
    const response = await fetch(`/api/documents?assistantId=${encodeURIComponent(assistantId)}`);
    const data = await response.json() as { documents?: Array<{ id: string; name: string; size?: number }> };
    setDocuments(data.documents ?? []);
  }

  useEffect(() => { void loadDocuments(assistant.id); }, [assistant.id]);
  useEffect(() => { void fetch("/api/assistants").then((response) => response.json()).then((data: { assistants?: typeof assistantSummaries }) => setAssistantSummaries(data.assistants ?? [])); }, [saved]);

  async function uploadDocument(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const payload = new FormData(); payload.append("file", file); payload.append("assistantId", assistant.id);
    await saveAssistantToDatabase(assistant);
    const response = await fetch("/api/documents", { method: "POST", body: payload });
    const data = await response.json() as { document?: { id: string; name: string; size?: number }; error?: string };
    setUploadMessage(data.error ?? `Documento ${data.document?.name} enviado.`);
    if (data.document) setDocuments((current) => [data.document!, ...current]);
    event.target.value = "";
  }

  async function saveAssistantToDatabase(nextAssistant: AssistantConfig) {
    await fetch("/api/assistants", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(nextAssistant) });
  }

  function applyAssistant(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name.trim() || !form.description.trim() || !form.instructions.trim()) {
      setFormError("Preencha nome, descrição e instruções.");
      setSaved(false);
      return;
    }
    setAssistant({ ...form, name: form.name.trim(), description: form.description.trim(), instructions: form.instructions.trim() });
    void saveAssistantToDatabase(form);
    setMessages([]);
    setFormError("");
    setSaved(true);
  }

  async function removeDocument(id: string) {
    const response = await fetch("/api/documents", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, assistantId: assistant.id }) });
    if (response.ok) { setDocuments((current) => current.filter((document) => document.id !== id)); setUploadMessage("Documento removido da base deste assistente."); }
  }

  async function startTraining() {
    setTrainingMessage("Gerando questões..."); setEvaluation(null);
    const response = await fetch("/api/questions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ assistant, topic: "os documentos da base", quantity: 3 }) });
    const data = await response.json() as { questions?: Question[]; error?: string };
    if (!response.ok || !data.questions?.length) { setTrainingMessage(data.error ?? "Não foi possível gerar questões."); return; }
    setTrainingQuestions(data.questions); setTrainingIndex(0); setTrainingAnswer(""); setTrainingMessage("");
  }

  async function submitTrainingAnswer() {
    const question = trainingQuestions[trainingIndex];
    if (!question || !trainingAnswer.trim()) return;
    const response = await fetch("/api/evaluate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ assistant, question, answer: trainingAnswer, context: question.sources.map((source) => source.excerpt ?? "").join("\n") }) });
    const data = await response.json() as { evaluation?: Evaluation; error?: string };
    if (!response.ok || !data.evaluation) { setTrainingMessage(data.error ?? "Não foi possível avaliar."); return; }
    setEvaluation(data.evaluation); setTrainingMessage("");
    void fetch("/api/training-results", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ assistantId: assistant.id, question: question.question, score: data.evaluation.score, status: data.evaluation.status }) });
  }

  function nextTrainingQuestion() { setTrainingIndex((index) => index + 1); setTrainingAnswer(""); setEvaluation(null); }

  async function loadHistory() { const response = await fetch(`/api/threads?assistantId=${assistant.id}`); const data = await response.json() as { threads?: typeof history }; setHistory(data.threads ?? []); }
  async function openThread(id: string) { const response = await fetch(`/api/threads?threadId=${id}`); const data = await response.json() as { messages?: Message[] }; setMessages(data.messages ?? []); }
  async function removeAssistant(id: string) { if (!window.confirm("Excluir este assistente e sua base?")) return; const response = await fetch("/api/assistants", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); if (response.ok) setAssistantSummaries((current) => current.filter((item) => item.id !== id)); }
  function exportAssistant() { const blob = new Blob([serializeAssistant(assistant)], { type: "application/json" }); const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = `${assistant.name.replace(/\s+/g, "-").toLowerCase()}.json`; link.click(); URL.revokeObjectURL(link.href); }
  async function importAssistant(event: ChangeEvent<HTMLInputElement>) { const file = event.target.files?.[0]; if (!file) return; try { const imported = parseAssistantExport(await file.text()); setAssistant(imported); setForm(imported); await saveAssistantToDatabase(imported); setSaved(true); setFormError(""); } catch (error) { setFormError(error instanceof Error ? error.message : "Não foi possível importar o JSON."); } event.target.value = ""; }

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = draft.trim();
    if (!content) return;

    const userMessage = { id: Date.now(), role: "user" as const, content };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setDraft("");

    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: nextMessages, assistant }) });
      const data = await response.json() as { message?: { content?: string }; sources?: SourceRef[]; error?: string };
      setSources(data.sources ?? []);
      setMessages((current) => [...current, { id: Date.now() + 1, role: "assistant", content: data.message?.content ?? data.error ?? "Não foi possível obter uma resposta." }]);
    } catch {
      setMessages((current) => [...current, { id: Date.now() + 1, role: "assistant", content: "Não foi possível conectar ao servidor." }]);
    }
  }

  return (
    <main className="shell">
      <section className="chat-card" aria-label="Chatbot Genérico">
        <header className="chat-header">
          <div>
            <p className="eyebrow">CHATBOT GENÉRICO</p>
            <h1>Olá, como posso ajudar?</h1>
          </div>
          <span className="status"><i /> IA</span>
        </header>

        <details className="assistant-settings" open>
          <summary>Configurar assistente · {assistant.name}</summary>
          <form onSubmit={applyAssistant}>
            <label>Nome<input required value={form.name} onChange={(event) => { setForm({ ...form, name: event.target.value }); setSaved(false); }} /></label>
            <label>Descrição<input required value={form.description} onChange={(event) => { setForm({ ...form, description: event.target.value }); setSaved(false); }} /></label>
            <label>Instruções<textarea required value={form.instructions} onChange={(event) => { setForm({ ...form, instructions: event.target.value }); setSaved(false); }} /></label>
            <label>Modo<select value={form.mode} onChange={(event) => setForm({ ...form, mode: event.target.value as AssistantConfig["mode"] })}>
              <option value="consulta">Consulta</option>
              <option value="tutor">Tutor</option>
              <option value="avaliacao">Avaliação</option>
            </select></label>
            <label>Provider<select value={form.providerId ?? "local"} onChange={(event) => setForm({ ...form, providerId: event.target.value, model: event.target.value === "openrouter" ? "openai/gpt-4o-mini" : event.target.value === "gemini" ? "gemini-2.0-flash" : "local" })}>
              <option value="local">Local (teste)</option>
              <option value="openrouter">OpenRouter</option>
              <option value="gemini">Google Gemini</option>
            </select></label>
            <label>Modelo<input value={form.model ?? ""} onChange={(event) => setForm({ ...form, model: event.target.value })} /></label>
            <button className="save-assistant" type="submit">Salvar e aplicar</button>
            <div className="export-actions"><button type="button" onClick={exportAssistant}>Exportar JSON</button><label>Importar JSON<input type="file" accept="application/json,.json" onChange={importAssistant} /></label></div>
            {formError && <p className="form-error" role="alert">{formError}</p>}
            {saved && <p className="form-success" role="status">Configuração aplicada ao chat.</p>}
          </form>
          <p className="settings-hint">As instruções serão enviadas como regra do sistema na próxima mensagem.</p>
          <label className="upload-label">Base de conhecimento (TXT, MD, PDF, DOCX, CSV ou XLSX)<input type="file" accept=".txt,.md,.pdf,.docx,.csv,.xlsx,text/plain,text/markdown,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={uploadDocument} /></label>
          {documents.length > 0 && <ul className="documents">{documents.map((document) => <li key={document.id}><span>{document.name}</span><button type="button" onClick={() => void removeDocument(document.id)} aria-label={`Remover ${document.name}`}>Remover</button></li>)}</ul>}
          {uploadMessage && <p className="settings-hint" role="status">{uploadMessage}</p>}
        </details>

        <section className="training-panel" aria-label="Treinamento">
          <div className="training-heading"><strong>Treinamento</strong><button type="button" onClick={() => void startTraining()}>Iniciar sessão</button></div>
          {trainingQuestions.length > 0 && trainingIndex < trainingQuestions.length && <div className="training-question"><small>Questão {trainingIndex + 1} de {trainingQuestions.length}</small><p>{trainingQuestions[trainingIndex].question}</p><textarea value={trainingAnswer} onChange={(event) => setTrainingAnswer(event.target.value)} placeholder="Escreva sua resposta..." /><button type="button" onClick={() => void submitTrainingAnswer()}>Enviar resposta</button>{evaluation && <div className="evaluation"><strong>{evaluation.status} · {evaluation.score}/100</strong><p>{evaluation.justification}</p>{evaluation.sources.map((source) => <small key={source.chunkId}>{source.documentName}</small>)}{trainingIndex + 1 < trainingQuestions.length ? <button type="button" onClick={nextTrainingQuestion}>Próxima questão</button> : <small>Sessão concluída.</small>}</div>}</div>}
          {trainingMessage && <p className="settings-hint" role="status">{trainingMessage}</p>}
        </section>
        <details className="admin-panel"><summary>Assistentes e histórico</summary><ul className="admin-list">{assistantSummaries.map((item) => <li key={item.id}><strong>{item.name}</strong><small>{item.documentCount} documentos · {item.threadCount} conversas</small><button type="button" onClick={() => void removeAssistant(item.id)}>Excluir</button></li>)}</ul><button type="button" onClick={() => void loadHistory()}>Carregar conversas</button>{history.map((thread) => <button className="history-item" type="button" key={thread.id} onClick={() => void openThread(thread.id)}>{new Date(thread.createdAt).toLocaleString()} · {thread.messageCount} mensagens</button>)}</details>

        <div className="messages" aria-live="polite">
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="orb">✦</div>
              <p>Envie uma mensagem para começar.</p>
              <small>Conecte uma chave do provider no arquivo .env.local para conversar.</small>
            </div>
          ) : messages.map((message) => (
            <div className={`message-row ${message.role}`} key={message.id}>
              <div className="message">{message.content}</div>
            </div>
          ))}
          {sources.length > 0 && <div className="sources"><strong>Fontes consultadas</strong>{sources.map((source) => <small key={source.chunkId}>{source.documentName}: {source.excerpt}</small>)}</div>}
        </div>

        <form className="composer" onSubmit={sendMessage}>
          <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Digite sua mensagem..." aria-label="Mensagem" />
          <button type="submit" aria-label="Enviar mensagem">↑</button>
        </form>
        <p className="disclaimer">Sua chave permanece somente no servidor.</p>
      </section>
    </main>
  );
}
