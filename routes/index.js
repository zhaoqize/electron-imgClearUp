var express = require('express');
var router = express.Router();
var imgCollect = require('../server/imgCollect.js');

router.get('/img_clear_up', function(req, res, next) {
   imgCollect(req.query)
});

module.exports = router;

