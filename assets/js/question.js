const Question = {
  current: 0,
  data: QuestionData,
  answers: [],
  locked: false,
  container: null,
  progressFill: null,
  cards: null,
};

Question.init = function () {
  this.container = document.getElementById("question-stack");
  this.progressFill = document.getElementById("question-progress-fill");
  this.mochiWrapper = document.getElementById("question-scene-mochi");
  this.mochiImage = document.getElementById("question-scene-mochi-image");
  this.mochiBubble = document.getElementById("question-scene-mochi-bubble");

  if (!this.container) return;

  this.render();
};

Question.render = function () {
  let html = "";

  this.data.forEach((q, index) => {
    if (q.type === "emoji") {
      let optionsHtml = "";

      q.options.forEach((opt) => {
        optionsHtml += `
          <div class="question-emoji-btn" data-id="${opt.id}">
            <span class="emoji-icon">${opt.emoji}</span>
            <span class="emoji-tooltip">${opt.label}</span>
          </div>
        `;
      });

      html += `
        <div class="question-card" data-index="${index}" data-type="emoji">
          <div class="question-top"><h2>${q.question}</h2></div>
          <div class="question-bottom question-emoji-row">${optionsHtml}</div>
        </div>
      `;
    } else if (q.type === "yesno") {
      html += `
        <div class="question-card" data-index="${index}" data-type="yesno">
          <div class="question-top"><h2>${q.question}</h2></div>
          <div class="question-bottom question-yesno-zone">
            <button class="question-yes-btn">${q.options.yes}</button>
            <button class="question-no-btn">${q.options.no}</button>
          </div>
        </div>
      `;
    } else {
      let optionsHtml = "";

      q.options.forEach((opt) => {
        optionsHtml += `<button class="question-option">${opt}</button>`;
      });

      html += `
        <div class="question-card" data-index="${index}" data-type="choice">
          <div class="question-top"><h2>${q.question}</h2></div>
          <div class="question-bottom">${optionsHtml}</div>
        </div>
      `;
    }
  });

  this.container.innerHTML = html;
  this.cards = document.querySelectorAll(".question-card");

  this.bindCards();
};

Question.bindCards = function () {
  this.cards.forEach((card, index) => {
    const type = card.dataset.type;

    if (type === "emoji") {
      this.bindEmoji(card, index);
    } else if (type === "yesno") {
      this.bindYesNo(card, index);
    } else {
      this.bindChoice(card, index);
    }
  });
};

Question.answerAndNext = function (index, answer) {
  if (index !== this.current || this.locked) return;

  this.locked = true;

  const q = this.data[index];

  this.answers.push({
    question: q.question,
    answer: answer,
  });

  setTimeout(() => {
    this.locked = false;
    this.next();
  }, 500);
};

Question.bindChoice = function (card, index) {
  const options = card.querySelectorAll(".question-option");

  options.forEach((btn) => {
    btn.onclick = () => {
      if (index !== this.current || this.locked) return;

      options.forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");

      this.answerAndNext(index, btn.textContent);
    };
  });
};

Question.bindEmoji = function (card, index) {
  const buttons = card.querySelectorAll(".question-emoji-btn");

  buttons.forEach((btn) => {
    btn.onclick = () => {
      if (index !== this.current || this.locked) return;

      buttons.forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");

      this.answerAndNext(index, btn.dataset.id);
    };
  });
};

Question.bindYesNo = function (card, index) {
  const yesBtn = card.querySelector(".question-yes-btn");
  const noBtn = card.querySelector(".question-no-btn");
  const zone = card.querySelector(".question-yesno-zone");

  let noClicks = 0;

  const growSteps = [1, 1.15, 1.3, 1.45, 1.6];
  const shrinkSteps = [1, 0.85, 0.7, 0.55, 0.4];

  noBtn.onclick = () => {
    if (index !== this.current || this.locked) return;

    noClicks++;

    const step = Math.min(noClicks, 4);

    yesBtn.style.transform = `scale(${growSteps[step]})`;
    noBtn.style.transform = `scale(${shrinkSteps[step]})`;

    if (noClicks >= 4) {
      this.activateDodge(noBtn, zone);
    }
  };

  yesBtn.onclick = () => {
    this.answerAndNext(index, yesBtn.textContent);
  };
};

Question.activateDodge = function (btn, zone) {
  if (btn.classList.contains("dodging")) return;

  btn.classList.add("dodging");
  btn.style.pointerEvents = "none";

  const rect = btn.getBoundingClientRect();
  const zoneRect = zone.getBoundingClientRect();

  btn.style.position = "absolute";
  btn.style.left = rect.left - zoneRect.left + "px";
  btn.style.top = rect.top - zoneRect.top + "px";

  const moveAway = (e) => {
    const btnRect = btn.getBoundingClientRect();
    const centerX = btnRect.left + btnRect.width / 2;
    const centerY = btnRect.top + btnRect.height / 2;

    const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

    if (dist < 100) {
      const maxX = Math.max(zone.clientWidth - btn.offsetWidth, 0);
      const maxY = Math.max(zone.clientHeight - btn.offsetHeight, 0);

      btn.style.left = Math.random() * maxX + "px";
      btn.style.top = Math.random() * maxY + "px";
    }
  };

  zone.addEventListener("mousemove", moveAway);
};

Question.update = function () {
  this.applyPositions();
  this.playMochi();
};

Question.applyPositions = function () {
  this.cards.forEach((card, index) => {
    card.classList.toggle("is-active", index === this.current);
  });

  const percent = (this.current / this.data.length) * 100;

  if (this.progressFill) this.progressFill.style.width = percent + "%";
};

Question.playMochi = function () {
  const q = this.data[this.current];

  if (!q || !q.mochiDialog || !this.mochiImage) return;

  this.mochiImage.src = `assets/emoji/mochi/${q.mochiDialog.emotion}.png`;
  this.mochiBubble.classList.add("gallery-popup-bubble-show");
  this.mochiWrapper.classList.add("show");
  this.typeText(q.mochiDialog.message);
};

Question.typeText = function (text, speed = 30) {
  clearInterval(this.typingTimer);

  this.mochiBubble.classList.remove("bubble-pop");
  void this.mochiBubble.offsetWidth;
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

Question.next = function () {
  if (this.current >= this.data.length - 1) {
    this.finish();
    return;
  }

  this.current++;
  this.update();
};

Question.finish = function () {
  if (this.progressFill) this.progressFill.style.width = "100%";

  this.submit();

  Scene.cinematicBlank(() => {
    QuestionEnd.show();
  });
};

Question.submit = function () {
  fetch(CONFIG.sheet.url, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({
      name: CONFIG.login.username,
      timestamp: new Date().toISOString(),
      answers: this.answers,
    }),
  }).catch((err) => {
    console.error("Gagal kirim jawaban ke spreadsheet:", err);
  });
};

Question.enter = function () {
  this.current = 0;
  this.answers = [];
  this.locked = false;

  this.update();
};