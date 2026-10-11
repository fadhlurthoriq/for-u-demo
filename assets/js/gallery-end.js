const GalleryEnd = { card: null };

GalleryEnd.init = function () {
    this.card = document.getElementById("gallery-end-card");
    this.btnAgain = document.getElementById("gallery-end-again");
    this.btnContinue = document.getElementById("gallery-end-continue");

    this.btnAgain.onclick = () => this.again();
    this.btnContinue.onclick = () => this.continueJourney();
};

GalleryEnd.show = function () {
    Overlay.showFocus();
    this.card.classList.add("card-show"); // ⬅️ reuse class yang udah ada
};

GalleryEnd.hide = function (callback) {
    Overlay.hideFocus();
    this.card.classList.remove("card-show");
    this.card.classList.add("hide");

    this.card.addEventListener("animationend", () => {
        this.card.classList.remove("hide");
        if (callback) callback();
    }, { once: true });
};

GalleryEnd.again = function () {
    this.hide(() => {
        Gallery.current = 0;
        Gallery.update();
        Gallery.save();
        GalleryCharacter.playForPhoto(0, "idle"); // munculin bubble dialog index 1
    });
};

GalleryEnd.continueJourney = function () {
    this.hide(() => {
        Scene.show("letter-scene"); // scene baru, masih kosong
    });
};