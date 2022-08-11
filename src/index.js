'use strict';
import Notiflix from 'notiflix';
// Notiflix.Notify.warning('Memento te hominem esse');

const refs = {
  searchBtnRef: document.querySelector('.search-submit'),
  formRef: document.querySelector('.search-form'),
};

async function getPhotos(event) {
  event.preventDefault();
  try {
    const response = await fetch(
      'https://pixabay.com/api/?key=8185021-24268e96be1b2c00462570825&q=yellow+flowers&image_type=photo&pretty=true'
    );
    const data = await response.json();
    console.log(data.totalHits);
  } catch (error) {
    console.log(error);
  }
}

refs.formRef.addEventListener('submit', getPhotos);
