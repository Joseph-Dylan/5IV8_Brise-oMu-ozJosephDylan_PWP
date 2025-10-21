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


//donde esta la pieza vacía
function actualizarposicionVacia(nuevaFila, nuevaColumna){
    filavacia = nuevaFila;
    columnavacia = nuevaColumna;
}

//necesitamos limitar las posiciones del rompecabezas
function posicionValida(fila, columna){
    return (fila >= 0 && fila <= 2 && columna >= 0 && columna <= 2);
}

//debemos crear una función que se encargue del movimiento detectando el evento de las flechas de navegación
// debemos crar una matriz de identificación de mov
// arriba 38, abajo es 40, izquierda 37, derecha 39

var codigosDireccion = {
    IZQUIERDA: 37,
    ARRIBA: 38,
    DERECHA: 39,
    ABAJO: 40
}; // formato JSON

function moverEnDireccion(direccion){
    var nuevaFilapiezaVacia;
    var nuevaColumnapiezaVacia;

    //si se mueve
    if(direccion === codigosDireccion.ABAJO){
        nuevaFilapiezaVacia = filavacia + 1;
        nuevaColumnapiezaVacia = columnavacia;
    } else if(direccion === codigosDireccion.ARRIBA){
        nuevaFilapiezaVacia = filavacia - 1;
        nuevaColumnapiezaVacia = columnavacia;
    } else if(direccion === codigosDireccion.DERECHA){
        nuevaFilapiezaVacia = filavacia;
        nuevaColumnapiezaVacia = columnavacia + 1;
    } else if(direccion === codigosDireccion.IZQUIERDA){
        nuevaFilapiezaVacia = filavacia;
        nuevaColumnapiezaVacia = columnavacia - 1;
    }

    //solo mando a llamar a que la posición sea válida
    if(posicionValida(nuevaFilapiezaVacia, nuevaColumnapiezaVacia)){
        //hacer el intercambio de posiciones en la matriz
        intercambirarPosiciones(filavacia, columnavacia, nuevaFilapiezaVacia, nuevaColumnapiezaVacia);
        actualizarposicionVacia(nuevaFilapiezaVacia, nuevaColumnapiezaVacia);
        //guardar el ultimo movimiento
        agregarultimoMovimiento(direccion);
    }
}

function intercambirarPosiciones(fila1, columna1, fila2, columna2){
    var pieza1 = rompe[fila1, columna1];
    var pieza2 = rompe[fila2, columna2];

    //inercambio debe de swe poe parte de los frames y html
    intercambirarPosicionesRompe(fila1, columna1, fila2, columna2);
    //para el html
    intercambirarPosicionesDOM('pieza'+pieza1, 'pieza'+pieza2);
}

function intercambirarPosicionesDOM(idPieza1, idPieza2){
    var pieza1 = document.getElementById(idPieza1);
    var pieza2 = document.getElementById(idPieza2);

    //clonar las piezas
    var padre = pieza1.parentNode;

    var clonPieza1 = pieza1.cloneNode(true);
    var clonPieza2 = pieza2.cloneNode(true);

    padre.replaceChild(clonPieza1, pieza2);
    padre.replaceChild(clonPieza2, pieza1);
}

//debo de actualizar los movimientos en el DOM
function actualizarUltimoMovimiento(direccion){
    var ultimoMovimiento = document.getElementById("flecha");
    switch(direccion){
        case codigosDireccion.ABAJO:
            ultimoMovimiento.textContent = "↓";
            break;
        case codigosDireccion.ARRIBA:
            ultimoMovimiento.textContent = "↑";
            break;
        case codigosDireccion.DERECHA:
            ultimoMovimiento.textContent = "→";
            break;
        case codigosDireccion.IZQUIERDA:
            ultimoMovimiento.textContent = "←";
            break;
    }
}

function mezclarPiezas(veces){
    if(veces <= 0){
        alert("Así no se puede mezclar");
        return;
    }
    var direcciones = [codigosDireccion.ABAJO, codigosDireccion.ARRIBA, codigosDireccion.DERECHA, codigosDireccion.IZQUIERDA];
    var direccion = [Math.floor(Math.random() * direcciones.length)];
    moverEnDireccion(direccion);

    setTimeout(function(){
        mezclarPiezas(veces - 1);
    }, 100);
}

//necesitamos saber que teclas se oprimen
function capturarTeclas(){
    document.body.onkeydown = (function(evento){
        if(evento.which === codigosDireccion.ARRIBA ||
            evento.which === codigosDireccion.ABAJO ||
            evento.which === codigosDireccion.DERECHA ||
            evento.which === codigosDireccion.IZQUIERDA){
            moverEnDireccion(evento.which);

            var gano = checarsiGano();
            if(gano){
                setTimeout(() => {
                    mostrarcarteGanador();
                }, 500);
            }
            evento.preventDefault();
        }
    });
}

function iniciar(){
    mezclarPiezas(30);
    capturarTeclas();

}

iniciar();

function iniciar(){
    //mezclar las piezas
    //capturar el ultimo movimiento
    
}

mostrasinstrucciones(instrucciones);