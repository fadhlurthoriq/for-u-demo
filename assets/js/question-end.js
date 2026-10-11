const QuestionEnd = {
  overlay: null,
  image: null,
  bubble: null,
  queueIndex: 0,
};

QuestionEnd.dialogQueue = [
  { emotion: "thinking", message: "makasih ya udah jawab semua pertanyaannya 🥹" },
  { emotion: "love", message: "jawaban kamu bikin aku makin sayang deh." },
  { emotion: "guilty", message:"maaf yaah sayaang, aku selalu sayang kamu"},
  { emotion: "celebration", message: "yuk, ada satu hal terakhir yang mau aku kasih liat 🎉" },
];

QuestionEnd.init = function () {
  this.overlay = document.getElementById("question-end-overlay");
  this.image = document.getElementById("question-end-mochi-image");
  this.bubble = document.getElementById("question-end-mochi-bubble");
};

QuestionEnd.show = function () {
  Overlay.showFocus();
  this.overlay.classList.add("show");

  this.queueIndex = 0;
  this.playNextDialog();
};

QuestionEnd.hide = function (callback) {
  clearInterval(this.typingTimer);
  clearTimeout(this.queueTimer);

  Overlay.hideFocus();
  this.overlay.classList.remove("show");

  if (callback) callback();
};

QuestionEnd.playNextDialog = function () {
  const dialog = this.dialogQueue[this.queueIndex];

  if (!dialog) {
    this.queueTimer = setTimeout(() => {
      this.hide(() => {
        Scene.show("ending-scene");
      });
    }, 800);

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

QuestionEnd.typeText = function (text, callback, speed = 30) {
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