import './components/FormField.js'
import './components/NewsLetter.js'
import './components/SuccessMessage.js'

// Logica general de la app
const $NewsLetter = document.getElementById('componenteNL'),
    $app = document.getElementById('app'),
    $success = document.createElement('success-message');

$NewsLetter.addEventListener('FormSubmited', e => {
    // Se oculta el componente del newsletter y se muestra el mensaje de exito
    $app.textContent = '';
    $app.style.gridTemplateRows = '1fr';
    // Configuracion del componente success-message
    const $p = document.createElement('p');
    $p.innerHTML = `
        A confirmation email has been sent to <b class="dato">${e.detail.valor}</b>. 
        Please open it and click the button inside to confirm your subscription.
    `;
    $p.setAttribute('slot', 'descripcion');
    $p.classList.add('success-description');
    $success.appendChild($p);
    $success.icon = './assets/images/icon-success.svg';
    $success.titulo = 'Thanks for subscribing!';
    $success.btnText = 'Dismiss message';
    $success.titleStyle = 'color: var(--Blue-800);';
    $success.btnStyle = 'background-color: var(--Blue-800); color: var(--White); font-weight: 700;';
    $success.btnHover = 'background-image: linear-gradient(45deg, rgb(255, 83, 119), rgb(255, 105, 62)); box-shadow: 0px 15px 30px rgba(255, 66, 66, .5);';
    // Se añade el componente al DOM
    $app.appendChild($success);
    console.log('Formulario enviado', e.detail.valor);
})

$success.addEventListener('ResetComponent', e => {
    // Se oculta el componente del mensaje de exito y se muestra el newsletter
    if (e.detail) {
        location.reload();
    };
    console.log(e.detail);
})

/* console.log($NewsLetter.portada)
console.log($success.icon) */