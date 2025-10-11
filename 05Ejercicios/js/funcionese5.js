function calcular(){
    const hombres = document.getElementById("hombres").value;
    const mujeres = document.getElementById("mujeres").value;

    const hombresi = parseInt(hombres);
    const mujeresi = parseInt(mujeres);

    const total = hombresi + mujeresi;

    document.getElementById("hombrespor").value = ((hombresi*100)/total).toFixed(2) + "%";
    document.getElementById("mujerespor").value = ((mujeresi*100)/total).toFixed(2) + "%";
}

function borrar(){
    document.getElementById("hombres").value = " ";
    document.getElementById("mujeres").value = " ";
    document.getElementById("hombrespor").value = " ";
    document.getElementById("mujerespor").value = " ";
}