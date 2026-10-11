const Overlay = {};

Overlay.focus = document.getElementById("focus-overlay");

Overlay.journey = document.getElementById("focus-overlay-journey");

Overlay.transition = document.getElementById("transition-overlay");

Overlay.popup = document.getElementById("popup-overlay");


Overlay.init = function(){

    this.focus =
        document.getElementById("focus-overlay");

    this.journey =
        document.getElementById("focus-overlay-journey");

    this.transition =
        document.getElementById("transition-overlay");

    this.popup =
        document.getElementById("popup-overlay");

}

Overlay.showFocus=function(){

    this.focus?.classList.add("show");

}

Overlay.hideFocus=function(){

    this.focus?.classList.remove("show");

}

Overlay.showJourney=function(){

    this.journey?.classList.add("show");

}

Overlay.hideJourney=function(){

    this.journey?.classList.remove("show");

}

Overlay.showTransition=function(){

    this.transition?.classList.add("show");

}

Overlay.hideTransition=function(){

    this.transition?.classList.remove("show");

}

Overlay.showPopup=function(){

    this.popup?.classList.add("show");

}

Overlay.hidePopup=function(){

    this.popup?.classList.remove("show");

}

Overlay.hideAll=function(){

    this.hideFocus();

    this.hideJourney();

    this.hideTransition();

    this.hidePopup();

}