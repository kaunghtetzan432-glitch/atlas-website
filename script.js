const screens = {
  signup: document.getElementById("signup-screen"),
  confirm: document.getElementById("confirm-screen"),
  login: document.getElementById("login-screen"),
  success: document.getElementById("success-screen")
};

const signupForm = document.getElementById("signup-form");
const confirmForm = document.getElementById("confirm-form");
const loginForm = document.getElementById("login-form");

let pendingUsername = "";
let pendingPassword = "";

function showScreen(name) {
  Object.values(screens).forEach(screen => screen.classList.add("hidden"));
  screens[name].classList.remove("hidden");
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

function getUsers() {
  return JSON.parse(localStorage.getItem("atlasUsers") || "{}");
}

function saveUsers(users) {
  localStorage.setItem("atlasUsers", JSON.stringify(users));
}

document.getElementById("show-login").addEventListener("click", () => {
  showScreen("login");
});

document.getElementById("show-signup").addEventListener("click", () => {
  showScreen("signup");
});

signupForm.addEventListener("submit", event => {
  event.preventDefault();

  pendingUsername = document.getElementById("signup-username").value.trim();
  pendingPassword = document.getElementById("signup-password").value;

  if (pendingUsername.length < 3) {
    showToast("Username must be at least 3 characters.");
    return;
  }

  if (pendingPassword.length < 6) {
    showToast("Password must be at least 6 characters.");
    return;
  }

  const users = getUsers();

  if (users[pendingUsername]) {
    showToast("That username already exists.");
    return;
  }

  document.getElementById("confirm-password").value = "";
  showScreen("confirm");
});

confirmForm.addEventListener("submit", event => {
  event.preventDefault();

  const confirmation = document.getElementById("confirm-password").value;

  if (confirmation !== pendingPassword) {
    showToast("Passwords don't match.");
    return;
  }

  const users = getUsers();

  users[pendingUsername] = {
    password: pendingPassword
  };

  saveUsers(users);
  localStorage.setItem("atlasLoggedIn", pendingUsername);

  showToast("Account created!");
  showScreen("success");
});

loginForm.addEventListener("submit", event => {
  event.preventDefault();

  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;
  const users = getUsers();

  if (!users[username] || users[username].password !== password) {
    showToast("Incorrect username or password.");
    return;
  }

  localStorage.setItem("atlasLoggedIn", username);
  showToast("Welcome back!");
  showScreen("success");
});

document.getElementById("signup-google").addEventListener("click", () => {
  showToast("Google sign-in will be connected later.");
});

document.getElementById("login-google").addEventListener("click", () => {
  showToast("Google sign-in will be connected later.");
});

document.getElementById("logout-button").addEventListener("click", () => {
  localStorage.removeItem("atlasLoggedIn");
  showScreen("login");
});

window.addEventListener("DOMContentLoaded", () => {
  const loggedIn = localStorage.getItem("atlasLoggedIn");

  if (loggedIn) {
    showScreen("success");
  } else {
    showScreen("signup");
  }
});
