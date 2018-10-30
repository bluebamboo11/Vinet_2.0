var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var partnerSchema = new mongoose.Schema({
    name: String
});
var partner = mongoose.model('partner', partnerSchema);


router.post('/addPartner', function (req, res, next) {
    if (req.body) {
        partner.find({}, function (err, doc) {
            let exits = false;
            doc.forEach(function (pa) {
                if (pa.name === req.body.name) {
                    exits = true;
                    res.send({ok: false})
                }
            });
            if (!exits) {
                partner.create({name: req.body.name}, function (err, small) {
                    res.send({ok: true, data: small});
                });
            }
        })
    } else {
        next();
    }

});
router.get('/getPartner', function (req, res, next) {
    partner.find({}, function (err, doc) {
        if (doc) {
            res.send(doc);
        } else {
            res.send([]);
        }
    })

});

router.post('/removePartner', function (req, res, next) {
    if (req.body) {
        const name = req.body.partner;
        partner.findOneAndRemove({name:name},{}, function (err, doc) {
            res.send({ok:true})
        })
    } else {
        next();
    }
});

module.exports = router;
