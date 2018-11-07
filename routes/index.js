var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var orderSchema = new mongoose.Schema({
    code: String,
    _id: String,
    partner: String,
    employee: String,
    isBlack: {type: Boolean, default: false},
    phone: {type: String, ref: 'phone'}
}, {timestamps: {createdAt: 'created_at'}});

var phoneSchema = new mongoose.Schema({
    _id: String,
}, {timestamps: {createdAt: 'created_at'}});

var order = mongoose.model('order', orderSchema);
var Phone = mongoose.model('phone', phoneSchema);

router.post('/addOrder', function (req, res, next) {
        if (req.body) {
            const obj = req.body;
            obj._id = obj.code;
            order.findOne({code: obj.code}, function (err, doc1) {
                if (doc1) {
                    Phone.findOne({_id: {$in:initPhone([doc1.phone])}}, function (err, phone) {
                        if (phone) {
                            res.send({ok: false, phone: phone._id, order: doc1})
                        } else {
                            if (doc1.employee) {
                                res.send({ok: false, order: doc1})
                            } else {
                                doc1.employee = obj.employee;
                                doc1.partner = obj.partner;
                                doc1.save();
                                res.send({ok: true, order: doc1})
                            }
                        }
                    });
                } else {
                    order.create(obj, function (err, doc) {
                        res.send({ok: true, order: doc})
                    });
                }

            })
        }
        else {
            next();
        }
    }
);
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
router.post('/findOrderBlack', function (req, res, next) {
    if (req.body) {
        let obj = {isBlack: true};
        if (req.body.phone) {
            let listPhone = initPhone([req.body]);
            obj.phone = {$in: listPhone};
        } else {
            obj.code = req.body.code
        }
        order.find(obj).sort("-created_at").exec(function (err, doc) {
            res.send(doc);
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
        if (req.body.isBlack) {
            obj.isBlack = true;
        }
        if (req.body.virtualOrder) {
            obj.employee = null;
        }
        if (req.body.isFull) {
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
        if (req.body.isBlack) {
            obj.isBlack = true;
        }
        if (req.body.virtualOrder) {
            obj.employee = null;
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
        let listPhone = [];
        for (let orderData of req.body) {
            orderData._id = orderData.code;
            listPhone.push(orderData.phone);
        }
        Phone.find({_id: {$in: initPhone(req.body)}}, function (err, docs) {
            for (let phoneBlack of docs) {
                for (let orderData of req.body) {
                    if (orderData.phone === phoneBlack._id) {
                        orderData.isBlack = true;
                        break
                    }
                }
            }
            order.create(req.body, function () {
                res.send({ok: true});
            });
        });
    } else {
        res.send({ok: false});
    }
});
router.post('/importBlackList', function (req, res, next) {
    if (req.body) {
        let listPhone = [];
        for (let orderData of req.body) {
            orderData._id = orderData.code;
            listPhone.push(orderData.phone);
        }
        order.updateMany({phone: {$in: initPhone(req.body)}}, {isBlack: true}, {}, function () {
        });
        Phone.create(initPhoneMogo(listPhone), function () {
            res.send({ok: true});
        });
    } else {
        res.send({ok: false});
    }
});
router.post('/addBlackPhone', function (req, res, next) {
    if (req.body) {
        order.findOneAndUpdate({phone: {$in: initPhone([req.body])}}, {isBlack: true}, {}, function () {
        });
        Phone.findOneAndUpdate({_id: req.body.phone}, {_id: req.body.phone}, {upsert: true}, function () {
            res.send({ok: true});
        });
    } else {
        res.send({ok: false});
    }
});

function initPhoneMogo(listPhone) {
    let phoneMogo = [];
    for (let black of listPhone) {
        phoneMogo.push({_id: black})
    }
    return phoneMogo;
}

function initPhone(listPhone) {
    let listPhoneNew = [];
    for (let black of listPhone) {
        let phone = black.phone;
        setPhone(phone, listPhoneNew)
    }
    return listPhoneNew;
}

function setPhone(phone, listPhoneNew) {
    if (phone.slice(0, 3) == '840') {
        addPhone(phone.slice(3, phone.length), listPhoneNew);
        return
    }
    if (phone.slice(0, 2) == '84') {
        addPhone(phone.slice(2, phone.length), listPhoneNew);
        return
    }
    if (phone.slice(0, 1) == '0') {
        addPhone(phone.slice(1, phone.length), listPhoneNew);
        return
    }
    if (phone.slice(0, 4) == '+840') {
        addPhone(phone.slice(4, phone.length), listPhoneNew);
        return
    }
    if (phone.slice(0, 3) == '+84') {
        addPhone(phone.slice(3, phone.length), listPhoneNew);
        return
    }
    addPhone(phone, listPhoneNew);
}

function addPhone(phone, listPhone) {
    if (listPhone.indexOf(phone) === -1) {
        listPhone.push(phone)
    }
    let newPhone = '84' + phone;
    if (listPhone.indexOf(newPhone) === -1) {
        listPhone.push(newPhone)
    }
    newPhone = '0' + phone;
    if (listPhone.indexOf(newPhone) === -1) {
        listPhone.push(newPhone)
    }
    newPhone = '840' + phone;
    if (listPhone.indexOf(newPhone) === -1) {
        listPhone.push(newPhone)
    }
    newPhone = '+840' + phone;
    if (listPhone.indexOf(newPhone) === -1) {
        listPhone.push(newPhone)
    }
    newPhone = '84' + phone;
    if (listPhone.indexOf(newPhone) === -1) {
        listPhone.push(newPhone)
    }
}

module.exports = router;
