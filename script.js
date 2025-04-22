// === LOGIN ===
function checkLogin(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");
  
    if (username === "admin" && password === "1234") {
      window.location.href = "index.html";
    } else {
      errorMessage.textContent = "Benutzername oder Passwort ist falsch.";
      errorMessage.style.color = "red";
    }
  }
  
  // === SETTINGS ===
  const settingsBtn = document.getElementById("settingsBtn");
  const dropdown = document.querySelector(".settings-dropdown");
  
  if (settingsBtn) {
    settingsBtn.addEventListener("click", () => {
      dropdown.classList.toggle("active");
    });
  }
  
  const darkModeToggle = document.getElementById("darkModeToggle");
  if (darkModeToggle) {
    darkModeToggle.addEventListener("change", () => {
      document.body.classList.toggle("dark", darkModeToggle.checked);
      localStorage.setItem("darkMode", darkModeToggle.checked);
    });
    // Beim Laden prüfen
    if (localStorage.getItem("darkMode") === "true") {
      darkModeToggle.checked = true;
      document.body.classList.add("dark");
    }
  }
  
  // === VIDEO SIZE ===
  const videoSizeSelect = document.getElementById("videoSizeSelect");
  const videoGrid = document.getElementById("videoGrid");
  
  if (videoSizeSelect && videoGrid) {
    videoSizeSelect.addEventListener("change", () => {
      if (videoSizeSelect.value === "compact") {
        videoGrid.style.gridTemplateColumns = "repeat(auto-fill, minmax(240px, 1fr))";
      } else {
        videoGrid.style.gridTemplateColumns = "repeat(auto-fill, minmax(300px, 1fr))";
      }
    });
  }
  
  // === VIDEOS VERWALTEN ===
  let videos = JSON.parse(localStorage.getItem("videos") || "[]");
  
  // Anzeige wechseln
  document.querySelectorAll("[data-view]").forEach(btn => {
    btn.addEventListener("click", () => {
      const view = btn.getAttribute("data-view");
      renderView(view);
    });
  });
  
  // Videoansichten
  function renderView(view) {
    document.getElementById("uploadForm").classList.add("hidden");
    videoGrid.innerHTML = "";
  
    if (view === "home") {
      videos.forEach(v => renderVideo(v));
    } else if (view === "favorites") {
      videos.filter(v => v.favorite).forEach(v => renderVideo(v));
    } else if (view === "watchLater") {
      videos.filter(v => v.later).forEach(v => renderVideo(v));
    } else if (view === "uploads") {
      videos.filter(v => v.uploaded).forEach(v => renderVideo(v));
    } else if (view === "upload") {
      document.getElementById("uploadForm").classList.remove("hidden");
    } else {
      videos.forEach(v => renderVideo(v));
    }
  }
  
  // Video-Karte erstellen
  function renderVideo(video) {
    const div = document.createElement("div");
    div.className = "video-item";
  
    div.innerHTML = `
      <img src="${video.thumbnail}" style="width:100%; height:180px; object-fit:cover;" />
      <p>${video.title}</p>
      <button onclick="toggleFavorite('${video.id}')">⭐ Favorit</button>
      <button onclick="toggleWatchLater('${video.id}')">⏱ Später</button>
    `;
  
    videoGrid.appendChild(div);
  }
  
  // Favorit / WatchLater toggeln
  function toggleFavorite(id) {
    videos = videos.map(v => v.id === id ? {...v, favorite: !v.favorite } : v);
    saveVideos();
    renderView("favorites");
  }
  
  function toggleWatchLater(id) {
    videos = videos.map(v => v.id === id ? {...v, later: !v.later } : v);
    saveVideos();
    renderView("watchLater");
  }
  
  // Speichern
  function saveVideos() {
    localStorage.setItem("videos", JSON.stringify(videos));
  }
  
  // === UPLOAD FORMULAR ===
  const videoForm = document.getElementById("videoUploadForm");
  if (videoForm) {
    videoForm.addEventListener("submit", e => {
      e.preventDefault();
  
      const title = document.getElementById("videoTitle").value;
      const desc = document.getElementById("videoDescription").value;
      const thumbInput = document.getElementById("thumbnailInput");
  
      const reader = new FileReader();
      reader.onload = function () {
        const thumbnail = reader.result;
        const id = Date.now().toString();
  
        videos.push({
          id,
          title,
          description: desc,
          thumbnail,
          uploaded: true,
          favorite: false,
          later: false
        });
  
        saveVideos();
        videoForm.reset();
        renderView("uploads");
      };
  
      if (thumbInput.files[0]) {
        reader.readAsDataURL(thumbInput.files[0]);
      }
    });
  }
  
  // === DRAG & DROP (funktioniert rein optisch) ===
  const dropzone = document.getElementById("dropzone");
  if (dropzone) {
    dropzone.addEventListener("click", () => {
      document.getElementById("videoFile").click();
    });
  }
  
  // Initialansicht laden
  if (window.location.pathname.includes("index.html")) {
    renderView("home");
  }
  
