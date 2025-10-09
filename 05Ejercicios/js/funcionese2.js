function validar(){
    sueldobase = document.getElementById("sueldob").value;
    venta1 = document.getElementById("venta1").value;
    venta2 = document.getElementById("venta2").value;
    venta3 = document.getElementById("venta3").value;
    sueldobasef = parseFloat(sueldobase);
    venta1f = parseFloat(venta1);
    venta2f = parseFloat(venta2);
    venta3f = parseFloat(venta3);

    if (
        sueldobase < 0 || sueldobase >= 10000000 ||
        venta1 < 0 || venta1 >= 10000000 ||
        venta2 < 0 || venta2 >= 10000000 ||
        venta3 < 0 || venta3 >= 10000000
    ) {
        alert("Los valores deben estar entre 0 y 10 millones");
        return false;
    }

    return true;
}


function sueldot(){
    sueldobase = document.getElementById("sueldob").value;
    venta1 = document.getElementById("venta1").value;
    venta2 = document.getElementById("venta2").value;
    venta3 = document.getElementById("venta3").value;
    alert(venta1);
    alert(venta2);
    alert(venta3);
    sueldobasef = parseFloat(sueldobase);
    venta1f = parseFloat(venta1);
    venta2f = parseFloat(venta2);
    venta3f = parseFloat(venta3);
    alert(venta1f);
    alert(venta2f);
    alert(venta3f);

    sueldotot = sueldobasef + venta1f*0.1 + venta2f*0.1 + venta3f*0.1;
    alert(sueldotot);


    document.getElementById("sueldoco").value = "$ " + sueldotot;
}