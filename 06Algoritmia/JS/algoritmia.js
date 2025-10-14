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
    var p2_x1 = document.querySelector("#p2_x1").value;
    var p2_x2 = document.querySelector("#p2_x2").value;
    var p2_x3 = document.querySelector("#p2_x3").value;
    var p2_x4 = document.querySelector("#p2_x4").value;
    var p2_x5 = document.querySelector("#p2_x5").value;
    
    var p2_y1 = document.querySelector("#p2_y1").value;
    var p2_y2 = document.querySelector("#p2_y2").value;
    var p2_y3 = document.querySelector("#p2_y3").value;
    var p2_y4 = document.querySelector("#p2_y4").value;
    var p2_y5 = document.querySelector("#p2_y5").value;

    var v1 = [p2_x1, p2_x2, p2_x3, p2_x4, p2_x5];
    var v2 = [p2_y1, p2_y2, p2_y3, p2_y4, p2_y5];

    v1 = v1.sort(function(a,b){return b-a});
    v2 = v2.sort(function(a,b){return b-a});

    v2 = v2.reverse();

    var p2_producto = 0;

    for(var i=0; i < v1.length; i++){
        p2_producto += v1[i] + v2[i];
    }
    document.querySelector("#p2_producto").textContent = "El producto escalar minimo es: " + p2_producto;
}

function problema3(){
    const input = document.getElementById("p3-input").value;

    if (input.trim() === "") {
        document.getElementById("p3-output").textContent = "Por favor ingresa palabras.";
        return;
    }

    const palabras = input.trim().split(",");

    let palabraMax = "";
    let maxUnicos = 0;

    for (let palabra of palabras) {
        const unicos = new Set(palabra.split(""));

        if (unicos.size > maxUnicos) {
            maxUnicos = unicos.size;
            palabraMax = palabra;
        }
    }

    document.getElementById("p3-output").textContent =
        palabraMax + " (" + maxUnicos + ")";
}