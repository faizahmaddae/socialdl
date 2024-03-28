const axios = require("axios");
const ApiResponse = require('../../ApiResponse');
const Utils = require('../../utils');
const cheerio = require('cheerio');
const FormData = require('form-data');


async function downloadVideo(res, url) {
    const baseUrl = `https://youtubesave.io/`;

    const csrfmiddlewaretoken = await Utils.fetchCsrfToken(baseUrl, 'input[name="csrfmiddlewaretoken"]', 'value');

    const headers = {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'en,fa;q=0.9',
        'Cookie': `csrftoken=${csrfmiddlewaretoken};`,
        'Origin': 'https://youtubesave.io',
        'Referer': 'https://youtubesave.io/en/',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest',
    };


    const formData = new FormData();
    formData.append('url', url);
    formData.append('csrfmiddlewaretoken', csrfmiddlewaretoken);

    try {
        const response = await axios.post(baseUrl, formData, { headers });
        // console.log(response.data);
        if (response.status === 200) {
            const html = response.data.template;
        
            const $ = cheerio.load(html.replace(/\\/g, ''));

            const thumbnail = $('.container-fluit').find('img.img-fluid').attr('src');
            const title = $('.container-fluit').find('h5.card-title').text();

            const download_view = $('div#download_view');

            // // find ul
            const items = $(download_view).find('ul').find('li');

            const data = [];
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const label = $(item).find('div').first().text();
                const link = $(item).find('a').attr('href');

                data.push({ 
                    'title': label.replace(/[\n\s]+/g, '').trim(),
                    'badge': label.replace(/[\n\s]+/g, '').trim(),
                    'thumbnail': thumbnail,
                    'download_url': link,
                    'is_video': true
                });
            }
            return ApiResponse.success(res, null, data);
            
        }else{
            return ApiResponse.notFound(res, "Failed to retrieve data");
        }
    } catch (error) {
        console.error("Failed to retrieve data:", error);
        return ApiResponse.internalServerError(res, "Failed to retrieve data");
    }
}



module.exports = {
    downloadVideo,
};

