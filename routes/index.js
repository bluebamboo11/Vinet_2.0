var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var orderSchema = new mongoose.Schema({
    code: String,
    partner: String,
    employee: String,
    phone: String
}, {timestamps: {createdAt: 'created_at'}});
var order = mongoose.model('order', orderSchema);

router.post('/addOrder', function (req, res, next) {
    if (req.body) {
        const obj = req.body;
        console.log(obj);
        order.findOne({code: obj.code}, {}, function (err, doc) {
            if (doc.employee) {
                res.send({order: doc, ok: false})
            } else {
                doc.employee =obj.employee;
                doc.partner =obj.partner;
                doc.save(function (err, docNew) {
                    res.send({order: docNew, ok: true})
                })
            }
        })
    } else {
        next();
    }
});
router.post('/findOrderByCode', function (req, res, next) {
    if (req.body) {
        order.findOne({code: req.body.code}, function (err, doc) {
            if (doc) {
                res.send(doc);
            } else {
                res.send({});
            }
        })
    } else {
        next();
    }
});
router.post('/getAllOrderByEmployee', function (req, res, next) {
    if (req.body) {
        let obj = {};
        if (req.body.partner) {
            obj.partner = req.body.partner;
        }
        if (req.body.name) {
            obj.employee = req.body.name;
        }
        if (req.body.start) {
            obj.created_at = {"$gte": req.body.start, '$lt': req.body.end};
        }
        if (req.body.end && !req.body.start) {
            obj.created_at = {'$lt': req.body.end};
        }
        if (req.body.isFull) {
            console.log(obj);
            order.find(obj).sort("-created_at").exec(function (err, doc) {
                res.send(doc);
            })
        } else {
            order.find(obj).sort("-created_at").limit(50).exec(function (err, doc) {
                res.send(doc);
            })
        }
    } else {
        next();
    }
});
router.post('/getTotalOrder', function (req, res, next) {
    if (req.body) {
        let obj = {};
        if (req.body.partner) {
            obj.partner = req.body.partner;
        }
        if (req.body.name) {
            obj.employee = req.body.name;
        }
        if (req.body.start) {
            obj.created_at = {"$gte": req.body.start, '$lt': req.body.end};
        }
        if (req.body.end && !req.body.start) {
            obj.created_at = {'$lt': req.body.end};
        }
        order.countDocuments(obj, function (err, count) {
            res.send({count: count});
        })
    } else {
        next();
    }
});
router.post('/removeOrderInMonth', function (req, res, next) {
    if (req.body) {
        if (req.body.start) {
            order.deleteMany({created_at: {"$gte": req.body.start, '$lt': req.body.end}}, function (err) {
                res.send({ok: true});
            })
        } else {
            res.send({ok: false});
        }
    } else {
        res.send({ok: false});
    }
});
router.post('/removeOrderByCode', function (req, res, next) {
    if (req.body) {
        if (req.body.code) {
            order.deleteMany({code: req.body.code}, function (err) {
                res.send({ok: true});
            })
        } else {
            res.send({ok: false});
        }
    } else {
        res.send({ok: false});
    }
});
router.post('/importOrder', function (req, res, next) {
    if (req.body) {
        console.log(req.body);
        req.body.forEach(function (data) {
            order.findOneAndUpdate({code:data.code},data,{upsert:true},function () {

            })
        });
        res.send({ok: true});
    } else {
        res.send({ok: false});
    }
});
module.exports = router;
