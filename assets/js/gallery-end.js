const GalleryEnd = { card: null };

GalleryEnd.init = function () {
    this.card = document.getElementById("gallery-end-card");
    this.btnAgain = document.getElementById("gallery-end-again");
    this.btnContinue = document.getElementById("gallery-end-continue");

    if (this.btnAgain)    this.btnAgain.onclick    = () => this.again();
    if (this.btnContinue) this.btnContinue.onclick = () => this.continueJourney();
};

GalleryEnd.show = function () {
    Overlay.showFocus();
    this.card.classList.add("card-show");
};

GalleryEnd.hide = function (callback) {
    Overlay.hideFocus();
    this.card.classList.remove("card-show");
    this.card.classList.add("hide");

    let completed = false;
    let fallbackTimer;

    const finish = () => {
        if (completed) return;

        completed = true;
        clearTimeout(fallbackTimer);
        this.card.removeEventListener("animationend", onAnimationEnd);
        this.card.classList.remove("hide");
        if (callback) callback();
    };

    const onAnimationEnd = (event) => {
        if (event.target === this.card) finish();
    };

    this.card.addEventListener("animationend", onAnimationEnd);
    fallbackTimer = setTimeout(finish, 800);
};

GalleryEnd.again = function () {
    const doAgain = () => {
        Gallery.current = 0;
        Gallery.updateDesktop();
        Gallery.save();

        // Scroll mobile winding area back to top
        const galleryScene = document.getElementById("gallery-scene");
        if (galleryScene) galleryScene.scrollTo({ top: 0, behavior: "smooth" });

        const timelineContainer = document.getElementById("gallery-timeline-container");
        if (timelineContainer) timelineContainer.scrollTo({ top: 0, behavior: "smooth" });

        GalleryCharacter.playForPhoto(0, "idle");
    };

    if (this.card && this.card.classList.contains("card-show")) {
        this.hide(doAgain);
    } else {
        doAgain();
    }
};

GalleryEnd.continueJourney = function () {
    if (this.card && this.card.classList.contains("card-show")) {
        this.hide(() => {
            Scene.show("letter-scene");
        });
    } else {
        Scene.show("letter-scene");
    }
};