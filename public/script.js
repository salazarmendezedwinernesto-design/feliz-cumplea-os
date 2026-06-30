/* =========================================================
   CONFIGURACIÓN — edita aquí los datos reales del evento.
   Todo lo demás del archivo lee de este objeto.
   ========================================================= */
const CONFIG = {
  quinceanera: {
    name: "Gabriela Lizbeth",
    firstName: "Gabriela",
  },
  event: {
    // Formato ISO: "AAAA-MM-DDTHH:MM:SS" (24 horas) — usado por la cuenta regresiva
    isoDate: "2026-07-12T16:30:00",
    dateDisplay: "domingo 12 de julio, 2026",
    timeDisplay: "4:30 PM",
  },
  verse: {
    text: "“Encomienda al Señor tu camino; confía en Él, y Él actuará.”",
    reference: "Salmos 37:5",
  },
  message:
    "Será un honor contar con tu presencia en este día tan especial, donde celebraremos " +
    "juntos una nueva etapa de mi vida. ¡Te espero con mucho cariño!",
  rsvp: {
    deadlineDisplay: "5 de julio, 2026",
  },
  location: {
    address: "Col. El Rosario, Calle al Arado, Casa #6, El Refugio, Ahuachapán",
    // Embed sin necesidad de API key. Cambia la dirección en la URL por la real si es distinta.
    mapEmbedSrc:
      "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3871.786657683227!2d-89.71003162490571!3d13.971300686443884!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTPCsDU4JzE2LjciTiA4OcKwNDInMjYuOCJX!5e0!3m2!1ses!2ssv!4v1782706939190!5m2!1ses!2ssv",
    mapLinkUrl:
      "https://www.google.com/maps/dir/?api=1&destination=13.971300686443884,-89.71003162490571&travelmode=driving",
  },
  // Fotos personales (ya colocadas en assets/fotos/). Cambia el texto de "caption" si quieres.
  photos: [
    { src: "assets/gaby 1.jpeg", caption: "" },
    { src: "assets/gaby 2.jpeg", caption: "" },
    { src: "assets/gaby 3.jpeg", caption: "" },
    { src: "assets/gaby 4.jpeg", caption: "" },
    { src: "assets/gaby 5.jpeg", caption: "" },
    {
      src: "assets/gaby 6.png",
      caption: "",
    },
    {
      src: "assets/gaby 7.jpeg",
      caption: "",
    },
    { src: "assets/gaby 8.jpeg", caption: "" },
  ],
  music: {
    // ID del video de YouTube que compartiste. Se reproduce embebido desde YouTube
    // (no se descarga el audio, así se respetan los derechos de la canción).
    youtubeId: "6gcglaWuy9A",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  populateContent();
  initEnvelope();
  initCountdown();
  initGallery();
  initRSVP();
  initRevealOnScroll();
});

/* =========================================================
   1. RELLENAR CONTENIDO DESDE CONFIG
   ========================================================= */
function populateContent() {
  setText("#quince-name", CONFIG.quinceanera.name);
  setText("#signature-name", CONFIG.quinceanera.firstName);

  setText("#event-date", CONFIG.event.dateDisplay);
  setText("#event-time", CONFIG.event.timeDisplay);

  setText("#verse-text", CONFIG.verse.text);
  setText("#verse-ref", `— ${CONFIG.verse.reference}`);

  setText("#invite-message", CONFIG.message);

  setText("#rsvp-deadline", CONFIG.rsvp.deadlineDisplay);

  setText("#venue-address", CONFIG.location.address);

  const mapFrame = document.getElementById("map-frame");
  if (mapFrame) mapFrame.src = CONFIG.location.mapEmbedSrc;

  const mapLink = document.getElementById("map-link");
  if (mapLink) mapLink.href = CONFIG.location.mapLinkUrl;
}

function setText(selector, value) {
  const el = document.querySelector(selector);
  if (el) el.textContent = value;
}

/* =========================================================
   2. SOBRE DE BIENVENIDA
   ========================================================= */
function initEnvelope() {
  const screen = document.getElementById("envelope-screen");
  const envelope = document.getElementById("envelope");
  const main = document.getElementById("main-content");

  const openInvitation = () => {
    if (envelope.classList.contains("open")) return;
    envelope.classList.add("open");
    playMusic();

    setTimeout(() => {
      screen.classList.add("hide");
      main.removeAttribute("aria-hidden");
      main.classList.add("visible");
    }, 550);
  };

  envelope.addEventListener("click", openInvitation);
  envelope.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openInvitation();
    }
  });
}

/* =========================================================
   3. MÚSICA DE FONDO (YouTube IFrame API)
   El video se reproduce embebido directamente desde YouTube
   (no se descarga ni redistribuye el archivo de audio).
   ========================================================= */
const musicState = {
  playing: false,
  ytPlayer: null,
  ytReady: false,
  pendingPlay: false,
};

// La API de YouTube llama a esta función global cuando termina de cargar.
window.onYouTubeIframeAPIReady = function () {
  musicState.ytPlayer = new YT.Player("yt-player", {
    height: "1",
    width: "1",
    videoId: CONFIG.music.youtubeId,
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      fs: 0,
      modestbranding: 1,
      rel: 0,
      playsinline: 1,
      loop: 1,
      playlist: CONFIG.music.youtubeId, // necesario para que el loop funcione con un solo video
    },
    events: {
      onReady: () => {
        musicState.ytReady = true;
        if (musicState.pendingPlay) {
          musicState.ytPlayer.playVideo();
        }
      },
      onStateChange: (e) => {
        // 1 = reproduciendo, 2 = en pausa, 0 = terminado
        if (e.data === 1) setMusicUI(true);
        if (e.data === 2 || e.data === 0) setMusicUI(false);
      },
    },
  });
};

function playMusic() {
  if (musicState.ytReady && musicState.ytPlayer) {
    musicState.ytPlayer.playVideo();
  } else {
    // La API todavía no cargó: se reproducirá en cuanto esté lista.
    musicState.pendingPlay = true;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("music-toggle");
  if (!btn) return;

  btn.addEventListener("click", () => {
    if (!musicState.ytReady || !musicState.ytPlayer) {
      musicState.pendingPlay = true;
      return;
    }
    if (musicState.playing) {
      musicState.ytPlayer.pauseVideo();
    } else {
      musicState.ytPlayer.playVideo();
    }
  });
});

function setMusicUI(isPlaying) {
  musicState.playing = isPlaying;
  const btn = document.getElementById("music-toggle");
  const iconNote = document.getElementById("icon-note");
  const iconPause = document.getElementById("icon-pause");
  if (!btn) return;
  btn.setAttribute("aria-pressed", String(isPlaying));
  iconNote.hidden = isPlaying;
  iconPause.hidden = !isPlaying;
}

/* =========================================================
   4. CUENTA REGRESIVA
   ========================================================= */
function initCountdown() {
  const target = new Date(CONFIG.event.isoDate).getTime();
  const daysEl = document.getElementById("cd-days");
  const hoursEl = document.getElementById("cd-hours");
  const minsEl = document.getElementById("cd-mins");
  const secsEl = document.getElementById("cd-secs");
  const doneEl = document.getElementById("countdown-done");
  const boxEl = document.getElementById("countdown");

  if (!target || isNaN(target)) return;

  function tick() {
    const diff = target - Date.now();

    if (diff <= 0) {
      clearInterval(timer);
      boxEl.hidden = true;
      doneEl.hidden = false;
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    daysEl.textContent = pad(days);
    hoursEl.textContent = pad(hours);
    minsEl.textContent = pad(mins);
    secsEl.textContent = pad(secs);
  }

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  tick();
  const timer = setInterval(tick, 1000);
}

/* =========================================================
   5. GALERÍA DE FOTOS
   ========================================================= */
function initGallery() {
  const track = document.getElementById("gallery-track");
  const dotsWrap = document.getElementById("gallery-dots");
  const prevBtn = document.getElementById("gallery-prev");
  const nextBtn = document.getElementById("gallery-next");

  if (!track) return;

  CONFIG.photos.forEach((photo, i) => {
    const card = document.createElement("figure");
    card.className = "gallery-photo";

    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = photo.caption || `Foto ${i + 1}`;
    img.loading = "lazy";

    card.appendChild(img);
    track.appendChild(card);

    const dot = document.createElement("span");
    dot.className = "dot" + (i === 0 ? " active" : "");
    dotsWrap.appendChild(dot);
  });

  const cards = Array.from(track.children);
  const dots = Array.from(dotsWrap.children);

  function scrollToCard(i) {
    const card = cards[i];
    if (!card) return;
    track.scrollTo({
      left: card.offsetLeft - (track.offsetWidth - card.offsetWidth) / 2,
      behavior: "smooth",
    });
  }

  prevBtn.addEventListener("click", () => {
    const current = getCurrentIndex();
    const target = current - 1 < 0 ? cards.length - 1 : current - 1;
    scrollToCard(target);
  });
  nextBtn.addEventListener("click", () => {
    const current = getCurrentIndex();
    const target = current + 1 >= cards.length ? 0 : current + 1;
    scrollToCard(target);
  });

  function getCurrentIndex() {
    const center = track.scrollLeft + track.offsetWidth / 2;
    let closest = 0;
    let minDist = Infinity;
    cards.forEach((card, i) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(center - cardCenter);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    return closest;
  }

  let scrollTimeout;
  track.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const active = getCurrentIndex();
      dots.forEach((d, i) => d.classList.toggle("active", i === active));
    }, 80);
  });
}

/* =========================================================
   6. FORMULARIO DE CONFIRMACIÓN (RSVP)
   Las respuestas se guardan en Firestore (Firebase) en la
   colección "rsvps". Ver FIREBASE-SETUP.md para configurarlo
   y admin.html para ver/exportar las respuestas a Excel.
   ========================================================= */
function initRSVP() {
  const form = document.getElementById("rsvp-form");
  const guestsField = document.getElementById("guests-field");
  const thanksPanel = document.getElementById("rsvp-thanks");
  const thanksName = document.getElementById("thanks-name");
  const thanksMsg = document.getElementById("thanks-msg");

  if (!form) return;

  form.addEventListener("change", (e) => {
    if (e.target.name === "attendance") {
      guestsField.style.display = e.target.value === "no" ? "none" : "flex";
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const name = (data.get("guestName") || "").toString().trim();
    const attendance = data.get("attendance");
    const guests = parseInt(data.get("guestsCount"), 10) || 0;
    const message = (data.get("message") || "").toString().trim();

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Enviando...";
    }

    sendRSVPToFirestore({
      guestName: name,
      attendance,
      guestsCount: guests,
      message,
    })
      .then(() => {
        thanksName.textContent = name || "amig@";

        if (attendance === "si") {
          thanksMsg.textContent =
            guests > 0
              ? `¡Qué alegría! Te esperamos junto con ${guests} acompañante(s) el ${CONFIG.event.dateDisplay}.`
              : `¡Qué alegría! Nos vemos el ${CONFIG.event.dateDisplay}.`;
        } else {
          thanksMsg.textContent =
            "Lamentamos que no puedas acompañarme, ¡pero te voy a tener presente! 💙";
        }

        form.hidden = true;
        thanksPanel.hidden = false;
      })
      .catch((err) => {
        console.error("RSVP: no se pudo guardar la confirmación.", err);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Enviar confirmación";
        }
        alert(
          "No se pudo enviar tu confirmación. Verifica tu conexión a internet e inténtalo de nuevo.",
        );
      });
  });
}

/**
 * Envía la respuesta del RSVP a Firestore.
 * Devuelve una promesa: se resuelve solo si el dato realmente se guardó,
 * y se rechaza si algo falla, para poder avisarle al invitado.
 */
function sendRSVPToFirestore(payload) {
  if (!window.rsvpDb) {
    return Promise.reject(
      new Error(
        "Firebase no está configurado. Revisa CONFIG.firebase en script.js y FIREBASE-SETUP.md.",
      ),
    );
  }

  return window.rsvpDb.collection("rsvps").add({
    guestName: payload.guestName,
    attendance: payload.attendance,
    guestsCount: payload.guestsCount,
    message: payload.message,
    createdAt: new Date().toISOString(),
  });
}

/* =========================================================
   7. REVELADO SUAVE AL HACER SCROLL
   ========================================================= */
function initRevealOnScroll() {
  const sections = document.querySelectorAll(".section");
  sections.forEach((s) => s.classList.add("reveal"));

  if (!("IntersectionObserver" in window)) {
    sections.forEach((s) => s.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  sections.forEach((s) => observer.observe(s));
}
