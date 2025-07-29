document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const signupToggle = document.getElementById("signup-toggle");
  const loginToggle = document.getElementById("login-toggle");
  const signupForm = document.getElementById("signup-form");
  const loginForm = document.getElementById("login-form");
  const forgotPasswordLink = document.getElementById("forgot-password-link");
  const forgotPasswordModal = document.getElementById("forgot-password-modal");
  const closeBtn = document.querySelector(".close");

  // Form Toggle
  const toggleForms = (activeForm) => {
    const isSignup = activeForm === 'signup';
    signupToggle.classList.toggle("active", isSignup);
    loginToggle.classList.toggle("active", !isSignup);
    signupForm.classList.toggle("active", isSignup);
    loginForm.classList.toggle("active", !isSignup);
  };

  signupToggle.addEventListener("click", () => toggleForms('signup'));
  loginToggle.addEventListener("click", () => toggleForms('login'));

  // Handle Signup
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = {
      firstName: document.getElementById("signup-firstname").value.trim(),
      lastName: document.getElementById("signup-lastname").value.trim(),
      email: document.getElementById("signup-email").value.trim().toLowerCase(),
      password: document.getElementById("signup-password").value,
      confirmPassword: document.getElementById("signup-confirm-password").value
    };

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      document.getElementById("signup-message").textContent = "Passwords do not match";
      return;
    }

    try {
      const response = await fetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      document.getElementById("signup-message").textContent = "";
      alert("Signup successful! Please log in.");
      toggleForms('login');
      signupForm.reset();
    } catch (error) {
      document.getElementById("signup-message").textContent = error.message;
      console.error("Signup Error:", error);
    }
  });

  // Handle Login
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = {
      email: document.getElementById("login-email").value.trim().toLowerCase(),
      password: document.getElementById("login-password").value
    };

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      document.getElementById("login-message").textContent = "";
      sessionStorage.setItem('user', JSON.stringify(data.user)); // ← Correct placement
      window.location.href = "dashboard.html";
    } catch (error) {
      document.getElementById("login-message").textContent = error.message;
      console.error("Login Error:", error);
    }
  });

  // Forgot Password Flow
  forgotPasswordLink.addEventListener("click", (e) => {
    e.preventDefault();
    forgotPasswordModal.style.display = "block";
  });

  closeBtn.addEventListener("click", () => {
    forgotPasswordModal.style.display = "none";
    document.getElementById("forgot-password-form").reset();
    document.getElementById("reset-password-form").reset();
    document.getElementById("forgot-password-form").style.display = "block";
    document.getElementById("reset-password-form").style.display = "none";
  });

  // Handle OTP request
  document.getElementById("forgot-password-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("forgot-email").value.trim().toLowerCase();

    try {
      const response = await fetch("/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      document.getElementById("forgot-message").textContent = "";
      document.getElementById("forgot-password-form").style.display = "none";
      document.getElementById("reset-password-form").style.display = "block";
    } catch (error) {
      document.getElementById("forgot-message").textContent = error.message;
      console.error("OTP Error:", error);
    }
  });

  // Handle password reset
  document.getElementById("reset-password-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = {
      email: document.getElementById("forgot-email").value.trim().toLowerCase(),
      otp: document.getElementById("reset-code").value,
      newPassword: document.getElementById("new-password").value,
      confirmPassword: document.getElementById("confirm-new-password").value
    };

    if (formData.newPassword !== formData.confirmPassword) {
      document.getElementById("reset-message").textContent = "Passwords do not match";
      return;
    }

    try {
      const response = await fetch("/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Password reset failed");
      }

      alert("Password reset successfully! You can now login with your new password.");
      forgotPasswordModal.style.display = "none";
      loginForm.reset();
    } catch (error) {
      document.getElementById("reset-message").textContent = error.message;
      console.error("Reset Error:", error);
    }
  });
});