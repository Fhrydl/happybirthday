// =========================================================
// script.js — interaksi amplop, bunga berjatuhan, popup musik
// =========================================================

// ======= GANTI LAGU DI SINI =======
// 1. Siapkan file lagu kamu (format .mp3) dan taruh di folder yang sama dengan index.html
// 2. Ganti "fileName" di bawah dengan nama file lagu kamu (misal: "lagu.mp3")
// 3. Ganti title & artist sesuai keinginan
const SONG = {
  title: "One Only",
  artist: "Pamungkas",
  fileName: "oneonly.mp3", // <-- Ganti dengan nama file lagu kamu
};

document.addEventListener("DOMContentLoaded", () => {
  // terapkan pengaturan lagu dari CONFIG di atas ke tampilan & audio
  const musicTitleEl  = document.querySelector(".music-title");
  const musicArtistEl = document.querySelector(".music-artist");
  const audioEl       = document.getElementById("local-audio");

  if (musicTitleEl)  musicTitleEl.textContent  = SONG.title;
  if (musicArtistEl) musicArtistEl.textContent = SONG.artist;
  
  // Set sumber file audio lokal
  if (audioEl) {
    audioEl.src = SONG.fileName;
  }

  const envelope     = document.getElementById("envelope");
  const sceneEnvelope = document.getElementById("scene-envelope");
  const sceneLetter   = document.getElementById("scene-letter");
  const musicPopup    = document.getElementById("music-popup");
  const musicToggle   = document.getElementById("music-toggle");
  const iconPlay       = document.getElementById("icon-play");
  const iconPause      = document.getElementById("icon-pause");
  const petalLayer     = document.getElementById("petal-layer");

  let opened = false;
  let petalTimer = null;

  // ---------- buka amplop ----------
  envelope.addEventListener("click", () => {
    if (opened) return;
    opened = true;
    envelope.classList.add("open");

    // setelah animasi flap selesai, pindah ke scene surat
    setTimeout(() => {
      sceneEnvelope.style.transition = "opacity .5s ease";
      sceneEnvelope.style.opacity = "0";

      setTimeout(() => {
        sceneEnvelope.hidden = true;
        sceneLetter.hidden = false;
        musicPopup.hidden = false;

        requestAnimationFrame(() => {
          sceneLetter.style.opacity = "1";
        });

        startPetals();
        startMusic();
      }, 480);
    }, 750);
  });

  // ---------- bunga berjatuhan, berulang terus ----------
  const petalEmojis = ["🌸", "🌷", "🌺", "💮", "🌼"];

  function spawnPetal() {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.textContent = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];

    const startX = Math.random() * 100; // vw
    const drift = (Math.random() * 160 - 80) + "px";
    const duration = 6 + Math.random() * 5; // detik
    const size = 16 + Math.random() * 14;

    petal.style.left = startX + "vw";
    petal.style.setProperty("--drift", drift);
    petal.style.animationDuration = duration + "s";
    petal.style.fontSize = size + "px";

    petalLayer.appendChild(petal);

    // bersihkan setelah selesai supaya DOM tidak menumpuk
    setTimeout(() => petal.remove(), duration * 1000 + 200);
  }

  function startPetals() {
    if (petalTimer) return;
    // hujan bunga berulang terus selama halaman terbuka
    petalTimer = setInterval(spawnPetal, 350);
    // beberapa kelopak langsung muncul di awal
    for (let i = 0; i < 8; i++) {
      setTimeout(spawnPetal, i * 120);
    }
  }

  // ---------- popup musik ----------
  let playing = false;

  function startMusic() {
    playing = true;
    musicPopup.classList.add("playing");
    iconPlay.hidden = true;
    iconPause.hidden = false;
    
    // Putar lagu lokal. Browser mengizinkan ini karena user sudah klik amplop.
    if (audioEl) {
      audioEl.play().catch((error) => {
        console.log("Autoplay dicegah oleh browser:", error);
      });
    }
  }

  musicToggle.addEventListener("click", () => {
    playing = !playing;
    musicPopup.classList.toggle("playing", playing);
    iconPlay.hidden = playing;
    iconPause.hidden = !playing;

    // Kontrol putar/jeda untuk audio lokal
    if (audioEl) {
      if (playing) {
        audioEl.play();
      } else {
        audioEl.pause();
      }
    }
  });
});