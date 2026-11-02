# Color Palette Generator

## Run

Install Node.js 22 or newer, open this folder in a terminal, and run:

```bash
npm install
npm run dev
```

Open the local URL printed in the terminal. An internet connection is required to fetch colors.

## Required pages

- `/`: Generate a five-color palette from a valid hex code and save it with a unique name.
- `/palette/:id`: View a saved palette and its lighter and darker shades.
- `/saved`: View saved palettes.

The React Context stores the API colors and saved palettes. Saved palettes remain available while navigating between pages. Refreshing or closing the page resets the Context state.

HEX validation: `^#([0-9A-Fa-f]{6})$`.
Palette names are trimmed, must contain 3–25 characters, and must be unique among saved names (case-insensitive).

API: https://www.thecolorapi.com/docs

## Build

```bash
npm run build
npm run preview
```

When deploying, configure the server to serve `index.html` for client-side routes.
