import controller from "./controller.mjs";

export default [
  {
    path: "/",
    method: "get",
    access: "admin_user,admin_shopManager",
    controller: controller.allCustomers,
  },
    {
        path: "/",
        method: "post",
        access: "admin_user,admin_shopManager",
        controller: controller.createOne,
    },
  {
    path: "/authCustomer",
    method: "post",
    access: "customer_all",
    controller: controller.authCustomer,
  },
  {
    path: "/activateCustomer",
    method: "post",
    access: "customer_all",
    controller: controller.activateCustomer,
  },
  {
    path: "/authCustomerWithPassword",
    method: "post",
    access: "customer_all",
    controller: controller.authCustomerWithPassword,
  },
  {
    path: "/authCustomerForgotPass",
    method: "post",
    access: "customer_all",
    controller: controller.authCustomerForgotPass,
  },
  {
    path: "/setPassword",
    method: "post",
    access: "customer_user",
    controller: controller.setPassword,
  },
  {
    path: "/getSession",
    method: "get",
    access: "customer_all",
    controller: controller.getSession,
  },
  {
    path: "/getSource",
    method: "post",
    access: "customer_all",
    controller: controller.getSource,
  },
  {
    path: "/yarnInstall",
    method: "post",
    access: "customer_all",
    controller: controller.yarnInstall,
  },
  {
    path: "/addEnvLocal",
    method: "post",
    access: "customer_all",
    controller: controller.addEnvLocal,
  },
  {
    path: "/addMongoDb",
    method: "post",
    access: "customer_all",
    controller: controller.addMongoDb,
  },
  {
    path: "/domainIsExist",
    method: "post",
    access: "customer_user",
    controller: controller.domainIsExist,
  },
  {
    path: "/createSubDomain",
    method: "post",
    access: "customer_user",
    controller: controller.createSubDomain,
  },
  {
    path: "/updateAddress",
    method: "put",
    access: "customer_user",
    controller: controller.updateAddress,
  },
  {
    path: "/update",
    method: "put",
    access: "customer_user",
    controller: controller.updateCustomer,
  },
  {
    path: "/rewriteCustomers",
    method: "get",
    access: "customer_all",
    controller: controller.rewriteCustomers,
  },
  {
    path: "/removeDuplicatesCustomers",
    method: "get",
    access: "customer_all",
    controller: controller.removeDuplicatesCustomers,
  },
  {
    path: "/getme",
    method: "get",
    access: "customer_user",
    controller: controller.getme,
  },
  {
    path: "/status/:_id",
    method: "put",
    access: "admin_user",
    controller: controller.status,
  },
  {
    path: "/:offset/:limit",
    method: "get",
    access: "admin_user,admin_shopManager",
    controller: controller.allCustomers,
  },
  {
    path: "/:id",
    method: "get",
    access: "admin_user,admin_shopManager",
    controller: controller.viewOne,
  },

];
