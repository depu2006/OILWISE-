import { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:4000';

export default function RecipesPage() {
  const [filters, setFilters] = useState({ cuisine: '', lowOil: true });
  const [recipes, setRecipes] = useState([]);

  const sampleRecipes = [
    // ===== MEDITERRANEAN =====
    {
      id: 1,
      title: "Mediterranean Grilled Chicken",
      cuisine: "Mediterranean",
      diet: "Low-carb",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=1200&auto=format&fit=crop",
      nutrition: { calories: 320, fat: 8, protein: 45, carbs: 12 },
      oilContent: "1 tsp olive oil",
      cookingTime: "25 minutes",
      difficulty: "Easy",
      steps: [
        "Marinate chicken breast with lemon juice, garlic, and herbs for 30 minutes",
        "Preheat grill to medium-high heat",
        "Grill chicken for 6-7 minutes per side",
        "Serve with grilled vegetables and quinoa"
      ],
      ingredients: [
        "4 chicken breasts",
        "2 tbsp lemon juice",
        "3 cloves garlic, minced",
        "1 tsp dried oregano",
        "1 tsp olive oil",
        "Salt and pepper to taste"
      ]
    },
    {
      id: 5,
      title: "Baked Salmon with Herbs",
      cuisine: "Mediterranean",
      diet: "Low-carb",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1200&auto=format&fit=crop",
      nutrition: { calories: 250, fat: 12, protein: 30, carbs: 5 },
      oilContent: "1 tsp olive oil",
      cookingTime: "25 minutes",
      difficulty: "Easy",
      steps: [
        "Preheat oven to 400°F",
        "Season salmon with herbs and lemon",
        "Bake for 15-18 minutes",
        "Serve with steamed broccoli"
      ],
      ingredients: [
        "4 salmon fillets",
        "2 tbsp fresh dill",
        "1 lemon, sliced",
        "1 tsp olive oil",
        "Salt and pepper"
      ]
    },
    {
      id: 10,
      title: "Mediterranean Chickpea Salad",
      cuisine: "Mediterranean",
      diet: "Vegan",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop",
      nutrition: { calories: 220, fat: 7, protein: 9, carbs: 30 },
      oilContent: "1 tsp olive oil",
      cookingTime: "15 minutes",
      difficulty: "Easy",
      steps: [
        "Rinse and drain chickpeas",
        "Chop cucumber, tomatoes, and onions",
        "Mix all vegetables with chickpeas",
        "Drizzle with olive oil and lemon juice",
        "Season with salt, pepper, and oregano"
      ],
      ingredients: [
        "1 cup chickpeas",
        "1 cucumber",
        "1 tomato",
        "Red onion",
        "1 tsp olive oil",
        "Lemon juice",
        "Oregano, salt, pepper"
      ]
    },
    {
      id: 11,
      title: "Mediterranean Stuffed Peppers",
      cuisine: "Mediterranean",
      diet: "Vegetarian",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?q=80&w=1200&auto=format&fit=crop",
      nutrition: { calories: 260, fat: 6, protein: 10, carbs: 42 },
      oilContent: "1 tsp olive oil",
      cookingTime: "35 minutes",
      difficulty: "Medium",
      steps: [
        "Preheat oven to 375°F",
        "Cook quinoa and let cool",
        "Mix quinoa with chopped veggies and herbs",
        "Stuff peppers and drizzle with olive oil",
        "Bake for 20–25 minutes"
      ],
      ingredients: [
        "4 bell peppers",
        "1 cup cooked quinoa",
        "Cherry tomatoes",
        "Olives",
        "1 tsp olive oil",
        "Parsley and oregano",
        "Salt and pepper"
      ]
    },

    // ===== ASIAN =====
    {
      id: 2,
      title: "Steamed Fish with Ginger",
      cuisine: "Asian",
      diet: "Low-fat",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1718522200359-96a72b8994b1?ixlib=rb-4.1.0&q=80&w=1200&auto=format&fit=crop",
      nutrition: { calories: 180, fat: 3, protein: 35, carbs: 8 },
      oilContent: "1/2 tsp sesame oil",
      cookingTime: "20 minutes",
      difficulty: "Easy",
      steps: [
        "Place fish fillets on a steaming rack",
        "Top with ginger slices and green onions",
        "Steam for 12-15 minutes until fish flakes easily",
        "Drizzle with light soy sauce and sesame oil"
      ],
      ingredients: [
        "4 white fish fillets",
        "2 inches fresh ginger, sliced",
        "4 green onions, chopped",
        "2 tbsp light soy sauce",
        "1/2 tsp sesame oil"
      ]
    },
    {
      id: 6,
      title: "Vegetable Stir-Fry",
      cuisine: "Asian",
      diet: "Vegetarian",
      rating: 4.4,
      image: "https://images.unsplash.com/photo-1549466327-f7cd635ff85a?ixlib=rb-4.1.0&q=80&w=1200&auto=format&fit=crop",
      nutrition: { calories: 120, fat: 4, protein: 8, carbs: 18 },
      oilContent: "1 tsp sesame oil",
      cookingTime: "15 minutes",
      difficulty: "Easy",
      steps: [
        "Heat wok with minimal oil",
        "Add vegetables in order of cooking time",
        "Stir-fry quickly over high heat",
        "Season with soy sauce and sesame oil"
      ],
      ingredients: [
        "2 cups mixed vegetables",
        "1 tsp sesame oil",
        "2 tbsp soy sauce",
        "1 clove garlic",
        "Ginger and green onions"
      ]
    },
    {
      id: 12,
      title: "Low-Oil Fried Rice",
      cuisine: "Asian",
      diet: "Vegetarian",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1200&auto=format&fit=crop",
      nutrition: { calories: 230, fat: 5, protein: 7, carbs: 40 },
      oilContent: "1 tsp sesame oil",
      cookingTime: "20 minutes",
      difficulty: "Easy",
      steps: [
        "Heat a pan with sesame oil",
        "Add garlic, onions and mixed veggies",
        "Add cooked rice and stir well",
        "Season with soy sauce and pepper"
      ],
      ingredients: [
        "2 cups cooked rice",
        "1 tsp sesame oil",
        "Mixed vegetables",
        "Garlic and onion",
        "Soy sauce",
        "Salt and pepper"
      ]
    },
    {
      id: 13,
      title: "Low-Oil Teriyaki Chicken",
      cuisine: "Asian",
      diet: "High-protein",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?q=80&w=1200&auto=format&fit=crop",
      nutrition: { calories: 290, fat: 7, protein: 32, carbs: 20 },
      oilContent: "1 tsp sesame oil",
      cookingTime: "25 minutes",
      difficulty: "Medium",
      steps: [
        "Marinate chicken in teriyaki sauce",
        "Heat pan with sesame oil",
        "Cook chicken until done",
        "Serve with steamed veggies or rice"
      ],
      ingredients: [
        "4 chicken thighs",
        "Teriyaki sauce",
        "1 tsp sesame oil",
        "Broccoli",
        "Carrots",
        "Salt and pepper"
      ]
    },

    // ===== AMERICAN =====
    {
      id: 3,
      title: "Air-Fried Sweet Potato Wedges",
      cuisine: "American",
      diet: "Vegetarian",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1730793666277-8f3247c58968?ixlib=rb-4.1.0&q=80&w=1200&auto=format&fit=crop",
      nutrition: { calories: 150, fat: 2, protein: 3, carbs: 35 },
      oilContent: "1 tsp olive oil",
      cookingTime: "30 minutes",
      difficulty: "Easy",
      steps: [
        "Cut sweet potatoes into wedges",
        "Toss with minimal olive oil and spices",
        "Air fry at 400°F for 20-25 minutes",
        "Serve hot with yogurt dip"
      ],
      ingredients: [
        "2 large sweet potatoes",
        "1 tsp olive oil",
        "1 tsp paprika",
        "1/2 tsp garlic powder",
        "Salt to taste"
      ]
    },
    {
      id: 14,
      title: "Low-Oil Grilled Chicken Salad",
      cuisine: "American",
      diet: "Low-carb",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop",
      nutrition: { calories: 260, fat: 7, protein: 30, carbs: 10 },
      oilContent: "1 tsp olive oil",
      cookingTime: "25 minutes",
      difficulty: "Easy",
      steps: [
        "Marinate chicken with herbs and grill",
        "Chop lettuce, cucumber, and tomatoes",
        "Slice grilled chicken and add to salad",
        "Drizzle with olive oil and lemon dressing"
      ],
      ingredients: [
        "Chicken breast",
        "Lettuce",
        "Cucumber",
        "Tomatoes",
        "1 tsp olive oil",
        "Lemon juice",
        "Salt, pepper"
      ]
    },
    {
      id: 15,
      title: "Low-Oil Veggie Omelette",
      cuisine: "American",
      diet: "High-protein",
      rating: 4.4,
      image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop",
      nutrition: { calories: 210, fat: 8, protein: 18, carbs: 7 },
      oilContent: "1/2 tsp olive oil",
      cookingTime: "15 minutes",
      difficulty: "Easy",
      steps: [
        "Whisk eggs with salt and pepper",
        "Heat pan with minimal olive oil",
        "Add chopped veggies and sauté lightly",
        "Pour egg mixture and cook until set"
      ],
      ingredients: [
        "2 eggs",
        "1/2 tsp olive oil",
        "Bell peppers",
        "Onions",
        "Spinach",
        "Salt, pepper"
      ]
    },
    {
      id: 16,
      title: "Low-Oil Turkey Lettuce Wraps",
      cuisine: "American",
      diet: "Low-carb",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?q=80&w=1200&auto=format&fit=crop",
      nutrition: { calories: 200, fat: 5, protein: 22, carbs: 10 },
      oilContent: "1 tsp olive oil",
      cookingTime: "20 minutes",
      difficulty: "Easy",
      steps: [
        "Heat olive oil in pan",
        "Cook minced turkey with spices",
        "Add chopped veggies and sauté",
        "Serve in fresh lettuce cups"
      ],
      ingredients: [
        "Minced turkey",
        "Lettuce leaves",
        "1 tsp olive oil",
        "Onions",
        "Bell peppers",
        "Salt, pepper, paprika"
      ]
    },

    // ===== HEALTHY =====
    {
      id: 4,
      title: "Quinoa Buddha Bowl",
      cuisine: "Healthy",
      diet: "Vegan",
      rating: 4.7,
      image: "https://plus.unsplash.com/premium_photo-1705074741504-cffb47ce8755?ixlib=rb-4.1.0&q=80&w=1200&auto=format&fit=crop",
      nutrition: { calories: 280, fat: 6, protein: 12, carbs: 45 },
      oilContent: "1 tsp avocado oil",
      cookingTime: "35 minutes",
      difficulty: "Medium",
      steps: [
        "Cook quinoa according to package instructions",
        "Roast vegetables with minimal oil",
        "Prepare tahini dressing",
        "Assemble bowl with quinoa, vegetables, and dressing"
      ],
      ingredients: [
        "1 cup quinoa",
        "1 cup mixed vegetables",
        "1 avocado",
        "2 tbsp tahini",
        "1 tsp avocado oil",
        "Lemon juice and herbs"
      ]
    },
    {
      id: 17,
      title: "Low-Oil Lentil Salad",
      cuisine: "Healthy",
      diet: "Vegan",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop",
      nutrition: { calories: 230, fat: 5, protein: 11, carbs: 35 },
      oilContent: "1 tsp olive oil",
      cookingTime: "25 minutes",
      difficulty: "Easy",
      steps: [
        "Boil lentils until tender",
        "Chop vegetables and herbs",
        "Mix lentils with veggies",
        "Drizzle olive oil and lemon dressing"
      ],
      ingredients: [
        "1 cup lentils",
        "Tomatoes",
        "Cucumber",
        "Onions",
        "1 tsp olive oil",
        "Lemon juice",
        "Salt, pepper"
      ]
    },
    {
      id: 18,
      title: "Low-Oil Veggie Soup",
      cuisine: "Healthy",
      diet: "Low-fat",
      rating: 4.6,
      image: "https://cdn.pixabay.com/photo/2021/06/09/01/34/vegetable-6322023_1280.jpg",
      nutrition: { calories: 120, fat: 3, protein: 5, carbs: 18 },
      oilContent: "1/2 tsp olive oil",
      cookingTime: "30 minutes",
      difficulty: "Easy",
      steps: [
        "Heat olive oil in a pot",
        "Add garlic and onions",
        "Add chopped vegetables and water",
        "Simmer until vegetables are tender",
        "Season and serve hot"
      ],
      ingredients: [
        "Carrots",
        "Beans",
        "Peas",
        "Onion",
        "Garlic",
        "1/2 tsp olive oil",
        "Salt, pepper"
      ]
    },
    {
      id: 19,
      title: "Low-Oil Tofu Salad Bowl",
      cuisine: "Healthy",
      diet: "Vegan",
      rating: 4.4,
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop",
      nutrition: { calories: 250, fat: 7, protein: 15, carbs: 30 },
      oilContent: "1 tsp olive oil",
      cookingTime: "20 minutes",
      difficulty: "Easy",
      steps: [
        "Lightly sauté tofu cubes in minimal oil",
        "Prepare salad base with greens and veggies",
        "Top salad with tofu",
        "Drizzle with light dressing"
      ],
      ingredients: [
        "Tofu",
        "Mixed salad greens",
        "Cucumber",
        "Cherry tomatoes",
        "1 tsp olive oil",
        "Lemon juice",
        "Salt, pepper"
      ]
    },

    // ===== INDIAN =====
    {
      id: 7,
      title: "Low-Oil Vegetable Dal",
      cuisine: "Indian",
      diet: "Vegan",
      rating: 4.7,
      image: "https://cdn.pixabay.com/photo/2025/10/21/07/54/ai-generated-9906990_1280.jpg",
      nutrition: { calories: 210, fat: 4, protein: 12, carbs: 30 },
      oilContent: "1 tsp oil",
      cookingTime: "30 minutes",
      difficulty: "Easy",
      steps: [
        "Wash and pressure cook dal with turmeric",
        "Heat pan with minimal oil",
        "Add cumin, garlic, and onions",
        "Mix cooked dal and simmer",
        "Garnish with coriander"
      ],
      ingredients: [
        "1 cup toor dal",
        "1 tsp oil",
        "Cumin seeds",
        "Garlic cloves",
        "Onion",
        "Turmeric and salt",
        "Fresh coriander"
      ]
    },
    {
      id: 20,
      title: "Low-Oil Vegetable Pulao",
      cuisine: "Indian",
      diet: "Vegetarian",
      rating: 4.6,
      image:"https://images.unsplash.com/photo-1630409346824-4f0e7b080087?q=80&w=1246&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      nutrition: { calories: 260, fat: 5, protein: 6, carbs: 45 },
      oilContent: "1 tsp oil",
      cookingTime: "30 minutes",
      difficulty: "Medium",
      steps: [
        "Heat oil in a pot",
        "Add whole spices and onions",
        "Add vegetables and sauté lightly",
        "Add rice and water and cook until done"
      ],
      ingredients: [
        "1 cup basmati rice",
        "Mixed vegetables",
        "1 tsp oil",
        "Cumin seeds",
        "Bay leaf",
        "Salt"
      ]
    },
    {
      id: 21,
      title: "Low-Oil Tawa Paneer",
      cuisine: "Indian",
      diet: "Vegetarian",
      rating: 4.5,
      image: "https://plus.unsplash.com/premium_photo-1669831178095-005ed789250a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      nutrition: { calories: 280, fat: 10, protein: 14, carbs: 22 },
      oilContent: "1 tsp oil",
      cookingTime: "20 minutes",
      difficulty: "Easy",
      steps: [
        "Heat minimal oil on a tawa",
        "Sauté onions, capsicum and tomatoes",
        "Add paneer cubes and spices",
        "Cook for a few minutes and serve hot"
      ],
      ingredients: [
        "Paneer cubes",
        "Onion",
        "Tomato",
        "Capsicum",
        "1 tsp oil",
        "Spices (turmeric, chili, garam masala)",
        "Salt"
      ]
    },
    {
      id: 22,
      title: "Low-Oil Poha",
      cuisine: "Indian",
      diet: "Vegetarian",
      rating: 4.4,
      image: "https://cdn.pixabay.com/photo/2022/04/10/10/51/poha-7123148_1280.jpg",
      nutrition: { calories: 200, fat: 4, protein: 4, carbs: 35 },
      oilContent: "1 tsp oil",
      cookingTime: "15 minutes",
      difficulty: "Easy",
      steps: [
        "Rinse poha and keep aside",
        "Heat minimal oil in pan",
        "Add mustard, curry leaves, onions, and chilies",
        "Add poha and mix gently",
        "Garnish with coriander and lemon"
      ],
      ingredients: [
        "Flattened rice (poha)",
        "1 tsp oil",
        "Mustard seeds",
        "Onion",
        "Green chili",
        "Curry leaves",
        "Salt, lemon, coriander"
      ]
    },

    // ===== ITALIAN =====
    {
      id: 8,
      title: "Italian Tomato Basil Pasta",
      cuisine: "Italian",
      diet: "Vegetarian",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?q=80&w=1200&auto=format&fit=crop",
      nutrition: { calories: 260, fat: 5, protein: 9, carbs: 45 },
      oilContent: "1 tsp olive oil",
      cookingTime: "20 minutes",
      difficulty: "Easy",
      steps: [
        "Boil pasta in salted water",
        "Heat olive oil and sauté garlic",
        "Add tomato sauce and cook",
        "Mix pasta with sauce",
        "Top with basil and parmesan"
      ],
      ingredients: [
        "200g pasta",
        "1 tsp olive oil",
        "Garlic cloves",
        "Tomato puree",
        "Fresh basil",
        "Salt and pepper",
        "Parmesan cheese"
      ]
    },
    {
      id: 23,
      title: "Low-Oil Veggie Pizza Toast",
      cuisine: "Italian",
      diet: "Vegetarian",
      rating: 4.4,
      image: "https://images.pexels.com/photos/6493569/pexels-photo-6493569.jpeg",
      nutrition: { calories: 220, fat: 6, protein: 9, carbs: 30 },
      oilContent: "1/2 tsp olive oil",
      cookingTime: "15 minutes",
      difficulty: "Easy",
      steps: [
        "Lightly brush bread with olive oil",
        "Spread tomato sauce",
        "Top with veggies and cheese",
        "Toast or bake until cheese melts"
      ],
      ingredients: [
        "Bread slices",
        "Tomato sauce",
        "Bell peppers",
        "Onion",
        "Cheese",
        "1/2 tsp olive oil",
        "Oregano"
      ]
    },
    {
      id: 24,
      title: "Low-Oil Minestrone Soup",
      cuisine: "Italian",
      diet: "Vegetarian",
      rating: 4.5,
      image: "https://cdn.pixabay.com/photo/2023/05/27/13/49/soup-8021564_1280.jpg",
      nutrition: { calories: 150, fat: 4, protein: 6, carbs: 22 },
      oilContent: "1 tsp olive oil",
      cookingTime: "30 minutes",
      difficulty: "Easy",
      steps: [
        "Heat olive oil in pot",
        "Add garlic, onion, and veggies",
        "Add vegetable stock and pasta",
        "Simmer until cooked",
        "Season and serve hot"
      ],
      ingredients: [
        "Mixed vegetables",
        "Small pasta",
        "Vegetable stock",
        "1 tsp olive oil",
        "Garlic and onion",
        "Italian herbs",
        "Salt, pepper"
      ]
    },
    {
      id: 25,
      title: "Low-Oil Caprese Salad",
      cuisine: "Italian",
      diet: "Vegetarian",
      rating: 4.3,
      image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=1200&auto=format&fit=crop",
      nutrition: { calories: 190, fat: 8, protein: 9, carbs: 10 },
      oilContent: "1 tsp olive oil",
      cookingTime: "10 minutes",
      difficulty: "Easy",
      steps: [
        "Slice tomatoes and mozzarella",
        "Arrange slices alternately",
        "Top with basil leaves",
        "Drizzle olive oil and balsamic",
        "Season lightly"
      ],
      ingredients: [
        "Tomatoes",
        "Mozzarella cheese",
        "Fresh basil",
        "1 tsp olive oil",
        "Balsamic vinegar",
        "Salt, pepper"
      ]
    },

    // ===== MEXICAN =====
    {
      id: 9,
      title: "Mexican Black Bean Bowl",
      cuisine: "Mexican",
      diet: "Vegan",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=1200&auto=format&fit=crop",
      nutrition: { calories: 240, fat: 5, protein: 10, carbs: 40 },
      oilContent: "1 tsp oil",
      cookingTime: "25 minutes",
      difficulty: "Easy",
      steps: [
        "Heat pan with minimal oil",
        "Add garlic, onions, and bell peppers",
        "Add cooked black beans and spices",
        "Simmer and adjust seasoning",
        "Serve warm"
      ],
      ingredients: [
        "Black beans (boiled)",
        "1 tsp oil",
        "Onion",
        "Bell pepper",
        "Garlic",
        "Cumin and paprika",
        "Salt and lime juice"
      ]
    },
    {
      id: 26,
      title: "Low-Oil Veggie Tacos",
      cuisine: "Mexican",
      diet: "Vegetarian",
      rating: 4.6,
      image: "https://cdn.pixabay.com/photo/2019/09/22/09/47/tacos-4495602_1280.jpg",
      nutrition: { calories: 230, fat: 6, protein: 8, carbs: 32 },
      oilContent: "1 tsp oil",
      cookingTime: "20 minutes",
      difficulty: "Easy",
      steps: [
        "Heat minimal oil in pan",
        "Sauté onions, peppers, and corn",
        "Warm taco shells",
        "Fill with veggie mix and toppings"
      ],
      ingredients: [
        "Taco shells",
        "Onion",
        "Bell peppers",
        "Corn",
        "1 tsp oil",
        "Lettuce",
        "Salsa"
      ]
    },
    
   
  ];

  async function search() {
    // Simulate API call with sample data
    let filteredRecipes = [...sampleRecipes];

    if (filters.cuisine) {
      filteredRecipes = filteredRecipes.filter(r =>
        r.cuisine.toLowerCase().includes(filters.cuisine.toLowerCase())
      );
    }

    if (filters.lowOil) {
      filteredRecipes = filteredRecipes.filter(
        r => r.oilContent.includes('1 tsp') || r.oilContent.includes('1/2 tsp')
      );
    }

    setRecipes(filteredRecipes);
  }

  useEffect(() => {
    search();
  }, []);

  return (
    <div className="grid">
      <section className="panel">
        <h2 style={{ marginTop: 0 }}>Low-Oil Recipes</h2>
        <div className="grid" style={{ gridTemplateColumns: '1fr auto', gap: 12 }}>
          {/* Cuisine dropdown (7–8 cuisines) */}
          <select
            value={filters.cuisine}
            onChange={e => setFilters({ ...filters, cuisine: e.target.value })}
            style={{ backgroundColor: '#0f172a', color: 'white', padding: '6px 8px', borderRadius: 8 }}
          >
            <option value="">All cuisines</option>
            <option value="Mediterranean">Mediterranean</option>
            <option value="Asian">Asian</option>
            <option value="American">American</option>
            <option value="Healthy">Healthy</option>
            <option value="Indian">Indian</option>
            <option value="Italian">Italian</option>
            <option value="Mexican">Mexican</option>
          </select>

          <button onClick={search}>Search</button>
        </div>
      </section>

      <section
        className="grid"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 20 }}
      >
        {recipes.map(r => (
          <article className="panel" key={r.id} style={{ overflow: 'hidden' }}>
            {r.image && (
              <img
                src={r.image}
                alt={r.title}
                style={{ width: '100%', borderRadius: 12, height: 200, objectFit: 'cover' }}
                onError={e => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `https://via.placeholder.com/800x600?text=${encodeURIComponent(
                    r.title
                  )}`;
                }}
              />
            )}
            <div style={{ padding: '16px 0' }}>
              <h3 style={{ margin: '0 0 8px 0', color: 'var(--brand)' }}>{r.title}</h3>
              <div style={{ display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                <span
                  style={{
                    background: 'rgba(124,245,255,0.2)',
                    padding: '4px 8px',
                    borderRadius: 12,
                    fontSize: '12px'
                  }}
                >
                  {r.cuisine}
                </span>
                <span
                  style={{
                    background: 'rgba(255,155,251,0.2)',
                    padding: '4px 8px',
                    borderRadius: 12,
                    fontSize: '12px'
                  }}
                >
                  {r.diet}
                </span>
                <span
                  style={{
                    background: 'rgba(255,227,91,0.2)',
                    padding: '4px 8px',
                    borderRadius: 12,
                    fontSize: '12px'
                  }}
                >
                  ⭐ {r.rating}
                </span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 8,
                  marginBottom: 12
                }}
              >
                <div
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    padding: 8,
                    borderRadius: 8
                  }}
                >
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Oil Content</div>
                  <div style={{ fontWeight: 'bold', color: 'var(--brand)' }}>{r.oilContent}</div>
                </div>
                <div
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    padding: 8,
                    borderRadius: 8
                  }}
                >
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Cooking Time</div>
                  <div style={{ fontWeight: 'bold' }}>{r.cookingTime}</div>
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: 4 }}>
                  Nutrition (per serving)
                </div>
                <div style={{ display: 'flex', gap: 12, fontSize: '12px' }}>
                  <span>{r.nutrition.calories} kcal</span>
                  <span>{r.nutrition.fat}g fat</span>
                  <span>{r.nutrition.protein}g protein</span>
                </div>
              </div>

              <details style={{ marginTop: 12 }}>
                <summary
                  style={{
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    color: 'var(--brand)'
                  }}
                >
                  View Recipe Details
                </summary>
                <div
                  style={{
                    marginTop: 12,
                    padding: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: 8
                  }}
                >
                  <div style={{ marginBottom: 12 }}>
                    <strong>Ingredients:</strong>
                    <ul style={{ margin: '8px 0', paddingLeft: 16 }}>
                      {r.ingredients.map((ingredient, i) => (
                        <li key={i} style={{ fontSize: '14px', margin: '4px 0' }}>
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <strong>Instructions:</strong>
                    <ol style={{ margin: '8px 0', paddingLeft: 16 }}>
                      {r.steps.map((step, i) => (
                        <li key={i} style={{ fontSize: '14px', margin: '4px 0' }}>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </details>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}