let globalToken;
// Telly.Hoeger@billy.biz
$('#insta-form').on('submit', async function (event) {
  try {
    //Previene recarga de pag
    event.preventDefault();
    //Captura datos del formulario
    const email = $('#insta-email-input').val();
    const password = $('#insta-password-input').val();

    //primera llamada a api para solicitar Token
    const response1 = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const { token } = await response1.json();
    globalToken = token;
  } catch (error) {
    console.log('Error');
    console.error(error);
  }
});
