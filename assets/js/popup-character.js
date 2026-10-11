const PopupCharacter = {
  image: null,

  bubble: null,

  sceneImage: null,

  sceneBubble: null,

  sceneContainer: null,

  typingTimer: null,

  timer: null,

  currentEmotion: "happy",

  queue: [],

  current: 0,

  playing: false,

  queueTimer: null,

  defaultSpeed: 28,

  activeTarget: null,
};

PopupCharacter.init = function () {
  this.image = document.getElementById("gallery-popup-mochi-image");

  this.bubble = document.getElementById("gallery-popup-mochi-bubble");

  this.sceneImage = document.getElementById("gallery-scene-mochi-image");

  this.sceneBubble = document.getElementById("gallery-scene-mochi-bubble");

  this.sceneContainer = document.getElementById("gallery-scene-mochi");

  this.hideAll();
};

PopupCharacter.getTarget = function () {
  if (this.activeTarget === "popup" && this.image && this.bubble) {
    return {
      image: this.image,

      bubble: this.bubble,
    };
  }

  if (this.activeTarget === "scene" && this.sceneImage && this.sceneBubble) {
    return {
      image: this.sceneImage,

      bubble: this.sceneBubble,

      container: this.sceneContainer,
    };
  }

  if (typeof Gallery !== "undefined" && Gallery.popup?.classList.contains("show") && this.image && this.bubble) {
    return {
      image: this.image,

      bubble: this.bubble,
    };
  }

  if (this.sceneImage && this.sceneBubble) {
    return {
      image: this.sceneImage,

      bubble: this.sceneBubble,

      container: this.sceneContainer,
    };
  }

  return {
    image: this.image,

    bubble: this.bubble,
  };
};

PopupCharacter.play = function (dialogs, target = "auto") {
  if (!dialogs) return;

  if (!Array.isArray(dialogs)) {
    dialogs = [dialogs];
  }

  this.stop();

  this.activeTarget = target;

  this.queue = [...dialogs];

  this.current = 0;

  this.playing = true;

  this.next();
};

PopupCharacter.next = function () {
  if (this.current >= this.queue.length) {
    if (this.activeTarget === "popup" && this.queue.length > 0) {
      this.current = 0;
    } else {
      this.playing = false;

      return;
    }
  }

  const dialog = this.queue[this.current];

  this.say(dialog);

  const speed = dialog.speed ?? this.defaultSpeed;

  const wait = dialog.wait ?? dialog.message.length * speed + (dialog.stay ?? 3000);

  clearTimeout(this.queueTimer);

  this.queueTimer = setTimeout(() => {
    this.current++;

    this.next();
  }, wait);
};

PopupCharacter.changeEmotion = function (emotion, target) {
  if (!emotion) return;

  this.currentEmotion = emotion;

  target?.image?.setAttribute(
    "src",

    `assets/emoji/mochi/${emotion}.png`,
  );
};

PopupCharacter.type = function (text, speed = 28, bubble) {
  clearInterval(this.typingTimer);

  if (!bubble) return;

  bubble.innerHTML = "";

  let i = 0;

  this.typingTimer = setInterval(() => {
    if (i >= text.length) {
      clearInterval(this.typingTimer);

      return;
    }

    bubble.innerHTML += text[i];

    i++;
  }, speed);
};

PopupCharacter.say = function (dialog) {
  const target = this.getTarget();

  if (!target?.bubble) return;

  target.container?.classList.add("show");

  target.image?.classList.remove("gallery-popup-face-show");
  target.image?.classList.add("gallery-popup-face-hide");

  target.bubble.classList.remove("gallery-popup-bubble-show");

  clearTimeout(this.timer);

  this.timer = setTimeout(() => {
    this.changeEmotion(dialog.emotion, target);

    target.image?.classList.remove("gallery-popup-face-hide");

    target.image?.classList.add("gallery-popup-face-show");

    this.type(dialog.message, dialog.speed || 28, target.bubble);

    target.bubble.classList.add("gallery-popup-bubble-show");
  }, 180);
};

PopupCharacter.hideAll = function () {
  this.sceneContainer?.classList.remove("show");

  this.sceneBubble?.classList.remove("gallery-popup-bubble-show");

  this.bubble?.classList.remove("gallery-popup-bubble-show");

  if (this.sceneBubble) {
    this.sceneBubble.innerHTML = "";
  }

  if (this.bubble) {
    this.bubble.innerHTML = "";
  }

  if (this.sceneImage) {
    this.sceneImage.classList.remove("gallery-popup-face-show", "gallery-popup-face-hide");
  }

  if (this.image) {
    this.image.classList.remove("gallery-popup-face-show", "gallery-popup-face-hide");
  }
};

PopupCharacter.stop = function (options = {}) {
  clearTimeout(this.queueTimer);

  clearTimeout(this.timer);

  clearInterval(this.typingTimer);

  this.queue = [];

  this.current = 0;

  this.playing = false;

  this.activeTarget = null;

  if (options.preserveScene) {
    if (this.sceneContainer) {
      this.sceneContainer.classList.add("show");
    }

    if (this.bubble) {
      this.bubble.classList.remove("gallery-popup-bubble-show");
      this.bubble.innerHTML = "";
    }

    if (this.image) {
      this.image.classList.remove("gallery-popup-face-show", "gallery-popup-face-hide");
    }

    return;
  }

  this.hideAll();
};
