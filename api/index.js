const express = require("express");
const router = express.Router();
const ApiResponse = require("../ApiResponse");
const Utils = require("../utils");

// youtube
const y2mateService = require("../services/yt/y2mate.is");
const youtubesave_io = require("../services/yt/youtubesave.io");

// insta
const instagram = require("../services/insta/instagram");

// tiktok
const tiktok = require("../services/tiktok/tiktok");

// facebook
const snapvidService = require("../services/fb/snapvid");

// all
const publerService = require("../services/publer");
const cobaltService = require("../services/cobalt");



// test route
router.get("/", (req, res) => {
  res.send({ message: "Welcome to the API server" });
});


router.get("/download/", async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) {
    return res.status(400).send({ message: "url_is_required" });
  }
  let domain = Utils.detectUrl(videoUrl);
  console.log("domain", domain);
  switch (domain) {
    case "facebook":
      return await snapvidService.downloadVideo(res, videoUrl);
    case "tiktok":
      return await tiktok.downloadVideo(res, videoUrl);
    // return await publerService.downloadVideo(res, videoUrl);
    case "instagram":
      // return await instagram.downloadVideo(res, videoUrl);
      return await cobaltService.download(res, videoUrl);
    // return await publerService.downloadVideo(res, videoUrl);
    case "youtube":
      // return await publerService.downloadVideo(res, videoUrl);;
      // return await youtubesave_io.downloadVideo(res, videoUrl);
      return await cobaltService.downloadFromYoutube(res, videoUrl);
    case "twitter":
      return await cobaltService.download(res, videoUrl);
      // return await publerService.downloadVideo(res, videoUrl);
    case "twitch":
      return await cobaltService.download(res, videoUrl);
      // return await publerService.downloadVideo(res, videoUrl);
    case "linkedin":
      return await publerService.downloadVideo(res, videoUrl);
    default:
      return res.status(400).send("url_not_supported");
  }
});

































// youtube
router.get("/youtube/", async (req, res) => {
  try {
    const videoUrl = req.query.url;
    if (!videoUrl) {
      return res.status(400).send("URL is required");
    }
    const videoInfo = await y2mateService.downloadVideo(res, videoUrl);
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
    const videoInfo = await y2mateService.convert(res, hash);
  } catch (error) {
    return ApiResponse.internalServerError(res, "Failed to convert video");
  }
});

module.exports = router;
