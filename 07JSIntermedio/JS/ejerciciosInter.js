// PROBLEMA 1
// Si son iguales multiplicarlos
// Si el primero es mayor restarlos
// Si es menor sumarlos
function problema1() {
    const n1 = Number(document.getElementById("p1-n1").value);
    const n2 = Number(document.getElementById("p1-n2").value);
    let resultado = "";

    if (isNaN(n1) || isNaN(n2)) {
        resultado = "Por favor ingresa ambos números.";
    } else if (n1 === n2) {
        resultado = `Son iguales, se multiplican: ${n1} * ${n2} = ${n1 * n2}`;
    } else if (n1 > n2) {
        resultado = `El primero es mayor, se restan: ${n1} - ${n2} = ${n1 - n2}`;
    } else {
        resultado = `El primero es menor, se suman: ${n1} + ${n2} = ${n1 + n2}`;
    }

    document.getElementById("p1-output").textContent = resultado;
}



// PROBLEMA 2
// Leer 3 números diferentes e imprimir el mayor
function problema2() {
    const n1 = Number(document.getElementById("p2-n1").value);
    const n2 = Number(document.getElementById("p2-n2").value);
    const n3 = Number(document.getElementById("p2-n3").value);
    let resultado = "";

    if (isNaN(n1) || isNaN(n2) || isNaN(n3)) {
        resultado = "Por favor ingresa los tres números.";
    } else {
        const mayor = Math.max(n1, n2, n3);
        resultado = `El número mayor es: ${mayor}`;
    }

    document.getElementById("p2-output").textContent = resultado;
}



// PROBLEMA 3
// Horas extra: >40
// Hasta 8 horas extra = doble
// Más de 8 = 8 dobles + resto triple
function problema3() {
    const horas = Number(document.getElementById("p3-horas").value);
    const pagoHora = Number(document.getElementById("p3-pago").value);
    let resultado = "";

    if (isNaN(horas) || isNaN(pagoHora)) {
        resultado = "Ingresa horas trabajadas y pago por hora.";
    } else if (horas <= 40) {
        resultado = `No hay horas extra. Pago total: $${(horas * pagoHora).toFixed(2)}`;
    } else {
        let horasNormales = 40;
        let horasExtras = horas - 40;
        let pagoTotal = horasNormales * pagoHora;

        if (horasExtras <= 8) {
            // Todas las extras al doble
            pagoTotal += horasExtras * (pagoHora * 2);
        } else {
            // Primeras 8 al doble, resto al triple
            pagoTotal += 8 * (pagoHora * 2);
            pagoTotal += (horasExtras - 8) * (pagoHora * 3);
        }

        resultado = `Pago total con horas extra: $${pagoTotal.toFixed(2)}`;
    }

    document.getElementById("p3-output").textContent = resultado;
}



// PROBLEMA 4
// Utilidad anual según antigüedad
function problema4() {
    const salario = Number(document.getElementById("p4-salario").value);
    const anios = Number(document.getElementById("p4-anios").value);
    let porcentaje = 0;
    let resultado = "";

    if (isNaN(salario) || isNaN(anios)) {
        resultado = "Ingresa salario y años de antigüedad.";
    } else {
        if (anios < 1) porcentaje = 0.05;
        else if (anios < 2) porcentaje = 0.07;
        else if (anios < 5) porcentaje = 0.10;
        else if (anios < 10) porcentaje = 0.15;
        else porcentaje = 0.20;

        const utilidad = salario * porcentaje;
        resultado = `La utilidad correspondiente es: $${utilidad.toFixed(2)} (${porcentaje * 100}%)`;
    }

    document.getElementById("p4-output").textContent = resultado;
}
