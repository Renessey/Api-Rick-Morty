const API_URL = 'https://rickandmortyapi.com/api/character/';
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search');
const cardsContainer = document.getElementById('cards');
const favoritesContainer = document.getElementById('favorites');
const favoritesToggleBtn = document.getElementById('favorites-toggle');

// Elementos do modal
const modal = document.getElementById('info-modal');
const modalContent = document.getElementById('modal-body');
const closeModalBtn = document.querySelector('.close-btn');

// Dicionário de traduções para os status
const statusTranslations = {
    'Alive': 'Vivo',
    'Dead': 'Morto',
    'unknown': 'Desconhecido'
};

// Função para buscar personagens
async function fetchCharacters(query = '') {
    const response = await fetch(`${API_URL}?name=${query}`);
    const data = await response.json();
    displayCharacters(data.results);
}

// Função para exibir personagens
function displayCharacters(characters) {
    cardsContainer.innerHTML = ''; // Limpa o container
    if (characters) {
        characters.forEach(character => {
            const card = document.createElement('div');
            card.className = 'card';
            const isFavorite = checkIfFavorite(character.id);
            card.innerHTML = `
                <img src="${character.image}" alt="${character.name}" onclick="openModal('${character.image}')">
                <h3>${character.name}</h3>
                <p>Status: ${statusTranslations[character.status] || character.status}</p>
                <button class="button" onclick="toggleFavorite(${character.id})">
                    <i class="fas ${isFavorite ? 'fa-heart' : 'fa-heart-broken'}"></i>
                </button>
                <button class="info-button" onclick="showInfo('${character.name}', '${character.status}', '${character.species}', '${character.gender}', '${character.origin.name}')">Info</button>
            `;
            cardsContainer.appendChild(card);
        });
    }
}

// Função para exibir informações detalhadas no modal
function showInfo(name, status, species, gender, origin) {
    modalContent.innerHTML = `
        <h2>${name}</h2>
        <p>Status: ${statusTranslations[status] || status}</p>
        <p>Espécie: ${species}</p>
        <p>Gênero: ${gender}</p>
        <p>Origem: ${origin}</p>
    `;
    modal.style.display = 'block'; // Mostra o modal
}

// Fecha o modal ao clicar no botão de fechar
closeModalBtn.onclick = function () {
    modal.style.display = 'none';
}

// Fecha o modal ao clicar fora dele
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Função para verificar se o personagem está favoritado
function checkIfFavorite(id) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    return favorites.includes(id);
}

// Função para favoritar personagens
function toggleFavorite(id) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (favorites.includes(id)) {
        favorites = favorites.filter(favId => favId !== id);
    } else {
        favorites.push(id);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites(); // Atualiza a lista de favoritos
    displayCharacters(); // Atualiza a lista de personagens exibidos
}

// Função para exibir favoritos
async function displayFavorites() {
    favoritesContainer.innerHTML = ''; // Limpa o container
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    // Se não houver favoritos, não faz nada
    if (favorites.length === 0) return; 

    for (const id of favorites) {
        const response = await fetch(`${API_URL}${id}`);
        if (response.ok) { // Verifica se a resposta é válida
            const character = await response.json();
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${character.image}" alt="${character.name}" onclick="openModal('${character.image}')">
                <h3>${character.name}</h3>
                <p>Status: ${statusTranslations[character.status] || character.status}</p>
                <button class="button" onclick="toggleFavorite(${character.id})">
                    <i class="fas fa-heart"></i> Remover Favorito
                </button>
            `;
            favoritesContainer.appendChild(card);
        }
    }
}

// Função para mostrar/ocultar os favoritos
function toggleFavoritesDisplay() {
    if (favoritesContainer.style.display === 'none' || favoritesContainer.style.display === '') {
        favoritesContainer.style.display = 'block';
        favoritesToggleBtn.textContent = 'Ocultar Favoritos';
    } else {
        favoritesContainer.style.display = 'none';
        favoritesToggleBtn.textContent = 'Mostrar Favoritos';
    }
}

// Evento de pesquisa ao clicar no botão
searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) fetchCharacters(query);
});

// Evento de pesquisa ao pressionar Enter
searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) fetchCharacters(query);
    }
});

// Evento para mostrar/ocultar favoritos
favoritesToggleBtn.addEventListener('click', toggleFavoritesDisplay);

// Inicializa a exibição de favoritos como oculta
favoritesContainer.style.display = 'none';

// Exibe os favoritos ao carregar a página
displayFavorites();
