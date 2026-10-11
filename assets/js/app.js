const App={

    restoring:false

};

App.init=function(){
    

    Character.init();

    PopupCharacter.init();

    GalleryCharacter.init();

    GalleryEnd.init();

    LetterEnd.init();

    Overlay.init();

    Envelope.init();

    Music.init();

    Gallery.init();

    Letter.init();

    Question.init(); 

    QuestionEnd.init();

    Ending.init();   

    Login.init();

    App.restore();

}

App.postGalleryScenes=[

    "gallery-scene",

    "letter-scene",

    "question-scene",

    "ending-scene"

];

App.restore=function(){

    App.restoring=true;

    const save=Storage.load();

    Scene.show(save.scene);

    switch(save.scene){

        case "gallery-scene":

            Gallery.restore();

            Music.float();

        break;

        case "letter-scene":

        case "question-scene":

        case "ending-scene":

            // udah lewat gallery, player harus tetep keliatan (floating)

            Music.float();

        break;

    }

    if(App.postGalleryScenes.includes(save.scene)){

    document.getElementById("welcome-card").style.display="none";}

    setTimeout(()=>{

        App.restoring=false;

    },200);

    document.getElementById("focus-overlay").classList.remove("show");

    document.getElementById("focus-overlay-journey").classList.remove("show");

}

window.addEventListener(

    "DOMContentLoaded",

    ()=>{

        App.init();

    }

);