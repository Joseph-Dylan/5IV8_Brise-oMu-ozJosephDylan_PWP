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
    // Leer los valores de los inputs
const x1 = parseFloat(document.getElementById("p2-x1").value);
const x2 = parseFloat(document.getElementById("p2-x2").value);
const x3 = parseFloat(document.getElementById("p2-x3").value);
const x4 = parseFloat(document.getElementById("p2-x4").value);
const x5 = parseFloat(document.getElementById("p2-x5").value);

const y1 = parseFloat(document.getElementById("p2-y1").value);
const y2 = parseFloat(document.getElementById("p2-y2").value);
const y3 = parseFloat(document.getElementById("p2-y3").value);
const y4 = parseFloat(document.getElementById("p2-y4").value);
const y5 = parseFloat(document.getElementById("p2-y5").value);

const xs = [x1, x2, x3, x4, x5];
const ys = [y1, y2, y3, y4, y5];

xs.sort((a,b) => a-b);
ys.sort((a,b) => b-a);

let productoEscalar = 0;
for(let i = 0; i < 5; i++){
    productoEscalar += xs[i] * ys[i];
}

document.getElementById("p2-output").textContent = "Producto escalar mínimo: " + productoEscalar;

}

function problema3(){
    //tarea
}