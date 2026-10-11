const Popup={

    overlay:document.getElementById("popup-overlay"),

    title:document.getElementById("popup-title"),

    message:document.getElementById("popup-message"),

    image:document.getElementById("popup-character"),

    button:document.getElementById("popup-button")

};

Popup.init=function(){

    this.hide();

}

Popup.show=function(data){

    this.title.innerHTML=data.title;

    this.message.innerHTML=data.message;

    this.image.src=

    `assets/emoji/mochi/${data.emotion}.png`;

    Overlay.showPopup();

    Character.hideBubble();

}

Popup.hide=function(){

    Overlay.hidePopup();

    setTimeout(()=>{

        Character.showBubble();

    },350);

}

Popup.button.onclick=()=>{

    Popup.hide();

}