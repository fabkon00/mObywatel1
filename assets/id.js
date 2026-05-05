var params = new URLSearchParams(window.location.search);

// klik przycisku logowania
document.querySelector(".login").addEventListener('click', () => {
    toHome();
});

// powitanie
var welcome = "Dzień dobry!";
var date = new Date();

if (date.getHours() >= 18){
    welcome = "Dobry wieczór!";
}

document.querySelector(".welcome").innerHTML = welcome;

// 🔥 KLUCZOWA POPRAWKA (brak 404)
function toHome(){
    location.href = "home.html?" + params.toString();
}

// enter w haśle
var input = document.querySelector(".password_input");

input.addEventListener("keypress", (event) => {
    if (event.key === 'Enter') {
        document.activeElement.blur();
        toHome(); // opcjonalnie też przechodzi dalej
    }
});

// maskowanie hasła
var dot = "•";
var original = "";
var eye = document.querySelector(".eye");

input.addEventListener("input", () => {
    var value = input.value.toString();
    var char = value.substring(value.length - 1);

    if (value.length < original.length){
        original = original.substring(0, original.length - 1);
    }else{
        original = original + char;
    }

    if (!eye.classList.contains("eye_close")){
        var dots = "";
        for (var i = 0; i < value.length - 1; i++){
            dots = dots + dot;
        }

        input.value = dots + char;

        setTimeout(() => {
            var value = input.value;
            if (value.length != 0){
                input.value = value.substring(0, value.length - 1) + dot;
            }
        }, 3000);
    }
});

// toggle oka
eye.addEventListener('click', () => {
    var classlist = eye.classList;

    if (classlist.contains("eye_close")){
        classlist.remove("eye_close");

        var dots = "";
        for (var i = 0; i < input.value.length - 1; i++){
            dots = dots + dot;
        }

        input.value = dots;
    }else{
        classlist.add("eye_close");
        input.value = original;
    }
});