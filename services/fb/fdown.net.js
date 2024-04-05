// Ref: https://fdown.net

const axios = require("axios");
const ApiResponse = require('../../ApiResponse');
const Utils = require('../../utils');
const cheerio = require('cheerio');
const htmlparser2 = require("htmlparser2");
const qs = require('qs');

const  headers ={
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7', 
    'Accept-Encoding': 'gzip, deflate, br, zstd', 
    'Accept-Language': 'en,fa;q=0.9', 
    'Cache-Control': 'max-age=0', 
    'Content-Type': 'application/x-www-form-urlencoded', 
    // 'Cookie': '_ga=GA1.1.1268968371.1712331430; cf_clearance=igFG0H8_DDYjQIUPlpoOUmb_WJlaQz5hG91WzC8a1ok-1712331457-1.0.1.1-cTzhK7J7O9_UcME_nZkTQF5soB10eRN.7nXcnbRDzOTQnVzkPq4e6RK5QcGAqg._qD6a6lxhwGkLva4AsJcelg; __gads=ID=112b96a0a429757b:T=1712331431:RT=1712331872:S=ALNI_MZ46HJJnGgICV25M41qP06FKW1I1g; __gpi=UID=00000dd8e89f57ed:T=1712331431:RT=1712331872:S=ALNI_MZpZVg2d-ubG-YghgCylbQm0vjuHA; __eoi=ID=de0dd7ffeda1dab4:T=1712331431:RT=1712331872:S=AA-AfjaU9x-2farVPnNquGqLtiqB; FCNEC=%5B%5B%22AKsRol-c0DyixZsCS99xyasFTlL1HfbdrtbWNSOV40x5lQCSy-Uo2IXO-u--aubZNWgOFK21KgOH0tq_U_2nC_Tie8viG33_fU4qUIzy3JBigFLnKgirnJp-dlCSd7GwPr8dkh4gFwRD22OzOVEDjpqi2CzLucIf2Q%3D%3D%22%5D%5D; _ga_82ERN9JZD3=GS1.1.1712331430.1.1.1712331907.17.0.0', 
    'Origin': 'https://fdown.net', 
    'Referer': 'https://fdown.net/', 
    'Sec-Ch-Ua': '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"', 
    'Sec-Ch-Ua-Mobile': '?0', 
    'Sec-Ch-Ua-Platform': '"macOS"', 
    'Sec-Fetch-Dest': 'document', 
    'Sec-Fetch-Mode': 'navigate', 
    'Sec-Fetch-Site': 'same-origin', 
    'Sec-Fetch-User': '?1', 
    'Upgrade-Insecure-Requests': '1', 
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
  };

async function downloadVideo(res, url) {

    const baseUrl = 'https://fdown.net/download.php';

    const formData = new FormData();
    formData.append('URLz', url);

    const data = qs.stringify({
        'URLz': url,
    });
    
    try {

        const response = await axios.post(baseUrl, data, { headers });
        // console.log(response.data);
        if (response.status === 200) {
            
            const dom = htmlparser2.parseDocument(response.data);
            const $ = cheerio.load(dom);

            return ApiResponse.success(res, null, {html});
        }
    } catch (error) {
        console.error("Failed to retrieve data:", error);
        return ApiResponse.internalServerError(res, "Failed to retrieve data");
    }
}



module.exports = {
    downloadVideo,
};
