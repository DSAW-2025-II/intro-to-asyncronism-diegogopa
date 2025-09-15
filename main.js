const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
const inputBuscar = document.querySelector("#buscar");
const btnBuscar = document.querySelector("#btnBuscar");

const modal = document.getElementById("pokemonModal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.getElementById("closeModal");

let URL = "";

// Leer la URL de config.json
fetch("./config.json")
  .then(res => res.json())
  .then(config => {
      URL = config.apiUrl;
      cargarPokemones();
  });

// ---- Cargar y mostrar pokemones ----
function cargarPokemones() {
    for (let i = 1; i <= 151; i++) {
        fetch(URL + i)
            .then(response => response.json())
            .then(data => mostrarPokemon(data));
    }
}

function mostrarPokemon(poke) {
    let tipos = poke.types
        .map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`)
        .join('');

    let pokeId = poke.id.toString().padStart(3, "0");

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
            <div class="pokemon-tipos">${tipos}</div>
            <div class="pokemon-stats">
                <p class="stat">${poke.height} m</p>
                <p class="stat">${poke.weight} kg</p>
            </div>
        </div>
    `;

    // Abrir modal al hacer click
    div.addEventListener("click", () => abrirModal(poke));

    listaPokemon.append(div);
}

// ---- Modal ----
const typeColors = {
    normal: "#A8A878",
    fire: "#F08030",
    water: "#6890F0",
    grass: "#78C850",
    electric: "#F8D030",
    ice: "#98D8D8",
    fighting: "#C03028",
    poison: "#A040A0",
    ground: "#E0C068",
    flying: "#A890F0",
    psychic: "#F85888",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    dark: "#705848",
    dragon: "#7038F8",
    steel: "#B8B8D0",
    fairy: "#F0B6BC"
};
function abrirModal(poke) {
    const primerTipo = poke.types[0].type.name;
    const colorFondo = typeColors[primerTipo] || "#fff";

    modalBody.innerHTML = `
        <h2>${poke.name.toUpperCase()} (#${poke.id})</h2>
        <img src="${poke.sprites.other["official-artwork"].front_default}" 
             alt="${poke.name}" style="max-width:150px">
        <p><strong>Altura:</strong> ${poke.height} m</p>
        <p><strong>Peso:</strong> ${poke.weight} kg</p>
        <p><strong>Experiencia base:</strong> ${poke.base_experience}</p>
        <p><strong>Habilidades:</strong> 
           ${poke.abilities.map(a => a.ability.name).join(", ")}
        </p>
    `;

    const modalContent = document.querySelector(".modal-content");
    modalContent.style.backgroundColor = colorFondo;

    // Cambiar color del texto si el fondo es oscuro
    const tiposOscuros = ["dark", "ghost", "dragon", "fire", "fighting"];
    modalContent.style.color = tiposOscuros.includes(primerTipo) ? "#fff" : "#000";

    modal.style.display = "flex";
}
closeModal.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
});

// ---- Filtros por tipo ----
botonesHeader.forEach(boton => 
    boton.addEventListener("click", (event) => {
        const botonId = event.currentTarget.id;
        listaPokemon.innerHTML = "";

        for (let i = 1; i <= 151; i++) {
            fetch(URL + i)
                .then(response => response.json())
                .then(data => {
                    if(botonId === "ver-todos") {
                        mostrarPokemon(data);
                    } else {
                        const tipos = data.types.map(type => type.type.name);
                        if (tipos.some(tipo => tipo.includes(botonId))) {
                            mostrarPokemon(data);
                        }
                    }
                });
        }
    })
);

// ---- Buscador ----
btnBuscar.addEventListener("click", () => {
    const nombre = inputBuscar.value.toLowerCase().trim();
    if (nombre === "") return;

    listaPokemon.innerHTML = "";

    fetch(URL + nombre)
        .then(res => {
            if (!res.ok) throw new Error("Pokémon no encontrado");
            return res.json();
        })
        .then(data => mostrarPokemon(data))
        .catch(() => {
            listaPokemon.innerHTML =
                `<p style="text-align:center;color:red;font-weight:bold">
                    No se encontró el Pokémon
                </p>`;
        });
});

inputBuscar.addEventListener("keypress", (e) => {
    if (e.key === "Enter") btnBuscar.click();
});