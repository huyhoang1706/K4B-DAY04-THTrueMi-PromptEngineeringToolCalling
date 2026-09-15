import { fetchServerSentEvents, type UIMessage, useChat } from '@tanstack/ai-react'
import { Bot, CircleAlert, Eraser } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Conversation, ConversationContent, ConversationEmptyState, ConversationScrollButton } from '@/components/ai-elements/conversation'
import { MessageResponse } from '@/components/ai-elements/message'
import { PromptInput, PromptInputBody, PromptInputFooter, PromptInputSubmit, PromptInputTextarea, type PromptInputMessage } from '@/components/ai-elements/prompt-input'
import { Tool, ToolContent, ToolHeader, ToolInput, ToolOutput, type ToolPart } from '@/components/ai-elements/tool'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import './App.css'

const chatEndpoint = import.meta.env.VITE_CHAT_ENDPOINT ?? 'http://localhost:8000/api/chat'

function toolState(state: string): ToolPart['state'] {
  if (state === 'approval-requested' || state === 'approval-responded') return state
  if (state === 'complete') return 'output-available'
  if (state === 'error') return 'output-error'
  if (state === 'input-complete' || state === 'streaming') return 'input-available'
  return 'input-streaming'
}

function ToolWidget({ name, input, output, state, error }: { name: string; input?: unknown; output?: unknown; state: string; error?: string }) {
  const displayState = toolState(state)
  return (
    <Tool className="mt-3" defaultOpen={displayState === 'output-error'}>
      <ToolHeader type="dynamic-tool" toolName={name} state={displayState} />
      <ToolContent>
        {input !== undefined && <ToolInput input={input} />}
        <ToolOutput output={output} errorText={error} />
      </ToolContent>
    </Tool>
  )
}

function ChatMessage({ message }: { message: UIMessage }) {
  const isUser = message.role === 'user'
  return (
    <div className={isUser ? 'ml-auto max-w-[85%] rounded-xl bg-secondary px-4 py-3 text-sm' : 'max-w-[85%] text-sm'}>
        {message.parts.map((part, index) => {
          if (part.type === 'text') {
            if (isUser) return <p key={index} className="whitespace-pre-wrap leading-6">{part.content}</p>
            return <MessageResponse key={index}>{part.content}</MessageResponse>
          }
          if (part.type === 'tool-call') return <ToolWidget key={part.id} name={part.name} input={part.input} output={part.output} state={part.state} />
          if (part.type === 'tool-result') return <ToolWidget key={part.toolCallId} name={part.name ?? 'tool result'} output={part.content} state={part.state} error={part.error} />
          return null
        })}
    </div>
  )
}

function App() {
  const connection = useMemo(() => fetchServerSentEvents(chatEndpoint), [])
  const chat = useChat({ connection, threadId: 'helpdesk-demo' })
  const [input, setInput] = useState('')

  async function submit(message: PromptInputMessage) {
    const text = message.text.trim()
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
            <h1 className="m-0 text-base font-semibold tracking-normal text-black">IT Helpdesk Agent</h1>
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
            <PromptInput onSubmit={submit}>
              <PromptInputBody>
                <PromptInputTextarea aria-label="Message" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Describe an IT issue or ask for help…" disabled={chat.isLoading} />
              </PromptInputBody>
              <PromptInputFooter className="justify-end">
                <PromptInputSubmit status={chat.isLoading ? 'streaming' : 'ready'} onStop={chat.stop} disabled={!chat.isLoading && !input.trim()} />
              </PromptInputFooter>
            </PromptInput>
          </div>
        </footer>
      </section>
    </main>
  )
}

export default App
