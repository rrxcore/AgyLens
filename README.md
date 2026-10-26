# 🔍 AgyLens

> **Developed by ~rrxcore**  
> A high-performance, 100% private **Antigravity Chat Explorer & Session Reader** designed to effortlessly explore, search, and inspect your AI conversations and coding sessions.

🌐 **Live Standalone Website**: [https://rrxcore.github.io/AgyLens/](https://rrxcore.github.io/AgyLens/)  
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Frrxcore%2FAgyLens)

---

## ⚡ Highlights & Features

- 🧠 **Smart Auto-Detection ("Khud ke jagah pe khud ajayega")**:
  - Drag and drop your **entire `.gemini/antigravity` folder**, a **`brain/` folder**, a **single conversation folder**, or a **`.zip` file**.
  - AgyLens automatically detects signatures, scans nested directories, and correlates SQLite databases, `.pbtxt` annotations, and `transcript.jsonl` files in client-side memory with zero manual configuration.
- 📦 **Dedicated Archive Section (`Archive (N)`)**:
  - In standard IDEs, archived chats are hidden and difficult to locate.
  - AgyLens automatically extracts `archived: true` annotations, giving you a dedicated collapsible Archive tab and instant search to rediscover old chats.
- 📌 **Pinned & Active Conversations**:
  - Pinned conversations float to the top (`📌 Pinned`).
  - Active sessions display a pulsing blue indicator dot (`●`) and relative timestamps (`18m`, `53m`, `3h`, `2d`).
- 💭 **Interactive Thinking & Reasoning Viewer**:
  - Expandable / collapsible thinking blocks showing the agent's internal chain-of-thought traces.
- 🛠️ **Tool Execution & Diff Badges**:
  - Inspect exact commands run (`run_command`), files edited (`edit_file`), and searches executed (`search_web`), along with execution logs and outputs.
- 📑 **Artifacts & Deliverables Showcase**:
  - Instant access to generated implementation plans, walkthroughs, and code scripts.
- 🔒 **100% Client-Side Privacy**:
  - Zero external servers or tracking. All chats stay strictly in your browser RAM.
- 🖥️ **1-Click Offline Desktop Launcher**:
  - Double-click `Start-AgyLens.bat` to launch and open the app in your browser offline anytime.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler**: [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Archive Extraction**: [JSZip](https://stuk.github.io/jszip/)
- **Testing**: [Vitest](https://vitest.dev/)

---

## 🚀 Quick Start (Local Development)

```bash
# Clone the repository
git clone https://github.com/rrxcore/AgyLens.git
cd AgyLens

# Install dependencies
npm install

# Start local dev server
npm run dev

# Run unit tests
npm test
```

---

## 🌐 Deploy to Vercel (1-Click)

1. Open [vercel.com/new](https://vercel.com/new).
2. Select your repository: `rrxcore/AgyLens`.
3. Click **Deploy**. Vercel will automatically build and assign a free global HTTPS domain.
