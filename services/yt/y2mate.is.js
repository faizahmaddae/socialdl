const axios = require("axios");
const ApiResponse = require('../../ApiResponse');
const Utils = require('../../utils');


// const csrfToken = Utils.fetchCsrfToken("https://en.y2mate.is/");
// console.log(csrfToken);

const headers = {
    "Accept": "*/*",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "Accept-Language": "en,fa;q=0.9",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    // "Origin": "null",
    "Referer": "https://en.y2mate.is/",
    // "Sec-Ch-Ua": "\"Chromium\";v=\"122\", \"Not(A:Brand\";v=\"24\", \"Google Chrome\";v=\"122\"",
    // "Sec-Ch-Ua-Mobile": "?0",
    // "Sec-Ch-Ua-Platform": "\"macOS\"",
    // "Sec-Fetch-Dest": "empty",
    // "Sec-Fetch-Mode": "cors",
    // "Sec-Fetch-Site": "cross-site",
    // "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    // "X-CSRF-TOKEN": csrfToken,
    // "X-Forwarded-For": "73.133.57.109"
    // "X-Forwarded-For": "127.0.0.1"
};

async function downloadVideo(res, url) {
    const baseUrl = `https://srvcdn1.2convert.me/api/json?url=${url}`;
    try {
        const response = await axios.get(baseUrl, { headers });

        if (response.status === 200) {
            const videos = response.data.formats.video
            const audios = response.data.formats.audio
            // const video = videos.find(video => video.quality === "720p");
            const video = videos[videos.length - 1];
            const hash = video.url;
            data = {
                title: response.data.formats.title,
                video_id: response.data.formats.videoId,
                thumbnail: response.data.formats.thumbnail,
                duration: response.data.formats.duration,
                videos,
                // audios,
            }
            return ApiResponse.success(res, null, data);
        }
    } catch (error) {
        console.error("Failed to retrieve data:", error);
        return ApiResponse.internalServerError(res, "Failed to retrieve data");
    }
}

async function convert(res, hash) {
    let result = {};
    try {
        const postResponse = await axios.post("https://srvcdn1.2convert.me/api/json", { 'hash': hash }, { headers });
        const taskId = postResponse.data.taskId;
        // sleep for 2 seconds
        await new Promise(r => setTimeout(r, 2000));
        if (taskId) {
            try {
                const taskResponse = await axios.post("https://srvcdn1.2convert.me/api/json/task", { taskId }, { headers });
                // console.log(taskResponse.data);
                ip = await Utils.getPublicIP();
                result.data = {
                    taskId: taskResponse.data.taskId ?? null,
                    status: taskResponse.data.status ?? null,
                    download_progress: taskResponse.data.download_progress ?? null,
                    convert_progress: taskResponse.data.convert_progress ?? null,
                    ext: taskResponse.data.ext ?? null,
                    quality: taskResponse.data.quality ?? null,
                    filesize: taskResponse.data.filesize ?? null,
                    download_url: taskResponse.data.download ?? null,
                    ip: ip,
                }
                // result.data = taskResponse.data;
            } catch (error) {
                console.error("Failed to retrieve task data:", error);
                return ApiResponse.internalServerError(res, "Failed to retrieve task data");
            }
        }
    } catch (error) {
        console.error("Failed to convert video:", error);
        return ApiResponse.internalServerError(res, "Failed to convert video");
    }

    return ApiResponse.success(res, null, result.data);
}

module.exports = {
    downloadVideo,
    convert,
};
