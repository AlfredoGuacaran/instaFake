//primera llamada a api para solicitar Token
async function getToken(email, password) {
  const response1 = await fetch('http://localhost:3000/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  const { token } = await response1.json();

  return token;
}

//Segunda peticion a api para solicitar fotos
async function getPhotos(token, page = 1) {
  const response2 = await fetch(
    `http://localhost:3000/api/photos?page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data2 = await response2.json();
  const photosArr = data2.data;
  return photosArr;
}

function domLogin() {
  $('#div-form').removeClass('d-block').addClass('d-none');
  $('#div-photos').removeClass('d-none').addClass('d-block');
}

function renderPhotos(photos) {
  photos = photos.slice(0, 10);
  const html = photos
    .map((photo) => {
      return `
       <figure class="my-3 border border-1">
          <img src="${photo.download_url}" alt="Photo" class="img-fluid">
          <div class="mt-1 d-flex align-items-center px-1">
          <p class="mt-3 flex-grow-1">Autor: ${photo.author}</p>
          <i class="fas fa-heart mx-2"></i>
          <i class="fas fa-comments mx-2"></i>
          </div>
        </figure>
      `;
    })
    .join('');

  $('#feed').append(html);
}

/// login form
$('#insta-form').on('submit', async function (event) {
  try {
    //Previene recarga de pag
    event.preventDefault();
    //Captura datos del formulario
    const email = $('#insta-email-input').val();
    const password = $('#insta-password-input').val();

    //primera llamada a api para solicitar Token
    const token = await getToken(email, password);

    //guarda token en localStorage
    localStorage.setItem('token', token);

    //esconde el formulario muestra las fotos...
    domLogin();

    //Segunda peticion a api para solicitar fotos
    const photos = await getPhotos(token);
    renderPhotos(photos);
  } catch (error) {
    console.log('Error');
    console.error(error);
  }
});

/// app init
(async function init() {
  try {
    const token = localStorage.getItem('token');
    if (token == null) {
      return;
    } else {
      //esconde el formulario muestra las fotos...
      domLogin();
      //Segunda peticion a api para solicitar fotos
      const photos = await getPhotos(token);
      renderPhotos(photos);
    }
  } catch (error) {
    console.error(error);
  }
})();

//logout button
$('#btn-logout').on('click', function (event) {
  //borra token del localStore
  localStorage.removeItem('token');
  //Recarga la pagina
  location.reload();
});

//Show more photos button
$('#btn-addPhotos').on('click', async function () {
  try {
    //toma el valor del boton como pagina actual y suma 1
    let currentPage = $(this).attr('data-currentpage');
    currentPage++;

    //Capta token del localStore y solicita mas photos
    const token = localStorage.getItem('token');
    const photos = await getPhotos(token, currentPage);

    //Muestra mas photos
    renderPhotos(photos);

    //Setea al button el valor nuevo de la pagina
    $(this).attr('data-currentpage', currentPage);
  } catch (error) {
    console.error(error);
  }
});
