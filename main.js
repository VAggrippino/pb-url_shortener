const endpoint = 'https://www.jsonstore.io/a549bf85c0673e3d0cec331be9c39671278e8c5bffde81f18a1c2a520c2141f4';
const shortenerForm = document.getElementById('shortenerForm');

window.addEventListener('load', async () => {
  // If there's a shortCode at the end of this URL, do the redirect
  if (window.location.hash !== '') {
    const shortCode = window.location.hash.slice(1);
    const response = await fetch(endpoint + '/' + shortCode);
    const json = await response.json();
    window.location.href = json.result;
  }
});

shortenerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  storeUrl();
});

function getFullUrl() {
  const url = document.getElementById('longUrl').value;
  const protocolRegex = RegExp('^(https?|ftp)://');
  if (protocolRegex.test(url)) {
    return url;
  } else {
    return 'https://' + url;
  }
}

async function storeUrl(url) {
  if (document.getElementById('longUrl').value === '') return false;
  const longUrl = getFullUrl();
  const shortUrlField = document.getElementById('shortUrl');
  const copyShortUrlButton = document.getElementById('copyShortUrl');
  const shortCode = Math.floor(Math.random() * 1000000000).toString(32);
  const fetchOptions = {
    method: 'POST',
    body: JSON.stringify(longUrl),
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch(endpoint + '/' + shortCode, fetchOptions);
  const json = await response.json();
  console.log(json);

  const shortUrl = window.location.href + '#' + shortCode;
  shortUrlField.value = shortUrl;
  shortUrlField.removeAttribute('disabled');
  copyShortUrlButton.removeAttribute('disabled');
}

function copyShortened() {
  const shortUrlField = document.getElementById('shortUrl');
  shortUrlField.select();
  document.execCommand('copy');
}
const copyShortUrlButton = document.getElementById('copyShortUrl');
copyShortUrlButton.addEventListener('click', copyShortened);
