function calcular() {
    const fecha = document.getElementById("fecha").value;
    alert(fecha)

    if (!fecha) {
        alert("Por favor ingresa una fecha");
        return;
    }

    const fechadate = new Date(fecha);
    const hoy = new Date();

    if (fechadate > hoy) {
        alert("Fecha inválida");
        document.getElementById("edad").value = "";
        return;
    }

    let edad = hoy.getFullYear() - fechadate.getFullYear();
    const mesDiff = hoy.getMonth() - fechadate.getMonth();
    const diaDiff = hoy.getDate() - fechadate.getDate();

    if (mesDiff < 0 || (mesDiff === 0 && diaDiff < 0)) {
        edad--;
    }

    document.getElementById("edad").value = edad + " años";
}

function borrar(){
    document.getElementById("fecha").value = " ";
    document.getElementById("edad").value = " ";
}
