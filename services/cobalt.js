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
                'thumbnail': thumbnail ?? null,
                'download_url': response.data.url,
                'is_video': true,
            });
            return ApiResponse.success(res, null, data);
        }
    } catch (error) {
        return ApiResponse.notFound(res, 'Failed to download video');
    }
}


async function download(res, url) {

    const params = { 'url': url };
    let data = [];

    try {
        const response = await axios.post(baseUrl, params, { headers });

        // return ApiResponse.success(res, null, response.data);
        if (response.status === 200) {
            
            if(response.data.status === 'picker') {
                response.data.picker.forEach((item) => {
                    data.push({
                        'title': null,
                        'badge': null,
                        'thumbnail': item.thumb ?? item.url,
                        'download_url': item.url,
                        'is_video': item.type === 'video' ? true : false,
                    });
                });
                return ApiResponse.success(res, null, data);

            } else if (response.data.status === 'redirect') {
                const type = await Utils.fetchContentType(response.data.url);
                const isVideo = type.includes('video') ? true : false;
                
                data.push({
                    'title': null,
                    'badge': null,
                    'thumbnail': isVideo ? null : response.data.url,
                    'download_url': response.data.url,
                    'is_video': isVideo,
                });

            }else if (response.data.status === 'stream') {
                
                data.push({
                    'title': null,
                    'badge': null,
                    'thumbnail': null,
                    'download_url': response.data.url,
                    'is_video': true,
                });

            } else {
                return ApiResponse.notFound(res);
            }

            return ApiResponse.success(res, null, data);

        } else {
            return ApiResponse.notFound(res);
        }

    } catch (error) {
        // console.log(error.toJSON());
        return ApiResponse.internalServerError(res, 'Failed to download');
    }
}


module.exports = {
    downloadFromYoutube,
    download,
};
