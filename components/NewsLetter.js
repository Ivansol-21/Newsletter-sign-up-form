class NewsLetter extends HTMLElement {
    constructor () {
        super();
        this.attachShadow({ mode: 'open'});

        this.shadowRoot.appendChild(NewsLetter.template.content.cloneNode(true));

        this.$titulo = this.shadowRoot.querySelector('.newsletter__titulo');
        this.$descripcion = this.shadowRoot.querySelector('.newsletter__descripcion');
    }

    connectedCallback() {
        this.update(); // Se inicializan todos los valores.
    }

    update() {
        this.$titulo.textContent = this.getAttribute('titulo') || 'Stay updated!';
        this.$descripcion.textContent = this.getAttribute('descripcion') || 'Join 60,000+ product managers receiving monthly updates on:';
    }
}

NewsLetter.template = document.createElement('template');

NewsLetter.template.innerHTML = /* html */ `
    <style></style>
    <article class="newsletter">
        <section>
            <h1 class="newsletter__titulo"></h1>
            <p class="newsletter__descripcion"></p>
            <ul class="newsletter__lista">
                <li class="newsletter__item">
                    <img>
                    <p></p>
                </li>
                <li class="newsletter__item">
                    <img>
                    <p></p>
                </li>
                <li class="newsletter__item">
                    <img>
                    <p></p>
                </li>
            </ul>
            <form class="newsletter__form">
                <form-field class="newsletter__input"></form-field>
                <button type="submit" class="newsletter__enviar"></button>
            </form>
        </section>
        <figure class="newsletter__portada">
            <img>
        </figure>
    </article>
`;

customElements.define('news-letter', NewsLetter);