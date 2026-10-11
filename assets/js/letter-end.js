const LetterEnd = {
  overlay: null,
  image: null,
  bubble: null,
  buttons: null,
  queue: [],
  queueIndex: 0,
};

LetterEnd.dialogQueue = [
  { emotion: "thinking", message: "udah sampai bagian terakhir suratnya nih..." },
  { emotion: "apologizing", message: "aku abis ini mau tanya tanya ke kamuu..." },
  { emotion: "thinking", message: "jawab sesuai keadaan kamu sekarang yaah..." },
  { emotion: "hopeful", message: "kamu mau lanjut ke pertanyaanku? atau mau baca-baca lagi dulu?" },
];

LetterEnd.init = function () {
  this.overlay = document.getElementById("letter-end-overlay");
  this.image = document.getElementById("letter-end-mochi-image");
  this.bubble = document.getElementById("letter-end-mochi-bubble");
  this.buttons = document.getElementById("letter-end-buttons");
  this.btnYes = document.getElementById("letter-end-yes");
  this.btnNo = document.getElementById("letter-end-no");

  this.btnYes.onclick = () => this.confirmYes();
  this.btnNo.onclick = () => this.confirmNo();
};

LetterEnd.show = function () {
  Overlay.showFocus();
  this.overlay.classList.add("show");
  this.buttons.classList.remove("show");

  this.queueIndex = 0;
  this.playNextDialog();
};

LetterEnd.hide = function (callback) {
  clearInterval(this.typingTimer);
  clearTimeout(this.queueTimer);

  Overlay.hideFocus();
  this.overlay.classList.remove("show");
  this.buttons.classList.remove("show");

  if (callback) callback();
};

LetterEnd.playNextDialog = function () {
  const dialog = this.dialogQueue[this.queueIndex];

  if (!dialog) {
    this.buttons.classList.add("show");
    return;
  }

  this.image.src = `assets/emoji/mochi/${dialog.emotion}.png`;

  this.typeText(dialog.message, () => {
    this.queueTimer = setTimeout(() => {
      this.queueIndex++;
      this.playNextDialog();
    }, 1600);
  });
};

LetterEnd.typeText = function (text, callback, speed = 30) {
  clearInterval(this.typingTimer);

  this.bubble.innerHTML = "";

  let i = 0;

  this.typingTimer = setInterval(() => {
    if (i < text.length) {
      this.bubble.innerHTML += text.charAt(i);
      i++;
    } else {
      clearInterval(this.typingTimer);
      if (callback) callback();
    }
  }, speed);
};

LetterEnd.confirmYes = function () {
  this.hide(() => {
    Scene.cinematic("question-scene");
  });
};

LetterEnd.confirmNo = function () {
  this.hide(() => {
    Letter.current = 0;
    Letter.update();
  });
};