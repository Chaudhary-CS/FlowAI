import { useState } from "react"
import { Plus, Trash2, Edit2, Archive, Check, Sparkles, Command } from "lucide-react"
import { cn } from "./lib/utils"
import { useBuckets } from "./hooks/useBuckets"

// "Premium" Design System Constants
const GLASS = "bg-zinc-950/80 backdrop-blur-xl border border-white/5"
const CARD_HOVER = "hover:bg-white/5 hover:border-white/10 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 ease-out"

function App() {
    const { buckets, loading, addBucket, deleteBucket } = useBuckets()
    const [isAdding, setIsAdding] = useState(false)
    const [newBucket, setNewBucket] = useState({ title: "", content: "" })

    const handleCreate = () => {
        if (!newBucket.title || !newBucket.content) return
        addBucket(newBucket)
        setNewBucket({ title: "", content: "" })
        setIsAdding(false)
    }

    if (loading) return (
        <div className="w-[360px] h-[520px] bg-zinc-950 text-zinc-400 flex flex-col items-center justify-center font-sans">
            <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-blue-500/20 animate-ping absolute"></div>
                <div className="w-12 h-12 rounded-full border-2 border-t-blue-500 animate-spin"></div>
            </div>
            <span className="mt-4 text-xs tracking-widest uppercase opacity-50">Initializing Core</span>
        </div>
    )

    return (
        <div className="w-[360px] h-[520px] bg-black text-zinc-100 flex flex-col font-sans selection:bg-blue-500/30">

            {/* Premium Header */}
            <header className={cn("p-5 flex justify-between items-center z-50 sticky top-0", GLASS)}>
                <div className="flex items-center gap-3 group cursor-default">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/40 group-hover:shadow-blue-500/50 transition-all duration-500">
                        <Sparkles className="w-5 h-5 text-white fill-white/20" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg tracking-tight leading-none bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">FlowAI</h1>
                        <span className="text-[10px] text-zinc-500 font-medium tracking-wider uppercase">Context Bridge</span>
                    </div>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 border border-white/5",
                        isAdding ? "bg-red-500/10 text-red-400 rotate-45 border-red-500/20" : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                    )}
                >
                    <Plus className="w-5 h-5" />
                </button>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-4 space-y-3 relative scrollbar-hide">

                {/* Input Form (Animated) */}
                <div className={cn(
                    "overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] origin-top",
                    isAdding ? "max-h-[300px] mb-4 opacity-100 scale-100" : "max-h-0 opacity-0 scale-95"
                )}>
                    <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-4 space-y-3 backdrop-blur-md">
                        <div className="space-y-1">
                            <label className="text-xs text-zinc-500 font-medium ml-1">Title</label>
                            <input
                                autoFocus
                                className="w-full bg-zinc-950/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 placeholder:text-zinc-700 transition-all"
                                placeholder="e.g. Japan Trip 2025"
                                value={newBucket.title}
                                onChange={(e) => setNewBucket({ ...newBucket, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-zinc-500 font-medium ml-1">Context Dump</label>
                            <textarea
                                className="w-full bg-zinc-950/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 min-h-[80px] placeholder:text-zinc-700 resize-none transition-all scrollbar-hide"
                                placeholder="Paste anything here. We'll handle the rest."
                                value={newBucket.content}
                                onChange={(e) => setNewBucket({ ...newBucket, content: e.target.value })}
                            />
                        </div>
                        <button
                            onClick={handleCreate}
                            disabled={!newBucket.title || !newBucket.content}
                            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white text-sm font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            <Check className="w-4 h-4" />
                            Start Flow
                        </button>
                    </div>
                </div>

                {/* Empty State */}
                {buckets.length === 0 && !isAdding && (
                    <div className="flex flex-col items-center justify-center h-[300px] text-zinc-600 space-y-4">
                        <div className="w-16 h-16 rounded-full bg-zinc-900/50 flex items-center justify-center border border-white/5">
                            <Command className="w-6 h-6 opacity-20" />
                        </div>
                        <div className="text-center space-y-1">
                            <p className="text-sm font-medium text-zinc-500">No active flows</p>
                            <p className="text-xs opacity-50">Create a bucket to bridge your memory</p>
                        </div>
                    </div>
                )}

                {/* Bucket List */}
                {buckets.map((bucket) => (
                    <div
                        key={bucket.id}
                        className={cn(
                            "group relative bg-zinc-900/30 border border-white/5 rounded-2xl p-4 cursor-pointer",
                            CARD_HOVER
                        )}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
                                <h3 className="font-medium text-zinc-200 group-hover:text-white transition-colors">{bucket.title}</h3>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity duration-200">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        deleteBucket(bucket.id)
                                    }}
                                    className="p-1.5 hover:bg-red-500/10 rounded-lg text-zinc-500 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                        <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed font-light group-hover:text-zinc-400 transition-colors">
                            {bucket.content}
                        </p>
                    </div>
                ))}
            </main>

            {/* Footer */}
            <footer className="p-4 border-t border-white/5 bg-zinc-950/50 backdrop-blur text-[10px] text-zinc-600 flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    System Active
                </span>
                <span className="opacity-50">v1.0.0</span>
            </footer>
        </div>
    )
}

export default App
