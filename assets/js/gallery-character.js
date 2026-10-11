const GalleryCharacter = {
  state: "intro",

  introFinished: false,

  idleTimer: null,

  randomTimer: null,

  currentCategory: null,

  enabled: true,

  idleDelayMin: 3000,

  idleDelayMax: 8000,
};

GalleryCharacter.init = function () {
  this.enabled = true;

  this.load();
};

GalleryCharacter.playCategory = function (category) {
  if (!GalleryDialog[category]) {
    return;
  }

  PopupCharacter.play(GalleryDialog[category],"scene");
};

GalleryCharacter.random = function (category) {
  const list = GalleryDialog[category];

  if (!list) return null;

  if (list.length === 0) return null;

  return list[Math.floor(Math.random() * list.length)];
};

GalleryCharacter.randomDelay = function () {
  return Math.floor(Math.random() * (this.idleDelayMax - this.idleDelayMin)) + this.idleDelayMin;
};

GalleryCharacter.playRandom = function (category) {
  const dialog = this.random(category);

  if (!dialog) return;

  PopupCharacter.play(dialog,"scene");
};

GalleryCharacter.getPhotoDialog = function (index, category) {
    const story = Gallery.story(index);
    return story?.galleryDialog?.[category] || null;
};

GalleryCharacter.playForPhoto = function (index, category, fallbackCategory) {
    const list = this.getPhotoDialog(index, category);

    if (list && list.length) {
        const dialog = list[Math.floor(Math.random() * list.length)];
        PopupCharacter.play(dialog, "scene");
        return;
    }

    // kalau foto ini belum ada dialog custom, pakai dialog umum
    this.playRandom(fallbackCategory || category);
};

GalleryCharacter.changeState = function (state) {
  this.state = state;
};

GalleryCharacter.stop = function () {
  clearTimeout(this.idleTimer);

  clearTimeout(this.randomTimer);
};

GalleryCharacter.resume = function () {
  this.enabled = true;

  if (this.state === "idle") {
    this.scheduleIdle();
  }
};

GalleryCharacter.pause = function () {
  this.enabled = false;

  this.stop();
};

GalleryCharacter.save = function () {
  const save = Storage.load();

  save.galleryState = {
    introFinished: this.introFinished,
  };

  Storage.save(save);
};

GalleryCharacter.load = function () {
  const save = Storage.load();

  this.introFinished = save.galleryState?.introFinished ?? false;
};

GalleryCharacter.enter = function () {
  if (this.introFinished) {
    this.startIdle();
    this.playForPhoto(Gallery.current, "idle");
    return;
  }
  this.startIntro();
};

GalleryCharacter.startIntro = function () {
  this.changeState("intro");

  this.playCategory("intro");

  const wait = GalleryDialog.intro.length * 3200;

  setTimeout(() => {
    this.finishIntro();
  }, wait);
};

GalleryCharacter.finishIntro = function () {
  this.introFinished = true;

  this.save();

  this.startIdle();
};

GalleryCharacter.startIdle = function () {
  this.changeState("idle");

  this.scheduleIdle();
};

GalleryCharacter.playIdle = function () {
    if (!this.enabled) return;
    this.playForPhoto(Gallery.current, "idle");
    this.scheduleIdle();
};

GalleryCharacter.scheduleIdle = function () {
  clearTimeout(this.idleTimer);

  this.idleTimer = setTimeout(
    () => {
      this.playIdle();
    },

    this.randomDelay(),
  );
};

GalleryCharacter.on = function (event, data = null) {
    switch (event) {
        case "next": this.onNext(data); break;
        case "prev": this.onPrev(data); break;
        case "popupOpen": this.onPopupOpen(data); break;
        case "popupClose": this.onPopupClose(data); break;
    }
};

GalleryCharacter.onNext = function (index) {
    this.playForPhoto(index, "next");
};

GalleryCharacter.onPrev = function (index) {
    if (!this.enabled) return;
    this.playForPhoto(index, "prev");
};

GalleryCharacter.onPopupClose = function (index) {
    this.resume();
    this.playForPhoto(index, "close", "popupClose");
};

GalleryCharacter.onPopupOpen = function (index) {
  this.pause();
};