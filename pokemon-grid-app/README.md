# Pokémon Grid App

## Overview
This project is a React web application that displays the original 151 Pokémon in a responsive grid layout. The data is fetched dynamically from the PokéAPI and presented in a clean and minimal design using Tailwind CSS.

## Features
- Displays all 151 Pokémon with their sprites and names.
- Responsive grid layout that adapts to different screen sizes.
- Clean and minimal styling using Tailwind CSS.

## Project Structure
```
pokemon-grid-app
├── public
│   └── index.html          # Main HTML file
├── src
│   ├── App.js              # Main container component
│   ├── index.js            # Entry point for the React application
│   ├── components
│   │   ├── PokemonGrid.js  # Component to render the grid of Pokémon
│   │   └── PokemonCard.js   # Component to render individual Pokémon cards
│   └── utils
│       └── api.js          # Helper functions for fetching Pokémon data
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── package.json            # npm configuration
├── README.md               # Project documentation
└── .gitignore              # Files and directories to ignore by Git
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   cd pokemon-grid-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000` to view the application.

## Usage
The application will automatically fetch and display the original 151 Pokémon in a grid layout. Each Pokémon card will show the sprite and the name of the Pokémon.

## Future Enhancements
- Implement filtering by Pokémon type (e.g., Fire, Water).
- Add a search feature to find Pokémon by name.
- Include a toggle for caught/not caught Pokémon.
- Implement light/dark mode styling.

## License
This project is open-source and available under the MIT License.