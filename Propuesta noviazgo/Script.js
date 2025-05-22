let cartaAbierta = false;

document.addEventListener('DOMContentLoaded', function() {
    // Elementos principales
    const heartButton = document.getElementById('heartButton');
    const heartDeco = document.getElementById('heartDeco');
    const lock = document.getElementById('lock');
    const container = document.querySelector('.container');
    let isDraggingHeart = false;
    let offsetHeartX = 0;
    let offsetHeartY = 0;
    let isDraggingDeco = false;
    let offsetDecoX = 0;
    let offsetDecoY = 0;

    // --- Funciones para obtener coordenadas según mouse o touch ---
    function getClientX(e) {
        return e.touches ? e.touches[0].clientX : e.clientX;
    }
    function getClientY(e) {
        return e.touches ? e.touches[0].clientY : e.clientY;
    }

    // --- Función para verificar si un corazón está sobre el candado ---
    function isOverLock(heart) {
        const heartRect = heart.getBoundingClientRect();
        const lockRect = lock.getBoundingClientRect();
        return !(
            heartRect.right < lockRect.left ||
            heartRect.left > lockRect.right ||
            heartRect.bottom < lockRect.top ||
            heartRect.top > lockRect.bottom
        );
    }

    // --- Función para intentar abrir la carta ---
    function tryOpenCard() {
        if (!cartaAbierta && isOverLock(heartButton) && isOverLock(heartDeco)) {
            container.classList.add('abierta');
            cartaAbierta = true;
        }
    }

    // --- Corazón principal (liz) arrastrable ---
    if (heartButton) {
        heartButton.style.position = 'absolute';
        heartButton.style.left = '100px';
        heartButton.style.top = '100px';

        // Mouse
        heartButton.addEventListener('mousedown', function(e) {
            isDraggingHeart = true;
            offsetHeartX = e.clientX - heartButton.offsetLeft;
            offsetHeartY = e.clientY - heartButton.offsetTop;
            heartButton.style.cursor = 'grabbing';
        });

        // Touch
        heartButton.addEventListener('touchstart', function(e) {
            isDraggingHeart = true;
            offsetHeartX = getClientX(e) - heartButton.offsetLeft;
            offsetHeartY = getClientY(e) - heartButton.offsetTop;
            heartButton.style.cursor = 'grabbing';
        });

        function moveHeart(e) {
            if (isDraggingHeart) {
                e.preventDefault();
                const x = getClientX(e) - offsetHeartX;
                const y = getClientY(e) - offsetHeartY;
                heartButton.style.left = x + 'px';
                heartButton.style.top = y + 'px';
                tryOpenCard();
            }
        }

        document.addEventListener('mousemove', moveHeart);
        document.addEventListener('touchmove', moveHeart, { passive: false });

        document.addEventListener('mouseup', function() {
            isDraggingHeart = false;
            heartButton.style.cursor = 'pointer';
        });
        document.addEventListener('touchend', function() {
            isDraggingHeart = false;
            heartButton.style.cursor = 'pointer';
        });
    }

    // --- Corazón decorativo "ale" arrastrable ---
    if (heartDeco) {
        heartDeco.style.position = 'absolute';
        heartDeco.style.left = '10px';
        heartDeco.style.top = '120px';

        // Mouse
        heartDeco.addEventListener('mousedown', function(e) {
            isDraggingDeco = true;
            offsetDecoX = e.clientX - heartDeco.offsetLeft;
            offsetDecoY = e.clientY - heartDeco.offsetTop;
            heartDeco.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', function(e) {
            if (isDraggingDeco) {
                heartDeco.style.left = (e.clientX - offsetDecoX) + 'px';
                heartDeco.style.top = (e.clientY - offsetDecoY) + 'px';
                tryOpenCard();
            }
        });

        document.addEventListener('mouseup', function() {
            isDraggingDeco = false;
            heartDeco.style.cursor = 'grab';
        });

        // Touch
        heartDeco.addEventListener('touchstart', function(e) {
            isDraggingDeco = true;
            offsetDecoX = e.touches[0].clientX - heartDeco.offsetLeft;
            offsetDecoY = e.touches[0].clientY - heartDeco.offsetTop;
            heartDeco.style.cursor = 'grabbing';
        });

        document.addEventListener('touchmove', function(e) {
            if (isDraggingDeco) {
                heartDeco.style.left = (e.touches[0].clientX - offsetDecoX) + 'px';
                heartDeco.style.top = (e.touches[0].clientY - offsetDecoY) + 'px';
                tryOpenCard();
            }
        }, { passive: false });

        document.addEventListener('touchend', function() {
            isDraggingDeco = false;
            heartDeco.style.cursor = 'grab';
        });
    }

    // --- Reproducir audio al cargar ---
    var audio = document.getElementById('audio1');
    if (audio) {
        audio.play().catch(function(e) {
            // Algunos navegadores requieren interacción del usuario
            console.log('No se pudo reproducir automáticamente:', e);
        });
    }
});