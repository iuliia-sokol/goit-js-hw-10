import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const notifySettings = {
  width: '380px',
  position: 'right-top',
  distance: '10px',
  opacity: 1,
  fontSize: '20px',
  borderRadius: '12px',
};

const inputEl = document.getElementById('search-box');
inputEl.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

const countryListEl = document.querySelector('.country-list');

function onInputChange(event) {
  const inputValue = event.target.value;
  if (!inputValue) {
    countryListEl.innerHTML = '';
    return;
  }
  if (inputValue) {
    countryListEl.innerHTML = '';
  }
  fetchCountries(inputValue.trim())
    .then(result => {
      countryListEl.insertAdjacentHTML('beforeend', renderCountryCard(result));

      function renderCountryCard(result) {
        if (result.length == 1) {
          return result
            .map(({ name, capital, population, flags, languages }) => {
              languages = Object.values(languages).join(', ');
              return `
<li>
<div style="display:flex; gap:16px; align-items:center;">
 <img src="${flags.svg}" alt="flag" width="100" height="60"/>
<p style="font-size:36px; font-weight:600;">${name.official}</p>
</div>
<p style="font-size:22px; font-weight:500;">Capital: <span style="font-size:22px; font-weight:400;">${capital}</span></p>
<p style="font-size:22px; font-weight:500;">Population: <span style="font-size:22px; font-weight:400;">${population}</span></p>
<p style="font-size:22px; font-weight:500;">Languages: <span style="font-size:22px; font-weight:400;">${languages}</span></p>
</li>
      `;
            })
            .join('');
        }

        if (result.length > 1 && result.length <= 10) {
          return result
            .map(({ name, flags }) => {
              return `
<li style="display:flex; column-gap:16px; align-items:center;">
 <img src="${flags.svg}" alt="flag" width="50" height="30"/>
<p style="font-size:26px; font-weight:500;">${name.official}</p>
</li>
      `;
            })
            .join('');
        }
        if (result.length >= 10) {
          Notify.info(
            'Too many matches found. Please enter a more specific name.',
            notifySettings
          );
          return '';
        } else return '';
      }
    })
    .catch(error => {
      Notify.failure(
        'Oops, there is no country with that name',
        notifySettings
      );
    });
}
