// 🚀------------------- LOGIN FORM HANDLER -------------------🚀
document.getElementById("loginForm").addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent page refresh

  // 🔑 Capture form input values
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    // 🌐 Send login request to backend
    const response = await fetch("https://storygeneratorbackend-ytdf.onrender.com/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.message || "Login failed. Please try again.");
      return;
    }

    const { token, user } = await response.json();

    // 💾 Save authentication details in localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("userId", user.id);

    // 🚪 Redirect to homepage after login
    window.location.href = "index.html"; 

  } catch (error) {
    console.log("Login error:", error);
    alert("An error occurred during login. Please try again.");
  }
});
