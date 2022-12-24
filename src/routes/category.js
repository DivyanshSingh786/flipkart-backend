const express = require('express');
const { requireSignin, adminMiddleware } = require('../common-middleware');
const { addCategory, getCategory, updateCategories, deleteCategories } = require('../controller/category');
const router = express.Router();
// const multer = require('multer');
const shortid = require('shortid');
const path = require('path');

// const storage = multer.diskStorage({
//   destination: function(req, file, cb){
//     cb(null, path.join(path.dirname(__dirname), 'uploads'))
//   },
//   fillename: function(req, file, cb){
//     cb(null, shortid.generate() + '-' + file.originalname)
//   }
// })

// const upload = multer({ storage });

router.post('/category/create', requireSignin, adminMiddleware, addCategory);
router.get('/category/getcategory', getCategory);
router.post('/category/update', updateCategories);
router.post('/category/delete', deleteCategories);

module.exports = router;