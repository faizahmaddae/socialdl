const axios = require("axios");
const ApiResponse = require('../../ApiResponse');
const Utils = require('../../utils');
const cheerio = require('cheerio');
const htmlparser2 = require("htmlparser2");

const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US,en;q=0.9',
    'Connection': 'keep-alive',
    'Host': 'snapinsta.app',
    'Origin': 'https://snapinsta.app',
    'Referer': 'https://snapinsta.app/',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
};


async function downloadVideo(res, url) {
    const baseUrl = `https://snapinsta.app/action2.php`;

    let data = {
        'url': url,
        'action': 'post',
        'lang': 'en'
    };

    try {
        const response = await axios.post(baseUrl, data, { headers });
        // console.log(response.data);
        if (response.status === 200) {
            const extractedData = Utils.extract(response.data);
            const p = Utils.parseParameters(extractedData);
            const html = Utils.eval(p[0], p[1], p[2], p[3], p[4], p[5]);
            // console.log(html);
            const dom = htmlparser2.parseDocument(html.replace(/\\/g, '').replace(/\/\//g, '/'));
            const $ = cheerio.load(dom);

            // find .download-item
            const items = $('div.download-item');

            let data = [];

            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                // div.media-box
                const mediaBox = $(item).find('div.media-box');
                // a data-event="click_download_btn"
                const downloadLink = mediaBox.find('a[data-event="click_download_btn"]');
                // img alt="Preview"
                const img = mediaBox.find('img[alt="Preview"]');
                // check if a content has video text
                const isVideo = downloadLink.text().toLowerCase().includes('video');

                // push
                data.push({
                    "title": `Instagram ${isVideo ? 'video': 'photo'}`,
                    'thumbnail': img.attr('src'),
                    'download_url': downloadLink.attr('href'),
                    'is_video': isVideo,
                    'source': 'snapinsta.app'
                });
            }

            if (data.length === 0) {
                return ApiResponse.notFound(res, "No data found");
            }

            return ApiResponse.success(res, null, data);
        }
    } catch (error) {
        console.error("Failed to retrieve data:", error);
        return ApiResponse.internalServerError(res, "Failed to retrieve data");
    }
}



module.exports = {
    downloadVideo,
};
