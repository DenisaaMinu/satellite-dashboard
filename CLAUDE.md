# Satellite Dashboard (frontend)

Frontend of the operator dashboard for the Inholland student satellite (CubeSat) project. The backend is a separate repo made by another team. This repo is the dashboard only.

## How we work
This file is shared by Denisa and Petros, the two frontend developers. "Me" in this file means whoever of us is talking to you. We are students and we want to learn, so:
- Explain your reasoning and give hints. Do not write full solutions unless I ask for them.
- When I show you my code, review it: say what is good, what to improve, and why.
- Ask before big changes or before adding a dependency.
- Keep explanations short and in simple language.

## Commands
- `npm run dev`: start the dev server
- `npm run build`: type-check (`tsc -b`) and build. Run this before saying a change is done.
- `npm run lint`: ESLint
- No test setup yet.

## Stack
- React + TypeScript + Vite 7 (use `vite@7` with `@vitejs/plugin-react@5`; Vite 8 is blocked by Smart App Control on Windows)
- ESLint
- CSS Modules (one `.module.css` per component), no Tailwind, no other styling library
- Mock data for now, no backend connection yet

## Project structure
```
src/
  components/   reusable parts, one folder per component (exists: StatusBadge, RangeBar, ValueRow; planned: Card)
  features/     one folder per dashboard tab
  data/         mock telemetry data
  types/        shared TypeScript types (Status, telemetry values)
  styles/       tokens.css (design tokens) and global.css
  assets/icons/ SVG icons exported from Figma
  api/          (planned) functions like getTelemetry() that return mock data now and call the real API later
```

Components and features must get data through the `api/` functions, never by importing from `data/` directly. `src/api/` does not exist yet: if a feature needs data before it exists, create the api function first (ask me if unsure what it should look like).

## Design rules
- Figma file: https://www.figma.com/design/mT9FIU7C0CFdeSvyL02kGL/Satellite-Project
  - "Final UI" page = what we build. "Style Guide" page = the rules. Check Figma before guessing.
- Dark theme. Every colour, font size and spacing value comes from `src/styles/tokens.css`. Never write hex codes or magic numbers in a component.
- Status colours (Astro UXDS): critical, serious, caution, normal, standby, off. Colour is only for problems. Normal, standby and off are grey. Never show status by colour alone: always add an icon or text.
- Square corners; only pills are rounded.
- Magenta is for the logo and the selected-tab bar only, never for text.
- Reuse existing components instead of making new ones. If a new reusable component is needed, tell me first so we do not both build the same thing.
- If a code change affects a design rule, remind me to update the style guide, the wireframes and the final design in Figma too. They must stay in sync with the code.
- Client-approved MoSCoW priorities must not change: every Must value has to appear in the dashboard.
- Do not invent requirements. If something is unclear, ask me.

## Team and split
- Frontend team: Denisa and Petros. The backend team works in a separate repo.
- Denisa: Overview, Thermal, Attitude control, Power tabs
- Petros: Communications, Payload, Orbit, Pass history tabs

## Git workflow
- Never work directly on `main`. One branch per task (e.g. `feature/value-row`), small commits, pull request, the other person reviews.
- Pull `main` before starting something new.

## Current milestone
First version for the teacher on 24 November 2026: the app shell with navigation and at least one finished tab per person (Overview first), using mock data.

## Do not build yet
- Authentication (the dashboard team will build it later for all teams)
- Connection to the real backend API
- Public display for visitors
