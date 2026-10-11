const Letter = {
  current: 0,
  data: LetterData,
  container: null,
  cards: null,
  locked: false,
  lockDuration: 650,
};

Letter.init = function () {
  this.container = document.getElementById("letter-stack");
  this.mochiWrapper = document.getElementById("letter-scene-mochi");
  this.mochiImage = document.getElementById("letter-scene-mochi-image");
  this.mochiBubble = document.getElementById("letter-scene-mochi-bubble");
  this.currentText = document.getElementById("letter-current");
  this.totalText = document.getElementById("letter-total");

  if (!this.container) return;

  this.render();
  this.bind();
};

Letter.render = function () {
  let html = "";

  this.data.forEach((card, index) => {
    const isLast = index === this.data.length - 1;

    html += `
      <div class="letter-card" data-index="${index}" style="--accent:${card.color}">
        <h2>${card.title}</h2>
        <h3>${card.subtitle}</h3>
        <p>${card.text}</p>
        ${isLast ? `<button id="letter-continue-btn">Lanjut ❤️</button>` : ""}
      </div>
    `;
  });

  this.container.innerHTML = html;
  this.cards = document.querySelectorAll(".letter-card");

  if (this.totalText) this.totalText.innerHTML = this.data.length;

  const continueBtn = document.getElementById("letter-continue-btn");

  if (continueBtn) {
    continueBtn.onclick = (e) => {
      e.stopPropagation(); // biar klik tombol gak ke-detect sebagai scroll/klik kartu
      Letter.continueToQuestion();
    };
  }
};

Letter.update = function () {
  this.applyPositions();
  this.playMochi();
};

Letter.applyPositions = function () {
  this.cards.forEach((card, index) => {
    card.classList.remove("is-active", "is-opened", "is-upcoming");

    const diff = index - this.current;

    if (diff === 0) {
      card.classList.add("is-active");
      card.style.zIndex = 100;
      card.style.transform = "translate(-50%, -50%) rotate(0deg)";
      card.style.opacity = 1;
    } else if (diff < 0) {
      const openedStep = this.current - index;
      const rotate = (openedStep % 2 === 0 ? -1 : 1) * (4 + openedStep * 2);

      card.classList.add("is-opened");
      card.style.zIndex = 50 - openedStep;
      card.style.transform = `translate(-50%, calc(-50% + ${openedStep * 22}px)) rotate(${rotate}deg)`;
      card.style.opacity = 1;
    } else {
      const upcomingStep = Math.min(diff, 3);

      card.classList.add("is-upcoming");
      card.style.zIndex = 90 - diff;
      card.style.transform = `translate(-50%, calc(-50% - ${upcomingStep * 6}px)) rotate(0deg)`;
      card.style.opacity = diff > 3 ? 0 : 1;
    }
  });

  if (this.currentText) this.currentText.innerHTML = this.current + 1;

};

Letter.playMochi = function () {
  const card = this.data[this.current];

  if (!card || !card.mochiDialog || !this.mochiImage) return;

  this.mochiImage.src = `assets/emoji/mochi/${card.mochiDialog.emotion}.png`;
  this.mochiBubble.classList.add("gallery-popup-bubble-show");
  this.mochiWrapper.classList.add("show");
  this.typeText(card.mochiDialog.message);
};

Letter.typeText = function (text, speed = 30) {
  clearInterval(this.typingTimer);

  this.mochiBubble.classList.remove("bubble-pop");
  void this.mochiBubble.offsetWidth; // trik reflow biar animasi bisa retrigger
  this.mochiBubble.classList.add("bubble-pop");

  this.mochiBubble.innerHTML = "";

  let i = 0;

  this.typingTimer = setInterval(() => {
    if (i < text.length) {
      this.mochiBubble.innerHTML += text.charAt(i);
      i++;
    } else {
      clearInterval(this.typingTimer);
    }
  }, speed);
};

Letter.showHint = function () {
  if (!this.mochiImage) return;

  this.mochiImage.src = "assets/emoji/mochi/waving.png";
  this.mochiBubble.classList.add("gallery-popup-bubble-show");
  this.mochiWrapper.classList.add("show");
  this.typeText("scroll ke bawah buat lanjut, scroll ke atas buat balik lagi");
};

Letter.next = function () {
  if (this.locked || this.current >= this.data.length - 1) return;

  this.locked = true;
  this.current++;
  this.update();

  setTimeout(() => { this.locked = false; }, this.lockDuration);
};

Letter.continueToQuestion = function () {
  LetterEnd.show();
};

Letter.prev = function () {
  if (this.locked || this.current <= 0) return;

  this.locked = true;
  this.current--;
  this.update();

  setTimeout(() => { this.locked = false; }, this.lockDuration);
};

Letter.onWheel = function (e) {
  if (Scene.current !== "letter-scene") return;

  e.preventDefault();

  if (e.deltaY > 0) this.next();
  else if (e.deltaY < 0) this.prev();
};

Letter.bind = function () {
  const scene = document.getElementById("letter-scene");

  scene.addEventListener("wheel", (e) => this.onWheel(e), { passive: false });
};

Letter.enter = function () {
  this.current = 0;
  this.applyPositions();
  this.showHint();

  if (this.mochiWrapper) this.mochiWrapper.classList.add("show");
};