(function() {
    // 1. Injeta o CSS na página
    const style = document.createElement('style');
    style.innerHTML = `
        :root { --font-scale: 1; }
        html { font-size: calc(16px * var(--font-scale)); transition: filter 0.3s ease; }
        
        /* Classes de Acessibilidade */
        body.a11y-high-contrast, body.a11y-high-contrast main, body.a11y-high-contrast div, body.a11y-high-contrast section {
            background-color: #000000 !important; color: #ffffff !important; border-color: #ffff00 !important;
        }
        body.a11y-high-contrast a, body.a11y-high-contrast button:not(.a11y-btn) {
            color: #ffff00 !important; background-color: #000000 !important; border: 1px solid #ffff00 !important;
        }
        html.a11y-grayscale { filter: grayscale(100%); }
        body.a11y-highlight-links a {
            background-color: #ffff00 !important; color: #000000 !important; text-decoration: underline !important; font-weight: bold !important; padding: 2px 4px;
        }
        body.a11y-text-spacing * {
            letter-spacing: 0.12em !important; word-spacing: 0.16em !important; line-height: 1.8 !important;
        }

        /* Estilos do Widget */
        .a11y-widget { position: fixed; top: 20%; right: 0; z-index: 9999; display: flex; align-items: flex-start; font-family: Arial, sans-serif; font-size: 16px !important; }
        .a11y-toggle-btn { background-color: #0056b3; color: #ffffff; border: none; border-radius: 8px 0 0 8px; padding: 12px 14px; cursor: pointer; box-shadow: -2px 2px 8px rgba(0, 0, 0, 0.2); display: flex; align-items: center; justify-content: center; transition: background-color 0.2s; }
        .a11y-toggle-btn:hover { background-color: #003d82; outline: 3px solid #ffbf47; }
        .a11y-panel { background-color: #ffffff; color: #222222; width: 260px; border: 2px solid #0056b3; border-right: none; border-radius: 0 0 0 8px; padding: 16px; box-shadow: -4px 4px 12px rgba(0, 0, 0, 0.15); display: none; }
        .a11y-panel.is-open { display: block; }
        .a11y-panel h2 { margin: 0 0 12px 0; font-size: 18px !important; border-bottom: 1px solid #ddd; padding-bottom: 8px; color: #0056b3; }
        .a11y-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .a11y-btn { background-color: #f0f4f8; color: #111; border: 1px solid #ccd6e0; border-radius: 6px; padding: 10px 8px; font-size: 13px !important; font-weight: 600; cursor: pointer; text-align: center; transition: all 0.2s; }
        .a11y-btn:hover { background-color: #e1e8f0; }
        .a11y-btn[aria-pressed="true"] { background-color: #0056b3; color: #ffffff; border-color: #003d82; }
        .a11y-reset-btn { grid-column: span 2; background-color: #ffeaea; color: #a30000; border-color: #f5c2c2; margin-top: 6px; }
        .a11y-reset-btn:hover { background-color: #ffd6d6; }
    `;
    document.head.appendChild(style);

    // 2. Injeta o HTML do widget no final do body
    const widgetContainer = document.createElement('div');
    widgetContainer.innerHTML = `
        <aside class="a11y-widget" aria-label="Menu de Acessibilidade">
            <button type="button" class="a11y-toggle-btn" id="a11y-toggle" aria-expanded="false" aria-controls="a11y-panel" title="Opções de Acessibilidade">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/>
                </svg>
            </button>
            <div class="a11y-panel" id="a11y-panel" role="region" aria-label="Ferramentas de Acessibilidade">
                <h2>Acessibilidade</h2>
                <div class="a11y-grid">
                    <button type="button" class="a11y-btn" id="btn-font-inc">A+ Fonte</button>
                    <button type="button" class="a11y-btn" id="btn-font-dec">A- Fonte</button>
                    <button type="button" class="a11y-btn" id="btn-contrast" aria-pressed="false">Alto Contraste</button>
                    <button type="button" class="a11y-btn" id="btn-grayscale" aria-pressed="false">Escala Cinza</button>
                    <button type="button" class="a11y-btn" id="btn-links" aria-pressed="false">Destacar Links</button>
                    <button type="button" class="a11y-btn" id="btn-spacing" aria-pressed="false">Espaçamento</button>
                    <button type="button" class="a11y-btn a11y-reset-btn" id="btn-reset">Restaurar Padrão</button>
                </div>
            </div>
        </aside>
    `;
    document.body.appendChild(widgetContainer);

    // 3. Lógica do Widget (JavaScript)
    const toggleBtn = document.getElementById('a11y-toggle');
    const panel = document.getElementById('a11y-panel');
    const btnFontInc = document.getElementById('btn-font-inc');
    const btnFontDec = document.getElementById('btn-font-dec');
    const btnContrast = document.getElementById('btn-contrast');
    const btnGrayscale = document.getElementById('btn-grayscale');
    const btnLinks = document.getElementById('btn-links');
    const btnSpacing = document.getElementById('btn-spacing');
    const btnReset = document.getElementById('btn-reset');

    let state = JSON.parse(localStorage.getItem('a11y_settings')) || {
        fontScale: 1, highContrast: false, grayscale: false, highlightLinks: false, textSpacing: false
    };

    function applySettings() {
        document.documentElement.style.setProperty('--font-scale', state.fontScale);
        document.body.classList.toggle('a11y-high-contrast', state.highContrast);
        btnContrast.setAttribute('aria-pressed', state.highContrast);

        document.documentElement.classList.toggle('a11y-grayscale', state.grayscale);
        btnGrayscale.setAttribute('aria-pressed', state.grayscale);

        document.body.classList.toggle('a11y-highlight-links', state.highlightLinks);
        btnLinks.setAttribute('aria-pressed', state.highlightLinks);

        document.body.classList.toggle('a11y-text-spacing', state.textSpacing);
        btnSpacing.setAttribute('aria-pressed', state.textSpacing);

        localStorage.setItem('a11y_settings', JSON.stringify(state));
    }

    toggleBtn.addEventListener('click', () => {
        const isOpen = panel.classList.toggle('is-open');
        toggleBtn.setAttribute('aria-expanded', isOpen);
    });

    btnFontInc.addEventListener('click', () => {
        if (state.fontScale < 1.5) { state.fontScale = Math.round((state.fontScale + 0.1) * 10) / 10; applySettings(); }
    });
    btnFontDec.addEventListener('click', () => {
        if (state.fontScale > 0.8) { state.fontScale = Math.round((state.fontScale - 0.1) * 10) / 10; applySettings(); }
    });
    btnContrast.addEventListener('click', () => { state.highContrast = !state.highContrast; applySettings(); });
    btnGrayscale.addEventListener('click', () => { state.grayscale = !state.grayscale; applySettings(); });
    btnLinks.addEventListener('click', () => { state.highlightLinks = !state.highlightLinks; applySettings(); });
    btnSpacing.addEventListener('click', () => { state.textSpacing = !state.textSpacing; applySettings(); });
    btnReset.addEventListener('click', () => {
        state = { fontScale: 1, highContrast: false, grayscale: false, highlightLinks: false, textSpacing: false };
        applySettings();
    });

    // Aplica o estado salvo logo ao carregar a página
    applySettings();
})();