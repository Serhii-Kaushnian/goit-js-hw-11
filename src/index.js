'use strict';
import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
// ====================================================================================
// var throttle = require('lodash.throttle');
// import InfiniteScroll from 'infinite-scroll';
// ====================================================================================
const refs = {
  searchBtnRef: document.querySelector('.search-submit'),
  formRef: document.querySelector('.search-form'),
  inputRef: document.querySelector('.search-input'),
  galleryRef: document.querySelector('.gallery'),
};
// ====================================================================================
const API_KEY = '8185021-24268e96be1b2c00462570825';
const MAIN_URL = 'https://pixabay.com/api/';
let perPage = 39;
let totalHitsOfResponse;
let totalPageOfResponse;
let page = 1;
let searchQuery;
// ====================================================================================
refs.formRef.addEventListener('submit', getPhotos);
window.addEventListener('scroll', addMore);
// ====================================================================================
async function getPhotos(event) {
  event.preventDefault();
  page = 1;
  searchQuery = refs.inputRef.value;
  try {
    const response = await axios.get(
      `${MAIN_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`
    );
    if (response.data.hits.length === 0) {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    totalHitsOfResponse = response.data.totalHits;
    totalPageOfResponse = Math.floor(totalHitsOfResponse / perPage);

    if (response.data.hits.length > 0) {
      Notiflix.Notify.success(
        `Hooray! We found ${totalHitsOfResponse} images.`
      );
    }
    refs.galleryRef.innerHTML = '';
    basicMarkUp(response.data);
    page += 1;
  } catch (error) {
    console.log(error);
  }
}
// ====================================================================================
function basicMarkUp(backEndResponse) {
  const obtainedtData = backEndResponse.hits.reduce(
    (
      acc,
      { largeImageURL, webformatURL, tags, likes, views, comments, downloads }
    ) => {
      return (
        acc +
        `<a class="photo-card_link" href=${largeImageURL}>
	<div class="photo-card post">
		<div class="photo-thumb">
			<img src=${webformatURL} alt=${tags} loading="lazy"/>
		</div>
		<div class="info">
			<p class="info-item">
				<b>Likes:</b><span> ${likes}</span>
			</p>
			<p class="info-item">
				<b>Views:</b><span> ${views}</span>
			</p>
			<p class="info-item">
				<b>Comments:</b><span> ${comments}</span>
			</p>
			<p class="info-item">
				<b>Downloads:</b><span> ${downloads}</span>
			</p>
		</div>
	</div>
</a>`
      );
    },
    ''
  );
  refs.galleryRef.insertAdjacentHTML('beforeend', obtainedtData);
  lightbox.refresh();
}
// ====================================================================================
async function makeRequest() {
  const searchQuery = refs.inputRef.value;
  try {
    const response = await axios.get(
      `${MAIN_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
    );
    if (response.data.hits.length === 0 || totalPageOfResponse === page) {
      Notiflix.Notify.warning("We're sorry, but this is the last page.");
    }
    console.log(page);
    basicMarkUp(response.data);
  } catch (error) {
    console.log(error);
  }
}
// ====================================================================================
function addMore() {
  if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight) {
    makeRequest();
    page += 1;
  }
}
// ====================================================================================
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  captionPosition: 'bottom',
  showCounter: false,
  nextOnImageClick: true,
  scrollZoom: false,
});
// ====================================================================================
