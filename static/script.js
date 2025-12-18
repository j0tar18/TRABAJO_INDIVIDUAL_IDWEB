document.addEventListener('DOMContentLoaded', () => {
    
    const slides = document.querySelectorAll('.slide');
    
    if (slides.length > 0) {
        console.log("Slider detectado e inicializado.");
        const indicators = document.querySelectorAll('.indicator');
        const prevBtn = document.querySelector('.slider-control.prev');
        const nextBtn = document.querySelector('.slider-control.next');
        const heroSlider = document.querySelector('.hero-slider');
        
        let currentSlide = 0;
        let slideInterval;

        function showSlide(n) {
            slides.forEach(slide => slide.classList.remove('active'));
            indicators.forEach(indicator => indicator.classList.remove('active'));

            if (n >= slides.length) currentSlide = 0;
            if (n < 0) currentSlide = slides.length - 1;

            slides[currentSlide].classList.add('active');
            indicators[currentSlide].classList.add('active');
        }

        function nextSlide() {
            currentSlide++;
            if (currentSlide >= slides.length) currentSlide = 0;
            showSlide(currentSlide);
        }

        function prevSlide() {
            currentSlide--;
            if (currentSlide < 0) currentSlide = slides.length - 1;
            showSlide(currentSlide);
        }

        function startSlider() {
            slideInterval = setInterval(nextSlide, 5000);
        }

        function stopSlider() {
            clearInterval(slideInterval);
        }

        if (prevBtn && nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                stopSlider();
                startSlider();
            });

            prevBtn.addEventListener('click', () => {
                prevSlide();
                stopSlider();
                startSlider();
            });
        }

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
                stopSlider();
                startSlider();
            });
        });

        if (heroSlider) {
            heroSlider.addEventListener('mouseenter', stopSlider);
            heroSlider.addEventListener('mouseleave', startSlider);
        }

        startSlider();
    }

    const filterBtn = document.querySelector('.filter-btn-submit');
    
    if (filterBtn) {
        console.log("Botón de filtro detectado.");
        
        filterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("Botón clickeado. Aplicando filtros...");
            aplicarFiltros();
        });
    }

    function aplicarFiltros() {
        const path = window.location.pathname.toLowerCase(); 
        const cards = document.querySelectorAll('.property-card');
        const selects = document.querySelectorAll('.real-estate-filter-bar select');

        console.log("Pagina actual:", path);

        // 1. CONDOMINIOS
        if (path.includes('condominios.html')) {
            const filtroZona = selects[0].value;
            const filtroTipo = selects[1].value;

            cards.forEach(card => {
                const ubicacion = card.querySelector('.property-location-text').innerText;
                const titulo = card.querySelector('.property-title').innerText;
                
                const matchZona = filtroZona === 'Zona' || ubicacion.includes(filtroZona);
                const matchTipo = filtroTipo === 'Tipo' || 
                                (filtroTipo === 'Townhouse' && titulo.toLowerCase().includes('townhouse')) ||
                                (filtroTipo === 'Casa Sola' && !titulo.toLowerCase().includes('townhouse'));

                toggleVisibilidad(card, matchZona && matchTipo);
            });
        }

        // 2. DEPAS
        else if (path.includes('depas.html')) {
            const filtroUbi = selects[0].value;
            const filtroDorm = selects[1].value;
            const filtroPrecio = selects[2].value;

            cards.forEach(card => {
                const ubicacion = card.querySelector('.property-location-text').innerText;
                const precioTexto = card.querySelector('.property-price-tag').innerText;
                const specs = card.querySelectorAll('.spec-item');
                
                let numDorm = 0;
                specs.forEach(spec => {
                    if(spec.innerHTML.includes('fa-bed') || spec.innerText.includes('Rec')) {
                        numDorm = parseInt(spec.innerText.replace(/\D/g, ''));
                    }
                });

                const precio = parseInt(precioTexto.replace(/[^0-9]/g, ''));
                const precioMax = filtroPrecio === 'Precio Máx' ? 999999999 : parseInt(filtroPrecio.replace(/[^0-9]/g, ''));
                const dormMin = filtroDorm === 'Dormitorios' ? 0 : parseInt(filtroDorm.replace(/[^0-9]/g, ''));

                const matchUbi = filtroUbi === 'Ubicación' || ubicacion.includes(filtroUbi);
                const matchDorm = numDorm >= dormMin;
                const matchPrecio = precio <= precioMax;

                toggleVisibilidad(card, matchUbi && matchDorm && matchPrecio);
            });
        }

        // 3. LOTES
        else if (path.includes('lotes.html')) {
            const filtroUbi = selects[0].value;
            const filtroArea = selects[1].value;

            cards.forEach(card => {
                const ubicacion = card.querySelector('.property-location-text').innerText;
                const specs = card.querySelectorAll('.spec-item');
                
                let area = 0;
                specs.forEach(spec => {
                    if(spec.innerText.includes('m²')) {
                        area = parseInt(spec.innerText.replace(/[^0-9]/g, ''));
                    }
                });

                const areaMin = filtroArea === 'Área Min' ? 0 : parseInt(filtroArea.replace(/[^0-9]/g, ''));
                const matchUbi = filtroUbi === 'Ubicación' || ubicacion.includes(filtroUbi);
                const matchArea = area >= areaMin;

                toggleVisibilidad(card, matchUbi && matchArea);
            });
        }
    }

    function toggleVisibilidad(card, debeMostrar) {
        if (debeMostrar) {
            card.style.display = 'flex';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        } else {
            card.style.display = 'none';
            card.style.opacity = '0';
        }
    }
});
