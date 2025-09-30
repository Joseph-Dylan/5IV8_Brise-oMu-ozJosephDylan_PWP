/*
Javascript es un lenguaje multiparadigma
acepta la programación fucional, estructurada, POO, eventos
Dentro de js, no existe el typado de variables
int, string, float, etc

Solo existen 3 tipos de variables de acuerdo al estandar ES6
var, let, const
*/

function validar(formulario){
    //quiero validar que el campo nombre acepte más de 3 caracteres
    if(formulario.nombre.value.length < 4){
        alert("Por favor escribe más de 3 caracteres en el campo nombre");
        formulario.nombre.focus();
        return false;
    }
    
    //funcion de expresion regular para el nombre
    //texto texto texto
    var a = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
    var txt = formulario.nombre.value;

    alert("Nombre" + (a.test(txt)? " ": " no ") + "valido");


    //funcion de expresion regular para la edad
    //nnn
    var a = /^(?:[1-9][0-9]?|100)$/;
    var txt = formulario.edad.value;

    alert("Edad" + (a.test(txt)? " ": " no ") + "valido");


    //funcion de expresion regular para email que acepte
    //texto.texto@texto.texto
    var a = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var txt = formulario.correo.value;

    alert("Email" + (a.test(txt)? " ": " no ") + "valido");

    return a.test;
}