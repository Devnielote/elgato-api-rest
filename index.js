const API_KEY = '0f3ebbb8-41b6-46ac-a181-b81feda76b93';
const API_URL = `https://api.thecatapi.com/v1/images/search?limit=3`;
const API_FAVORITES = `https://api.thecatapi.com/v1/favourites`;
const API_FAVORITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;
const API_UPLOAD_PICTURE = `https://api.thecatapi.com/v1/images/upload`;


const error = document.querySelector('#error');
const catImg = document.querySelectorAll('#random-cat-img');
const btnGenerator = document.querySelector('#cat-generator');
const btnFavorites = document.querySelector('#favoritesBtn');
const favorite_section = document.querySelector('#favorite-michis__container');

const getImages = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();

    if(response.status !== 200){
        const errorText = document.createTextNode(`
            Hubo un error: ${response.status}
        `)
        error.appendChild(errorText);
    } else {
        catImg[0].src = data[0].url;
        catImg[1].src = data[1].url;
        catImg[2].src = data[2].url;
        const btn1 = document.querySelector('#addFavorites1');
        const btn2 = document.querySelector('#addFavorites2');
        const btn3 = document.querySelector('#addFavorites3');
        btn1.onclick = () => saveToFavorites(data[0].id);
        btn2.onclick = () => saveToFavorites(data[1].id);
        btn3.onclick = () => saveToFavorites(data[2].id);
    }
}

const saveToFavorites = async (id) => {
    const response = await fetch(API_FAVORITES, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY
        },
        body: JSON.stringify({
            image_id: id,
        }),
    });

    if(response.status !== 200){
        const errorText = document.createTextNode(`
            Hubo un error: ${response.status}
        `)
        error.appendChild(errorText);
    } else {
        const data = response.json();
        getFavorites();
        getTotalFavorites();
        console.log('Imagen guardada en favoritos');
    }
}

async function deleteFromFavorites(id){
    const response = await fetch(API_FAVORITES_DELETE(id), {
        method: 'DELETE',
        headers: {
            'X-API-KEY': API_KEY, 
        }
    });
    if(response.status !== 200){
        const errorText = document.createTextNode(`
            Hubo un error: ${response.status}
        `)
        error.appendChild(errorText);
    } else {
        const data = await response.json();
        getFavorites();
        getTotalFavorites();
        console.log('Eliminado con exito',data);
    }
}

const getFavorites = async () => {
    const response = await fetch(API_FAVORITES,{
        method: 'GET',
        headers: {
            'X-API-KEY': API_KEY, 
        }
    })
    const data = await response.json();
    if(response.status !== 200){
        const errorText = document.createTextNode(`
            Hubo un error: ${response.status}
        `)
        error.appendChild(errorText);
    } else {
            favorite_section.innerHTML = "";
        const generateMichis = data.forEach(img => {
            const imgContainer = document.createElement('div');
            const createImg = document.createElement('img');
            const btn = document.createElement('span');
            btn.classList = 'btn-close';
            createImg.src = img.image.url;
            btn.onclick = () => deleteFromFavorites(img.id);
            imgContainer.append(createImg,btn);
            favorite_section.append(imgContainer);
        })
    }
}

const uploadPicture = async () => {
    const form = document.getElementById('upload-form');
    const formData = new FormData(form);
    console.log(formData.get('file')); 
    const response = await fetch(API_UPLOAD_PICTURE, {
        method: 'POST',
        headers: {
            // 'Content-Type': 'multipart/form-data',
            'X-API-KEY': API_KEY,
        },
        body: formData
    });
    if(response.status !== 200){
        const errorText = document.createTextNode(`
            Hubo un error al subir la imagen: ${response.status}
        `)
        error.appendChild(errorText);
    } else { 
        console.log('Imagen subida con exito',data);
        const data = response.json();
    }
}

//Esta función solo trae la cantidad de imágenes guardadas en favoritos y lo renderiza en el DOM.
 async function getTotalFavorites(){
    const response = await fetch(API_FAVORITES,{
        method: 'GET',
        headers: {
            'X-API-KEY': API_KEY, 
        }
    });
    const data = await response.json();
    const howMany = document.querySelector('#fav-amount');
    howMany.innerHTML = "";
    howMany.append(data.length);
 }

getTotalFavorites();
getImages();
btnGenerator.addEventListener('click',getImages);
btnFavorites.addEventListener('click',getFavorites);