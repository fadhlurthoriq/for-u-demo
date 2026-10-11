const Gallery = {
  current: 0,

  data: GalleryData,

  track: null,

  prev: null,

  next: null,

  total: null,

  currentText: null,
};

Gallery.popup = null;

Gallery.popupImage = null;

Gallery.popupTitle = null;

Gallery.popupDate = null;

Gallery.popupMemory = null;

Gallery.popupClose = null;

Gallery.init = function () {

  this.track = document.getElementById("gallery-track");

  this.prev = document.getElementById("gallery-prev");

  this.next = document.getElementById("gallery-next");

  this.total = document.getElementById("gallery-total");

  this.currentText = document.getElementById("gallery-current");

  this.popup = document.getElementById("gallery-popup");

  this.popupImage = document.getElementById("gallery-popup-image");

  this.popupVideo = document.getElementById("gallery-popup-video");

  this.popupTitle = document.getElementById("gallery-popup-title");

  this.popupDate = document.getElementById("gallery-popup-date");

  this.popupMemory = document.getElementById("gallery-popup-memory");

  this.popupClose = document.getElementById("gallery-popup-close");

  if (!this.track) return;

  this.render();

  this.bind();

  this.update();
};

Gallery.render = function () {
  let html = "";

  this.data.forEach((item, index) => {
    if (item.type === "video") {
      html += `

        <div class="gallery-item">

            <div class="gallery-video-thumb gallery-clickable" data-index="${index}">

                <img class="gallery-photo" src="${item.thumbnail}" alt="">

                <div class="gallery-play-icon">▶</div>

            </div>

        </div>

        `;
    } else {
      html += `

        <div class="gallery-item">

            <img

                class="gallery-photo gallery-clickable"

                src="${item.image}"

                alt=""

                data-index="${index}"

            >

        </div>

        `;
    }
  });

  this.track.innerHTML = html;

  if (this.total) {
    this.total.innerHTML = this.data.length;
  }

  document.querySelectorAll(".gallery-clickable").forEach((el) => {
    el.onclick = () => {
      const index = el.dataset.index;

      Gallery.openPopup(index);
    };
  });
};

Gallery.get = function (index) {
  return {
    photo: GalleryData[index],

    story: Stories.gallery[index],
  };
};

Gallery.story = function (index) {
  return Stories.gallery[index];
};

Gallery.openPopup = function (index) {
    const data = Gallery.get(index);

    this.openIndex = index;

    if (data.photo.type === "video") {
        this.popupImage.style.display = "none";

        this.popupVideo.style.display = "block";
        this.popupVideo.poster = data.photo.thumbnail || "";
        this.popupVideo.src = data.photo.video;
        this.popupVideo.currentTime = 0;
        this.popupVideo.play().catch(() => {});
    } else {
        this.popupVideo.pause();
        this.popupVideo.removeAttribute("src");
        this.popupVideo.style.display = "none";

        this.popupImage.style.display = "block";
        this.popupImage.src = data.photo.image;
    }

    this.popupTitle.innerHTML = data.story.title;
    this.popupDate.innerHTML = data.story.date;
    this.popupMemory.innerHTML = data.story.memory;

    this.popup.classList.add("show");

    if (data.story.popup) {
        PopupCharacter.play(data.story.popup, "popup");
    }

    GalleryCharacter.on("popupOpen", index);

    Storage.update({ popup: index });
};

Gallery.closePopup = function () {
    PopupCharacter.stop({ preserveScene: true });

    this.popupVideo.pause();
    this.popupVideo.currentTime = 0;

    this.popup.classList.remove("show");

    GalleryCharacter.on("popupClose", this.openIndex);

    Storage.update({ popup: null });

    if (this.openIndex == this.data.length - 1) {
        setTimeout(() => GalleryEnd.show(), 400);
    }
};

Gallery.bind = function () {
  this.next.onclick = () => {
    this.goNext();
  };

  this.prev.onclick = () => {
    this.goPrev();
  };

  this.popupClose.onclick = () => {
    this.closePopup();
  };

  this.popup.onclick = (e) => {
    if (e.target === this.popup) {
      this.closePopup();
    }
  };

  document.addEventListener("keydown", (e) => {
    if (Scene.current !== "gallery-scene") return;

    if (e.key === "ArrowRight") {
      this.goNext();
    }

    if (e.key === "ArrowLeft") {
      this.goPrev();
    }
  });
};

Gallery.goNext = function () {
    if (this.current >= this.data.length - 1) {
        return;
    }

    GalleryCharacter.on("next", this.current);

    this.current++;

    Gallery.update();
    Gallery.save();
};

Gallery.goPrev = function () {
    if (this.current <= 0) {
        return;
    }

    GalleryCharacter.on("prev", this.current);

    this.current--;

    Gallery.update();
    this.save();
};

Gallery.update = function () {
  const width = document.querySelector(".gallery-item")?.offsetWidth || window.innerWidth;

  const offset = this.current * width;

  this.track.style.transform = `translateX(-${offset}px)`;

  if (this.currentText) {
    this.currentText.innerHTML = this.current + 1;
  }

  if (this.prev) {
    this.prev.disabled = this.current === 0;
  }

  if (this.next) {
    this.next.disabled = this.current === this.data.length - 1;
  }
};

Gallery.save = function () {
  Storage.update({
    galleryIndex: this.current,
  });
};

Gallery.restore = function () {
  const save = Storage.load();

  this.current = save.galleryIndex || 0;

  this.update();

  document.getElementById("gallery-scene").classList.add("reveal");

  if (save.popup !== null) {
    GalleryCharacter.pause();

    this.openPopup(save.popup);
  } else {
    GalleryCharacter.enter();
  }
};

Gallery.reset = function () {
  this.current = 0;

  this.update();
};

window.addEventListener(
  "resize",

  () => {
    Gallery.update();
  },
);
