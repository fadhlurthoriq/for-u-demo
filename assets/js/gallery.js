const Gallery = {
  current: 0,
  data: GalleryData,

  // Desktop slider refs
  track: null,
  prev: null,
  next: null,
  total: null,
  currentText: null,

  // Mobile polaroid track refs
  mobileTrack: null,
  svgPath: null,

  // Popup refs (shared)
  popup: null,
  popupCard: null,
  popupImage: null,
  popupVideo: null,
  popupTitle: null,
  popupDate: null,
  popupMemory: null,
  popupClose: null,
  navNext: null,
  backPrev: null,

  // Which photo was opened
  openIndex: 0,
};

Gallery.isDesktop = function () {
  return window.innerWidth > 768;
};

Gallery.init = function () {
  // Desktop slider
  this.track      = document.getElementById("gallery-track");
  this.prev       = document.getElementById("gallery-prev");
  this.next       = document.getElementById("gallery-next");
  this.total      = document.getElementById("gallery-total");
  this.currentText = document.getElementById("gallery-current");

  // Mobile polaroid
  this.mobileTrack = document.getElementById("gallery-track-mobile");
  this.svgPath     = document.getElementById("gallery-path-svg");

  // Popup (shared)
  this.popup      = document.getElementById("gallery-popup");
  this.popupCard  = document.getElementById("gallery-popup-card");
  this.popupImage = document.getElementById("gallery-popup-image");
  this.popupVideo = document.getElementById("gallery-popup-video");
  this.popupTitle = document.getElementById("gallery-popup-title");
  this.popupDate  = document.getElementById("gallery-popup-date");
  this.popupMemory = document.getElementById("gallery-popup-memory");
  this.popupClose = document.getElementById("gallery-popup-close");
  this.navNext    = document.getElementById("popup-nav-next");
  this.backPrev   = document.getElementById("popup-back-prev");

  this.renderDesktop();
  this.renderMobile();
  this.bind();
  this.updateDesktop();
};

/* ─── DESKTOP: Horizontal Slider ──────────────────────────────────────── */

Gallery.renderDesktop = function () {
  if (!this.track) return;

  let html = "";
  this.data.forEach((item, index) => {
    if (item.type === "video") {
      html += `
        <div class="gallery-item">
          <div class="gallery-video-thumb gallery-clickable" data-index="${index}">
            <img class="gallery-photo" src="${item.thumbnail}" alt="">
            <div class="gallery-play-icon">&#9654;</div>
          </div>
        </div>`;
    } else {
      html += `
        <div class="gallery-item">
          <img class="gallery-photo gallery-clickable" src="${item.image}" alt="" data-index="${index}">
        </div>`;
    }
  });

  this.track.innerHTML = html;

  if (this.total) this.total.innerHTML = this.data.length;

  this.track.querySelectorAll(".gallery-clickable").forEach((el) => {
    el.onclick = () => Gallery.openPopup(parseInt(el.dataset.index, 10));
  });
};

Gallery.updateDesktop = function () {
  if (!this.track) return;

  const width = document.querySelector(".gallery-item")?.offsetWidth || window.innerWidth;
  this.track.style.transform = `translateX(-${this.current * width}px)`;

  if (this.currentText) this.currentText.innerHTML = this.current + 1;
  if (this.prev) this.prev.disabled = this.current === 0;
  if (this.next) this.next.disabled = this.current === this.data.length - 1;
};

Gallery.goNext = function () {
  if (this.current >= this.data.length - 1) return;
  GalleryCharacter.on("next", this.current);
  this.current++;
  this.updateDesktop();
  this.save();
};

Gallery.goPrev = function () {
  if (this.current <= 0) return;
  GalleryCharacter.on("prev", this.current);
  this.current--;
  this.updateDesktop();
  this.save();
};

/* ─── MOBILE: Winding Polaroid Album ──────────────────────────────────── */

Gallery.renderMobile = function () {
  if (!this.mobileTrack) return;

  const posClasses = [
    "pos-right",
    "pos-left",
    "pos-mid-right",
    "pos-far-left",
    "pos-right-tilt",
    "pos-mid-left",
    "pos-right",
    "pos-left-tilt",
    "pos-mid-right",
    "pos-far-left",
    "pos-right",
    "pos-mid-left",
    "pos-center-right",
  ];

  let html = "";
  this.data.forEach((item, index) => {
    const story = Stories.gallery[index] || { title: `Momen ${index + 1}`, date: "", memory: "" };
    const isVideo = item.type === "video";
    const photoSrc = isVideo ? item.thumbnail : item.image;
    const posClass = posClasses[index % posClasses.length];

    html += `
      <div class="polaroid-item ${posClass}" data-index="${index}">
        <div class="polaroid-card gallery-clickable-mobile" data-index="${index}">
          <div class="polaroid-photo-frame">
            <img class="polaroid-img" src="${photoSrc}" alt="${story.title || "Kenangan"}" loading="lazy">
            ${isVideo ? '<div class="gallery-play-icon">&#9654;</div>' : ""}
          </div>
        </div>
      </div>`;
  });

  this.mobileTrack.innerHTML = html;

  this.mobileTrack.querySelectorAll(".gallery-clickable-mobile").forEach((el) => {
    el.onclick = () => Gallery.openPopup(parseInt(el.dataset.index, 10));
  });

  setTimeout(() => Gallery.drawPath(), 100);

  const imgs = this.mobileTrack.querySelectorAll(".polaroid-img");
  imgs.forEach((img) => {
    if (img.complete) {
      Gallery.drawPath();
    } else {
      img.addEventListener("load", () => Gallery.drawPath(), { once: true });
    }
  });
};

Gallery.drawPath = function () {
  const svg = this.svgPath;
  const track = this.mobileTrack;
  if (!svg || !track) return;

  const items = track.querySelectorAll(".polaroid-card");
  if (items.length < 2) return;

  const area = track.closest(".gallery-winding-area") || track;
  const areaRect = area.getBoundingClientRect();
  const width = area.offsetWidth;
  const height = area.offsetHeight;

  svg.setAttribute("width", width);
  svg.setAttribute("height", height);
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

  const points = [];
  items.forEach((item) => {
    const r = item.getBoundingClientRect();
    const x = r.left + r.width / 2 - areaRect.left;
    const y = r.top + r.height / 2 - areaRect.top;
    points.push({ x, y });
  });

  if (points.length < 2) return;

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const dy = (p1.y - p0.y) * 0.55;
    d += ` C ${p0.x} ${p0.y + dy}, ${p1.x} ${p1.y - dy}, ${p1.x} ${p1.y}`;
  }

  svg.innerHTML = `<path d="${d}" fill="none" stroke="#2b2b2b" stroke-width="1.8" stroke-dasharray="6 6" stroke-linecap="round" opacity="0.65" />`;
};

/* ─── SHARED: Popup ────────────────────────────────────────────────────── */

Gallery.get = function (index) {
  return {
    photo: GalleryData[index] || {},
    story: Stories.gallery[index] || { title: "Momen Kita", date: "", memory: "" },
  };
};

Gallery.story = function (index) {
  return Stories.gallery[index];
};

Gallery.flipToBack = function () {
  if (this.popupCard) this.popupCard.classList.add("is-flipped");
};

Gallery.flipToFront = function () {
  if (this.popupCard) this.popupCard.classList.remove("is-flipped");
};

Gallery.openPopup = function (index) {
  index = parseInt(index, 10);
  if (isNaN(index) || index < 0 || index >= this.data.length) return;

  const data = Gallery.get(index);
  this.openIndex = index;
  this.current = index;

  this.flipToFront();

  if (data.photo.type === "video") {
    this.popupImage.style.display = "none";
    this.popupVideo.style.display = "block";
    this.popupVideo.poster = data.photo.thumbnail || "";
    this.popupVideo.src = data.photo.video;
    this.popupVideo.currentTime = 0;
    this.popupVideo.play().catch(() => {});
  } else {
    if (this.popupVideo) {
      this.popupVideo.pause();
      this.popupVideo.removeAttribute("src");
      this.popupVideo.style.display = "none";
    }
    this.popupImage.style.display = "block";
    this.popupImage.src = data.photo.image;
  }

  this.popupTitle.innerHTML = data.story.title || "";
  this.popupDate.innerHTML  = data.story.date  || "";
  this.popupMemory.innerHTML = data.story.memory || "";

  this.popup.classList.add("show");

  if (data.story.popup) {
    PopupCharacter.play(data.story.popup, "popup");
  }

  GalleryCharacter.on("popupOpen", index);
  Storage.update({ popup: index });
};

Gallery.closePopup = function () {
  PopupCharacter.stop({ preserveScene: true });

  if (this.popupVideo) {
    this.popupVideo.pause();
    this.popupVideo.currentTime = 0;
  }

  if (this.popup) this.popup.classList.remove("show");

  setTimeout(() => this.flipToFront(), 350);

  GalleryCharacter.on("popupClose", this.openIndex);
  Storage.update({ popup: null });

  // Trigger end card when last photo popup is closed
  if (this.openIndex === this.data.length - 1) {
    setTimeout(() => GalleryEnd.show(), 400);
  }
};

/* ─── Bind Events ──────────────────────────────────────────────────────── */

Gallery.bind = function () {
  // Desktop prev/next arrows
  if (this.prev) this.prev.onclick = () => this.goPrev();
  if (this.next) this.next.onclick = () => this.goNext();

  // Popup flip buttons
  if (this.navNext) {
    this.navNext.onclick = (e) => { e.stopPropagation(); this.flipToBack(); };
  }
  if (this.backPrev) {
    this.backPrev.onclick = (e) => { e.stopPropagation(); this.flipToFront(); };
  }

  // Close popup
  if (this.popupClose) {
    this.popupClose.onclick = (e) => { e.stopPropagation(); this.closePopup(); };
  }
  if (this.popup) {
    this.popup.onclick = (e) => { if (e.target === this.popup) this.closePopup(); };
  }

  // Keyboard
  document.addEventListener("keydown", (e) => {
    if (Scene.current !== "gallery-scene") return;

    if (this.popup && this.popup.classList.contains("show")) {
      if (e.key === "Escape") this.closePopup();
      else if (e.key === "ArrowRight") this.flipToBack();
      else if (e.key === "ArrowLeft")  this.flipToFront();
    } else {
      if (e.key === "ArrowRight") this.goNext();
      if (e.key === "ArrowLeft")  this.goPrev();
    }
  });
};

/* ─── Update / Save / Restore ─────────────────────────────────────────── */

Gallery.update = function () {
  this.updateDesktop();
  this.drawPath();
};

Gallery.save = function () {
  Storage.update({ galleryIndex: this.current });
};

Gallery.restore = function () {
  const save = Storage.load();
  this.current = save.galleryIndex || 0;

  document.getElementById("gallery-scene").classList.add("reveal");

  this.updateDesktop();

  if (save.popup !== null && save.popup !== undefined) {
    GalleryCharacter.pause();
    this.openPopup(save.popup);
  } else {
    GalleryCharacter.enter();
  }
};

Gallery.reset = function () {
  this.current = 0;
  this.updateDesktop();
};

window.addEventListener("resize", () => {
  Gallery.updateDesktop();
  Gallery.drawPath();
});
