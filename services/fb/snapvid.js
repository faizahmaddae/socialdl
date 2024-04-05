// Ref: https://snapvid.net/en/facebook-downloader

const axios = require("axios");
const ApiResponse = require('../../ApiResponse');
const Utils = require('../../utils');
const cheerio = require('cheerio');
const htmlparser2 = require("htmlparser2");
const qs = require('qs');

async function downloadVideo(res, url) {

    const baseUrl = 'https://snapvid.net/api/ajaxSearch';

    const requestInfo = await Utils.fetchCsrfTokenWithCookies('https://snapvid.net/en/facebook-downloader', 'input[name="__RequestVerificationToken"]', 'value');

    const data = {
        '__RequestVerificationToken': requestInfo.csrfToken,
        'q': url,
        'w': ''
    };

    const headers = {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'en,fa;q=0.9',
        'Content-Length': `${qs.stringify(data).length}`,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Cookie': `${requestInfo.cookies}`,
        'Origin': 'https://snapvid.net',
        'Referer': 'https://snapvid.net/en/facebook-downloader',
        'Sec-Ch-Ua': '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"macOS"',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest',
    };

    try {
        const response = await axios.post(baseUrl, data, { headers });

        if (response.status === 200) {

            const dom = htmlparser2.parseDocument((response.data.data).replace(/\\/g, ''));
            const $ = cheerio.load(dom);

            // div#fb_page
            const fb_page = $('div#fb_page');

            // find div.thumbnail a get href
            const thumbnail = fb_page.find('div.thumbnail img').attr('src');

            // find div#fbdownloader first div.tab__content
            const fbdownloader = $('div#fbdownloader div.tab__content').first();

            // fbdownloader find table
            const table = fbdownloader.find('table');
            // get rows and loop through
            const rows = table.find('tr');

            const data = [];

            rows.each((i, el) => {
                const row = $(el);
                const title = row.find('td').first().text();
                var link = row.find('td a').attr('href');
                if(link == null){
                    link = row.find('td button').attr('data-videourl');
                }
                if(title == null || link == null){
                    return;
                }
                data.push({
                    "title": null,
                    'badge': title,
                    'thumbnail': thumbnail,
                    'download_url': link,
                    'is_video': true,
                    'source': 'snapvid.net',
                });
            });

            // sort data by badge
            data.sort((a, b) => {
                const resA = parseInt(a.badge.match(/\d+/)[0]);
                const resB = parseInt(b.badge.match(/\d+/)[0]);
                return resB - resA;
            });

            // check data length
            if (data.length > 0) {
                return ApiResponse.success(res, null, [data[0]]);
            }else{
                return ApiResponse.notFound(res, "No data found");
            }
    
        } else {
            return ApiResponse.internalServerError(res, "Failed to retrieve data");
        }

    } catch (error) {
        console.error("Failed to retrieve data:", error);
        return ApiResponse.internalServerError(res, "Failed to retrieve data");
    }
}


module.exports = {
    downloadVideo,
};
