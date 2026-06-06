# CinePrompt: Technical Cinema Director & Prompt Arena 🎬

An elite, high-fidelity interactive training ground and blueprint generator for cinematic visual prompting. Built with a unified high-contrast industrial visual language (**Chamber Dark**, **Neon Ochre `#F27D26`**, and **Slate Monospacings**), CinePrompt transforms descriptive descriptions into exact Hollywood director configurations.

---

## ⚡ Progressive Learning Path

To extract maximum knowledge from CinePrompt, follow this progressive four-stage masterclass:

### Stage 1: Master the Visual Vocabulary 📸
*   **Where**: `Chamber Glossary`
*   **Action**: Browse visual optics categorized by Lens, Angles, Framing, Lighting, Movement, and Color Grading.
*   **Learning Vector**: Toggle between the **📸 Real-World Frame** (high-contrast authentic photography showing real light behaviors) and the **🧪 Axis Simulator** (interactive mathematical SVG renderers where adjusting parameters like focal length, aperture focus fields, or lights alters the diagram in real time).

### Stage 2: Compose with Structural Formulas 🏗️
*   **Where**: `Modular Blueprint Builder`
*   **Action**: Select attributes directly from the glossary and append them to your camera recipe.
*   **Learning Vector**: See how professional directors stack instructions. Learn the exact sequence: *[Subject/Action] + [Lens Profile] + [Angle Profile] + [Framing Boundary] + [Lighting Chiaroscuro] + [Steadicam Motion] + [Film Emulation Embellishment]*.

### Stage 3: Supercharge Raw Thoughts 🚀
*   **Where**: `Optic Prompt Optimizer`
*   **Action**: Type a simple, raw visual sentence (e.g., *"a fast car on a rainy night"*) and click **AI OPTIMIZE**.
*   **Learning Vector**: Study the output. Review the **Optimized Prompt** and watch the **Critique Matrix** to understand what technical descriptors were missing, why they were missing, and how adding precise details like "anamorphic blue lens flares" or "Rembrandt lighting catchlights" builds photorealism.

### Stage 4: Battle in the Chamber Arena 🏆
*   **Where**: `Technical Arena`
*   **Action**: Click **Chamber Arena** and pick a challenge card (e.g., *Sartorial Neo-Noir* or *Macro Biomechanics*). Draft an answer prompt attempting to meet the cinematic constraints, and submit it for evaluation.
*   **Learning Vector**: The **Dean of Photography** (powered by Gemini AI) scores your output from 0 to 100, checking for concept matches, identifying crucial omissions, giving an analytical director's critique, and providing the **Optimal Blueprint** to compare against.

---

## ☁️ Programmatic Export System ⚙️

Once you have mastered prompt-building inside the app, export your setups using the **AI Agent Skill Exporter**:
*   **Markdown Skill Block**: A bite-sized visual prompting reference sheet to feed directly into your dynamic system context.
*   **System Instructions**: A professional custom profile config to paste inside custom ChatGPT Agents, Claude Projects, or system instructions.
*   **JSON Schema**: Structured key-value properties to feed directly into program backends or image generator endpoints.

---

## 🔑 AI Integration & Local Migration

This application utilizes a robust, full-stack (**Express + React + Vite**) architecture. It communicates securely with the Gemini API server-side to prevent secrets from leaking into client-side browser inspect panels.

### Running Live Locally or on Antigravity/GitHub
If you clone this repository to your laptop, GitHub, or another hosting container, the application remains fully functional:

1.  **Duplicate Env Template**: In the root of your project, copy `.env.example` to a new file named `.env`:
    ```bash
    cp .env.example .env
    ```
2.  **Add Your Key**: Edit `.env` and paste your Google AI Studio Gemini API key:
    ```env
    GEMINI_API_KEY="AIzaSyYourActualSecureGeminiKeyHere"
    ```
3.  **Boot the System**:
    ```bash
    npm install
    npm run dev
    ```

### 🧠 Extreme Resilience (Offline/No-Key Fallback)
If you run the app locally without an API key:
*   The application **will not crash**.
*   It automatically enters an **Offline Sandbox Mode**.
*   The **Interactive Glossary**, **Axis Simulators**, **Formula Builder**, and **Spec Exporter** operate at 100% capacity client-side.
*   The **Optimizer** and **Arena** fall back to local structural algorithms, giving you standard structural mock grades and helpful camera outline recipes so you can continue learning seamlessly without external dependencies.

---

## 📈 Gemini API Free Tier Rate Limits (2026 Reference)

If you are using a standard Developer API Key under the **Free Tier** from Google AI Studio, your requests are subject to the following limits:

| Limit Category | Rate | Action on Over-Limit |
| :--- | :--- | :--- |
| **Requests Per Minute (RPM)** | **15 RPM** | Temporary `429 Rate Limit Exceeded` (Wait 60s and retry) |
| **Tokens Per Minute (TPM)** | **1 Million TPM** | Resets every minute |
| **Requests Per Day (RPD)** | **1,500 RPD** | Resets daily at UTC midnight |

### 🛠️ How to Handle/Lift Limits:
*   **In-App Resilience**: The backend handles rate limits, providing a clean alert if your quota is exhausted.
*   **Upgrade to Pay-As-You-Go**: To eliminate these caps and remove promotional headers, switch your Google AI Studio project to your billing plan. The Pay-As-You-Go Tier allows significantly higher throughput (up to 1,000+ RPM) with highly competitive token rates.
