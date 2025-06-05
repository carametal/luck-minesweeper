# Luck Minesweeper

A small React + TypeScript game based on the specification in `specification.md`.
Each level contains only one safe cell, while all others are bombs.

## Development

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

## Gameplay

- Left click a cell to open it. Right click to place or remove a flag.
- Open the single safe cell to clear the level. Opening a bomb ends the game.
- After clearing a level, press **NEXT LEVEL** to advance.
- A **RESET** button is always available to restart the current level.
