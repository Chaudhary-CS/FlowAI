import { useState, useEffect } from 'react'

const STORAGE_KEY = 'flowai_buckets'

export function useBuckets() {
    const [buckets, setBuckets] = useState([])
    const [loading, setLoading] = useState(true)

    // Load from storage on mount
    useEffect(() => {
        const loadBuckets = async () => {
            try {
                if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                    // Production: Chrome Extension Storage
                    const result = await chrome.storage.local.get([STORAGE_KEY])
                    if (result[STORAGE_KEY]) {
                        setBuckets(result[STORAGE_KEY])
                    }
                } else {
                    // Development: LocalStorage
                    const stored = localStorage.getItem(STORAGE_KEY)
                    if (stored) {
                        setBuckets(JSON.parse(stored))
                    }
                }
            } catch (error) {
                console.error("Failed to load buckets:", error)
            } finally {
                setLoading(false)
            }
        }
        loadBuckets()
    }, [])

    // Save to storage whenever buckets change
    const saveBuckets = async (newBuckets) => {
        setBuckets(newBuckets)
        try {
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                await chrome.storage.local.set({ [STORAGE_KEY]: newBuckets })
            } else {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(newBuckets))
            }
        } catch (error) {
            console.error("Failed to save buckets:", error)
        }
    }

    const addBucket = (bucket) => {
        const newBuckets = [...buckets, { id: Date.now(), title: bucket.title, content: bucket.content }]
        saveBuckets(newBuckets)
    }

    const deleteBucket = (id) => {
        const newBuckets = buckets.filter(b => b.id !== id)
        saveBuckets(newBuckets)
    }

    const updateBucket = (id, updates) => {
        const newBuckets = buckets.map(b => b.id === id ? { ...b, ...updates } : b)
        saveBuckets(newBuckets)
    }

    return { buckets, loading, addBucket, deleteBucket, updateBucket }
}
