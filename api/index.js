const express = require("express");
const router = express.Router();
const ApiResponse = require("../ApiResponse");
const Utils = require('../utils');

const youtubeService = require("../services/youtube");
const instagram = require('../services/instagram');
const tiktok = require("../services/tiktok");
const publerService = require("../services/publer");


router.get("/download/", async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) {
    return res.status(400).send(videoUrl);
  }
  let domain = Utils.detectUrl(videoUrl);
  switch (domain) {
    case 'facebook':
      return await publerService.downloadVideo(res, videoUrl);
    case 'tiktok':
      return await tiktok.downloadVideo(res, videoUrl);
      // return await publerService.downloadVideo(res, videoUrl);
    case 'instagram':
      return await instagram.downloadVideo(res, videoUrl);
      // return await publerService.downloadVideo(res, videoUrl);
    case 'youtube':
      return await publerService.downloadVideo(res, videoUrl);;
    case 'twitter':
      return await publerService.downloadVideo(res, videoUrl);
    case 'twitch':
      return await publerService.downloadVideo(res, videoUrl);
    case 'linkedin':
      return await publerService.downloadVideo(res, videoUrl);
    default:
      return res.status(400).send("URL is not supported");
  }

});



// youtube
router.get("/youtube/", async (req, res) => {
  try {
    const videoUrl = req.query.url;
    if (!videoUrl) {
      return res.status(400).send("URL is required");
    }
    const videoInfo = await youtubeService.downloadVideo(res, videoUrl);
  } catch (error) {
    return ApiResponse.internalServerError(res, "Failed to download video");
  }
});

router.post("/convert/", async (req, res) => {
  try {
    const hash = req.body.hash;
    if (!hash) {
      return res.status(400).send("hash is required");
    }
    const videoInfo = await youtubeService.convert(res, hash);
  } catch (error) {
    return ApiResponse.internalServerError(res, "Failed to convert video");
  }
});

module.exports = router;
