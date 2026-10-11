const Login = {}
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("login-btn");
let usernameDebounce;
let passwordDebounce;

Login.init = function () {

    usernameInput.addEventListener("input",()=>{
    
        Character.resetIdle();
    
        Character.changeEmotion("thinking");
    
        Character.showTyping();
    
        clearTimeout(usernameDebounce);
    
        usernameDebounce=setTimeout(()=>{
            Character.hideTyping();
    
            const value=usernameInput.value.trim();
    
            if(value===CONFIG.login.username){
    
                Character.dialog("login.usernameCorrect");
    
            }
    
            else{
    
                Character.dialog("login.usernameWrong");
    
            }
    
        },800);
    
    });
    
    passwordInput.addEventListener("input",()=>{

        Character.resetIdle();

        Character.changeEmotion("thinking");

        Character.showTyping();

        clearTimeout(passwordDebounce);

        passwordDebounce = setTimeout(()=>{

            Character.hideTyping();

            const value = passwordInput.value.trim();

            if(value === CONFIG.login.password){

                Character.dialog("login.passwordCorrect");

            }

            else{

                Character.dialog("login.passwordWrong");

            }

        },800);

    });
    
    usernameInput.addEventListener("focus",()=>{
    
        Character.resetIdle();
    
        Character.dialog("login.focusUsername");
    
    });
    
    passwordInput.addEventListener("focus",()=>{
    
        Character.resetIdle();
    
        Character.dialog("login.focusPassword");
    
    });

    loginButton.addEventListener("click", () => {

        login();

    });

    document.addEventListener("keydown",(e)=>{

        if(e.key==="Enter"){

            login();

        }

    });

}

function login(){

    const username=usernameInput.value.trim();

    const password=passwordInput.value.trim();

    if(username===CONFIG.login.username && password===CONFIG.login.password){

        Character.dialog("login.loginSuccess");

    Character.changeAnimation(

        "bounce"

    );

    setTimeout(()=>{

        document.querySelector(".login-card").classList.add("login-success");

        Scene.cinematic(

            "welcome-scene"

        );

    },1500);
}}