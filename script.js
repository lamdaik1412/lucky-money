const randomButton = document.getElementById("randomButton");
const resultDisplay = document.getElementById("result");
const randomDenominationsDisplay = document.getElementById(
  "randomDenominations"
);
const countdownDisplay = document.getElementById("countdown");
const canvas = document.getElementById("my-canvas");
const denominations = [1, 2, 5, 10, 20, 50, 100, 200, 500];
const weights = [0.1, 0.1, 0.1, 0.2, 0.22, 0.24, 0.26, 0.06, 0.04];
// Initialize Firebase
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDJWGGsB5DGLZs9t6L7CqJu18v8hfwVPQc",
  authDomain: "lucky-money-2a779.firebaseapp.com",
  databaseURL:
    "https://lucky-money-2a779-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "lucky-money-2a779",
  storageBucket: "lucky-money-2a779.firebasestorage.app",
  messagingSenderId: "283487085115",
  appId: "1:283487085115:web:54aaecbcc849cbd4a3f21e",
  measurementId: "G-22BWMQNXNG",
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

function weightedRandom(items, weights) {
  let totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let randomNum = Math.random() * totalWeight;
  let weightSum = 0;

  for (let i = 0; i < items.length; i++) {
    weightSum += weights[i];
    if (randomNum <= weightSum) {
      return items[i];
    }
  }
  return items[items.length - 1];
}

function showRandomDenominations(duration) {
  const startTime = performance.now();
  const interval = setInterval(() => {
    if (performance.now() - startTime > duration) {
      clearInterval(interval);
    } else {
      const randomDenomination = weightedRandom(denominations, weights);
      resultDisplay.textContent = `${randomDenomination.toLocaleString(
        "en-US"
      )}.000 VNĐ`;
    }
  }, 50);
}

function updateCountdown() {
  const tet2025 = new Date("2025-01-29T00:00:00");
  const now = new Date();
  const diff = tet2025 - now;

  if (diff > 0) {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    countdownDisplay.innerHTML = `Còn ${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây <br>là đến Tết Nguyên Đán 2025`;
  } else {
    countdownDisplay.textContent = "Chúc Mừng Năm Mới!";
  }
}
updateCountdown();
setInterval(updateCountdown, 1000);

function fireConfetti() {
  var count = 200;
  var defaults = {
    origin: { y: 0.7 },
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
      canvas: canvas,
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

randomButton.addEventListener("click", async () => {
    const userId = getUserId();
    const today = new Date().toLocaleDateString();
    const userRef = database.ref(`users/${userId}/${today}`);

    userRef.once('value', snapshot => {
        if (snapshot.exists()) {
            // User đã xem hôm nay
            resultDisplay.textContent = 'Bạn đã nhận lộc hôm nay rồi, hãy quay lại vào ngày mai nha!';
        } else {
            const randomDenomination = weightedRandom(denominations, weights);
            resultDisplay.textContent = `${randomDenomination.toLocaleString("en-US")}.000 VNĐ`;
            fireConfetti();
            userRef.set(randomDenomination);
        }
    });
});


function getUserId() {
  // Bạn có thể dùng cookie, localStorage, hoặc bất cứ cách nào để tạo userId
  // Dưới đây là cách dùng localStorage. Bạn có thể thay thế
  let userId = localStorage.getItem("userId");
  if (!userId) {
    userId =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    localStorage.setItem("userId", userId);
  }
  return userId;
}
