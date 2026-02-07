import { useState } from "react"
import { Plus, Trash2, Edit2, Archive, Check } from "lucide-react"
import { cn } from "./lib/utils"
import { useBuckets } from "./hooks/useBuckets"

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
        <div className="w-[350px] h-[500px] bg-slate-950 flex items-center justify-center text-slate-500 font-sans">
            <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs">Loading Context...</span>
            </div>
        </div>
    )

    return (
        <div className="w-[350px] h-[500px] bg-slate-950 text-slate-50 flex flex-col font-sans">
            {/* Header */}
            <header className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur z-10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
                        <Archive className="w-4 h-4 text-white" />
                    </div>
                    <h1 className="font-bold text-lg tracking-tight">FlowAI</h1>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className={cn("p-2 rounded-full transition-all duration-300", isAdding ? "bg-red-500/10 rotate-45" : "hover:bg-slate-800")}
                >
                    <Plus className={cn("w-5 h-5", isAdding ? "text-red-400" : "text-blue-400")} />
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 space-y-3 relative">
                {isAdding && (
                    <div className="animate-in slide-in-from-top-4 fade-in duration-200 mb-4 bg-slate-900 border border-slate-700/50 rounded-xl p-3 shadow-2xl">
                        <input
                            autoFocus
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 mb-2 placeholder:text-slate-600"
                            placeholder="Bucket Name (e.g., Japan Trip)"
                            value={newBucket.title}
                            onChange={(e) => setNewBucket({ ...newBucket, title: e.target.value })}
                        />
                        <textarea
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 min-h-[80px] mb-2 placeholder:text-slate-600 resize-none"
                            placeholder="Context dumping ground... (e.g., Vegetarian, Budget $3k)"
                            value={newBucket.content}
                            onChange={(e) => setNewBucket({ ...newBucket, content: e.target.value })}
                        />
                        <button
                            onClick={handleCreate}
                            disabled={!newBucket.title || !newBucket.content}
                            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <Check className="w-4 h-4" />
                            Create Bucket
                        </button>
                    </div>
                )}

                {buckets.length === 0 && !isAdding && (
                    <div className="text-center text-slate-600 mt-10">
                        <p className="text-sm">No buckets found.</p>
                        <p className="text-xs">Click + to add your first context.</p>
                    </div>
                )}

                {buckets.map((bucket) => (
                    <div
                        key={bucket.id}
                        className="group relative bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-blue-500/50 transition-all cursor-pointer hover:shadow-xl hover:shadow-blue-900/10"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-slate-100">{bucket.title}</h3>
                            <div className="opacity-0 group-hover:opacity-100 flex gap-2 transition-opacity">
                                <button className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-blue-400">
                                    <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        deleteBucket(bucket.id)
                                    }}
                                    className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                        <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                            {bucket.content}
                        </p>
                    </div>
                ))}
            </main>

            {/* Footer / Status */}
            <footer className="p-3 border-t border-slate-800 bg-slate-900/30 text-xs text-slate-500 flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    System Ready
                </span>
                <span>v1.0.0</span>
            </footer>
        </div>
    )
}

export default App
