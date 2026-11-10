# Satellite Dashboard

A dashboard for the Inholland student satellite project. It shows the health of the satellite (power, thermal, attitude control, communications, payload and orbit) in one clear overview for operators.

This project was made by students of Inholland University of Applied Sciences (Haarlem) as a client project during the minor App Development & Design. This repo is the dashboard only, not the satellite itself.

This is the frontend repo. The backend is in a separate repository.

## Status

Work in progress. The current focus is the operator dashboard. The dashboard uses mock data for now.

## Features

- Overview of the satellite health values
- Separate tabs: Overview, Thermal, Attitude control, Power, Communications, Payload, Orbit, Pass history
- Dark theme with status colours (critical, serious, caution, normal, standby, off)

## Tech stack

- React
- TypeScript
- Vite

## Getting started

You need [Node.js](https://nodejs.org/) installed.

```bash
# 1. Clone the repo
git clone https://github.com/DenisaaMinu/satellite-dashboard
cd satellite-dashboard

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Then open `http://localhost:5173` in your browser.

## Project structure

```
src/
  components/   Reusable UI parts (cards, status badges, tabs)
  features/     One folder per dashboard tab
  data/         Mock telemetry data
  types/        TypeScript types
  styles/       Design tokens and global styles
```

## Design

The design (wireframes, personas and style guide) is in Figma:
[Satellite Project on Figma](https://www.figma.com/design/mT9FIU7C0CFdeSvyL02kGL/Satellite-Project)

Colours, fonts and spacing live in `src/styles/tokens.css`. If you change a design rule, change it in the style guide, the wireframes and the code.

## Team

- Denisa, frontend developer
- Petros, frontend developer

## Branches and commits

- Do not work directly on `main`.
- Use branches like `feature/overview-tab`.
- Open a pull request so a teammate can review it.

## License

Educational project, not licensed for reuse.