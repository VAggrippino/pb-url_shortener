Although this was originally inspired by Palash Bauri's [How to build a simple URL shortener with just HTML and JavaScript](https://medium.freecodecamp.org/building-a-simple-url-shortener-with-just-html-and-javascript-6ea1ecda308c) I discovered many issues with the author's code and decided to correct them in my version. In the end, I adopted a significantly different approach than that used in the article.

* The link provided for `jsonstore.io` doesn't work. This particular site doesn't work without `www` at the beginning.

* The HTML code uses the [`url` input type](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/url) which requires a protocol when you don't specify a [pattern](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/url#pattern), but the JavaScript code is written to accommodate a URL entered without a protocol.

* The author's explanation and understanding of [`toString(32)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toString#Parameters) is incorrect. The argument has nothing to do with generating a "proper" string. It's a mathematical base for the string representation of the number. Base32 is simply the mathematical base that happens to [contain the entire alphabet](https://en.wikipedia.org/wiki/Base32#RFC_4648_Base32_alphabet).

* In order to create the short-code, the original author's code generates two separate random numbers, takes the first three characters after the decimal point from each, then concatenates the two separate numbers? With this design in mind, it would make more sense just to generate one random number and take the last 6 characters.

  I chose to generate a 10-digit random number and convert that to Base32 without the string manipulation. A better implementation would involve checking the database to ensure a particular shortcode hadn't been used before.

    Original:

      Math.random().toString(32).substring(2, 5) + Math.random().toString(32).substring(2, 5);

    More efficient and easier to understand:

      Math.random().toString(32).slice(-6)

    My implementation:

      Math.floor(Math.random() * 1000000000).toString(32)

* The author suggests that URL validation with regular expressions would be safer in some way. This is incorrect. Additionally, there's a (theoretical) performance penalty when using regular expressions, but no benefit for simple string matching like this.

  In my implementation I chose to use a regular expression because it's more concise, but not because it's more secure or more performant.

* The author's code generates a short-code and changes the fragment identifier (hash) of the URL for later retrieval. It's better just to generate the short-code when it's needed and not change the URL unless navigating to a different part of the page.

  This is a UX problem and can effectively break bookmarking.

* The author's code uses `this` inside of a standard function, thereby attaching a value to the `window` object unnecessarily. This suggests that the author doesn't understand `this` in JavaScript. It's better just to use the variable containing the value when it's needed.

-----
> Important: add the send_request() function before the shorturl() function, otherwise it will not work.
-----

* This is incorrect. The author doesn't understand [Hoisting](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting). The order of function definitions doesn't matter.

---
> Now return to index.html and add JQuery because it will be easier to achieve our goals if we use JQuery. Add it at the end of the body tag but before the main.js script tag.
---

* Nothing about jQuery makes the stated goals easier. The author only uses jQuery for AJAX requests. The standard JavaScript [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) appears to have been inspired by jQuery. This was common knowledge and well documented when the article was written.

  This example, modeled after author's code, uses the Fetch API to make an external request:

        function send_request(url) {
          this.url = url;
          fetch(endpoint + "/" + window.location.hash.substr(1), {
            method: 'POST',
            body: JSON.stringify(url),
            headers: {
              'Content-Type': "application/json; charset=utf-8",
            },
          });
        }