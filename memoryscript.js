console.log("Script is running");

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

    let gridSize, numPairs;
    switch(currentLevel) {
        case 1:
            gridSize = 3;
            numPairs = 4;
            break;
        case 2:
            gridSize = 4;
            numPairs = 8;
            break;
        case 3:
            gridSize = 5;
            numPairs = 12;
            break;
        default:
            gridSize = 3;
            numPairs = 4;
    }
    
    board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

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
            setTimeout(checkMatch, 1000);
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
        updateUI();
        checkLevelCompletion();
    } else {
        card1.card.classList.remove('flipped');
        card2.card.classList.remove('flipped');
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
            animateLevelTransition(() => {
                currentLevel++;
                initializeGame();
            });
        } else {
            animateLevelTransition(() => {
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

function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '10px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    notification.style.color = 'white';
    notification.style.padding = '10px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '1000';
    document.body.appendChild(notification);
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}

function animateLevelTransition(callback) {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '1000';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.5s ease-in-out';

    const message = document.createElement('div');
    message.textContent = `Nivå ${currentLevel} avklarad!`;
    message.style.color = 'white';
    message.style.fontSize = '2em';
    message.style.fontWeight = 'bold';

    overlay.appendChild(message);
    document.body.appendChild(overlay);

    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 50);

    if (currentLevel < 3) {
        addBalloons();
    } else {
        console.log("Calling celebrateWithConfettiAndFireworks for level 3");
        celebrateWithConfettiAndFireworks();
    }

    setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(overlay);
            callback();
        }, 500);
    }, 2000);
}

function createBalloon() {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.style.left = `${Math.random() * 100}vw`;
    balloon.style.animationDuration = `${Math.random() * 2 + 3}s`; // Mellan 3-5 sekunder
    balloon.style.backgroundColor = `hsl(${Math.random() * 360}, 50%, 50%)`; // Slumpmässig färg
    return balloon;
}

function addBalloons() {
    const balloonContainer = document.createElement('div');
    balloonContainer.className = 'balloon-container';
    for (let i = 0; i < 20; i++) {
        balloonContainer.appendChild(createBalloon());
    }
    document.body.appendChild(balloonContainer);
    setTimeout(() => {
        document.body.removeChild(balloonContainer);
    }, 5000); // Ta bort ballongerna efter 5 sekunder
}

function createConfetti() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    return confetti;
}

function createFirework() {
    const firework = document.createElement('div');
    firework.className = 'firework';
    firework.style.left = `${Math.random() * 100}vw`;
    firework.style.top = `${Math.random() * 100}vh`;
    firework.style.animationDuration = `${Math.random() * 0.3 + 0.5}s`;
    return firework;
}

function celebrateWithConfettiAndFireworks() {
    console.log("Celebrating with confetti and fireworks");
    const container = document.createElement('div');
    container.className = 'celebration-container';
    
    // Lägg till konfetti
    for (let i = 0; i < 100; i++) {
        const confetti = createConfetti();
        container.appendChild(confetti);
        console.log("Added confetti:", confetti);
    }
    
    // Lägg till fyrverkerier
    for (let i = 0; i < 20; i++) {
        const firework = createFirework();
        container.appendChild(firework);
        console.log("Added firework:", firework);
    }
    
    document.body.appendChild(container);
    console.log("Celebration container added to body:", container);
    
    setTimeout(() => {
        document.body.removeChild(container);
        console.log("Celebration container removed");
    }, 5000);
}

window.onload = () => {
    console.log("Window loaded");
    const startScreen = document.getElementById('start-screen');
    const startButton = document.getElementById('start-button');
    const gameScreen = document.getElementById('game-screen');

    console.log("Start screen:", startScreen);
    console.log("Start button:", startButton);
    console.log("Game screen:", gameScreen);

    if (!startButton) {
        console.error("Start button not found!");
        return;
    }

    startButton.addEventListener('click', () => {
        console.log("Start button clicked");
        try {
            startScreen.style.display = 'none';
            gameScreen.style.display = 'flex';
            initializeGame();
        } catch (error) {
            console.error("Error when starting game:", error);
        }
    });

    const resetButton = document.getElementById('reset-button');
    const fullscreenButton = document.getElementById('fullscreen-button');

    resetButton.addEventListener('click', () => {
        currentLevel = 1;
        initializeGame();
    });

    fullscreenButton.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    });

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

console.log("Memory script loaded");