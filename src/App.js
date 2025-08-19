
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
  // Track sorting state
  const [sortBy, setSortBy] = useState('id'); // 'id', 'height', or 'weight'
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'
  // Track active type filter
  const [activeType, setActiveType] = useState(null);
  const [activeHabitat, setActiveHabitat] = useState(null);
  const [activeColor, setActiveColor] = useState(null);
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
    'Black', 'Blue', 'Brown', 'Gray', 'Green',
    'Pink', 'Purple', 'Red', 'White', 'Yellow'
  ];

  const evolutionStages = [1, 2, 3];

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
    setActiveType(null);
    setActiveHabitat(null);
    setActiveColor(null);
    setActiveEvolutionStage(null);
  };

  // Handler for habitat filter buttons
  const handleHabitatFilter = (habitat) => {
    if (habitat === activeHabitat) {
      setActiveHabitat(null);
      applyAllFilters(activeType, null, activeColor); // Apply remaining filters
    } else {
      setActiveHabitat(habitat);
      applyAllFilters(activeType, habitat, activeColor); // Apply all filters with new habitat
    }
  };

  // Handler for color filter buttons
  const handleColorFilter = (color) => {
    if (color === activeColor) {
      setActiveColor(null);
      applyAllFilters(activeType, activeHabitat, null, activeEvolutionStage); // Apply remaining filters
    } else {
      setActiveColor(color);
      applyAllFilters(activeType, activeHabitat, color, activeEvolutionStage); // Apply all filters with new color
    }
  };

  // Handler for evolution stage filter buttons
  const handleEvolutionStageFilter = (stage) => {
    if (stage === activeEvolutionStage) {
      setActiveEvolutionStage(null);
      applyAllFilters(activeType, activeHabitat, activeColor, null); // Apply remaining filters
    } else {
      setActiveEvolutionStage(stage);
      applyAllFilters(activeType, activeHabitat, activeColor, stage); // Apply all filters with new stage
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

  const applyAllFilters = (newType = activeType, newHabitat = activeHabitat, newColor = activeColor, newEvolutionStage = activeEvolutionStage) => {
    const newGreyed = {};
    pokemonList.forEach((pokemon) => {
      // Check type filter
      const passesTypeFilter = !newType || pokemon.types.some(t => 
        t.type.name.toLowerCase() === newType.toLowerCase()
      );

      // Check habitat filter
      const passesHabitatFilter = !newHabitat || 
        pokemon.habitat.toLowerCase() === newHabitat.toLowerCase();

      // Check color filter
      const passesColorFilter = !newColor || 
        pokemon.color.toLowerCase() === newColor.toLowerCase();

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
    if (type === activeType) {
      setActiveType(null);
      applyAllFilters(null); // Apply remaining filters
    } else {
      setActiveType(type);
      applyAllFilters(type); // Apply all filters with new type
    }
  };

  return (
    <div className="pokemon-app">
      <aside className="sidebar">
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
              Disable All
            </button>
            <button className="enable-all-btn" onClick={handleEnableAll} disabled={loading || error}>
              Enable All
            </button>
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <h3>Filter by Type</h3>
            <div className="type-filters">
              {types.map(type => {
                const isThisActive = activeType === type;
                const shouldBeInactive = activeType && !isThisActive;
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
                const isThisActive = activeColor === color;
                const shouldBeInactive = activeColor && !isThisActive;
                return (
                  <button
                    key={color}
                    className={`color-btn color-${color.toLowerCase()} ${isThisActive ? 'active' : ''} ${shouldBeInactive ? 'inactive' : ''}`}
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
