import _ from 'lodash'
let self = ({
    getAll: function (req, res, next) {
        let Test = req.mongoose.model('Test');
        if (req.headers.response !== "json") {
            return res.show()

        }
        let sort = { sort: 1,updatedAt: -1}

        console.log('getAll()');
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }
        let fields = '';
        if (req.headers && req.headers.fields) {
            fields = req.headers.fields
        }
        let search = {};
        if (req.params.search) {

            search["title." + req.headers.lan] = {
                $exists: true,
                "$regex": req.params.search,
                "$options": "i"
            };
        }
        if (req.query.search) {

            search["title." + req.headers.lan] = {
                $exists: true,
                "$regex": req.query.search,
                "$options": "i"
            };
        }
        if (req.query.q) {

            search["title." + req.headers.lan] = {
                $exists: true,
                "$regex": req.query.q,
                "$options": "i"
            };
        }
        if (req.query.Search) {

            search["title." + req.headers.lan] = {
                $exists: true,
                "$regex": req.query.Search,
                "$options": "i"
            };
        }
        if (req.query && req.query.status) {
            search = {...search, status: req.query.status}
            // console.log('****************req.query', req.query);
        }

        // return res.json(Test.schema.paths);
        // console.log("Test.schema => ",Test.schema.paths);
        // console.log(Object.keys(req.query));
        let tt = Object.keys(req.query);
        // console.log('type of tt ==> ', typeof tt);
        // console.log("tt => ", tt);
        _.forEach(tt, (item) => {
            // console.log("item => ",item);
            if (Test.schema.paths[item]) {
                // console.log("item exists ====>> ",item);
                // console.log("instance of item ===> ",Test.schema.paths[item].instance);
                let split = req.query[item].split(',');
                if (req.mongoose.isValidObjectId(split[0])) {
                    search[item] = {
                        $in: split
                    }
                }

            }
            else {
                // console.log("filter doesnot exist => ", item);
            }
        });
        // console.log('search', search);
        let thef = '';

        function isStringified(jsonValue) { // use this function to check
            try {
                // console.log("need to parse");
                return JSON.parse(jsonValue);
            } catch (err) {
                // console.log("not need o parse");

                return jsonValue;
            }
        }

        // console.log('req.query.filter', req.query.filter)
        if (req.query.filter) {
            const json = isStringified(req.query.filter);

            if (typeof json == "object") {
                // console.log("string is a valid json");
                thef = JSON.parse(req.query.filter);
                if (thef.search) {

                    thef["title." + req.headers.lan] = {
                        $exists: true,
                        "$regex": thef.search,
                        "$options": "i"
                    };
                    delete thef.search
                }
                if (thef.q) {

                    thef["title." + req.headers.lan] = {
                        $exists: true,
                        "$regex": thef.q,
                        "$options": "i"
                    };
                    delete thef.q
                }
            } else {
                console.log("string is not a valid json")
            }
            // if (JSON.parse(req.query.filter)) {
            //     thef = JSON.parse(req.query.filter);
            // }
        }
        // console.log('thef', thef);
        if (thef && thef != '')
            search = thef;
        // console.log(req.mongoose.Schema(Test))
        var q;
        if (search['testCategory.slug']) {
            let TestCategory = req.mongoose.model('TestCategory');

            // console.log('search[\'testCategory.slug\']', search['testCategory.slug'])

            TestCategory.findOne({slug: search['testCategory.slug']}, function (err, testcategory) {
                // console.log('err', err)
                // console.log('req', testcategory)
                if (err || !testcategory)
                    return res.json([]);
                if (testcategory._id) {
                    // console.log({testCategory: {
                    //         $in:[testcategory._id]
                    //     }})
                    let ss = {"testCategory": testcategory._id};
                    if (thef.device) {
                        ss['attributes.values'] = thef.device
                    }
                    if (thef.brand) {
                        ss['attributes.values'] = thef.brand
                    }
                    Test.find(ss, function (err, tests) {

                        Test.countDocuments(ss, function (err, count) {
                            if (err || !count) {
                                res.json([]);
                                return 0;
                            }
                            res.setHeader(
                                "X-Total-Count",
                                count
                            );
                            return res.json(tests);

                        })
                    }).populate('testCategory', '_id slug').skip(offset).sort(sort).limit(parseInt(req.params.limit));
                }

            });
            // console.log('q', q)
        } else {
            // console.log('no \'testCategory.slug\'')
            if (!search['status'])
                search['status'] = 'published'
            console.log('sear ch q.exec sort', sort)
            console.log('sear ch q.exec', search)
            // fields='_id';
            console.log('sear ch q.exec fields',fields)

            q = Test.find(search,fields).populate('category', '_id slug').skip(offset).sort(sort).limit(parseInt(req.params.limit));
            q.exec(function (err, model) {

                console.log('err', err)
                if (err || !model)
                    return res.json([]);
                Test.countDocuments(search, function (err, count) {
                    // console.log('countDocuments', count, model ? model.length : '');
                    if (err || !count) {
                        res.json([]);
                        return 0;
                    }
                    res.setHeader(
                        "X-Total-Count",
                        count
                    );
                    return res.json(model);

                })
            });
        }

    },

    addEntry: function (req, res, next) {
        let Form = req.mongoose.model('Form');
        let Entry = req.mongoose.model('Entry');
        if (!req.params.form) {
            return res.json({
                success: false
            })
        }
        Form.findById(req.params.form, '_id', function (err, form) {
            if (err && !form) {
                res.json({
                    err: err,
                    success: false,
                    message: "error"
                });
            }
            let trackingCode = Math.floor(10000 + Math.random() * 90000);

            Entry.create({
                form: form._id,
                trackingCode: trackingCode,
                data: req.body
            }, function (err, entry) {
                if (err && !entry) {
                    res.json({
                        err: err,
                        success: false,
                        message: "error"
                    });
                }
                return res.json({
                    success: true,
                    trackingCode: trackingCode,
                    message: 'submitted successfully!'

                })

            })

        })
    }
});
export default self;