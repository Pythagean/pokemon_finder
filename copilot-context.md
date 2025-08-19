# Copilot Project Context: Pokémon Grid (React + Tailwind)

## Goal
Build a React web app that displays the original 151 Pokémon in a grid layout.  
Data should be fetched dynamically from the **PokéAPI** and restricted to Pokémon with IDs 1–151.  

## Requirements
- **Framework**: React (functional components, hooks preferred).  
- **Styling**: Tailwind CSS (clean, responsive, minimal).  
- **Data Source**: Fetch from [PokéAPI](https://pokeapi.co/) → `https://pokeapi.co/api/v2/pokemon/{id}`.  
- **Grid Display**:  
  - Show all 151 Pokémon in a responsive grid.  
  - Each card should show the **sprite** and **name**.  
  - Names should be capitalized (e.g., "Bulbasaur" not "bulbasaur").  
- **Default State**: All Pokémon are **enabled** (full color).  
- **Filtering Behavior**:  
  - Filters will be added later.  
  - Non-matching Pokémon should **grey out** (e.g., reduced opacity), not disappear.  
- **Performance**: Fetch efficiently (consider batching or caching requests).  
- **Structure**:  
  - `App.js` → main container.  
  - `components/PokemonGrid.js` → renders grid.  
  - `components/PokemonCard.js` → individual Pokémon card.  
  - `utils/api.js` → fetch helpers for PokéAPI.  

## Future Enhancements (not required now, but keep in mind)
- Filtering by type (Fire, Water, etc).  
- Search by name.  
- Caught/not caught toggle.  
- Light/dark mode styling.  

## Coding Style Preferences
- Use **React hooks** (e.g., `useState`, `useEffect`).  
- Favor **functional components** over class components.  
- Keep code modular (small, reusable components).  
- Clean, minimal Tailwind styling.  
- Comments where logic is non-trivial.  

---
**Reminder to Copilot:** Focus on building a clean, functional grid first. Don’t overcomplicate. Filters and extra features will come later.
