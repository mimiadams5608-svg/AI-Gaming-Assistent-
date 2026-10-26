
const profileAccountStatus = document.getElementById("profileAccountStatus");
const profileForm = document.getElementById("profileForm");
const profileEmail = document.getElementById("profileEmail");
const profileUsername = document.getElementById("profileUsername");
const profileName = document.getElementById("profileName");
const profilePreferences = document.getElementById("profilePreferences");
const profileSaveStatus = document.getElementById("profileSaveStatus");
const favoritesList = document.getElementById("favoritesList");
const favoritesStatus = document.getElementById("favoritesStatus");

let currentUser = null;

// Check whether the player is signed in.
async function loadProfile() {
  profileAccountStatus.textContent = "Checking your account...";

  try {
    const { data, error } = await supabaseClient.auth.getUser();

    if (error) throw error;

    if (!data.user) {
      profileAccountStatus.textContent =
        "Please log in to view your profile.";

      profileForm.hidden = true;
      favoritesList.textContent = "Log in to view your favorite games.";

      const loginLink = document.createElement("a");
      loginLink.href = "login.html";
      loginLink.textContent = "Log in";
      loginLink.className = "back-link";
      profileAccountStatus.appendChild(document.createTextNode(" "));
      profileAccountStatus.appendChild(loginLink);
      return;
    }

    currentUser = data.user;
    profileEmail.value = currentUser.email || "";
    profileUsername.value = currentUser.user_metadata?.username || "";
    profileAccountStatus.textContent = "Signed in and ready to go!";

    await loadSavedProfile();
    await loadFavorites();
  } catch (error) {
    console.error("Profile loading error:", error);
    profileAccountStatus.textContent =
      "Unable to load your profile. Please refresh and try again.";
  }
}

// Load the player's saved profile, or prepare a new one.
async function loadSavedProfile() {
  const { data, error } = await supabaseClient
    .from("profiles")
    .select("display_name, preferences")
    .eq("id", currentUser.id)
    .maybeSingle();

  if (error) throw error;

  if (data) {
    profileName.value = data.display_name || "";

    const preferences = data.preferences || {};
    profilePreferences.value = preferences.games || "";
  }
}

// Save the player's profile.
profileForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!currentUser) return;

  const displayName = profileName.value.trim();
  const gamingPreferences = profilePreferences.value.trim();

  if (!displayName) {
    profileSaveStatus.textContent = "Please enter a display name.";
    return;
  }

  const submitButton = profileForm.querySelector(
    'button[type="submit"]'
  );

  submitButton.disabled = true;
  profileSaveStatus.textContent = "Saving your profile...";

  try {
    const { error } = await supabaseClient
      .from("profiles")
      .upsert(
        {
          id: currentUser.id,
          display_name: displayName,
          preferences: { games: gamingPreferences },
          updated_at: new Date().toISOString()
        },
        { onConflict: "id" }
      );

    if (error) throw error;

    profileSaveStatus.textContent = "Profile saved successfully!";
  } catch (error) {
    console.error("Profile save error:", error);
    profileSaveStatus.textContent =
      error.message || "Unable to save your profile.";
  } finally {
    submitButton.disabled = false;
  }
});

// Load the player's saved favorite games.
async function loadFavorites() {
  favoritesList.replaceChildren();
  favoritesStatus.textContent = "Loading favorites...";

  const { data, error } = await supabaseClient
    .from("favorite_games")
    .select("id, game_title, game_data, created_at")
    .eq("user_id", currentUser.id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  if (!data || data.length === 0) {
    favoritesList.textContent =
      "You haven't saved any games yet. Find a game you love and add it to your favorites!";
    favoritesStatus.textContent = "";
    return;
  }

  data.forEach((game) => {
    const card = document.createElement("article");
    card.className = "game-card";
    card.style.marginBottom = "12px";

    const title = document.createElement("h3");
    title.textContent = game.game_title;

    const details = document.createElement("p");
    const description = game.game_data?.description || "";
    details.textContent = description;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "secondary-button";
    removeButton.textContent = "♥ Remove from Favorites";
    removeButton.style.marginTop = "10px";

    removeButton.addEventListener("click", async () => {
      removeButton.disabled = true;
      favoritesStatus.textContent = "Removing favorite...";

      try {
        const { error: deleteError } = await supabaseClient
          .from("favorite_games")
          .delete()
          .eq("id", game.id)
          .eq("user_id", currentUser.id);

        if (deleteError) throw deleteError;

        await loadFavorites();
        favoritesStatus.textContent = "Favorite removed.";
      } catch (error) {
        console.error("Remove favorite error:", error);
        favoritesStatus.textContent =
          error.message || "Unable to remove this favorite.";
        removeButton.disabled = false;
      }
    });

    card.appendChild(title);

    if (description) {
      card.appendChild(details);
    }

    card.appendChild(removeButton);
    favoritesList.appendChild(card);
  });

  favoritesStatus.textContent =
    `${data.length} favorite${data.length === 1 ? "" : "s"} saved`;
}

// Start the page.
loadProfile();
