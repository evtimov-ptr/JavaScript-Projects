const addModal = document.getElementById("add-modal");
const startAddMovieBtn = document.querySelector(".addMovieBtn");
const backdrop = document.getElementById("backdrop");
const cancelAddMovieBtn = addModal.querySelector(".btn--passive");
const addMovieBtn = addModal.querySelector(".btn--success");
const entryTextSection = document.getElementById("entry-text");
const deleteMovieModal = document.getElementById("delete-modal");
// Form Elements
const movieTitle = document.getElementById("title");
const imageURL = document.getElementById("image-url");
const rating = document.getElementById("rating");

const movies = [];
const updateUI = () => {
  if (movies.length === 0) {
    entryTextSection.style.display = "block";
  } else {
    entryTextSection.style.display = "none";
  }
};

const cancelMovieDeletionModal = () => {
  toggleBackdrop();
  deleteMovieModal.classList.remove("visible");
};

const deleteMovieHandler = (movieId) => {
  let movieIndex = 0;
  for (const movie of movies) {
    if (movie.id === movieId) {
      break;
    }
    movieIndex++;
  }

  movies.splice(movieIndex, 1);
  const listRoot = document.getElementById("movie-list");
  listRoot.children[movieIndex].remove();
  cancelMovieDeletionModal();
  updateUI();
};

const startDeleteMovieHandler = (movieId) => {
  deleteMovieModal.classList.add("visible");
  toggleBackdrop();
  const cancelDeletionButton = deleteMovieModal.querySelector(".btn--passive");
  let confirmDeletionButton = deleteMovieModal.querySelector(".btn--danger");

  confirmDeletionButton.replaceWith(confirmDeletionButton.cloneNode(true));

  confirmDeletionButton = deleteMovieModal.querySelector(".btn--danger");

  cancelDeletionButton.removeEventListener("click", cancelMovieDeletionModal);

  cancelDeletionButton.addEventListener("click", cancelMovieDeletionModal);
  confirmDeletionButton.addEventListener(
    "click",
    deleteMovieHandler.bind(null, movieId)
  );
  // deleteMovie(movieId);
};

const renderNewMovieElement = (id, title, imageUrl, rating) => {
  const newMovieElement = document.createElement("li");
  newMovieElement.className = "movie-element";
  newMovieElement.innerHTML = `
  <div class="movie-element__image">
  <img src="${imageUrl}" alt="${title}">

  </div>

  <div class="movie-element__info">
  <h2>${title}</h2>
  <p>${rating}/5 stars</p>
  </div>
  `;
  newMovieElement.addEventListener(
    "click",
    startDeleteMovieHandler.bind(null, id)
  );
  const listRoot = document.getElementById("movie-list");

  listRoot.append(newMovieElement);
};

const addMovieHandler = function () {
  let titleValue = movieTitle.value;
  let imageUrlValue = imageURL.value;
  let ratingValue = rating.value;

  if (
    titleValue.trim() === "" ||
    imageUrlValue.trim() === "" ||
    ratingValue.trim() === "" ||
    +ratingValue < 1 ||
    +ratingValue > 5
  ) {
    alert("Please enter valid values (rating between 1 and 5).");
    return;
  } else {
    const newMovie = {
      id: Math.random().toString(),
      title: titleValue,
      image: imageUrlValue,
      rating: ratingValue,
    };

    movies.push(newMovie);
    console.log(movies);
    closeMovieModal();
    toggleBackdrop();
    clearMovieInput();
    renderNewMovieElement(
      newMovie.id,
      newMovie.title,
      newMovie.image,
      newMovie.rating
    );
    updateUI();
  }
};

const clearMovieInput = () => {
  movieTitle.value = "";
  imageURL.value = "";
  rating.value = "";
};
const toggleBackdrop = () => {
  backdrop.classList.toggle("visible");
};

const closeMovieModal = () => {
  addModal.classList.remove("visible");
};
const showMovieModal = () => {
  addModal.classList.add("visible");
  toggleBackdrop();
};

const backDropClickHandler = () => {
  closeMovieModal();
  cancelMovieDeletionModal();
  clearMovieInput();
};

const cancelAddMovieHandler = () => {
  closeMovieModal();
  toggleBackdrop();
  clearMovieInput();
};

startAddMovieBtn.addEventListener("click", showMovieModal);

backdrop.addEventListener("click", backDropClickHandler);
cancelAddMovieBtn.addEventListener("click", cancelAddMovieHandler);
addMovieBtn.addEventListener("click", addMovieHandler);
