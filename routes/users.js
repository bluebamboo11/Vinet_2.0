var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/vinet', {useNewUrlParser: true});
// mongoose.set('useFindAndModify', false);
var userSchema = new mongoose.Schema({
    name: String,
    pass: String
});
var user = mongoose.model('user', userSchema);
// user.create({name:'admin',pass:'1234'});
router.get('/', function (req, res, next) {
    res.sendFile('index.html', {root: __dirname})
});

router.post('/addUser', function (req, res, next) {
    if (req.body) {
        user.find({}, function (err, doc) {
            let exits = false;
            doc.forEach(function (user) {
                if (user.name === req.body.name) {
                    exits = true;
                    res.send({ok: false})
                }
            });
            if (!exits) {
                user.create({name: req.body.name, pass: '1234'}, function (err, small) {
                    res.send({ok: true, data: small});
                });
            }
        })
    } else {
        next();
    }

});
router.get('/getAllUser', function (req, res, next) {
    user.find({}, function (err, doc) {
        res.send(doc);
    })
});
router.post('/updatePass', function (req, res, next) {
    if (req.body) {
        const userChange = req.body;
        user.findByIdAndUpdate(userChange.user._id,{pass:userChange.user.pass},{new:true}, function (err, doc) {
            console.log(doc);
            console.log(err);
            res.send({ok:true})
        })
    } else {
        next();
    }
});

router.post('/removeUser', function (req, res, next) {
    if (req.body) {
        const userChange = req.body;
        user.findOneAndRemove({name:userChange.name},{}, function (err, doc) {
            res.send({ok:true})
        })
    } else {
        next();
    }
});
module.exports = router;
