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
- The safe cell shows a green check mark when opened.
- After clearing a level, press **NEXT LEVEL** to advance.
- The **RESET** button appears only after a game over to restart the current level.
- Level 5 is labeled as the final stage.
- After clearing the final stage, press **Play Again!!** to restart from level 1.
- Add `?test=true` to the URL for a mode where the first opened cell is always safe.
