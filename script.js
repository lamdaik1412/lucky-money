const randomButton = document.getElementById('randomButton');
const resultDisplay = document.getElementById('result');
const randomDenominationsDisplay = document.getElementById('randomDenominations');
 const countdownDisplay = document.getElementById('countdown');
const apiKey = 'ab2c527a-02d5-4e27-aa08-698703c60474';
const denominations = [1, 2, 5, 10, 20, 50, 100, 200, 500];
const weights = [0.3, 0.25, 0.2, 0.1, 0.05, 0.05, 0.025, 0.015, 0.01];

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

 function findNearestDenomination(apiNumber) {
    let closest = denominations[0];
    let minDiff = Math.abs(apiNumber - closest);

    for (let i = 1; i < denominations.length; i++) {
        const diff = Math.abs(apiNumber - denominations[i]);
        if (diff < minDiff) {
            minDiff = diff;
            closest = denominations[i];
        }
    }
    return closest;
}

function showRandomDenominations(duration) {
   randomDenominationsDisplay.style.display = 'block';
   let startTime = performance.now();
   const interval = setInterval(() => {
     if (performance.now() - startTime > duration) {
       clearInterval(interval);
        randomDenominationsDisplay.style.display = 'none';
      } else {
        const randomIndex = Math.floor(Math.random() * denominations.length);
         const randomDenomination = denominations[randomIndex];
       randomDenominationsDisplay.innerHTML = `<span>${randomDenomination}</span>`;
      }
    }, 100);
}
  function updateCountdown() {
  const tet2025 = new Date('2025-01-29T00:00:00');
  const now = new Date();
  const diff = tet2025 - now;

    if (diff > 0) {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      countdownDisplay.textContent = `Còn ${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây đến Tết Nguyên Đán 2025`;
    } else {
         countdownDisplay.textContent = 'Chúc Mừng Năm Mới!';
    }
  }
  updateCountdown();
    setInterval(updateCountdown, 1000);


randomButton.addEventListener('click', async () => {
    resultDisplay.textContent = '';
    showRandomDenominations(5000);
  
    setTimeout(async () => {
        try {
            const response = await fetch('https://api.random.org/json-rpc/4/invoke', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "jsonrpc": "2.0",
                    "method": "generateIntegers",
                    "params": {
                        "apiKey": apiKey,
                        "n": 1,
                        "min": 1,
                        "max": 100
                    },
                    "id": 1
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            if (data.result && data.result.random && data.result.random.data && data.result.random.data.length > 0) {
               const apiNumber = data.result.random.data[0];
               const nearestDenomination = findNearestDenomination(apiNumber);
                  resultDisplay.textContent = `${nearestDenomination} VNĐ`;
            } else {
                throw new Error('Invalid response from API');
            }
        } catch (error) {
            console.error('Error fetching random number:', error);
            resultDisplay.textContent = 'Lỗi khi lấy lộc. Vui lòng thử lại.';
        }
      },5000);
});