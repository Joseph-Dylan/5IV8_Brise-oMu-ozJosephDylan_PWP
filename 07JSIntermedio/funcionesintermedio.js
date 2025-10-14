/*
    js maneja variables del sgieuiente modo:

    var -> Una variable de acceso local y global dapendiendp de donde se declare

    let -> es una variable protegida, solo se puede hacer uso dentro de ña funcion o bloque donde se declara

    const -> es una variable que no uede cambiar su valor, es una constante


var x = "hola";

if(true){
    let x = "había una vez";
    console.log(x);
}



// como usamos las funciones

function suma(n1,n2){
    return n1+n2;
}

console.log(`Esta suma es de: ${suma(5,3)}`);


// las funciones flecha nos ayudan a realizar operaciones de una forma mucho mas sencilla, de acurrdo a la siguiente estrucutra
// "cadena" -> id, clase, metodo, nombre, atributo

const suma = (n1,n2) => n1 + n2;
console.log(`Esta suma es de: ${suma(5,3)}`);

*/

const razasdeperros = [
    "pastor aleman",
    "labrador retiver",
    "bulldog frances",
    "beagele",
    "chihuahua",
    "dalmata",
    "salchicha",
    "pug"
];

//formas de recorrer e imprimir

/*
//for
for(let i = 0; i < razasdeperros.length; i++){
    console.log(razasdeperros[i]);
}
*/

/**
//for of
for(const raza of razasdeperros){
    console.log(raza);
}

//for in

for(const indice in razasdeperros){
    console.log(razasdeperros[indice]);
}


//foreach itera soibre los elementos del arreglo y no devuelve nada
//todos los foreach son funciones flecha por defecto
razasdeperros.forEach(raza => console.log(raza));
// la estructura general del foreach es ña siguiente
//argumento.forEach((raza, indice, arreglo) => {codigo a ejecutar})


// funcion map -> iterar sobre los elementos del arreglo y regresa un arreglo diferente
const razasdeperrosmayus = razasdeperros.map(raza => raza.toUpperCase());
console.log(razasdeperrosmayus);


// find nos permite buscar un elemento en el arreglo, si lo encuentra los regresa
if(razasdeperros.find(raza => raza === "chihuahua")){
    console.log("Si se encontró la raza");
    console.log(razasdeperros);
}
else{
    razasdeperros.push("chihuahua");
    console.log(razasdeperros);
}
*/

//findindex -> nos permite realizar una busqueda en el arreglo y regresa su indice, sino regresa un -1, esta funcion es util cuando becesitamos modificar o eliminar dentro de un arreglo original dentro de una copia
const indicechihuahua = razasdeperros.findIndex(raza => raza === "chihuahua");
if(indicechihuahua > -1){
    //si se encontró y esta en el arreglo
    console.log(razasdeperros[indicechihuahua]);
    //aparte hay que decir que agregue texto
    razasdeperros[indicechihuahua] += " (Es una raza de perros chiquita y chillona)";
    console.log(razasdeperros[indicechihuahua]);
    console.log(razasdeperros);
}