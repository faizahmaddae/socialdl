const axios = require('axios');
const cheerio = require('cheerio');
const e = require('express');

class Utils {


  static async fetchContentType(url) {
    return await axios.head(url)
      .then(response => {
        // Return the content type from the response headers
        return response.headers['content-type'];
      })
      .catch(error => {
        // Log the error and return a meaningful message or null
        console.error('Error fetching URL:', error.message);
        return null;
      });
  }

  // use try catch block to handle errors
  static async fetchContentSize(url) {
    try {
      const response = await axios.head(url);
      // Return the content length from the response headers
      return response.headers['content-length'];
    } catch (error) {
      // Log the error and return a meaningful message or null
      console.error('Error fetching URL:', error.message);
      return null;
    }
  }

  // detectUrl
  static detectUrl(url) {

    // let facebookRegex = '^(?:https?:\/\/)?(?:www\.|(?:[a-zA-Z0-9-]+\.)*)(facebook|fb)\.(com|me|watch)\/';
    // let tiktokRegex = '^(?:https?:\/\/)?(?:www\.|(?:[a-zA-Z0-9-]+\.)*)(tiktok)\.(com)\/';
    // let instagramRegex = '^(?:https?:\/\/)?(?:www\.|(?:[a-zA-Z0-9-]+\.)*)(instagram)\.(com)\/';
    // let youtubeRegex = '^(?:https?:\/\/)?(?:www\.|(?:[a-zA-Z0-9-]+\.)*)(youtube)\.(com)\/';
    // let twitterRegex = '^(?:https?:\/\/)?(?:www\.|(?:[a-zA-Z0-9-]+\.)*)(twitter|x)\.(com)\/';
    // let twitchRegex = '^(?:https?:\/\/)?(?:www\.|(?:[a-zA-Z0-9-]+\.)*)(twitch)\.(tv)\/';



    const fbRegex = /(?:https?:\/\/)?(?:www\.|(?:[a-zA-Z0-9-]+\.)*)(facebook|fb)\.(com|me|watch)\//gm;
    const instaRegex = /(?:https?:\/\/)?(?:www\.|(?:[a-zA-Z0-9-]+\.)*)(instagram)\.(com)\//gm;
    const tiktokRegex = /(?:https?:\/\/)?(?:www\.|(?:[a-zA-Z0-9-]+\.)*)(tiktok)\.(com)\//gm;
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.|(?:[a-zA-Z0-9-]+\.)*)(youtube|youtu)\.(com|be)\//gm;
    const twitterRegex = /(?:https?:\/\/)?(?:www\.|(?:[a-zA-Z0-9-]+\.)*)(twitter|x)\.(com)\//gm;
    const twitchRegex = /(?:https?:\/\/)?(?:www\.|(?:[a-zA-Z0-9-]+\.)*)(twitch)\.(tv)\//gm;
    const linkedinRegex = /(?:https?:\/\/)?(?:www\.|(?:[a-zA-Z0-9-]+\.)*)(linkedin)\.(com)\//gm;


    try {
      if (fbRegex.exec(url)) {
        return 'facebook';
      }
      else if (instaRegex.exec(url)) {
        return 'instagram';
      }
      else if (tiktokRegex.exec(url)) {
        return 'tiktok';
      }
      else if (youtubeRegex.exec(url)) {
        return 'youtube';
      }
      else if (twitterRegex.exec(url)) {
        return 'twitter';
      }
      else if (twitchRegex.exec(url)) {
        return 'twitch';
      }
      else if (linkedinRegex.exec(url)) {
        return 'linkedin';
      }
      else {
        return 'unknown';
      }

    } catch (error) {
      console.error('Error detecting URL:', error);
      return 'unknown';
    }
  }

  // sleep
  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static extract(codeSnippet) {
    // Return : "ZSvzZSUzSuzSuzZZizZrvzZxxzZSuzxUzZxrzZxZ",48,"UZuvrSxiz",2,8,12)) or null
    const regex = /"\w+",\d+,"\w+",\d+,\d+,\d+\)\)/;
    const match = codeSnippet.match(regex);
    if (match) {
      return match[0];
    } else {
      console.log(`No match found for code snippet`);
      return null;
    }
  }


  static parseParameters(extractedString) {
    // Return : 'ZSvzZSUzSuzSuzZ', 48, 'UZuvrSxiz', 2, 8,12 
    // Step 1: Trim the trailing characters
    const trimmedString = extractedString.slice(0, -2);

    // Step 2: Split the string by comma
    const paramsArray = trimmedString.split(',');

    // Step 3: Parse each parameter
    const parsedParams = paramsArray.map((param, index) => {
      // Remove quotes from string parameters
      if (param.startsWith('"') && param.endsWith('"')) {
        return param.slice(1, -1);
      }
      // Convert numerical parameters to numbers
      return Number(param);
    });

    return parsedParams;
  }


  static decode(d, e, f) {
    var _constant = ["", "split", "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/", "slice", "indexOf", "", "", ".", "pow", "reduce", "reverse", "0"];
    var g = _constant[2][_constant[1]](_constant[0]);
    var h = g[_constant[3]](0, e);
    var i = g[_constant[3]](0, f);
    var j = d[_constant[1]](_constant[0])[_constant[10]]()[_constant[9]](function (a, b, c) {
      if (h[_constant[4]](b) !== -1) return a += h[_constant[4]](b) * (Math[_constant[8]](e, c))
    }, 0);
    var k = _constant[0];
    while (j > 0) {
      k = i[j % f] + k;
      j = (j - (j % f)) / f
    }
    return k || _constant[11]
  }

  static eval(h, u, n, t, e, r) {
    r = "";
    for (var i = 0, len = h.length; i < len; i++) {
      var s = "";
      while (h[i] !== n[e]) {
        s += h[i];
        i++
      }
      for (var j = 0; j < n.length; j++) s = s.replace(new RegExp(n[j], "g"), j);
      r += String.fromCharCode(this.decode(s, e, 10) - t)
    }
    return decodeURIComponent(escape(r))
  }

  static async getPublicIP() {
    try {
      const response = await axios.get('https://api.ipify.org?format=json');
      console.log(`My public IP address is: ${response.data.ip}`);
      return response.data.ip;
    } catch (error) {
      console.error('Error fetching public IP:', error);
      return '';
    }
  }

  static async fetchCsrfToken(url, selector = 'meta[name="csrf-token"]', attribute = 'content') {
    try {
      // Make an HTTP GET request to the webpage
      const response = await axios.get(url);
      const html = response.data;

      const serverTime = response.headers['date'];
      const timestamp = new Date(serverTime).getTime();

      console.log('Server Time:', timestamp);

      // Use cheerio to parse the HTML
      const $ = cheerio.load(html);

      // Extract the CSRF token from meta tags
      // Adjust the selector as needed based on the meta tag's name or property
      const csrfToken = $(selector).attr(attribute);

      if (csrfToken) {
        console.log('CSRF Token:', csrfToken);
        return csrfToken;
      } else {
        console.error('CSRF Token not found.');
        return null;
      }
    } catch (error) {
      console.error('Error fetching CSRF Token:', error);
    }
  }

}

module.exports = Utils;