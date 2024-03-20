// Ref: https://publer.io/tools/media-downloader

const axios = require("axios");
const ApiResponse = require('../ApiResponse');
const Utils = require('../utils');


const headers = {
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Accept-Language': 'en,fa;q=0.9',
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
};


async function downloadVideo(res, url) {

    const jobInfo = await getJobInfo(url);

    let data = {};
    let result = [];

    try {
        data = await getJobData(jobInfo.job_id);
        while (data.status !== 'complete') {
            await Utils.sleep(1000);
            data = await getJobData(jobInfo.job_id);
        }
        data.payload.forEach((item) => {
            result.push({
                'title': item.name || item.caption,
                'thumbnail': item.thumbnail ?? null,
                'download_url': item.path ?? null,
                'is_video': item.type === 'video' ? true : false,
                'source': 'publer.io'
            });
        });

        return ApiResponse.success(res, null, result);

    } catch (error) {
        console.error("Failed to retrieve data:", error);
        return ApiResponse.internalServerError(res, "Failed to retrieve data");
    }
}

// get status of job
async function getJobData(jobId) {
    const baseUrl = `https://app.publer.io/api/v1/job_status/${jobId}`;
    try {
        const response = await axios.get(baseUrl, { headers });
        console.log(response.data.status);
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error("Failed to retrieve job status:", error);
        return null;
    }
}


async function getJobInfo(url) {
    const baseUrl = "https://app.publer.io/hooks/media";

    let data = {
        "url": url,
        "iphone": false,
    };

    try {
        const response = await axios.post(baseUrl, data, { headers });
        console.log(response.data);
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error("Failed to retrieve data:", error);
        return null;
    }
    console.log("Failed to retrieve data 2222:");
    return null;
}



module.exports = {
    downloadVideo,
};
