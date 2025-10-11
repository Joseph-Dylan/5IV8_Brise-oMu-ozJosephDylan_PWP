function problema1(){
    const input = document.getElementById("p1-input").value;

    if(input.trim() === "") {
        document.getElementById("p1-output").textContent = "Por favor ingresa palabras.";
        return;
    }

    const palabras = input.trim().split(/\s+/);
    const invertidas = palabras.reverse().join(" ");

    document.getElementById("p1-output").textContent = invertidas;
}

function problema2(){
    //tarea
}

function problema3(){
    //tarea
}