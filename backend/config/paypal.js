
var paypal = require('paypal-rest-sdk');

module.exports.config = function () {
    paypal.configure({
        'mode': 'sandbox', //sandbox or live
        'client_id': 'AfQr4zXNUvWfWYLpLEmI-Z9Ua_1rrS6AM3dlZY8whMLtgfK_ooSgzquYhH22r_mkRXTdESli6KTkMFWL',
        'client_secret': 'EP0jEjZpyDsDDOl36LKM4_C5BqEBNkvUNX7g_-GS8l6XuiO6p98snChFcWlUtoTXm3JTakGXvIRtMBq_'
    });
};
