const axios = require("axios");
const ApiResponse = require('../ApiResponse');
const Utils = require('../utils');
const url = require('url');



const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
};

const baseUrl = 'https://co.wuk.sh/api/json';



function getYouTubeThumbnailUrl(youtubeUrl) {
    // Extract the video ID using a regular expression
    const videoIdMatch = youtubeUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    
    // Check if a video ID was found
    if (videoIdMatch && videoIdMatch[1]) {
      // Construct the URL for the high-quality thumbnail
      const videoId = videoIdMatch[1];
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    } else {
      // Return a message or null if the video ID could not be extracted
      return null;
    }
  }

async function downloadFromYoutube(res, url) {

    // extract video ID
    // const parsedUrl = new URL(url);
    // const videoId = parsedUrl.searchParams.get('v');

    // https://i.ytimg.com/vi/<--Video ID-->/sddefault.jpg
    // https://i.ytimg.com/vi/4i16Ako-89A/sddefault.jpg
    // https://i.ytimg.com/vi/onHeWRqkPsM/sddefault.jpg

    const params = {
        'url': url,
        'vCodec': 'mp4',
        'vQuality': '1080',
    };

    const thumbnail = getYouTubeThumbnailUrl(url);

    let data = [];

    try {
        const response = await axios.post(baseUrl, params, { headers });
        if (response.status === 200) {
            data.push({
                'title': null,
                'badge': null,
                'thumbnail': thumbnail,
                'download_url': response.data.url,
                'is_video': true,
            });
            return ApiResponse.success(res, null, data);
        }
    } catch (error) {
        return ApiResponse.notFound(res, 'Failed to download video');
    }
}


async function downloadFromInsta(res, url) {

    const params = {
        'url': url,
    };
    let data = [];
    try {
        const response = await axios.post(baseUrl, params, { headers });
        if (response.status === 200) {

            if (response.data.status === 'redirect') {

                const type = await Utils.fetchContentType(response.data.url);
                
                data.push({
                    'title': null,
                    'badge': null,
                    'thumbnail': type.includes('video') ? null : response.data.thumb,
                    'download_url': response.data.url,
                    'is_video': type.includes('video') ? true : false,
                });

            } else if (response.data.status === 'picker') {

                response.data.picker.forEach((item) => {
                    data.push({
                        'title': null,
                        'badge': null,
                        'thumbnail': item.thumb,
                        'download_url': item.url,
                        'is_video': item.type == 'video' ? true : false,
                    });
                });

            } else {

                return ApiResponse.notFound(res, 'not found');
            }

            return ApiResponse.success(res, null, data);

        } else {

            return ApiResponse.notFound(res, 'not found');
        }
    } catch (error) {
        return ApiResponse.notFound(res, 'not found');
    }
}


module.exports = {
    downloadFromYoutube,
    downloadFromInsta,
};
