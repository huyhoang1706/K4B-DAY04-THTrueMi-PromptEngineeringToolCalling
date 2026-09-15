import { fetchServerSentEvents, type UIMessage, useChat } from '@tanstack/ai-react'
import { Bot, CircleAlert, Eraser, Wrench } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Conversation, ConversationContent, ConversationEmptyState, ConversationScrollButton } from '@/components/ai-elements/conversation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import './App.css'

const chatEndpoint = import.meta.env.VITE_CHAT_ENDPOINT ?? 'http://localhost:8000/api/chat'

function json(value: unknown) {
  return JSON.stringify(value, null, 2)
}

function ToolCall({ name, input, output, state }: { name: string; input?: unknown; output?: unknown; state: string }) {
  return (
    <Card size="sm" className="mt-3 border-blue-200 bg-blue-50/60 shadow-none">
      <CardHeader className="flex-row items-center gap-2 pb-2">
        <Wrench className="size-4 text-blue-700" />
        <CardTitle className="text-sm">{name}</CardTitle>
        <Badge variant={state === 'error' ? 'destructive' : 'secondary'} className="ml-auto">{state}</Badge>
      </CardHeader>
      <CardContent className="grid gap-2 text-xs sm:grid-cols-2">
        <pre className="overflow-auto rounded-md bg-white p-2 text-muted-foreground"><b>Input</b>{'\n'}{input === undefined ? 'Waiting for input' : json(input)}</pre>
        <pre className="overflow-auto rounded-md bg-white p-2 text-muted-foreground"><b>Result</b>{'\n'}{output === undefined ? 'Waiting for result' : json(output)}</pre>
      </CardContent>
    </Card>
  )
}

function ChatMessage({ message }: { message: UIMessage }) {
  const isUser = message.role === 'user'
  return (
    <div className={isUser ? 'ml-auto max-w-[85%] rounded-xl bg-secondary px-4 py-3 text-sm' : 'max-w-[85%] text-sm'}>
        {message.parts.map((part, index) => {
          if (part.type === 'text') return <p key={index} className="whitespace-pre-wrap leading-6">{part.content}</p>
          if (part.type === 'tool-call') return <ToolCall key={part.id} name={part.name} input={part.input} output={part.output} state={part.state} />
          if (part.type === 'tool-result') return <ToolCall key={part.toolCallId} name={part.name ?? 'tool result'} output={part.content} state={part.state === 'error' ? 'error' : 'complete'} />
          return null
        })}
    </div>
  )
}

function App() {
  const connection = useMemo(() => fetchServerSentEvents(chatEndpoint), [])
  const chat = useChat({ connection, threadId: 'helpdesk-demo' })
  const [input, setInput] = useState('')

  async function submit() {
    const text = input.trim()
    if (!text || chat.isLoading) return
    setInput('')
    await chat.sendMessage(text)
  }

  return (
    <main className="min-h-screen bg-muted/30 p-4 sm:p-8">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col overflow-hidden rounded-2xl border bg-background shadow-sm">
        <header className="flex items-center gap-3 border-b px-5 py-4">
          <div className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground"><Bot className="size-5" /></div>
          <div>
            <h1 className="m-0 text-base font-semibold tracking-normal">IT Helpdesk Agent</h1>
            <p className="text-xs text-muted-foreground">TanStack AI chat state · version v0</p>
          </div>
          <Badge variant={chat.isLoading ? 'secondary' : 'outline'} className="ml-auto">{chat.isLoading ? 'Streaming' : 'Ready'}</Badge>
          <Button variant="ghost" size="sm" onClick={chat.clear} disabled={chat.messages.length === 0}><Eraser /> Clear</Button>
        </header>

        <Conversation className="min-h-0 flex-1">
          <ConversationContent className="mx-auto w-full max-w-3xl gap-5 px-5 py-8">
            {chat.messages.length === 0 ? (
              <ConversationEmptyState icon={<Bot className="size-7" />} title="Ask the IT Helpdesk Agent" description="The interface sends messages to the configured SSE endpoint and renders each tool call with its input and result." />
            ) : chat.messages.filter((message) => message.role !== 'system').map((message) => <ChatMessage key={message.id} message={message} />)}
            {chat.error && <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"><CircleAlert className="mt-0.5 size-4 shrink-0" />{chat.error.message}</div>}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <footer className="border-t bg-background p-4">
          <div className="mx-auto max-w-3xl">
            <form className="flex items-end gap-2" onSubmit={(event) => { event.preventDefault(); void submit() }}>
              <textarea className="min-h-20 flex-1 resize-none rounded-xl border bg-background px-3 py-2 text-sm outline-none ring-ring/50 focus:ring-2" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Describe an IT issue or ask for help…" disabled={chat.isLoading} />
              <Button type="submit" disabled={!input.trim() || chat.isLoading}>{chat.isLoading ? 'Working…' : 'Send'}</Button>
              {chat.isLoading && <Button type="button" variant="outline" onClick={chat.stop}>Stop</Button>}
            </form>
            <p className="mt-2 text-center text-xs text-muted-foreground">Endpoint: <code>{chatEndpoint}</code> · Tool activity is rendered from TanStack message parts.</p>
          </div>
        </footer>
      </section>
    </main>
  )
}

export default App
