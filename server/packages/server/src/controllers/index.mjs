import mongoose from "mongoose";
import _ from 'lodash'
import global from '#root/global';
import https from "https";
import axios from "axios";
import path from "path";
import {exec} from "child_process";
import fs from "fs";

var self = (Model) => {
    function getSession(res) {
        return new Promise((resolve, reject)=>{
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
              url: `${process.env.DIRECT_ADMIN_URL}/api/login`,
              httpsAgent: agent,
              headers: {
                'accept': 'application/json',
                'accept-language': 'en-US,en;q=0.9,de;q=0.8,fa;q=0.7',
                'content-type': 'application/json',
                'origin': process.env.DIRECT_ADMIN_URL,
                'priority': 'u=1, i',
                'referer': `${process.env.DIRECT_ADMIN_URL}/evo/login`,
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
              console.log('getting session is successfully',JSON.stringify(response.data));
              const resData = response.data
                resolve({
                    "success": true,
                    "response": resData
                })
            })
            .catch((error) => {
              console.log("error in getting session", error);
                resolve({
                    "success": false,
                    "message": error
                })
            });
        })

    }
    function removeDomain(websites, sessionId) {
        return new Promise((resolve, reject)=>{
            console.log(' removeDomain function ===>')
            if(!websites || websites.length < 1){
                resolve({
                    success: false,
                    message: "there is no website to delete its domain"
                })
            }
            websites.map((item) =>{
                let data = JSON.stringify({
                  "select0": item.title,
                  "domain": process.env.DIRECT_ADMIN_DOMAIN,
                  "json": "yes",
                  "action": "delete",
                  "contents": "no"
                });
                const agent = new https.Agent({
                  rejectUnauthorized: false,
                });
                let config = {
                  method: 'post',
                  maxBodyLength: Infinity,
                  httpsAgent: agent,
                  url: `${process.env.DIRECT_ADMIN_URL}/CMD_SUBDOMAIN?json=yes`,
                  headers: {
                    'accept': 'application/json',
                    'accept-language': 'en-US,en;q=0.9,de;q=0.8,fa;q=0.7',
                    'content-type': 'application/json',
                    'cookie': `session=${sessionId}`,
                    'origin': process.env.DIRECT_ADMIN_URL,
                    'priority': 'u=1, i',
                    'referer': `${process.env.DIRECT_ADMIN_URL}/evo/user/subdomains`,
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
                axios.request(config)
                .then((response) => {
                  console.log(`website domain with title ${item.title} deleted successfully`);
                })
                .catch((error) => {
                  console.log(`error removing domain ${item.title}`, error);
                    resolve({
                        "success": false,
                        "message": error
                    })
                });

            })
            resolve({
                "success": true,
                "message": "domains deleted successfully"
            })

        })

    }

    async function removeContent(websites) {
        return new Promise((resolve, reject) => {
            console.log('removeContent function ==>')
            if(!websites || websites.length < 1){
                resolve({
                    success: false,
                    message: "there is no websites to clear their contents"
                })
            }
            websites.map((item) => {
                const targetPath = path.join('/home', process.env.DIRECT_ADMIN_USERNAME, 'domains', `${item.title}.${process.env.DIRECT_ADMIN_DOMAIN}`);
                if (!fs.existsSync(targetPath)) {
                    console.log('destinationPath: ', targetPath);
                    return resolve({
                        success: false,
                        output: `Website directory for this domain: ${item.title} does not exist!`
                    });
                }
                const envModulePath = path.join(targetPath, 'server', '.env.local');
                fs.readFile(envModulePath, 'utf-8', (err, data) => {
                    if (err) {
                        console.log('Error reading .env.local: ', err);
                        resolve({ success: false, output: err.message });
                    }

                    console.log('data: ', data);
                    const envData = data.split('\n').find(line => line.startsWith('dbPassword='));
                    const dbPassword = envData ? envData.split('=')[1] : null;

                    if (!dbPassword) {
                        console.log('Error: dbPassword not found in .env.local');
                        resolve({ success: false, output: 'dbPassword not found' });
                    }
                    console.log('dbPassword: ', dbPassword)
                    const mongoCommand = `mongo -u ${item.title} -p ${dbPassword} --port 2758 --authenticationDatabase ${item.title} --eval "db = db.getSiblingDB('${item.title}'); db.dropUser('${item.title}');"`;
                    exec(mongoCommand, (mongoError) => {
                        if (mongoError) {
                            console.log('Error in mongo shell command: ', mongoError);
                            resolve({ success: false, output: mongoError.message });
                        }

                        console.log('MongoDB user removed successfully!');

                        // After successfully executing the MongoDB command, remove the directory
                        const command = `rm -r ${targetPath}`;
                        console.log('Command for removing content: ', command);

                        exec(command, (error) => {
                            if (error) {
                                console.log('Error clearing content: ', error);
                                return resolve({ success: false, output: error.message });
                            }

                            console.log(`Content of website with this domain ${item.title} deleted successfully!`);

                        });
                    });
                });
            })
            return resolve({
                success: true,
                message: 'Content of website deleted successfully!'
            });

        });
    }
    function stopPm2(websites) {
        return new Promise((resolve, reject)=>{
            console.log('stopPm2 function ==>')
            if(!websites || websites.length < 1){
                resolve({
                    success: false,
                    message: 'there is no website to pm2 stop it'
                })
            }
            console.log('websites: ', websites)
            websites.forEach((item)=>{
                const command = `pm2 stop ${item.title} && pm2 delete ${item.title}`
                exec(command, (err, stdout) =>{
                    if (err || !stdout) {
                        console.log(`pm2 stopped ${item.title} successfully`)
                    } else {
                        resolve({
                            "success": false,
                            "message": `something is wrong with pm2 stopping ${item.title}`
                        })
                    }
                })

            })
            resolve({
                success: true,
                message: "pm2 stopped and deleted successfully!"
            })
        })

    }
    async function deleteFromCDN (websites) {
        return new Promise((resolve,reject) =>{
            console.log(" deleteFromCDN function ==>")
            console.log('websites for deleting from cdn: ', websites)
            // Validate request input
            if (!websites) {
                resolve({
                    success: false,
                    message: 'There is no websites for deleting from CDN!'
                });
            }

            let data = JSON.stringify({
              "message": "string"
            });
            websites.forEach((item) => {
                if(item._id){
                    try{
                        let config = {
                          method: 'delete',
                          maxBodyLength: Infinity,
                          url: `https://napi.arvancloud.ir/cdn/4.0/domains/${process.env.DIRECT_ADMIN_DOMAIN}/dns-records/${item._id}`,
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
                            .then((response) =>{
                                console.log(`dns record with title ${item.title} successfully deleted!`)
                            }).catch((err) =>{
                                console.log(`error in deleting process with title ${item.title}`)
                                resolve({
                                    success: false,
                                    message: "error in deleting process with title ${item.title}"
                                })
                        })

                    } catch (err){
                        resolve({
                            success: false,
                            message: 'error in process of deleting from CDN!'
                        })
                    }
                }
            })
              resolve({
                  "success": true,
                  "message": "websites deleted from CDN successfully"
              })
            // axios.request(config)
            // .then((response) => {
            //   console.log('true: ',JSON.stringify(response.data));
            //   resolve({
            //       "success": true,
            //       "message": "domain saved in CDN successfully"
            //   })
            // })
            // .catch((error) => {
            //   console.log('false: ',error);
            //   resolve({
            //       "success": false,
            //       "error": error
            //   })
            // });

        })

    }

    // console.log('Model', Model)
    return ({
        all: function (req, res, next) {
            console.log('==> all()', Model.modelName);
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
            if (req.query.Search) {

                search["title." + req.headers.lan] = {
                    $exists: true,
                    "$regex": req.query.Search,
                    "$options": "i"
                };
            }
            if (req.query) {
                // console.log(req.query);
            }
            // return res.json(Model.schema.paths);
            // console.log("Model.schema => ",Model.schema.paths);
            // console.log(Object.keys(req.query));
            let tt = Object.keys(req.query);
            // console.log('type of tt ==> ', typeof tt);
            // console.log("tt => ", tt);
            _.forEach(tt, (item) => {
                // console.log("item => ",item);
                if (Model.schema.paths[item]) {
                    // console.log("item exists ====>> ",item);
                    // console.log("instance of item ===> ",Model.schema.paths[item].instance);
                    let split = req.query[item].split(',');
                    if (mongoose.isValidObjectId(split[0])) {
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
            if (req.query.filter) {
                if (JSON.parse(req.query.filter)) {
                    thef = JSON.parse(req.query.filter);
                }
            }
            // console.log('thef', thef);
            if (thef && thef != '')
                search = thef;
            // console.log(req.mongoose.Schema(Model))
            // console.log('search', search)
            if(req.query){
                search={...search,...req.query}
            }
            Model.find(search, fields,
                function (err, model) {
                    // console.log('req',req.method)
                    if (req.headers.response !== "json") {
                        return res.show()

                    }
                    if (err || !model)
                        return res.json([]);
                    Model.countDocuments(search, function (err, count) {
                        // console.log('countDocuments', count);
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
                }).skip(offset).sort({_id: -1}).limit(parseInt(req.params.limit));
        },

        viewOne: function (req, res, next) {
            console.log('viewOne...', req.params.id);
            let obj = {};
            if (mongoose.isValidObjectId(req.params.id)) {
                obj["_id"] = req.params.id;
            } else {
                obj["slug"] = req.params.id;

            }
            // console.log('obj',obj)
            Model.findOne(obj,
                function (err, menu) {
                    if (err || !menu) {
                        res.json({
                            success: false,
                            message: 'error!',
                            err:err,
                            obj
                        });
                        return 0;
                    }
                    res.json(menu);
                    return 0;

                });
        }
        ,
        create: function (req, res, next) {
            if(req.body && req.body.slug){
                req.body.slug=req.body.slug.replace(/\s+/g, '-').toLowerCase();
            }
            Model.create(req.body, function (err, menu) {
                if (err || !menu) {
                    res.json({
                        err: err,
                        success: false,
                        message: 'error!'
                    });
                    return 0;
                }
                let modelName=Model.modelName;
                modelName=global.capitalize(modelName)
                // console.log('modelName',modelName,req.headers._id,req.headers.token)
                if (req.headers._id && req.headers.token) {
                    let action = {
                        user: req.headers._id,
                        title: "create "+modelName+" " + menu._id,
                        action: "create-"+modelName,
                        data: menu,
                        history: req.body,
                    };
                    action[modelName]=menu;
                    req.submitAction(action);
                }
                res.json(menu);
                return 0;

            });
        },
        importEntity: function (req, res, next) {
            let array = [];
            if (req.query.url)
                req.httpRequest({
                    method: "get",
                    url: req.query.url,
                }).then(function (response) {

                    _.forEach(response.data, (item) => {
                        delete item._id;
                        Model.create(item, function (err, mod) {
                            if (err || !mod) {
                                console.log({
                                    err: err,
                                    success: false,
                                    message: 'error!'
                                });
                            }
                            // return 0;
                            console.log('imported...');
                        });
                    })
                    return res.json(response['data'])
                });
            else{
                _.forEach(req.body, (item) => {
                    delete item._id;
                    Model.create(item, function (err, mod) {
                        if (err || !mod) {
                            console.log({
                                err: err,
                                success: false,
                                message: 'error!'
                            });
                        }
                        // return 0;
                        console.log('imported...');
                    });
                })

            }
        }
        ,
        exportEntity: function (req, res, next) {
            let array = [];
            req.httpRequest({
                method: "get",
                url: req.query.url,
            }).then(function (response) {

                _.forEach(response.data, (item) => {
                    delete item._id;
                    Model.create(item, function (err, mod) {
                        if (err || !mod) {
                            console.log({
                                err: err,
                                success: false,
                                message: 'error!'
                            });
                        }
                        // return 0;
                        // console.log('imported...');
                    });
                })
                return res.json(response['data'])
            });
        }
        ,
        destroy:async function (req, res, next) {
            try {

                const resource = req.baseUrl.split('/').pop(); // "customer"
                console.log("resource: ", resource);

                if (resource === 'customer') {
                    console.log('Resource is customer');

                    // Find the customer by ID
                    const customer = await Model.findById(req.params.id, 'webSite name').exec();

                    if (!customer) {
                        return res.status(404).json({
                            success: false,
                            message: 'Customer not found!'
                        });
                    }

                    if (customer.webSite.length > 0) {
                        console.log(`Customer has website with domain: ${customer.webSite}`);
                        const websites = customer.webSite;

                        // Get session ID
                        const sessionResponse = await getSession();

                        if (!sessionResponse.success) {
                            return res.json({
                                success: false,
                                message: 'Error in getting sessionID!'
                            });
                        }

                        const sessionId = sessionResponse.response?.sessionID;

                        const removeDomainResponse = await removeDomain(websites, sessionId);


                        if (!removeDomainResponse.success){                            return res.json({
                                success: false,
                                message: 'Error in removing domain'
                            });
                        }
                        // Remove domain

                        const deleteFromCDNResponse = await deleteFromCDN(websites);

                        if (!deleteFromCDNResponse.success){                            return res.json({
                                success: false,
                                message: 'Error in removing domain'
                            });
                        }


                        console.log('Domain deleted successfully!');

                        // Remove content from the website
                        const removeContentResponse = await removeContent(websites);

                        if (!removeContentResponse.success) {
                            return res.json({
                                success: false,
                                message: `Error in clearing content of website ,${removeContentResponse.output}`
                            });
                        }

                        const pm2Process = await stopPm2(websites);

                        if (!pm2Process.success) {
                            return res.json({
                                success: false,
                                message: `Error in stopping pm2 ,${pm2Process.message}`
                            });
                        }

                        console.log('Content of website cleared successfully!');
                    } else {
                        console.log('Customer does not have a website');
                    }
                }

                // Delete the customer record
                const deletedMenu = await Model.findByIdAndDelete(req.params.id);

                if (!deletedMenu) {
                    return res.json({
                        success: false,
                        message: 'Error in deleting the resource'
                    });
                }

                res.json({
                    success: true,
                    message: 'Deleted!'
                });
            } catch (error) {
                console.log('Error in destroy:', error);
                res.status(500).json({
                    success: false,
                    message: 'Internal server error'
                });
            }
        }
        ,
        edit: function (req, res, next) {
            if (!req.params.id) {

                return res.json({
                    success: false,
                    message: 'send /edit/:id please, you did not enter id',
                });


            }
            //export new object saved
            if(req.body.slug){
                req.body.slug=req.body.slug.replace(/\s+/g, '-').toLowerCase();
            }
            if(!req.body){
                req.body={};
            }
            req.body.updatedAt=new Date();
            Model.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, menu) {
                if (err || !menu) {
                    res.json({
                        success: false,
                        message: 'error!',
                        err: err
                    });
                    return 0;
                }
                let modelName=Model.modelName;
                modelName=global.capitalize(modelName)
                // console.log('modelName',modelName,req.headers._id,req.headers.token)
                if (req.headers._id && req.headers.token) {
                    let action = {
                        user: req.headers._id,
                        title: "edit "+modelName+" " + menu._id,
                        action: "edit-"+modelName,
                        data: menu,
                        history: req.body,
                    };
                    action[modelName]=menu;
                    // console.log('submit action:')
                    req.submitAction(action);
                }
                res.json(menu);
                return 0;

            });
        }
        ,
        count: function (req, res, next) {
            Model.countDocuments({}, function (err, count) {
                // console.log('countDocuments', count);
                if (err || !count) {
                    res.json({
                        success: false,
                        message: 'error!'
                    });
                    return 0;
                }

                res.json({
                    success: true,
                    count: count
                });
                return 0;


            });
        }
        ,
        copy: function (req, res, next) {
            if (!req.headers.lan) {
                req.headers.lan = "fa";
            }
            if (!req.params.id) {

                return res.json({
                    success: false,
                    message: 'send /copy/:id please, you did not enter id',
                });


            }
            Model.findById(req.params.id, function (err, product) {
                if (err || !product) {
                    res.json({
                        success: false,
                        message: "error!"
                    });
                    return 0;
                }
                delete product._id;
                Model.create(product, function (err, product) {
                    if (err || !product) {
                        res.json({
                            err: err,
                            success: false,
                            message: "error!"
                        });
                        return 0;
                    }
                    // console.log("req.headers", req.headers);
                    // if (req.headers.user && req.headers.token) {
                    //     let action = {
                    //         user: req.headers.user._id,
                    //         title: "copy product " + product._id,
                    //         data: product,
                    //         history: req.body,
                    //         product: product._id
                    //     };
                    //     global.submitAction(action);
                    // }
                    res.json(product);
                    return 0;

                });


            }).lean();
        }
        ,

    })
};
export default self;
