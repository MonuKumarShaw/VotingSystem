// Register form submit handler
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: document.getElementById("name").value.trim(),
    dob: document.getElementById("dob").value.trim(),
    voterNumber: document.getElementById("voterNumber").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    email: document.getElementById("email").value.trim(),
    address: document.getElementById("address").value.trim(),
  };

  try {
    const res = await fetch("https://votingbackened-1.onrender.com/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    document.getElementById("registerMsg").textContent = result.message;
  } catch (err) {
    document.getElementById("registerMsg").textContent = "Registration failed. Please try again.";
  }
});

// Show login form button
document.getElementById("showLoginBtn").addEventListener("click", () => {
  document.getElementById("registerSection").style.display = "none";
  document.getElementById("loginSection").style.display = "block";
});

// Variables to store logged-in user's data temporarily
let currentVoter = "";
let currentName = "";

// Login form submit handler
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const voterNumber = document.getElementById("loginVoterId").value.trim();
  const dob = document.getElementById("loginDob").value.trim();

  try {
    const res = await fetch("https://votingbackened-1.onrender.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ voterNumber, dob }),
    });

    const result = await res.json();

    if (res.status === 403) {
      alert(result.message); // "You already voted. Access denied."
      document.getElementById("loginMsg").textContent = "";
      document.getElementById("otpSection").style.display = "none";
      return; // block further login
    }

    document.getElementById("loginMsg").textContent = result.message;

    if (res.ok) {
      currentVoter = result.voterNumber || "voterNumber";
      currentName = result.name || "User";

      // Show OTP input section
      document.getElementById("otpSection").style.display = "block";
    } else {
      document.getElementById("otpSection").style.display = "none";
    }
  } catch (err) {
    document.getElementById("loginMsg").textContent = "Login failed. Please try again.";
  }
});

// OTP verify button click handler
document.getElementById("verifyOtpBtn").addEventListener("click", async () => {
  const otpInput = document.getElementById("otp");
  const otpMsg = document.getElementById("otpMsg");
  const otp = otpInput.value.trim();

  if (otp.length !== 4) {
    otpMsg.textContent = "Please enter a valid 4-digit OTP.";
    return;
  }

  try {
    const res = await fetch("https://votingbackened-1.onrender.com/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ voterNumber: currentVoter, otp }),
    });

    const result = await res.json();
    otpMsg.textContent = result.message;

    if (res.ok) {
      // Save user data in localStorage on successful OTP verification
      localStorage.setItem("userName", currentName);
      localStorage.setItem("VoterNumber", currentVoter);
      localStorage.setItem("email", result.email || "");
      localStorage.setItem("phone", result.phone || "");
      localStorage.setItem("hasVoted", "false"); // reset on login

      // Redirect to dashboard
      window.location.href = "dashboard.html";
    }
  } catch (err) {
    otpMsg.textContent = "OTP verification failed. Please try again.";
  }
});

// Show register form button on login section
document.getElementById("showRegisterBtn").addEventListener("click", () => {
  document.getElementById("loginSection").style.display = "none";
  document.getElementById("registerSection").style.display = "block";
});
