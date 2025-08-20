document.addEventListener("DOMContentLoaded", function () {
  const cake = document.querySelector(".cake");
  const candleCountDisplay = document.getElementById("candleCount");

  const letterPopup = document.createElement("div");
  letterPopup.className = "letter-popup";
  letterPopup.style.display = "none"; 
  letterPopup.innerHTML = `
    <div class="letter-content">
      <button class="close-btn">❌</button>
      <h2>Happy 20th Birthday! 🎂</h2>
      <p>
        Dearest Ellah,<br><br>
        I just want to say how eternally grateful I am to have met you. May this year's birthday a little extra special, and I am so glad that we're able to celebrate your birthday together. It means more to me than I can really put into words. Last year… well, I’d rather not dwell on it. What matters is the present moment right? and today is all about YOU.

        I pray and wish you always the very best — in your studies, in your dreams, and in every step you take moving forward future Doc. May you always find happiness, strength, and the love you deserve.

        From me to you,
        -JD
      </p>
    </div>
  `;
  document.body.appendChild(letterPopup);

  letterPopup.querySelector(".close-btn").addEventListener("click", () => {
    letterPopup.style.display = "none";
  });

  let candles = [];
  let audioContext, analyser, microphone;
  let bgMusic = new Audio("hbd.mp3");
  bgMusic.loop = true;
  bgMusic.volume = 1.0;


  document.body.addEventListener("click", () => {
    bgMusic.play().catch(err => console.log("Autoplay blocked:", err));
  }, { once: true });


  function updateCandleCount() {
    const activeCandles = candles.filter(
      (candle) => !candle.classList.contains("out")
    ).length;
    candleCountDisplay.textContent = activeCandles;
  }


  function addCandle(left, top) {
    const candle = document.createElement("div");
    candle.className = "candle";
    candle.style.left = left + "px";
    candle.style.top = top + "px";

    const flame = document.createElement("div");
    flame.className = "flame";
    candle.appendChild(flame);

    cake.appendChild(candle);
    candles.push(candle);
    updateCandleCount();
  }


  function generateCandle() {
    const cakeWidth = 250; 
    const candleX = cakeWidth / 2 - 6; 
    const candleY = -20; 
    addCandle(candleX, candleY);
  }

  
  function isBlowing() {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    let average = sum / bufferLength;

    return average > 50;
  }

  
  function blowOutCandles() {
    if (candles.length > 0 && candles.some((c) => !c.classList.contains("out"))) {
      if (isBlowing()) {
        candles.forEach((candle) => {
          if (!candle.classList.contains("out")) {
            candle.classList.add("out");
          }
        });
        updateCandleCount();

       
        if (candles.every((c) => c.classList.contains("out"))) {
          setTimeout(function () {
            triggerConfetti();
            endlessConfetti();
            bgMusic.play().catch(err => console.log("Play blocked:", err));
            letterPopup.style.display = "block"; 
            letterPopup.classList.add("show");   
          }, 200);
        }
      }
    }
  }

  
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        setInterval(blowOutCandles, 200);
      })
      .catch(function (err) {
        console.log("Unable to access microphone: " + err);
      });
  } else {
    console.log("getUserMedia not supported on your browser!");
  }

  generateCandle(); 
});


function triggerConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
}

function endlessConfetti() {
  setInterval(function () {
    confetti({
      particleCount: 200,
      spread: 90,
      origin: { y: 0 }
    });
  }, 1000);
}
