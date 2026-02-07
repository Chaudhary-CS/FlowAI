import React from 'react'
import ReactDOM from 'react-dom/client'
import { Archive, X, Check } from 'lucide-react'
import { clsx } from "clsx"

// --- Injection Logic ---
function injectContext(content) {
    const activeElement = document.activeElement
    const url = window.location.hostname

    // 1. ChatGPT Logic
    if (url.includes('chatgpt.com')) {
        const textarea = document.querySelector('#prompt-textarea')
        if (textarea) {
            textarea.value = `[System Context: ${content}]\n\n` + textarea.value
            textarea.dispatchEvent(new Event('input', { bubbles: true }))
            textarea.focus()
            return true
        }
    }

    // 2. Claude Logic
    if (url.includes('claude.ai')) {
        const editor = document.querySelector('div[contenteditable="true"]')
        if (editor) {
            // Claude uses a complex editor, we might need to append text node
            // Simple approach: focused element
            if (activeElement && activeElement.isContentEditable) {
                document.execCommand('insertText', false, `[System Context: ${content}]\n\n`)
                return true
            }
        }
    }

    // 3. Perplexity Logic
    if (url.includes('perplexity.ai')) {
        const textarea = document.querySelector('textarea')
        if (textarea) {
            textarea.value = `[System Context: ${content}]\n\n` + textarea.value
            textarea.dispatchEvent(new Event('input', { bubbles: true }))
            textarea.focus()
            return true
        }
    }

    // Fallback: Generic Copy to Clipboard
    navigator.clipboard.writeText(`[System Context: ${content}]\n\n`)
    alert("Context copied to clipboard! (Could not auto-inject on this site)")
    return false
}

// --- UI Component ---
function FlowOverlay() {
    const [isOpen, setIsOpen] = React.useState(false)
    const [buckets, setBuckets] = React.useState([])
    const [lastInjected, setLastInjected] = React.useState(null)

    React.useEffect(() => {
        // Load buckets from storage
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            chrome.storage.local.get(['flowai_buckets'], (result) => {
                if (result.flowai_buckets) {
                    setBuckets(result.flowai_buckets)
                }
            })
        }
    }, [isOpen]) // Reload when opened

    const handleInject = (bucket) => {
        const success = injectContext(bucket.content)
        if (success) {
            setLastInjected(bucket.id)
            setTimeout(() => setLastInjected(null), 2000)
        }
    }

    return (
        <div className="fixed bottom-4 right-4 z-[9999] font-sans text-base leading-normal">
            <div className={clsx(
                "bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden flex flex-col mb-4",
                isOpen ? "w-[320px] h-[400px] opacity-100 translate-y-0" : "w-0 h-0 opacity-0 translate-y-10"
            )}>
                {/* Header */}
                <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Archive className="w-4 h-4 text-blue-500" />
                        <span className="text-slate-100 font-bold text-sm">FlowAI Memory</span>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Bucket List */}
                <div className="p-3 flex-1 overflow-y-auto space-y-2 bg-slate-950 scrollbar-thin scrollbar-thumb-slate-800">
                    {buckets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-4">
                            <span className="text-4xl mb-3">📭</span>
                            <p className="text-slate-400 font-medium text-sm">No contexts found</p>
                            <p className="text-slate-600 text-xs mt-1">Open the FlowAI extension icon<br />to create your first bucket.</p>
                        </div>
                    ) : (
                        buckets.map(bucket => (
                            <button
                                key={bucket.id}
                                onClick={() => handleInject(bucket)}
                                className="w-full text-left p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800 transition-all group relative overflow-hidden"
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <div className="font-medium text-slate-200 text-sm group-hover:text-blue-400 transition-colors">
                                        {bucket.title}
                                    </div>
                                    {lastInjected === bucket.id && (
                                        <span className="text-emerald-500 text-xs flex items-center gap-1 animate-in fade-in slide-in-from-right-2">
                                            <Check className="w-3 h-3" /> Injected
                                        </span>
                                    )}
                                </div>
                                <div className="text-xs text-slate-500 line-clamp-2 leading-relaxed opacity-80">
                                    {bucket.content}
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-full shadow-lg shadow-blue-900/20 transition-all hover:scale-110 active:scale-95 flex items-center gap-2 ml-auto"
            >
                <Archive className="w-5 h-5" />
            </button>
        </div>
    )
}

// --- Mount Logic ---
const rootId = 'flowai-overlay-root'
const existingRoot = document.getElementById(rootId)

if (!existingRoot) {
    const root = document.createElement('div')
    root.id = rootId
    document.body.appendChild(root)

    ReactDOM.createRoot(root).render(
        <React.StrictMode>
            <FlowOverlay />
        </React.StrictMode>
    )

    console.log("FlowAI Bridge: Injected successfully.")
}
