let rawgGames = [];

async function loadRawgGames() {
  try {
    const response = await fetch("/api/games");

    if (!response.ok) {
      throw new Error("Unable to load games from RAWG.");
    }

    const data = await response.json();

    rawgGames = (data.games || []).map((game) => {
      const genres = (game.genres || []).map((genre) =>
        genre.toLowerCase()
      );

      const description =
        game.description ||
        "Discover this game and see if it matches your style.";

      const gameInfo = (
        game.title + " " + description + " " + genres.join(" ")
      ).toLowerCase();

      const moods = [];
      const styles = [];

// Exploring new worlds
if (
  genres.some((genre) =>
    ["adventure", "open world", "role-playing"].includes(genre)
  )
) {
  styles.push("exploration");
}

// Following a great story
if (
  genres.some((genre) =>
    ["adventure", "role-playing", "drama"].includes(genre)
  ) ||
  /story|narrative|dialogue/.test(gameInfo)
) {
  styles.push("story");
}

// Creating and building
if (
  genres.some((genre) =>
    ["simulation", "sandbox", "building"].includes(genre)
  ) ||
  /building|crafting|create|creative/.test(gameInfo)
) {
  styles.push("creativity");
}

// Solving puzzles and challenges
if (
  genres.some((genre) =>
    ["puzzle", "strategy"].includes(genre)
  )
) {
  styles.push("challenge");
}

// Fighting and taking action
if (
  genres.some((genre) =>
    ["action", "shooter", "fighting"].includes(genre)
  )
) {
  styles.push("combat");
}


      // Estimate moods using available game information.
      if (
        genres.some((genre) =>
          ["adventure", "role-playing", "indie"].includes(genre)
        )
      ) {
        moods.push("curious");
      }

      if (
        genres.some((genre) =>
          ["action", "shooter", "fighting"].includes(genre)
        )
      ) {
        moods.push("excited");
      }

      if (
        genres.some((genre) =>
          ["casual", "puzzle", "simulation"].includes(genre)
        )
      ) {
        moods.push("relaxed");
      }

      // Estimate play styles from genres and game information.
      if (
        genres.some((genre) =>
          ["role-playing", "adventure"].includes(genre)
        )
      ) {
        styles.push("story");
      }

      if (
        genres.some((genre) =>
          ["action", "shooter", "racing"].includes(genre)
        )
      ) {
        styles.push("competitive");
      }

      if (
        genres.some((genre) =>
          ["puzzle", "strategy"].includes(genre)
        )
      ) {
        styles.push("strategic");
      }

      if (
        genres.some((genre) =>
          ["casual", "simulation", "indie"].includes(genre)
        )
      ) {
        styles.push("casual");
      }

      return {
        id: game.id,
        title: game.title,
        image: game.image,
        description,
        genres,
        moods,
        styles,
        platforms: game.platforms || [],
        symbol: "🎮"
      };
    });

    console.log(`Loaded ${rawgGames.length} games from RAWG.`);
  } catch (error) {
    console.error("Could not load RAWG games:", error.message);
  }
}

loadRawgGames();

const games = [
  {
    title: "Stardew Valley",
    symbol: "🌱",
    genres: ["cozy", "simulation", "rpg"],
    moods: ["relaxing"],
    styles: ["creativity", "exploration"],
    description:
      "Build a farm, meet interesting characters, and create a peaceful life.",
    reasons: {
      relaxing: "It offers a slower pace and a peaceful world.",
      creativity: "You can design and develop your own farm.",
      exploration: "You can explore caves, towns, and new areas."
    }
  },
  {
    title: "Minecraft",
    symbol: "⛏️",
    genres: ["adventure", "simulation", "action"],
    moods: ["relaxing", "exciting"],
    styles: ["creativity", "exploration", "combat"],
    description:
      "Explore a blocky world, build anything you imagine, and go on adventures.",
    reasons: {
      creativity: "You can build and create almost anything.",
      exploration: "There are different places to discover.",
      combat: "You can fight creatures and explore dangerous areas."
    }
  },
  {
    title: "Little Nightmares",
    symbol: "👁️",
    genres: ["horror", "adventure", "puzzle"],
    moods: ["mysterious"],
    styles: ["exploration", "challenge"],
    description:
      "Escape a strange, unsettling world filled with secrets and dangers.",
    reasons: {
      mysterious: "Its eerie atmosphere creates a spooky experience.",
      exploration: "You uncover strange places as you progress.",
      challenge: "You must solve environmental puzzles to escape."
    }
  },
  {
    title: "Rayman Legends",
    symbol: "🎨",
    genres: ["platformer", "adventure", "action"],
    moods: ["funny", "exciting"],
    styles: ["challenge", "exploration", "combat"],
    description:
      "Jump through colorful worlds filled with creative levels and playful characters.",
    reasons: {
      funny: "Its colorful presentation has a playful personality.",
      exciting: "Fast-paced levels keep the action moving.",
      challenge: "Precise jumping and timing test your skills."
    }
  },
  {
    title: "Portal 2",
    symbol: "🌀",
    genres: ["puzzle", "adventure"],
    moods: ["funny", "mysterious"],
    styles: ["challenge", "exploration"],
    description:
      "Solve clever puzzles using a portal device in a strange testing facility.",
    reasons: {
      funny: "Its story features memorable humor and dialogue.",
      mysterious: "You gradually uncover the facility's secrets.",
      challenge: "You must think creatively to solve each puzzle."
    }
  },
  {
    title: "Life is Strange",
    symbol: "📷",
    genres: ["adventure"],
    moods: ["emotional", "mysterious"],
    styles: ["story", "exploration"],
    description:
      "Experience a story-driven adventure where choices can change what happens.",
    reasons: {
      emotional: "Its character relationships and choices drive the story.",
      mysterious: "You investigate secrets surrounding the characters.",
      story: "Your decisions shape your experience of the narrative."
    }
  },
  {
    title: "The Legend of Zelda: Breath of the Wild",
    symbol: "🗡️",
    genres: ["adventure", "action", "rpg"],
    moods: ["exciting", "relaxing"],
    styles: ["exploration", "combat", "challenge"],
    description:
      "Explore a huge world, solve puzzles, and discover your own adventures.",
    reasons: {
      exploration: "The world rewards curiosity and discovery.",
      combat: "You can battle enemies using different strategies.",
      challenge: "Shrines and environmental puzzles test your thinking."
    }
  },
  {
    title: "Overcooked! 2",
    symbol: "🍳",
    genres: ["simulation", "action"],
    moods: ["funny", "exciting"],
    styles: ["challenge", "creativity"],
    description:
      "Prepare meals in chaotic kitchens where teamwork and timing matter.",
    reasons: {
      funny: "The kitchens and cooking mishaps get wonderfully chaotic.",
      exciting: "You must work quickly to finish each order.",
      challenge: "You need to manage tasks and time carefully."
    }
  }
];

const form = document.getElementById("gameForm");
const resultsSection = document.getElementById("results");
const resultsContainer = document.getElementById("gameResults");
const assistantMessage = document.getElementById("assistantMessage");
const resultIntro = document.getElementById("resultIntro");
const startOverButton = document.getElementById("startOver");


function findMatches(preferences) {
  const sourceGames = rawgGames.length > 0 ? rawgGames : games;

  const rankedGames = sourceGames.map((game) => {
    let score = 0;

    // Give points for matching genres.
    preferences.genres.forEach((genre) => {
      if ((game.genres || []).includes(genre.toLowerCase())) {
        score += 3;
      }
    });

    // Give points for matching mood when available.
    if (
      preferences.mood &&
      (game.moods || []).includes(preferences.mood)
    ) {
      score += 3;
    }

    // Give points for matching play style when available.
    if (
      preferences.playstyle &&
      (game.styles || []).includes(preferences.playstyle)
    ) {
      score += 3;
    }

    return {
      ...game,
      score
    };
  });

  // Put the highest-scoring games first.
  rankedGames.sort((a, b) => b.score - a.score);

  return rankedGames.slice(0, 3);
}


function getReason(game, preferences) {
  // RAWG games may not have custom reasons yet.
  if (!game.reasons) {
    return "This game is worth exploring based on your selected preferences.";
  }

  // Explain the match using one of the user's answers.
  if (
    game.reasons[preferences.mood] &&
    game.moods.includes(preferences.mood)
  ) {
    return game.reasons[preferences.mood];
  }

  if (game.reasons[preferences.playstyle]) {
    return game.reasons[preferences.playstyle];
  }

  return "It shares some of your gaming preferences and may be worth exploring.";
}

function displayMatches(matches, preferences) {
  resultsContainer.innerHTML = "";

  matches.forEach((game, index) => {
    const card = document.createElement("article");
    card.className = "game-card";

    const title = document.createElement("h3");
    title.textContent = game.title;

   const image = document.createElement("img");
image.className = "game-cover";
image.alt = `${game.title} cover`;
image.loading = "lazy";

if (game.image) {
  image.src = game.image;
} else {
  image.hidden = true;
}

    const matchLabel = document.createElement("p");
    matchLabel.className = "match-label";
    matchLabel.textContent =
      index === 0 ? "TOP MATCH" : "RECOMMENDED FOR YOU";

    const description = document.createElement("p");
    description.textContent = game.description;

    const reasonLabel = document.createElement("p");
    reasonLabel.textContent =
      "Why it might fit: " + getReason(game, preferences);

    card.append(image, matchLabel, title, description, reasonLabel);
    resultsContainer.appendChild(card);
  });

  resultsSection.hidden = false;

  assistantMessage.textContent =
    "I've compared your preferences with my game collection. " +
    "Here are three games to explore!";

  resultIntro.textContent =
    "Your results are ranked by how closely they match your answers.";

  resultsSection.scrollIntoView({ behavior: "smooth" });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const selectedGenres = Array.from(
    document.querySelectorAll('input[name="genre"]:checked')
  ).map((checkbox) => checkbox.value);

  const preferences = {
    genres: selectedGenres,
    mood: document.getElementById("mood").value,
    playstyle: document.getElementById("playstyle").value
  };

  const matches = findMatches(preferences);

  displayMatches(matches, preferences);
});

startOverButton.addEventListener("click", () => {
  resultsSection.hidden = true;

  assistantMessage.textContent =
    "Want to try something different? Change your answers and let's find another adventure.";

  document.getElementById("preferences").scrollIntoView({
    behavior: "smooth"
  });
});


const accountStatus = document.getElementById("accountStatus");
const logoutButton = document.getElementById("logoutButton");
const loginButton = document.getElementById("loginButton");
const signupButton = document.getElementById("signupButton");
const profileButton = document.getElementById("profileButton");

// Open the separate login page.
loginButton.addEventListener("click", () => {
  window.location.href = "login.html";
});

// Open the separate create-account page.
signupButton.addEventListener("click", () => {
  window.location.href = "signup.html";
});

//Open the profile page
profileButton.addEventListener("click", () => {
  window.location.href = "profile.html";
});

// Check whether someone is signed in.
async function updateAccountStatus() {
  try {
    const { data, error } = await supabaseClient.auth.getUser();

    if (error) {
      throw error;
    }

    if (data.user) {
      accountStatus.textContent = `Signed in as ${data.user.email}`;
      logoutButton.hidden = false;
      loginButton.hidden = true;
      signupButton.hidden = true;
      profileButton.hidden = false;  
    } else {
      accountStatus.textContent = "";
      logoutButton.hidden = true;
      loginButton.hidden = false;
      signupButton.hidden = false;
      profileButton.hidden = true;
    }
  } catch (error) {
    console.error("Unable to check account status:", error.message);
    accountStatus.textContent = "";
  }
}

// Log out and restore the account buttons.
logoutButton.addEventListener("click", async () => {
  logoutButton.disabled = true;
  accountStatus.textContent = "Logging out...";

  try {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      throw error;
    }

    logoutButton.hidden = true;
    loginButton.hidden = false;
    signupButton.hidden = false;
    accountStatus.textContent = "You have logged out.";
  } catch (error) {
    accountStatus.textContent =
      error.message || "Unable to log out. Please try again.";
  } finally {
    logoutButton.disabled = false;
  }
});

// Update the homepage when the authentication session changes.
supabaseClient.auth.onAuthStateChange(() => {
  updateAccountStatus();
});

updateAccountStatus();




