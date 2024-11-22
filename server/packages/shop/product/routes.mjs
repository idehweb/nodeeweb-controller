import controller from './controller.mjs'
export default [
    {
        "path": "/",
        "method": "get",
        "access": "admin_user,admin_shopManager",
        "controller": controller.getAll,
    },
    {
        "path": "/torob/:offset/:limit",
        "method": "get",
        "controller": controller.torob,

        // "access": "admin_user,admin_shopManager,customer_all",
    },
    {
        "path": "/count",
        "method": "get",
        "access": "admin_user,admin_shopManager",
    },
    {
        "path": "/:offset/:limit",
        "method": "get",
        "controller": controller.getAll,

        // "access": "admin_user,admin_shopManager,customer_all",
    }, {
        "path": "/:offset/:limit/:search",
        "method": "get",
        "controller": controller.getAll,

        // "access": "admin_user,admin_shopManager,customer_all",
    },
    {
        "path": "/:id",
        "method": "get",
        "access": "customer_all",
        "controller": controller.viewOne,

        // "controller":()=>{
        //     console.log('hi')
        // }
    },
    {
        "path": "/",
        "method": "post",
        "access": "admin_user,admin_shopManager",
        "controller": controller.createByAdmin,

    },
    // {
    //     "path": "/importFromWordpress",
    //     "method": "post",
    //     "access": "admin_user,admin_shopManager",
    //     "controller": controller.importFromWordpress,
    // },
    {
        "path": "/rewriteProducts",
        "method": "post",
        "access": "admin_user,admin_shopManager",
        "controller": controller.rewriteProducts,
    },
    {
        "path": "/rewriteProductsImages",
        "method": "post",
        "access": "admin_user,admin_shopManager",
        "controller": controller.rewriteProductsImages,
    },
    {
        "path": "/:id",
        "method": "put",
        "access": "admin_user,admin_shopManager",
        "controller": controller.editByAdmin,

    },
    {
        "path": "/:id",
        "method": "delete",
        "access": "admin_user,admin_shopManager",
        "controller": controller.destroy,

    },
    {
        "path": "/comment/:id",
        "method": "post",
        "access": "customer_user,admin_shopManager",
        "controller": controller.addComment,

    },
]
