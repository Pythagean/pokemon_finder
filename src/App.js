
import React, { useEffect, useState } from 'react';
import './App.css';
import PokemonGrid from './components/PokemonGrid';
import { fetchAllPokemon } from './utils/api';

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Track which Pokémon are greyed out by their id
  const [greyed, setGreyed] = useState({});
  // Track sidebar collapsed state
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  // Track sorting state
  const [sortBy, setSortBy] = useState('id'); // 'id', 'height', or 'weight'
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'
  // Track active type filters (up to 2)
  const [activeTypes, setActiveTypes] = useState([]);
  const [activeHabitat, setActiveHabitat] = useState(null);
  const [activeColors, setActiveColors] = useState([]);
  const [activeEvolutionStage, setActiveEvolutionStage] = useState(null);

  // Gen 1 Pokémon types
  const types = [
    'Normal', 'Fire', 'Water', 'Electric', 'Grass', 
    'Ice', 'Fighting', 'Poison', 'Ground', 'Flying', 
    'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon'
  ];

  const habitats = [
    'Cave', 'Forest', 'Grassland', 'Mountain',
    'Rare', 'Rough-terrain', 'Sea', 'Urban', 'Waters-edge'
  ];

  const colors = [
    'Black', 'Blue', 'Brown', 'Gray', 'Green', 'Orange',
    'Pink', 'Purple', 'Red', 'White', 'Yellow'
  ];

  const evolutionStages = [1, 2, 3];

  // Custom color override mapping
  const customPokemonColors = {
    'bulbasaur': ['green'],
    'ivysaur': ['green'],
    'venusaur': ['green'],
    'charmander': ['orange'],
    'charmeleon': ['red'],
    'charizard': ['orange'],
    'squirtle': ['blue'],
    'wartortle': ['blue'],
    'blastoise': ['blue'],
    'caterpie': ['green'],
    'metapod': ['green'],
    'butterfree': ['white', 'purple'],
    'weedle': ['brown'],
    'kakuna': ['yellow'],
    'beedrill': ['yellow', 'black'],
    'pidgey': ['brown'],
    'pidgeotto': ['brown'],
    'pidgeot': ['brown'],
    'rattata': ['purple'],
    'raticate': ['brown'],
    'spearow': ['brown'],
    'fearow': ['brown'],
    'ekans': ['purple'],
    'arbok': ['purple'],
    'pikachu': ['yellow'],
    'raichu': ['orange'],
    'sandshrew': ['yellow'],
    'sandslash': ['yellow', 'brown'],
    'nidoran-f': ['blue'],
    'nidorina': ['blue'],
    'nidoqueen': ['blue'],
    'nidoran-m': ['purple'],
    'nidorino': ['purple'],
    'nidoking': ['purple'],
    'clefairy': ['pink'],
    'clefable': ['pink'],
    'vulpix': ['brown', 'orange'],
    'ninetales': ['yellow'],
    'jigglypuff': ['pink'],
    'wigglytuff': ['pink'],
    'zubat': ['blue', 'purple'],
    'golbat': ['purple'],
    'oddish': ['blue', 'green'],
    'gloom': ['blue', 'orange'],
    'vileplume': ['blue', 'red'],
    'paras': ['orange'],
    'parasect': ['orange', 'red'],
    'venonat': ['purple'],
    'venomoth': ['purple'],
    'diglett': ['brown'],
    'dugtrio': ['brown'],
    'meowth': ['yellow'],
    'persian': ['yellow'],
    'psyduck': ['yellow'],
    'golduck': ['blue'],
    'mankey': ['brown', 'white'],
    'primeape': ['brown', 'white'],
    'growlithe': ['orange', 'yellow'],
    'arcanine': ['orange', 'yellow'],
    'poliwag': ['blue', 'white'],
    'poliwhirl': ['blue', 'white'],
    'poliwrath': ['blue', 'white'],
    'abra': ['yellow'],
    'kadabra': ['yellow'],
    'alakazam': ['yellow'],
    'machop': ['gray'],
    'machoke': ['purple'],
    'machamp': ['gray'],
    'bellsprout': ['green', 'yellow'],
    'weepinbell': ['green', 'yellow'],
    'victreebel': ['green', 'yellow'],
    'tentacool': ['blue', 'red'],
    'tentacruel': ['blue', 'red'],
    'geodude': ['gray'],
    'graveler': ['gray'],
    'golem': ['gray'],
    'ponyta': ['orange', 'yellow'],
    'rapidash': ['orange', 'yellow'],
    'slowpoke': ['pink'],
    'slowbro': ['pink'],
    'magnemite': ['gray'],
    'magneton': ['gray'],
    'farfetchd': ['brown'],
    'doduo': ['brown'],
    'dodrio': ['brown'],
    'seel': ['white'],
    'dewgong': ['white'],
    'grimer': ['purple'],
    'muk': ['purple'],
    'shellder': ['black', 'purple'],
    'cloyster': ['purple'],
    'gastly': ['purple'],
    'haunter': ['purple'],
    'gengar': ['purple'],
    'onix': ['gray'],
    'drowzee': ['yellow', 'brown'],
    'hypno': ['yellow'],
    'krabby': ['orange', 'white'],
    'kingler': ['orange', 'white'],
    'voltorb': ['red', 'white'],
    'electrode': ['red', 'white'],
    'exeggcute': ['pink'],
    'exeggutor': ['brown', 'yellow'],
    'cubone': ['brown'],
    'marowak': ['brown'],
    'hitmonlee': ['brown'],
    'hitmonchan': ['brown'],
    'lickitung': ['pink'],
    'koffing': ['purple'],
    'weezing': ['purple'],
    'rhyhorn': ['gray'],
    'rhydon': ['gray'],
    'chansey': ['pink'],
    'tangela': ['blue'],
    'kangaskhan': ['brown'],
    'horsea': ['blue'],
    'seadra': ['blue'],
    'goldeen': ['red', 'white'],
    'seaking': ['red', 'white'],
    'staryu': ['brown', 'yellow'],
    'starmie': ['purple'],
    'mr-mime': ['pink', 'white'],
    'scyther': ['green'],
    'jynx': ['purple', 'red'],
    'electabuzz': ['yellow', 'black'],
    'magmar': ['red', 'yellow'],
    'pinsir': ['brown'],
    'tauros': ['brown'],
    'magikarp': ['orange', 'red'],
    'gyarados': ['blue'],
    'lapras': ['blue'],
    'ditto': ['purple'],
    'eevee': ['brown'],
    'vaporeon': ['blue'],
    'jolteon': ['yellow'],
    'flareon': ['orange'],
    'porygon': ['blue', 'pink'],
    'omanyte': ['blue', 'white'],
    'omastar': ['blue', 'white'],
    'kabuto': ['black', 'brown'],
    'kabutops': ['brown'],
    'aerodactyl': ['gray'],
    'snorlax': ['blue', 'white'],
    'articuno': ['blue'],
    'zapdos': ['yellow'],
    'moltres': ['yellow'],
    'dratini': ['blue'],
    'dragonair': ['blue'],
    'dragonite': ['orange'],
    'mewtwo': ['gray', 'purple'],
    'mew': ['pink']
  };

  // Helper function to get custom colors for a Pokemon
  const getPokemonColors = (pokemonName) => {
    const normalizedName = pokemonName.toLowerCase().replace(/[♀♂]/, '').replace(/'/g, '');
    return customPokemonColors[normalizedName] || [];
  };

  useEffect(() => {
    async function loadPokemon() {
      try {
        setLoading(true);
        const data = await fetchAllPokemon();
        setPokemonList(data);
      } catch (err) {
        setError('Failed to load Pokémon.');
      } finally {
        setLoading(false);
      }
    }
    loadPokemon();
  }, []);

  // Handler to toggle a single Pokémon's greyed state
  const handleCardClick = (id) => {
    setGreyed((prev) => ({ ...prev, [id]: !prev[id] }));
  };


  // Handler to grey out all Pokémon
  const handleDisableAll = () => {
    const allGreyed = {};
    pokemonList.forEach((p) => { allGreyed[p.id] = true; });
    setGreyed(allGreyed);
  };

  // Handler to enable all Pokémon (remove all greyed out)
  const handleEnableAll = () => {
    setGreyed({});
    setActiveTypes([]);
    setActiveHabitat(null);
    setActiveColors([]);
    setActiveEvolutionStage(null);
  };

  // Handler for habitat filter buttons
  const handleHabitatFilter = (habitat) => {
    if (habitat === activeHabitat) {
      setActiveHabitat(null);
      applyAllFilters(activeTypes, null, activeColors); // Apply remaining filters
    } else {
      setActiveHabitat(habitat);
      applyAllFilters(activeTypes, habitat, activeColors); // Apply all filters with new habitat
    }
  };

  // Handler for color filter buttons
  const handleColorFilter = (color) => {
    let newColors;
    if (activeColors.includes(color)) {
      // Remove color if already selected
      newColors = activeColors.filter(c => c !== color);
    } else {
      // Add color to selection
      newColors = [...activeColors, color];
    }
    setActiveColors(newColors);
    applyAllFilters(activeTypes, activeHabitat, newColors, activeEvolutionStage);
  };

  // Handler for evolution stage filter buttons
  const handleEvolutionStageFilter = (stage) => {
    if (stage === activeEvolutionStage) {
      setActiveEvolutionStage(null);
      applyAllFilters(activeTypes, activeHabitat, activeColors, null); // Apply remaining filters
    } else {
      setActiveEvolutionStage(stage);
      applyAllFilters(activeTypes, activeHabitat, activeColors, stage); // Apply all filters with new stage
    }
  };

  // Helper function to apply all active filters
  const handleSort = (type) => {
    if (sortBy === type) {
      // If clicking the same sort type, toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // If clicking a new sort type, set it with ascending direction
      setSortBy(type);
      setSortDirection('asc');
    }
  };

  const applyAllFilters = (newTypes = activeTypes, newHabitat = activeHabitat, newColors = activeColors, newEvolutionStage = activeEvolutionStage) => {
    const newGreyed = {};
    pokemonList.forEach((pokemon) => {
      // Check type filters - pokemon must match all selected types
      const passesTypeFilter = newTypes.length === 0 || newTypes.every(type =>
        pokemon.types.some(t => t.type.name.toLowerCase() === type.toLowerCase())
      );

      // Check habitat filter
      const passesHabitatFilter = !newHabitat || 
        pokemon.habitat.toLowerCase() === newHabitat.toLowerCase();

      // Check color filter using custom color mapping - pokemon must match ALL selected colors
      const pokemonCustomColors = getPokemonColors(pokemon.name);
      const passesColorFilter = newColors.length === 0 || 
        newColors.every(selectedColor => 
          pokemonCustomColors.some(color => color.toLowerCase() === selectedColor.toLowerCase())
        );

      // Check evolution stage filter
      const passesEvolutionFilter = !newEvolutionStage || 
        pokemon.evolutionStage === newEvolutionStage;

      // Grey out if it doesn't pass ALL active filters
      if (!(passesTypeFilter && passesHabitatFilter && passesColorFilter && passesEvolutionFilter)) {
        newGreyed[pokemon.id] = true;
      }
    });
    setGreyed(newGreyed);
  };

  // Handler for type filter buttons
  const handleTypeFilter = (type) => {
    setActiveTypes(prevTypes => {
      let newTypes;
      if (prevTypes.includes(type)) {
        // Remove the type if it's already selected
        newTypes = prevTypes.filter(t => t !== type);
      } else if (prevTypes.length < 2) {
        // Add the type if we haven't reached the limit
        newTypes = [...prevTypes, type];
      } else {
        // Replace the first type if we're at the limit
        newTypes = [prevTypes[1], type];
      }
      applyAllFilters(newTypes);
      return newTypes;
    });
  };

  return (
    <div className={`pokemon-app ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <button 
        className="sidebar-toggle"
        onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
        aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isSidebarCollapsed ? '►' : '◄'}
      </button>
      <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="control-section">
          <div className="control-group">
            <h3>Sort by</h3>
            <div className="sort-buttons">
              <button 
                className={`sort-btn ${sortBy === 'id' ? 'active' : ''}`}
                onClick={() => handleSort('id')}
                disabled={loading || error}
              >
                {`Pokédex # ${sortBy === 'id' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}`}
              </button>
              <button 
                className={`sort-btn ${sortBy === 'height' ? 'active' : ''}`}
                onClick={() => handleSort('height')}
                disabled={loading || error}
              >
                Height {sortBy === 'height' && (sortDirection === 'asc' ? '↑' : '↓')}
              </button>
              <button 
                className={`sort-btn ${sortBy === 'weight' ? 'active' : ''}`}
                onClick={() => handleSort('weight')}
                disabled={loading || error}
              >
                Weight {sortBy === 'weight' && (sortDirection === 'asc' ? '↑' : '↓')}
              </button>
            </div>
          </div>

          <div className="control-buttons">
            <button className="disable-all-btn" onClick={handleDisableAll} disabled={loading || error}>
              Hide All
            </button>
            <button className="enable-all-btn" onClick={handleEnableAll} disabled={loading || error}>
              Show All
            </button>
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <h3>Filter by Type</h3>
            <div className="type-filters">
              {types.map(type => {
                const isThisActive = activeTypes.includes(type);
                const shouldBeInactive = activeTypes.length > 0 && !isThisActive;
                return (
                  <button
                    key={type}
                    className={`type-btn type-${type.toLowerCase()} ${isThisActive ? 'active' : ''} ${shouldBeInactive ? 'inactive' : ''}`}
                    onClick={() => handleTypeFilter(type)}
                    disabled={loading || error}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="filter-group">
            <h3>Filter by Habitat</h3>
            <div className="habitat-filters">
              {habitats.map(habitat => {
                const isThisActive = activeHabitat === habitat;
                const shouldBeInactive = activeHabitat && !isThisActive;
                return (
                  <button
                    key={habitat}
                    className={`habitat-btn habitat-${habitat.toLowerCase()} ${isThisActive ? 'active' : ''} ${shouldBeInactive ? 'inactive' : ''}`}
                    onClick={() => handleHabitatFilter(habitat)}
                    disabled={loading || error}
                  >
                    {habitat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="filter-group">
            <h3>Filter by Color</h3>
            <div className="color-filters">
              {colors.map(color => {
                const isThisActive = activeColors.includes(color);
                return (
                  <button
                    key={color}
                    className={`color-btn color-${color.toLowerCase()} ${isThisActive ? 'active' : ''}`}
                    onClick={() => handleColorFilter(color)}
                    disabled={loading || error}
                  >
                    {color}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="filter-group">
            <h3>Filter by Evolution Stage</h3>
            <div className="evolution-filters">
              {evolutionStages.map(stage => {
                const isThisActive = activeEvolutionStage === stage;
                const shouldBeInactive = activeEvolutionStage && !isThisActive;
                return (
                  <button
                    key={stage}
                    className={`evolution-btn evolution-${stage} ${isThisActive ? 'active' : ''} ${shouldBeInactive ? 'inactive' : ''}`}
                    onClick={() => handleEvolutionStageFilter(stage)}
                    disabled={loading || error}
                  >
                    Stage {stage}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </aside>
      <main className="main-content">
        {loading && <div className="pokemon-loading">Loading Pokémon...</div>}
        {error && <div className="pokemon-error">{error}</div>}
        {!loading && !error && (
          <PokemonGrid
            pokemonList={[...pokemonList].sort((a, b) => {
              if (!sortBy) return 0;
              let aValue, bValue;
              switch(sortBy) {
                case 'id':
                  aValue = a.id;
                  bValue = b.id;
                  break;
                case 'height':
                  aValue = a.height;
                  bValue = b.height;
                  break;
                case 'weight':
                  aValue = a.weight;
                  bValue = b.weight;
                  break;
                default:
                  return 0;
              }
              return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
            })}
            greyed={greyed}
            onCardClick={handleCardClick}
          />
        )}
      </main>
    </div>
  );
}

export default App;
