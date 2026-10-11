const Envelope = {
  state: "idle",

  envelope: null,

  letter: null,

  sparkle: null,

  card: null,

  started: false,

  opened: false,
};

Envelope.init = function () {
  this.envelope = document.getElementById("envelope");
  this.letter = document.getElementById("letter");
  this.card = document.getElementById("welcome-card");
  this.cardLetter = document.getElementById("card-letter");
};

Envelope.startIdle = function () {
  this.envelope.classList.add("envelope-idle");
};

Envelope.enableHover = function () {
  this.envelope.onmouseenter = () => {
    if (this.opened) return;

    this.envelope.src = "assets/img/envelope/hover.png";
  };

  this.envelope.onmouseleave = () => {
    if (this.opened) return;

    this.envelope.src = "assets/img/envelope/closed.png";
  };
};

Envelope.finishOpen = function () {
  this.state = "opened";

  this.opened = true;

  this.envelope.classList.remove("envelope-idle");

  this.envelope.src = "assets/img/envelope/opened.png";

  Character.dialog("envelope.intro");

  this.envelope.classList.add("envelope-hide");

  this.showLetter();
};

Envelope.open = function () {
  this.state = "opening";

  this.envelope.src = "assets/img/envelope/opening.png";

  setTimeout(() => {
    this.finishOpen();
  }, 1200);
};

Envelope.bind = function () {
  this.envelope.onclick = () => {
    if (this.state !== "idle") {
      return;
    }

    this.envelope.style.pointerEvents = "none";

    this.peek();
  };
};

Envelope.peek = function () {
  this.state = "peek";

  this.envelope.src = "assets/img/envelope/peek_letter.png";

  Character.dialog("envelope.mid")

  setTimeout(() => {
    this.open();
  }, 900);
};

Envelope.showLetter = function () {
  console.log("Envelope.showLetter -> start");

  this.letter.classList.add("letter-show");

  const onAnimationEnd = () => {
    console.log("Envelope.showLetter -> animationend");

    this.letter.removeEventListener("animationend", onAnimationEnd);

    if (this.state !== "finished") {
      this.showCard();
    }
  };

  this.letter.addEventListener("animationend", onAnimationEnd, { once: true });

  setTimeout(() => {
    console.log("Envelope.showLetter -> timeout fallback");

    if (this.state !== "finished") {
      this.showCard();
    }
  }, 900);
};

Envelope.showCard = function () {
  console.log("Envelope.showCard -> running");

  Overlay.showFocus();

  this.letter.classList.add("letter-fade-out");

  if (this.card) {
    this.card.classList.add("card-show");
    this.card.style.opacity = "1";
    this.card.style.pointerEvents = "auto";
    this.bindCard();
  } else {
    console.warn("Envelope.showCard -> card element missing");
  }

  if (this.cardLetter) {
    setTimeout(() => {
      this.cardLetter.classList.add("show");

      this.cardLetter.addEventListener(
        "animationend",
        () => {
            this.cardLetter.classList.remove("show");
            this.cardLetter.classList.add("card-letter-idle");
        },
        { once: true }
        );
    }, 500);
  }

  Character.dialog("envelope.end")

  this.state = "finished";
};

Envelope.start = function () {
  Character.startCutscene();

  if (this.started) {
    return;
  }

  this.started = true;

  this.startIdle();

  this.enableHover();

  this.bind();
};

Envelope.bindCard = function(){

    const btn = document.getElementById("start-story");

    if(!btn) return;

    btn.addEventListener(
        "click",
        ()=>{
            Journey.start();
        },
        {
            once:true
        }
    );

}

Envelope.reset = function () {
  this.state = "idle";
  this.opened = false;
  this.started = false;

  this.envelope.src = "assets/img/envelope/closed.png";
  this.envelope.style.opacity = "1";
  this.envelope.className = "";
  this.letter.className = "";
  this.card.className = "";

  if (this.sparkle) {
    this.sparkle.className = "";
  }

  if (this.cardLetter) {
    this.cardLetter.className = "";
  }

  Overlay.hideFocus();
};
