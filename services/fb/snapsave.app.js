// Ref: https://snapsave.app/

const axios = require("axios");
const ApiResponse = require('../../ApiResponse');
const Utils = require('../../utils');
const cheerio = require('cheerio');
const htmlparser2 = require("htmlparser2");

const  headers ={
    'Content-Type': 'multipart/form-data',
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Accept-Language': 'en,fa;q=0.9',
    // 'Cookie': '_ga=GA1.1.212952866.1710854059; _pubcid=...',
    'Origin': 'https://snapsave.app',
    'Referer': 'https://snapsave.app/',
    // 'Sec-Ch-Ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
    // 'Sec-Ch-Ua-Mobile': '?0',
    // 'Sec-Ch-Ua-Platform': '"macOS"',
    // 'Sec-Fetch-Dest': 'empty',
    // 'Sec-Fetch-Mode': 'cors',
    // 'Sec-Fetch-Site': 'same-origin',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  };

async function downloadVideo(res, url) {

    const baseUrl = `https://snapsave.app/action.php?lang=en`;


    const formData = new FormData();
    formData.append('url', url);
    
    try {

        const response = await axios.post(baseUrl, formData, { headers });
        // console.log(response.data);
        if (response.status === 200) {
            const extractedData = Utils.extract(response.data);
            const p = Utils.parseParameters(extractedData);
            const html = Utils.eval(p[0], p[1], p[2], p[3], p[4], p[5]);
            // console.log(html);
            const dom = htmlparser2.parseDocument(html.replace(/\\/g, '').replace(/\/\//g, '/'));
            const $ = cheerio.load(dom);

            // do something with the data

            // get back the html
            

    
            return ApiResponse.success(res, null, [$.html()]);
        }
    } catch (error) {
        console.error("Failed to retrieve data:", error);
        return ApiResponse.internalServerError(res, "Failed to retrieve data");
    }
}



module.exports = {
    downloadVideo,
};
