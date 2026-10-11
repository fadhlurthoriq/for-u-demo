const Journey = {
    started:false
};

Journey.start=function(){

    Overlay.hideJourney();

    if(this.started){
        return;
    }

    this.started=true;

    const card=document.getElementById("welcome-card");

    card.classList.add("hide");

    card.addEventListener(

        "animationend",

        Journey.showOverlay,

        {

            once:true

        }

    );

}

Journey.reset=function(){

    this.started=false;

}

Journey.waitPlayer=function(){

    setTimeout(()=>{

        Music.float(()=>{

            Journey.showGallery();

        });

    },1000);

}

Journey.showOverlay=function(){

    Overlay.showJourney();

    Character.startCutscene();

    Character.dialog("journey.start");

    Music.show(()=>{

    Journey.waitPlayer();

});

}

Journey.showGallery=function(){

    const gallery=document.getElementById("gallery-scene");

    Scene.show("gallery-scene");

    GalleryCharacter.enter();

    Music.play();

    requestAnimationFrame(()=>{

        gallery.classList.add("reveal");

    });

    setTimeout(()=>{

        Overlay.hideJourney();

    },800);

}

Journey.showTransition=function(){

    const overlay=

    Overlay.showJourney();

    const transition=

    document.getElementById(

        "journey-transition"

    );

    transition.classList.add(

        "show"

    );

}