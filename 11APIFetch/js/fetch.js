/*
Este es un ejemplo de una API REST utilizando una llamada con fetch, el cual sirve para obtener información sobre el tipo de api, (pokemon) y obtener su estructura a partir de crear una función call back con una promesa.
*/

const pokeApiURL = "https://pokeapi.co/api/v2/";

//vamos a crear una funcion para obter todos los datos de la pokedex, para esto tenemos que imaginar el orden y la obtención de los datos 

const pokedex = () => {
    //primero necesitamos obtener todas las estadisticas del pokemon, asi que necesitamos crear un diccionario para obtener cada uno de los elementos del front para despues vaciar los datos
    const pokemonStatsElements = {
        hp : document.getElementById("pokemonStatHp"),
        attack : document.getElementById("pokemonStatAttack"),
        defense : document.getElementById("pokemonStatDefense"),
        specialAttack : document.getElementById("pokemonStatSpecialAttack"),
        specialDefense : document.getElementById("pokemonStatSpecialDefense"),
        speed : document.getElementById("pokemonStatSpeed")
    };

    //necesitamos un axuiliar que nos permita utilizar la clase del tipo de pokemon para cambiar la css dependiendo del tipo
    let currentClassType = null;

    //tiene que cambiar los elementos de la imagen, para ello tenemos que crear un template que se encargue de endenar los datos
    const imageTemplate = "<img class='pokedisplay' src='{imgSrc}' alt='pokedisplay' />";

    //necesitamos un objeto que se encargue de guardar las rutas de las imagenes que vamos a cambiar dependiendo de si es una busqueda, si lo encontro o no al pokemon
    const images = {
        imgPokemonNotFound : "../img/404.png",
        imgLoading : "../img/loading.gif"
    };

    //necesitamos una variable que guarde todos los contenedores de la pokedex
    const containers = {
        imagenContainer : document.getElementById("pokedisplay-container"),
        pokemonTypesContainer: document.getElementById("pokemonTypes"),
        pokemonNameElement: document.getElementById("pokemonNameResult"),
        pokemonAbilitiesElement: document.getElementById("pokemonAbilities"),
        pokemonMovesElement: document.getElementById("pokemonMoves"),
        pokemonIdElement: document.getElementById("pokemonId")
    };

    //necesitamos un objeto de tipo array que guarde los botones con tipo de referencia

    const buttons = {
        all : Array.from(document.getElementsByClassName("btn")),
        search : document.getElementById("btnSearch"),
        next : document.getElementById("btnUp"),
        previous : document.getElementById("btnDown")
    };

    //vamos buscar un pokemon necesitamos una variable que guarde el nombre del pokemon
    const pokemonInput = document.getElementById("pokemonName");

    //La agrupacion de los elementos en este objeto debe de ser una estructura que nos permita crear funciones mas pequeñas que sin importar el orden puedan obtener cada uno de los datos solicitados

    const processPokemonType = (pokemonData) => {
        //Primero necesitamos obtener el tipo de pokemon, el nombre, y la clase para que se modifique en el html, ya que tenemos eso, tendremos que obtener stats, moves, abilities 
        let pokemonType = "";
        //utilizo una busqueda de la clase de pokemon, eso se refiere al tipo de pokemon
        const firstClass = pokemonData.types[0].type.name;

        pokemonData.types.forEach((pokemonTypeData)=>{
            //necesito obtener la etiqueta de cada cambio
            pokemonType += ` <span class="pokemon-type ${pokemonData.type.name}"> ${pokemonTypeData.type.name} </span> `;
        });
        //para poder quitar y cambiar el contenedor dependiendo del tipo tengo que saber a cual pertenece
        if(currentClassType){
            containers.pokemonMovesElement.classList.remove(currentClassType);
            containers.pokemonAbilitiesElement.classList.remove(currentClassType);
        } //ahora tengo que agregar lo nuevo
        containers.pokemonMovesElement.classList.add(firstClass);
        containers.pokemonAbilitiesElement.classList.add(firstClass);
        //debo de agregar las etiquetas creadas dentro del forEach
        containers.pokemonTypesContainer.innerHTML = pokemonType;
    };

    //ahora necesitamos obtener las estadisticas del pokemon
    const processPokemonStats = (pokemonData) => {
        pokemonData.stats?.forEach((pokemonstatData)=>{
            //vamos a evaluar si encuentra el nombre de la estadistica para colocarlo en su contenedor correspondiente
            switch(pokemonstatData.stat.name){
                case "hp":
                    pokemonStatsElements.hp.innerHTML = pokemonstatData.base_stat;
                    pokemonStatsElements.hp.style = `background: linear-gradient(0deg, rgba(0,118,255,1) ${pokemonstatData.base_stat}%, rgba(0,0,0,1) ${pokemonstatData.base_stat}%);`;
                    break;
                case "attack":
                    pokemonStatsElements.attack.innerHTML = pokemonstatData.base_stat;
                    pokemonStatsElements.attack.style = `background: linear-gradient(0deg, rgba(0,118,255,1) ${pokemonstatData.base_stat}%, rgba(0,0,0,1) ${pokemonstatData.base_stat}%);`;
                    break;
                case "defense":
                    pokemonStatsElements.defense.innerHTML = pokemonstatData.base_stat;
                    pokemonStatsElements.defense.style = `background: linear-gradient(0deg, rgba(0,118,255,1) ${pokemonstatData.base_stat}%, rgba(0,0,0,1) ${pokemonstatData.base_stat}%);`;
                    break;
                case "special-attack":
                    pokemonStatsElements.specialAttack.innerHTML = pokemonstatData.base_stat;
                    pokemonStatsElements.specialAttack.style = `background: linear-gradient(0deg, rgba(0,118,255,1) ${pokemonstatData.base_stat}%, rgba(0,0,0,1) ${pokemonstatData.base_stat}%);`;
                    break;
                case "special-defense":
                    pokemonStatsElements.specialDefense.innerHTML = pokemonstatData.base_stat;
                    pokemonStatsElements.specialDefense.style = `background: linear-gradient(0deg, rgba(0,118,255,1) ${pokemonstatData.base_stat}%, rgba(0,0,0,1) ${pokemonstatData.base_stat}%);`;
                    break;  
                case "speed":
                    pokemonStatsElements.speed.innerHTML = pokemonstatData.base_stat;
                    pokemonStatsElements.speed.style = `background: linear-gradient(0deg, rgba(0,118,255,1) ${pokemonstatData.base_stat}%, rgba(0,0,0,1) ${pokemonstatData.base_stat}%);`;
                    break;  
            }
    });
    };

    const processPokemonAbilities = (pokemonData) => {
        let pokemonAbilitiesContent = "";
        pokemonData.abilities?.forEach((pokemonAbilityData) => {
            pokemonAbilitiesContent += `<li> ${pokemonAbilityData.move.name} </li>`;
        });
        containers.pokemonAbilityElement.innerHTML = pokemonAbilitiesContent;
    };

    const processPokemonMoves = (pokemonData) => {
        let pokemonMovesContent = "";
        pokemonData.abilities?.forEach((pokemonMoveData) => {
            pokemonMovesContent += `<li> ${pokemonMoveData.move.name} </li>`;
        });
        containers.pokemonMovesElement.innerHTML = pokemonMovesContent;
    };

    const setLoadin = () => {
        containers.imagenContainer.innerHTML = imageTemplate.replace("") 
    };


};