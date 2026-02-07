import React from 'react'
import ReactDOM from 'react-dom/client'
import { Archive, X, Check, Sparkles, Zap } from 'lucide-react'
import { clsx } from "clsx"

// --- Injection Logic (Kept same, just UI update) ---
function injectContext(content) {
    const activeElement = document.activeElement
    const url = window.location.hostname
    const payload = `[System Context: ${content}]\n\n`

    if (url.includes('chatgpt.com')) {
        const textarea = document.querySelector('#prompt-textarea')
        if (textarea) {
            textarea.value = payload + textarea.value
            textarea.dispatchEvent(new Event('input', { bubbles: true }))
            textarea.focus()
            return true
        }
    }

    if (url.includes('claude.ai')) {
        if (activeElement && activeElement.isContentEditable) {
            document.execCommand('insertText', false, payload)
            return true
        }
    }

    if (url.includes('perplexity.ai')) {
        const textarea = document.querySelector('textarea')
        if (textarea) {
            textarea.value = payload + textarea.value
            textarea.dispatchEvent(new Event('input', { bubbles: true }))
            textarea.focus()
            return true
        }
    }

    navigator.clipboard.writeText(payload)
    return false // Return false to trigger "Copy" feedback
}

// --- Premium UI Component ---
function FlowOverlay() {
    const [isOpen, setIsOpen] = React.useState(false)
    const [buckets, setBuckets] = React.useState([])
    const [lastInjected, setLastInjected] = React.useState(null)

    React.useEffect(() => {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            chrome.storage.local.get(['flowai_buckets'], (result) => {
                if (result.flowai_buckets) {
                    setBuckets(result.flowai_buckets)
                }
            })
        }
    }, [isOpen])

    const handleInject = (bucket) => {
        const success = injectContext(bucket.content)
        // Always show success feedback for better UX (either injected or copied)
        setLastInjected(bucket.id)
        setTimeout(() => setLastInjected(null), 2000)

        // Close overlay automatically after injection for flow
        setTimeout(() => setIsOpen(false), 800)
    }

    return (
        <div className="fixed bottom-6 right-6 z-[9999] font-sans antialiased text-base leading-normal">

            {/* Floating Panel (Apple-like Glass) */}
            <div className={clsx(
                "absolute bottom-full right-0 mb-4 bg-zinc-950/90 backdrop-blur-2xl border border-white/10 rounded-[24px] shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.32,0.725,0.25,1)] overflow-hidden flex flex-col origin-bottom-right",
                isOpen ? "w-[340px] h-[450px] opacity-100 scale-100 translate-y-0" : "w-[0px] h-[0px] opacity-0 scale-50 translate-y-10"
            )}>

                {/* Header */}
                <div className="p-5 border-b border-white/5 bg-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/50">
                            <Zap className="w-4 h-4 text-white fill-white/20" />
                        </div>
                        <div>
                            <span className="text-white font-bold text-sm tracking-tight block">Memory Bridge</span>
                            <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">Select Context</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Bucket List */}
                <div className="p-3 flex-1 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                    {buckets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-6 text-zinc-500">
                            <Sparkles className="w-8 h-8 mb-3 opacity-20" />
                            <p className="text-sm font-medium text-zinc-400">Void mode</p>
                            <p className="text-xs opacity-50 mt-1">Add memory buckets in the main extension.</p>
                        </div>
                    ) : (
                        buckets.map(bucket => (
                            <button
                                key={bucket.id}
                                onClick={() => handleInject(bucket)}
                                className="w-full text-left p-4 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/10 transition-all duration-300 group relative overflow-hidden active:scale-[0.98]"
                            >
                                <div className="flex justify-between items-start mb-1.5">
                                    <div className="font-semibold text-zinc-200 text-sm group-hover:text-blue-200 transition-colors">
                                        {bucket.title}
                                    </div>
                                    {lastInjected === bucket.id && (
                                        <span className="text-emerald-400 text-xs flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full font-medium animate-in fade-in slide-in-from-right-4">
                                            <Check className="w-3 h-3" /> Active
                                        </span>
                                    )}
                                </div>
                                <div className="text-xs text-zinc-500 line-clamp-2 leading-relaxed opacity-75 group-hover:text-blue-200/60 font-light">
                                    {bucket.content}
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Floating Trigger Button (The "Orb") */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "relative flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-500 hover:scale-110 active:scale-90 group z-50",
                    isOpen ? "bg-zinc-800 rotate-90" : "bg-gradient-to-br from-blue-600 to-indigo-600 hover:shadow-blue-500/30"
                )}
            >
                {isOpen ? (
                    <X className="w-6 h-6 text-zinc-400" />
                ) : (
                    <Zap className="w-6 h-6 text-white fill-white/20 group-hover:animate-pulse" />
                )}
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
}
