console.log("Animations script loading");

export function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '50%';
    notification.style.left = '50%';
    notification.style.transform = 'translate(-50%, -50%)';
    notification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    notification.style.color = 'white';
    notification.style.padding = '20px';
    notification.style.borderRadius = '10px';
    notification.style.zIndex = '1000';
    notification.style.fontSize = '24px';
    notification.style.textAlign = 'center';
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 1500);
}

export function animateLevelTransition(currentLevel, callback) {
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

export function vibrate(duration) {
    console.log("Vibrate function called with duration:", duration);
    if ('vibrate' in navigator) {
        console.log("Vibration API is available");
        navigator.vibrate(duration);
    } else {
        console.log("Vibration API is not available");
    }
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

export function celebrateWithConfettiAndFireworks() {
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

export function showGoldStar(currentLevel) {
    const star = document.createElement('div');
    star.textContent = '⭐';
    star.style.position = 'fixed';
    star.style.fontSize = '100px';
    star.style.zIndex = '1000';
    star.style.pointerEvents = 'none';
    star.style.animation = 'pop-and-fade 1s ease-out';

    const board = document.getElementById('memory-board');
    const rect = board.getBoundingClientRect();

    star.style.left = `${rect.left + rect.width / 2}px`;
    star.style.top = `${rect.top + rect.height / 2}px`;
    star.style.transform = 'translate(-50%, -50%)';

    document.body.appendChild(star);

    setTimeout(() => {
        document.body.removeChild(star);
    }, 1000);
}

console.log("Animations script loaded");