// console.log("#f index.mjs", new Date());
import "ignore-styles";
import _forEach from "lodash/forEach.js";
import _get from "lodash/get.js";
import {format as DateFormat} from "date-fns";

import global from "#root/global";

const addMetaTags = (body, data) => {
    // default values
// console.log('addMetaTags',data);
    const obj = {
        image: "",
        logo: `${process.env.SHOP_URL}site_setting/logo.png`,
        site_name: "",
        site_phone: "",
        contactType: "customer service",
        areaServed: "IR",
        availableLanguage: "Persian",
        ...data,
    };

    body = body
    // title
        .replace("</head>", `<title>${obj.title}</title></head>`)
        // description
        .replace(
            "</head>",
            `<meta name="description" content="${obj.description}" /></head>`
        )
        // keywords
        .replace(
            "</head>",
            `<meta name="keywords" content="${obj.keywords}"/></head>`
        )
        // canonical
        .replace("</head>", `<link rel="canonical" href="${obj.url}" /></head>`)

        // og
        .replace(
            "</head>",
            `<meta property="og:title" content="${obj.title}" /></head>`
        )
        .replace(
            "</head>",
            `<meta property="og:description" content="${obj.description}" /></head>`
        )
        .replace("</head>", `<meta property="og:type" content="website" /></head>`)
        .replace(
            "</head>",
            `<meta property="og:image" content="${obj.image}" /></head>`
        )
        .replace("</head>", `<meta name="og:image:width" content="1200" /></head>`)
        .replace("</head>", `<meta name="og:image:height" content="675" /></head>`)
        .replace(
            "</head>",
            `<meta property="og:image:secure_url" content="${obj.image}" /></head>`
        )
        .replace("</head>", `<meta property="og:locale" content="fa_IR" /></head>`)

        .replace(
            "</head>",
            `<meta property="og:url" content="${obj.url}" /></head>`
        )
        .replace(
            "</head>",
            `<meta property="og:site_name" content="${obj.site_name}" /></head>`
        )

        // twitter
        .replace(
            "</head>",
            '<meta property="twitter:card" content="summary_large_image" /></head>'
        )
        .replace(
            "</head>",
            `<meta property="twitter:site" content="@gomrok24" /></head>`
        )
        .replace(
            "</head>",
            `<meta property="twitter:title" content="${obj.title}" /></head>`
        )
        .replace(
            "</head>",
            `<meta property="twitter:description" content="${obj.description}" /></head>`
        )
        .replace(
            "</head>",
            `<meta property="twitter:image" content="${obj.image}" /></head>`
        )

        // schema
        .replace(
            "</head>",
            `<script type="application/ld+json">{"@context": "https://schema.org","@type": "Organization","name": "${obj.site_name}", "url": "${obj.url}", "logo": "${obj.logo}", "contactPoint": {"@type": "ContactPoint", "telephone": "${obj.site_phone}", "contactType": "customer service", "areaServed": "IR", "availableLanguage": "Persian", "sameAs": ["https://www.instagram.com/gomrok24_", "https://t.me/gomrok_24", "https://www.aparat.com/gomrok24", "https://www.linkedin.com/company/alvarstrading", "https://www.pinterest.com/gomrok24"]}}</script>` +
            "</head>"
        );

    if (obj.date)
        body = body.replace(
            "</head>",
            `<meta property="article:published_time" content="${DateFormat(
                obj.date,
                "yyyy-MM-dd'T'HH:mm:ss+00:00"
            )}" /></head>`
        );
    if (obj.header_last)
        body = body.replace("</head>", `${obj.header_last}</head>`);
    if (obj.body_first) body = body.replace("<body>", `<body>${obj.body_first}`);

    if (obj.availability)
        body = body.replace(
            "</head>",
            `<meta name="availability" content="${obj.availability || ""}" /></head>`
        );

    return body;
};

export default [
    {
        path: "/",
        method: "get",
        access: "customer_all",
        controller: async (req, res, next) => {
            const Settings = req.mongoose.model("Settings");
            const Page = req.mongoose.model("Page");
            try {
                const data = await Settings.findOne(
                    {},
                    "title header_last body_first description factore_shop_name factore_shop_phoneNumber keywords createdAt",
                );
                const page = await Page.findOne(
                    {slug:"home"},
                    "keywords",
                );
                console.log('data',data)
                console.log('page',page)
                const {lan} = req.headers;
                const obj = {
                    site_name: data.factore_shop_name,
                    site_phone: data.factore_shop_phoneNumber || "",
                    image: `${process.env.SHOP_URL}site_setting/logo.png`,
                    keywords: page?.keywords ? _get(page, `keywords.${lan}`, "") : _get(data, `keywords.${lan}`, ""),
                    description: _get(data, `description.${lan}`, ""),
                    url: process.env.SHOP_URL,
                    logo: `${process.env.SHOP_URL}site_setting/logo.png`,
                    title: _get(data, `title.${lan}`, ""),
                    header_last: data.header_last,
                    body_first: data.body_first,
                    date: data.createdAt,
                };

                res.ssrParse().then((body) => {
                    const newBody = addMetaTags(body, obj);
                    res.status(200).send(newBody);
                });
            }catch (e) {
                // res.status(200).send(newBody);
                res.ssrParse().then((body) => {
                    // const newBody = addMetaTags(body, obj);
                    res.status(200).send(body);
                });
                console.log('e',e)
            }

        },
    },
    {
        path: "/login",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            console.log("show front, go visit ", process.env.SHOP_URL);
            res.show();
        },
    },
    {
        path: "/l/:id",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            console.log("show l, go visit ", req.params.id);
            const Link = req.mongoose.model("Link");
            Link.findOne(
                {
                    from: req.params.id
                },
                function (err, data = {}) {
                    console.log('data', data);
                    if (data?.to) {
                        return res.redirect(parseInt(data?.status), data?.to);
                    }
                })

        },
    },
    {
        path: "/cm/:id",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            console.log("show l, go visit ", req.params.id);
            const Campaign = req.mongoose.model("Campaign");
            const Customer = req.mongoose.model("Customer");
            let slug = req?.params?.id;
            if (slug.indexOf('-') !== -1) {
                let split = slug.split('-');
                let customer_token = split[1];
                let campaignSlug = split[0];
                Campaign.findOneAndUpdate(
                    {
                        slug: campaignSlug
                    },
                    {
                        "$inc": {
                            viewsCount: 1
                        }
                    },
                    function (err, campaign = {}) {

                        Customer.findOneAndUpdate(
                            {
                                "campaign.token": customer_token
                            },
                            {
                                "campaign.$.status": "visited"
                            },
                            function (err, customer = {}) {
                                console.log('customer updated!')
                                if (customer && customer.campaign) {
                                    if (campaign?.link) {
                                        return res.redirect(302, campaign?.link);
                                    }

                                }

                            }).lean()
                    })

            } else {
                Campaign.findOne(
                    {
                        slug: req.params.id
                    },
                    function (err, data = {}) {
                        console.log('data', data);
                        if (data?.link) {
                            return res.redirect(302, data?.link);
                        }
                    })

            }
        },
    },
    {
        path: "/checkout",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            console.log("show front, go visit ", process.env.SHOP_URL);
            res.show();
        },
    },
    {
        path: "/login/:_action",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            console.log("show front, go visit ", process.env.SHOP_URL);
            res.show();
        },
    },
    {
        path: "/page/:_id",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            console.log("show front, go visit ", process.env.SHOP_URL);
            res.show();
        },
    },
    {
        path: "/category/:_slug/:_slug2",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            console.log(". we need to redirect");
            res.redirect("/product-category/" + req.params._slug2);
        },
    },
    {
        path: "/p/:_slug/:_slug2",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            console.log(". we need to redirect");
            res.redirect("/product/" + req.params._slug2);
        },
    },
    {
        path: "/p/:_id",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            console.log(
                "show /p/:_id, /defaultFront.mjs line: 230 ",
                process.env.SHOP_URL
            );
            const arrayMin = (arr) => {
                if (arr && arr.length > 0)
                    return arr.reduce(function (p, v) {
                        return p < v ? p : v;
                    });
            };
            let obj = {};
            // if (req.mongoose.isValidObjectId(req.params._slug)) {
            //     obj["_id"] = req.params._slug;
            // } else {
            //     obj["slug"] = req.params._slug;
            //
            // }
            if (req.mongoose.isValidObjectId(req.params._id)) {
                obj["_id"] = req.params._id;
                // delete obj["slug"];
            }
            let Product = req.mongoose.model("Product");
            let Settings = req.mongoose.model("Settings");
            // console.log('obj', obj)
            Settings.findOne({}, "header_last", function (err, hea) {
                // console.log('hea', hea)
                Product.findOne(
                    obj,
                    "title metadescription metatitle keywords excerpt type price in_stock salePrice combinations thumbnail photos slug labels _id",
                    function (err, product) {
                        if (err)
                            return res.status(503).json({
                                success: false,
                                message: "error!",
                                err: err,
                            });

                        if (!product) return res.status(404).json({success: false});

                        let in_stock = "outofstock";
                        let product_price = 0;
                        let product_old_price = 0;
                        let product_prices = [];
                        let product_sale_prices = [];
                        if (product.type === "variable") {
                            if (product.combinations)
                                _forEach(product.combinations, (c) => {
                                    if (c.in_stock) {
                                        in_stock = "instock";
                                        product_prices.push(parseInt(c.price) || 1000000000000);
                                        product_sale_prices.push(
                                            parseInt(c.salePrice) || 1000000000000
                                        );
                                    }
                                });
                            // console.log("gfdsdf");
                            // console.log(product_prices);
                            // console.log(product_sale_prices);
                            let min_price = arrayMin(product_prices);
                            let min_sale_price = arrayMin(product_sale_prices);
                            // console.log("min_price", min_price);
                            // console.log("min_sale_price", min_sale_price);
                            product_price = min_price;
                            if (min_sale_price > 0 && min_sale_price < min_price) {
                                product_price = min_sale_price;
                                product_old_price = min_price;
                            }
                        }
                        if (product.type === "normal") {
                            if (product.in_stock) {
                                in_stock = "instock";
                            }
                            if (product.price) {
                                product_price = product.price;
                            }
                            if (product.price && product.salePrice) {
                                product_price = product.salePrice;
                                product_old_price = product.price;
                            }
                        }

                        // product.title = product['title'][req.headers.lan] || '';
                        // product.description = '';
                        // console.log(c);
                        // });
                        delete product.data;
                        delete product.transaction;
                        console.log(" product", product);
                        let img = "";
                        if (product.photos && product.photos[0]) {
                            img = product.photos[0];
                        }
                        if (product.thumbnail) {
                            img = product.thumbnail;
                        }

                        let obj = {
                            _id: product._id,
                            product_price: product_price || "",
                            product_old_price: product_old_price || "",
                            availability: in_stock || "",
                            image: img,
                            keywords: "",
                            metadescription: "",
                        };
                        if (product["keywords"]) {
                            obj["keywords"] =
                                product["keywords"][req.headers.lan] || product["keywords"];
                        }
                        if (product["metadescription"]) {
                            obj["metadescription"] =
                                product["metadescription"][req.headers.lan] ||
                                product["metadescription"];
                        }
                        if (product["title"]) {
                            obj["title"] =
                                product["title"][req.headers.lan] || product["title"];
                        } else {
                            obj["title"] = "";
                        }
                        if (product["title"]) {
                            obj["product_name"] =
                                product["title"][req.headers.lan] || product["title"];
                        } else {
                            obj["product_name"] = "";
                        }
                        if (product["description"]) {
                            obj["description"] =
                                product["description"][req.headers.lan] ||
                                product["description"];
                        } else {
                            obj["description"] = "";
                        }
                        if (product["slug"]) {
                            obj["slug"] = product["slug"];
                        }
                        if (product["labels"]) {
                            obj["labels"] = product["labels"];
                        }
                        if (!obj.metadescription) {
                            obj.metadescription = obj["description"];
                        }
                        let mainTitle = obj.title;
                        if (product.metatitle && product.metatitle[req.headers.lan]) {
                            mainTitle = product.metatitle[req.headers.lan];
                        }
                        res.ssrParse().then((body) => {
                            body = body.replace(
                                "</head>",
                                `<title>${mainTitle}</title></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="description" content="${obj.metadescription}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<link rel="canonical" href="${process.env.SHOP_URL}product/${product.slug}/" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_id" content="${obj._id}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_name" content="${obj.product_name}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_price" content="${obj.product_price}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_old_price" content="${obj.product_old_price}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_image" content="/${obj.image}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="image" content="/${obj.image}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="availability" content="${obj.availability}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:image" content="/${obj.image}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:image:secure_url" content="/${obj.image}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:image:width" content="1200" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:image:height" content="675" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:locale" content="fa_IR" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:type" content="website" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:title" content="${mainTitle}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:description" content="${obj.description}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:url" content="." /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                hea && hea.header_last ? hea.header_last : "" + `</head>`
                            );

                            res.status(200).send(body);
                        });
                    }
                ).lean();
            });
        },
    },
    {
        path: "/product/:_id/:_slug",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            console.log(
                "\n\n\nshow /product/:_id/:_slug, /defaultFront.mjs line: 66 ",
                process.env.SHOP_URL
            );
            console.log("req.params._id", req.params);
            const arrayMin = (arr) => {
                if (arr && arr.length > 0)
                    return arr.reduce(function (p, v) {
                        return p < v ? p : v;
                    });
            };
            let obj = {};
            if (req.mongoose.isValidObjectId(req.params._slug)) {
                obj["_id"] = req.params._slug;
            } else {
                obj["slug"] = req.params._slug;
            }
            if (req.mongoose.isValidObjectId(req.params._id)) {
                obj["_id"] = req.params._id;
                delete obj["slug"];
            }
            let Product = req.mongoose.model("Product");
            let Settings = req.mongoose.model("Settings");
            console.log("obj", obj);
            Settings.findOne({}, "header_last", function (err, hea) {
                // console.log('hea', hea)
                Product.findOne(
                    obj,
                    "title metadescription metatitle keywords excerpt type price in_stock salePrice combinations thumbnail photos slug labels _id",
                    function (err, product) {
                        if (err)
                            return res.status(503).json({
                                success: false,
                                message: "error!",
                                err: err,
                            });

                        if (!product) return res.status(404).json({success: false});

                        let in_stock = "outofstock";
                        let product_price = 0;
                        let product_old_price = 0;
                        let product_prices = [];
                        let product_sale_prices = [];
                        if (product.type === "variable") {
                            if (product.combinations)
                                _forEach(product.combinations, (c) => {
                                    if (c.in_stock) {
                                        in_stock = "instock";
                                        product_prices.push(parseInt(c.price) || 1000000000000);
                                        product_sale_prices.push(
                                            parseInt(c.salePrice) || 1000000000000
                                        );
                                    }
                                });
                            // console.log("gfdsdf");
                            // console.log(product_prices);
                            // console.log(product_sale_prices);
                            let min_price = arrayMin(product_prices);
                            let min_sale_price = arrayMin(product_sale_prices);
                            // console.log("min_price", min_price);
                            // console.log("min_sale_price", min_sale_price);
                            product_price = min_price;
                            if (min_sale_price > 0 && min_sale_price < min_price) {
                                product_price = min_sale_price;
                                product_old_price = min_price;
                            }
                        }
                        if (product.type === "normal") {
                            if (product.in_stock) {
                                in_stock = "instock";
                            }
                            if (product.price) {
                                product_price = product.price;
                            }
                            if (product.price && product.salePrice) {
                                product_price = product.salePrice;
                                product_old_price = product.price;
                            }
                        }

                        // product.title = product['title'][req.headers.lan] || '';
                        // product.description = '';
                        // console.log(c);
                        // });
                        delete product.data;
                        delete product.transaction;
                        console.log(" product", product);
                        let img = "";
                        if (product.photos && product.photos[0]) {
                            img = product.photos[0];
                        }
                        if (product.thumbnail) {
                            img = product.thumbnail;
                        }

                        let obj = {
                            _id: product._id,
                            product_price: product_price || "",
                            product_old_price: product_old_price || "",
                            availability: in_stock || "",
                            image: img,
                            keywords: "",
                            metadescription: "",
                        };
                        if (product["keywords"]) {
                            obj["keywords"] =
                                product["keywords"][req.headers.lan] || product["keywords"];
                        }
                        if (product["metadescription"]) {
                            obj["metadescription"] =
                                product["metadescription"][req.headers.lan] ||
                                product["metadescription"];
                        }
                        if (product["title"]) {
                            obj["title"] =
                                product["title"][req.headers.lan] || product["title"];
                        } else {
                            obj["title"] = "";
                        }
                        if (product["title"]) {
                            obj["product_name"] =
                                product["title"][req.headers.lan] || product["title"];
                        } else {
                            obj["product_name"] = "";
                        }
                        if (product["description"]) {
                            obj["description"] =
                                product["description"][req.headers.lan] ||
                                product["description"];
                        } else {
                            obj["description"] = "";
                        }
                        if (product["slug"]) {
                            obj["slug"] = product["slug"];
                        }
                        if (product["labels"]) {
                            obj["labels"] = product["labels"];
                        }
                        if (!obj.metadescription) {
                            obj.metadescription = obj["description"];
                        }
                        let mainTitle = obj.title;
                        if (product.metatitle) {
                            mainTitle = product.metatitle;
                        }
                        res.ssrParse().then((body) => {
                            body = body.replace(
                                "</head>",
                                `<title>${mainTitle}</title></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="description" content="${obj.metadescription}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<link rel="canonical" href="${process.env.SHOP_URL}product/${req.params._id}/${req.params._slug}/" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_id" content="${obj._id}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_name" content="${obj.product_name}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_price" content="${obj.product_price}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_old_price" content="${obj.product_old_price}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_image" content="/${obj.image}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="image" content="/${obj.image}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="availability" content="${obj.availability}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:image" content="/${obj.image}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:image:secure_url" content="/${obj.image}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:image:width" content="1200" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:image:height" content="675" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta property="twitter:image" content="/${obj.image}" /></head>`
                            );

                            body = body.replace(
                                "</head>",
                                `<meta name="og:locale" content="fa_IR" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:type" content="website" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:title" content="${mainTitle}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:description" content="${obj.description}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:url" content="." /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                hea && hea.header_last ? hea.header_last : "" + `</head>`
                            );

                            res.status(200).send(body);
                        });
                    }
                ).lean();
            });
        },
    },
    {
        path: "/product/:_slug",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            console.log(
                "show /product/:_slug, /defaultFront.mjs line: 230 ",
                process.env.SHOP_URL
            );
            console.log("req.params._id", req.params);
            const arrayMin = (arr) => {
                if (arr && arr.length > 0)
                    return arr.reduce(function (p, v) {
                        return p < v ? p : v;
                    });
            };
            let obj = {};
            // if (req.mongoose.isValidObjectId(req.params._slug)) {
            //     obj["_id"] = req.params._slug;
            // } else {

            //     obj["slug"] = req.params._slug;
            //
            // }
            obj["slug"] = req.params._slug;

            // if (req.mongoose.isValidObjectId(req.params._id)) {
            //     obj["_id"] = req.params._id;
            //     delete obj["slug"];
            // }
            let Product = req.mongoose.model("Product");
            let Settings = req.mongoose.model("Settings");
            console.log("\n\nobj", obj);
            Settings.findOne({}, "header_last", function (err, hea) {
                // console.log('hea', hea)
                Product.findOne(
                    obj,
                    "title metadescription metatitle excerpt type price in_stock salePrice combinations thumbnail photos slug labels _id",
                    function (err, product) {
                        if (err)
                            return res.status(503).json({
                                success: false,
                                message: "error!",
                                err: err,
                            });

                        if (!product) return res.status(404).json({success: false});

                        let in_stock = "outofstock";
                        let product_price = 0;
                        let product_old_price = 0;
                        let product_prices = [];
                        let product_sale_prices = [];
                        if (product.type === "variable") {
                            if (product.combinations)
                                _forEach(product.combinations, (c) => {
                                    if (c.in_stock) {
                                        in_stock = "instock";
                                        product_prices.push(parseInt(c.price) || 1000000000000);
                                        product_sale_prices.push(
                                            parseInt(c.salePrice) || 1000000000000
                                        );
                                    }
                                });
                            // console.log("gfdsdf");
                            // console.log(product_prices);
                            // console.log(product_sale_prices);
                            let min_price = arrayMin(product_prices);
                            let min_sale_price = arrayMin(product_sale_prices);
                            // console.log("min_price", min_price);
                            // console.log("min_sale_price", min_sale_price);
                            product_price = min_price;
                            if (min_sale_price > 0 && min_sale_price < min_price) {
                                product_price = min_sale_price;
                                product_old_price = min_price;
                            }
                        }
                        if (product.type === "normal") {
                            if (product.in_stock) {
                                in_stock = "instock";
                            }
                            if (product.price) {
                                product_price = product.price;
                            }
                            if (product.price && product.salePrice) {
                                product_price = product.salePrice;
                                product_old_price = product.price;
                            }
                        }

                        // product.title = product['title'][req.headers.lan] || '';
                        // product.description = '';
                        // console.log(c);
                        // });
                        delete product.data;
                        delete product.transaction;
                        console.log(" product", product);
                        let img = "";
                        if (product.photos && product.photos[0]) {
                            img = product.photos[0];
                        }
                        if (product.thumbnail) {
                            img = product.thumbnail;
                        }

                        let obj = {
                            _id: product._id,
                            product_price: product_price || 0,
                            product_old_price: product_old_price || "",
                            availability: in_stock || false,
                            image: img,
                            keywords: "",
                            metadescription: "",
                        };
                        if (product["keywords"]) {
                            obj["keywords"] =
                                product["keywords"][req.headers.lan] || product["keywords"];
                        }
                        if (product["metadescription"]) {
                            obj["metadescription"] =
                                product["metadescription"][req.headers.lan] || "";
                        }
                        if (product["title"]) {
                            obj["title"] =
                                product["title"][req.headers.lan] || product["title"];
                        } else {
                            obj["title"] = "";
                        }
                        if (product["title"]) {
                            obj["product_name"] =
                                product["title"][req.headers.lan] || product["title"];
                        } else {
                            obj["product_name"] = "";
                        }
                        if (product["description"]) {
                            obj["description"] =
                                product["description"][req.headers.lan] ||
                                product["description"];
                            B;
                        } else {
                            obj["description"] = "";
                        }
                        if (product["slug"]) {
                            obj["slug"] = product["slug"];
                        }
                        if (product["labels"]) {
                            obj["labels"] = product["labels"];
                        }
                        if (!obj.metadescription) {
                            obj.metadescription = obj["metadescription"] || "";
                        }
                        let mainTitle = obj.title;
                        if (product.metatitle) {
                            mainTitle = product.metatitle[req.headers.lan]
                                ? product.metatitle[req.headers.lan]
                                : obj.title;
                        }
                        console.log("obj.metadescription", obj.metadescription);
                        res.ssrParse().then((body) => {
                            body = body.replace(
                                "</head>",
                                `<title>${mainTitle}</title></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="description" content="${obj.metadescription}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_id" content="${obj._id}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_name" content="${obj.product_name}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_price" content="${obj.product_price}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_old_price" content="${obj.product_old_price}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_image" content="${process.env.SHOP_URL}${obj.image}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<link rel="canonical" href="${process.env.SHOP_URL}product/${req.params._slug}/" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="image" content="${process.env.SHOP_URL}${obj.image}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="availability" content="${obj.availability}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:image" content="${process.env.SHOP_URL}${obj.image}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:image:secure_url" content="${process.env.SHOP_URL}${obj.image}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:image:width" content="1200" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:image:height" content="675" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:locale" content="fa_IR" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:type" content="website" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:title" content="${mainTitle}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:description" content="${obj.metadescription}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:url" content="${process.env.SHOP_URL}product/${req.params._slug}/" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta property="twitter:image" content="${process.env.SHOP_URL}${obj.image}" /></head>`
                            );

                            body = body.replace(
                                "</head>",
                                `<script type="application/ld+json">{"@context": "https://schema.org/","@type": "Product","name": "${mainTitle}","image": ["${process.env.SHOP_URL}${obj.image}"],"description": "${obj.metadescription}","offers": {"@type": "Offer","url": "${process.env.SHOP_URL}product/${req.params._slug}","priceCurrency":"IRR","price": "${obj.product_price}","priceValidUntil":"2024-07-22","availability": "https://schema.org/InStock","itemCondition": "https://schema.org/NewCondition"}}</script></head>`
                            );
                            body = body.replace(
                                "</head>",
                                hea && hea.header_last ? hea.header_last : "" + `</head>`
                            );

                            res.status(200).send(body);
                        });
                    }
                ).lean();
            });
        },
    },
    {
        path: "/product/:_id",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            console.log(
                "show /product/:_id, /defaultFront.mjs line: 1048 ",
                process.env.SHOP_URL
            );
            console.log("req.params._id", req.params);
            const arrayMin = (arr) => {
                if (arr && arr.length > 0)
                    return arr.reduce(function (p, v) {
                        return p < v ? p : v;
                    });
            };
            let obj = {};
            // if (req.mongoose.isValidObjectId(req.params._slug)) {
            //     obj["_id"] = req.params._slug;
            // } else {

            //     obj["slug"] = req.params._slug;
            //
            // }
            obj["slug"] = req.params._id;

            // if (req.mongoose.isValidObjectId(req.params._id)) {
            //     obj["_id"] = req.params._id;
            //     delete obj["slug"];
            // }
            let Product = req.mongoose.model("Product");
            let Settings = req.mongoose.model("Settings");
            console.log("\n\nobj", obj);
            Settings.findOne({}, "header_last", function (err, hea) {
                // console.log('hea', hea)
                Product.findOne(
                    obj,
                    "title metadescription metatitle excerpt type price in_stock salePrice combinations thumbnail photos slug labels _id",
                    function (err, product) {
                        if (err)
                            return res.status(503).json({
                                success: false,
                                message: "error!",
                                err: err,
                            });

                        if (!product) return res.status(404).json({success: false});

                        let in_stock = "outofstock";
                        let product_price = 0;
                        let product_old_price = 0;
                        let product_prices = [];
                        let product_sale_prices = [];
                        if (product.type === "variable") {
                            if (product.combinations)
                                _forEach(product.combinations, (c) => {
                                    if (c.in_stock) {
                                        in_stock = "instock";
                                        product_prices.push(parseInt(c.price) || 1000000000000);
                                        product_sale_prices.push(
                                            parseInt(c.salePrice) || 1000000000000
                                        );
                                    }
                                });
                            // console.log("gfdsdf");
                            // console.log(product_prices);
                            // console.log(product_sale_prices);
                            let min_price = arrayMin(product_prices);
                            let min_sale_price = arrayMin(product_sale_prices);
                            // console.log("min_price", min_price);
                            // console.log("min_sale_price", min_sale_price);
                            product_price = min_price;
                            if (min_sale_price > 0 && min_sale_price < min_price) {
                                product_price = min_sale_price;
                                product_old_price = min_price;
                            }
                        }
                        if (product.type === "normal") {
                            if (product.in_stock) {
                                in_stock = "instock";
                            }
                            if (product.price) {
                                product_price = product.price;
                            }
                            if (product.price && product.salePrice) {
                                product_price = product.salePrice;
                                product_old_price = product.price;
                            }
                        }

                        // product.title = product['title'][req.headers.lan] || '';
                        // product.description = '';
                        // console.log(c);
                        // });
                        delete product.data;
                        delete product.transaction;
                        console.log(" product", product);
                        let img = "";
                        if (product.photos && product.photos[0]) {
                            img = product.photos[0];
                        }
                        if (product.thumbnail) {
                            img = product.thumbnail;
                        }

                        let obj = {
                            _id: product._id,
                            product_price: product_price || 0,
                            product_old_price: product_old_price || "",
                            availability: in_stock || false,
                            image: img,
                            keywords: "",
                            metadescription: "",
                        };
                        if (product["keywords"]) {
                            obj["keywords"] =
                                product["keywords"][req.headers.lan] || product["keywords"];
                        }
                        if (product["metadescription"]) {
                            obj["metadescription"] =
                                product["metadescription"][req.headers.lan] || "";
                        }
                        if (product["title"]) {
                            obj["title"] =
                                product["title"][req.headers.lan] || product["title"];
                        } else {
                            obj["title"] = "";
                        }
                        if (product["title"]) {
                            obj["product_name"] =
                                product["title"][req.headers.lan] || product["title"];
                        } else {
                            obj["product_name"] = "";
                        }
                        if (product["description"]) {
                            obj["description"] =
                                product["description"][req.headers.lan] ||
                                product["description"];
                            B;
                        } else {
                            obj["description"] = "";
                        }
                        if (product["slug"]) {
                            obj["slug"] = product["slug"];
                        }
                        if (product["labels"]) {
                            obj["labels"] = product["labels"];
                        }
                        if (!obj.metadescription) {
                            obj.metadescription = obj["metadescription"] || "";
                        }
                        let mainTitle = obj.title;
                        if (product.metatitle) {
                            mainTitle = product.metatitle[req.headers.lan]
                                ? product.metatitle[req.headers.lan]
                                : obj.title;
                        }
                        console.log("obj.metadescription", obj.metadescription);
                        res.ssrParse().then((body) => {
                            body = body.replace(
                                "</head>",
                                `<title>${mainTitle}</title></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="description" content="${obj.metadescription}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_id" content="${obj._id}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_name" content="${obj.product_name}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_price" content="${obj.product_price}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_old_price" content="${obj.product_old_price}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_image" content="${process.env.SHOP_URL}${obj.image}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<link rel="canonical" href="${process.env.SHOP_URL}product/${product["slug"]}/" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="image" content="${process.env.SHOP_URL}${obj.image}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="availability" content="${obj.availability}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:image" content="${process.env.SHOP_URL}${obj.image}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:image:secure_url" content="${process.env.SHOP_URL}${obj.image}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:image:width" content="1200" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:image:height" content="675" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:locale" content="fa_IR" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:type" content="website" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:title" content="${mainTitle}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:description" content="${obj.metadescription}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:url" content="${process.env.SHOP_URL}product/${product["slug"]}/" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta property="twitter:image" content="${process.env.SHOP_URL}${obj.image}" /></head>`
                            );

                            body = body.replace(
                                "</head>",
                                `<script type="application/ld+json">{"@context": "https://schema.org/","@type": "Product","name": "${mainTitle}","image": ["${process.env.SHOP_URL}${obj.image}"],"description": "${obj.metadescription}","offers": {"@type": "Offer","url": "${process.env.SHOP_URL}product/${req.params._slug}","priceCurrency":"IRR","price": "${obj.product_price}","priceValidUntil":"2025-07-22","availability": "https://schema.org/InStock","itemCondition": "https://schema.org/NewCondition"}}</script></head>`
                            );
                            body = body.replace(
                                "</head>",
                                hea && hea.header_last ? hea.header_last : "" + `</head>`
                            );

                            res.status(200).send(body);
                        });
                    }
                ).lean();
            });
        },
    },
    {
        path: "/add/:_slug",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            console.log(
                "show /add/:_slug, /defaultFront.mjs line: 941 ",
                process.env.SHOP_URL
            );
            console.log("req.params._id", req.params);
            const arrayMin = (arr) => {
                if (arr && arr.length > 0)
                    return arr.reduce(function (p, v) {
                        return p < v ? p : v;
                    });
            };
            let obj = {};
            // if (req.mongoose.isValidObjectId(req.params._slug)) {
            //     obj["_id"] = req.params._slug;
            // } else {

            //     obj["slug"] = req.params._slug;
            //
            // }
            obj["slug"] = req.params._slug;

            // if (req.mongoose.isValidObjectId(req.params._id)) {
            //     obj["_id"] = req.params._id;
            //     delete obj["slug"];
            // }
            let Add = req.mongoose.model("Add");
            let Settings = req.mongoose.model("Settings");
            console.log("\n\nobj", obj);
            Settings.findOne({}, "header_last", function (err, hea) {
                // console.log('hea', hea)
                Add.findOne(
                    obj,
                    "title metadescription description metatitle excerpt type price in_stock salePrice combinations thumbnail photos slug labels _id",
                    function (err, product) {
                        if (err)
                            return res.status(503).json({
                                success: false,
                                message: "error!",
                                err: err,
                            });

                        if (!product) return res.status(404).json({success: false});

                        let in_stock = "outofstock";
                        let product_price = 0;
                        let product_old_price = 0;
                        let product_prices = [];
                        let product_sale_prices = [];

                        delete product.data;
                        delete product.transaction;
                        console.log(" add", product);
                        let img = "";
                        if (product.photos && product.photos[0]) {
                            img = product.photos[0];
                        }
                        if (product.thumbnail) {
                            img = product.thumbnail;
                        }
                        if (!img) {
                            img = product.photos[0];
                        }

                        let obj = {
                            _id: product._id,
                            product_price: product_price || 0,
                            product_old_price: product_old_price || "",
                            availability: in_stock || false,
                            image: img,
                            keywords: "",
                            metadescription: "",
                        };
                        if (product["keywords"]) {
                            obj["keywords"] =
                                product["keywords"][req.headers.lan] || product["keywords"];
                        }
                        if (product["metadescription"]) {
                            obj["metadescription"] =
                                product["metadescription"][req.headers.lan] || "";
                        }
                        if (product["description"]) {
                            obj["description"] =
                                product["description"][req.headers.lan] || "";
                        }
                        if (product["title"]) {
                            obj["title"] =
                                product["title"][req.headers.lan] || product["title"];
                        } else {
                            obj["title"] = "";
                        }
                        if (product["title"]) {
                            obj["product_name"] =
                                product["title"][req.headers.lan] || product["title"];
                        } else {
                            obj["product_name"] = "";
                        }
                        if (product["description"]) {
                            obj["description"] =
                                product["description"][req.headers.lan] ||
                                product["description"];
                        } else {
                            obj["description"] = "";
                        }
                        console.log('obj["metadescription"]', obj["metadescription"]);
                        console.log('obj["description"]', obj["description"]);
                        if (!obj["metadescription"]) {
                            obj["metadescription"] = obj["description"];
                        }
                        if (product["slug"]) {
                            obj["slug"] = product["slug"];
                        }
                        if (product["labels"]) {
                            obj["labels"] = product["labels"];
                        }
                        if (!obj.metadescription) {
                            obj.metadescription = obj["metadescription"] || "";
                        }
                        let mainTitle = obj.title;
                        if (product.metatitle) {
                            mainTitle = product.metatitle[req.headers.lan]
                                ? product.metatitle[req.headers.lan]
                                : obj.title;
                        }
                        console.log("obj.metadescription", obj.metadescription);
                        res.ssrParse().then((body) => {
                            body = body.replace(
                                "</head>",
                                `<title>${mainTitle}</title></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="description" content="${obj.metadescription}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_id" content="${obj._id}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_name" content="${obj.product_name}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_price" content="${obj.product_price}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_old_price" content="${obj.product_old_price}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="product_image" content="${process.env.SHOP_URL}${obj.image}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<link rel="canonical" href="${process.env.SHOP_URL}product/${req.params._slug}/" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="image" content="${process.env.SHOP_URL}${obj.image}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="availability" content="${obj.availability}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:image" content="${process.env.SHOP_URL}${obj.image}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:image:secure_url" content="${process.env.SHOP_URL}${obj.image}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:image:width" content="1200" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:image:height" content="675" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:locale" content="fa_IR" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:type" content="website" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:title" content="${mainTitle}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:description" content="${obj.metadescription}" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta name="og:url" content="${process.env.SHOP_URL}product/${req.params._slug}/" /></head>`
                            );
                            body = body.replace(
                                "</head>",
                                `<meta property="twitter:image" content="${process.env.SHOP_URL}${obj.image}" /></head>`
                            );

                            body = body.replace(
                                "</head>",
                                `<script type="application/ld+json">{"@context": "https://schema.org/","@type": "Product","name": "${mainTitle}","image": ["${process.env.SHOP_URL}${obj.image}"],"description": "${obj.metadescription}","offers": {"@type": "Offer","url": "${process.env.SHOP_URL}product/${req.params._slug}","priceCurrency":"IRR","price": "${obj.product_price}","priceValidUntil":"2024-07-22","availability": "https://schema.org/InStock","itemCondition": "https://schema.org/NewCondition"}}</script></head>`
                            );
                            body = body.replace(
                                "</head>",
                                hea && hea.header_last ? hea.header_last : "" + `</head>`
                            );

                            res.status(200).send(body);
                        });
                    }
                ).lean();
            });
        },
    },

    {
        path: "/post/:_id/:_slug",
        method: "get",
        access: "",
        controller: (req, res, next) => {
            res.show();
        },
    },
    {
        path: "/post/:_slug",
        method: "get",
        access: "",
        controller: (req, res, next) => {
            let query = {};
            if (req.mongoose.isValidObjectId(req.params._slug)) {
                query["_id"] = req.params._slug;
            } else {
                query["slug"] = req.params._slug;
            }
            if (req.mongoose.isValidObjectId(req.params._id)) {
                query["_id"] = req.params._id;
                delete query["slug"];
            }
            const Post = req.mongoose.model("Post");
            const Settings = req.mongoose.model("Settings");

            Settings.findOne(
                {},
                "header_last factore_shop_name factore_shop_phoneNumber",
                function (err, setting) {
                    Post.findOne(
                        query,
                        "title description metadescription metatitle keywords excerpt type price in_stock salePrice combinations thumbnail photos slug labels _id createdAt updatedAt",
                        function (err, data) {
                            if (err)
                                return res.status(503).json({
                                    success: false,
                                    message: "error!",
                                    err: err,
                                });

                            if (!data) return res.status(404).json({success: false});

                            const {lan} = req.headers;
                            const obj = {
                                _id: data._id,
                                image: `${process.env.SHOP_URL}/site_setting/logo.png`,
                                keywords: _get(data, `keywords.${lan}`, ""),
                                slug: data.slug,
                                description: _get(data, `metadescription.${lan}`, ""),
                                title:
                                _get(data, `metatitle.${lan}`, "") ||
                                _get(data, `title.${lan}`, ""),
                                url: `${process.env.SHOP_URL}post/${req.params._slug}`,
                                date: data.createdAt,
                                createdAt: data.createdAt,
                                updatedAt: data.updatedAt,
                                site_name: setting.factore_shop_name,
                                site_phone: setting.factore_shop_phoneNumber,
                                header_last: setting.header_last,
                            };
                            if (data.photos && data.photos[0]) {
                                obj.image = `${process.env.SHOP_URL}${data.photos[0]}`;
                            }
                            if (data.thumbnail) {
                                obj.image = `${process.env.SHOP_URL}${data.thumbnail}`;
                            }
                            if (data.keywords) {
                                obj.keywords = data.keywords[lan] || data.keywords;
                            }
                            if (data.metadescription) {
                                obj.description = data.metadescription[lan] || "";
                            }
                            if (data.metatitle) {
                                obj.title = data.metatitle[lan] || "";
                            }

                            res.ssrParse().then((body) => {
                                let newBody = addMetaTags(body, obj);
                                newBody = newBody.replace(
                                    "</head>",
                                    `<script type="application/ld+json">{ "@context": "https://schema.org", "@type": "BlogPosting", "mainEntityOfPage": { "@type": "WebPage", "@id": "${
                                        obj.url
                                        }" }, "headline": "${obj.title}", "description": "${
                                        obj.description
                                        }", "image": "${obj.image}", "datePublished": "${DateFormat(
                                        obj.createdAt,
                                        "yyyy-MM-dd'T'HH:mm:ss+00:00"
                                    )}", "dateModified": "${DateFormat(
                                        obj.updatedAt,
                                        "yyyy-MM-dd'T'HH:mm:ss+00:00"
                                    )}" }</script></head>`
                                );

                                res.status(200).send(newBody);
                            });
                        }
                    ).lean();
                }
            );
        },
    },
    {
        path: "/chat",
        method: "get",
        access: "admin_user,admin_shopManager,customer_all",
        controller: (req, res, next) => {
            res.show();
        },
    },
    {
        path: "/transaction/:method",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            res.show();
        },
    },
    {
        path: "/order-details/:id",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            res.show();
        },
    },
    {
        path: "/transaction",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            res.show();
        },
    },
    {
        path: "/theme",
        method: "get",
        access: "",
        controller: (req, res, next) => {
            global.theme("admin", req, res, next);
        },
    },
    {
        path: "/admin",
        method: "get",
        access: "admin_user,admin_shopManager",
        controller: (req, res, next) => {
            return res.admin();
        },
    },
    {
        path: "/admin/theme",
        method: "get",
        access: "admin_user,admin_shopManager",
        controller: (req, res, next) => {
            global.theme("admin", req, res, next);
        },
    },
    {
        path: "/admin/:model",
        method: "get",
        access: "",
        controller: (req, res, next) => {
            if (req.headers.response != "json") return res.admin();
        },
    },
    {
        path: "/profile",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            res.show();
        },
    },
    {
        path: "/my-orders",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            res.show();
        },
    },
    {
        path: "/:_slug",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            console.log("show here line 1457")
            const obj = {};
            if (req.mongoose.isValidObjectId(req.params._slug)) {
                obj["_id"] = req.params._slug;
            } else {
                obj["slug"] = req.params._slug;
            }
            if (req.mongoose.isValidObjectId(req.params._id)) {
                obj["_id"] = req.params._id;
                delete obj["slug"];
            }

            const Page = req.mongoose.model("Page");
            const Settings = req.mongoose.model("Settings");

            Settings.findOne({}, "header_last", function (err, hea) {
                Page.findOne(
                    obj,
                    "metatitle metadescription keywords thumbnail photos slug _id createdAt",
                    function (err, data) {
                        if (err)
                            return res.status(503).json({
                                success: false,
                                message: "error!",
                                err: err,
                            });

                        if (!data) return res.status(404).json({success: false});

                        const {lan} = req.headers;
                        const obj = {
                            _id: data._id,
                            image: `${process.env.SHOP_URL}/site_setting/logo.png`,
                            slug: data.slug,
                            url: `${process.env.SHOP_URL}${req.params._slug}`,
                            date: data.createdAt,

                            keywords: _get(data, `keywords.${lan}`, ""),
                            description: _get(data, `description.${lan}`, ""),
                            title: _get(data, `title.${lan}`, ""),
                        };
                        if (data.photos && data.photos[0]) {
                            obj.image = `${process.env.SHOP_URL}${data.photos[0]}`;
                        }
                        if (data.thumbnail) {
                            obj.image = `${process.env.SHOP_URL}${data.thumbnail}`;
                        }
                        if (data.keywords) {
                            obj.keywords = data.keywords[lan] || data.keywords;
                        }
                        if (data.metadescription) {
                            obj.description = data.metadescription[lan] || "";
                        }
                        if (data.metatitle) {
                            obj.title = data.metatitle[lan] || "";
                        }

                        res.ssrParse().then((body) => {
                            const newBody = addMetaTags(body, obj);

                            res.status(200).send(newBody);
                        });
                    }
                ).lean();
            });
            // res.show()
        },
    },

    {
        path: "/a/:_entity/:_id/:_slug",
        method: "get",
        access: "customer_all",
        controller: (req, res, next) => {
            console.log("show front, go visit ", process.env.SHOP_URL);
            res.show();
        },
    },
];
