import React, { useState } from 'react';
import './RecipeFinder.scss';
import { BackButton } from '../../shared/back-button/BackButton';

interface Recipe {
  id: number;
  title: string;
  cuisine: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cookTime: number;
  servings: number;
  ingredients: string[];
  instructions: string[];
  image: string;
  tags: string[];
  rating: number;
}

const RecipeFinder: React.FC = () => {
  const [recipes] = useState<Recipe[]>([
    {
      id: 1,
      title: "Spaghetti Carbonara",
      cuisine: "Italian",
      difficulty: "Medium",
      cookTime: 20,
      servings: 4,
      ingredients: ["400g spaghetti", "200g pancetta", "4 eggs", "100g parmesan", "Black pepper", "Salt"],
      instructions: ["Boil pasta", "Cook pancetta", "Mix eggs and cheese", "Combine all ingredients", "Serve hot"],
      image: "🍝",
      tags: ["pasta", "quick", "comfort"],
      rating: 4.8
    },
    {
      id: 2,
      title: "Chicken Tikka Masala",
      cuisine: "Indian",
      difficulty: "Hard",
      cookTime: 45,
      servings: 6,
      ingredients: ["500g chicken", "Yogurt", "Tomatoes", "Cream", "Spices", "Onions", "Garlic", "Ginger"],
      instructions: ["Marinate chicken", "Grill chicken", "Make sauce", "Combine and simmer", "Garnish and serve"],
      image: "🍛",
      tags: ["spicy", "curry", "protein"],
      rating: 4.9
    },
    {
      id: 3,
      title: "Caesar Salad",
      cuisine: "American",
      difficulty: "Easy",
      cookTime: 15,
      servings: 2,
      ingredients: ["Romaine lettuce", "Croutons", "Parmesan", "Caesar dressing", "Anchovies", "Lemon"],
      instructions: ["Wash lettuce", "Make dressing", "Toss ingredients", "Add croutons", "Serve fresh"],
      image: "🥗",
      tags: ["healthy", "fresh", "vegetarian"],
      rating: 4.5
    },
    {
      id: 4,
      title: "Beef Tacos",
      cuisine: "Mexican",
      difficulty: "Easy",
      cookTime: 25,
      servings: 4,
      ingredients: ["Ground beef", "Taco shells", "Lettuce", "Tomatoes", "Cheese", "Sour cream", "Salsa"],
      instructions: ["Cook beef", "Warm shells", "Prepare toppings", "Assemble tacos", "Serve immediately"],
      image: "🌮",
      tags: ["mexican", "quick", "family"],
      rating: 4.6
    },
    {
      id: 5,
      title: "Chocolate Cake",
      cuisine: "International",
      difficulty: "Medium",
      cookTime: 60,
      servings: 8,
      ingredients: ["Flour", "Cocoa powder", "Sugar", "Eggs", "Butter", "Milk", "Baking powder"],
      instructions: ["Mix dry ingredients", "Cream butter and sugar", "Add eggs", "Combine mixtures", "Bake and cool"],
      image: "🍰",
      tags: ["dessert", "chocolate", "celebration"],
      rating: 4.7
    },
    {
      id: 6,
      title: "Sushi Rolls",
      cuisine: "Japanese",
      difficulty: "Hard",
      cookTime: 40,
      servings: 4,
      ingredients: ["Sushi rice", "Nori", "Fresh fish", "Cucumber", "Avocado", "Wasabi", "Soy sauce"],
      instructions: ["Prepare rice", "Cut ingredients", "Roll sushi", "Slice carefully", "Serve with condiments"],
      image: "🍣",
      tags: ["healthy", "fresh", "seafood"],
      rating: 4.9
    }
  ]);

  const [filteredRecipes, setFilteredRecipes] = useState(recipes);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [maxCookTime, setMaxCookTime] = useState(120);

  const cuisines = ['all', ...Array.from(new Set(recipes.map(r => r.cuisine)))];
  const difficulties = ['all', 'Easy', 'Medium', 'Hard'];

  React.useEffect(() => {
    let filtered = recipes.filter(recipe => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCuisine = cuisineFilter === 'all' || recipe.cuisine === cuisineFilter;
      const matchesDifficulty = difficultyFilter === 'all' || recipe.difficulty === difficultyFilter;
      const matchesTime = recipe.cookTime <= maxCookTime;
      
      return matchesSearch && matchesCuisine && matchesDifficulty && matchesTime;
    });
    
    setFilteredRecipes(filtered);
  }, [searchTerm, cuisineFilter, difficultyFilter, maxCookTime, recipes]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#2ed573';
      case 'Medium': return '#ffa502';
      case 'Hard': return '#ff4757';
      default: return '#747d8c';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < Math.floor(rating) ? 'filled' : ''}`}>
        ⭐
      </span>
    ));
  };

  return (
    <div className="recipe-finder">
      <BackButton />
      <div className="finder-container">
        <div className="header">
          <h1 className="title">👨‍🍳 Recipe Finder</h1>
          <p className="subtitle">Discover delicious recipes from around the world</p>
        </div>

        <div className="search-filters">
          <div className="search-section">
            <div className="search-box">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search recipes or ingredients..."
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>

          <div className="filters-grid">
            <div className="filter-group">
              <label>Cuisine</label>
              <select
                value={cuisineFilter}
                onChange={(e) => setCuisineFilter(e.target.value)}
                className="filter-select"
              >
                {cuisines.map(cuisine => (
                  <option key={cuisine} value={cuisine}>
                    {cuisine === 'all' ? 'All Cuisines' : cuisine}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Difficulty</label>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="filter-select"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty === 'all' ? 'All Levels' : difficulty}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Max Cook Time: {maxCookTime} min</label>
              <input
                type="range"
                min="10"
                max="120"
                value={maxCookTime}
                onChange={(e) => setMaxCookTime(parseInt(e.target.value))}
                className="time-slider"
              />
            </div>
          </div>
        </div>

        <div className="results-section">
          <div className="results-header">
            <span className="results-count">
              {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} found
            </span>
          </div>

          <div className="recipes-grid">
            {filteredRecipes.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🍽️</div>
                <p>No recipes match your criteria. Try adjusting your filters!</p>
              </div>
            ) : (
              filteredRecipes.map(recipe => (
                <div 
                  key={recipe.id} 
                  className="recipe-card"
                  onClick={() => setSelectedRecipe(recipe)}
                >
                  <div className="recipe-image">
                    <span className="recipe-emoji">{recipe.image}</span>
                    <div className="recipe-overlay">
                      <div className="recipe-rating">
                        {renderStars(recipe.rating)}
                        <span className="rating-number">{recipe.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="recipe-content">
                    <h3 className="recipe-title">{recipe.title}</h3>
                    <p className="recipe-cuisine">{recipe.cuisine} Cuisine</p>
                    
                    <div className="recipe-meta">
                      <div className="meta-item">
                        <span className="meta-icon">⏱️</span>
                        <span>{recipe.cookTime} min</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon">👥</span>
                        <span>{recipe.servings} servings</span>
                      </div>
                      <div 
                        className="difficulty-badge"
                        style={{ backgroundColor: getDifficultyColor(recipe.difficulty) }}
                      >
                        {recipe.difficulty}
                      </div>
                    </div>

                    <div className="recipe-tags">
                      {recipe.tags.map(tag => (
                        <span key={tag} className="tag">#{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {selectedRecipe && (
        <div className="modal-overlay" onClick={() => setSelectedRecipe(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedRecipe(null)}>✕</button>
            
            <div className="modal-header">
              <div className="modal-image">
                <span className="modal-emoji">{selectedRecipe.image}</span>
              </div>
              <div className="modal-info">
                <h2 className="modal-title">{selectedRecipe.title}</h2>
                <p className="modal-cuisine">{selectedRecipe.cuisine} Cuisine</p>
                <div className="modal-rating">
                  {renderStars(selectedRecipe.rating)}
                  <span className="rating-text">{selectedRecipe.rating} out of 5</span>
                </div>
              </div>
            </div>

            <div className="modal-details">
              <div className="detail-row">
                <div className="detail-item">
                  <span className="detail-label">⏱️ Cook Time</span>
                  <span className="detail-value">{selectedRecipe.cookTime} minutes</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">👥 Servings</span>
                  <span className="detail-value">{selectedRecipe.servings} people</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">📊 Difficulty</span>
                  <span 
                    className="detail-value difficulty"
                    style={{ color: getDifficultyColor(selectedRecipe.difficulty) }}
                  >
                    {selectedRecipe.difficulty}
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-sections">
              <div className="ingredients-section">
                <h3>🛒 Ingredients</h3>
                <ul className="ingredients-list">
                  {selectedRecipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="ingredient-item">{ingredient}</li>
                  ))}
                </ul>
              </div>

              <div className="instructions-section">
                <h3>📝 Instructions</h3>
                <ol className="instructions-list">
                  {selectedRecipe.instructions.map((instruction, index) => (
                    <li key={index} className="instruction-item">{instruction}</li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="modal-tags">
              {selectedRecipe.tags.map(tag => (
                <span key={tag} className="modal-tag">#{tag}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeFinder;
