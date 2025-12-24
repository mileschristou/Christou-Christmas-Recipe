import React, { useState, useEffect, useRef } from 'react';
import './AppStyles.css';

// Convert timestamp string to seconds
const timeToSeconds = (time) => {
  const parts = time.split(':').map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return parts[0] * 60 + parts[1];
};

// Recipe data - you'd expand this with all recipes
const recipes = {
  parsnips: {
    title: "Honey Glazed Parsnips",
    ingredients: [
      "2 kg Parsnips, Thickly Cut",
      "30 g Honey",
      "Oil for roasting",
      "Salt"
    ],
    steps: [
      "Place in cold salted water. Bring up to a boil. Cook until tender and starting to form a ruffled edge",
      "Strain over a colander and let them steam dry",
      "Place a bowl over the colander and shake to roughen up the edges",
      "On a tray, add enough oil to coat the bottom",
      "Lay the parsnips onto the tray and coat with a bit more oil on top",
      "Add into a 220°C oven for about 10-15 minutes until crispy",
      "Lower oven to 185°C and cook for another 15 minutes",
      "After about 30 minutes total, flip the parsnips. Lower oven to 170°C and cook for another 15-20 minutes until crispy",
      "Remove from oven, move parsnips to one side and remove some oil from the tray",
      "To glaze, drizzle with honey",
      "Place into a 200°C oven for around 5 minutes"
    ],
    segments: [
      { label: "Peeling & Chopping", start: "22:09", end: "22:43" },
      { label: "Into Water", start: "24:44", end: "24:47" },
      { label: "Finished Boiling", start: "32:00", end: "33:23" },
      { label: "Fluffing", start: "35:10", end: "36:04" },
      { label: "Tray Prep", start: "36:05", end: "38:08" },
      { label: "Into Oven", start: "44:51", end: "44:58" },
      { label: "Checking (15 min)", start: "50:41", end: "50:50" },
      { label: "Turning (30 min)", start: "55:20", end: "55:44" },
      { label: "Out of Oven", start: "59:45", end: "60:30" },
      { label: "Glazing", start: "65:44", end: "68:07" },
      { label: "Back into Oven", start: "68:08", end: "68:30" }
    ]
  },
  sprouts: {
    title: "Brussels Sprouts with Bacon & Chestnuts",
    ingredients: [
      "2 kg Brussels Sprouts, 3-4mm slices",
      "10 Rashers of Bacon, 5mm pieces",
      "40 g Chestnuts, roughly chopped",
      "5 g Parsley, chopped",
      "Oil",
      "Salt & Pepper"
    ],
    steps: [
      "Add a bit of oil and bacon into a pan over medium-high heat. Cook until fat renders and bacon begins to crisp",
      "Add in the brussels sprouts, place lid on to remove moisture. Stir every so often. Cook for around 20 minutes until soft",
      "Add salt, pepper, chestnuts, and parsley"
    ],
    segments: [
      { label: "Bacon Prep", start: "25:53", end: "26:30" },
      { label: "Preparing Sprouts", start: "56:50", end: "59:29" },
      { label: "Chestnuts & Flavouring", start: "59:30", end: "60:30" },
      { label: "Bacon in Pan", start: "63:26", end: "65:09" },
      { label: "Frying Sprouts", start: "65:10", end: "67:25" },
      { label: "Heat Up & Lid Off", start: "67:26", end: "69:25" },
      { label: "Finishing", start: "69:26", end: "70:30" }
    ]
  },
  cauliflower: {
    title: "Cauliflower Cheese",
    ingredients: [
      "1 Large Cauliflower",
      "Butter",
      "Flour",
      "Milk",
      "Cheese (strong cheddar)",
      "Salt & Pepper",
      "Mustard (optional)"
    ],
    steps: [
      "Chop cauliflower into florets",
      "Make béchamel: melt butter, add flour, cook briefly, gradually add milk",
      "Roast cauliflower in oven for 20 minutes",
      "Add cheese to béchamel",
      "Mix roasted cauliflower with cheese sauce",
      "Bake in oven for 18 minutes until golden and bubbling"
    ],
    segments: [
      { label: "Chopping Cauliflower", start: "33:24", end: "38:08" },
      { label: "Béchamel Start", start: "38:09", end: "39:00" },
      { label: "Béchamel Continued", start: "39:00", end: "40:04" },
      { label: "Into Oven to Roast", start: "40:05", end: "40:30" },
      { label: "Cheese into Béchamel", start: "44:59", end: "47:27" },
      { label: "Out of Oven (20 min)", start: "47:28", end: "48:00" },
      { label: "Mixing", start: "48:01", end: "49:00" },
      { label: "Into Oven", start: "65:33", end: "65:50" },
      { label: "Out of Oven (18 min)", start: "70:24", end: "71:00" }
    ]
  },
  carrots: {
    title: "Honey Glazed Carrots",
    ingredients: [
      "2 kg Carrots, Peeled and Cut in Half Lengthways",
      "Oil for roasting",
      "30 g Honey"
    ],
    steps: [
      "Place onto a tray cut side down. Do not overlap",
      "Add a bit of oil on top and place into a 200°C oven",
      "After 10-15 minutes, flip them over and cook for an additional 10-15 minutes",
      "To glaze, drizzle with honey",
      "Place back into oven briefly to finish"
    ],
    segments: [
      { label: "Peeling & Chopping", start: "21:32", end: "22:08" },
      { label: "Into Oven", start: "47:49", end: "48:00" },
      { label: "Checking (10 min)", start: "51:18", end: "51:24" },
      { label: "Turning (30 min)", start: "55:42", end: "55:51" },
      { label: "Glazing", start: "1:05:41", end: "1:05:43" },
      { label: "Back into Oven", start: "1:08:11", end: "1:08:15" }
    ]
  },
  potatoes: {
    title: "Triple Cooked Roast Potatoes",
    ingredients: [
      "4 kg Agria or King Edward Potatoes, Peeled",
      "350 g Neutral Oil",
      "4-5 Sprigs Rosemary",
      "5 g Thyme",
      "6 Cloves Garlic, Smashed",
      "Salt"
    ],
    steps: [
      "Cut the potatoes into even pieces",
      "Place into cold, salted water and bring them up to a boil",
      "Once the water begins to boil, stir them throughout the remainder of the cooking process",
      "Cook until just tender",
      "Drain the water and season with salt, leave for around 20 minutes to steam dry",
      "Heat oven to 220°C. Add enough oil to coat the bottom of a tray. Place tray into oven for 10-15 minutes to preheat",
      "Place a bowl overtop the strained potatoes and toss to fluff, then place onto the preheated tray",
      "In a pan, heat up oil until piping hot. Pour over the potatoes on the tray",
      "Place into a 220°C oven. Once carrots go into the oven, lower to 200°C to finish cooking",
      "Remove from oven and turn the potatoes, baste with the oil in the tray, add in aromatics",
      "Place back into the oven at 200°C",
      "When finished cooking, remove from the oven and place the tray at an angle to drain oil"
    ],
    segments: [
      { label: "Prepping & Peeling", start: "16:14", end: "19:30" },
      { label: "Into Water", start: "19:31", end: "20:40" },
      { label: "Boiling & Stirring", start: "20:41", end: "24:40" },
      { label: "Out from Boiling", start: "36:32", end: "39:59" },
      { label: "Fluffing", start: "40:36", end: "42:20" },
      { label: "Into Tray", start: "42:21", end: "44:39" },
      { label: "Into Oven", start: "44:40", end: "44:50" },
      { label: "Checking (15 min)", start: "51:25", end: "51:35" },
      { label: "Turning (55 min)", start: "1:00:11", end: "1:01:08" },
      { label: "Aromats & Out", start: "1:01:09", end: "1:04:31" },
      { label: "Back in Oven", start: "1:04:32", end: "1:07:54" },
      { label: "Final Result", start: "1:07:55", end: "1:08:15" }
    ]
  },
  pigsInBlankets: {
    title: "Pigs in Blankets",
    ingredients: [
      "20 Chipolatas",
      "Streaky Bacon",
      "Sage",
      "Honey"
    ],
    steps: [
      "With a rolling pin, roll out the bacon to flatten it a bit",
      "Place a piece of sage on the middle of the sausage",
      "Gently roll the sausages into the bacon",
      "Cut off any excess and save it for the sprouts",
      "Drizzle oil on top",
      "Place into a 220°C oven for around 20 minutes until they are crispy",
      "Before serving, drizzle with honey and place back into a 200°C oven for around 8 minutes"
    ],
    segments: [
      { label: "Rolling", start: "23:44", end: "26:01" },
      { label: "Oiling", start: "26:02", end: "26:18" },
      { label: "Into Oven", start: "1:01:23", end: "1:02:17" },
      { label: "Out of Oven (20 min)", start: "1:04:07", end: "1:04:31" },
      { label: "Glazing with Honey", start: "1:08:37", end: "1:08:45" }
    ]
  },
  gravy: {
    title: "Turkey Gravy",
    ingredients: [
      "Bones, Giblets, and Trim from Turkey",
      "2 Onions, Thickly Chopped",
      "3 Carrots, Thickly Chopped",
      "5 g Thyme",
      "10 Cloves Garlic, Smashed",
      "Any Vegetable Shavings or Trim",
      "Flour",
      "100 g Dry White Wine",
      "1 kg Chicken Wings",
      "1 Large Onion, Roughly Chopped",
      "2 Carrots, Thickly Sliced",
      "4 Litres Chicken Stock",
      "5 g Sage",
      "40 g Dijon Mustard",
      "1/2 Lemon, Juiced"
    ],
    steps: [
      "Place bones, trim, vegetables, and giblets onto a tray under the turkey crown",
      "Place into a 180°C oven until golden",
      "In a heavy bottom pan, heat oil and cook chicken wings until golden brown",
      "Add in the vegetables and trim and sweat",
      "Add chicken stock and aromatics. Let simmer",
      "When the turkey bones are out of the oven, scrape the brown bits on the bottom of the tray",
      "Place a bowl under the top side of the tray so the juices all go to one end of the pan. Add in equal parts flour into the liquid and whisk together",
      "Deglaze with white wine and scrape the bottom of the tray",
      "Add everything to the gravy base already cooking",
      "Simmer for 5-10 minutes. Pass off into a new pot when the gravy starts to thicken. Add in any resting juices from the turkey",
      "Begin to slowly reduce, skim off any imperfections",
      "Take a bit of the gravy and add it into a bowl. Mix in mustard and lemon juice. Add it back into the gravy"
    ],
    segments: [
      { label: "Mirepoix (Under Turkey)", start: "13:04", end: "13:20" },
      { label: "Chicken Wings", start: "20:56", end: "21:27" },
      { label: "Prepping Onions", start: "21:28", end: "21:31" },
      { label: "Trim into Gravy", start: "24:25", end: "24:32" },
      { label: "Stock & Trim", start: "31:02", end: "31:15" },
      { label: "Thickening & Flavouring", start: "45:42", end: "45:55" },
      { label: "Passing Off", start: "53:05", end: "53:20" },
      { label: "Skimming", start: "1:02:18", end: "1:02:30" },
      { label: "Finishing", start: "1:06:26", end: "1:06:45" }
    ]
  },
  breadSauce: {
    title: "Bread Sauce",
    ingredients: [
      "Half a Loaf Stale White Bread, Crust Removed and Cubed 1 cm",
      "2 Shallots, Thinly Sliced",
      "4 Cloves Garlic, Roughly Chopped",
      "5 g Thyme, Thickly Cut",
      "5 g Rosemary, Thickly Cut",
      "Pinch of Black Peppercorns",
      "Small Handful of Coriander Seeds",
      "2 L Whole Milk",
      "330 g Double Cream",
      "40 g Unsalted Butter",
      "Pinch of Nutmeg"
    ],
    steps: [
      "Remove crust from bread and cut into 1 cm cubes",
      "Sweat shallot then add in chopped herbs, garlic, coriander seeds, and peppercorns",
      "Add in milk and double cream. Bring up gently to a boil then remove from heat for 15-20 minutes to infuse it",
      "Place the cubed bread into a bowl and strain the milk into the bread",
      "Use a hand blender to blend together. Add in cubed butter, salt, and pepper to taste. Hand blend together",
      "Season with a pinch of nutmeg"
    ],
    segments: [
      { label: "Starting", start: "54:03", end: "55:51" },
      { label: "Bread Sauce into Pan", start: "55:52", end: "59:18" },
      { label: "Resting (10 min)", start: "59:19", end: "1:03:35" },
      { label: "Mixing", start: "1:03:36", end: "1:04:41" },
      { label: "Finishing", start: "1:04:42", end: "1:05:17" },
      { label: "Final Touches", start: "1:05:18", end: "1:05:32" }
    ]
  },
  turkey: {
    title: "Brined Turkey Crown & Stuffed Legs",
    ingredients: [
      "7 kg Turkey",
      "BRINE: 10 L Water, 500 g Salt, 6 Bay Leaves, 5 g Peppercorns, 12 Cloves Garlic (Smashed), 10 g Thyme",
      "LEG STUFFING: 400 g Sausage Meat, 1 Shallot (Finely Diced), 5 g Sage (Finely Chopped), 2 Cloves Garlic (Grated), 500 g Streaky Bacon",
      "CROWN: 40 g Unsalted Butter (Cubed)",
      "Honey for glazing"
    ],
    steps: [
      "Heat a small part of the water and dissolve the salt. Add into the rest of the cold water and add in the aromatics. Wait until water is completely cooled before adding the turkey in. Place in the fridge to brine for 24 hours",
      "The next day, remove from the brine and pat off excess moisture",
      "Remove the wing and reserve for stock. Cut up the neck",
      "Remove the leg from the crown",
      "Debone the leg: Use your finger to feel where the bone is. Use the tip of your knife to make shallow cuts along the length of the bone. Scrape the meat away. When the whole bone is exposed, cut underneath to release. Save the bone for stock",
      "Flatten the meat. Remove any excess cartilage, tendons, or sinew. Use a rolling pin to flatten and tenderize",
      "Combine sausage meat, shallot, sage, garlic. Mix with your hand",
      "Lay down foil and place a layer of streaky bacon, slightly overlapping. Lay the turkey leg on top. Place stuffing in the centre",
      "Roll the foil over to make the bacon meet in the middle. Roll up tightly and secure the ends",
      "Place into a 180°C oven. Probe after one hour. Remove turkey leg at 65°C, rest to 75°C",
      "For the crown: Gently separate the skin from the chicken by sliding your fingers under the skin",
      "Remove the wishbone: Find the V shaped bone between the breasts. Use the tip of your knife to expose and remove",
      "Place cubes of butter under the skin of the turkey crown",
      "Place onto a rack over the tray of roasting bones. Place into a 180°C oven",
      "Probe after one hour. If temperature is uneven, lower heat to 145°C for about 20 minutes",
      "Remove when internal temperature reaches 65°C, rest to 75°C. When cooler, cover with foil",
      "To reheat legs: Remove foil, drizzle oil over bacon. Place into 200°C oven for 15 minutes. Drizzle with honey and return for 8 minutes",
      "To reheat crown: Place into 195°C oven to crisp skin for 5-8 minutes",
      "Carve breast into 2 cm slices. Season with flaky salt"
    ],
    segments: [
      { label: "Intro & Timings", start: "0:00", end: "0:49" },
      { label: "Brining", start: "0:50", end: "1:28" },
      { label: "Taking Wings & Legs Off", start: "1:29", end: "2:47" },
      { label: "Removing Giblets", start: "2:48", end: "3:04" },
      { label: "Deboning Leg", start: "3:05", end: "4:22" },
      { label: "Removing Tendons", start: "4:23", end: "6:29" },
      { label: "Prepping Crown", start: "7:00", end: "8:25" },
      { label: "Making Stuffing", start: "8:53", end: "9:57" },
      { label: "Rolling Turkey Leg", start: "9:58", end: "11:38" },
      { label: "Legs into Oven", start: "11:39", end: "12:07" },
      { label: "Crown Prep", start: "12:08", end: "12:49" },
      { label: "Removing Wishbone", start: "13:47", end: "14:30" },
      { label: "Adding Butter", start: "14:31", end: "14:58" },
      { label: "Crown into Oven", start: "14:59", end: "15:10" },
      { label: "Leg Out/Temp Test", start: "37:09", end: "38:01" },
      { label: "Crown Out (1st cook)", start: "39:31", end: "41:56" },
      { label: "Resting Turkey", start: "41:57", end: "42:15" },
      { label: "Leg Back in Oven", start: "1:04:17", end: "1:08:27" },
      { label: "Legs Out to Glaze", start: "1:08:28", end: "1:08:43" },
      { label: "Crown Back in", start: "1:08:44", end: "1:10:27" },
      { label: "Final Glaze", start: "1:10:28", end: "1:10:34" },
      { label: "Crown Out (Final)", start: "1:10:35", end: "1:10:45" }
    ]
  },
  cranberrySauce: {
    title: "Cranberry Sauce",
    ingredients: [
      "150 g Caster Sugar",
      "100 g Water",
      "1 Banana Shallot, Finely Diced",
      "12 oz Cranberries",
      "3 Sprigs Thyme, Picked",
      "40 g Orange Juice",
      "Zest of 2 Oranges",
      "Orange Segments"
    ],
    steps: [
      "Add sugar, water, shallot, zest, cranberries, thyme, and orange juice into a heavy bottom pan over a medium heat",
      "Cook until cranberries burst and begin to thicken",
      "When the cranberry sauce reaches a thick texture, take off heat and add in the orange segments"
    ],
    segments: [
      { label: "Starting", start: "48:55", end: "52:37" },
      { label: "Stirring (12 min)", start: "52:38", end: "56:18" },
      { label: "Finished (16 min)", start: "56:19", end: "56:45" }
    ]
  },
  redCabbage: {
    title: "Braised Red Cabbage",
    ingredients: [
      "1 Large Head Red Cabbage, Cut 2mm Thick",
      "330 g Apple Juice",
      "150 ml Dry Red Wine",
      "5 g Ground Ginger",
      "5 g Ground Cinnamon",
      "5 g Ground Nutmeg",
      "20 g Caster Sugar",
      "1 Jar Red Currant Jelly",
      "20 g Sherry or Balsamic Vinegar",
      "25 g Caster Sugar (extra)"
    ],
    steps: [
      "Cut cabbages into quarters and remove outer layer. Cut off core. Slice 2mm thick",
      "Place Apple juice in a heavy bottom pan with the cabbage. Place over a high heat with the lid on until all of the moisture is released",
      "When the moisture is released, remove the lid to reduce the moisture",
      "Add in the wine, ground ginger, cinnamon, nutmeg, sugar, and a large pinch of salt. Mix to combine",
      "Continue to cook until all the liquid is evaporated",
      "Add in red currant jelly, vinegar, and extra sugar",
      "Before serving, place back onto heat and glaze the red cabbage and reduce the liquid"
    ],
    segments: [
      { label: "Chopping & Prepping", start: "29:14", end: "38:23" },
      { label: "Booze & Flavourings", start: "38:24", end: "51:55" },
      { label: "Finishing to Stew", start: "51:56", end: "1:07:37" },
      { label: "Reheating", start: "1:07:38", end: "1:09:58" },
      { label: "Final Finishing", start: "1:09:59", end: "1:10:20" }
    ]
  },
  shoppingList: {
    title: "Complete Shopping List",
    ingredients: [
      "7 kg Turkey",
      "500 g Salt (for brine)",
      "6 Bay Leaves",
      "5 g Peppercorns",
      "12 Cloves Garlic, Smashed",
      "10 g Thyme",
      "400 g Sausage Meat",
      "1-2 Shallots (Banana Shallot)",
      "5 g Sage",
      "500 g Streaky Bacon",
      "40 g Unsalted Butter",
      "Honey (for glazing)",
      "2 kg Parsnips",
      "2 kg Carrots",
      "4 kg Potatoes (Agria or King Edward)",
      "350 g Neutral Oil",
      "4-5 Sprigs Rosemary",
      "2 kg Brussels Sprouts",
      "10 Rashers of Bacon",
      "40 g Chestnuts",
      "5 g Parsley",
      "2 Medium Cauliflowers",
      "125 g Unsalted Butter (for béchamel)",
      "125 g Plain Flour",
      "1 L Milk",
      "200 g Mature Cheddar Cheese",
      "50 g Gruyère",
      "20 g Dijon Mustard",
      "20 g Wholegrain Mustard",
      "Pinch of Nutmeg",
      "20 Chipolatas",
      "1 kg Chicken Wings (for gravy)",
      "2-3 Onions",
      "3-4 Carrots (for mirepoix)",
      "4 Litres Chicken Stock",
      "100 g Dry White Wine",
      "1/2 Lemon",
      "Half a Loaf Stale White Bread",
      "4 Cloves Garlic (for bread sauce)",
      "2 L Whole Milk",
      "330 g Double Cream",
      "Small Handful of Coriander Seeds",
      "Pinch of Black Peppercorns",
      "150 g Caster Sugar (for cranberry)",
      "12 oz Cranberries",
      "2 Oranges (zest and segments)",
      "40 g Orange Juice",
      "1 Large Head Red Cabbage",
      "330 g Apple Juice",
      "150 ml Dry Red Wine",
      "5 g Ground Ginger",
      "5 g Ground Cinnamon",
      "1 Jar Red Currant Jelly",
      "20 g Sherry or Balsamic Vinegar",
      "Flaky Sea Salt",
      "Black Pepper"
    ],
    steps: [
      "This is your complete shopping list for the entire Christou Christmas Dinner!",
      "Print this list or save it to your phone before heading to the shops",
      "Quantities are for 8-10 people",
      "Fresh herbs: Thyme, Rosemary, Sage, Parsley, Bay Leaves",
      "Dairy: Butter, Milk, Double Cream, Cheddar, Gruyère",
      "Meat: 7kg Turkey, Sausage Meat, Bacon, Chipolatas, Chicken Wings",
      "Vegetables: Parsnips, Carrots, Potatoes, Brussels Sprouts, Cauliflower, Red Cabbage, Onions, Garlic",
      "Pantry: Flour, Stock, Wine, Honey, Mustard, Spices, Cranberries",
      "Check your cupboards first - you may already have: Salt, Pepper, Oil, Flour, Spices, Stock"
    ],
    segments: []
  }
};

const VIDEO_ID = "Ao-M_YvfhXY";

export default function RecipeVideoApp() {
  const [activeRecipe, setActiveRecipe] = useState('parsnips');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [player, setPlayer] = useState(null);
  const [playerReady, setPlayerReady] = useState(false);
  const playerRef = useRef(null);
  const checkIntervalRef = useRef(null);

  const recipe = recipes[activeRecipe];

  // Load YouTube IFrame API
  useEffect(() => {
    if (window.YT) {
      initPlayer();
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(tag, firstScript);

    window.onYouTubeIframeAPIReady = initPlayer;

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, []);

  const initPlayer = () => {
    if (playerRef.current) return;

    const newPlayer = new window.YT.Player('youtube-player', {
      height: '100%',
      width: '100%',
      videoId: VIDEO_ID,
      playerVars: {
        controls: 1,
        modestbranding: 1,
        rel: 0
      },
      events: {
        onReady: () => {
          setPlayer(newPlayer);
          setPlayerReady(true);
          playerRef.current = newPlayer;
        },
        onStateChange: (event) => {
          if (event.data === window.YT.PlayerState.PLAYING) {
            setIsPlaying(true);
          } else if (event.data === window.YT.PlayerState.PAUSED) {
            setIsPlaying(false);
          }
        }
      }
    });
  };

  // Monitor playback and auto-skip to next segment
  useEffect(() => {
    if (!player || !isPlaying || !playerReady) return;

    const checkTime = () => {
      if (!player.getCurrentTime) return;

      const currentTime = player.getCurrentTime();
      const currentSegment = recipe.segments[currentSegmentIndex];
      const endTime = timeToSeconds(currentSegment.end);

      if (currentTime >= endTime) {
        if (currentSegmentIndex < recipe.segments.length - 1) {
          // Move to next segment
          const nextIndex = currentSegmentIndex + 1;
          const nextStart = timeToSeconds(recipe.segments[nextIndex].start);
          setCurrentSegmentIndex(nextIndex);
          player.seekTo(nextStart, true);
        } else {
          // End of all segments
          player.pauseVideo();
          setIsPlaying(false);
          setCurrentSegmentIndex(0);
        }
      }
    };

    checkIntervalRef.current = setInterval(checkTime, 500);

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [player, isPlaying, currentSegmentIndex, activeRecipe, playerReady, recipe.segments]);

  const playFullRecipe = () => {
    if (!player || !playerReady) return;
    setCurrentSegmentIndex(0);
    const startTime = timeToSeconds(recipe.segments[0].start);
    player.seekTo(startTime, true);
    player.playVideo();
  };

  const playFromSegment = (index) => {
    if (!player || !playerReady) return;
    setCurrentSegmentIndex(index);
    const startTime = timeToSeconds(recipe.segments[index].start);
    player.seekTo(startTime, true);
    player.playVideo();
  };

  const switchRecipe = (recipeKey) => {
    setActiveRecipe(recipeKey);
    setCurrentSegmentIndex(0);
    setIsPlaying(false);
    if (player && playerReady) {
      player.pauseVideo();
    }
  };

  const totalTime = recipe.segments.reduce((acc, seg) => {
    return acc + (timeToSeconds(seg.end) - timeToSeconds(seg.start));
  }, 0);
  const totalMinutes = Math.round(totalTime / 60);

  return (
    <div>
      {/* Header */}
      <header className="app-header">
        <h1 className="app-title">
          🎄 Christou Christmas Dinner
        </h1>
        <p className="app-subtitle">
          Watch only the parts you need
        </p>
      </header>

      {/* Recipe Tabs */}
      <nav className="recipe-nav">
        {Object.entries(recipes).map(([key, r]) => (
          <button
            key={key}
            onClick={() => switchRecipe(key)}
            className={`recipe-button ${activeRecipe === key ? 'active' : ''}`}
          >
            {key === 'pigsInBlankets' ? 'Pigs in Blankets' :
             key === 'turkey' ? 'Turkey' :
             key === 'cranberrySauce' ? 'Cranberry Sauce' :
             key === 'redCabbage' ? 'Red Cabbage' :
             key === 'shoppingList' ? 'Shopping List' :
             r.title.split(' ').slice(-1)[0]}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {/* Left: Video */}
        <div className="video-section">
          <div className="video-container">
            <div id="youtube-player" style={{ width: '100%', height: '100%' }} />
          </div>

          {/* Play Full Recipe Button */}
          <button
            onClick={playFullRecipe}
            disabled={!playerReady}
            className="play-full-button"
          >
            ▶️ Play Full {recipe.title} (~{totalMinutes} min compiled)
          </button>

          {/* Segment List */}
          <div className="segments-container">
            <h3 className="segments-title">Video Chapters</h3>
            <div className="segments-list">
              {recipe.segments.map((seg, i) => (
                <button
                  key={i}
                  onClick={() => playFromSegment(i)}
                  className={`segment-button ${currentSegmentIndex === i && isPlaying ? 'active' : ''}`}
                >
                  <span>{seg.label}</span>
                  <span className="segment-time">{seg.start}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Recipe */}
        <div className="recipe-details">
          <h2 className="recipe-title">{recipe.title}</h2>

          <div className="recipe-card">
            <h3 className="card-title">📝 Ingredients</h3>
            <ul className="recipe-list">
              {recipe.ingredients.map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>
          </div>

          <div className="recipe-card">
            <h3 className="card-title">👨‍🍳 Method</h3>
            <ol className="method-list">
              {recipe.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
}
