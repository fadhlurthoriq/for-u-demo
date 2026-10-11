const Ending = {
    typingTimer: null,
    stage: "gift",
};

Ending.init = function () {
    this.mochiImage = document.getElementById("ending-mochi-image");
    this.mochiBubble = document.getElementById("ending-mochi-bubble");

    this.farewellWrapper = document.getElementById("ending-farewell-mochi");
    this.farewellImage = document.getElementById("ending-farewell-mochi-image");
    this.farewellBubble = document.getElementById("ending-farewell-mochi-bubble");

    this.floatingPhotos = document.getElementById("ending-floating-photos");

    this.giftStage = document.getElementById("ending-gift-stage");
    this.giftImage = document.getElementById("ending-gift-image");

    this.thanksCard = document.getElementById("ending-thanks-card");
    this.thanksText = document.getElementById("ending-thanks-text");
    this.thanksClose = document.getElementById("ending-thanks-close");

    this.qrCard = document.getElementById("ending-qr-card");
    this.qrText = document.getElementById("ending-qr-text");
    this.qrImage = document.getElementById("ending-qr-image");
    this.qrLink = document.getElementById("ending-qr-link");

    this.thanksClose.onclick = () => this.closeThanks();

    this.qrImage.src = "assets/img/ending/qr-bloopers.png";
    this.qrLink.href = "https://drive.google.com/drive/folders/1zYCazp4gv15BeHLG0e7UMbTAxdeb5-vr?usp=sharing";
};

Ending.enter = function () {
    this.stage = "gift";

    this.giftStage.style.display = "flex";
    this.giftStage.style.opacity = "1";

    this.thanksCard.classList.remove("card-show", "hide");
    this.qrCard.classList.remove("card-show");
    this.farewellWrapper.classList.remove("show");
    this.floatingPhotos.classList.remove("show");

    Overlay.hideFocus();

    this.giftImage.src = "assets/img/ending/gift-closed.png";
    this.giftImage.classList.remove("gift-pop", "gift-settle");
    this.giftImage.onclick = () => this.openGift();
};

Ending.openGift = function () {
    this.giftImage.onclick = null;

    this.giftImage.src = "assets/img/ending/gift-open.png";
    this.giftImage.classList.add("gift-pop");

    setTimeout(() => {
        this.giftImage.src = "assets/img/ending/gift-confetti.png";
        this.giftImage.classList.remove("gift-pop");
        this.giftImage.classList.add("gift-settle");
    }, 500);

    setTimeout(() => {
        this.showThanks();
    }, 1400);
};

Ending.showThanks = function () {
    this.stage = "thanks";

    this.giftStage.style.display = "none";

    Overlay.showFocus();

    this.mochiImage.src = "assets/emoji/mochi/love.png";
    this.mochiBubble.innerHTML = "";

    this.thanksCard.classList.add("card-show");

    this.typeText(
        this.thanksText,
        "Makasih ya udah nemenin aku dari dulu sampai sekarang, makasih juga buat semua rasa sayang kamu, makasih juga udah nitipin perasaan ke aku, makasih juga udah jadi orang terpenting dalam hidupku. Apapun pilihan kamu, mau pergi atau lanjut aku hargai ❤️"
    );
};

Ending.closeThanks = function () {
    Overlay.hideFocus();

    this.thanksCard.classList.remove("card-show");
    this.thanksCard.classList.add("hide");

    this.thanksCard.addEventListener("animationend", () => {
        this.thanksCard.classList.remove("hide");
        this.showQr();
    }, { once: true });
};

Ending.showQr = function () {
    this.stage = "qr";

    this.qrCard.classList.add("card-show");
    this.floatingPhotos.classList.add("show");

    this.typeText(this.qrText, "Ini ada bloopers pas aku bikin web ini, klik ya buat liat videonya 😄");

    this.farewellWrapper.classList.add("show");
    this.typeText(this.farewellBubble, "Makasih udah nemenin sampai akhir cerita ini... sampai ketemu lagi ya ❤️");
};

Ending.typeText = function (el, text, callback, speed = 30) {
    if (el._typingTimer) clearInterval(el._typingTimer);

    el.innerHTML = "";
    let i = 0;

    el._typingTimer = setInterval(() => {
        if (i < text.length) {
            el.innerHTML += text.charAt(i);
            i++;
        } else {
            clearInterval(el._typingTimer);
            if (callback) callback();
        }
    }, speed);
};