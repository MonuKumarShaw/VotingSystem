// Redirect to login if no user info
if (!localStorage.getItem("userName")) {
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const userName = localStorage.getItem("userName") || "User";
  document.getElementById("welcome").textContent = `Welcome, ${userName}`;

  const hasVoted = localStorage.getItem("hasVoted") === "true";
  if (hasVoted) {
    alert("You have already voted.");
    logout(); // Immediately logout the user
    return;
  }

  updateTimer();
});

let timeLeft = 30 * 60; // 30 minutes in seconds
const timerDisplay = document.getElementById("timer");

function updateTimer() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  if (timeLeft > 0) {
    timeLeft--;
    setTimeout(updateTimer, 1000);
  } else {
    document.getElementById("voteStatus").textContent = "Voting time has ended.";
    disableVotingButtons();
  }
}

// Menu toggle dropdown
const menuBtn = document.getElementById('menuBtn');
const dropdown = document.getElementById('dropdownMenu');

menuBtn.addEventListener('click', () => {
  dropdown.classList.toggle('show');
});

window.addEventListener('click', (e) => {
  if (!menuBtn.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.classList.remove('show');
  }
});

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

// User info for profile display
const user = {
  username: localStorage.getItem("userName") || "User",
  email: localStorage.getItem("email") || "user@example.com",
  phone: localStorage.getItem("phone") || "123-456-7890"
};

const contentArea = document.getElementById("contentArea");

dropdown.addEventListener("click", (e) => {
  e.preventDefault();
  const clicked = e.target.closest("a");
  if (!clicked) return;

  const text = clicked.textContent.trim();

  if (text === "Profile") {
    contentArea.innerHTML = `
      <h2>User Profile</h2>
      <p><strong>Username:</strong> ${user.username}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Phone:</strong> ${user.phone}</p>
    `;
  } else if (text === "Settings") {
    contentArea.innerHTML = '<h2>Settings</h2><p>No settings available for now.</p>';
  } else if (text === "Logout") {
    logout();
  }
  dropdown.classList.remove("show");
});

// Voting modal and buttons
let selectedParty = "";
const modal = document.getElementById("voteModal");
const confirmText = document.getElementById("confirmText");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

function disableVotingButtons() {
  document.querySelectorAll(".voting-section button").forEach((btn) => {
    btn.disabled = true;
    btn.style.opacity = "0.6";
    btn.style.cursor = "not-allowed";
  });
}

function submitVote(partyName) {
  if (localStorage.getItem("hasVoted") === "true") {
    alert("You have already voted.");
    logout();
    return;
  }

  selectedParty = partyName;
  confirmText.textContent = `Do you really want to vote for ${partyName}?`;

  // Style buttons with hover colors
  yesBtn.style.display = "inline-block";
  noBtn.textContent = "No";
  yesBtn.style.backgroundColor = "#28a745"; // green
  noBtn.style.backgroundColor = "#dc3545"; // red

  // Add hover effect for yesBtn
  yesBtn.onmouseover = () => yesBtn.style.backgroundColor = "#218838";
  yesBtn.onmouseout = () => yesBtn.style.backgroundColor = "#28a745";

  // Add hover effect for noBtn
  noBtn.onmouseover = () => noBtn.style.backgroundColor = "#c82333";
  noBtn.onmouseout = () => noBtn.style.backgroundColor = "#dc3545";

  modal.style.display = "block";
}

// Yes button click - submit vote
yesBtn.onclick = async () => {
  const voterNumber = localStorage.getItem("VoterNumber");
  if (!voterNumber) {
    alert("Unauthorized access");
    modal.style.display = "none";
    return;
  }

  confirmText.textContent = "Thank you for voting. Jai Hind";
  yesBtn.style.display = "none";
  noBtn.textContent = "Logout";

  disableVotingButtons();
  localStorage.setItem("hasVoted", "true");
  document.getElementById("voteStatus").textContent = "You have already voted. Thank you!";

  noBtn.onclick = () => {
    logout();
  };

  try {
    await fetch("https://votingbackened-1.onrender.com/api/auth/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ voterNumber, party: selectedParty })
    });
  } catch (err) {
    console.error("Vote submission failed:", err.message);
  }
};

// No button click - close modal and reset buttons
noBtn.onclick = () => {
  modal.style.display = "none";
  yesBtn.style.display = "inline-block";
  noBtn.textContent = "No";

  // Reset button colors
  yesBtn.style.backgroundColor = "#28a745";
  noBtn.style.backgroundColor = "#dc3545";

  // Remove hover event handlers to avoid stacking
  yesBtn.onmouseover = null;
  yesBtn.onmouseout = null;
  noBtn.onmouseover = null;
  noBtn.onmouseout = null;
};

window.submitVote = submitVote;





// // Redirect to login if no user info
// if (!localStorage.getItem("userName")) {
//   window.location.href = "index.html";
// }

// document.addEventListener("DOMContentLoaded", () => {
//   const userName = localStorage.getItem("userName") || "User";
//   document.getElementById("welcome").textContent = `Welcome, ${userName}`;

//   const hasVoted = localStorage.getItem("hasVoted") === "true";
//   if (hasVoted) {
//     alert("You have already voted.");
//     logout(); // Immediately logout the user
//     return;
//   }

//   const timerDisplay = document.getElementById("timer");
//   if (timerDisplay) {
//     updateTimer(timerDisplay);
//   }
// });

// // Timer setup
// let timeLeft = 30 * 60; // 30 minutes in seconds

// function updateTimer(timerDisplay) {
//   const minutes = Math.floor(timeLeft / 60);
//   const seconds = timeLeft % 60;
//   timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

//   if (timeLeft > 0) {
//     timeLeft--;
//     setTimeout(() => updateTimer(timerDisplay), 1000);
//   } else {
//     document.getElementById("voteStatus").textContent = "Voting time has ended.";
//     disableVotingButtons();
//   }
// }

// // Menu toggle dropdown
// const menuBtn = document.getElementById('menuBtn');
// const dropdown = document.getElementById('dropdownMenu');

// menuBtn.addEventListener('click', () => {
//   dropdown.classList.toggle('show');
// });

// window.addEventListener('click', (e) => {
//   if (!menuBtn.contains(e.target) && !dropdown.contains(e.target)) {
//     dropdown.classList.remove('show');
//   }
// });

// function logout() {
//   // Clear only app related keys, keep other localStorage safe
//   localStorage.removeItem("userName");
//   localStorage.removeItem("VoterNumber");
//   localStorage.removeItem("email");
//   localStorage.removeItem("phone");
//   localStorage.removeItem("hasVoted");
//   window.location.href = "index.html";
// }

// // User info for profile display
// const user = {
//   username: localStorage.getItem("userName") || "User",
//   email: localStorage.getItem("email") || "user@example.com",
//   phone: localStorage.getItem("phone") || "123-456-7890"
// };

// const contentArea = document.getElementById("contentArea");

// dropdown.addEventListener("click", (e) => {
//   e.preventDefault();
//   const clicked = e.target.closest("a");
//   if (!clicked) return;

//   const text = clicked.textContent.trim();

//   if (text === "Profile") {
//     contentArea.innerHTML = `
//       <h2>User Profile</h2>
//       <p><strong>Username:</strong> ${user.username}</p>
//       <p><strong>Email:</strong> ${user.email}</p>
//       <p><strong>Phone:</strong> ${user.phone}</p>
//     `;
//   } else if (text === "Settings") {
//     contentArea.innerHTML = '<h2>Settings</h2><p>No settings available for now.</p>';
//   } else if (text === "Logout") {
//     if (confirm("Are you sure you want to logout?")) {
//       logout();
//     }
//   }
//   dropdown.classList.remove("show");
// });

// // Voting modal and buttons
// let selectedParty = "";
// const modal = document.getElementById("voteModal");
// const confirmText = document.getElementById("confirmText");
// const yesBtn = document.getElementById("yesBtn");
// const noBtn = document.getElementById("noBtn");

// function disableVotingButtons() {
//   document.querySelectorAll(".voting-section button").forEach((btn) => {
//     btn.disabled = true;
//     btn.style.opacity = "0.6";
//     btn.style.cursor = "not-allowed";
//   });
// }

// function submitVote(partyName) {
//   if (localStorage.getItem("hasVoted") === "true") {
//     alert("You have already voted.");
//     logout();
//     return;
//   }

//   selectedParty = partyName;
//   confirmText.textContent = `Do you really want to vote for ${partyName}?`;

//   // Style buttons with hover colors
//   yesBtn.style.display = "inline-block";
//   noBtn.textContent = "No";
//   yesBtn.style.backgroundColor = "#28a745"; // green
//   noBtn.style.backgroundColor = "#dc3545"; // red

//   // Add hover effect for yesBtn
//   yesBtn.onmouseover = () => yesBtn.style.backgroundColor = "#218838";
//   yesBtn.onmouseout = () => yesBtn.style.backgroundColor = "#28a745";

//   // Add hover effect for noBtn
//   noBtn.onmouseover = () => noBtn.style.backgroundColor = "#c82333";
//   noBtn.onmouseout = () => noBtn.style.backgroundColor = "#dc3545";

//   modal.style.display = "block";
// }

// // Yes button click - submit vote
// yesBtn.onclick = async () => {
//   const voterNumber = localStorage.getItem("VoterNumber");
//   if (!voterNumber) {
//     alert("Unauthorized access");
//     modal.style.display = "none";
//     return;
//   }

//   // Disable buttons immediately to prevent double click
//   disableVotingButtons();

//   try {
//     const res = await fetch("https://votingbackened-1.onrender.com/api/vote", {  // Changed endpoint here
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ voterNumber, party: selectedParty })
//     });

//     if (res.ok) {
//       confirmText.textContent = "Thank you for voting. Jai Hind";
//       yesBtn.style.display = "none";
//       noBtn.textContent = "Logout";
//       localStorage.setItem("hasVoted", "true");
//       document.getElementById("voteStatus").textContent = "You have already voted. Thank you!";

//       noBtn.onclick = () => {
//         logout();
//       };
//     } else {
//       const errorResult = await res.json();
//       alert(errorResult.message || "Vote submission failed. Please try again.");
//       // Re-enable voting buttons to allow retry
//       enableVotingButtons();
//       modal.style.display = "none";
//     }
//   } catch (err) {
//     console.error("Vote submission failed:", err.message);
//     alert("Vote submission failed. Please try again.");
//     enableVotingButtons();
//     modal.style.display = "none";
//   }
// };

// function enableVotingButtons() {
//   document.querySelectorAll(".voting-section button").forEach((btn) => {
//     btn.disabled = false;
//     btn.style.opacity = "1";
//     btn.style.cursor = "pointer";
//   });
// }

// // No button click - close modal and reset buttons
// noBtn.onclick = () => {
//   modal.style.display = "none";
//   yesBtn.style.display = "inline-block";
//   noBtn.textContent = "No";

//   // Reset button colors
//   yesBtn.style.backgroundColor = "#28a745";
//   noBtn.style.backgroundColor = "#dc3545";

//   // Remove hover event handlers to avoid stacking
//   yesBtn.onmouseover = null;
//   yesBtn.onmouseout = null;
//   noBtn.onmouseover = null;
//   noBtn.onmouseout = null;
// };

// window.submitVote = submitVote;
