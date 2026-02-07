# FlowAI 🌊

**The Infinite Memory Layer for Every AI.**

FlowAI is a "Context Bridge" that follows you across **ChatGPT**, **Claude**, and **Perplexity**. It stores your project details, personal preferences, and life contexts ("Buckets") in your browser and injects them into AI chats with a single click.

---

## 🚀 Features

-   **Universal Memory:** Works on ChatGPT, Claude.ai, and Perplexity.ai.
-   **Privacy First:** All data lives in your browser (`chrome.storage.local`). Zero server dependency.
-   **Premium UI:** Glassmorphic design that feels like a native part of your OS.
-   **Free-Form Buckets:** Save *anything* (Code stacks, Travel plans, Grandma's recipes).

---

## 🛠️ Setup Guide (Developer Mode)

Since this is a private extension, you install it via Chrome Developer Mode.

1.  **Build the Project:**
    Open this folder in your terminal and run:
    ```bash
    npm install
    npm run build
    ```
    *(This creates a `dist` folder).*

2.  **Install in Chrome:**
    -   Go to `chrome://extensions/`
    -   Toggle **Developer mode** (top right).
    -   Click **Load unpacked**.
    -   Select the `dist` folder inside this project.

---

## 🧪 How to Test

### 1. Create a Bucket (The "Backpack")
-   Click the **FlowAI icon** in your Chrome toolbar.
-   Click **+** to add a bucket.
-   **Title:** `Japan Trip`
-   **Context:** `Budget $3000. Wife is vegetarian. I hate crowds.`
-   Click **Start Flow**.

### 2. Inject Context (The "Bridge")
-   Open **ChatGPT** (or Claude/Perplexity).
-   Look for the **Flow Infinity ♾️** orb in the bottom right corner.
-   Click it to open the Memory Bridge.
-   Click **Japan Trip**.
-   *Boom!* The context is injected into your chat input.

### 3. Ask the AI
-   Now type: *"Plan a dinner for tonight."*
-   See how the AI magically knows about the vegetarian requirement and budget!

---

## 🏗️ Tech Stack

-   **Frontend:** React + Vite
-   **Styling:** Tailwind CSS (Glassmorphism)
-   **Icons:** Lucide React
-   **Storage:** Chrome Storage API (Persistence)
-   **Bridge:** DOM Manipulation (Content Scripts)

---

> "Stop repeating yourself. Let the flow take over."
