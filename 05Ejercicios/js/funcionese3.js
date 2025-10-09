function prueba(){
    const nombre = document.getElementById("nombrep").value;
    alert(nombre);
    const precio = document.getElementById("preciop").value;
    alert(precio);
    const precioF = precio.toString();
    alert(precioF);
    const preciot = precioF - precioF*0.15;
    document.getElementById("cadena").textContent = "El precio total a pagar para: " + nombre + ", con precio de: $" + precio + ", con un descuento del 15% es:";
    document.getElementById("preciod").value = "$ " + preciot.toFixed(2);
}

function validar(){
    const precio = document.getElementById("preciop").value;
    alert(precio);
    const precioF = precio.toString();
    if(precioF < 1 || precioF > 10000000){
        alert("Introduzca un costo del producto entre $1 y $10 millones")
        return false
    }
    return true
}

function borrar(){
    document.getElementById("nombrep").value = " ";
    document.getElementById("preciop").value = " ";
    document.getElementById("preciod").value = " ";
    document.getElementById("cadena").textContent = "El precio total a pagar para: ____, con precio de: $____, con un descuento del 15% es:";
}