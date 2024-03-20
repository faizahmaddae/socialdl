const axios = require("axios");
const ApiResponse = require('../../ApiResponse');
const Utils = require('../../utils');
const cheerio = require('cheerio');
const htmlparser2 = require("htmlparser2");

const headers = {
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Accept-Language': 'en,fa;q=0.9',
    'Content-Type': `application/x-www-form-urlencoded; charset=UTF-8`,
    'Origin': 'https://snaptik.app',
    'Referer': 'https://snaptik.app/',
    'Sec-Ch-Ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"macOS"',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
};


async function downloadVideo(res, url) {
    const baseUrl = `https://snaptik.app/abc2.php`;

    const csrfToken = Utils.fetchCsrfToken('https://snaptik.app/', 'input[name="token"]', 'value');

    let data = {
        'url': url,
        'token': csrfToken ?? '',
    };

    try {
        const response = await axios.post(baseUrl, data, { headers });
        if (response.status === 200) {
            const extractedData = Utils.extract(response.data)
            const p = Utils.parseParameters(extractedData);
            const html = Utils.eval(p[0], p[1], p[2], p[3], p[4], p[5]);
            // console.log(html);
            // first remove \\ and // from the html
            const dom = htmlparser2.parseDocument(html.replace(/\\/g, '').replace(/\/\//g, '/'));
        
            const $ = cheerio.load(dom);
            // div.video-links
            const video_links = $('div.video-links').find('a');
            const tiktokMeta = await getThumbnail(url);
            
            const download_urls = [];
            video_links.each((i, link) => {
                download_urls.push($(link).attr('href'));
            });

            const data = {
                'title': tiktokMeta.title,
                'thumbnail': tiktokMeta.thumbnail_url,
                'download_url': download_urls[0],
                'is_video': tiktokMeta.embed_type === 'video' ? true : false,
                'source': 'snaptik.app'
            };

            return ApiResponse.success(res, null, [data]);
        }
    } catch (error) {
        console.error("Failed to retrieve data:", error);
        return ApiResponse.internalServerError(res, "Failed to retrieve data");
    }
}

async function getThumbnail(videoUrl) {
    const response = await axios.get(`https://www.tiktok.com/oembed?url=${videoUrl}`);
    if (response.status === 200) {
        return response.data;
    }
    return '';
}


module.exports = {
    downloadVideo,
};
