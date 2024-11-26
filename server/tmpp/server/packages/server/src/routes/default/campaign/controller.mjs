import _forEach from "lodash/forEach.js";
import {setTimeout} from "timers/promises";
import _get from "lodash/get.js";
import global from "#root/global";

const self = {
    create: function (req, res, next) {
        console.log('create campaign....');
        const Campaign = req.mongoose.model("Campaign");
        let Customer = req.mongoose.model('Customer');

        delete req.body.slug;
        if (!req.body.slug) {
            req.body.slug = global.makeid();
        }
        req.body.viewsCount=0;
        req.body.participantsCount=0;
        delete req.body._id;
        Campaign.create(req.body, function (err, campaign) {
            if (err || !campaign) {
                res.json({
                    err: err,
                    success: false,
                    message: 'error!'
                });
                return 0;
            }
            let customerFilter = {};

            if (req.body.phoneNumber && !req.body.source && !req.body.customerGroup) {
                //if sending to one phone number
                //update customer with phone number
                self.updateOneCustomerWithPhoneNumber({
                    phoneNumber: req.body.phoneNumber,
                    message: req.body.message,
                    campaignId: campaign._id,
                    campaignSlug: campaign.slug
                }, req, res, next);
            }
            if (!req.body.phoneNumber && req.body.source && !req.body.customerGroup) {
                //if sending to source
                //update customers with source
                self.updateCustomersWithSource({
                    source: req.body.source,
                    message: req.body.message,
                    campaignId: campaign._id,
                    campaignSlug: campaign.slug
                }, req, res, next);

            }
            if (!req.body.phoneNumber && !req.body.source && req.body.customerGroup) {
                //if sending to customer group
                //update customers with customer group

            }
            if (!req.body.phoneNumber && !req.body.source && !req.body.customerGroup) {
                //if sending to nothing
                //update all customers
            }
            // Customer.updateMany(customerFilter, 'phoneNumber email firstName lastName', function (err, customers) {
            //     if (err || !customers) {
            //         res.json({
            //             err: err,
            //             success: false,
            //             message: 'no customer found!'
            //         });
            //         return 0;
            //     }
            //     // req.body.customers
            // });
            res.json(campaign);

        })

    },


    updateOneCustomerWithPhoneNumber: function (obj, req, res, next) {
        let Customer = req.mongoose.model('Customer');
        let Campaign = req.mongoose.model('Campaign');
        if (!obj?.phoneNumber) {
            return console.log('no phone number and campaign id found')
        }
        //add customer as a participant
        let token = global.makeid();
        Customer.findOneAndUpdate({
            phoneNumber: obj?.phoneNumber,
            'campaign._id': {$ne: obj?.campaignId}

        }, {
            $addToSet: {campaign: {_id: obj?.campaignId, status: 'participant', token: token}}
        }, function (err, customer) {
            if (err || !customer) {
                console.log('no customer found for campaign!');
                return;
            }
            self.sendSms(obj.message, customer, {token, ...obj}, req, res);
            console.log('customer ' + customer?._id + ' updated!')
            // console.log('send sms: ' + message)
            //send sms here
            Campaign.findOneAndUpdate({
                _id: obj?.campaignId
            }, {
                $set: {
                    participantsCount: 1
                }
            }, function (err, campaign) {
                console.log('campaign ' + campaign?._id + ' updated!')
                //update sms delivery here

            });


        });

    },
    updateCustomersWithSource: function (obj, req, res, next) {
        console.log('updateCustomersWithSource');
        let Customer = req.mongoose.model('Customer');
        let Campaign = req.mongoose.model('Campaign');
        if (!obj?.campaignId) {
            console.log('no phone number and campaign id found')
        }
        //add customer as a participant
        Customer.updateMany({
            source: obj?.source,
            'campaign._id': {$ne: obj?.campaignId}

        }, {
            $addToSet: {campaign: {_id: obj?.campaignId, status: 'participant'}}
        }, function (err, result) {

            console.log('customers updated!')

            Customer.find({
                source: obj?.source,
                'campaign._id': obj?.campaignId

            }, async function (err, customers) {
                console.log(customers?.length + ' found!')
                Campaign.findOneAndUpdate({
                    _id: obj?.campaignId
                }, {
                    $set: {
                        participantsCount: customers?.length
                    }
                }, function (err, campaign) {
                    console.log('campaign ' + campaign?._id + ' updated!')
                    //update sms delivery here

                });
                if (customers && customers.length)
                    for (let i = 0; i <= customers.length; i++) {
                        let token = global.makeid();
                        try {
                            const cusFunc = await Customer.findOneAndUpdate({
                                _id: customers[i]?._id,
                                'campaign._id': obj?.campaignId

                            }, {
                                "campaign.$.token": token
                            });

                            if (!cusFunc) {
                                console.log('no customer found for campaign!');
                                return;
                            }
                            await self.sendSms(obj.message, cusFunc, {token, ...obj}, req, res);
                            // await setTimeout(1000)
                            console.log('customer ' + cusFunc?._id + ' updated!')
                        } catch (e) {
                            console.log('e', e)
                        }

                    }


            });


        });

    },
    normalizeText: function (message = '', customer = {}, campaign = {}) {
        if (message && campaign?.message) {
            // console.log('campaign.message before',campaign.message);
            campaign.message = campaign.message.replace(/(?:\r\n|\r|\n)/g, '\\n');
            // console.log('campaign.message after',campaign.message);
            message = message.replaceAll("%message%", campaign?.message);
        }
        if (customer?.phoneNumber)
            message = message.replaceAll("%phoneNumber%", customer.phoneNumber);
        else
            message = message.replaceAll("%phoneNumber%", '');

        if (customer?.firstName) {
            message = message.replaceAll("%firstName%", customer.firstName);
        } else {
            message = message.replaceAll("%firstName%", "دوست");

        }
        if (customer?.lastName) {
            message = message.replaceAll("%lastName%", customer.lastName);
        } else {
            message = message.replaceAll("%lastName%", '');

        }

        if (customer?.email) {
            message = message.replaceAll("%email%", customer.email);
        } else {
            message = message.replaceAll("%email%", '');

        }

        if (campaign?.campaignSlug) {
            if (campaign?.token) {
                message = message.replaceAll("%link%", process.env.BASE_URL + '/cm/' + campaign.campaignSlug + '-' + campaign?.token);

            } else {
                message = message.replaceAll("%link%", process.env.BASE_URL + '/cm/' + campaign.campaignSlug);

            }
        } else {
            message = message.replaceAll("%link%", '');

        }

        return message;
    },

    sendSms: async function (message = '', customer = {}, campaign = {}, req, res) {
        let Notification = req.mongoose.model('Notification');
        let Settings = req.mongoose.model('Settings');
        let Gateway = req.mongoose.model('Gateway');
        try {
            const settings = await Settings.findOne({}, 'defaultSmsGateway')

            if (!settings || (settings && !settings.defaultSmsGateway)) {
                //send with default gateway
                return
            }

            if (settings && settings.defaultSmsGateway) {
                //send with custom gateway
                const gateway = await Gateway.findById(settings.defaultSmsGateway);

                if (!gateway || (gateway && !gateway.request)) {
                    //send with default gateway
                    console.log('gateway not found!')
                }
                // console.log('theReq', theReq)
                let m = gateway?.request;

                m = self.normalizeText(m, customer, {message, ...campaign});
                console.log('m', m);
                let theReq = JSON.parse(m);

                const parsedBody=await req.httpRequest(theReq);
                console.log('parsedBody', parsedBody)



            } else {
                return res.json({
                    success: false,
                    message: 'set default sms gateway!'
                })
            }

        } catch (e) {
            console.log('e sms');
        }
        // return 0;

    },
    getAll: function (req, res, next) {
        const Model = req.mongoose.model("Campaign");
        const sort = {updatedAt: -1};
        let offset = 0;
        if (req.params.offset) offset = parseInt(req.params.offset);

        let fields = "";
        if (req.headers && req.headers.fields) fields = req.headers.fields;

        let searchParams = null;
        let search = {};
        if (req.params.search) searchParams = req.params.search;
        if (req.query.search) searchParams = req.query.search;
        if (req.query.Search) searchParams = req.query.Search;
        let tempFilter = _get(req, "query.filter", null);

        if (tempFilter) {
            tempFilter = JSON.parse(tempFilter);

            if (tempFilter.search) searchParams = tempFilter.search;
        }

        if (searchParams) {
            search["$or"] = [
                {
                    ["title." + req.headers.lan]: {
                        $exists: true,
                        $regex: searchParams,
                        $options: "i",
                    },
                },
                {
                    ["description." + req.headers.lan]: {
                        $exists: true,
                        $regex: searchParams,
                        $options: "i",
                    },
                },
            ];
        }

        if (req.query && req.query.status) {
            search = {...search, status: req.query.status};
        }

        let tt = Object.keys(req.query);

        _forEach(tt, (item) => {
            // console.log("item => ",item);
            if (Model.schema.paths[item]) {
                // console.log("item exists ====>> ",item);
                // console.log("instance of item ===> ",Model.schema.paths[item].instance);
                let split = req.query[item].split(",");
                if (mongoose.isValidObjectId(split[0])) {
                    search[item] = {
                        $in: split,
                    };
                }
            } else {
                console.log("filter doesnot exist => ", item);
            }
        });

        Model.find(search, fields, function (err, model) {
            if (req.headers.response !== "json") return res.show();

            if (err || !model) return res.json([]);
            Model.countDocuments(search, function (err, count) {
                if (err || !count) {
                    res.json([]);
                    return 0;
                }
                res.setHeader("X-Total-Count", count);
                return res.json(model);
            });
        })
            .skip(offset)
            .sort(sort)
            .limit(parseInt(req.params.limit));
    },

};
export default self;