/* eslint-disable import/no-anonymous-default-export */
import ForgetPasswordForm from "./Login/ForgetPassword";

// eslint-disable import/no-anonymous-default-export 
console.log(`NODE_ENV is set to: ${process.env.NODE_ENV}`);
export default {


  apiurl: process.env.NODE_ENV === "development"
    ? "http://wa_front.localhost.com/"
    // : "https://hrmsapi.cherrypiksoftware.com/",
    : "https://front.wasteaccountant.com/",

  //   authApis: {
  //     login: "api/auth/login",
  //     logout: "api/auth/logout",
  //     refreshToken: "api/auth/refresh",
  //     gmailotp: "api/send-otp",
  //     verifyotp: "api/verify-otp",
  //     resetpassword: "api/reset-password",
  //   },


  apis: {

    login: 'api/login',
    LoginExToken: 'api/refresh',



    forgetPassSendotp: 'api/send-otp',
    forgetPassvarify: 'api/verify-otp',
    forgetPassreset: 'api/reset-password',



    userList: "api/top-menu",
    add: "api/top-menu-store",
    update: 'api/top-menu-update',
    getItemById: 'api/top-menu-edit',
    softdelete: 'api/top-menu-delete/',
    active: 'api/top-menu-active/',

    navbaradd: 'api/navbar-store',
    navbarList: "api/navbar",
    navbarDelet: 'api/navbar-delete/',
    navbarEdit: 'api/navbar-edit/',
    navbarupdate: 'api/navbar-update/',
    navbarActive: 'api/navbar-active/',

    homeinsert: 'api/home-page-store',
    homepagelist: 'api/home-page',
    homeEdit: 'api/home-page-edit/',
    Homeupdate: 'api/home-page-update/',
    homeDelete: 'api/home-page-delete/',
    homeActive: 'api/home-page-active/',

    p_reciverinsert: 'api/producer-receiver-store',
    p_reciverListing: 'api/producer-receiver-list',
    p_reciverDelete: 'api/producer-receiver-delete/',
    p_reciverEdit: 'api/producer-receiver-edit/',
    p_reciverUpdate: 'api/producer-receiver-update/',
    p_reciverActive: 'api/producer-receiver-active/',


    quotestore: 'api/quote-store',
    quotesListing: 'api/quote-section-list',
    quotesDelete: 'api/quote-delete/',
    quotesEdit: 'api/quote-edit/',
    quotesUpdate: 'api/quote-update/',


    weststore: 'api/choose-waste-accountant-store',
    westListing: 'api/choose-waste-accountant-list',
    westDelete: 'api/choose-waste-accountant-delete/',
    westEdit: 'api/choose-waste-accountant-edit/',
    westupdate: 'api/choose-waste-accountant-update/',
    westActive: 'api/choose-waste-accountant-active/',


    improvestore: 'api/improve-envirmental-protection-store',
    improveListData: 'api/improve-envirmental-protection-list',
    improveDelete: 'api/improve-envirmental-protectiont-delete/',
    impoveEdit: 'api/improve-envirmental-protectiont-edit/',
    improveUpdate: 'api/improve-envirmental-protectiont-update/',
    improveActive: 'api/improve-envirmental-protectiont-active/',

    postStore: 'api/post-page-store',
    postListingData: 'api/post-page-list',
    PostDelete: 'api/post-page-delete/',
    postActive: 'api/post-page-active/',
    postEdit: 'api/post-page-edit/',
    postUpdate: 'api/post-page-update/',


    dynamicstore: 'api/dynamic-post-store',
    dynamicList: 'api/dynamic-post-list',
    dynamicEdit: 'api/dynamic-post-edit/',
    dynamicUpdate: 'api/dynamic-post-update/',
    dynamicActive: 'api/dynamic-post-active/',
    dynamicDelete: 'api/dynamic-post-delete/',


    dynamicFieldfetch: 'api/get-form-data/',
    postDynamicstore: 'api/post-data-store/',
    postDynamiclist: 'api/post-data-list/',
    postDynamicEdit: 'api/post-data-edit/',
    postDynamicUpdate: 'api/post-data-update/',
    postDynamicDelete: 'api/post-data-delete/',
    postDynamicActive: 'api/post-data-active/',


    pageStore: 'api/page-store',
    pageList: 'api/page-list',
    pageEdit: 'api/page-edit/',
    pageUpdate: 'api/page-update/',
    pageDelele: 'api/page-delete/',
    pageActie: 'api/page-active/',

    pageActive1: 'api/page-status/',

    contactlist: 'api/contact-page-list',
    contactdelete: 'api/contact-page-delete/',



  },
};
