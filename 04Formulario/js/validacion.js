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
    var chekStr = formulario.nombre.value;
    alert(chekStr)

    var abcOk = "QWERTYUIOPASDFGHJKLÑZXCVBNM" + "qwertyuiopasdfghjklñzxcvbnm";

    var allValido = true;

    //tenemos que comparara la cadena nombre con el abc - expresione regulares

    for(var i = 0; i < chekStr.length; i++){
        var caracateres = chekStr.charAt(i);
        for(var j = 0; j < abcOk.length; j++){
            if(caracateres == abcOk.charAt(j)){
                break;
            }
        }
        if(j == abcOk.length){
            allValido = false;
            break;
        }
    }
    if(!allValido){
        alert("Escriba solo letras en el campo nombre");
        formulario.nombre.focus();
        return false;
    }

    var chekStr = formulario.edad.value;
    alert(chekStr)

    var abcOk = "1234567890";

    var allValido = true;

    //tenemos que comparara la cadena nombre con el abc - expresione regulares

    for(var i = 0; i < chekStr.length; i++){
        var caracateres = chekStr.charAt(i);
        for(var j = 0; j < abcOk.length; j++){
            if(caracateres == abcOk.charAt(j)){
                break;
            }
        }
        if(j == abcOk.length){
            allValido = false;
            break;
        }
    }
    if(!allValido){
        alert("Escriba solo digitos en el campo edad");
        formulario.edad.focus();
        return false;
    }

    //funcion de expresion regular para email que acepte
    //texto.texto@texto.texto
    var b = /^[^@\s]+[^@\.\s]+(\.[^@\.\s]+)+$/;
    var txt = formulario.correo.value;

    alert("Email " + (b.test(txt)? " ": " no "))
}