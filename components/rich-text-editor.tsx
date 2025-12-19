"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Nhập nội dung...",
  minHeight = "200px"
}: RichTextEditorProps) {
  const [isPreview, setIsPreview] = useState(false)

  const insertMarkdown = (before: string, after: string = "") => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end)
    
    onChange(newText)
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
    }, 0)
  }

  const toolbarButtons = [
    { icon: "**B**", label: "Bold", action: () => insertMarkdown("**", "**") },
    { icon: "*I*", label: "Italic", action: () => insertMarkdown("*", "*") },
    { icon: "H1", label: "Heading", action: () => insertMarkdown("# ") },
    { icon: "[]", label: "Link", action: () => insertMarkdown("[", "](url)") },
    { icon: "``", label: "Code", action: () => insertMarkdown("`", "`") },
    { icon: "•", label: "List", action: () => insertMarkdown("- ") },
    { icon: "1.", label: "Numbered List", action: () => insertMarkdown("1. ") },
    { icon: ">", label: "Quote", action: () => insertMarkdown("> ") },
  ]

  // Simple markdown to HTML converter
  const renderMarkdown = (text: string) => {
    let html = text
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      // Code
      .replace(/`(.*?)`/g, '<code class="px-1 py-0.5 rounded bg-muted text-primary font-mono text-sm">$1</code>')
      // Links
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
      // Line breaks
      .replace(/\n/g, '<br/>')

    return html
  }

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 rounded-lg bg-muted/50 border border-border flex-wrap">
        {toolbarButtons.map((btn) => (
          <Button
            key={btn.label}
            type="button"
            size="sm"
            variant="ghost"
            onClick={btn.action}
            className="h-8 px-2 text-xs font-mono"
            title={btn.label}
          >
            {btn.icon}
          </Button>
        ))}
        
        <div className="flex-1" />
        
        <Button
          type="button"
          size="sm"
          variant={isPreview ? "default" : "ghost"}
          onClick={() => setIsPreview(!isPreview)}
          className="h-8 px-3 text-xs"
        >
          {isPreview ? "✏️ Edit" : "👁️ Preview"}
        </Button>
      </div>

      {/* Editor/Preview */}
      {isPreview ? (
        <div
          className="p-4 rounded-lg border border-border bg-background prose prose-sm max-w-none"
          style={{ minHeight }}
          dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }}
        />
      ) : (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="font-mono text-sm resize-none"
          style={{ minHeight }}
        />
      )}

      {/* Help Text */}
      <div className="text-xs text-muted-foreground">
        <details className="cursor-pointer">
          <summary className="hover:text-foreground">Markdown hỗ trợ</summary>
          <div className="mt-2 p-3 rounded-lg bg-muted/50 space-y-1">
            <p><code className="text-primary">**bold**</code> → <strong>bold</strong></p>
            <p><code className="text-primary">*italic*</code> → <em>italic</em></p>
            <p><code className="text-primary">`code`</code> → <code className="bg-muted px-1">code</code></p>
            <p><code className="text-primary">[text](url)</code> → link</p>
            <p><code className="text-primary"># Heading</code> → Heading</p>
            <p><code className="text-primary">- item</code> → bullet list</p>
            <p><code className="text-primary">&gt; quote</code> → blockquote</p>
          </div>
        </details>
      </div>
    </div>
  )
}
