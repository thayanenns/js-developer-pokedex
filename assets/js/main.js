const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
const pokemonCard = document.getElementById('pokemonCard');
const modal = document.getElementById('pokemonModal'); 
const closeButton = document.querySelector('.close-button');
const detailsButton = document.querySelector('.details-button');
const modalPokemonName = document.getElementById('modalPokemonName');
const modalPokemonImage = document.getElementById('modalPokemonImage');
const modalPokemonTypes = document.getElementById('modalPokemonTypes');
const modalPokemonWeight = document.getElementById('modalPokemonWeight');
const modalPokemonHeight = document.getElementById('modalPokemonHeight');

const maxRecords = 151;
const limit = 10;
let offset = 0;

function convertPokemonToLi(pokemon) {
    console.log('Weight:', pokemon.weight);
    console.log('Height:', pokemon.height);
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>
            <button class="details-button" data-modal="pokemonModal" data-number="${pokemon.number}" data-name="${pokemon.name}" data-photo="${pokemon.photo}" data-type="${pokemon.type}" data-weight="${pokemon.weight}" data-height="${pokemon.height}">Ver detalhes</button>

            <div class="detail">
            <ol class="types">
                ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
            </ol>
            
            <img src="${pokemon.photo}" alt="${pokemon.name}">
        </div>
        </li>
    `;
}

function loadPokemonItems(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('');
        pokemonList.innerHTML += newHtml;
    });
}

loadPokemonItems(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdRecordsWithNextPage = offset + limit;

    if (qtdRecordsWithNextPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItems(offset, newLimit);

        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItems(offset, limit);
    }
});

pokemonList.addEventListener('click', (event) => {
    if (event.target.classList.contains('details-button')) {
        const button = event.target;
        const pokemonNumber = button.dataset.number;
        const pokemonName = button.dataset.name;
        const pokemonPhoto = button.dataset.photo;
        const pokemonType = button.dataset.type;
        const pokemonWeight = button.dataset.weight;
        const pokemonHeight = button.dataset.height;

        modalPokemonName.textContent = `#${pokemonNumber} - ${pokemonName}`;
        modalPokemonImage.src = pokemonPhoto;
        modalPokemonTypes.textContent = `Types: ${pokemonType}`;
        modalPokemonWeight.textContent = `${pokemonWeight} kg`;
        modalPokemonHeight.textContent = `${pokemonHeight} m`;
    
        modal.style.display = 'block';
    }
});

closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

async function fetchPokemonDetails(pokemonName) {
    try {
        const response = await pokeApi.getPokemonDetail({ url: `https://pokeapi.co/api/v2/pokemon/${pokemonName}` });
        const abilities = await fetchPokemonAbilities(response.id);
        const weight = response.weight ; 
        const height = response.height; 
    
        return { ...response, abilities, weight, height };
    } catch (error) {
        console.error('Erro ao buscar detalhes do Pokémon:', error);
        return null;
    }
}
