import shell from 'shelljs';
import path from "path";
import fs from "fs";
import _ from "lodash";
import global from "#root/global";

var self = ({
    functions: function (req, res, next) {
        let functions = req.functions() || [];
        return res.json(functions);
    },
    events: function (req, res, next) {
        let events = req.events() || [];
        return res.json(events);
    },
    deactivatePlugin: function (req, res, next) {
        console.log('deactivatePlugin')
        let plugin = req.body;
        if (plugin && plugin.path && plugin.name) {
            let __dirname = path.resolve();
            let pluginPath = path.join(__dirname, "./plugins", plugin.name);
            let newPluginPath = path.join(__dirname, "./plugins", plugin.name + '-deactive');
            const scripts = path.join(__dirname, "node_modules/@nodeeweb/server/scripts");

            shell.exec('sh ' + scripts + `/mv.sh ${pluginPath} ${newPluginPath}`);
            // console.log('newPluginPath', newPluginPath)
            return res.json({
                success: true,
            })
        } else {
            return res.json({
                success: false
            })
        }
    },
    activatePlugin: function (req, res, next) {
        console.log('activatePlugin')
        let plugin = req.body;
        if (plugin && plugin.path && plugin.name) {
            let __dirname = path.resolve();
            let pluginPath = path.join(__dirname, "./plugins", plugin.name);
            let newPluginPath = path.join(__dirname, "./plugins", plugin.name.replace('-deactive', ''));
            const scripts = path.join(__dirname, "node_modules/@nodeeweb/server/scripts");

            shell.exec('sh ' + scripts + `/mv.sh ${pluginPath} ${newPluginPath}`);
            // console.log('newPluginPath', newPluginPath)
            return res.json({
                success: true,
            })
        } else {
            return res.json({
                success: false
            })
        }
    },
    plugins: function (req, res, next) {
        let __dirname = path.resolve();
        let pluginPath = path.join(__dirname, "./plugins/");
        const getDirectories = (source, callback) =>
            fs.readdir(source, {withFileTypes: true}, (err, files) => {
                if (err) {
                    callback(err)
                } else {
                    callback(
                        files
                            .filter(dirent => {
                                return (dirent.isDirectory() && (dirent.name.indexOf('deactive') == -1))
                            })
                    )
                }
            })
        getDirectories(pluginPath, function (f) {
            let p = _.map(f, (item) => {
                item.path = '/' + item.name + '/index.js'
                item.image = '/' + item.name + '/image.jpg'
            })
            return res.json(f);
        });


    },
    market: function (req, res, next) {


    },
    updatePluginRules: function (req, res, next) {
        let pluginName = req.params.plugin;
        let Settings = req.mongoose.model('Settings');

        Settings.findOne({}, 'plugins', function (err, setting) {
            if (!setting.plugins) {
                setting.plugins = {};
            }
            setting.plugins[pluginName] = req.body;
            console.log('setting.plugins', setting.plugins)
            Settings.findOneAndUpdate({}, {$set: {plugins: setting.plugins}}, {
                projection: {
                    plugins: 1
                },
            }, function (err, setting) {
                if (err && !setting) {
                    res.json({
                        err: err,
                        success: false,
                        message: "error"
                    });
                }
                res.json({success: true, setting})

            });
        });
    },
    pluginRules: function (req, res, next) {
        // let Settings = req.mongoose.model('Settings');
        if (req.props['plugin'] && req.props['plugin'][req.params.plugin]) {

            let Settings = req.mongoose.model('Settings');

            Settings.findOne({}, 'plugins', function (err, setting) {
                if (!setting.plugins) {
                    setting.plugins = [];
                }


                // console.log('setting.plugins[req.params.plugin]', setting.plugins[req.params.plugin])
                console.log('req.props[\'plugin\']', req.props['plugin'])
                _.forEach(req.props['plugin'][req.params.plugin], (item, j) => {
                    if (setting.plugins[req.params.plugin]) {

                        req.props['plugin'][req.params.plugin][j].value = setting.plugins[req.params.plugin][item.name];
                    }
                })
                return res.json({fields: req.props['plugin'][req.params.plugin]})

            })
        } else
            return res.json({fields: []})
    },
    deActivePlugins: function (req, res, next) {
        let __dirname = path.resolve();
        let pluginPath = path.join(__dirname, "./plugins/");
        const getDirectories = (source, callback) =>
            fs.readdir(source, {withFileTypes: true}, (err, files) => {
                if (err) {
                    callback(err)
                } else {
                    callback(
                        files
                            .filter(dirent => {
                                return (dirent.isDirectory() && (dirent.name.indexOf('deactive') > -1))
                            })
                    )
                }
            })
        getDirectories(pluginPath, function (f) {
            let p = _.map(f, (item) => {
                item.path = '/' + item.name + '/index.js'
                item.image = '/' + item.name + '/image.jpg'
            })
            return res.json(f);
        });


    },
    configuration: function (req, res, next) {
        console.log("edit configuration...")
        let Settings = req.mongoose.model('Settings');

        Settings.findOneAndUpdate({}, req.body, {new: true}, function (err, setting) {


            if (err && !setting) {


                res.json({
                    err: err,
                    success: false,
                    message: "error"
                });

            }
            // self.updateImportantFiles(res,setting);
            self.updateCssFile(res, setting);


            // file.pipe(fstream);
            // fstream.on("close", function() {
            //
            // });
            res.json({success: true, setting})

        });

    },
    updateCssFile: function (res, setting) {
        console.log("updateCssFile",setting)
        let __dirname = path.resolve()
        let css = ":root {\n" +
            "    --blue: #674eec;\n" +
            "    --primary: "+(setting?.primaryColor ? setting?.primaryColor : "#ff31b8")+";\n" +
            "    --indigo: #674eec;\n" +
            "    --purple: #8445f7;\n" +
            "    --pink: #ff4169;\n" +
            "    --red: #c4183c;\n" +
            "    --orange: #fb7906;\n" +
            "    --yellow: #ffb400;\n" +
            "    --green: #17c671;\n" +
            "    --teal: #1adba2;\n" +
            "    --cyan: #00b8d8;\n" +
            "    --white: #fff;\n" +
            "    --gray: #868e96;\n" +
            "    --gray-dark: #343a40;\n" +
            "    --secondary: "+(setting?.secondaryColor ? setting?.secondaryColor : "#00ccff")+";\n" +
            "    --add-to-cart-text: "+(setting?.addToCartTextColor ? setting?.addToCartTextColor : "#fff")+";\n" +
            "    --add-to-cart: "+(setting?.addToCartColor ? setting?.addToCartColor : "#00ccff")+";\n" +
            "    --add-to-cart-hover: " + (setting?.addToCartHoverColor ? setting?.addToCartHoverColor : "#ff31b8")+";\n" +
            "    --success: #17c671;\n" +
            "    --info: #00b8d8;\n" +
            "    --warning: #ffb400;\n" +
            "    --danger: #c4183c;\n" +
            "    --light: #FBFBFB;\n" +
            "    --dark: #212529;\n" +
            "    --bg-color: #ffffff;\n" +
            "    --footer-bg-color: #ffffff;\n" +
            "    --text-color: #000000;\n" +
            "    --breakpoint-xs: 0;\n" +
            "    --breakpoint-sm: 576px;\n" +
            "    --breakpoint-md: 768px;\n" +
            "    --breakpoint-lg: 992px;\n" +
            "    --breakpoint-xl: 1200px;\n" +
            "    --font-family-sans-serif: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;\n" +
            "    --font-family-monospace: 'Roboto Mono', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace\n" +
            "}";
        global.updateFile(
            './theme/site_setting/',
            'theme.css',
            css,
            __dirname
        );
        global.updateFile(
            './public_media/site_setting/',
            'theme.css',
            css,
            __dirname
        );
    },
    last: function (req, res, next) {
        let Settings = req.mongoose.model('Settings');

        console.log("last setting ==> ");
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        Settings.find(function (err, settingss) {
            // console.log('Settings find==> ');

            if (err || !settingss) {
                res.json({
                    success: false,
                    message: "error!"
                });
                return 0;
            }
            // console.log('settingss',settingss);
            if (settingss && settingss[0] && settingss[0].data)
                res.json(settingss[0].data);
            else
                res.json([]);
            return 0;


        }).skip(offset).sort({_id: -1}).limit(1);
        // res.json([]);
    },
    customerStatus: function (req, res, next) {
        let Settings = req.mongoose.model('Settings');

        console.log("last setting ==> ");
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        Settings.findOne({}, 'customerStatus', function (err, settingss) {
            // console.log('Settings find==> ');

            if (err || !settingss) {
                res.json({
                    success: false,
                    message: "error!"
                });
                return 0;
            }
            // console.log('settingss',settingss);
            if (settingss && settingss.customerStatus)
                res.json(settingss.customerStatus);
            else
                res.json({});
            return 0;


        }).skip(offset).sort({_id: -1});
        // res.json([]);
    },
    formStatus: function (req, res, next) {
        let Settings = req.mongoose.model('Settings');

        console.log("formStatus ==> ");
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        Settings.findOne({}, 'formStatus', function (err, settingss) {
            // console.log('Settings find==> ');

            if (err || !settingss) {
                res.json({
                    success: false,
                    message: "error!"
                });
                return 0;
            }
            // console.log('settingss',settingss);
            if (settingss && settingss.formStatus)
                res.json(settingss.formStatus);
            else
                res.json({});
            return 0;


        }).skip(offset).sort({_id: -1});
        // res.json([]);
    },
    factore: function (req, res, next) {
        let Settings = req.mongoose.model('Settings');

        console.log("last setting ==> ");
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        Settings.findOne({}, 'factore_shop_name factore_shop_site_name factore_shop_address factore_shop_phoneNumber factore_shop_faxNumber factore_shop_postalCode factore_shop_submitCode factore_shop_internationalCode', function (err, settingss) {
            // console.log('Settings find==> ');

            if (err || !settingss) {
                res.json({
                    success: false,
                    message: "error!"
                });
                return 0;
            }
            // console.log('settingss',settingss);
            if (settingss)
                res.json(settingss);
            else
                res.json({});
            return 0;


        }).skip(offset).sort({_id: -1});
        // res.json([]);
    },
    restart: function (req, res, next) {
        return
        const _dirname = path.resolve();
        let site = process.env.SITE_NAME || "";
        site = site.toLowerCase();
        console.log("Site ==> ", site);
        // console.log("dirname ===> " ,_dirname);
        const scripts = path.join(_dirname, "node_modules/@nodeeweb/server/scripts");
        console.log("scripts ==> ", 'sh ' + scripts + `/restart.sh ${site}`);
        res.json({
            success: true
        })
        shell.exec('sh ' + scripts + `/restart.sh ${site}`);

    },
    update: function (req, res, next) {
        const _dirname = path.resolve();
        let site = process.env.SITE_NAME;
        site = site.toLowerCase();
        console.log("Site ==> ", site);
        // console.log("dirname ===> " ,_dirname);
        const scripts = path.join(_dirname, "node_modules/@nodeeweb/server/scripts");
        console.log("scripts ==> ", 'sh ' + scripts + `/update.sh ${site}`);
        res.json({
            success: true
        })
        shell.exec('sh ' + scripts + `/update.sh ${site}`);
    },
    fileUpload: function (req, res, next) {
        let Settings = req.mongoose.model('Settings');
        let Media = req.mongoose.model('Media');

        if (req.busboy) {
            req.pipe(req.busboy);

            req.busboy.on("file", function (
                fieldname,
                file,
                filename,
                encoding,
                mimetype
            ) {

                let fstream;
                // console.log("on file app filePath", fieldname, file, filename, encoding, mimetype);
                if (!(filename && filename.filename)) {
                    res.json({
                        success: false
                    });
                    return 0;
                }
                let exention = filename.filename.split(".");
                // if (filename.mimetype.toString().includes('image')) {
                //   // name+=".jpg"
                // }
                // if (filename.mimetype.toString().includes('video')) {
                //   // name+="mp4";
                // }
                let name = "logo." + exention[1];
                let __dirname = path.resolve();

                let filePath = path.join(__dirname, "./public_media/site_setting/", name);

                fstream = fs.createWriteStream(filePath);
                // console.log('on file app mimetype', typeof filename.mimeType);

                file.pipe(fstream);
                fstream.on("close", function () {
                    // console.log('Files saved');
                    let url = "site_setting/" + name;
                    let obj = [{name: name, url: url, type: mimetype}];
                    req.photo_all = obj;
                    let photos = obj;
                    if (photos && photos[0]) {
                        Media.create({
                            name: photos[0].name,
                            url: photos[0].url,
                            type: photos[0].type,
                            theKey: "logo"

                        }, function (err, media) {


                            if (err && !media) {


                                res.json({
                                    err: err,
                                    success: false,
                                    message: "error"
                                });

                            }
                            Settings.findOneAndUpdate({}, {
                                logo: photos[0].url
                            }, {new: true}, function (err, setting) {


                                if (err && !setting) {


                                    res.json({
                                        err: err,
                                        success: false,
                                        message: "error"
                                    });

                                }
                                // console.log('setting',setting);
                                // console.log('media',media);
                                res.json(setting);

                            });

                        });
                    } else {
                        res.json({
                            success: false,
                            message: "upload faild!"
                        });
                    }
                });
            });
        } else {
            next();
        }
    },


});
export default self;