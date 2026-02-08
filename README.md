# FlowAI 🌊

A Chrome extension that acts as a persistent context layer across AI tools. Instead of
re-explaining your project stack, preferences, or constraints every time you open a new
chat, FlowAI stores them locally and injects the right context into ChatGPT, Claude, or
Perplexity with a single click.

## 🏗️ Architecture

The extension runs across three layers:

```
popup/          React UI         Bucket manager, add/edit/delete contexts
content.js      Content Script   Detects active AI chat page, injects context on trigger
background.js   Service Worker   Manages Chrome Storage reads/writes, cross-tab state
```

Content scripts listen for the FlowAI trigger on supported pages and inject the selected
bucket directly into the chat input field via DOM manipulation. All reads and writes go
through `chrome.storage.local`, keeping latency near-zero and eliminating any server
dependency. The storage layer falls back to `localStorage` in the dev environment so the
UI can run without a browser extension context.

## 🚀 Features

- **Universal context injection** - works across ChatGPT, Claude.ai, and Perplexity.ai
- **Free-form buckets** - store any structured context: project stacks, constraints, preferences
- **Privacy first** - all data lives in the browser, nothing ever leaves the device
- **Persistent across sessions** - Chrome Storage API keeps buckets intact between restarts
- **Floating orb overlay** - one-click inject from any AI chat page without switching tabs

## 🛠️ Tech Stack

- **Frontend:** React, Vite
- **Styling:** Tailwind CSS
- **Storage:** Chrome Storage API with localStorage fallback
- **Bridge:** Manifest V3 content scripts, DOM injection
- **Icons:** Lucide React

## 📦 Setup

```bash
npm install
npm run build
```

Then in Chrome:
1. Go to `chrome://extensions/`
2. Enable Developer mode
3. Click Load unpacked and select the `dist/` folder

## 🧪 Testing

1. Open the extension and create a bucket with any context (project name, tech stack, constraints)
2. Navigate to ChatGPT, Claude, or Perplexity
3. Click the FlowAI orb in the bottom right corner
4. Select a bucket and the context injects directly into the chat input

## 🔧 What I'd Change

The content script currently polls for the chat input field on page load, which is fragile
when AI platforms update their DOM structure. A more reliable approach would be using a
MutationObserver to watch for the input field appearing rather than assuming it is present
on load. I would also add a structured sync layer using `chrome.storage.sync` so buckets
persist across devices, with conflict resolution for simultaneous edits.

## 👨‍💻 Developer

**Kartik Chaudhary**
- Email: chaudhary417@usf.edu
- GitHub: [@Chaudhary-CS](https://github.com/Chaudhary-CS)
