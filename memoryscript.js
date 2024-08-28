import { vibrate, showNotification, animateLevelTransition, celebrateWithConfettiAndFireworks, showGoldStar } from './animations.js';
console.log("Memory script loading");


let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let currentLevel = 1;
let devModeActivated = false;
let konami = '';
const konamiCode = 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightba';

const images = [
    { name: 'alfons', url: 'https://alfonskulturhus.se/wp-content/uploads/2019/07/hurlangt_9_Alfons_FRI_press-756x1024.png' },
    { name: 'alfons_pappa', url: 'https://kokbockerstorage.blob.core.windows.net/uploads/9cf45253-d17c-4405-a10b-9d4abe1fe3e5/alfons-aberg-pappa.JPG' },
    { name: 'ghost', url: 'https://www.hasbro.com/common/productimages/en_US/0B40D7060120430A80B6050603CD72B9/1e94007662714e011a8af9f7e7c3c37fe5d148e7.jpg' },
    { name: 'spidey', url: 'https://m.media-amazon.com/images/I/61xe57KkQTL.jpg' },
    { name: 'spin', url: 'https://standingstills.com/cdn/shop/products/CAD846-1-1.jpg?v=1648686392' },
    { name: 'chase', url: 'https://media.hornbach.se/hb/packshot/as.73869720.jpg?dvid=8' },
    { name: 'rubble', url: 'https://assets-global.website-files.com/63f8f02e35d18441043c9041/6480cfba9a811083fadca42d_rubble-poster.jpg' },
    { name: 'skye', url: 'https://i.ebayimg.com/images/g/OwwAAOSwqSted-Jv/s-l1200.webp' },
    { name: 'bamse', url: 'https://upload.wikimedia.org/wikipedia/en/1/15/Bamse.png' },
    { name: 'vargen', url: 'https://stockholmsbif.se/wp-content/uploads/Vargen-trans500x500-500x433.gif' },
    { name: 'bingo', url: 'https://i.pinimg.com/474x/80/57/c9/8057c952e66099c111647a9ddca6a107.jpg' },
    { name: 'muffin', url: 'https://pyxis.nymag.com/v1/imgs/8df/eaa/e2fdd619c0f046f7ea195208387d7bd1d6-bluey-muffin-lede.rhorizontal.w700.jpg' }
];

const blueyCard = { name: 'bluey', url: 'https://www.bluey.tv/wp-content/uploads/2023/07/Bluey.png' };

function initializeGame() {
    console.log("Initializing game...");
    const board = document.getElementById('memory-board');
    console.log("Memory board element:", board);
    if (!board) {
        console.error("Memory board element not found!"); 
        return;
    }
    board.innerHTML = '';
    
    cards = []; // Reset cards array
    flippedCards = []; // Reset flipped cards

    let gridSize, numPairs, totalCards;
    switch(currentLevel) {
        case 1:
            gridSize = 3;
            numPairs = 4;
            totalCards = 9; // 8 kort + 1 Bluey
            break;
        case 2:
            gridSize = 4;
            numPairs = 8;
            totalCards = 16;
            break;
        case 3:
            gridSize = 5;
            numPairs = 12;
            totalCards = 25;
            break;
        default:
            gridSize = 3;
            numPairs = 4;
            totalCards = 9;
    }
    
    const isLandscape = window.innerWidth > window.innerHeight;
    if (currentLevel === 1 && isLandscape) {
        board.style.gridTemplateColumns = 'repeat(3, 1fr)';
        board.style.gridTemplateRows = 'repeat(3, 1fr)';
    } else {
        board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        board.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
    }

    let selectedImages = shuffleArray([...images]).slice(0, numPairs);
    cards = [...selectedImages, ...selectedImages];
    shuffleArray(cards);
    
    if (currentLevel === 3) {
        // För nivå 3, lägg till Bluey i mitten (index 12)
        cards.splice(12, 0, blueyCard);
    } else if (currentLevel === 1) {
        // För nivå 1, lägg till Bluey i mitten (index 4)
        cards.splice(4, 0, blueyCard);
    }

    cards.forEach((image, index) => {
        const card = createCard(image, index);
        if (image.name === 'bluey') {
            card.classList.add('flipped');
            card.classList.add('matched');
        }
        board.appendChild(card);
    });

    matchedPairs = 0;
    updateUI();

    console.log("Game initialized. Number of cards:", cards.length);
}

function createCard(image, index) {
    console.log(`Creating card for image: ${image.name}, index: ${index}`);
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.index = index;
    card.innerHTML = `
        <div class="card-inner">
            <div class="card-front"></div>
            <div class="card-back">
                <img src="${image.url}" alt="${image.name}">
            </div>
        </div>
    `;
    card.addEventListener('click', handleCardClick);
    console.log('Card created:', card);
    return card;
}

function handleCardClick(event) {
    console.log('Card clicked:', event.currentTarget);
    const card = event.currentTarget;
    flipCard(card);
}

function flipCard(card) {
    console.log('Attempting to flip card:', card);
    const index = parseInt(card.dataset.index);
    console.log('Card index:', index);
    if (isNaN(index)) {
        console.error("Invalid card index:", card.dataset.index);
        return;
    }
    
    console.log('Flipped cards:', flippedCards);
    console.log('Card classList:', card.classList);
    
    if (flippedCards.length < 2 && !card.classList.contains('flipped') && !card.classList.contains('matched')) {
        card.classList.add('flipped');
        flippedCards.push({card, index});
        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 500); // Minska fördröjningen till 500ms
        }
    }
}

function checkMatch() {
    if (flippedCards.length !== 2) {
        console.error("Unexpected number of flipped cards:", flippedCards.length);
        return;
    }

    const [card1, card2] = flippedCards;
    if (cards[card1.index].url === cards[card2.index].url) {
        card1.card.classList.add('matched');
        card2.card.classList.add('matched');
        matchedPairs++;
        showGoldStar(currentLevel); // Visa stjärnan centrerat baserat på aktuell nivå
        updateUI();
        checkLevelCompletion();
    } else {
        setTimeout(() => {
            vibrate(200); // Vibrera när ett felaktigt par har valts
        }, 200); // Kort fördröjning innan vibrationen startar

        setTimeout(() => {
            card1.card.classList.remove('flipped');
            card2.card.classList.remove('flipped');
        }, 700); // Ge lite mer tid innan korten vänds tillbaka
    }
    flippedCards = [];
}

function updateUI() {
    document.getElementById('level-title').textContent = `Nivå ${currentLevel}`;
    const board = document.getElementById('memory-board');
    board.className = `memory-board level-${currentLevel}`;
}

function checkLevelCompletion() {
    const requiredPairs = currentLevel === 1 ? 4 : (currentLevel === 2 ? 8 : 12);
    if (matchedPairs >= requiredPairs) {
        if (currentLevel < 3) {
            animateLevelTransition(currentLevel, () => {
                currentLevel++;
                initializeGame();
            });
        } else {
            animateLevelTransition(currentLevel, () => {
                showNotification("Grattis! Du har klarat alla nivåer!");
                // Stanna kvar på nivå 3 istället för att återställa
            });
        }
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function activateDevMode() {
    devModeActivated = true;
    console.log('Dev mode activated');
    showNotification('Dev mode activated');
}

function completeLevel() {
    const allCards = document.querySelectorAll('.card:not(.matched)');
    allCards.forEach(card => {
        card.classList.add('flipped');
        card.classList.add('matched');
    });
    
    // Uppdatera matchedPairs baserat på aktuell nivå
    switch(currentLevel) {
        case 1:
            matchedPairs = 4;
            break;
        case 2:
            matchedPairs = 8;
            break;
        case 3:
            matchedPairs = 12;
            break;
    }
    
    // Använd setTimeout för att låta DOM uppdateras innan vi kontrollerar nivåavslutning
    setTimeout(() => {
        checkLevelCompletion();
    }, 100);
}

function resetGame() {
    currentLevel = 1;
    matchedPairs = 0;
    flippedCards = [];
    cards = [];
    initializeGame();
    updateUI();
}

window.onload = () => {
    console.log("Window loaded");
    const startScreen = document.getElementById('start-screen');
    const startButton = document.getElementById('start-button');
    const gameScreen = document.getElementById('game-screen');
    const fullscreenButton = document.getElementById('fullscreen-button');
    const resetButton = document.getElementById('reset-button'); // Lägg till denna rad

    startButton.addEventListener('click', () => {
        startScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        initializeGame();
    });

    if (fullscreenButton) {
        fullscreenButton.addEventListener('click', toggleFullscreen);
    } else {
        console.error("Fullscreen button not found!");
    }

    if (resetButton) {
        resetButton.addEventListener('click', resetGame);
    } else {
        console.error("Reset button not found!");
    }

    document.addEventListener('keydown', (e) => {
        konami += e.key;
        if (konamiCode.indexOf(konami) !== 0) {
            konami = '';
            return;
        }
        if (konami === konamiCode) {
            activateDevMode();
            konami = '';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (devModeActivated && e.key === 'c') {
            completeLevel();
        }
    });
};

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) { // Firefox
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari och Opera
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) { // Internet Explorer/Edge
            document.documentElement.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari och Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // Internet Explorer/Edge
            document.msExitFullscreen();
        }
    }
}

console.log("Memory script loaded");