
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

const loginStatus = document.getElementById("loginStatus");
const signupStatus = document.getElementById("signupStatus");

const HOME_PAGE = "index.html";

// Log in an existing user.
if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const submitButton = loginForm.querySelector('button[type="submit"]');

    submitButton.disabled = true;
    loginStatus.textContent = "Logging you in...";

    try {
      const { error } =
        await supabaseClient.auth.signInWithPassword({
          email,
          password
        });

      if (error) throw error;

      loginStatus.textContent = "Login successful! Returning to Game Finder...";

      window.location.replace(HOME_PAGE);
    } catch (error) {
      loginStatus.textContent =
        error.message || "Unable to log in. Please try again.";
    } finally {
      submitButton.disabled = false;
    }
  });
}

// Create a new account.
if (signupForm) {
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("signupUsername").value.trim();
const email = document.getElementById("signupEmail").value.trim();
const password = document.getElementById("signupPassword").value;
const submitButton = signupForm.querySelector('button[type="submit"]');

    submitButton.disabled = true;
    signupStatus.textContent = "Creating your account...";

    try {
   const { data, error } = await supabaseClient.auth.signUp({
  email,
  password,
  options: {
    data: {
      username: username
    },
    emailRedirectTo: new URL(HOME_PAGE, window.location.href).href
  }
});

      if (error) throw error;

      if (data.session) {
        signupStatus.textContent =
          "Your account is ready! Returning to Game Finder...";

        window.location.replace(HOME_PAGE);
      } else {
        signupStatus.textContent =
          "Account created! Check your email and click the confirmation link. You'll return to Game Finder afterward.";
      }
    } catch (error) {
      signupStatus.textContent =
        error.message || "Unable to create your account. Please try again.";
    } finally {
      submitButton.disabled = false;
    }
  });
}
