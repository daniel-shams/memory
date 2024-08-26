const images = [
    { name: 'alfons', url: 'https://alfonskulturhus.se/wp-content/uploads/2019/07/hurlangt_9_Alfons_FRI_press-756x1024.png' },
    { name: 'alfonspappa', url: 'https://kokbockerstorage.blob.core.windows.net/uploads/9cf45253-d17c-4405-a10b-9d4abe1fe3e5/alfons-aberg-pappa.JPG' },
    { name: 'ghost', url: 'https://www.hasbro.com/common/productimages/en_US/0B40D7060120430A80B6050603CD72B9/1e94007662714e011a8af9f7e7c3c37fe5d148e7.jpg' },
    { name: 'miles', url: 'https://m.media-amazon.com/images/I/61xe57KkQTL.jpg' },
    { name: 'rubble', url: 'https://assets-global.website-files.com/63f8f02e35d18441043c9041/6480cfba9a811083fadca42d_rubble-poster.jpg' },
    { name: 'skye', url: 'https://i.ebayimg.com/images/g/OwwAAOSwqSted-Jv/s-l1200.webp' },
    { name: 'bamse', url: 'https://upload.wikimedia.org/wikipedia/en/1/15/Bamse.png' },
    { name: 'vargen', url: 'https://stockholmsbif.se/wp-content/uploads/Vargen-trans500x500-500x433.gif' },
    { name: 'chase', url: 'https://gallery.yopriceville.com/var/albums/Free-Clipart-Pictures/Cartoons-PNG/Chase_PAW_Patrol_PNG_Cartoon_Image.png?m=1630036802' },
    { name: 'spin', url: 'https://standingstills.com/cdn/shop/products/CAD846-1-1.jpg?v=1648686392' }
];

let cards = [];
let flippedCards = [];
let matchedPairs = 0;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createCard(image) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.image = image.name;
    card.innerHTML = `
        <div class="card-inner">
            <div class="card-front"></div>
            <div class="card-back">
                <img src="${image.url}" alt="${image.name}" onerror="console.error('Failed to load image:', this.src);">
            </div>
        </div>
    `;
    card.addEventListener('click', () => flipCard(card));
    return card;
}

function flipCard(card) {
    if (flippedCards.length < 2 && !card.classList.contains('flipped') && !card.classList.contains('matched')) {
        card.classList.add('flipped');
        flippedCards.push(card);
        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 1000);
        }
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.image === card2.dataset.image) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        updateCounter();
        showNotification('Bra jobbat!');
        if (matchedPairs === images.length) {
            celebrateWin();
        }
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
    }
    flippedCards = [];
}

function updateCounter() {
    document.getElementById('counter').textContent = `Hittade par: ${matchedPairs}`;
}

function resetGame() {
    const board = document.getElementById('memoryBoard');
    board.innerHTML = '';
    cards = [...images, ...images];
    shuffleArray(cards);
    cards.forEach(image => {
        board.appendChild(createCard(image));
    });
    matchedPairs = 0;
    updateCounter();
}

function giveHint() {
    const unmatched = images.filter(img => !document.querySelector(`.card[data-image="${img.name}"].matched`));
    if (unmatched.length > 0) {
        const hintCard = unmatched[Math.floor(Math.random() * unmatched.length)];
        const hintElements = document.querySelectorAll(`.card[data-image="${hintCard.name}"]:not(.matched)`);
        hintElements.forEach(el => el.classList.add('flipped'));
        setTimeout(() => {
            hintElements.forEach(el => el.classList.remove('flipped'));
        }, 2000);
    }
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 1500);
}

document.getElementById('fullscreenButton').addEventListener('click', () => {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
    }
});

const startButton = document.getElementById('startButton');
const startScreen = document.getElementById('startScreen');
const gameBoard = document.getElementById('gameBoard');

startButton.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    gameBoard.classList.remove('hidden');
    resetGame();
});

// Ändra window.onload funktionen längst ner i filen till:

window.onload = () => {
    startScreen.classList.remove('hidden');
    gameBoard.classList.add('hidden');
};

// Lägg till följande funktion i slutet av din JavaScript-fil

function createBalloons() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080'];
    const balloonContainer = document.createElement('div');
    balloonContainer.className = 'balloon-container';
    document.body.appendChild(balloonContainer);

    for (let i = 0; i < 100; i++) {  // Ökat till 100 ballonger
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.style.left = `${Math.random() * 100}%`;
        balloon.style.animationDuration = `${Math.random() * 2 + 2}s`;  // Mellan 2 och 4 sekunder
        balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Lägg till en sträng till ballongen
        const string = document.createElement('div');
        string.className = 'balloon-string';
        balloon.appendChild(string);

        balloonContainer.appendChild(balloon);
    }

    setTimeout(() => {
        balloonContainer.remove();
    }, 4000);  // Minskat till 4 sekunder för att matcha den kortare animationen
}

function celebrateWin() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.add('flipped');
        card.classList.add('matched');
    });
    matchedPairs = images.length;
    updateCounter();
    createBalloons();  // Skapa ballonger först
    setTimeout(() => {
        showNotification('Grattis! Du klarade det!');
    }, 100);  // Kort fördröjning för att säkerställa att ballongerna börjar falla först
}

// Lägg till denna eventListener efter att DOM:en har laddats
document.addEventListener('DOMContentLoaded', () => {
    const devButton = document.getElementById('devButton');
    if (devButton) {
        devButton.addEventListener('click', celebrateWin);
    }
});

// Se till att denna kod finns i din initGame eller resetGame funktion
document.getElementById('devButton').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        celebrateWin();
    }
});

// Ny funktion för att visa alla kort
function showAllCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.add('flipped');
    });
}

// Lägg till en ny knapp för "dev (complete)"
const devCompleteButton = document.createElement('button');
devCompleteButton.textContent = 'Dev (Complete)';
devCompleteButton.addEventListener('click', showAllCards);
document.body.insertBefore(devCompleteButton, gameContainer);

const cardImages = [
    'https://i.imgur.com/MK1VZsR.png', // Chase
    'https://i.imgur.com/8cSECzX.png', // Skye
    'https://i.imgur.com/PGN1nrj.png', // Marshall
    'https://i.imgur.com/TZY7PYF.png', // Rubble
    'https://i.imgur.com/JMNJgGQ.png', // Rocky
    'https://i.imgur.com/lfm5Nw2.png', // Zuma
    'https://i.imgur.com/Zp0DvYn.png', // Ryder
    'https://i.imgur.com/dLG5cfJ.png', // Everest
    'https://i.imgur.com/8QZgd5O.png', // Tracker
    'https://standingstills.com/cdn/shop/products/CAD846-1-1.jpg?v=1648686392', // Ghost Spidey (Spin)
];

function createCards() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    const shuffledImages = shuffle([...cardImages, ...cardImages]);

    for (let i = 0; i < 20; i++) {
        // ... befintlig kod för att skapa kort ...
    }
}