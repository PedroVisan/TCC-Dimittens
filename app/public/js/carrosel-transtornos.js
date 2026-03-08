document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const cards = Array.from(track.children);
    const numberOfCardsVisible = 3;
    const totalCards = cards.length;
    let currentIndex = 0;
    let isDragging = false;

    const updateCardWidth = () => {
        return cards[0].getBoundingClientRect().width;
    };

    let cardWidth = updateCardWidth();
    track.style.transform = `translateX(0px)`;

    const moveToCard = (index) => {
        track.style.transition = 'transform 0.5s ease-in-out';
        track.style.transform = `translateX(-${cardWidth * index}px)`;
        currentIndex = index;
    };

    const cloneCards = () => {
        const firstCards = cards.slice(0, numberOfCardsVisible).map(card => card.cloneNode(true));
        const lastCards = cards.slice(-numberOfCardsVisible).map(card => card.cloneNode(true));

        firstCards.forEach(card => track.appendChild(card));
        lastCards.forEach(card => track.insertBefore(card, cards[0]));
    };

    cloneCards();

    const newCards = Array.from(track.children);

    const resetTrack = () => {
        track.style.transition = 'none';
        track.style.transform = `translateX(0)`;
        currentIndex = 0;
    };

    const moveLeft = () => {
        if (currentIndex < totalCards) {
            currentIndex++;
            moveToCard(currentIndex);
        }
        if (currentIndex === totalCards) {
            setTimeout(resetTrack, 500);
        }
    };

    const moveRight = () => {
        if (currentIndex > 0) {
            currentIndex--;
            moveToCard(currentIndex);
        }
        if (currentIndex === 0) {
            setTimeout(resetTrack, 500);
        }
    };

    let startX;

    track.addEventListener('mousedown', (e) => {
        startX = e.pageX;
        isDragging = true;
        track.style.userSelect = 'none';
    });

    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX;
        isDragging = true;
        track.style.userSelect = 'none';
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            track.style.userSelect = 'auto';
        }
    });

    document.addEventListener('touchend', () => {
        if (isDragging) {
            isDragging = false;
            track.style.userSelect = 'auto';
        }
    });

    track.addEventListener('mousemove', (e) => {
        if (isDragging) {
            e.preventDefault();
        }
    });

    track.addEventListener('touchmove', (e) => {
        if (isDragging) {
            e.preventDefault();
        }
    });

    track.addEventListener('mouseup', (e) => {
        if (isDragging) {
            const endX = e.pageX;
            if (startX > endX) {
                moveLeft();
            } else {
                moveRight();
            }
        }
    });

    track.addEventListener('touchend', (e) => {
        if (isDragging) {
            const endX = e.changedTouches[0].pageX;
            if (startX > endX) {
                moveLeft();
            } else {
                moveRight();
            }
        }
    });

    window.addEventListener('resize', () => {
        cardWidth = updateCardWidth();
        resetTrack();
    });
});
