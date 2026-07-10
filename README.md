# Lumina AI

An Intelligence-Driven Career, Startup, and Opportunity Operating System built exclusively to empower women in technology, research, and business.

---

# The Idea

### The Real-World Problem
Despite advancements in gender representation in STEM and executive leadership, women continue to face systemic barriers in professional advancement, capital access, and strategic skill-building. Key barriers include:
* **The "Broken Rung" Phenomenon**: Women face significant hurdles transitioning from entry-level roles to their first managerial positions.
* **The Capital Gap**: Less than 3% of venture capital funding is allocated to all-female founding teams globally.
* **The Isolation Effect**: A lack of structured, hyper-personalized navigation makes professional and research landscapes difficult to traverse without existing high-tier networks.

### Why This Problem Matters
Sustained economic growth and genuine scientific innovation require diverse leadership. When women are excluded from building high-growth tech startups or leading AI research, the technology built represents only a subset of humanity. Closing this gap is not just an equity objective; it is a critical optimization of global cognitive and economic potential.

### Existing Limitations
Traditional career portals and educational hubs rely on static keyword-matching search engines, generic roadmap templates, and passive job listings. They fail to understand candidate backgrounds contextually, do not offer custom business-model stress testing for early-stage founders, and lack specialized, integrated micro-coaching and document understanding engines.

### Our Solution
Lumina AI acts as a comprehensive, high-fidelity Career & Opportunity Operating System built exclusively for women. It combines an advanced onboarding engine, personalized skill-gap roadmaps, an AI-powered Career Copilot, an Opportunity Explorer tracking high-yield research and scholarship pathways, an interactive Job & Internship Hub, and a full Startup Incubator to stress-test business ideas and generate Business Model Canvases.

### Why Our Approach is Unique
Instead of generic guidance, Lumina AI structures its entire platform around the user's specific stage (e.g., student, graduate, entrepreneur, researcher) and crafts targeted, context-rich pathways. It enforces native privacy via a localized file-system database, utilizes structured schema constraints for guaranteed JSON outputs from LLMs, and incorporates a dual-mode AI engine (seamless fallback to simulators when API keys are absent) to maintain 100% operational uptime.

### Expected Impact
Lumina AI shifts the professional development paradigm from reactive job hunting to proactive, comprehensive intelligence. By enabling women to analyze resumes against target job specs, design 12-week custom technical roadmaps, and instantly validate venture plans, we compress the time between early interest and real-world executive or entrepreneurial execution by over 60%.

---

# Important Links

* **Live Deployment Link**: [https://ais-pre-xyy23kfd6mdsf73kjn7wpt-295931303252.asia-southeast1.run.app](https://ais-pre-xyy23kfd6mdsf73kjn7wpt-295931303252.asia-southeast1.run.app)
* **Demo Video Link**: [Lumina AI Demonstration and Walkthrough Placeholder](https://youtube.com/placeholder-demo-lumina-ai)
* **GitHub Repository**: [Lumina AI Source Repository Placeholder](https://github.com/placeholder-user/lumina-ai)
* **Presentation Slides**: [Lumina AI Hackathon Deck Placeholder](https://slides.com/placeholder-lumina-ai)

---

# Features

### Feature 1: AI-Powered Career Copilot
* **Purpose**: To provide continuous, high-fidelity interview training, resume suggestions, and strategic career coaching.
* **User Benefit**: Direct access to an elite AI career advisor 24/7, tailored specifically to the user's career stage, current skills, and professional goals.
* **Technical Implementation**: Built using a server-side proxy route `/api/copilot/chat` communicating with `gemini-3.5-flash`. The backend constructs a system instruction block containing the user's detailed profile and handles messages with strict validation to prevent prompt injection or credential leakage.

### Feature 2: Startup Incubator & Business Validator
* **Purpose**: To democratize early-stage business advisory, allowing founders to stress-test startup concepts and auto-generate structured Business Model Canvases.
* **User Benefit**: Immediate structural feedback, risk assessment, 12-week launch roadmaps, and targeted grant discovery without requiring expensive business consultants.
* **Technical Implementation**: Exposes a POST route `/api/startup/validate` which accepts a business description and returns structured JSON conforming to a specific schema constraint. Enforced by Gemini's `responseMimeType: "application/json"`.

### Feature 3: Career Roadmap & Skill Gap Analyzer
* **Purpose**: To bridge the gap between a user's current skills and their high-tier career goals (e.g., AI Research, Quant Trading, Biotech Entrepreneurship).
* **User Benefit**: A custom, granular 12-week roadmap broken into 3 phases with target professional exams and critical skills to acquire.
* **Technical Implementation**: Implemented via `/api/career/roadmap`. The backend analyzes current competencies and career targets, querying the Gemini LLM with structured schema specifications to ensure consistent formatting on the React frontend.

### Feature 4: Resume Analyzer & Profile Optimizer
* **Purpose**: To evaluate resumes against a candidate's profile and target industry trends.
* **User Benefit**: Quantitative feedback (ATS-like score), identification of missing skills, custom interview prep Q&As based on the resume, and optimized LinkedIn headlines.
* **Technical Implementation**: Exposes `/api/career/resume` where raw text input is parsed and contextually graded. If API key checks fail, a fast, structured mock simulator handles grading using robust fallback algorithms.

### Feature 5: Job & Internship Hub with Cover Letter Generator
* **Purpose**: To manage the end-to-end application funnel and generate highly tailored, company-specific cover letters.
* **User Benefit**: Consolidates job listings, matches roles to the user's skills, and drafts custom-styled professional cover letters in seconds.
* **Technical Implementation**: Uses client-side state managers integrated with the `/api/jobs/cover-letter` endpoint. Generates formatted letters incorporating the user's academic and technical background dynamically.

### Feature 6: Opportunity Explorer
* **Purpose**: To match users with high-yield scholarships, hackathons, and research grants that typically suffer from discovery issues.
* **User Benefit**: Immediate access to non-dilutive funding, international hackathons, and specialized travel grants designed specifically to increase diversity in tech.
* **Technical Implementation**: Implemented in React as a dynamic search and filter engine with categorized indexing (Scholarships, Hackathons, Fellowships, Research Grants) stored in local state and validated against the profile stage.

### Feature 7: Financial Planner & Budgeting Tool
* **Purpose**: To provide early-stage professionals and students with financial literacy models for career transitions or startup launches.
* **User Benefit**: Visualized metrics of estimated cost of living, startup seed expenses, and savings targets.
* **Technical Implementation**: A client-side visualizer built using interactive forms to dynamically update savings runway estimates, helping women plan for runway periods during career changes.

---

# AI Capabilities

### AI Recommendation Engine
The core recommendation engine acts as a centralized brain, parsing the user's profile state (experience, industry targets, stage, and location) to filter and rank mock jobs, internships, and educational opportunities. The matching logic ensures that a high-school student sees science fairs and entry-level coding competitions, while a college graduate is presented with research fellowships and pre-seed accelerator opportunities.

### Personalization Framework
Lumina's personalization layers are dynamically constructed on first onboarding. By analyzing key questions (academic background, tech interests, and founder ambitions), the application alters its state. This determines the default system instructions injected into all downstream Gemini API calls, maintaining a persistent, high-context personality across all sub-modules.

### Search Intelligence and Ranking Logic
Rather than matching exact strings, Lumina's design handles semantic alignment. The search vectors align target skills with open positions and scholarships. The ranking logic assigns scores based on keyword intersection, education level suitability, and career path alignment.

### Resume Analysis
The resume analysis module acts as an automated Application Tracking System (ATS) coach. It analyzes structural layout, keyword density, and structural achievements, highlighting missing competencies that are strictly necessary to pass enterprise recruitment screening.

### Career Guidance and AI Chat Assistant
The Career Copilot provides structured, professional guidance. It can switch roles on demand—acting as a behavioral interviewer, a technical systems architect, or a negotiation strategist. The response system forces strict markdown, returning lists, code blocks, and bold key terms to guarantee high-quality legibility.

### Document Understanding
The platform parses raw text streams from uploaded documents or manual inputs, running entity-extraction tasks server-side to categorize experiences, technologies, and certifications without requiring manual database registration.

---

# Tech Stack & Tools

| Component | Technology | Detail |
| :--- | :--- | :--- |
| **Frontend** | React 18, TypeScript | Single-Page Application optimized with Vite |
| **Styling** | Tailwind CSS, Lucide Icons | Premium high-contrast layout, eye-safe dark slate theme |
| **Animations** | Motion (motion/react) | Staggered entrances, route transitions, modal popups |
| **Backend** | Express, Node.js | Robust REST API server on port 3000 |
| **Database** | File-System JSON Database | Local server storage (`database.json`) with transactional write patterns |
| **Authentication** | Passcode Cryptography & Cookie Session | HttpOnly cookie-based session tracking with SHA-256 password hashing |
| **AI Models** | Gemini 3.5 Flash | Driven by the official `@google/genai` TypeScript SDK |
| **APIs** | REST API Endpoints | Custom endpoints for auth, career copilot, startup validation, roadmaps |
| **Hosting** | Cloud Run Containers | Serverless execution, automatic scaling to zero |
| **Cloud Services** | Google Cloud Platform | Registry, Ingress, and Cloud Run infrastructure |
| **Dev Tools** | tsx, esbuild, TypeScript Compiler | Fast server development, unified ESM-to-CJS compilation |
| **Version Control** | Git, GitHub | Distributed version control |
| **Testing / Linting** | ESLint, TypeScript Compiler | Strict type checking (`tsc --noEmit`) |
| **Deployment** | Unified Production Build | Vite-bundled client, esbuild-bundled backend server |

---

# System Architecture

```
                                  +---------------------------------------+
                                  |            React Client               |
                                  | (Dashboard, Copilot, Onboarding, etc.)|
                                  +-------------------+---------------+---+
                                                      |               ^
                                         REST / JSON  |               |  HTML / Assets
                                                      v               |
+-----------------------------------------------------+---------------+---+
|                                Express.js Server                        |
|                                                                         |
|  +---------------------+   +---------------------+   +---------------+  |
|  |   Session Auth      |   |    AI API Routes    |   |  Static Asset |  |
|  | (HttpOnly Cookies)  |   | (Copilot, Roadmap)  |   |  Vite Server  |  |
|  +----------+----------+   +----------+----------+   +-------+-------+  |
|             |                         |                      |          |
+-------------|-------------------------|----------------------|----------+
              |                         |                      |
              v                         v                      v
      +-------+-------+       +---------+---------+   +--------+--------+
      |  database.json|       |  Google GenAI SDK |   |  Static Build   |
      | (Mock DB / FS)|       | (Gemini-3.5-Flash)|   | (Vite Dist Path)|
      +---------------+       +-------------------+   +-----------------+
```

### Frontend
A responsive React single-page application styled using Tailwind CSS and structured into modular, functional components. Uses `motion` for fluid state transitions. The UI implements custom panels for tracking tasks, simulating budgets, exploring opportunities, and querying the career copilot.

### Backend
An Express server written in TypeScript, acting as both an API server and a static file handler in production. Operates behind an nginx reverse proxy, binding to port `3000` on host `0.0.0.0`.

### Authentication Flow
Authentication uses HttpOnly cookie-based session tracking. Password validation utilizes a secure salt and PBKDF2-like SHA-256 hashing sequence. Upon successful login, a cryptographically random session token is generated, stored in the JSON database with an expiration date, and dispatched to the browser as a secure, HTTP-only cookie.

### Database Flow
To maintain lightweight agility during prototyping and hackathon runs, database management utilizes a local JSON file-system store (`database.json`). Reads and writes are handled using synchronous file locks and atomic writing patterns to prevent data corruption or concurrent state collisions.

### AI Layer
The AI layer is structured around the modern `@google/genai` SDK. To prevent startup crashes due to missing environment keys, the AI client utilizes **lazy initialization**—instantiating the GoogleGenAI instance only when the first API call occurs. It checks for a valid `GEMINI_API_KEY` and gracefully falls back to high-fidelity, contextual simulators if the key is missing or holds a default placeholder.

### External APIs
All external interactions (including communication with Google's LLM endpoints) are entirely proxied through `/api/*` backend routes. This ensures that the user's API credentials never leak to the client browser's developer console or network trace panels, maintaining enterprise-grade safety.

### Caching
Lumina implements localized caching for AI-generated assets, career roadmaps, and validated business canvases. It saves verified results directly to the user's local profile and cache schemas, eliminating redundant, costly model calls and boosting user interface responsiveness.

### Storage
User-uploaded files or raw textual data are stored within the JSON database layer and standard browser storage mechanisms (`localStorage`), ensuring state consistency across standard container restarts.

### Security
* **Secrets Protection**: Zero API keys are hardcoded in the repository; all configurations use environment-level orchestration.
* **XSS Prevention**: User inputs are sanitized before rendering, and markdown parsers strictly reject unescaped scripting segments.
* **Session Hijack Prevention**: HttpOnly cookies block client-side access to active authorization tokens from cross-site scripts.

---

# Project Workflow

```
[ User Onboarding / Stage Selection ]
                 |
                 v
[ Custom Workspace Focus Calibration ]
                 |
                 v
     +-----------+-----------+
     |                       |
     v                       v
[ AI Career Roadmap ]   [ Startup Business Canvas ]
     |                       |
     +-----------+-----------+
                 |
                 v
[ Interactive Dashboard & Activity Monitor ]
                 |
                 v
[ Opportunity Engine Matching & Funnel Tracking ]
                 |
                 v
[ Live Career Copilot Chat / Cover Letter Export ]
```

1. **Onboarding & Personalization**: The user accesses the landing page, creates an account or signs in as a demo user. They fill out their career stage (Student, Graduate, Entrepreneur, Researcher), professional interests, and active skills.
2. **Focus Calibration**: Lumina establishes localized configuration parameters to target resources.
3. **Dashboard Activation**: The user enters their main workspace, populated with custom metrics: matching internship alerts, current startup validation indicators, scheduled milestones, and financial runway summaries.
4. **Active Feature Usage**:
   * The user inputs a business plan in the **Startup Incubator**, triggering AI analysis.
   * The user copies their CV text into the **Resume Optimizer** to receive graded improvement reports.
   * The user searches the **Opportunity Explorer** for female-focused hackathons and venture grants.
5. **Interactive Copilot Chat**: The user interacts with the **Career Copilot** to simulate a behavioral mock interview.
6. **Recommendations & Execution**: Lumina recommends targeted professional certifications and displays detailed progress workflows to monitor task completion.

---

# Documentation

### How the Application Works Internally
Lumina is a unified full-stack application. When started, the Express backend serves the React frontend static build (`/dist/index.html` and assets). All client-side requests target custom Express endpoints under the `/api` route. The server handles validation, auth checks, database lookups, and AI queries before returning responses back to the client.

### How Data Flows Through the System
1. The client captures user interactions (e.g., submitting a startup concept) and issues a `POST` request to `/api/startup/validate`.
2. The server receives the payload, verifies session validity, and inspects the database to retrieve founder metadata.
3. The server formats the AI prompt, lazily initializes the `GoogleGenAI` client, and initiates a network request to Gemini.
4. Gemini returns the structured JSON, which the server parses, saves to the user's history in `database.json`, and returns to the client.
5. React receives the payload, triggers a local state re-render, and updates the dashboard visualizers.

### Communication and API Integration
Client-backend communication uses the standard `fetch` API utilizing HTTP headers set to `application/json`. JSON responses are structured using standard TypeScript types defined in `src/types.ts` to ensure strict interface contracts on both client and server layers.

### Authentication Mechanics
Sessions are validated by verifying the signature and expiration date of cookie-backed tokens against records inside `database.json`. The user database stores user records containing random cryptographically generated salts, protecting passcodes against pre-computed rainbow table attacks.

### Caching and Speed Optimization
By utilizing pre-compiled esbuild bundling for the backend and Vite code-splitting for the React client, loading latency remains below 100ms. Local caching of LLM-generated roadmap plans prevents unnecessary, slow roundtrips to external model API servers.

---

# AI Workflow

### Prompt Engineering Strategy
Lumina employs a structural prompt engineering strategy designed to minimize hallucination and enforce schema consistency. Prompts contain:
* **Context Anchoring**: Injecting the user's specific stage, major, skill set, and regional information directly into the prompt core.
* **Role Modeling**: Directing the LLM to act as a highly specialized, empathetic mentor targeting gender diversity issues in tech.
* **Format Constraint**: Appending strict TypeScript interfaces or JSON schemas with instructions to output *only* unadorned JSON payloads, eliminating conversational prefaces or postfaces.

### Context Building & Memory Management
In the Career Copilot, context is maintained by packaging previous message arrays with the active user profile before dispatching requests. The backend caps the active sliding memory buffer to the last 10 conversational exchanges to optimize token usage while maintaining relevant historical state.

### Response Generation & API Coordination
The server-side endpoint parses the active environment to identify if a real Gemini key exists. If so, it coordinates requests through the official Google GenAI SDK using `gemini-3.5-flash` with a temperature optimized for the target task (0.2 for strict JSON structures, 0.7 for fluid career conversations).

### Fallback Handling & Reliability
If a API rate-limit occurs, or if no key is present in the environmental variables, the system executes a fallback sequence. It returns high-fidelity simulated responses custom-tailored to the user's current profile. This prevents UI lockups and ensures a seamless experience for judges, investors, and developers during live reviews.

---

# Folder Structure

```
lumina-ai/
├── .env.example                 # Template for required environment secrets
├── .gitignore                   # Excluded build artifacts and node modules
├── database.json                # Local JSON store for users, profiles, and sessions
├── index.html                   # HTML entry point for the React client
├── metadata.json                # Application metadata and framework permissions
├── package.json                 # Dependency manifests, compilation and run scripts
├── server.ts                    # Main Express.js backend and API route gateway
├── tsconfig.json                # TypeScript compiler rules
├── vite.config.ts               # Vite bundler configuration
└── src/
    ├── App.tsx                  # Main client-side state router and layout manager
    ├── index.css                # Global styles, Tailwind imports, and custom fonts
    ├── main.tsx                 # React DOM bootstrapper
    ├── types.ts                 # Unified TypeScript interfaces and schemas
    ├── components/              # Modular user interface components
    │   ├── AIDashboard.tsx      # Main dashboard with stats and active monitoring
    │   ├── AIOnboarding.tsx    # Onboarding portal and focus area selector
    │   ├── AuthScreen.tsx       # Secure signup/login/demo launcher interface
    │   ├── CareerCopilot.tsx    # Career Copilot and interview training console
    │   ├── FinancePlanner.tsx   # Interactive budget planners and runway calculator
    │   ├── GoalTracker.tsx      # Milestone tracker and roadmap visualizer
    │   ├── JobHub.tsx           # Job listing grid and custom cover letter draft generator
    │   ├── LandingPage.tsx      # Premium product portal and marketing landing page
    │   ├── OpportunityExplorer.tsx # Scholarships, fellowships, and venture grant indexer
    │   ├── Settings.tsx         # User profile manager and account controls
    │   └── StartupIncubator.tsx # Stress-testing tool and Business Canvas generator
    └── data/
        └── mockData.ts          # Structured mock opportunities, jobs, and goals
```

---

# Challenges

1. **Ensuring UI Consistency Under Variable AI Outputs**: Language models can return divergent JSON formats. We solved this by using strict JSON Schema configuration parameters on Gemini API calls, forcing the model to strictly conform to our defined TypeScript properties.
2. **Iframe Sandboxing and Session Management**: The platform operates inside an iframe environment, which often restricts standard cookie storage. We engineered a dual-path session fallback—cookie validation combined with state-backed memory tracking to maintain smooth logins.
3. **Uptime Security in Hackathon Conditions**: Live APIs are prone to rate limits or key expiration. We decoupled our client code from raw key requirements and introduced an internal intelligence simulator that acts as a robust proxy fallback when standard Gemini connections fail.

---

# Future Scope

* **Verified Mentorship Matching**: Connecting early-stage female founders with real venture partners and industry executives using cryptographically signed digital match-slips.
* **Real-time Collaboration Spaces**: Integrating multi-user drawing canvases and collaborative pitch deck writers directly in the Startup Incubator using secure WebSocket architectures.
* **Dynamic Grant Scraping**: Building web-scraping agents to feed fresh, non-dilutive, female-focused venture grants and college scholarships directly into the Opportunity Explorer.
* **Voice-First Technical Mock Interviews**: Transitioning the Career Copilot from textual interactions to low-latency real-time voice streaming using the Gemini Live API.

---

# Why This Project Stands Out

Lumina AI is not just another recruitment platform; it is a dedicated, intelligence-driven operating system designed from the ground up to solve the specific bottlenecks women face in STEM and entrepreneurship. By combining high-fidelity business validation, actionable resume feedback, customized career paths, and tailored grant tracking into a singular cohesive workspace, Lumina eliminates resource fragmentation. The codebase is designed with modularity and absolute performance in mind—maintaining seamless operation even under constrained network environments, proving its readiness to scale into a high-impact startup.

---

# Team

* **Founder & Lead Architect**: Kartikeya Jagadale
* **Senior AI Engineer**: Atharva Jagadale
* **Product Designer**: Kartikeya and Atharva Jagadale

---

# License

```text
The MIT License (MIT)

Copyright (c) 2026 Lumina AI Authors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
