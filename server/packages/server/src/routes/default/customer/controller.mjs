import persianJs from 'persianjs';
import _forEach from 'lodash/forEach.js';
import global from '#root/global';
import bcrypt from 'bcrypt';
import axios from "axios";
import {exec} from "child_process";
import https from "https";
import path from "path";
import fs, {exists, promises} from 'fs';
import crypto from 'crypto';

const self = {
    createOne: async function (req, res, next) {
        let Customer = req.mongoose.model("Customer");
        let p_number = req?.body?.phoneNumber?.toString();
        req.body.countryCode = "98";
        if (p_number && p_number != "") {
            p_number = p_number.replace(/\s/g, '');
            p_number = persianJs(p_number).arabicNumber().toString().trim();
            p_number = persianJs(p_number).persianNumber().toString().trim();
            p_number = parseInt(p_number);
            req.body.phoneNumber = p_number;
            if (p_number.toString().length < 12) {
                // console.log(p_number.toString().length, p_number.toString(), 'p_number.toString().length');
                if (p_number.toString().length === 10) {
                    p_number = '98' + p_number.toString();
                }
            }
            console.log(p_number);

            if (isNaN(p_number)) {
                res.json({
                    success: false,
                    message: 'error!',
                    err: 'something wrong in creating customer : customer!',
                });
                return;
            }
        }
        req.body.phoneNumber = parseInt(p_number).toString();

        let ctn = req?.body?.companyTelNumber?.toString();
        if (ctn && ctn != "") {
            ctn = ctn.replace(/\s/g, '');
            ctn = persianJs(ctn).arabicNumber().toString().trim();
            ctn = persianJs(ctn).persianNumber().toString().trim();
            ctn = parseInt(ctn);
            req.body.companyTelNumber = ctn;
            if (ctn.toString().length < 12) {
                // console.log(p_number.toString().length, p_number.toString(), 'p_number.toString().length');
                if (ctn.toString().length === 10) {
                    ctn = '98' + ctn.toString();
                }
            }
            console.log(ctn);

            if (isNaN(ctn)) {
                res.json({
                    success: false,
                    message: 'error!',
                    err: 'something wrong in creating customer : customer!',
                });
                return;
            }
        }
        req.body.companyTelNumber = parseInt(ctn).toString();
        let {companyTelNumber, phoneNumber} = req.body;
        if (phoneNumber == "NaN" || phoneNumber == '') {
            phoneNumber = "";
            delete req.body.phoneNumber
        }
        if (companyTelNumber == "NaN" || companyTelNumber == '') {
            companyTelNumber = "";
            delete req.body.companyTelNumber
        }
        console.log('here')
        try {
            let arr = [];
            if (!(companyTelNumber == '' || companyTelNumber == 'NaN')) {
                arr.push({companyTelNumber: {$regex: companyTelNumber, $options: 'i'}})
            }
            if (!(phoneNumber == '' || phoneNumber == 'NaN')) {
                arr.push({phoneNumber: {$regex: phoneNumber, $options: 'i'}})
            }
            const customers = await Customer.find({
                "$or": arr
            }, '_id phoneNumber companyTelNumber companyName firstName lastName');
            console.log('customers found', customers);
            if (customers && customers[0]) {
                res.json({
                    err: 'customer_exist',
                    success: false,
                    phoneNumber: phoneNumber,
                    companyTelNumber: companyTelNumber,
                    message: "this customer exist!",
                    customers: customers,
                    query: arr
                });
                return 0;
            }
            console.log('customers', customers)
            if (!customers || (customers && !customers[0])) {
                const customer = await Customer.create(req.body);
                console.log('create customer...', customer);
                if (!customer) {
                    res.json({
                        err: err,
                        success: false,
                        message: "error!",
                    });
                    return 0;
                }

                res.json(customer);

                return 0;
            }
        } catch (e) {
            res.json({
                err: e,
                success: false,
                message: "catch!",
            });
            return 0;
        }

    },
    viewOne: function (req, res, next) {
        const Customer = req.mongoose.model('Customer');
        const Admin = req.mongoose.model('Admin');

        const obj = {};
        if (req.mongoose.isValidObjectId(req.params.id)) obj._id = req.params.id;
        else obj.slug = req.params.id;

        if (!obj._id && !obj.slug)
            return res.status(404).json({
                success: false,
            });

        const q = Customer.findOne(obj, {
            password: 0,
            tokens: 0,
        })
            .populate({
                path: 'status.user',
                select: '_id nickname firstName lastName username',
                modal: 'Admin',
            })
            .lean();

        q.exec(function (err, item) {
            if (err)
                return res.status(503).json({
                    success: false,
                    message: 'error!',
                    err: err,
                });

            if (!item) return res.status(404).json({success: false});

            res.json(item);
        });
    },
    allCustomers: function (req, res, next) {
        let Customer = req.mongoose.model('Customer');
        let Order = req.mongoose.model('Order');

        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }
        let fields = '';
        if (req.headers && req.headers.fields) {
            fields = req.headers.fields;
        }
        let search = {};
        if (req.params.search) {
            search['title.' + req.headers.lan] = {
                $exists: true,
                $regex: req.params.search,
                $options: 'i',
            };
        }
        if (req.query.search) {
            search['title.' + req.headers.lan] = {
                $exists: true,
                $regex: req.query.search,
                $options: 'i',
            };
        }
        if (req.query.Search) {
            search['title.' + req.headers.lan] = {
                $exists: true,
                $regex: req.query.Search,
                $options: 'i',
            };
        }

        let thef = req.query;

        if (
            thef.firstName ||
            thef.lastName ||
            thef.phoneNumber ||
            thef.internationalCode ||
            thef.companyTelNumber ||
            thef.campaign ||
            thef.companyName
        ) {
            search = {$or: []};
        }
        if (thef.firstName) {
            search['$or'].push({
                firstName: {$regex: thef.firstName, $options: 'i'},
            });
        }
        if (thef.lastName) {
            search['$or'].push({
                lastName: {$regex: thef.lastName, $options: 'i'},
            });
        }
        if (thef.phoneNumber) {
            search['$or'].push({
                phoneNumber: {$regex: thef.phoneNumber, $options: 'i'},
            });
        }
        if (thef.internationalCode) {
            search['$or'].push({
                internationalCode: {$regex: thef.internationalCode, $options: 'i'},
            });
        }
        if (thef.companyName) {
            search['$or'].push({
                companyName: {$regex: thef.companyName, $options: 'i'},
            });
        }
        if (thef.companyTelNumber) {
            search['$or'].push({
                companyTelNumber: {$regex: thef.companyTelNumber, $options: 'i'},
            });
        }
        if (thef.campaign) {
            search = {"campaign": {"$elemMatch": {_id: thef.campaign, "status": "visited"}}};

        }
        if (thef && thef.status) {
            search = {
                status: thef.status,
            };
        }
        if (search.status) {
            console.log('search.status:', search)

            const response = Customer.aggregate([
                {
                    $match: {
                        $expr: {
                            $eq: [{$last: '$status.status'}, search.status],
                        },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        firstName: 1,
                        lastName: 1,
                        internationalCode: 1,
                        active: 1,
                        source: 1,
                        email: 1,
                        phoneNumber: 1,
                        activationCode: 1,
                        credit: 1,
                        customerGroup: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        status: 1,
                        companyTelNumber: 1,
                        companyName: 1,
                    },
                },
                {
                    $facet: {
                        items: [
                            {
                                $sort: {
                                    createdAt: -1,

                                    updatedAt: -1,
                                    _id: -1,
                                },
                            },
                            {$skip: offset},
                            {$limit: parseInt(req.params.limit)},
                        ],
                        count: [{$count: 'count'}],
                    },
                },
            ]).exec();

            //TODO
            response
                .then((result) => {
                    const customers = result[0].items;
                    const count = result[0].count[0].count;

                    if (!customers) {
                        console.log('err', err);
                        res.json([]);
                        return 0;
                    }
                    let thelength = customers.length,
                        p = 0;

                    res.setHeader('X-Total-Count', count);
                    _forEach(customers, (item, i) => {
                        if (item._id) {
                            let sObj = {customer: item._id};

                            Order.countDocuments(sObj, function (err, theOrderCount) {
                                customers[i].orderCount = theOrderCount;
                                p++;
                                if (p == thelength) {
                                    return res.json(customers);
                                    // 0;
                                }
                            });
                        } else {
                            p++;
                        }
                        if (p == thelength) {
                            return res.json(customers);
                            // 0;
                        }
                    });

                    // })
                })
                .catch((err) => {
                    return res.json([]);
                });
        } else {
            console.log('customer search:', JSON.stringify(search))
            Customer.find(
                search,
                '_id , firstName , lastName , internationalCode , active , source , email , phoneNumber , activationCode , credit , customerGroup  , createdAt , updatedAt , status , companyTelNumber , companyName',
                function (err, customers) {
                    if (err || !customers) {
                        console.log('err', err);
                        res.json([]);
                        return 0;
                    }
                    let thelength = customers.length,
                        p = 0;
                    // delete search['$or'];
                    Customer.countDocuments(search, function (err, count) {
                        if (err || !count) {
                            res.json([]);
                            return 0;
                        }
                        res.setHeader('X-Total-Count', count);
                        _forEach(customers, (item, i) => {
                            if (item._id) {
                                let sObj = {customer: item._id};
                                //
                                // if (req.query['date_gte']) {
                                //
                                //     sObj['createdAt'] = {$lt: new Date(req.query['date_gte'])};
                                // }
                                // if(search['status']){
                                //     sObj['status']=search['status'];
                                // }

                                Order.countDocuments(sObj, function (err, theOrderCount) {
                                    customers[i].orderCount = theOrderCount;
                                    p++;
                                    if (p == thelength) {
                                        return res.json(customers);
                                        // 0;
                                    }
                                });
                            } else {
                                p++;
                            }
                            if (p == thelength) {
                                return res.json(customers);
                                // 0;
                            }
                        });
                    });
                }
            )
                .skip(offset)
                .sort({
                    createdAt: -1,

                    updatedAt: -1,
                    _id: -1,
                })
                .limit(parseInt(req.params.limit))
                .lean();
        }
    },
    getme: function (req, res, next) {
        let Customer = req.mongoose.model('Customer');
        if (req.headers._id){
            Customer.findById(
                req.headers._id,
                '_id email nickname webSite port firstName lastName data phoneNumber internationalCode address',
                function (err, customer) {
                    if (err || !customer) {
                        // console.log('==> pushSalonPhotos() got response err');

                        return res.json({
                            err: err,
                            success: false,
                            message: 'error',
                        });
                    }

                    return res.json({
                        success: true,
                        customer: customer,
                    });
                }
            );}
        else{
            res.json({
                success: false,
            });}
    },

    authCustomer: function (req, res, next) {
        let Customer = req.mongoose.model('Customer');
        console.log('\n\n\n\n\n =====> try login/register user:');
        // let self=this;
        let p_number = req.body.phoneNumber.toString();
        let fd = req.body.countryCode.toString();
        if (p_number) {
            p_number = p_number.replace(/\s/g, '');
            // console.log('==> addCustomer() 1.11');
            p_number = persianJs(p_number).arabicNumber().toString().trim();
            p_number = persianJs(p_number).persianNumber().toString().trim();
            p_number = parseInt(p_number);
            // console.log('==> addCustomer() 1.15');
            req.body.phoneNumber = p_number;
            if (p_number.toString().length < 12) {
                // console.log(p_number.toString().length, p_number.toString(), 'p_number.toString().length');
                if (p_number.toString().length === 10) {
                    p_number = '98' + p_number.toString();
                }
            }
            console.log(p_number);

            if (isNaN(p_number)) {
                res.json({
                    success: false,
                    message: 'error!',
                    err: 'something wrong in creating customer : customer!',
                });
                return;
            }
        } else {
            res.json({
                success: false,
                message: 'error!',
                err: 'something wrong in creating customer : phoneNumber is not entered!',
            });
            return;
        }
        let NUMBER = parseInt(p_number).toString();

        console.log('phone number:', NUMBER);
        Customer.findOne({phoneNumber: NUMBER}, function (err, response) {
            if (err) {
                res.json({
                    success: false,
                    message: 'error!',
                    err: err,
                });
                return 0;
                // reject(err);
            }
            if (response) {
                let obj = {
                    success: response.success,
                    _id: response._id,
                };
                console.log('user was in db before...');
                self.updateActivationCode(obj, res, req, true);
            } else {
                console.log('user was not in db before...');

                //we should create customer
                let objs = req.body;
                objs.phoneNumber = NUMBER;
                Customer.create(
                    {
                        phoneNumber: NUMBER,
                        invitation_code: req.body.invitation_code,
                    },
                    function (err, response) {
                        if (err) {
                            if (parseInt(err.code) == 11000) {
                                Customer.findOne(
                                    {phoneNumber: NUMBER},
                                    function (err3, response) {
                                        if (err3) {
                                            res.json({
                                                success: false,
                                                message: 'error!',
                                                err: err,
                                            });
                                        }
                                        // console.log('registering user...')
                                        self.updateActivationCode(response, res, req);
                                    }
                                );
                            } else {
                                res.json({
                                    success: false,
                                    message: 'error!',
                                    err: err,
                                });
                            }
                        } else {
                            // console.log('==> sending sms');
                            let $text;
                            $text = 'Arvand' + '\n' + 'customer registered!' + '\n' + NUMBER;
                            // console.log($text);
                            // if (req.body.invitation_code) {
                            //     self.addToInvitaitionList(response._id, req.body.invitation_code);
                            // }

                            // global.sendSms('9120539945', $text, '300088103373', null, '98').then(function (uid) {
                            //     // console.log('==> sending sms to admin ...');
                            //     let objd = {};
                            //     objd.message = $text;
                            //     global.notifateToTelegram(objd).then(function (f) {
                            //         // console.log('f', f);
                            //     });
                            // }).catch(function () {
                            //     return res.json({
                            //         success: true,
                            //         message: 'Sth wrong happened!'
                            //     });
                            // });
                            self.updateActivationCode(response, res, req);
                        }
                    }
                );
            }
        });
    },
    updateActivationCode: function (
        response,
        res,
        req,
        userWasInDbBefore = false
    ) {
        console.log('\n\n\n\n\n =====> updateActivationCode');
        let Customer = req.mongoose.model('Customer');
        let Settings = req.mongoose.model('Settings');

        // console.log('==> updateActivationCode');
        // console.log(response);
        Settings.findOne({}, 'passwordAuthentication', function (err, setting) {
            let passwordAuthentication = false;
            if (setting?.passwordAuthentication)
                passwordAuthentication = true;
            console.log("passwordAuthentication",passwordAuthentication)
            let code = Math.floor(100000 + Math.random() * 900000);
            let date = new Date();
            Customer.findByIdAndUpdate(
                response._id,
                {
                    activationCode: code,
                    updatedAt: date,
                },
                {new: true},
                function (err, post) {
                    if (err) {
                        res.json({
                            success: false,
                            message: 'error!',
                        });
                    } else {
                        let shallWeSetPass = true;
                        if (post.password) {
                            shallWeSetPass = false;
                        }
                        if(!passwordAuthentication){
                            shallWeSetPass = true;

                        }
                        res.json({
                            success: true,
                            message: 'Code has been set!',
                            userWasInDbBefore: userWasInDbBefore,
                            shallWeSetPass: shallWeSetPass,
                        });
                        console.log('==> sending sms');
                        let $text;
                        $text = 'فروشگاه آنلاین آروند' + ' : ' + post.activationCode;
                        console.log('req.body.method', req.body.method);
                        console.log('activation code is:', post.activationCode);

                        if (!shallWeSetPass && userWasInDbBefore) {
                            console.log(
                                'shallWeSetPass && userWasInDbBefore:',
                                shallWeSetPass,
                                userWasInDbBefore
                            );

                            return;
                        }
                        if (req.body.method == 'whatsapp') {
                            Customer.findByIdAndUpdate(
                                response._id,
                                {
                                    whatsapp: true,
                                },
                                {new: true},
                                function (err, cus) {
                                    return;
                                }
                            );
                        } else {
                            let key = 'sms_welcome';
                            if (userWasInDbBefore) {
                                key = 'sms_register';
                            }
                            console.log('...global.sendSms');
                            global
                                .sendSms(
                                    req.body.phoneNumber,
                                    [
                                        {
                                            key: 'activationCode',
                                            value: post.activationCode,
                                        },
                                    ],
                                    '300088103373',
                                    response._id,
                                    req.body.countryCode,
                                    key
                                )
                                .then(function (uid) {
                                    console.log(
                                        'activation code sent via sms to customer:',
                                        req.body.phoneNumber
                                    );
                                    return;
                                })
                                .catch(function (e) {
                                    console.log('sth is wrong', e);
                                    return;
                                });
                        }
                    }
                }
            );
        })
    },
    activateCustomer: function (req, res, next) {
        let Customer = req.mongoose.model('Customer');
        let Settings = req.mongoose.model('Settings');

        // console.log('==> updateActivationCode');
        // console.log(response);
        Settings.findOne({}, 'passwordAuthentication', function (err, setting) {
            let passwordAuthentication = false;
            if (setting?.passwordAuthentication)
                passwordAuthentication = true;
            console.log("passwordAuthentication", passwordAuthentication)

            console.log('activateCustomer...');
            let p_number = req.body.phoneNumber;
            if (p_number) {
                // console.log('==> addCustomer() 1.11');
                p_number = persianJs(p_number).arabicNumber().toString().trim();
                p_number = persianJs(p_number).persianNumber().toString().trim();
                p_number = parseInt(p_number);
                if (p_number.toString().length < 12) {
                    // console.log(p_number.toString().length, p_number.toString(), 'p_number.toString().length');
                    if (p_number.toString().length === 10) {
                        p_number = '98' + p_number.toString();
                    }
                }
                // console.log('==> addCustomer() 1.15');
                if (isNaN(p_number)) {
                    res.json({
                        success: false,
                        message: 'something wrong in creating customer : customer!',
                    });
                    return;
                }
            } else {
                res.json({
                    success: false,
                    message:
                        'something wrong in creating customer : phoneNumber is not entered!',
                });
                return;
            }
            req.body.phoneNumber = p_number.toString();
            // console.log('customer phone number is:', p_number.toString());

            p_number = req.body.activationCode;
            if (p_number) {
                // console.log('==> addCustomer() 1.11');
                p_number = persianJs(p_number).arabicNumber().toString().trim();
                p_number = persianJs(p_number).persianNumber().toString().trim();
                p_number = parseInt(p_number);
                // console.log('==> addCustomer() 1.15');
                if (isNaN(p_number)) {
                    res.json({
                        success: false,
                        message: 'something wrong in creating customer : customer!',
                    });
                    return;
                }
            } else {
                res.json({
                    success: false,
                    message:
                        'something wrong in creating customer : activationCode is not entered!',
                });
                return;
            }
            req.body.activationCode = p_number.toString();
            // console.log('activationCode is:', p_number.toString());
            // parseInt(p_number).toString()

            Customer.findOne(
                {phoneNumber: req.body.phoneNumber},
                '_id activationCode internationalCode webSite port address firstName lastName invitation_code',
                function (err, user) {
                    if (err) return next(err);
                    // console.log('user is:', user);
                    if (user) {
                        // console.log('==> check db.activationCode with req.body.activationCode');
                        // console.log(user.activationCode, req.body.activationCode);
                        if (user.activationCode == req.body.activationCode) {
                            let Token = global.generateUnid();
                            let invitation_code;
                            if (!user.invitation_code) {
                                invitation_code = Math.floor(100000 + Math.random() * 900000);
                            } else {
                                invitation_code = user.invitation_code;
                            }
                            console.log('Token generated:', Token);
                            Customer.findByIdAndUpdate(
                                user._id,
                                {
                                    activationCode: null,
                                    invitation_code: invitation_code,
                                    $push: {tokens: {token: Token, os: req.body.os}},
                                },
                                {
                                    returnNewDocument: true,
                                    projection: {
                                        password: true,
                                        // internationalCode:true,
                                        // address:true,
                                        // firstName:true,
                                        // lastName:true
                                    },
                                },
                                function (err, post) {
                                    if (err) return next(err);
                                    // console.log('user activated successfully...');
                                    // if (post.tokens)
                                    // console.log('user tokens count is:', post.tokens.length);
                                    let shallWeSetPass = true;
                                    if (post.password) {
                                        shallWeSetPass = false;
                                    }
                                    if(!passwordAuthentication){
                                        shallWeSetPass = false;

                                    }
                                    console.log("set shallWeSetPass",shallWeSetPass)
                                    return res.json({
                                        success: true,
                                        token: Token,
                                        address: user.address,
                                        webSite: user.webSite,
                                        firstName: user.firstName,
                                        lastName: user.lastName,
                                        internationalCode: user.internationalCode,
                                        shallWeSetPass: shallWeSetPass,
                                        invitation_code: invitation_code,
                                        _id: user._id,
                                        message: 'Your user account activated successfully!',
                                    });
                                }
                            );
                        } else {
                            return res.json({
                                success: false,
                                message: 'The code is wrong!',
                            });
                        }
                    } else {
                        return res.json({
                            success: false,
                            message: 'This user was not found!',
                        });
                    }
                }
            );
        });
    },
    authCustomerWithPassword: function (req, res, next) {
        // console.log('\n\n\n\n\n =====> try login/register user:');
        // let self=this;
        let Customer = req.mongoose.model('Customer');

        let p_number = req.body.phoneNumber.toString();
        if (p_number) {
            p_number = p_number.replace(/\s/g, '');
            // console.log('==> addCustomer() 1.11');
            p_number = persianJs(p_number).arabicNumber().toString().trim();
            p_number = persianJs(p_number).persianNumber().toString().trim();
            p_number = parseInt(p_number);
            // console.log('==> addCustomer() 1.15');
            req.body.phoneNumber = p_number;
            if (p_number.toString().length < 12) {
                // console.log(p_number.toString().length, p_number.toString(), 'p_number.toString().length');
                if (p_number.toString().length === 10) {
                    p_number = '98' + p_number.toString();
                }
            }
            // console.log(p_number);

            if (isNaN(p_number)) {
                res.json({
                    success: false,
                    message: 'error!',
                    err: 'something wrong in creating customer : customer!',
                });
                return;
            }
        } else {
            res.json({
                success: false,
                message: 'error!',
                err: 'something wrong in creating customer : phoneNumber is not entered!',
            });
            return;
        }
        let NUMBER = parseInt(p_number).toString();

        // console.log('this is phone number:', NUMBER);
        Customer.authenticate(NUMBER, req.body.password, function (error, cus) {
            if (error || !cus) {
                let err = new Error('Wrong phoneNumber or password.');
                err.status = 401;
                res.status(401);
                return res.json({
                    success: false,
                    message: 'شماره موبایل یا رمز عبور اشتباه!',
                });
            } else {
                // req.session.userId = user._id;

                return res.json({
                    success: true,
                    message: 'در حال ریدایرکت...',
                    customer: cus,
                });
            }
        });
    },
    authCustomerForgotPass: function (req, res, next) {
        let Customer = req.mongoose.model('Customer');

        console.log('\n\n\n\n\n =====> Customer Forgot Password:');
        // let self=this;
        let p_number = req.body.phoneNumber.toString();
        if (p_number) {
            p_number = p_number.replace(/\s/g, '');
            // console.log('==> addCustomer() 1.11');
            p_number = persianJs(p_number).arabicNumber().toString().trim();
            p_number = persianJs(p_number).persianNumber().toString().trim();
            p_number = parseInt(p_number);
            // console.log('==> addCustomer() 1.15');
            req.body.phoneNumber = p_number;
            // if (p_number.toString().length < 12) {
            //     console.log(p_number.toString().length, p_number.toString(), 'p_number.toString().length');
            //     if (p_number.toString().length === 10) {
            //         p_number = "98" + p_number.toString();
            //     }
            // }
            // console.log(p_number);

            if (isNaN(p_number)) {
                res.json({
                    success: false,
                    message: 'error!',
                    err: 'something wrong in creating customer : customer!',
                });
                return;
            }
        } else {
            res.json({
                success: false,
                message: 'error!',
                err: 'something wrong in creating customer : phoneNumber is not entered!',
            });
            return;
        }
        let NUMBER = parseInt(p_number).toString();

        console.log('this phone number:', NUMBER);
        Customer.findOne({phoneNumber: NUMBER}, function (err, response) {
            if (err) {
                res.json({
                    success: false,
                    message: 'error!',
                    err: err,
                });
                return 0;
                // reject(err);
            }
            if (response) {
                let obj = {
                    success: response.success,
                    _id: response._id,
                };
                // console.log('user was in db before...');
                Customer.findOneAndUpdate(
                    {phoneNumber: NUMBER},
                    {password: ''},
                    function (err, response) {
                        self.updateActivationCode(obj, res, req, true);
                    }
                );
            } else {
                //we should create customer
                let objs = req.body;
                objs.phoneNumber = NUMBER;
                Customer.create(
                    {
                        phoneNumber: NUMBER,
                        invitation_code: req.body.invitation_code,
                    },
                    function (err, response) {
                        if (err) {
                            if (parseInt(err.code) == 11000) {
                                Customer.findOne(
                                    {phoneNumber: NUMBER},
                                    function (err3, response) {
                                        if (err3) {
                                            res.json({
                                                success: false,
                                                message: 'error!',
                                                err: err,
                                            });
                                        }
                                        // console.log('registering user...')
                                        self.updateActivationCode(response, res, req);
                                    }
                                );
                            } else {
                                res.json({
                                    success: false,
                                    message: 'error!',
                                    err: err,
                                });
                            }
                        } else {
                            // console.log('==> sending sms');
                            let $text;
                            $text = 'Arvand' + '\n' + 'customer registered!' + '\n' + NUMBER;
                            // console.log($text);
                            if (req.body.invitation_code) {
                                self.addToInvitaitionList(
                                    response._id,
                                    req.body.invitation_code
                                );
                            }

                            // global.sendSms('9120539945', $text).then(function (uid) {
                            //     // console.log('==> sending sms to admin ...');
                            //     let objd = {};
                            //     objd.message = $text;
                            //     global.notifateToTelegram(objd).then(function (f) {
                            //         console.log('f', f);
                            //     });
                            // }).catch(function () {
                            //     return res.json({
                            //         success: true,
                            //         message: 'Sth wrong happened!'
                            //     });
                            // });
                            self.updateActivationCode(response, res, req);
                        }
                    }
                );
            }
        });
    },
    setPassword: function (req, res, next) {
        let Customer = req.mongoose.model('Customer');

        // console.log('\n\n\n\n\n =====> try to set password:');
        console.log('before hash');
        bcrypt.hash(req.body.password, 10, function (err, hash) {
            let obj = {};
            if (!err) {
                // return next(err);
                req.body.password = hash;
                obj['password']=req.body.password;

            }
            // console.log('after hash');

            if (req.body.email) {
                obj['email'] = req.body.email;
            }
            if (req.body.nickname) {
                obj['nickname'] = req.body.nickname;
            }
            if (req.body.firstName) {
                obj['firstName'] = req.body.firstName;
            }
            if (req.body.webSite) {
                obj['webSite'] = req.body.webSite;
            }
            if (req.body.lastName) {
                obj['lastName'] = req.body.lastName;
            }
            if (req.body.internationalCode) {
                obj['internationalCode'] = parseInt(req.body.internationalCode);
            }
            if (req.body.data) {
                obj['data'] = req.body.data;
            }
            if (req.body.address) {
                if(req.body.address instanceof Array)
                    obj['address'] = req.body.address;
            }
            console.log('obj', obj);
            Customer.findOneAndUpdate(
                {
                    _id: req.headers._id,
                },
                obj,

                {
                    new: true,
                    projection: {
                        _id: 1,
                        email: 1,
                        nickname: 1,
                        firstName: 1,
                        lastName: 1,
                        webSite: 1,
                        internationalCode: 1,
                        address: 1,
                    },
                },
                function (err, customer) {
                    // console.log('==> pushSalonPhotos() got response');

                    if (err || !customer) {
                        // console.log('==> pushSalonPhotos() got response err');

                        return res.json({
                            err: err,
                            success: false,
                            message: 'error',
                        });
                    }

                    return res.json({
                        success: true,
                        customer: customer,
                    });
                }
            );
        });
    },
    createSubDomain: function (req, res, next) {
        if (!req.body.sessionId || !req.body.subdomain){
            res.json({
                success:false,
                message: 'there is no sessionId or subdomain!'
            })
        }
        let data = JSON.stringify({
          "domain": "nodeeweb.com",
          "subdomain": req.body.subdomain,
          "json": "yes",
          "action": "create"
        });

        const agent = new https.Agent({
          rejectUnauthorized: false,
        });

        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'https://194.48.198.226:2222/CMD_SUBDOMAIN?json=yes',
          httpsAgent: agent,
          headers: {
            'accept': 'application/json',
            'accept-language': 'en-US,en;q=0.9,de;q=0.8,fa;q=0.7',
            'content-type': 'application/json',
            'cookie': `session=${req.body.sessionId}; session=${process.env.DIRECT_ADMIN_SESSION}`,
            'origin': 'https://194.48.198.226:2222',
            'priority': 'u=1, i',
            'referer': 'https://194.48.198.226:2222/evo/user/subdomains',
            'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
            'x-directadmin-session-id': req.body.sessionId,
            'x-json': 'yes'
          },
          data : data
        };

        axios.request(config)
        .then((response) => {
          console.log('subdomain created successfully!',JSON.stringify(response.data));
          res.json({
              success: true,
              message: 'subdomain created successfully!',
          })
        })
        .catch((error) => {
          console.log("error in creating subdomain", error);
          res.json({
              success: false,
              message: error.message,
          })
        });

    },
    getSource: function (req, res, next) {
        if (!req.body.title){
            res.json({
                success:false,
                message: 'there is no domain title!'
            })
        }
        const __dirname = path.resolve();
        // Assuming `req.body.title` is coming from an Express.js request
        const title = req.body.title; // Make sure to sanitize this input to avoid shell injection
        const sourcePath = path.resolve(__dirname, '../source/*');
        const destinationPath = path.resolve(__dirname, `../../../${title}.nodeeweb.com/public_html/`);

        // testing paths in local
        // const sourcePath = path.resolve(__dirname, '../source/');
        // const destinationPath = path.resolve(__dirname, `tmpp`);

        console.log(sourcePath, destinationPath)
        if (!fs.existsSync(destinationPath)) {
            console.log('destinationPath: ', destinationPath)
            res.status(404).send("Website doesn't exist.");
            return;
        }

        const command = `cp -r ${sourcePath} ${destinationPath}`;

        // Testing command for windows
        // const command = `xcopy ${sourcePath} ${destinationPath} /E /H /C /I`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return res.json({
                    success: false,
                    message: error.message
                });
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
                return res.json({
                    success:false,
                    message: stderr
                });
            }
            return res.json({
                success: true,
                message: 'The content of the Website was taken'
            });
        });

    },
    yarnInstall: function (req, res, next) {
        if (!req.body.title){
            res.json({
                success:false,
                message: 'there is no domain title!'
            })
        }
        const __dirname = path.resolve();
        // Assuming `req.body.title` is coming from an Express.js request
        const title = req.body.title; // Make sure to sanitize this input to avoid shell injection
        const targetPath = path.resolve(__dirname, `../../../${title}.nodeeweb.com/public_html/server`);

        // testing paths in local
        // const targetPath = path.resolve(__dirname, `tmpp/server/`);

        if (!fs.existsSync(targetPath)) {
            console.log('destinationPath: ', targetPath)
            res.status(404).send("Website doesn't exist.");
            return;
        }

        const command = `cd ${targetPath} && yarn install`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return res.json({
                    success: false,
                    message: error.message
                });
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
                return res.json({
                    success:true,
                    message: stderr
                });
            }
            return res.json({
                success: true,
                message: 'packages installed'
            });
        });

    },
    addEnvLocal: function (req, res, next) {
        if (!req.body.title){
            res.json({
                success:false,
                message: 'there is no domain title!'
            })
        }
        const __dirname = path.resolve();
        const title = req.body.title; // Make sure to sanitize this input to avoid shell injection
        const targetPath = path.resolve(__dirname, `../../../${title}.nodeeweb.com/public_html/server`);

        // testing paths in local
        // const targetPath = path.resolve(__dirname, `tmpp/server/`);

        if (!fs.existsSync(targetPath)) {
            console.log('destinationPath: ', targetPath)
            res.status(404).send("Website doesn't exist.");
            return;
        }

        const command = `cd ${targetPath} && touch .env.local && cp .env .env.local && cat .env.local`;

        // testing for windows
        // const command = `cd ${targetPath} && type nul > .env.local && copy .env .env.local && type .env.local`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return res.json({
                    success: false,
                    message: error.message
                });
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
                return res.json({
                    success:false,
                    message: stderr
                });
            }
            console.log('env.local : ', stdout )
            return res.json({
                success: true,
                message: '.env.local added'
            });
        });

    },
    addMongoDb: function (req, res, next) {
        if (!req.body.title){
            res.json({
                success:false,
                message: 'there is no domain title!'
            })
        }
        const __dirname = path.resolve();
        function generatePassword(length) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            for (let i = 0; i < length; i++) {
                const randomByte = crypto.randomBytes(1);
                result += characters[randomByte[0] % characters.length];
            }
            return result;
        }
        const generatedPassword = generatePassword(30);
        const title = req.body.title; // Make sure to sanitize this input to avoid shell injection


        const mongoCommand = `cd ${__dirname} && mongo -u admin -p lLqX243d17mq9O9Yg5am6cO35s24 --port 2758 --eval "db = db.getSiblingDB('${title}'); db.createUser({user: '${title}', 
            pwd: '${generatedPassword}', roles: [{role: 'dbOwner', db: '${title}'}]});"`;
        console.log("mongoCommand: ", mongoCommand)
        exec(mongoCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return res.json({
                    success: false,
                    message: error.message
                });
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
                return res.json({
                    success:false,
                    message: stderr
                });
            }
            console.log('mongo out : ', stdout )
            return res.json({
                success: true,
                message: 'mongodb added',
                dbPassword: generatedPassword
            });
        });

    },
    changeEnvLocal: function (req, res, next) {
        const title = req.body.title;

        if (!title || !req.body.dbPassword) {
            return res.json({
                success: false,
                message: 'There is no domain title or dbPassword!'
            });
        }

        const __dirname = path.resolve();

        const targetPath = path.resolve(__dirname, `../../../${title}.nodeeweb.com/public_html/server`);

        // testing for windows
        // const targetPath = path.resolve(__dirname, `tmpp/server/`);

        // Define the port range
        const MIN_PORT = 3000;
        const MAX_PORT = 3999;

        // Function to check if a port is available
        function checkPort(port) {
            return new Promise((resolve, reject) => {
                const command = `netstat -tuln | grep :${port}`;
                exec(command, (error, stdout) => {
                    if (error || !stdout) {
                        // If there's no output, the port is available
                        resolve(port);
                    } else {
                        // If the port is busy, resolve with null
                        resolve(null);
                    }
                });
            });
        }

        // Function to find an available port
        function findPort() {
            return new Promise((resolve, reject) => {
                const randomPort = Math.floor(Math.random() * (MAX_PORT - MIN_PORT + 1)) + MIN_PORT;
                checkPort(randomPort).then((port) => {
                    if (port) {
                        resolve(port); // Return the available port
                    } else {
                        findPort().then(resolve); // Recursively try again
                    }
                });
            });
        }

        // Find an available port
        findPort().then((port) => {
            let Customer = req.mongoose.model('Customer');
            const command = `cd ${targetPath} && sed -i \
  -e "s|mongodbConnectionUrl=.*|mongodbConnectionUrl=\"mongodb://${title}:${req.body.dbPassword}@127.0.0.1:2758/?authSource=${title}\"|" \
  -e "s|CLIENT_PORT=.*|CLIENT_PORT=${port}|" \
  -e "s|SERVER_PORT=.*|SERVER_PORT=${port}|" \
  -e "s|dbName=.*|dbName=${title}|" \
  -e "s|SITE_NAME=.*|SITE_NAME=${title}|" \
  -e "s|BASE_URL=.*|BASE_URL=https://${title}.nodeeweb.com|" \
  -e "s|SHOP_URL=.*|SHOP_URL=https://${title}.nodeeweb.com/|" \
  -e "s|ADMIN_URL=.*|ADMIN_URL=https://${title}.nodeeweb.com/admin|" \
  -e "s|NODE_ENV=.*|NODE_ENV=production|" .env.local
`
            //testing command for windows

            Customer.findOneAndUpdate(
                {
                    _id: req.body._id,
                },
                {port: port},

                {
                    new: true,
                    projection: {
                        _id: 1,
                        email: 1,
                        nickname: 1,
                        firstName: 1,
                        lastName: 1,
                        webSite: 1,
                        port: 1,
                        internationalCode: 1,
                        address: 1,
                    },
                },
                function (err, customer) {
                    // console.log('==> pushSalonPhotos() got response');

                    if (err || !customer) {
                        // console.log('==> pushSalonPhotos() got response err');

                        return res.json({
                            err: err,
                            success: false,
                            message: 'error',
                        });
                    }

                    exec(command, (error, stdout, stderr) => {
                        if(error){
                            console.error(`Error: ${error.message}`);
                            return res.json({
                                success: false,
                                message: error.message
                            });
                        }
                        if (stderr) {
                            console.error(`Stderr: ${stderr}`);
                            return res.json({
                                success: false,
                                message: stderr
                            });
                        }
                        return res.json({
                            success: true,
                            message: `.env.local configuration updated with port ${port}`,
                            customer:customer,
                        });
                    })

                }
            );

        }).catch((err) => {
            console.error('Error getting available port:', err);
            return res.json({
                success: false,
                message: 'Error getting available port'
            });
        });
    },
    httpConfig: async function (req, res, next) {
        const { sessionId } = req.body;

        // Validate request input
        if (!sessionId) {
            return res.json({
                success: false,
                message: 'There is no sessionId!'
            });
        }

        // Fetch customer site configurations
        const webSitesConfigs = async () => {
            try {
                const Customer = req.mongoose.model('Customer');
                const customers = await Customer.find(
                    {},
                    '_id firstName lastName webSite port active source email phoneNumber activationCode credit customerGroup createdAt updatedAt status companyTelNumber companyName'
                ).exec();

                if (!customers || customers.length === 0) {
                    console.log('No customers found');
                    return [];
                }

                return customers.filter(item => item.port && item.webSite);
            } catch (error) {
                console.error('Error fetching customers:', error);
                throw error;
            }
        };

        // Prepare data object for the HTTP request
        const data = {
            proxy: "none",
            domain: process.env.DIRECT_ADMIN_DOMAIN || "",
            config: "",
            custom1: "",
            custom2: "",
            custom3: "",
            custom4: `|*if !SUB|
                ProxyRequests Off
                RewriteEngine on
                ProxyPreserveHost on
                ProxyPass / http://194.48.198.226:3097/
                ProxyPassReverse / http://194.48.198.226:3097/
    |*endif|
    `,
            json: "yes"
        };

        try {
            const customerSites = await webSitesConfigs();
            console.log('webSitesConfigs:', customerSites);

            if (customerSites.length > 0) {
                customerSites.forEach(item => {
                    data.custom4 += `|*if SUB="${item.webSite}"|
                ProxyRequests Off
                RewriteEngine on
                ProxyPreserveHost on
                ProxyPass / http://194.48.198.226:${item.port}/
                ProxyPassReverse / http://194.48.198.226:${item.port}/
    |*endif|
    `;
                });
            }

            // Configure HTTPS agent
            const agent = new https.Agent({ rejectUnauthorized: false });

            // Set up the HTTP request
            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                httpsAgent: agent,
                url: 'https://194.48.198.226:2222/CMD_CUSTOM_HTTPD?json=yes',
                headers: {
                    'accept': 'application/json',
                    'accept-language': 'en-US,en;q=0.9,de;q=0.8,fa;q=0.7',
                    'content-type': 'application/json',
                    'cookie': `session=${sessionId}`,
                    'origin': 'https://194.48.198.226:2222',
                    'referer': 'https://194.48.198.226:2222/evo/admin/custom-httpd/domain/nodeeweb.com/httpd/customize/custom4',
                    'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                    'x-directadmin-session-id': sessionId,
                    'x-json': 'yes'
                },
                data: JSON.stringify(data)
            };

            console.log('config headers:', config.headers);

            // Make the HTTP request
            const response = await axios.request(config);
            console.log('Response data:', response.data);

            return res.json({
                success: true,
                message: response.data
            });

        } catch (error) {
            console.error('Error during request:', error);
            return res.json({
                success: false,
                message: error.message
            });
        }
    },
    buildConfig: function (req, res, next) {
        const { sessionId } = req.body;
        if (!sessionId || !req.body.title){
            res.json({
                success:false,
                message: 'there is no sessionId or subdomain!'
            })
        }
        let data = JSON.stringify({
          "action": "all",
          "json": "yes",
          "rewrite_confs": "yes",
        });

        const agent = new https.Agent({
          rejectUnauthorized: false,
        });

        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          httpsAgent: agent,
          url: 'https://194.48.198.226:2222/CMD_CUSTOM_HTTPD?json=yes',
          headers: {
            'accept': 'application/json',
            'accept-language': 'en-US,en;q=0.9,de;q=0.8,fa;q=0.7',
            'content-type': 'application/json',
            'cookie': `session=${sessionId}`,
            'origin': 'https://194.48.198.226:2222',
            'priority': 'u=1, i',
            'referer': 'https://194.48.198.226:2222/evo/admin/custom-httpd',
            'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
            'x-directadmin-session-id': sessionId,
            'x-json': 'yes'
          },
          data : data
        };
        res.json({ "success": true , "message": "configuration is built!"});

        axios.request(config)
            .then((response) => {
                console.log("successfully built!",JSON.stringify(response.data));
                // return res.json({ "success": true });
            })
            .catch((error) => {
                console.error("Error in request:", error.response ? error.response.data : error.message);
                // return res.status(502).json({
                //     success: false,
                //     message: "Error in external service request",
                //     error: error.response ? error.response.data : error.message
                // });
            });

    },
    runPm2: function (req, res, next) {
        if (!req.body.title){
            res.json({
                success:false,
                message: 'there is no domain title!'
            })
        }
        const __dirname = path.resolve();
        // Assuming `req.body.title` is coming from an Express.js request
        const title = req.body.title; // Make sure to sanitize this input to avoid shell injection
        const targetPath = path.resolve(__dirname, `../../../${title}.nodeeweb.com/public_html/server`);

        // testing paths in local
        // const targetPath = path.resolve(__dirname, `tmpp/server/`);

        if (!fs.existsSync(targetPath)) {
            console.log('destinationPath: ', targetPath)
            res.status(404).send("Website doesn't exist.");
            return;
        }
        const command = `cd ${targetPath} && bash -c "source .env.local && pm2 start index.mjs --name ${title}"`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return res.json({
                    success: false,
                    message: error.message
                });
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
                return res.json({
                    success:true,
                    message: stderr
                });
            }
            return res.json({
                success: true,
                message: 'pm2 started!'
            });
        });

    },
    saveToCDN: async function (req, res, next) {
        const { title } = req.body;
        console.log('title for saving in cdn: ', title)
        // Validate request input
        if (!title) {
            return res.json({
                success: false,
                message: 'There is no domain!'
            });
        }

        let data = JSON.stringify({
          "type": "A",
          "name": title,
          "cloud": true,
          "value": [
            {
              "country": "",
              "ip": process.env.DIRECT_ADMIN_IP
            }
          ],
          "upstream_https": "default",
          "ip_filter_mode": {
            "count": "single",
            "geo_filter": "none",
            "order": "none"
          },
          "ttl": 120
        });

        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: `https://napi.arvancloud.ir/cdn/4.0/domains/${process.env.DIRECT_ADMIN_DOMAIN}/dns-records`,
          headers: {
            'authority': 'napi.arvancloud.ir',
            'accept': 'application/json, text/plain, */*',
            'authorization': process.env.ARVAND_CLOUD_API_KEY,
            'cache-control': 'no-cache',
            'content-type': 'application/json'
          },
          data : data
        };

        axios.request(config)
        .then((response) => {
          console.log('true: ',JSON.stringify(response.data));
          return res.json({
              "success": true,
              "message": "domain saved in CDN successfully"
          })
        })
        .catch((error) => {
          console.log('false: ',error);
          return res.json({
              "success": false,
              "error": error
          })
        });


    },

    domainIsExist: function (req, res, next) {
        if (!req.body.title || !req.body.sessionId){
            console.log('req.body', req.body)
            res.json({
                success:false,
                message: 'there is no sessionId or title!'
            })
        }
        const agent = new https.Agent({
          rejectUnauthorized: false,
        });
        let config = {
          method: 'get',
          maxBodyLength: Infinity,
          httpsAgent: agent,
          url: `https://194.48.198.226:2222/CMD_JSON_VALIDATE?json=yes&value=${req.body.title}&domain=nodeeweb.com&type=subdomain`,
          headers: {
            'accept': 'application/json',
            'accept-language': 'en-US,en;q=0.9,de;q=0.8,fa;q=0.7',
            'content-type': 'application/json',
            'cookie': `session=${req.body.sessionId}; session=${process.env.DIRECT_ADMIN_SESSION}`,
            'priority': 'u=1, i',
            'referer': 'https://194.48.198.226:2222/evo/user/subdomains',
            'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
            'x-directadmin-session-id': req.body.sessionId,
            'x-json': 'yes'
          }
        };

        axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
            return res.json({
                success: true,
                message: response.data
            });
        })
        .catch((error) => {
          console.log(error);
            return res.json({
                success: false,
                message: error,
            });
        });

    },
    getSession: function (req, res, next) {
        let data = JSON.stringify({
          "username": process.env.DIRECT_ADMIN_USERNAME,
          "password": process.env.DIRECT_ADMIN_PASSWORD
        });
        const agent = new https.Agent({
          rejectUnauthorized: false,
        });

        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'https://194.48.198.226:2222/api/login',
          httpsAgent: agent,
          headers: {
            'accept': 'application/json',
            'accept-language': 'en-US,en;q=0.9,de;q=0.8,fa;q=0.7',
            'content-type': 'application/json',
            'origin': 'https://194.48.198.226:2222',
            'priority': 'u=1, i',
            'referer': 'https://194.48.198.226:2222/evo/login',
            'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
            'Cookie': `session=${process.env.DIRECT_ADMIN_SESSION}`
          },
          data : data
        };


        axios.request(config)
        .then((response) => {
          console.log('sending is successfully',JSON.stringify(response.data));
          const resData = response.data
            // console.log('response json', resData)
            return res.json({
                success: true,
                sessionInfo: resData
            });
        })
        .catch((error) => {
          console.log("error sending to direct admin", error);
            return res.json({
                success: false,
                message: error,
            });
        });
    },
    getSessionAdmin: function (req, res, next) {
        // console.log('req.body.website: ', req.body.webSite)
        let data = JSON.stringify({
          "username": process.env.DIRECT_ADMIN_ADMIN_USERNAME,
          "password": process.env.DIRECT_ADMIN_ADMIN_PASSWORD
        });
        const agent = new https.Agent({
          rejectUnauthorized: false,
        });

        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'https://194.48.198.226:2222/api/login',
          httpsAgent: agent,
          headers: {
            'accept': 'application/json',
            'accept-language': 'en-US,en;q=0.9,de;q=0.8,fa;q=0.7',
            'content-type': 'application/json',
            'origin': 'https://194.48.198.226:2222',
            'priority': 'u=1, i',
            'referer': 'https://194.48.198.226:2222/evo/login',
            'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
            'Cookie': `session=${process.env.DIRECT_ADMIN_SESSION}`
          },
          data : data
        };


        axios.request(config)
        .then((response) => {
          console.log('sending is successfully',JSON.stringify(response.data));
          const resData = response.data
            // console.log('response json', resData)
            return res.json({
                success: true,
                sessionInfoAdmin: resData
            });
        })
        .catch((error) => {
          console.log("error sending to direct admin", error);
            return res.json({
                success: false,
                message: error.message,
            });
        });
    },
    setPasswordWithPhoneNumber: function (req, res, next) {
        let Customer = req.mongoose.model('Customer');

        // console.log('\n\n\n\n\n =====> try to set password with phone number:');
        // console.log('before hash');
        bcrypt.hash(req.body.password, 10, function (err, hash) {
            if (err) {
                return next(err);
            }
            // console.log('after hash');
            req.body.password = hash;
            let obj = {
                password: req.body.password,
            };
            if (req.body.email) {
                obj['email'] = req.body.email;
            }
            if (req.body.internationalCode) {
                obj['internationalCode'] = parseInt(req.body.internationalCode);
            }
            if (req.body.nickname) {
                obj['nickname'] = req.body.nickname;
            } else {
                if (req.body.firstName && req.body.lastName) {
                    obj['nickname'] = req.body.firstName + ' ' + req.body.lastName;
                }
            }
            if (req.body.firstName) {
                obj['firstName'] = req.body.firstName;
            }
            if (req.body.lastname) {
                obj['lastName'] = req.body.lastName;
            }
            if (req.body.data) {
                obj['data'] = req.body.data;
            }
            if (req.body.address) {
                if(req.body.address instanceof Array)
                obj['address'] = req.body.address;
            }
            let p_number = req.body.phoneNumber.toString();
            if (p_number) {
                p_number = p_number.replace(/\s/g, '');
                // console.log('==> addCustomer() 1.11');
                p_number = persianJs(p_number).arabicNumber().toString().trim();
                p_number = persianJs(p_number).persianNumber().toString().trim();
                p_number = parseInt(p_number);
                // console.log('==> addCustomer() 1.15');
                req.body.phoneNumber = p_number;
                if (p_number.toString().length < 12) {
                    // console.log(p_number.toString().length, p_number.toString(), 'p_number.toString().length');
                    if (p_number.toString().length === 10) {
                        p_number = '98' + p_number.toString();
                    }
                }
                // console.log(p_number);

                if (isNaN(p_number)) {
                    res.json({
                        success: false,
                        message: 'error!',
                        err: 'something wrong in creating customer : customer!',
                    });
                    return;
                }
            } else {
                res.json({
                    success: false,
                    message: 'error!',
                    err: 'something wrong in creating customer : phoneNumber is not entered!',
                });
                return;
            }
            let NUMBER = parseInt(p_number).toString();

            // console.log('this is phone number:', NUMBER);
            Customer.findOneAndUpdate(
                {
                    phoneNumber: NUMBER,
                },
                obj,
                {
                    new: true,
                    projection: {
                        _id: 1,
                        email: 1,
                        nickname: 1,
                        firstName: 1,
                        lastName: 1,
                        tokens: 1,
                        address: 1,
                        internationalCode: 1,
                    },
                },
                function (err, customer) {
                    // console.log('==> pushSalonPhotos() got response');

                    if (err || !customer) {
                        // console.log('==> pushSalonPhotos() got response err');

                        res.json({
                            err: err,
                            success: false,
                            message: 'error',
                        });
                    } else {
                        self.getToken(customer, res);

                        // res.json({
                        //     success: true,
                        //     customer: customer
                        //
                        // })
                    }
                }
            );
        });
    },
    rewriteCustomers: function (req, res, next) {
        let Customer = req.mongoose.model('Customer');
        Customer.find({}, function (err, respo) {
            _forEach(respo, (c) => {
                // console.log('get phoneNumber', c.phoneNumber)
                if (c.phoneNumber.length < 12) {
                    Customer.findByIdAndDelete(c._id, function (err, it) {
                        console.log('delete it', it._id);
                    });
                }
                if (c.phoneNumber.length == 12) {
                    if (!c.lastName && c.firstName) {
                        let obj = {};
                        let las = c.firstName.split(' ');
                        let fi = las.shift();
                        obj['firstName'] = fi;
                        if (obj['firstName'] == 'سید') {
                            let tt = las.shift();
                            obj['firstName'] = obj['firstName'] + ' ' + tt;
                        }
                        obj['lastName'] = las.join(' ', ' ');
                        Customer.findByIdAndUpdate(
                            c._id,
                            obj,
                            function (err, responses) {
                            }
                        );
                    }
                }
            });
        });
    },
    removeDuplicatesCustomers: function (req, res, next) {
        let Customer = req.mongoose.model('Customer');
        Customer.find({}, function (err, respo) {
            _forEach(respo, (cus) => {
                console.log('get phoneNumber', cus.phoneNumber);
                Customer.find(
                    {phoneNumber: cus.phoneNumber},
                    function (err, responses) {
                        if (responses && responses.length > 1) {
                            let mainCust = responses[0];
                            let IDSToDELETE = [];
                            _forEach(responses, (theOtherCustomer, j) => {
                                if (j != 0) IDSToDELETE.push(theOtherCustomer._id);
                                if (theOtherCustomer.sex) {
                                    mainCust.sex = theOtherCustomer.sex;
                                }
                                if (theOtherCustomer.email) {
                                    mainCust.email = theOtherCustomer.email;
                                }
                            });
                            Customer.findByIdAndUpdate(mainCust._id, mainCust);
                            // Customer.deleteMany({_id: {$in: IDSToDELETE}})
                            IDSToDELETE.map(async (id) => {
                                console.log('delete id:', id);

                                await Customer.findByIdAndDelete(id);
                            });
                        }
                    }
                );
            });
        });
    },
    status: function (req, res, next) {
        // console.clear();
        req.body.updatedAt = new Date();
        let Customer = req.mongoose.model('Customer');

        Customer.findByIdAndUpdate(
            req.params._id,
            {
                $push: {
                    status: {
                        user: req.headers._id,
                        status: req.body.status,
                        description: req.body.description,
                        createdAt: new Date(),
                    },
                },
            },
            function (err, post) {
                if (err || !post) {
                    res.json({
                        success: false,
                        message: 'error!',
                    });
                    return 0;
                }

                res.json({
                    success: true,
                    post: post,
                });
            }
        );
    },

    updateAddress: function (req, res, next) {
        let Customer = req.mongoose.model('Customer');

        console.log('\n\n\n\n\n =====> editing updateAddress:');
        let search = {
            $or: [
                {email: {$regex: req.body.email, $options: 'i'}},
                {phoneNumber: {$regex: req.body.phoneNumber, $options: 'i'}},
            ],
        };
        Customer.findOne(
            {_id: req.headers._id},
            '_id , phoneNumber , email , address',
            function (err, respo) {
                if (err) {
                    res.json({
                        success: false,
                        err: err,
                        message: 'خطا در ثبت اطلاعات!',
                    });
                    return;
                }
                // console.log('respo:', respo);
                let c = false;
                if (!respo) {
                    c = true;
                } else {
                    if (respo._id.toString() === req.headers._id.toString()) {
                        c = true;
                    } else {
                        res.json({
                            success: false,
                            message: 'ایمیل یا نام کاربری از قبل وجود دارد!',
                        });
                        return;
                    }
                }
                if (c) {
                    Customer.findByIdAndUpdate(
                        req.headers._id,
                        {
                            address: req.body.address,
                            updatedAt: new Date(),
                        },
                        {
                            new: true,
                            projection: {
                                _id: 1,
                                address: 1,
                            },
                        },
                        function (err, post) {
                            if (err || !post) {
                                res.json({
                                    err: err,
                                    address: req.body.address,
                                    success: false,
                                    message: 'findByIdAndUpdate update error!',
                                });
                                return;
                            }
                            // console.log('customer updated successfully!');
                            res.json({
                                success: true,
                                customer: post,
                            });
                            return;
                        }
                    );
                }
            }
        );
    },
    updateCustomer: function (req, res, next) {
        const Customer = req.mongoose.model('Customer');

        if (!req.headers._id) return res.status(403).json({success: false});

        const query = {
            $or: [
                {email: req.body.email},
                {internationalCode: req.body.internationalCode},
            ],
            _id: {$ne: req.headers._id},
        };

        Customer.findOne(
            query,
            '_id email internationalCode data',
            function (err, respo) {
                if (err)
                    return res.status(503).json({
                        success: false,
                        message: 'error!',
                        err: err,
                    });

                // if (respo)
                //     console.log("respo", respo)
                //     return res.status(400).json({
                //         success: false,
                //         message: 'ایمیل یا کد ملی از قبل وجود دارد!',
                //     });
let dat=respo?.data;

let obj={
                            ...dat,
                            ...req.body?.data
                        }
                Customer.findByIdAndUpdate(
                    req.headers._id,
                    {
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        internationalCode: req.body.internationalCode,
                        updatedAt: new Date(),
                        data:obj,
                    },
                    {new: true},
                    function (err, item) {
                        if (err)
                            return res.status(503).json({
                                success: false,
                                message: 'error!',
                                err: err,
                            });
                        if (!item) return res.status(404).json({success: false});

                        return res.json({
                            success: true,
                            customer: item,
                        });
                    }
                );
            }
        );
    },
};

export default self;
