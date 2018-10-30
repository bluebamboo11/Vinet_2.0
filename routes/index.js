var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var orderSchema = new mongoose.Schema({
    code: String,
    partner:String,
    employee:String,
    phone:String
},{ timestamps: { createdAt: 'created_at' } });
var order = mongoose.model('order', orderSchema);

router.post('/addOrder', function (req, res, next) {
    if (req.body) {
        const obj = req.body;
        console.log(obj);
        order.findOne({code:obj.code},{}, function (err, doc) {
            if(doc){
                res.send({order:doc,ok:false})
            }else {
                order.create(obj,function (err, docNew) {
                    res.send({order:docNew,ok:true})
                })
            }
        })
    } else {
        next();
    }
});
// router.post('/getAllOrder', function (req, res, next) {
//     let obj ={};
//     if(req.body.partner){
//         obj.partner =  req.body.partner;
//     }
//     if(req.body.all){
//         order.find(obj).sort("-created_at").limit( 10 ).exec(function (err, doc) {
//             res.send(doc);
//         })
//     }else {
//         if(req.body.start){
//             obj.created_at =  {"$gte": req.body.start, "$lt": req.body.end};
//             order.find(obj).sort("-created_at").limit( 10 ).exec(function (err, doc) {
//                 res.send(doc);
//             })
//         }
//     }
//
// });
router.post('/getAllOrderByEmployee', function (req, res, next) {
    if(req.body){
        let obj ={};
        if(req.body.partner){
            obj.partner =  req.body.partner;
        }
        if(req.body.name){
            obj.employee = req.body.name;
        }
        if(req.body.all){
            order.find(obj).sort("-created_at").limit( 20 ).exec(function (err, doc) {
                res.send(doc);
            })
        }else {
            if(req.body.start){
                obj.created_at =  {"$gte": req.body.start, "$lt": req.body.end};
                order.find(obj).sort("-created_at").limit( 20 ).exec( function (err, doc) {
                    res.send(doc);
                })
            }
        }

    }else {
        next();
    }

});
module.exports = router;
