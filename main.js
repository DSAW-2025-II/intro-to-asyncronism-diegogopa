const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");

let URL = "";

fetch("./config.json")
  .then(res => res.json())
  .then(config => {
      URL = config.apiUrl;
      cargarPokemones();
  });

function cargarPokemones() {
    for (let i = 1; i <= 151; i++) {
        fetch(URL + i)
            .then((response) => response.json())
            .then(data => mostrarPokemon(data));
    }
}

function mostrarPokemon(poke) {
    let tipos = poke.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`);
    tipos = tipos.join('');

    let pokeId = poke.id.toString();
    if (pokeId.length === 1) {
        pokeId = "00" + pokeId;
    } else if (pokeId.length === 2) {
        pokeId = "0" + pokeId;
    }

    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
        <p class="pokemon-id-back">#${pokeId}</p>
        <div class="pokemon-imagen">
            <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">#${pokeId}</p>
                <h2 class="pokemon-nombre">${poke.name}</h2>
            </div>
            <div class="pokemon-tipos">
                ${tipos}
            </div>
            <div class="pokemon-stats">
                <p class="stat">${poke.height}m</p>
                <p class="stat">${poke.weight}kg</p>
            </div>
        </div>
    `;
    listaPokemon.append(div);
}

// 🔹 Filtros por tipo
botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
    const botonId = event.currentTarget.id;
    listaPokemon.innerHTML = "";

    for (let i = 1; i <= 151; i++) {
        fetch(URL + i)
            .then((response) => response.json())
            .then(data => {
                if(botonId === "ver-todos") {
                    mostrarPokemon(data);
                } else {
                    const tipos = data.types.map(type => type.type.name);
                    if (tipos.some(tipo => tipo.includes(botonId))) {
                        mostrarPokemon(data);
                    }
                }
            })
    }
}));

// 🔍 Buscador por nombre o número
const inputBuscar = document.querySelector("#buscar");
const btnBuscar = document.querySelector("#btnBuscar");

btnBuscar.addEventListener("click", () => {
    const nombre = inputBuscar.value.toLowerCase().trim();
    if (nombre === "") return;

    listaPokemon.innerHTML = ""; // limpiar resultados

    fetch(URL + nombre)
        .then(res => {
            if (!res.ok) {
                throw new Error("Pokémon no encontrado");
            }
            return res.json();
        })
        .then(data => mostrarPokemon(data))
        .catch(() => {
            listaPokemon.innerHTML = `<p style="text-align:center;color:red;font-weight:bold">No se encontró el Pokémon</p>`;
        });
});

// Permitir buscar con Enter
inputBuscar.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        btnBuscar.click();
    }
});