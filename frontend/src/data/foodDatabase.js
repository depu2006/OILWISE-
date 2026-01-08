// Comprehensive food database for oil content analysis
// Oil content is calculated based on:
// - Packaged foods: Fat content from nutrition labels (assuming ~90% of fat is from oil)
// - Unpackaged foods: Typical oil usage in recipes per 100g serving

export const foodDatabase = {
    // ==================== PACKAGED FOODS ====================
    packaged: [
        // Chips & Snacks
        {
            name: "lays chips",
            aliases: ["lays", "potato chips", "chips", "wafers", "lays classic"],
            category: "Packaged Snacks",
            servingSize: "100g",
            totalFat: 35,
            oilContent: 31.5,
            saturatedFat: 3.5,
            unsaturatedFat: 31.5,
            cookingMethod: "Deep fried",
            alternatives: ["Baked chips", "Air-popped popcorn", "Roasted chickpeas"]
        },
        {
            name: "kurkure",
            aliases: ["kurkure", "corn puffs", "masala munch"],
            category: "Packaged Snacks",
            servingSize: "100g",
            totalFat: 30,
            oilContent: 27,
            saturatedFat: 4,
            unsaturatedFat: 26,
            cookingMethod: "Deep fried",
            alternatives: ["Roasted makhana", "Baked corn chips", "Popcorn"]
        },
        {
            name: "bingo chips",
            aliases: ["bingo", "bingo mad angles", "bingo tedhe medhe"],
            category: "Packaged Snacks",
            servingSize: "100g",
            totalFat: 33,
            oilContent: 29.7,
            saturatedFat: 3.8,
            unsaturatedFat: 29.2,
            cookingMethod: "Deep fried",
            alternatives: ["Baked vegetable chips", "Rice cakes", "Roasted nuts"]
        },
        {
            name: "uncle chips",
            aliases: ["uncle chipps", "uncle chips"],
            category: "Packaged Snacks",
            servingSize: "100g",
            totalFat: 34,
            oilContent: 30.6,
            saturatedFat: 4,
            unsaturatedFat: 30,
            cookingMethod: "Deep fried",
            alternatives: ["Baked chips", "Roasted peanuts", "Makhana"]
        },
        {
            name: "cheetos",
            aliases: ["cheetos", "cheese puffs"],
            category: "Packaged Snacks",
            servingSize: "100g",
            totalFat: 32,
            oilContent: 28.8,
            saturatedFat: 5,
            unsaturatedFat: 27,
            cookingMethod: "Deep fried",
            alternatives: ["Baked cheese snacks", "Popcorn", "Roasted corn"]
        },

        // Instant Noodles
        {
            name: "maggi noodles",
            aliases: ["maggi", "instant noodles", "2 minute noodles", "maggi masala"],
            category: "Instant Food",
            servingSize: "100g",
            totalFat: 16,
            oilContent: 14.4,
            saturatedFat: 7,
            unsaturatedFat: 9,
            cookingMethod: "Pre-fried",
            alternatives: ["Whole wheat noodles", "Rice noodles", "Vegetable noodles"]
        },
        {
            name: "yippee noodles",
            aliases: ["yippee", "sunfeast yippee"],
            category: "Instant Food",
            servingSize: "100g",
            totalFat: 15,
            oilContent: 13.5,
            saturatedFat: 6.5,
            unsaturatedFat: 8.5,
            cookingMethod: "Pre-fried",
            alternatives: ["Hakka noodles with less oil", "Vermicelli", "Oats noodles"]
        },
        {
            name: "top ramen",
            aliases: ["top ramen", "ramen", "nissin top ramen"],
            category: "Instant Food",
            servingSize: "100g",
            totalFat: 17,
            oilContent: 15.3,
            saturatedFat: 7.5,
            unsaturatedFat: 9.5,
            cookingMethod: "Pre-fried",
            alternatives: ["Fresh noodles", "Soba noodles", "Rice noodles"]
        },

        // Cookies & Biscuits
        {
            name: "parle-g biscuits",
            aliases: ["parle-g", "glucose biscuits", "parle biscuits"],
            category: "Biscuits",
            servingSize: "100g",
            totalFat: 12,
            oilContent: 10.8,
            saturatedFat: 5,
            unsaturatedFat: 7,
            cookingMethod: "Baked",
            alternatives: ["Oats cookies", "Digestive biscuits", "Rusk"]
        },
        {
            name: "oreo cookies",
            aliases: ["oreo", "cream biscuits"],
            category: "Biscuits",
            servingSize: "100g",
            totalFat: 20,
            oilContent: 18,
            saturatedFat: 7,
            unsaturatedFat: 13,
            cookingMethod: "Baked",
            alternatives: ["Oatmeal cookies", "Marie biscuits", "Whole wheat cookies"]
        },
        {
            name: "britannia good day",
            aliases: ["good day", "britannia good day", "good day butter"],
            category: "Biscuits",
            servingSize: "100g",
            totalFat: 22,
            oilContent: 19.8,
            saturatedFat: 9,
            unsaturatedFat: 13,
            cookingMethod: "Baked",
            alternatives: ["Digestive biscuits", "Oats cookies", "Marie biscuits"]
        },
        {
            name: "hide and seek",
            aliases: ["hide and seek", "parle hide and seek", "chocolate chip cookies"],
            category: "Biscuits",
            servingSize: "100g",
            totalFat: 19,
            oilContent: 17.1,
            saturatedFat: 8,
            unsaturatedFat: 11,
            cookingMethod: "Baked",
            alternatives: ["Oatmeal cookies", "Whole grain cookies", "Rusk"]
        },
        {
            name: "monaco biscuits",
            aliases: ["monaco", "parle monaco", "salted biscuits"],
            category: "Biscuits",
            servingSize: "100g",
            totalFat: 18,
            oilContent: 16.2,
            saturatedFat: 7,
            unsaturatedFat: 11,
            cookingMethod: "Baked",
            alternatives: ["Whole wheat crackers", "Rice cakes", "Khakhra"]
        },

        // Namkeen
        {
            name: "haldiram bhujia",
            aliases: ["bhujia", "sev", "haldiram sev", "aloo bhujia"],
            category: "Namkeen",
            servingSize: "100g",
            totalFat: 38,
            oilContent: 34.2,
            saturatedFat: 5,
            unsaturatedFat: 33,
            cookingMethod: "Deep fried",
            alternatives: ["Roasted chana", "Roasted peanuts", "Baked namkeen"]
        },
        {
            name: "mixture",
            aliases: ["namkeen mixture", "south indian mixture", "bombay mixture"],
            category: "Namkeen",
            servingSize: "100g",
            totalFat: 35,
            oilContent: 31.5,
            saturatedFat: 4.5,
            unsaturatedFat: 30.5,
            cookingMethod: "Deep fried",
            alternatives: ["Roasted nuts mix", "Baked mixture", "Poha chivda"]
        },
        {
            name: "chakli",
            aliases: ["chakli", "murukku", "chakri"],
            category: "Namkeen",
            servingSize: "100g",
            totalFat: 32,
            oilContent: 28.8,
            saturatedFat: 4,
            unsaturatedFat: 28,
            cookingMethod: "Deep fried",
            alternatives: ["Baked chakli", "Roasted chana", "Khakhra"]
        },
        {
            name: "chana dal",
            aliases: ["roasted chana dal", "fried chana dal", "chana dal namkeen"],
            category: "Namkeen",
            servingSize: "100g",
            totalFat: 28,
            oilContent: 25.2,
            saturatedFat: 3,
            unsaturatedFat: 25,
            cookingMethod: "Deep fried",
            alternatives: ["Roasted chana", "Roasted peanuts", "Makhana"]
        },

        // Chocolates & Candies
        {
            name: "dairy milk",
            aliases: ["cadbury dairy milk", "dairy milk chocolate"],
            category: "Chocolates",
            servingSize: "100g",
            totalFat: 30,
            oilContent: 27,
            saturatedFat: 18,
            unsaturatedFat: 12,
            cookingMethod: "Processed",
            alternatives: ["Dark chocolate", "Fruit", "Dates"]
        },
        {
            name: "kitkat",
            aliases: ["kit kat", "kitkat chocolate"],
            category: "Chocolates",
            servingSize: "100g",
            totalFat: 28,
            oilContent: 25.2,
            saturatedFat: 16,
            unsaturatedFat: 12,
            cookingMethod: "Processed",
            alternatives: ["Dark chocolate", "Protein bars", "Nuts"]
        },

        // Frozen Foods
        {
            name: "frozen samosa",
            aliases: ["frozen samosa", "ready to fry samosa"],
            category: "Frozen Foods",
            servingSize: "100g",
            totalFat: 18,
            oilContent: 16.2,
            saturatedFat: 3,
            unsaturatedFat: 15,
            cookingMethod: "Deep fried (after cooking)",
            alternatives: ["Baked samosa", "Air-fried samosa", "Fresh vegetables"]
        },
        {
            name: "frozen paratha",
            aliases: ["frozen paratha", "ready to cook paratha"],
            category: "Frozen Foods",
            servingSize: "100g",
            totalFat: 14,
            oilContent: 12.6,
            saturatedFat: 4,
            unsaturatedFat: 10,
            cookingMethod: "Pan-fried",
            alternatives: ["Fresh roti", "Whole wheat chapati", "Multigrain bread"]
        }
    ],

    // ==================== UNPACKAGED FOODS ====================
    unpackaged: [
        // Rice Dishes
        {
            name: "biryani",
            aliases: ["chicken biryani", "mutton biryani", "veg biryani", "dum biryani", "hyderabadi biryani"],
            category: "Rice Dishes",
            servingSize: "100g",
            oilContent: 8,
            saturatedFat: 2,
            unsaturatedFat: 6,
            cookingMethod: "Dum cooked with oil/ghee",
            alternatives: ["Pulao with less oil", "Steamed rice with curry", "Quinoa biryani"]
        },
        {
            name: "fried rice",
            aliases: ["veg fried rice", "chicken fried rice", "egg fried rice", "schezwan fried rice"],
            category: "Rice Dishes",
            servingSize: "100g",
            oilContent: 6,
            saturatedFat: 1.5,
            unsaturatedFat: 4.5,
            cookingMethod: "Stir-fried",
            alternatives: ["Steamed rice", "Brown rice", "Cauliflower rice"]
        },
        {
            name: "pulao",
            aliases: ["veg pulao", "jeera rice", "peas pulao"],
            category: "Rice Dishes",
            servingSize: "100g",
            oilContent: 5,
            saturatedFat: 1,
            unsaturatedFat: 4,
            cookingMethod: "Cooked with oil/ghee",
            alternatives: ["Steamed rice", "Brown rice", "Quinoa"]
        },
        {
            name: "curd rice",
            aliases: ["dahi rice", "yogurt rice", "thayir sadam"],
            category: "Rice Dishes",
            servingSize: "100g",
            oilContent: 2,
            saturatedFat: 0.5,
            unsaturatedFat: 1.5,
            cookingMethod: "Tempered with oil",
            alternatives: ["Plain rice with yogurt", "Brown rice with yogurt"]
        },

        // Fried Foods
        {
            name: "fried chicken",
            aliases: ["chicken fry", "crispy chicken", "deep fried chicken", "chicken 65"],
            category: "Fried Foods",
            servingSize: "100g",
            oilContent: 15,
            saturatedFat: 3,
            unsaturatedFat: 12,
            cookingMethod: "Deep fried",
            alternatives: ["Grilled chicken", "Baked chicken", "Air-fried chicken"]
        },
        {
            name: "french fries",
            aliases: ["fries", "potato fries", "finger chips"],
            category: "Fried Foods",
            servingSize: "100g",
            oilContent: 17,
            saturatedFat: 3.5,
            unsaturatedFat: 13.5,
            cookingMethod: "Deep fried",
            alternatives: ["Baked potato wedges", "Air-fried fries", "Sweet potato fries"]
        },
        {
            name: "fish fry",
            aliases: ["fried fish", "fish pakora", "fish fingers"],
            category: "Fried Foods",
            servingSize: "100g",
            oilContent: 14,
            saturatedFat: 2.5,
            unsaturatedFat: 11.5,
            cookingMethod: "Deep fried",
            alternatives: ["Grilled fish", "Baked fish", "Steamed fish"]
        },

        // Street Food & Snacks
        {
            name: "samosa",
            aliases: ["aloo samosa", "veg samosa", "punjabi samosa"],
            category: "Street Food",
            servingSize: "100g",
            oilContent: 20,
            saturatedFat: 4,
            unsaturatedFat: 16,
            cookingMethod: "Deep fried",
            alternatives: ["Baked samosa", "Air-fried samosa", "Steamed momos"]
        },
        {
            name: "pakora",
            aliases: ["pakoda", "bhaji", "onion pakora", "vegetable pakora", "bread pakora"],
            category: "Street Food",
            servingSize: "100g",
            oilContent: 18,
            saturatedFat: 3.5,
            unsaturatedFat: 14.5,
            cookingMethod: "Deep fried",
            alternatives: ["Baked pakora", "Steamed dhokla", "Roasted corn"]
        },
        {
            name: "vada",
            aliases: ["medu vada", "urad dal vada", "masala vada", "dahi vada"],
            category: "Street Food",
            servingSize: "100g",
            oilContent: 16,
            saturatedFat: 3,
            unsaturatedFat: 13,
            cookingMethod: "Deep fried",
            alternatives: ["Idli", "Steamed vada", "Dhokla"]
        },
        {
            name: "kachori",
            aliases: ["dal kachori", "pyaaz kachori", "matar kachori"],
            category: "Street Food",
            servingSize: "100g",
            oilContent: 22,
            saturatedFat: 4.5,
            unsaturatedFat: 17.5,
            cookingMethod: "Deep fried",
            alternatives: ["Baked kachori", "Khakhra", "Roasted chana"]
        },
        {
            name: "pani puri",
            aliases: ["golgappa", "puchka", "gupchup"],
            category: "Street Food",
            servingSize: "100g",
            oilContent: 15,
            saturatedFat: 3,
            unsaturatedFat: 12,
            cookingMethod: "Deep fried puri",
            alternatives: ["Baked puri", "Sprouts chaat", "Fruit chaat"]
        },
        {
            name: "bhel puri",
            aliases: ["bhel", "bhelpuri"],
            category: "Street Food",
            servingSize: "100g",
            oilContent: 8,
            saturatedFat: 1.5,
            unsaturatedFat: 6.5,
            cookingMethod: "Mixed with fried sev",
            alternatives: ["Sprouts chaat", "Fruit chaat", "Corn chaat"]
        },
        {
            name: "pav bhaji",
            aliases: ["pav bhaji", "mumbai pav bhaji"],
            category: "Street Food",
            servingSize: "100g",
            oilContent: 10,
            saturatedFat: 3,
            unsaturatedFat: 7,
            cookingMethod: "Cooked with butter/oil",
            alternatives: ["Grilled vegetables", "Vegetable curry", "Salad"]
        },
        {
            name: "chole bhature",
            aliases: ["chana bhatura", "chole bhature"],
            category: "Street Food",
            servingSize: "100g",
            oilContent: 18,
            saturatedFat: 3.5,
            unsaturatedFat: 14.5,
            cookingMethod: "Deep fried bhature",
            alternatives: ["Chole with roti", "Chole with rice", "Rajma chawal"]
        },
        {
            name: "dosa",
            aliases: ["masala dosa", "plain dosa", "rava dosa", "onion dosa"],
            category: "South Indian",
            servingSize: "100g",
            oilContent: 4,
            saturatedFat: 1,
            unsaturatedFat: 3,
            cookingMethod: "Pan-fried with minimal oil",
            alternatives: ["Steamed idli", "Uttapam", "Ragi dosa"]
        },
        {
            name: "idli",
            aliases: ["steamed idli", "idly"],
            category: "South Indian",
            servingSize: "100g",
            oilContent: 0.5,
            saturatedFat: 0.1,
            unsaturatedFat: 0.4,
            cookingMethod: "Steamed",
            alternatives: ["Oats idli", "Ragi idli", "Vegetable idli"]
        },
        {
            name: "uttapam",
            aliases: ["uthappam", "vegetable uttapam"],
            category: "South Indian",
            servingSize: "100g",
            oilContent: 3,
            saturatedFat: 0.8,
            unsaturatedFat: 2.2,
            cookingMethod: "Pan-fried with minimal oil",
            alternatives: ["Steamed idli", "Dosa", "Vegetable pancake"]
        },

        // Curries & Gravies
        {
            name: "butter chicken",
            aliases: ["murgh makhani", "chicken makhani"],
            category: "Curry",
            servingSize: "100g",
            oilContent: 12,
            saturatedFat: 5,
            unsaturatedFat: 7,
            cookingMethod: "Cooked with butter and cream",
            alternatives: ["Grilled chicken curry", "Tandoori chicken", "Chicken tikka"]
        },
        {
            name: "paneer butter masala",
            aliases: ["paneer makhani", "paneer curry"],
            category: "Curry",
            servingSize: "100g",
            oilContent: 10,
            saturatedFat: 4,
            unsaturatedFat: 6,
            cookingMethod: "Cooked with butter and cream",
            alternatives: ["Grilled paneer", "Paneer tikka", "Steamed paneer"]
        },
        {
            name: "dal makhani",
            aliases: ["dal makhni", "black dal"],
            category: "Curry",
            servingSize: "100g",
            oilContent: 8,
            saturatedFat: 3,
            unsaturatedFat: 5,
            cookingMethod: "Cooked with butter and cream",
            alternatives: ["Dal tadka", "Plain dal", "Moong dal"]
        },
        {
            name: "chicken curry",
            aliases: ["chicken gravy", "chicken masala"],
            category: "Curry",
            servingSize: "100g",
            oilContent: 9,
            saturatedFat: 2,
            unsaturatedFat: 7,
            cookingMethod: "Cooked with oil and spices",
            alternatives: ["Grilled chicken", "Chicken soup", "Steamed chicken"]
        },
        {
            name: "palak paneer",
            aliases: ["spinach paneer", "saag paneer"],
            category: "Curry",
            servingSize: "100g",
            oilContent: 7,
            saturatedFat: 2.5,
            unsaturatedFat: 4.5,
            cookingMethod: "Cooked with oil",
            alternatives: ["Steamed spinach", "Palak soup", "Grilled paneer"]
        },
        {
            name: "kadai paneer",
            aliases: ["karahi paneer", "kadhai paneer"],
            category: "Curry",
            servingSize: "100g",
            oilContent: 9,
            saturatedFat: 3,
            unsaturatedFat: 6,
            cookingMethod: "Cooked with oil",
            alternatives: ["Grilled paneer", "Paneer tikka", "Tofu curry"]
        },

        // Fast Food
        {
            name: "burger",
            aliases: ["veg burger", "chicken burger", "cheese burger", "aloo tikki burger"],
            category: "Fast Food",
            servingSize: "100g",
            oilContent: 10,
            saturatedFat: 3,
            unsaturatedFat: 7,
            cookingMethod: "Grilled/fried patty",
            alternatives: ["Grilled chicken sandwich", "Veggie wrap", "Whole wheat burger"]
        },
        {
            name: "pizza",
            aliases: ["cheese pizza", "veg pizza", "chicken pizza", "margherita"],
            category: "Fast Food",
            servingSize: "100g",
            oilContent: 8,
            saturatedFat: 3,
            unsaturatedFat: 5,
            cookingMethod: "Baked with cheese and oil",
            alternatives: ["Thin crust pizza", "Whole wheat pizza", "Flatbread pizza"]
        },
        {
            name: "momos",
            aliases: ["steamed momos", "fried momos", "dumplings", "chicken momos", "veg momos"],
            category: "Fast Food",
            servingSize: "100g",
            oilContent: 3,
            saturatedFat: 0.5,
            unsaturatedFat: 2.5,
            cookingMethod: "Steamed (or fried)",
            alternatives: ["Steamed momos", "Vegetable dumplings", "Wontons"]
        },
        {
            name: "sandwich",
            aliases: ["grilled sandwich", "veg sandwich", "cheese sandwich"],
            category: "Fast Food",
            servingSize: "100g",
            oilContent: 6,
            saturatedFat: 2,
            unsaturatedFat: 4,
            cookingMethod: "Grilled with butter",
            alternatives: ["Whole wheat sandwich", "Salad wrap", "Open sandwich"]
        },
        {
            name: "pasta",
            aliases: ["white sauce pasta", "red sauce pasta", "penne pasta"],
            category: "Fast Food",
            servingSize: "100g",
            oilContent: 5,
            saturatedFat: 1.5,
            unsaturatedFat: 3.5,
            cookingMethod: "Cooked with oil/butter",
            alternatives: ["Whole wheat pasta", "Vegetable pasta", "Zucchini noodles"]
        },

        // Bread & Roti
        {
            name: "aloo paratha",
            aliases: ["paratha", "stuffed paratha", "potato paratha"],
            category: "Bread",
            servingSize: "100g",
            oilContent: 12,
            saturatedFat: 3,
            unsaturatedFat: 9,
            cookingMethod: "Pan-fried with oil/ghee",
            alternatives: ["Roti", "Whole wheat chapati", "Phulka"]
        },
        {
            name: "puri",
            aliases: ["poori", "deep fried bread"],
            category: "Bread",
            servingSize: "100g",
            oilContent: 25,
            saturatedFat: 5,
            unsaturatedFat: 20,
            cookingMethod: "Deep fried",
            alternatives: ["Roti", "Chapati", "Bhakri"]
        },
        {
            name: "naan",
            aliases: ["butter naan", "garlic naan", "tandoori naan"],
            category: "Bread",
            servingSize: "100g",
            oilContent: 7,
            saturatedFat: 2,
            unsaturatedFat: 5,
            cookingMethod: "Baked with butter",
            alternatives: ["Roti", "Whole wheat naan", "Tandoori roti"]
        },
        {
            name: "kulcha",
            aliases: ["amritsari kulcha", "stuffed kulcha"],
            category: "Bread",
            servingSize: "100g",
            oilContent: 8,
            saturatedFat: 2.5,
            unsaturatedFat: 5.5,
            cookingMethod: "Baked with butter",
            alternatives: ["Roti", "Chapati", "Whole wheat kulcha"]
        },
        {
            name: "roti",
            aliases: ["chapati", "phulka", "whole wheat roti"],
            category: "Bread",
            servingSize: "100g",
            oilContent: 1,
            saturatedFat: 0.3,
            unsaturatedFat: 0.7,
            cookingMethod: "Dry roasted",
            alternatives: ["Multigrain roti", "Jowar roti", "Bajra roti"]
        },

        // Sweets & Desserts
        {
            name: "jalebi",
            aliases: ["jilebi"],
            category: "Sweets",
            servingSize: "100g",
            oilContent: 20,
            saturatedFat: 4,
            unsaturatedFat: 16,
            cookingMethod: "Deep fried in sugar syrup",
            alternatives: ["Fruit salad", "Dates", "Dry fruits"]
        },
        {
            name: "gulab jamun",
            aliases: ["gulabjamun"],
            category: "Sweets",
            servingSize: "100g",
            oilContent: 15,
            saturatedFat: 6,
            unsaturatedFat: 9,
            cookingMethod: "Deep fried in sugar syrup",
            alternatives: ["Rasgulla", "Fruit custard", "Kheer"]
        },
        {
            name: "rasgulla",
            aliases: ["rosogolla", "roshogolla"],
            category: "Sweets",
            servingSize: "100g",
            oilContent: 1,
            saturatedFat: 0.5,
            unsaturatedFat: 0.5,
            cookingMethod: "Boiled in sugar syrup",
            alternatives: ["Fruit salad", "Yogurt", "Fresh fruits"]
        },
        {
            name: "ladoo",
            aliases: ["besan ladoo", "boondi ladoo", "motichoor ladoo"],
            category: "Sweets",
            servingSize: "100g",
            oilContent: 18,
            saturatedFat: 7,
            unsaturatedFat: 11,
            cookingMethod: "Fried and shaped",
            alternatives: ["Dry fruits", "Dates", "Fruit bars"]
        },
        {
            name: "barfi",
            aliases: ["milk barfi", "kaju barfi", "coconut barfi"],
            category: "Sweets",
            servingSize: "100g",
            oilContent: 12,
            saturatedFat: 7,
            unsaturatedFat: 5,
            cookingMethod: "Cooked with ghee",
            alternatives: ["Fresh fruits", "Dates", "Dry fruits"]
        },
        {
            name: "halwa",
            aliases: ["gajar halwa", "sooji halwa", "moong dal halwa"],
            category: "Sweets",
            servingSize: "100g",
            oilContent: 14,
            saturatedFat: 6,
            unsaturatedFat: 8,
            cookingMethod: "Cooked with ghee",
            alternatives: ["Fruit compote", "Dates", "Fresh fruits"]
        },
        {
            name: "kheer",
            aliases: ["rice kheer", "payasam", "rice pudding"],
            category: "Sweets",
            servingSize: "100g",
            oilContent: 3,
            saturatedFat: 2,
            unsaturatedFat: 1,
            cookingMethod: "Cooked with milk",
            alternatives: ["Fruit custard", "Yogurt", "Fresh fruits"]
        },

        // Tandoori & Grilled
        {
            name: "tandoori chicken",
            aliases: ["tandoori", "chicken tandoori"],
            category: "Tandoori",
            servingSize: "100g",
            oilContent: 4,
            saturatedFat: 1,
            unsaturatedFat: 3,
            cookingMethod: "Grilled in tandoor",
            alternatives: ["Grilled chicken", "Baked chicken", "Steamed chicken"]
        },
        {
            name: "chicken tikka",
            aliases: ["tikka", "chicken tikka"],
            category: "Tandoori",
            servingSize: "100g",
            oilContent: 5,
            saturatedFat: 1.5,
            unsaturatedFat: 3.5,
            cookingMethod: "Grilled in tandoor",
            alternatives: ["Grilled chicken", "Baked chicken", "Steamed chicken"]
        },
        {
            name: "paneer tikka",
            aliases: ["paneer tikka", "grilled paneer"],
            category: "Tandoori",
            servingSize: "100g",
            oilContent: 6,
            saturatedFat: 2,
            unsaturatedFat: 4,
            cookingMethod: "Grilled in tandoor",
            alternatives: ["Steamed paneer", "Grilled vegetables", "Tofu tikka"]
        },
        {
            name: "seekh kabab",
            aliases: ["seekh kebab", "kabab", "kebab"],
            category: "Tandoori",
            servingSize: "100g",
            oilContent: 7,
            saturatedFat: 2,
            unsaturatedFat: 5,
            cookingMethod: "Grilled in tandoor",
            alternatives: ["Grilled chicken", "Baked kebab", "Vegetable kebab"]
        },

        // Regional Specialties
        {
            name: "dhokla",
            aliases: ["khaman dhokla", "gujarati dhokla"],
            category: "Regional",
            servingSize: "100g",
            oilContent: 2,
            saturatedFat: 0.5,
            unsaturatedFat: 1.5,
            cookingMethod: "Steamed and tempered",
            alternatives: ["Steamed idli", "Handvo", "Khandvi"]
        },
        {
            name: "khandvi",
            aliases: ["gujarati khandvi", "patuli"],
            category: "Regional",
            servingSize: "100g",
            oilContent: 3,
            saturatedFat: 0.8,
            unsaturatedFat: 2.2,
            cookingMethod: "Steamed and tempered",
            alternatives: ["Dhokla", "Steamed idli", "Vegetable rolls"]
        },
        {
            name: "thepla",
            aliases: ["gujarati thepla", "methi thepla"],
            category: "Regional",
            servingSize: "100g",
            oilContent: 8,
            saturatedFat: 2,
            unsaturatedFat: 6,
            cookingMethod: "Pan-fried",
            alternatives: ["Roti", "Chapati", "Whole wheat thepla"]
        },
        {
            name: "appam",
            aliases: ["kerala appam", "palappam"],
            category: "Regional",
            servingSize: "100g",
            oilContent: 2,
            saturatedFat: 0.5,
            unsaturatedFat: 1.5,
            cookingMethod: "Pan-cooked",
            alternatives: ["Idli", "Dosa", "Rice pancake"]
        },
        {
            name: "puttu",
            aliases: ["kerala puttu", "steamed puttu"],
            category: "Regional",
            servingSize: "100g",
            oilContent: 1,
            saturatedFat: 0.3,
            unsaturatedFat: 0.7,
            cookingMethod: "Steamed",
            alternatives: ["Idli", "Upma", "Steamed rice"]
        },
        {
            name: "upma",
            aliases: ["rava upma", "sooji upma"],
            category: "Regional",
            servingSize: "100g",
            oilContent: 4,
            saturatedFat: 1,
            unsaturatedFat: 3,
            cookingMethod: "Cooked with oil",
            alternatives: ["Poha", "Oats upma", "Vegetable upma"]
        },
        {
            name: "poha",
            aliases: ["beaten rice", "aval", "kanda poha"],
            category: "Regional",
            servingSize: "100g",
            oilContent: 3,
            saturatedFat: 0.8,
            unsaturatedFat: 2.2,
            cookingMethod: "Cooked with oil",
            alternatives: ["Upma", "Oats", "Cornflakes"]
        },

        // Chaat & Snacks
        {
            name: "aloo tikki",
            aliases: ["potato tikki", "aloo patties"],
            category: "Chaat",
            servingSize: "100g",
            oilContent: 12,
            saturatedFat: 2.5,
            unsaturatedFat: 9.5,
            cookingMethod: "Shallow fried",
            alternatives: ["Baked aloo tikki", "Grilled vegetables", "Sprouts chaat"]
        },
        {
            name: "papdi chaat",
            aliases: ["papri chaat", "dahi papdi"],
            category: "Chaat",
            servingSize: "100g",
            oilContent: 10,
            saturatedFat: 2,
            unsaturatedFat: 8,
            cookingMethod: "Fried papdi",
            alternatives: ["Sprouts chaat", "Fruit chaat", "Corn chaat"]
        },
        {
            name: "raj kachori",
            aliases: ["raj kachori chaat"],
            category: "Chaat",
            servingSize: "100g",
            oilContent: 16,
            saturatedFat: 3,
            unsaturatedFat: 13,
            cookingMethod: "Deep fried kachori",
            alternatives: ["Sprouts chaat", "Fruit chaat", "Bhel puri"]
        },

        // Breakfast Items
        {
            name: "paratha",
            aliases: ["plain paratha", "lachha paratha"],
            category: "Breakfast",
            servingSize: "100g",
            oilContent: 10,
            saturatedFat: 2.5,
            unsaturatedFat: 7.5,
            cookingMethod: "Pan-fried with oil/ghee",
            alternatives: ["Roti", "Chapati", "Whole wheat bread"]
        },
        {
            name: "poori bhaji",
            aliases: ["puri bhaji", "aloo puri"],
            category: "Breakfast",
            servingSize: "100g",
            oilContent: 20,
            saturatedFat: 4,
            unsaturatedFat: 16,
            cookingMethod: "Deep fried puri",
            alternatives: ["Roti with sabzi", "Chapati with curry", "Idli sambhar"]
        },
        {
            name: "aloo puri",
            aliases: ["potato puri", "aloo poori"],
            category: "Breakfast",
            servingSize: "100g",
            oilContent: 22,
            saturatedFat: 4.5,
            unsaturatedFat: 17.5,
            cookingMethod: "Deep fried",
            alternatives: ["Roti with aloo", "Chapati with sabzi", "Idli"]
        },

        // Vegetable Dishes & Sides
        {
            name: "aloo fry",
            aliases: ["potato fry", "aloo bhaji", "fried potatoes"],
            category: "Vegetable Dishes",
            servingSize: "100g",
            oilContent: 10,
            saturatedFat: 2,
            unsaturatedFat: 8,
            cookingMethod: "Shallow fried",
            alternatives: ["Boiled potatoes", "Baked potatoes", "Steamed vegetables"]
        },
        {
            name: "sambar",
            aliases: ["sambhar", "south indian sambar", "dal sambar"],
            category: "Vegetable Dishes",
            servingSize: "100g",
            oilContent: 2,
            saturatedFat: 0.5,
            unsaturatedFat: 1.5,
            cookingMethod: "Cooked with minimal oil tempering",
            alternatives: ["Plain dal", "Vegetable soup", "Rasam"]
        },
        {
            name: "rasam",
            aliases: ["tomato rasam", "pepper rasam", "south indian rasam"],
            category: "Vegetable Dishes",
            servingSize: "100g",
            oilContent: 1,
            saturatedFat: 0.3,
            unsaturatedFat: 0.7,
            cookingMethod: "Tempered with minimal oil",
            alternatives: ["Clear soup", "Tomato soup", "Dal water"]
        },
        {
            name: "aloo gobi",
            aliases: ["aloo gobhi", "potato cauliflower", "aloo gobi sabzi"],
            category: "Vegetable Dishes",
            servingSize: "100g",
            oilContent: 7,
            saturatedFat: 1.5,
            unsaturatedFat: 5.5,
            cookingMethod: "Cooked with oil",
            alternatives: ["Steamed vegetables", "Grilled vegetables", "Stir-fried vegetables"]
        },
        {
            name: "bhindi fry",
            aliases: ["okra fry", "bhindi masala", "fried okra"],
            category: "Vegetable Dishes",
            servingSize: "100g",
            oilContent: 9,
            saturatedFat: 2,
            unsaturatedFat: 7,
            cookingMethod: "Shallow fried",
            alternatives: ["Steamed okra", "Grilled okra", "Bhindi curry"]
        },
        {
            name: "baingan bharta",
            aliases: ["brinjal bharta", "eggplant bharta", "baigan bharta"],
            category: "Vegetable Dishes",
            servingSize: "100g",
            oilContent: 8,
            saturatedFat: 2,
            unsaturatedFat: 6,
            cookingMethod: "Roasted and cooked with oil",
            alternatives: ["Grilled eggplant", "Steamed vegetables", "Vegetable curry"]
        },
        {
            name: "jeera aloo",
            aliases: ["cumin potatoes", "jeera potato"],
            category: "Vegetable Dishes",
            servingSize: "100g",
            oilContent: 8,
            saturatedFat: 1.5,
            unsaturatedFat: 6.5,
            cookingMethod: "Cooked with oil",
            alternatives: ["Boiled potatoes", "Steamed potatoes", "Baked potatoes"]
        },
        {
            name: "mixed vegetable curry",
            aliases: ["veg curry", "sabzi", "mixed sabzi"],
            category: "Vegetable Dishes",
            servingSize: "100g",
            oilContent: 6,
            saturatedFat: 1.5,
            unsaturatedFat: 4.5,
            cookingMethod: "Cooked with oil",
            alternatives: ["Steamed vegetables", "Grilled vegetables", "Vegetable soup"]
        },
        {
            name: "cabbage fry",
            aliases: ["cabbage sabzi", "patta gobi", "fried cabbage"],
            category: "Vegetable Dishes",
            servingSize: "100g",
            oilContent: 5,
            saturatedFat: 1,
            unsaturatedFat: 4,
            cookingMethod: "Stir-fried",
            alternatives: ["Steamed cabbage", "Cabbage salad", "Boiled cabbage"]
        },
        {
            name: "beans fry",
            aliases: ["green beans fry", "beans poriyal", "beans sabzi"],
            category: "Vegetable Dishes",
            servingSize: "100g",
            oilContent: 5,
            saturatedFat: 1,
            unsaturatedFat: 4,
            cookingMethod: "Stir-fried",
            alternatives: ["Steamed beans", "Boiled beans", "Beans salad"]
        },
        {
            name: "dal tadka",
            aliases: ["dal fry", "tadka dal", "yellow dal"],
            category: "Vegetable Dishes",
            servingSize: "100g",
            oilContent: 4,
            saturatedFat: 1,
            unsaturatedFat: 3,
            cookingMethod: "Tempered with oil",
            alternatives: ["Plain dal", "Moong dal", "Dal soup"]
        },
        {
            name: "rajma",
            aliases: ["rajma masala", "kidney beans curry", "rajma chawal"],
            category: "Vegetable Dishes",
            servingSize: "100g",
            oilContent: 5,
            saturatedFat: 1,
            unsaturatedFat: 4,
            cookingMethod: "Cooked with oil",
            alternatives: ["Boiled rajma", "Rajma salad", "Dal"]
        },
        {
            name: "chole",
            aliases: ["chana masala", "chickpea curry", "punjabi chole"],
            category: "Vegetable Dishes",
            servingSize: "100g",
            oilContent: 6,
            saturatedFat: 1.5,
            unsaturatedFat: 4.5,
            cookingMethod: "Cooked with oil",
            alternatives: ["Boiled chickpeas", "Chickpea salad", "Sprouts"]
        },
        {
            name: "matar paneer",
            aliases: ["peas paneer", "mutter paneer"],
            category: "Vegetable Dishes",
            servingSize: "100g",
            oilContent: 8,
            saturatedFat: 3,
            unsaturatedFat: 5,
            cookingMethod: "Cooked with oil",
            alternatives: ["Grilled paneer", "Steamed peas", "Tofu curry"]
        },
        {
            name: "aloo matar",
            aliases: ["potato peas", "aloo mutter"],
            category: "Vegetable Dishes",
            servingSize: "100g",
            oilContent: 6,
            saturatedFat: 1.5,
            unsaturatedFat: 4.5,
            cookingMethod: "Cooked with oil",
            alternatives: ["Boiled vegetables", "Steamed peas and potatoes", "Vegetable soup"]
        },
        {
            name: "mushroom masala",
            aliases: ["mushroom curry", "button mushroom"],
            category: "Vegetable Dishes",
            servingSize: "100g",
            oilContent: 7,
            saturatedFat: 1.5,
            unsaturatedFat: 5.5,
            cookingMethod: "Cooked with oil",
            alternatives: ["Grilled mushrooms", "Steamed mushrooms", "Mushroom soup"]
        },
        {
            name: "kadai vegetables",
            aliases: ["kadai veg", "mixed veg kadai"],
            category: "Vegetable Dishes",
            servingSize: "100g",
            oilContent: 7,
            saturatedFat: 1.5,
            unsaturatedFat: 5.5,
            cookingMethod: "Cooked with oil",
            alternatives: ["Steamed vegetables", "Grilled vegetables", "Vegetable soup"]
        }
    ]
};

// Helper function to search for food in database
export function findFood(query) {
    const searchTerm = query.toLowerCase().trim();

    // Search in packaged foods
    for (const food of foodDatabase.packaged) {
        if (food.name === searchTerm || food.aliases.some(alias => alias === searchTerm)) {
            return { ...food, type: "packaged" };
        }
    }

    // Search in unpackaged foods
    for (const food of foodDatabase.unpackaged) {
        if (food.name === searchTerm || food.aliases.some(alias => alias === searchTerm)) {
            return { ...food, type: "unpackaged" };
        }
    }

    // Partial match search
    for (const food of foodDatabase.packaged) {
        if (food.name.includes(searchTerm) || food.aliases.some(alias => alias.includes(searchTerm))) {
            return { ...food, type: "packaged" };
        }
    }

    for (const food of foodDatabase.unpackaged) {
        if (food.name.includes(searchTerm) || food.aliases.some(alias => alias.includes(searchTerm))) {
            return { ...food, type: "unpackaged" };
        }
    }

    return null;
}

// Get recommendation based on oil content
export function getRecommendation(oilContent, type) {
    if (oilContent >= 20) {
        return type === "packaged"
            ? "This packaged food has very high oil/fat content. Consider choosing baked or low-fat alternatives."
            : "This dish uses significant oil in preparation. Try baking, grilling, or air-frying instead.";
    } else if (oilContent >= 12) {
        return type === "packaged"
            ? "This packaged food has moderate to high oil/fat content. Consume in moderation."
            : "This dish uses moderate oil. Consider reducing oil quantity or using healthier cooking methods.";
    } else if (oilContent >= 6) {
        return type === "packaged"
            ? "This packaged food has moderate oil/fat content. A reasonable choice when consumed occasionally."
            : "This dish uses a moderate amount of oil. You can further reduce oil for a healthier option.";
    } else {
        return type === "packaged"
            ? "This packaged food has relatively low oil/fat content. A better choice compared to fried snacks."
            : "This dish uses minimal oil. Great choice for a healthier meal!";
    }
}
