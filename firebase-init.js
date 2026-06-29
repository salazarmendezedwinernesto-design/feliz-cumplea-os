/* =========================================================
   INICIALIZACIÓN DE FIREBASE
   Usa las credenciales de firebase-config.js. No necesitas
   tocar este archivo, solo FIREBASE_CONFIG en firebase-config.js.
   ========================================================= */
(function initFirebase() {
  const cfg = typeof FIREBASE_CONFIG !== "undefined" ? FIREBASE_CONFIG : null;

  if (!cfg || !cfg.apiKey || cfg.apiKey.includes("PEGA_AQUI")) {
    console.warn(
      "Firebase no está configurado todavía. Completa FIREBASE_CONFIG en " +
        "firebase-config.js siguiendo FIREBASE-SETUP.md.",
    );
    return;
  }

  try {
    firebase.initializeApp(cfg);
    window.rsvpDb = firebase.firestore();
  } catch (err) {
    console.error("No se pudo inicializar Firebase:", err);
  }
})();

