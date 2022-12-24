const express = require('express');
const { requireSignin, adminMiddleware } = require('../../common-middleware');
const { createPage, getPage } = require('../../controller/admin/page');
const router = express.Router();

router.post(`/page/create`, requireSignin, adminMiddleware, createPage);

router.get(`/page/:category/:type`, getPage);

module.exports = router;