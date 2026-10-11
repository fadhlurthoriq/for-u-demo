const Character = {

    name:"Mochi",

    mode:"idle",

    currentEmotion:"happy",

    currentAnimation:"idle",

    visible:true,

    timer:null,

    typingTimer:null,

    idleTimer:null,

    isTalking:false,

    bubble: document.getElementById("character-bubble"),

    text: document.getElementById("bubble-text"),

    image: document.getElementById("character-image"),

    typing: document.getElementById("typing-indicator"),

    queue:[],

    queueIndex:0,

    playing:false,

    queueTimer:null,

};

// ======================================
// SHOW / HIDE CHARACTER
// ======================================

Character.dialog=function(path){

    const dialog=

    path.split(".")

    .reduce(

        (obj,key)=>obj[key],

        Dialogs

    );

    if(!dialog) return;

    this.save(

        path,

        dialog

    );

    this.say(dialog);

}

Character.play=function(dialogs){

    this.queue=[...dialogs];

    this.queueIndex=0;

    this.playing=false;

    Storage.update({

        character:{

            ...Storage.load().character,

            queue:[...dialogs],

            queueIndex:0

        }

    });

    this.nextDialog();

}

Character.nextDialog=function(){

    if(this.queue.length===0){

        this.playing=false;

        Storage.update({

            character:{

                ...Storage.load().character,

                queue:[],

                queueIndex:0

            }

        });

        return;

    }

    this.playing=true;

    const dialogPath=

        this.queue.shift();

    Storage.update({

        character:{

            ...Storage.load().character,

            dialog:dialogPath,

            queue:this.queue,

            queueIndex:this.queueIndex

        }

    });

this.queueIndex++;

    const dialog=

        dialogPath

        .split(".")

        .reduce(

            (obj,key)=>obj[key],

            Dialogs

        );

    if(!dialog){

        this.nextDialog();

        return;

    }

    this.dialog(dialogPath);

    const textLength=

        dialog.message.length;

    const wait=

        dialog.wait ||

        textLength*35+1800;

    clearTimeout(this.queueTimer);

    this.queueTimer=setTimeout(()=>{

        this.nextDialog();

    },wait);

}

Character.save=function(dialogPath,data){

    Storage.update({

        character:{

            dialog:dialogPath,

            emotion:data.emotion,

            message:data.message,

            visible:this.visible,

            mode:this.mode

        }

    });

}

Character.show = function () {

    this.image.style.display = "block";

    this.visible = true;

}

Character.hide=function(){

    this.image.style.display="none";

    this.hideBubble();

    this.visible=false;

}

Character.disable=function(){

    this.mode="disabled";

    this.stopIdle();

    clearTimeout(this.timer);

    clearTimeout(this.queueTimer);

    clearInterval(this.typingTimer);

    this.queue=[];

    this.playing=false;

    this.hideBubble();

    this.hide();

}

Character.showTyping=function(){

    clearTimeout(this.timer);

    this.showBubble();

    this.text.style.display="none";

    this.typing.style.display="flex";

}

Character.hideTyping=function(){

    this.typing.style.display="none";

    this.text.style.display="block";

}

// ======================================
// SHOW / HIDE BUBBLE
// ======================================

Character.showBubble=function(){

    this.visible=true;

    this.bubble.style.opacity="1";

    this.bubble.style.visibility="visible";

}

Character.hideBubble=function(){

    this.bubble.style.opacity="0";

    this.bubble.style.visibility="hidden";

    this.visible=false;

    const save=Storage.load();

        Storage.update({

            character:{

                ...save.character,

                emotion:this.currentEmotion,

                message:"",

                visible:true,

                mode:this.mode

            }

        });

}

// ======================================
// MODE
// ======================================

Character.startCutscene=function(){

    this.mode="cutscene";

    this.stopIdle();

}

Character.finishCutscene=function(){

    this.mode="idle";

    this.startIdle();

}

Character.stopIdle=function(){

    clearTimeout(this.idleTimer);

}

// ======================================
// CHANGE EMOTION
// ======================================

Character.changeEmotion = function (emotion) {

    if (!emotion) return;

    this.currentEmotion = emotion;

    this.image.src = `assets/emoji/mochi/${emotion}.png`;

}

// ======================================
// CHANGE ANIMATION
// ======================================

Character.changeAnimation = function (animation) {

    this.image.classList.remove(

        "idle",
        "bounce",
        "shake",
        "sleep",
        "love"

    );

    if (animation) {

        this.image.classList.add(animation);

    }

}

Character.restore=function(){

    this.changeEmotion(

        "happy"

    );

}

Character.restoreQueue=function(){

    const save=

        Storage.load();

    if(!save.character) return;

    const queue=

        save.character.queue;

    if(!queue.length) return;

    const index=

        save.character.queueIndex;

    this.queue=

        queue.slice(index);

    if(this.queue.length){

        this.playing=false;

        this.nextDialog();

    }

}

// ======================================
// TYPING EFFECT
// ======================================

Character.typeText = function(text, speed = 35){

    clearInterval(this.typingTimer);

    this.text.innerHTML="";

    let i=0;

    this.typingTimer=setInterval(()=>{

        if(i<text.length){

            this.text.innerHTML+=text.charAt(i);

            i++;

        }else{

            clearInterval(this.typingTimer);

        }

    },speed);

}

Character.say = function({

    emotion = this.currentEmotion,

    message = "",

    speed = 35,

    duration = null

}){

    clearTimeout(this.timer);

    this.showBubble();

    this.changeEmotion(emotion);

    this.typeText(message,speed);

    this.visible=true;

    Storage.update({

        character:{

            emotion,

            message,

            visible:true,

            mode:this.mode

        }

    });

    if(duration!==null){

        this.timer=setTimeout(()=>{

            this.hideBubble();

        },duration);

    }

}

Character.idleTimer = null;

Character.startIdle=function(){

    if(this.mode!=="idle") return;

    clearTimeout(this.idleTimer);

    this.idleTimer=setTimeout(()=>{

        if(this.mode!=="idle") return;

        const random=

        Dialogs.idle[

            Math.floor(

                Math.random()*

                Dialogs.idle.length

            )

        ];

        this.say(random);

        this.startIdle();

    },10000);

}

Character.stopIdle = function(){

    clearTimeout(this.idleTimer);

}

Character.resetIdle=function(){

    this.stopIdle();

    this.startIdle();

}

// ======================================
// DEFAULT
// ======================================

Character.init=function(){

    this.idleTimer = setTimeout(()=>{

        this.startIdle();

    },6000);

}