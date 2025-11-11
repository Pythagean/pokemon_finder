
import React, { useEffect, useState, useRef } from 'react';
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
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);
  // Control toggle visibility separately so we can animate them in sync with the sidebar
  const [collapsedToggleVisible, setCollapsedToggleVisible] = useState(isSidebarCollapsed);
  const [expandedToggleVisible, setExpandedToggleVisible] = useState(!isSidebarCollapsed);
  const toggleTimeoutRef = useRef({ hide: null, show: null });
  // Sorting removed (UI disabled)
  // Track active type filters (up to 2)
  const [activeTypes, setActiveTypes] = useState([]);
  const [excludedTypes, setExcludedTypes] = useState([]);
  const [activeHabitat, setActiveHabitat] = useState(null);
  const [activeColors, setActiveColors] = useState([]);
  const [excludedHabitats, setExcludedHabitats] = useState([]);
  const [excludedColors, setExcludedColors] = useState([]);
  const [activeEvolutionStage, setActiveEvolutionStage] = useState(null);
    const [activeHeightRange, setActiveHeightRange] = useState([]);
    const [activeWeightRange, setActiveWeightRange] = useState([]);

  // Gen 1 Pokémon types
  const types = [
    'Normal', 'Fire', 'Water', 'Electric', 'Grass', 
    'Ice', 'Fighting', 'Poison', 'Ground', 'Flying', 
    'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'None'
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

  // Height ranges are based on PokéAPI height (decimeters)
  const heightRanges = [
    { key: 'under50cm', label: 'Tiny (<50 cm)' },
    { key: '50-100cm', label: 'Small (50 cm – 1 m)' },
  { key: '1-1_5m', label: 'Average (1 m – 1.5 m)' },
  { key: '1_5-2m', label: 'Big (1.5 m – 2 m)' },
    { key: 'over2m', label: 'Huge (>2 m)' }
  ];

    // Weight ranges in 25kg increments with a single 'over100kg' bucket
    // (PokéAPI weight is in hectograms: 1 kg = 10 units)
    const weightRanges = [
      { key: '0-25kg', label: '0–25 kg' },
      { key: '25-50kg', label: '25–50 kg' },
      { key: '50-75kg', label: '50–75 kg' },
      { key: '75-100kg', label: '75–100 kg' },
      { key: 'over100kg', label: 'Over 100 kg' }
    ];

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
        // show a more helpful message for debugging
        setError(`Failed to load Pokémon: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
    loadPokemon();
  }, []);

  // Cleanup any pending timeouts on unmount
  useEffect(() => {
    const toClear = { ...toggleTimeoutRef.current };
    return () => {
      if (toClear.hide) clearTimeout(toClear.hide);
      if (toClear.show) clearTimeout(toClear.show);
    };
  }, []);

  const SIDEBAR_TRANSITION_MS = 300; // should match CSS

  const expandSidebar = () => {
    // Start opening sidebar immediately
    setSidebarCollapsed(false);
    // Hide collapsed toggle quickly so it begins to fade while sidebar opens
    if (toggleTimeoutRef.current.hide) clearTimeout(toggleTimeoutRef.current.hide);
    toggleTimeoutRef.current.hide = setTimeout(() => setCollapsedToggleVisible(false), 40);
    // Show expanded toggle after sidebar finished its opening transition
    if (toggleTimeoutRef.current.show) clearTimeout(toggleTimeoutRef.current.show);
    toggleTimeoutRef.current.show = setTimeout(() => setExpandedToggleVisible(true), SIDEBAR_TRANSITION_MS);
  };

  const collapseSidebar = () => {
    // Start collapsing sidebar immediately
    setSidebarCollapsed(true);
    // Hide expanded toggle quickly so it begins to fade while sidebar closes
    if (toggleTimeoutRef.current.hide) clearTimeout(toggleTimeoutRef.current.hide);
    toggleTimeoutRef.current.hide = setTimeout(() => setExpandedToggleVisible(false), 40);
    // Show collapsed toggle after sidebar finished its closing transition
    if (toggleTimeoutRef.current.show) clearTimeout(toggleTimeoutRef.current.show);
    toggleTimeoutRef.current.show = setTimeout(() => setCollapsedToggleVisible(true), SIDEBAR_TRANSITION_MS);
  };

  const retryLoad = () => {
    setError(null);
    setLoading(true);
    fetchAllPokemon().then(data => {
      setPokemonList(data);
      setLoading(false);
    }).catch(err => {
      setError(`Failed to load Pokémon: ${err.message}`);
      setLoading(false);
    });
  };

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
  setActiveHeightRange([]);
  setExcludedTypes([]);
  setExcludedHabitats([]);
  setExcludedColors([]);
  setActiveWeightRange([]);
  };

  // Handler for habitat filter buttons
  const handleHabitatFilter = (habitat, e) => {
    const isCtrl = e && (e.ctrlKey || e.metaKey);
    if (isCtrl) {
      // Toggle exclusion of habitat
      const isExcluding = !excludedHabitats.includes(habitat);
      const newExcluded = isExcluding
        ? [...excludedHabitats, habitat]
        : excludedHabitats.filter(h => h !== habitat);
      // If we just excluded the currently active habitat, clear it
      const shouldClearActive = isExcluding && activeHabitat === habitat;
      if (shouldClearActive) setActiveHabitat(null);
      setExcludedHabitats(newExcluded);
      // Always use the new exclusion list and correct active habitat in applyAllFilters
      applyAllFilters(
        activeTypes,
        shouldClearActive ? null : activeHabitat,
        activeColors,
        activeEvolutionStage,
        activeHeightRange,
        activeWeightRange,
        excludedTypes,
        newExcluded,
        excludedColors
      );
      return;
    }

    // Normal toggle behavior (single-select)
    if (habitat === activeHabitat) {
      setActiveHabitat(null);
      applyAllFilters(activeTypes, null, activeColors); // Apply remaining filters
    } else {
      setActiveHabitat(habitat);
      // Ensure it's not accidentally in excluded list
      const newExcluded = excludedHabitats.filter(h => h !== habitat);
      if (newExcluded.length !== excludedHabitats.length) setExcludedHabitats(newExcluded);
      applyAllFilters(activeTypes, habitat, activeColors); // Apply all filters with new habitat
    }
  };

  // Handler for color filter buttons
  const handleColorFilter = (color, e) => {
    const isCtrl = e && (e.ctrlKey || e.metaKey);
    if (isCtrl) {
      // Toggle exclusion for color
      const newExcluded = excludedColors.includes(color) ? excludedColors.filter(c => c !== color) : [...excludedColors, color];
      // If excluded, ensure it's not in activeColors
      const newActiveColors = activeColors.filter(c => c !== color);
      setExcludedColors(newExcluded);
      setActiveColors(newActiveColors);
      applyAllFilters(activeTypes, activeHabitat, newActiveColors, activeEvolutionStage, activeHeightRange, activeWeightRange, excludedTypes, excludedHabitats, newExcluded);
      return;
    }

    let newColors;
    if (activeColors.includes(color)) {
      // Remove color if already selected
      newColors = activeColors.filter(c => c !== color);
    } else {
      // Add color to selection
      newColors = [...activeColors, color];
    }
    setActiveColors(newColors);
    // Ensure it's not in excluded colors
    const newExcluded = excludedColors.filter(c => c !== color);
    if (newExcluded.length !== excludedColors.length) setExcludedColors(newExcluded);
    applyAllFilters(activeTypes, activeHabitat, newColors, activeEvolutionStage);
  };

  // Handler for evolution stage filter buttons
  const handleEvolutionStageFilter = (stage) => {
    if (stage === activeEvolutionStage) {
      setActiveEvolutionStage(null);
      applyAllFilters(activeTypes, activeHabitat, activeColors, null, activeHeightRange); // Apply remaining filters
    } else {
      setActiveEvolutionStage(stage);
      applyAllFilters(activeTypes, activeHabitat, activeColors, stage, activeHeightRange); // Apply all filters with new stage
    }
  };

  // Handler for height range filter buttons (multi-select)
  const handleHeightFilter = (rangeKey) => {
    setActiveHeightRange(prev => {
      let next;
      if (prev.includes(rangeKey)) {
        next = prev.filter(k => k !== rangeKey);
      } else {
        next = [...prev, rangeKey];
      }
      applyAllFilters(activeTypes, activeHabitat, activeColors, activeEvolutionStage, next);
      return next;
    });
  };

  // Handler for weight range filter buttons (multi-select)
  const handleWeightFilter = (rangeKey) => {
    setActiveWeightRange(prev => {
      let next;
      if (prev.includes(rangeKey)) {
        next = prev.filter(k => k !== rangeKey);
      } else {
        next = [...prev, rangeKey];
      }
      applyAllFilters(activeTypes, activeHabitat, activeColors, activeEvolutionStage, activeHeightRange, next);
      return next;
    });
  };

  // Helper function to apply all active filters
  const applyAllFilters = (
  newTypes = activeTypes,
  newHabitat = activeHabitat,
  newColors = activeColors,
  newEvolutionStage = activeEvolutionStage,
  newHeightRange = activeHeightRange,
  newWeightRange = activeWeightRange,
  newExcludedTypes = excludedTypes,
  newExcludedHabitats = excludedHabitats,
  newExcludedColors = excludedColors
) => {
  const newGreyed = {};
  console.log('applyAllFilters called with:', {
    newTypes,
    newExcludedTypes,
    newHabitat,
    newColors,
    newEvolutionStage,
    newHeightRange,
    newWeightRange
  });

  pokemonList.forEach((pokemon) => {
    const pokemonTypeNames = (pokemon.types || []).map(t => t.toLowerCase());
    const pokemonCustomColors = getPokemonColors(pokemon.name);
    const pokemonCustomColorsLower = pokemonCustomColors.map(c => c.toLowerCase());

    // --- TYPE FILTERS ---
    let passesTypeFilter = true;

    // Active types
    if (newTypes.length > 0) {
      const includesNone = newTypes.includes('None');
      const otherTypes = newTypes.filter(t => t !== 'None');

      // Pokémon must include all active non-"None" types
      passesTypeFilter = otherTypes.every(type =>
        pokemonTypeNames.includes(type.toLowerCase())
      );

      // If "None" is active → only single-type Pokémon
      if (includesNone) {
        passesTypeFilter = passesTypeFilter && pokemonTypeNames.length === 1;
      }
    }

    // Excluded types
    if (newExcludedTypes.length > 0) {
      const excludesNone = newExcludedTypes.includes('None');
      const otherExcluded = newExcludedTypes.filter(t => t !== 'None');

      // Exclude Pokémon that contain any excluded type
      if (otherExcluded.length > 0) {
        if (otherExcluded.some(type => pokemonTypeNames.includes(type.toLowerCase()))) {
          passesTypeFilter = false;
        }
      }

      // Exclude single-type Pokémon if "None" is excluded
      if (excludesNone && pokemonTypeNames.length === 1) {
        passesTypeFilter = false;
      }
    }

    // --- HABITAT FILTER ---
    const passesHabitatFilter = !newHabitat ||
      (pokemon.habitat || '').toLowerCase() === newHabitat.toLowerCase();

    // --- COLOR FILTER ---
    const passesColorFilter = newColors.length === 0 ||
      newColors.every(selectedColor =>
        pokemonCustomColorsLower.includes(selectedColor.toLowerCase())
      );

    // --- EXCLUDED FILTERS ---
    const passesExcludedHabitats = !Array.isArray(newExcludedHabitats) || newExcludedHabitats.length === 0 || !newExcludedHabitats.some(ex => (pokemon.habitat || '').toLowerCase() === ex.toLowerCase());
    const passesExcludedColors = !Array.isArray(newExcludedColors) || newExcludedColors.length === 0 || !newExcludedColors.some(ex => pokemonCustomColorsLower.includes(ex.toLowerCase()));

    // --- EVOLUTION STAGE FILTER ---
    const passesEvolutionFilter = !newEvolutionStage ||
      pokemon.evolutionStage === newEvolutionStage;

    // --- HEIGHT FILTER ---
    let passesHeightFilter = true;
    if (Array.isArray(newHeightRange) && newHeightRange.length > 0) {
      const h = Number(pokemon.height || 0);
      passesHeightFilter = newHeightRange.some(rangeKey => {
        switch (rangeKey) {
          case 'under50cm': return h <= 5;
          case '50-100cm': return h >= 5 && h <= 10;
          case '1-1_5m': return h >= 10 && h <= 15;
          case '1_5-2m': return h >= 15 && h <= 20;
          case 'over2m': return h >= 20;
          default: return false;
        }
      });
    }

    // --- WEIGHT FILTER ---
    let passesWeightFilter = true;
    if (Array.isArray(newWeightRange) && newWeightRange.length > 0) {
      const w = Number(pokemon.weight || 0);
      passesWeightFilter = newWeightRange.some(rangeKey => {
        switch (rangeKey) {
          case '0-25kg': return w >= 0 && w <= 250;
          case '25-50kg': return w >= 250 && w <= 500;
          case '50-75kg': return w >= 500 && w <= 750;
          case '75-100kg': return w >= 750 && w <= 1000;
          case 'over100kg': return w >= 1000;
          default: return false;
        }
      });
    }

    // --- FINAL GREY OUT ---
    if (!(passesTypeFilter && passesHabitatFilter && passesColorFilter &&
          passesExcludedHabitats && passesExcludedColors &&
          passesEvolutionFilter && passesHeightFilter && passesWeightFilter)) {
      newGreyed[pokemon.id] = true;
    }
  });

  setGreyed(newGreyed);
};


  // Handler for type filter buttons
  // Normal click: toggle inclusion (max 2). Ctrl/Cmd+click: toggle exclusion (show non-matching types).
  // Handler for type filter buttons
// Normal click: toggle inclusion (max 2). Ctrl/Cmd+click: toggle exclusion (show non-matching types).
const handleTypeFilter = (type, e) => {
  const isCtrl = e && (e.ctrlKey || e.metaKey);

  console.log('handleTypeFilter called:', { type, isCtrl, activeTypes, excludedTypes });

  if (isCtrl) {
    // --- Ctrl-click toggles exclusion ---
    const newExcluded = excludedTypes.includes(type)
      ? excludedTypes.filter(t => t !== type)
      : [...excludedTypes, type];

    // Ensure excluded types aren't active
    const newActive = activeTypes.filter(t => t !== type);

    console.log('  ctrl branch -> newActive, newExcluded:', { newActive, newExcluded });

    setExcludedTypes(newExcluded);
    setActiveTypes(newActive);

    // Apply using the new arrays
    applyAllFilters(
      newActive,
      activeHabitat,
      activeColors,
      activeEvolutionStage,
      activeHeightRange,
      activeWeightRange,
      newExcluded
    );
    return;
  }

  // --- Normal click toggles active ---
  let newActive;
  if (activeTypes.includes(type)) {
    newActive = activeTypes.filter(t => t !== type);
  } else {
    newActive = [...activeTypes, type];
  }

  // Ensure not excluded
  const newExcluded = excludedTypes.filter(t => t !== type);

  console.log('  normal click -> newActive, newExcluded:', { newActive, newExcluded });

  setActiveTypes(newActive);
  setExcludedTypes(newExcluded);

  applyAllFilters(
    newActive,
    activeHabitat,
    activeColors,
    activeEvolutionStage,
    activeHeightRange,
    activeWeightRange,
    newExcluded
  );
};


  return (
    <div className={`pokemon-app ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Collapsed and expanded toggles are both rendered so we can animate between them */}
      <button
        className={`sidebar-toggle collapsed-toggle ${collapsedToggleVisible ? 'visible' : 'hidden'}`}
        onClick={expandSidebar}
        aria-label="Show filters"
        title="Show filters"
      >
        <img
          src={process.env.PUBLIC_URL + '/filter.png'}
          alt="Filter"
          className="filter-icon-img"
          onLoad={(e) => {
            try {
              const fallback = e.target.parentNode.querySelector('.filter-icon');
              if (fallback) fallback.style.display = 'none';
              e.target.style.display = 'inline-block';
            } catch (err) {}
          }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <span className="filter-icon" aria-hidden="true"></span>
      </button>
      <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <button
          className={`sidebar-toggle expanded-toggle ${expandedToggleVisible ? 'visible' : 'hidden'}`}
          onClick={collapseSidebar}
          aria-label="Hide filters"
          title="Hide filters"
        >
          <img
            src={process.env.PUBLIC_URL + '/filter.png'}
            alt="Filter"
            className="filter-icon-img"
            onLoad={(e) => {
              try {
                const fallback = e.target.parentNode.querySelector('.filter-icon');
                if (fallback) fallback.style.display = 'none';
                e.target.style.display = 'inline-block';
              } catch (err) {}
            }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <span className="filter-icon" aria-hidden="true"></span>
        </button>
        <div className="control-section">
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
            <h3>Type</h3>
            <div className="type-filters">
              {types.map(type => {
                const isThisActive = activeTypes.includes(type);
                const isThisExcluded = excludedTypes.includes(type);
                const shouldBeInactive = activeTypes.length > 0 && !isThisActive && !isThisExcluded;
                return (
          <button
                    key={type}
                    className={`type-btn type-${type.toLowerCase()} ${isThisActive ? 'active' : ''} ${shouldBeInactive ? 'inactive' : ''} ${isThisExcluded ? 'excluded' : ''}`}
                    onClick={(e) => handleTypeFilter(type, e)}
                    disabled={loading || error}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="filter-group">
            <h3>Habitat</h3>
            <div className="habitat-filters">
              {habitats.map(habitat => {
        const isThisActive = activeHabitat === habitat;
        const isThisExcluded = excludedHabitats.includes(habitat);
        const shouldBeInactive = !!activeHabitat && !isThisActive && !isThisExcluded;
        return (
          <button
            key={habitat}
            className={`habitat-btn habitat-${habitat.toLowerCase()} ${isThisActive ? 'active' : ''} ${shouldBeInactive ? 'inactive' : ''} ${isThisExcluded ? 'excluded' : ''}`}
            onClick={(e) => handleHabitatFilter(habitat, e)}
            disabled={loading || error}
          >
            {habitat}
          </button>
        );
      })}
            </div>
          </div>

          <div className="filter-group">
            <h3>Color</h3>
            <div className="color-filters">
              {colors.map(color => {
        const isThisActive = activeColors.includes(color);
        const isThisExcluded = excludedColors.includes(color);
                return (
                  <button
                    key={color}
          className={`color-btn color-${color.toLowerCase()} ${isThisActive ? 'active' : ''} ${isThisExcluded ? 'excluded' : ''}`}
          onClick={(e) => handleColorFilter(color, e)}
                    disabled={loading || error}
                  >
                    {color}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="filter-group">
            <h3>Evolution Stage</h3>
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

          <div className="filter-group">
            <h3>Height</h3>
            <div className="height-filters">
              {heightRanges.map(range => {
                const isThisActive = Array.isArray(activeHeightRange) && activeHeightRange.includes(range.key);
                const shouldBeInactive = Array.isArray(activeHeightRange) && activeHeightRange.length > 0 && !isThisActive;
                return (
                  <button
                    key={range.key}
                    className={`height-btn height-${range.key} ${isThisActive ? 'active' : ''} ${shouldBeInactive ? 'inactive' : ''}`}
                    onClick={() => handleHeightFilter(range.key)}
                    disabled={loading || error}
                  >
                    {range.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="filter-group">
            <h3>Weight</h3>
            <div className="weight-filters">
              {weightRanges.map(range => {
                const isThisActive = Array.isArray(activeWeightRange) && activeWeightRange.includes(range.key);
                const shouldBeInactive = Array.isArray(activeWeightRange) && activeWeightRange.length > 0 && !isThisActive;
                return (
                  <button
                    key={range.key}
                    className={`height-btn weight-btn weight-${range.key} ${isThisActive ? 'active' : ''} ${shouldBeInactive ? 'inactive' : ''}`}
                    onClick={() => handleWeightFilter(range.key)}
                    disabled={loading || error}
                  >
                    {range.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </aside>
      <main className="main-content">
        {/* Mobile header shown only on narrow screens */}
        <div className="mobile-header" aria-hidden={false}>
          <h1>Pokemon Finder</h1>
        </div>
        {loading && <div className="pokemon-loading">Loading Pokémon...</div>}
        {error && (
          <div className="pokemon-error">
            {error}
            <div style={{ marginTop: 8 }}>
              <button onClick={retryLoad}>Retry</button>
            </div>
          </div>
        )}
        {!loading && !error && (
          <PokemonGrid
              pokemonList={pokemonList}
            greyed={greyed}
            onCardClick={handleCardClick}
          />
        )}
      </main>
    </div>
  );
}

export default App;
