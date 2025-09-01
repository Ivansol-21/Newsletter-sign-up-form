class SuccessMessage extends HTMLElement {
    static get observedAttributes () {
        return ['icon', 'titulo', 'title-style', 'btn-text', 'btn-style', 'btn::hover'];
    }
    constructor () {
        super();
        this.attachShadow({ mode: 'open'});
        this.shadowRoot.appendChild(SuccessMessage.template.content.cloneNode(true));
        this.$icon = this.shadowRoot.querySelector('.success__icon img');
        this.$titulo = this.shadowRoot.querySelector('.success__titulo');
        this.$btn = this.shadowRoot.querySelector('.success__btn');
        this.$dynamicStyle = this.shadowRoot.getElementById('dynamic-styles'); 
    };
    connectedCallback() {
        this.update();
        this.$btn.addEventListener('click', () => this.resetear());
    };
    attributeChangedCallback(name, oV, nV) {
        if (oV === nV) return;
        switch (name) {
            case 'icon':
                this.$icon.src = nV || '';
            break;
            case 'titulo':
                this.$titulo.textContent = nV || 'Title';
            break;
            case 'btn-text':
                this.$btn.textContent = nV || 'Aceptar';
            break;
            case 'btn-style':
            case 'btn::hover':
            case 'title-style':
                this.updateStyles();
            break;
        }
    }
    update() {
        this.$icon.alt = 'Icono de exito';
        this.$titulo.textContent = this.getAttribute('titulo') || 'Title';
        this.$btn.textContent = this.getAttribute('btn-text') || 'Aceptar';
    }
    updateStyles() {
        this.$dynamicStyle.textContent = SuccessMessage.dinamicStyles(
            this.getAttribute('btn-style') || '',
            this.getAttribute('btn::hover') || '',
            this.getAttribute('title-style') || ''
        );
    }
    static baseStyles() {
        return /* css */ `
            *, 
            *::before, 
            *::after {
                box-sizing: border-box;
                padding: 0;
                margin: 0;
                font: inherit;
            }
            .success {
                display: flex;
                flex-direction: column;
                background-color: hsl(0, 0%, 100%);
                border-radius: 24px;
                padding: 3.5rem;
                max-inline-size: 450px;
                gap: 1.5rem;
            }
            .success__icon {
                inline-size: 64px;
                block-size: 64px;
            }
            .success__icon img {
                display: block;
                inline-size: 100%;
                block-size: 100%;
                object-fit: cover;
            }
            .success__titulo {
                font-weight: 700;
                font-size: clamp(1.5rem, 10vw, 3rem);
            }
            .success__btn {
                padding: 1rem;
                inline-size: 100%;
                border: none;
                border-radius: 8px;
                cursor: pointer;
            }
            @media (max-width: 425px) {
                .success {
                    padding: 2.5rem;
                }
            }
        `;

    };

    static dinamicStyles(btnStyle, btnHover, titleStyle) {
        let css = '';
        // Si se define el estilo para el boton
        if(btnStyle) css += `.success__btn { ${btnStyle} }`;
        // Si se define el estilo para el hover
        if(btnHover) css += `.success__btn:hover { ${btnHover} }`;
        // Si se define el estilo para el titulo
        if(titleStyle) css += `.success__titulo { ${titleStyle} }`;
 
        // retornamas la css con los estilos que se hayan agregando.
        return css;
    };

    resetear() {
        // Disparamos un evento personalizado para notificar que se ha reseteado el componente
        this.dispatchEvent(new CustomEvent('ResetComponent', {
            detail: true,
            bubbles: true,
            composed: true
        }));
    }
    /* -------------- Getter y Setter ------------------- */
    get icon() {
        return this.getAttribute('icon');
    }
    set icon(val) {
        this.setAttribute('icon', val);
    }
    /* -------------------------------------------------- */
    get titulo() {
        return this.getAttribute('titulo');
    }
    set titulo(val) {
        this.setAttribute('titulo', val);
    }
    /* -------------------------------------------------- */
    get btnText() {
        return this.getAttribute('btn-text');
    }
    set btnText(val) {
        this.setAttribute('btn-text', val);
    }
    /* ---------------------------------------------------- */
    get btnStyle() {
        return this.getAttribute('btn-style');
    }
    set btnStyle(val) {
        this.setAttribute('btn-style', val);
    }
    /* ---------------------------------------------------- */
    get btnHover() {
        return this.getAttribute('btn::hover');
    }
    set btnHover(val) {
        this.setAttribute('btn::hover', val);
    }
    /* ---------------------------------------------------- */
    get titleStyle() {
        return this.getAttribute('title-style');
    }
    set titleStyle(val) {
        this.setAttribute('title-style', val);
    }
};

SuccessMessage.template = document.createElement('template');
SuccessMessage.template.innerHTML = /* html */`
    <style>${SuccessMessage.baseStyles()}</style>
    <style id="dynamic-styles"></style>
    <div class="success">
        <figure class="success__icon">
            <img>
        </figure>
        <h2 class="success__titulo"></h2>
        <slot name="descripcion"></slot>
        <button class="success__btn"></button>
    </div>
`;

customElements.define('success-message', SuccessMessage);

