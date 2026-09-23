# CinePrompt Studio

Learn photography and cinematography terms, see what each one does, and use them to write better prompts for Gemini, Midjourney, and Veo.

## What's inside

| Tab | What it's for |
| :-- | :-- |
| **Glossary** | 48 terms in 8 topics, ordered as a learning path (light → composition → shot size → angle → lenses → exposure → color → movement). Each term has an interactive diagram, links to real example photos, and ready-made prompt phrases. |
| **Formula Lab** | Build a prompt one decision at a time. The preview is colour-coded by choice, and warns you when choices contradict each other. Switch between Gemini (descriptive sentences), Midjourney (phrases + `--ar`), and Veo (movement first). |
| **A/B Lab** | Change one setting, keep everything else the same, and compare the two pictures. |
| **Supercharger** | Paste a rough idea; Gemini adds the missing photographic decisions and explains each change. |
| **Practice** | Plain-language briefs. Write the prompt, get a score out of 100 across five areas, and see which techniques the brief was describing. |
| **Export** | Download the glossary as a cheat sheet, AI assistant instructions, or JSON. |

## Setup

```bash
cp .env.example .env   # then paste your key into GEMINI_API_KEY
npm install
npm run dev            # http://127.0.0.1:3000
```

Get a free key at <https://aistudio.google.com/apikey>. Without a key, the glossary, diagrams, Formula Lab, and export still work; the AI features say a key is needed.

## Models and cost

- **Text features** (Supercharger, Practice grading, A/B image comparison) use `gemini-3.8-flash`, falling back to `gemini-3.7-flash` when it's busy. Both are on Gemini's **free tier**. Override with `TEXT_MODEL` / `FALLBACK_TEXT_MODEL`.
- **Image generation** uses `gemini-3.1-flash-lite-image` (override with `IMAGE_MODEL`). Google's image models have **no free tier**, so this only works once billing is enabled on your AI Studio project (about $0.03 per image). Set `IMAGE_GENERATION=off` to hide it.
- **Free route for images:** copy a prompt into the [Gemini app](https://gemini.google.com/app), save the picture, and upload it to the A/B Lab or Practice tab. Gemini 3.8 Flash (free) compares or grades it.

Check your usage and limits at <https://aistudio.google.com/rate-limit>. The app also caps itself at 12 text requests and 6 image requests per minute.

## Privacy

The server listens on `127.0.0.1` only, so other devices on your network can't use your API key. Set `HOST=0.0.0.0` to change that; Cloud Run deployments (AI Studio) do this automatically. Your drafts, formula, and scores are saved in your browser's local storage. Generated images are cached in `.cache/images/`.

## Scripts

- `npm run dev`: dev server with hot reload
- `npm run build` then `npm start`: production build
- `npm run lint`: type-check
