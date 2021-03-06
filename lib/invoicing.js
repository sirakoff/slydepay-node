/*
 * slyde ==> list-pay-options
 * Created By barnabasnomo on 2/16/18 at 6:01 PM
 * @soundtrack Flowers - Manny Keys
*/
const request = require('request'),
    Promise = require('bluebird');

let listPayOptions = function(){

    let merchantKey = this.merchantKey,
        emailOrMobileNumber = this.emailOrMobileNumber;
    
    return new Promise(function(resolve, reject){

        request({
            method: 'POST',
            json: {
                emailOrMobileNumber: emailOrMobileNumber,
                merchantKey: merchantKey
            },
            url: 'https://app.slydepay.com.gh/api/merchant/invoice/payoptions'
        }, (err, response, body) => {
            
            if (err) return reject(err);

            if (!body.success || body.errorCode) {

                return reject({
                    code: body.errorCode,
                    message: body.errorMessage
                });

            }

            return resolve(body);

        });


    });

};

let createInvoice = function(options) {

    let merchantKey = this.merchantKey,
        emailOrMobileNumber = this.emailOrMobileNumber;

    return new Promise(function(resolve, reject){

        if (!options.amount) {

            return reject({
                code: 'NO_AMOUNT_SPECIFIED',
                message: 'Cannot process payment for undefined amount'
            });

        }


        let payload = {
            merchantKey: merchantKey,
            emailOrMobileNumber: emailOrMobileNumber,
            amount: options.amount,
            orderCode: options.orderCode
        };

        if (options.orderItems) payload.orderItems = options.orderItems;
        if (options.description) payload.description = options.description;

        // Create and Send Invoice
        if (options.sendInvoice) {

            payload.sendInvoice = true;
            if (!options.customerName) return reject({code: 'INVALID_C_NAME', message: 'Customer Name is required'});
            else payload.customerName = options.customerName;

            if (!options.customerEmail && !options.customerMobileNumber) {

                return reject({
                    code: 'INVALID_C_CONTACT',
                    message: 'Customer EMAIL or MOBILE NUMBER is required'
                });

            } else {
            
                if (options.customerEmail) payload.customerEmail = options.customerEmail;
                if (options.customerMobileNumber) payload.customerMobileNumber = options.customerMobileNumber;

            }

        }
    
        request({
            method: 'POST',
            json: payload,
            url: 'https://app.slydepay.com.gh/api/merchant/invoice/create'
        }, (err, response, body) => {
            
            if (err) return reject(err);

            if (!body.success || body.errorCode) {

                return reject({
                    code: body.errorCode,
                    message: body.errorMessage
    
                });

            }

            return resolve(body);
        });

    });

};


let sendInvoice = function(options){

    let merchantKey = this.merchantKey,
        emailOrMobileNumber = this.emailOrMobileNumber;

    return new Promise(function(resolve, reject) {
        
        let payload = {
            merchantKey: merchantKey,
            emailOrMobileNumber: emailOrMobileNumber,
            payToken: options.payToken,
            payOption: options.payOption,
            customerName: options.customerName
        };

        if (!options.customerEmail && !options.customerMobileNumber) {

            return reject({
                code: 'INVALID_C_CONTACT',
                message: 'Customer EMAIL or MOBILE NUMBER is required'
            });

        }
        else if (options.customerMobileNumber) payload.customerMobileNumber = options.customerMobileNumber;
        else if (options.customerEmail) payload.customerEmail = options.customerEmail;

        request({
            method:'POST',
            json:payload,
            url: 'https://app.slydepay.com.gh/api/merchant/invoice/send'
        }, (err, response, body)=>{

            if (err) return reject(err);

            if (!body.success || body.errorCode) {

                return done({
                    code: body.errorCode,
                    message: body.errorMessage
                });

            }

            return resolve(body);

        });
    
    });

};

let checkPaymentStatus = function(options){

    let merchantKey = this.merchantKey,
        emailOrMobileNumber = this.emailOrMobileNumber;

    return new Promise(function(resolve, reject){
        
        let payload = {
            merchantKey: merchantKey,
            emailOrMobileNumber: emailOrMobileNumber,
            orderCode:options.orderCode,
            payToken:options.payToken,
            confirmTransaction: options.confirmTransaction === true
        };
    
        request({
            method:'POST',
            json:payload,
            url:'https://app.slydepay.com.gh/api/merchant/invoice/checkstatus'
        }, (err, response, body)=>{

            if (err) return reject(err);

            if (!body.success || body.errorCode) {

                return reject({
                    code: body.errorCode,
                    message: body.errorMessage
    
                });

            }

            return resolve(body);

        })
    
    });

};

module.exports = {
    listPayOptions,
    createInvoice,
    sendInvoice,
    checkPaymentStatus
};