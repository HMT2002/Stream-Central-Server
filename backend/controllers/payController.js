
const paypal = require('paypal-rest-sdk');
const userModel=require('../models/mongo/User');
class PayController {
  
    payment(req, res, next) {

        const value =10;
        res.cookie("value", value);
        const create_payment_json = {
          "intent": "sale",
          "payer": {
            "payment_method": "paypal"
          },
          "redirect_urls": {
            "return_url": "http://192.168.1.10:9000/pay/success",
            "cancel_url": "http://localhost:9000/cancel"
          },
          "transactions": [{
            "item_list": {
              "items": [{
                "name": "item",
                "sku": "item",
                "price": value,
                "currency": "USD",
                "quantity": 1
              }]
            },
            "amount": {
              "currency": "USD",
              "total": value
            },
            "description": "This is the payment description."
          }]
        };
    
    
       userModel.findOneAndUpdate({_id:'65631fe6b8d724425b234728'},   { $set: { isVip: true } } ).then((i)=>{
        console.log(i);
       }).catch((err)=>{throw err});
       
        paypal.payment.create(create_payment_json, function (error, payment) {
          if (error) {
            throw error;
          } else {
            for (let i = 0; i < payment.links.length; i++) {
              if (payment.links[i].rel === 'approval_url') {
                res.redirect(payment.links[i].href);
              }
            }
          }
        });
    
      }
    
      success(req, res, next) {
    
        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;
    
        const execute_payment_json = {
          "payer_id": payerId,
          "transactions": [{
            "amount": {
              "currency": "USD",
              "total": 10
            }
          }]
        };
    
        paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
          if (error) {
            console.log(error.response);
            throw error;
          } else {
            console.log(JSON.stringify(payment));
            res.render('success');
          }
        });
      }
    
    
}
module.exports = new PayController();
