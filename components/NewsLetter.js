class NewsLetter extends HTMLElement {
    static get observedAttributes () {
        return ['input', 'portada', 'btn-label', 'btn-style', 'btn::hover', 'sp'];
    };
    constructor () {
        super();
        this.attachShadow({ mode: 'open'});

        this.shadowRoot.appendChild(NewsLetter.template.content.cloneNode(true));
        // Propiedades que guardan elementos del shadowRoot.
        this.$formField = this.shadowRoot.querySelector('.newsletter__input');
        this.$portadaMovil = this.shadowRoot.querySelector('.newsletter__portada source');
        this.$portadaTablet = this.shadowRoot.querySelector('.newsletter__portada source + source');
        this.$portada = this.shadowRoot.querySelector('.newsletter__portada img');
        this.$formulario = this.shadowRoot.querySelector('.newsletter__form');
        this.$boton = this.shadowRoot.querySelector('.newsletter__enviar');
        this.$style = this.shadowRoot.querySelector('style');
    };

    connectedCallback() {
        this.update();
        this.$formulario.addEventListener('submit', (e) => this.enviar(e));
    };

    attributeChangedCallback(name, oV, nV) {
        if (oV === nV) return;

        switch (name) {
            case 'input':
                let inputAtt = JSON.parse(nV); // Se espera recibir un string valido para convertir a JSON, en este caso un objeto.
                this.updateAttrInput(inputAtt); // Actualizamos los atributos que recibe el componente <form-field></form-field>
                break;
            case 'portada':
                let images = JSON.parse(nV);
                this.$portada.src = `${images[0]}`;
                this.$portada.alt = 'Portada del componente';
                // Solo se agregan los enlaces a los source y hay mas de un enlace
                if (images.length > 1) {
                    this.$portadaTablet.srcset = `${images[1]}`;
                    this.$portadaMovil.srcset = `${images[2]}`;
                }
                break;
            case 'btn-label':
                this.$boton.textContent = nV || 'Enviar';
                break;
            case 'btn-style':
                this.$style.textContent = NewsLetter.styles(nV, this.getAttribute('btn::hover') || '', this.getAttribute('sp') || '');
                break;
            case 'btn::hover':
                this.$style.textContent = NewsLetter.styles(this.getAttribute('btn-style') || '', nV, this.getAttribute('sp') || '');
                break;
            case 'sp':
                this.$style.textContent = NewsLetter.styles(this.getAttribute('btn-style') || '', this.getAttribute('btn::hover') || '', nV);
                break;
        };
    };

    update() {
        this.$boton.textContent = this.getAttribute('btn-label') || 'Enviar';
        this.$portada.alt = 'Portada del componente';
        this.$style.textContent = NewsLetter.styles(
            this.getAttribute('btn-style') || '', 
            this.getAttribute('btn::hover') || '',
            this.getAttribute('sp') || ''
        );
    };

    static styles(btnStyle, btnHover, sp) {
        let base = /* css */ `
            *,
            *::before,
            *::after {
                box-sizing: border-box;
                padding: 0;
                margin: 0;
                font: inherit;
            }
            img {
                display:block;
                inline-size: 100%;
                block-size: 100%;
                object-fit: cover;
            }
            .newsletter {
                display: grid;
                grid-template-columns: minmax(100px, 1.1fr) minmax(100px, 1fr);
                padding: 1.75rem;
                max-inline-size: 900px;
                border-radius: 24px;
                background-color: white;
            }
            .newsletter section {
                padding: 0 3rem 0 0;
            }
            .newsletter__input {
                display:block;
                margin: 1.5rem 0;
            }
            .newsletter__portada { 
                border-radius: 16px;
                overflow: hidden;
            }
            .newsletter__enviar {
                inline-size: 100%;
                padding: 0.75rem 0.5rem;
                cursor: pointer;
                border: none;
                border-radius: 8px;
            }

        `;
        let media = /* css */ `
            @media (max-width: 768px) {
                .newsletter {
                    grid-template-columns: 1fr;
                    grid-template-areas:
                        "portada"
                        "contenido";
                    gap: 2rem;
                }
                .newsletter section {
                    grid-area: contenido;
                    padding: 0;
                }
                .newsletter__portada {
                    grid-area: portada;
                    border-radius: 24px;
                }
            }
            @media (max-width: 425px) {
                .newsletter {
                    padding: 0;
                    margin: 1rem;
                }
                .newsletter section {
                    padding: 0 1.5rem 1.5rem;
                }
                .newsletter__enviar {
                    padding: 1rem 0.5rem;
                }
            }
        `
        // Verificamos si se ha definido algún estilo para el botón
        if (btnStyle) {
            base += `.newsletter__enviar { ${btnStyle} } `;
        };
        // Si se define el estilo para el hover
        if(btnHover) {
            base += `.newsletter__enviar:hover { ${btnHover} }`;
        };
        // Si se define el estilo para el fondo
        if(sp) {
            base += `.sp { ${sp} }`;
        }
        // retornamas la base con los estilos que se hayan agregando.
        return base + media;
    };

    updateAttrInput(inputAtt) {
        Object.entries(inputAtt).forEach(([k, v]) => {
            // Si el atributo es 'required' y viene con valor, se añade sin valor.
            if (k === 'required' && v ) {
                this.$formField.setAttribute('required', '');
            } else {
                this.$formField.setAttribute(k, v);
            };
        });
    };

    enviar(e) {
        e.preventDefault();
        console.log('eviado');
    };
/* -------------------------------------------------------- */
    get input() {
        return JSON.parse(this.getAttribute('input'));
    }
    set input(value) {
        this.setAttribute('input', JSON.stringify(value));
    }
/* -------------------------------------------------------- */
    get portada() {
        return JSON.parse(this.getAttribute('portada'));
    }
    set portada(v) {
        this.setAttribute('portada', JSON.stringify(v));
    }
/* -------------------------------------------------------- */
    get btnLabel() {
        return this.getAttribute('btn-label');
    }
    set btnLabel(v) {
        this.setAttribute('btn-label', v);
    }
}

NewsLetter.template = document.createElement('template');

NewsLetter.template.innerHTML = /* html */ `
    <style></style>
    <article class="newsletter sp">
        <section>
            <slot name="contenido"></slot>
            <form class="newsletter__form">
                <form-field class="newsletter__input"></form-field>
                <button type="submit" class="newsletter__enviar"></button>
            </form>
        </section>
        <picture class="newsletter__portada">
            <source media="(max-width: 425px)">
            <source media="(max-width: 768px)">
            <img>
        </picture>
    </article>
`;

customElements.define('news-letter', NewsLetter);

/* const p3 = document.createElement('news-letter'),
    c2 = document.createElement('form-field'),
    h1 = document.createElement('h1'),
    p = document.createElement('p');
    
    p3.setAttribute('input', '{"label": "Nombre", "name": "nombre", "required": ""}');
    h1.setAttribute('slot', 'contenido')
    h1.textContent = 'Hola que tal?'
    p.setAttribute('slot', 'contenido')
    p.textContent = 'esto es un parrafo';
    p3.setAttribute('btn-label', 'Exitoso!')
    p3.setAttribute('btn-style', 'Exitoso!')
    p3.setAttribute('btn::hover', {})
    p3.setAttribute('btn-style', 'background-color: green;')
    p3.setAttribute('btn::hover', 'background-color: lightgreen;')
    p3.appendChild(h1);
    p3.appendChild(p);
    
    
document.body.appendChild(p3)


p3.btnLabel = ''
p3.input = {'label': 'prueba'}

console.log(p3.btnLabel); */