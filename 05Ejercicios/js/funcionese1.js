function validarn(e){
    var teclado = (document.all)? e.keyCode : e.which;
    if(teclado == 8) return true;
    var patron = /[0-9\d .]/;

    var codigo = String.fromCharCode(teclado);
    return patron.test(codigo);
}

function interes(){
    var valor = document.getElementById("cantidadi").value;
    var parseo = parseFloat(valor);
    alert(parseo);

    var interes = parseo*(0.085); //Limite a 2
    alert(interes);

    var total = parseo + interes;
    alert(total);

    document.getElementById("saldoi").value = "$ " + total; //Limite a 2
}

function borrar(){
    document.getElementById("saldoi").value = " ";
    document.getElementById("cantidadi").value = " ";
}

/*
    Del ejercicio 1, tenemos que agregar el numero de meses y sera un inversion de maximo 18 meses

    2 se deben ingresar 3 ventas, un sueldo base y caluclar el monto total, debe de aparecer caunto cobra por comisión y la suma 

    3 se debe de ingresar un producto con su precio, y aplicarle el 15% y el sistema debe mostrar el producto, el precio, el descuento y el total a pagar

    4 se debe de ingresar calificacion 1,2,3 se aplica el promedio y sus porcentajes, se ingresa TF y se aplica trabajo final y examen final y se aplica porcentaje, se debe de mostrar el total de calificación

    5 se debe de ingresar cantidad de hombres y cantidad de mujeres y mostrar sus % correspondientes

    6 calcular la edad de una persona
*/