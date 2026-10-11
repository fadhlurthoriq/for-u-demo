const Scene={

    current:"login-scene",

    timers:[]

};

Scene.addTimer=function(callback,time){

    this.timers.push(

        setTimeout(callback,time)

    );

}

Scene.clearTimers=function(){

    this.timers.forEach(timer=>{

        clearTimeout(timer);

    });

    this.timers=[];

}

Scene.show = function (id) {

    Overlay.hideAll();

    Scene.clearTimers();

    if(id==="login-scene"){

        setTimeout(()=>{

            Character.dialog("login.intro");

        },400);

    }

    document
        .querySelectorAll(".scene")
        .forEach(scene => {

            scene.classList.remove("active");

        });

    document
        .getElementById(id)
        .classList.add("active");

    this.current = id;

    if(id==="welcome-scene"){

        if(!App.restoring){

        Character.dialog("welcome.intro");};

        Scene.addTimer(()=>{

            Character.dialog("welcome.envelope");;

        },2200);

        Scene.addTimer(()=>{

            Character.dialog("welcome.open");;

        },4500);

        Envelope.start();

    }

    if(id==="gallery-scene"){

        Character.disable();

        Gallery.update();

        GalleryCharacter.enter();

    }

    if(id==="letter-scene"){

        Character.disable();

        Letter.enter();

    }

    if(id==="question-scene"){

        Character.disable();

        Question.enter();

    }

    if(id==="ending-scene"){
        Character.disable();
        Ending.enter();
    }

    Storage.update({

        scene:id

    });
}

Scene.cinematic=function(nextScene){

    const overlay=

    document.getElementById(

        "transition-overlay"

    );

    const title=

    document.getElementById(

        "transition-title"

    );

    const subtitle=

    document.getElementById(

        "transition-subtitle"

    );

    overlay.classList.add("show");

    title.innerHTML="Sebentar ya...";

    subtitle.innerHTML=

    "Aku sudah menyiapkan sesuatu khusus untukmu ❤️";

    console.log("Music Fade In");

    setTimeout(()=>{

        Scene.show(nextScene);

    },2500);

    setTimeout(()=>{

        overlay.classList.remove("show");

    },3200);

}

Scene.cinematicBlank = function (callback) {

    const overlay = document.getElementById("transition-overlay");
    const title = document.getElementById("transition-title");
    const subtitle = document.getElementById("transition-subtitle");

    title.innerHTML = "";
    subtitle.innerHTML = "";

    overlay.classList.add("show");

    setTimeout(() => {

        if (callback) callback();

    }, 900);

    setTimeout(() => {

        overlay.classList.remove("show");

    }, 1200);

}