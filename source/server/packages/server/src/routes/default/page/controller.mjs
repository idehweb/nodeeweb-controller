import global from "#root/global";
import { differenceInDays } from "date-fns";

export default {
  create: function (req, res, next) {
    let Model = req.mongoose.model("Page");

    if (req.body && req.body.slug) {
      req.body.slug = req.body.slug.replace(/\s+/g, "-").toLowerCase();
    }
    Model.create(req.body, function (err, menu) {
      if (err || !menu) {
        res.json({
          err: err,
          success: false,
          message: "error!",
        });
        return 0;
      }
      let modelName = Model.modelName;
      modelName = global.capitalize(modelName);
      // console.log('modelName',modelName,req.headers._id,req.headers.token)
      if (req.headers._id && req.headers.token) {
        let action = {
          user: req.headers._id,
          title: "create " + modelName + " " + menu._id,
          action: "create-" + modelName,
          data: menu,
          history: req.body,
        };
        action[modelName] = menu;
        req.submitAction(action);
      }
      global.updateThemeConfig(req.props);

      res.json(menu);
      return 0;
    });
  },

  edit: function (req, res, next) {
    let Model = req.mongoose.model("Page");

    if (!req.params.id) {
      return res.json({
        success: false,
        message: "send /edit/:id please, you did not enter id",
      });
    }
    //export new object saved
    if (req.body.slug) {
      req.body.slug = req.body.slug.replace(/\s+/g, "-").toLowerCase();
    }
    if (!req.body) {
      req.body = {};
    }
    req.body.updatedAt = new Date();
    Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
      function (err, menu) {
        if (err || !menu) {
          res.json({
            success: false,
            message: "error!",
            err: err,
          });
          return 0;
        }
        let modelName = Model.modelName;
        modelName = global.capitalize(modelName);
        // console.log('modelName',modelName,req.headers._id,req.headers.token)
        if (req.headers._id && req.headers.token) {
          let action = {
            user: req.headers._id,
            title: "edit " + modelName + " " + menu._id,
            action: "edit-" + modelName,
            data: menu,
            history: req.body,
          };
          action[modelName] = menu;
          // console.log('submit action:')

          req.submitAction(action);
        }
        global.updateThemeConfig(req.props);

        res.json(menu);
        return 0;
      }
    );
  },
  viewOne: function (req, res, next) {
    const Model = req.mongoose.model("Page");

    const obj = {};
    if (req.mongoose.isValidObjectId(req.params.id)) obj._id = req.params.id;
    else obj.slug = req.params.id;

    const searchParams = req.query.search;

    if (searchParams) {
      obj["$or"] = [
        {
          ["title." + req.headers.lan]: {
            $exists: true,
            $regex: req.params.search,
            $options: "i",
          },
        },
      ];
    }

    Model.findOne(obj, function (err, item) {
      if (err)
        return res.status(503).json({
          success: false,
          message: "error!",
          err: err,
        });

      if (!item)
        return res.status(404).json({
          success: false,
        });

      // public access
      if (!item.access || (item.access && item.access == "public"))
        return res.json(item);

      if (item.access && item.access == "private") {
        if (!req.headers.token) {
          return res.status(401).json({
            success: false,
            _id: item && item._id ? item._id : null,
            slug: item && item.slug ? item.slug : null,
            access: "private",
            message: "login please",
          });
        }

        const Customer = req.mongoose.model("Customer");
        const Admin = req.mongoose.model("Admin");

        Customer.findOne(
          { "tokens.token": req.headers.token },
          "_id , tokens , credit , active , expireDate , data",
          function (err, customer) {
            if (err || !customer) {
              console.error(
                "==> authenticateCustomer() got error",
                err,
                customer
              );
              Admin.findOne(
                { token: req.headers.token },
                "token , _id",
                function (err, admin) {
                  if (err || !admin) {
                    return res.status(403).json({
                      success: false,
                      _id: item && item._id ? item._id : null,
                      slug: item && item.slug ? item.slug : null,
                      access: "private",
                      message: "login please",
                    });
                  } else {
                    return res.json(item);
                  }
                }
              );
            } else {
              if (!customer.active) {
                return res.json({
                  success: false,
                  _id: item && item._id ? item._id : null,
                  slug: item && item.slug ? item.slug : null,
                  access: "private",
                  active: customer.active,
                  message: "customer is not active",
                });
              }
              if (!customer.data) customer.data = {};

              if (!customer.data.expireDate) {
                const appointment = new Date();
                appointment.setDate(appointment.getDate() + 14);
                let obj = {
                  $set: {
                    data: { expireDate: appointment, ...customer.data },
                  },
                };
                Customer.findByIdAndUpdate(
                  customer._id,
                  obj,
                  {
                    new: true,
                    select: {
                      _id: 1,
                      data: 1,
                    },
                  },
                  function (err, cus) {
                    console.error("err", err, cus);
                    item.customerExpireDate = customer.data.expireDate;
                    return res.json(item);
                  }
                );
              }
              if (customer.data.expireDate) {
                const diffInDays = differenceInDays(
                  new Date(customer.data.expireDate),
                  new Date()
                );

                item.diffInDays = parseInt(diffInDays);
                item.customerExpireDate = customer.data.expireDate;
                if (diffInDays < 1) {
                  return res.json({
                    success: false,
                    _id: item && item._id ? item._id : null,
                    slug: item && item.slug ? item.slug : null,
                    access: "private",
                    expire: true,
                    diffInDays: diffInDays,
                    message: "customer is expire",
                  });
                }

                return res.json(item);
              }
            }
          }
        );
      }
    }).lean();
  },
};
