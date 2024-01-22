import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.querySelector("#searchForm");
  const galleryContainer = document.querySelector(".gallery");
  const lightbox = new SimpleLightbox(".gallery a");

  searchForm.addEventListener("submit", handleFormSubmit);

  function handleFormSubmit(event) {
    event.preventDefault();

    const searchQuery = document.querySelector("#searchQuery").value;
    if (!searchQuery.trim()) {
      iziToast.error({
        title: "Error",
        message: "Please enter a search query.",
      });
      return;
    }

    fetchImages(searchQuery);
  }

  function fetchImages(searchQuery) {
    const apiKey = `41927432-a4c56e3ebe36f8f9b7d51fc62`;
    const perPage = 15;
    const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}`;

    iziToast.info({
      title: "Loading",
      message: "Fetching images...",
    });

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        renderImages(data.hits);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        iziToast.error({
          title: "Error",
          message: "Failed to fetch images. Please try again.",
        });
      });
  }

  function renderImages(images) {
    galleryContainer.innerHTML = "";

    if (images.length === 0) {
      iziToast.warning({
        title: "No Results",
        message: "Sorry, there are no images matching your search query. Please try again!",
      });
      return;
    }

    images.forEach(image => {
     const imageCard = createImageCard(image);
     galleryContainer.appendChild(imageCard);
    });

    lightbox.refresh(); 
      
    
  }
});

function createImageCard(image) {
  const card = document.createElement('div');
  card.className = 'image-card';

  const link = document.createElement('a');
  link.href = image.largeImageURL; 
  link.setAttribute('data-lightbox', 'gallery');

  const img = document.createElement('img');
  img.src = image.webformatURL;
  img.alt = image.tags;

  link.appendChild(img);
  card.appendChild(link);

  const likes = document.createElement('span');
  likes.textContent = `Likes: ${image.likes}`;

  const views = document.createElement('span');
  views.textContent = `Views: ${image.views}`;

  card.appendChild(likes);
  card.appendChild(views);

  return card;
}