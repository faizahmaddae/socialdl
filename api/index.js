const express = require('express');
const router = express.Router();

const ApiResponse = require('../ApiResponse');

const youtubeService = require('../services/youtube');
// const instagramService = require('../services/instagram');
// const tiktokService = require('../services/tiktok');

router.get('/download/', async (req, res) => {
  try {
    const videoUrl = req.query.url;
    if (!videoUrl) {
      return res.status(400).send('URL is required');
    }
    const videoInfo = await youtubeService.downloadVideo(res, videoUrl);
  } catch (error) {
    return ApiResponse.internalServerError(res, "Failed to download video");
  }
});

router.post('/convert/', async (req, res) => {
  try {
    const hash = req.body.hash;
    if (!hash) {
      return res.status(400).send('hash is required');
    }
    const videoInfo = await youtubeService.convert(res, hash);
  } catch (error) {
    return ApiResponse.internalServerError(res, "Failed to convert video");
  }
}
);


module.exports = router;