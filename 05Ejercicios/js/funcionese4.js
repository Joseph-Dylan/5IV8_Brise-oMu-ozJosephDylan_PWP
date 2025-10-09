function caluclarfinal(){
    const cali1 = document.getElementById("cali1").value;
    const cali2 = document.getElementById("cali2").value;
    const cali3 = document.getElementById("cali3").value;
    const exam = document.getElementById("exam").value;
    const trabajo = document.getElementById("trabajo").value;

    const cali1F = parseFloat(cali1);
    const cali2F = parseFloat(cali2);
    const cali3F = parseFloat(cali3);
    const promedio = (cali1F + cali2F + cali3F)/3;
    alert(promedio);

    const parcialfinal = (promedio*55)/10; //esto es el 55% de pariales
    alert(parcialfinal);

    const examen = (exam*30)/10; // el 30% de examen final
    alert(examen);

    const trabajofinal = (trabajo*15)/10; // 15% del trabajo final
    alert(trabajofinal);

    const califinal = parcialfinal + examen + trabajofinal;
    document.getElementById("calif").value = califinal.toFixed(2);
}

function validar() {
    const cali1 = parseFloat(document.getElementById("cali1").value);
    const cali2 = parseFloat(document.getElementById("cali2").value);
    const cali3 = parseFloat(document.getElementById("cali3").value);
    const exam  = parseFloat(document.getElementById("exam").value);
    const trabajo = parseFloat(document.getElementById("trabajo").value);

    if (cali1 < 0 || cali1 > 10) {
        alert("La calificación del 1er parcial debe estar entre 0 y 10");
        return false;
    }

    if (cali2 < 0 || cali2 > 10) {
        alert("La calificación del 2do parcial debe estar entre 0 y 10");
        return false;
    }

    if (cali3 < 0 || cali3 > 10) {
        alert("La calificación del 3er parcial debe estar entre 0 y 10");
        return false;
    }

    if (exam < 0 || exam > 10) {
        alert("La calificación del examen final debe estar entre 0 y 10");
        return false;
    }

    if (trabajo < 0 || trabajo > 10) {
        alert("La calificación del trabajo final debe estar entre 0 y 10");
        return false;
    }

    return true;
}

function borrar() {
    document.getElementById("cali1").value = "";
    document.getElementById("cali2").value = "";
    document.getElementById("cali3").value = "";
    document.getElementById("exam").value = "";
    document.getElementById("trabajo").value = "";
    document.getElementById("calif").value = "";
}
