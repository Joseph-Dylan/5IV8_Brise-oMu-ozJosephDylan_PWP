var instrucciones = [
    "Utiliza las flechas de navegació para mover las piezas",
    "Para ordenar las piezas guiate por la imagen Objetivo"
];

//guardar en una variable los movimientos del rompecabezas, luego vamos a crear una matriz para saber las posiciones del rompecabezas
var rompe = [
    [1,2,3],
    [4,5,6],
    [7,8,9]
];

//vamos a tener que crear una matriz donde tengamos las posiciones correctas

var rompecorrecta = [
    [1,2,3],
    [4,5,6],
    [7,8,9]
];

//necesito saber las coordenadas de la pieza vacía, la que se va a mover

var filavacia = 2;
var columnavacia = 2;

// nevcesitamos una función que se encargue de mostrar las instrucciones

function mostrasinstrucciones(instrucciones){
    for(var i = 0; i < instrucciones.length; i++){
        mostrarinstruccionesLista(instrucciones[i], "lista-instrucciones");
    }
}

//esta función se encargad de crear el componente li y agregar la lista de dichas instrucciones

function mostrarinstruccionesLista(instruccion, idLista){
    var ul = document.getElementById(idLista);
    var li = document.createElement("li");
    li.textContent = instruccion;
    ul.appendChild(li);
}

//funcon para saber que ganó
function checarsiGano(){
    for(var i = 0; i < rompe.length; i++){
        for(var j = 0; i < rompe[i].length; i++){
            var rompeAct = rompe[i][j];
            if(rompeAct !== rompecorrecta[i][j]){
                return false;
            }
        }
    }
    return false;
}

//mostrar que se ganó
function mostrarcarteGanador(){
    if(checarsiGano())
        {
        alert("ganaste") 
    }
    return false;
}

//función para cambiar las posiciones de las piezas
function intercambirarPosicionesRompe(filaPos1, columnaPos1, filaPos2, columnaPos2){
    var pos1 = rompe[filaPos1, columnaPos1];
    var pos2 = rompe[filaPos2, columnaPos2];

    rompe[filaPos1, columnaPos1] = pos2;
    rompe[filaPos2, columnaPos2] = pos1;
}


function iniciar(){
    //mezclar las piezas
    //capturar el ultimo movimiento
    
}

mostrasinstrucciones(instrucciones);