"use strict";(self.webpackChunkgomrok24=self.webpackChunkgomrok24||[]).push([[283],{62283:(e,t,s)=>{s.r(t),s.d(t,{default:()=>f});var o=s(8869),a=s(75590),r=s(2135),i=s(58467),l=s(71640),n=s(47313),d=s(82036),h=s(85281),c=s(61708),m=s(23148),u=s(66978),p=s(46417);const x=120;class g extends n.Component{constructor(e){var t,s,o;super(e),t=this,this.handleSendCodeAgain=e=>{this.handleRegister=e},this.handleRegister=e=>{e.preventDefault();let t=this.state.countryCode||"98",s=this.state.phoneNumber||"0";this.state.captcha;if(!s||""==s||0==s)return void(0,d.Am)("\u0644\u0637\u0641\u0627 \u0634\u0645\u0627\u0631\u0647 \u0645\u0648\u0628\u0627\u06cc\u0644 \u062e\u0648\u062f \u0631\u0627 \u0648\u0627\u0631\u062f \u06a9\u0646\u06cc\u062f",{type:"error"});s=s.substring(s.length-10),this.setState({thePhoneNumber:s,countryCode:t,phoneNumber:s});let o=t+(0,u.dv)(s);(0,c.z2)(o,t,this.state.loginMethod).then((e=>{e.shallWeSetPass?(this.state.timer=x,this.myInterval=setInterval((()=>{this.setState((e=>{let{timer:t}=e;return{timer:t>0?t-1:this.handleClearInterval()}}))}),1e3),this.setState({enterActivationCodeMode:!0,activationCode:null,isDisplay:!1,userWasInDbBefore:null===e||void 0===e?void 0:e.userWasInDbBefore})):!e.shallWeSetPass&&e.userWasInDbBefore&&this.setState({isDisplay:!1,getPassword:!0,userWasInDbBefore:null===e||void 0===e?void 0:e.userWasInDbBefore})}))},this.handleClearInterval=()=>(clearInterval(this.myInterval),0),this.handlePassword=e=>{e.preventDefault();let t=(this.state.countryCode||"98")+this.state.phoneNumber;(0,c.di)({phoneNumber:t,password:this.state.password}).then((e=>{e.success?this.props&&this.props.goToCheckout?this.setState({token:e.customer.token,firstName:e.customer&&e.customer.firstName?e.customer.firstName:null,lastName:e.customer&&e.customer.lastName?e.customer.lastName:null,goToCheckout:!0}):this.setState({token:e.customer.token,goToProfile:!0}):e.message&&alert(e.message)})).catch((e=>{(0,d.Am)(this.props.t(e.message),{type:"error"})}))},this.handleForgotPass=e=>{e.preventDefault();let t=this.state.countryCode||"98",s=this.state.phoneNumber||"0",o=t+(0,u.dv)(s);(0,c.gM)(o,t,this.state.loginMethod).then((e=>{this.setState({enterActivationCodeMode:!0,isDisplay:!1,getPassword:!1,firstName:e.firstName,lastName:e.lastName}),this.state.timer=x,this.myInterval=setInterval((()=>{this.setState((e=>{let{timer:t}=e;return{timer:t>0?t-1:this.handleClearInterval()}}))}),1e3)}))},this.handleWrongPhoneNumber=e=>{this.handleClearInterval(),e.preventDefault(),this.setState({phoneNumber:null,activationCode:null,enterActivationCodeMode:!1,showSecondForm:!1,isDisplay:!0,setPassword:!1,getPassword:!1,goToProfile:!1,timer:x})},this.savePasswordAndData=e=>{e.preventDefault();const{countryCode:t,phoneNumber:s,firstName:o,lastName:a,email:r,registerExtraFields:i,webSite:l,password:n,extraFields:h,internationalCode:m,internationalCodeClass:u,address:p,sessionId:x}=this.state,{t:g}=this.props;let v=p;v||(v=[]);let f=t||"98";if(o&&""!=o)if(a&&""!=a)if(l&&""!=l)if(!this.state.passwordAuthentication||n&&void 0!=n&&""!=n){if(i)for(let e=0;e<=(null===i||void 0===i?void 0:i.length);e++){var N,j;let t=null===(N=i[e])||void 0===N?void 0:N.name,s=null===(j=i[e])||void 0===j?void 0:j.require;if(s&&"address"==t){let e={StreetAddress:h[t]};h.PostalCode&&(e.PostalCode=h.PostalCode),h.postalCode&&(e.PostalCode=h.postalCode),h.postalcode&&(e.PostalCode=h.postalcode),v.push(e)}if(s&&"internationalCode"==t){if(!h[t]||void 0==h[t]||""==h[t])return void(0,d.Am)(g("fill internationalCode!"),{type:"error"});if(!u||void 0==u||""==u){if(!m)return void(0,d.Am)(g("fill internationalCode!"),{type:"error"});if(!(0,c.zu)(m))return void(0,d.Am)(g("fill internationalCode!"),{type:"error"})}}if(s&&"internationalCode"!==t&&"address"!==t&&(!h[t]||void 0==h[t]||""==h[t]))return void(0,d.Am)(g("fill every thing!"),{type:"error"})}b(o)?b(a)?l&&(0,c.Y2)({title:l,sessionId:x}).then((e=>{e.success&&(e.message.error?d.Am.error(g("website already exist!")):(0,c.AD)({phoneNumber:f+s,firstName:o,lastName:a,webSite:l,address:v,email:r,data:h,internationalCode:m,password:n}).then((e=>{(e.success||e.customer.firstName&&e.customer.lastName&&e.customer.webSite)&&this.setState({setPassword:!1,goToSiteBuilder:!0})})))})):(0,d.Am)(g("Enter last name in persian!"),{type:"error"}):(0,d.Am)(g("Enter first name in persian!"),{type:"error"})}else(0,d.Am)(g("fill everything!"),{type:"error"});else(0,d.Am)(g("fill everything!"),{type:"error"});else(0,d.Am)(g("fill everything!"),{type:"error"});else(0,d.Am)(g("fill everything!"),{type:"error"});function b(e){return!!/^[\u0600-\u06FF\s]+$/.test(e)}},this.handleActivation=e=>{e.preventDefault();let{activationCode:s,countryCode:o,phoneNumber:a="0"}=this.state,{t:r}=this.props;o||(o="98"),s||alert("enter activation code!");let i={activationCode:s,phoneNumber:o+(0,u.dv)(a)};(0,c.bB)(i).then((function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};if(!e.success)return d.Am.error(r(e.message));if(e.success&&d.Am.success(r("welcome")),e.shallWeSetPass){let s={token:e.token,enterActivationCodeMode:!1,setPassword:!0,firstName:e.firstName,lastName:e.lastName};t.setState(s)}else t.state.userWasInDbBefore?t.setState({token:null===e||void 0===e?void 0:e.token,enterActivationCodeMode:!1,setPassword:!1,goToProfile:!0,firstName:null===e||void 0===e?void 0:e.firstName,lastName:null===e||void 0===e?void 0:e.lastName}):t.setState({token:null===e||void 0===e?void 0:e.token,enterActivationCodeMode:!1,setPassword:!0,firstName:null===e||void 0===e?void 0:e.firstName,lastName:null===e||void 0===e?void 0:e.lastName})}))};let a=m.ZP.getState().store,r=!1;!a.user.token||a.user.firstName&&a.user.lastName||(r=!0),this.state={captcha:!1,phoneNumber:null,sessionId:"",thePhoneNumber:null,activationCode:null,enterActivationCodeMode:!1,showSecondForm:!1,userWasInDbBefore:!0,isDisplay:!r,setPassword:r,countryCode:a.countryCode,getPassword:!1,firstName:a.user.firstName,webSite:a.user.webSite.title,lastName:a.user.lastName,passwordAuthentication:null===a||void 0===a||null===(s=a.themeData)||void 0===s?void 0:s.passwordAuthentication,registerExtraFields:null===a||void 0===a||null===(o=a.themeData)||void 0===o?void 0:o.registerExtraFields,extraFields:{},internationalCodeClass:(0,c.zu)(a.user.internationalCode)?"true":null,internationalCode:a.user.internationalCode,email:"",goToProfile:!1,goToSiteBuilder:!1,loginMethod:"sms",token:a.user.token,CameFromPost:a.CameFromPost,goToProduct:a.goToProduct,goToCheckout:a.goToCheckout,goToChat:a.goToChat,timer:x},window.scrollTo(0,0),this.captchaAction=this.captchaAction.bind(this)}fd(e){(0,c.SR)(e)}fc(e){(0,c.lY)(e)}componentDidUpdate(e,t){}checkResponse(e){this.setState({loginMethod:e})}componentDidMount(){(0,c.zK)().then((e=>{var t;this.setState({sessionId:null===e||void 0===e||null===(t=e.sessionInfo)||void 0===t?void 0:t.sessionID})}))}componentWillUnmount(){clearInterval(this.myInterval)}captchaValue(e){}captchaAction(e){!0===e&&this.setState({captcha:!0})}render(){const{isDisplay:e,goToProfile:t,goToSiteBuilder:s,token:a,firstName:r,lastName:l,CameFromPost:n,goToProduct:d,setPassword:m,registerExtraFields:u,getPassword:g,internationalCode:v,enterActivationCodeMode:f,internationalCodeClass:N,goToCheckout:j,webSite:b,goToChat:C,loginMethod:y,extraFields:w,timer:k,passwordAuthentication:S}=this.state,{t:P,fromPage:A}=this.props;return a&&d?(this.fc(!1),(0,p.jsx)(i.Fg,{to:"/submit-order/"+d})):a&&j&&r&&l&&!m?((0,c.TJ)({goToCheckout:!1}),(0,p.jsx)(i.Fg,{to:"/checkout/"})):a&&!j&&A&&!m?((0,c.TJ)({goToCheckout:!1}),(0,p.jsx)(i.Fg,{to:A+"/"})):a&&C?((0,c.TJ)({goToChat:!1}),(0,p.jsx)(i.Fg,{to:"/chat/"})):a&&n&&!m?(this.fd(!1),(0,p.jsx)(i.Fg,{to:"/add-new-post/publish"})):t?(0,p.jsx)(i.Fg,{to:"/profile"}):s?(0,p.jsx)(i.Fg,{to:"/webSiteBuilder"}):(0,p.jsxs)(o.NX,{className:"login-register-form-inside",flush:!0,children:[e&&(0,p.jsx)(o.WI,{className:"p-3",children:(0,p.jsx)(o.X2,{children:(0,p.jsx)(o.JX,{children:(0,p.jsxs)(o.l0,{onSubmit:this.handleRegister,children:[(0,p.jsx)(o.X2,{form:!0,children:(0,p.jsxs)(o.JX,{md:"12",className:"form-group ltr",children:[(0,p.jsx)("label",{htmlFor:"thepho",children:P("phone number")}),(0,p.jsxs)(o.BZ,{className:"mb-3",children:[(0,p.jsx)(o.wF,{type:"prepend",children:(0,p.jsx)(o.ih,{onChange:e=>this.setState({countryCode:e.target.value}),children:(0,p.jsx)("option",{value:"98",children:"+98"})})}),(0,p.jsx)(o.yt,{placeholder:"",id:"thepho",className:"iuygfghuji ltr",type:"tel",dir:"ltr",onChange:e=>this.setState({phoneNumber:e.target.value})})]})]})}),(0,p.jsx)(o.X2,{form:!0}),(0,p.jsx)(o.zx,{block:!0,type:"submit",className:"center",onClick:this.handleRegister,children:P("get enter code")})]})})})}),f&&(0,p.jsx)(o.WI,{className:"p-3",children:(0,p.jsx)(o.X2,{children:(0,p.jsx)(o.JX,{children:(0,p.jsxs)(o.l0,{onSubmit:this.handleActivation,children:[(0,p.jsx)(o.X2,{form:!0,children:(0,p.jsxs)(o.JX,{md:"12",className:"form-group",children:[(0,p.jsxs)("div",{className:"your-phone-number d-flex justify-content-sb",children:[(0,p.jsx)("div",{className:"flex-item ",children:P("your phone number")+":"}),(0,p.jsx)("div",{className:"flex-item ltr",children:"+"+this.state.countryCode+this.state.thePhoneNumber})]}),(0,p.jsx)("div",{className:"your-timer",children:(0,p.jsx)("div",{className:"flex-item ",children:Boolean(k)&&(0,p.jsxs)("div",{className:"flex-item-relative center ",children:[(0,p.jsx)(h.Z,{className:"red-progress",thickness:2,size:120,variant:"determinate",value:parseInt(100*k/x)}),(0,p.jsx)("div",{className:"flex-item-absolute ",children:k})]})})}),(0,p.jsx)("div",{style:{display:"flex",flexDirection:"column",justifyContent:"start"},children:(0,p.jsx)("label",{style:{fontSize:12},htmlFor:"feEmailAddress",children:P("enter sent code")})}),(0,p.jsx)(o.BZ,{className:"mb-3",children:(0,p.jsx)(o.yt,{placeholder:"_ _ _ _ _ _",type:"number",className:"iuygfghuji ltr",dir:"ltr",onChange:e=>{this.setState({activationCode:e.target.value})}})})]})}),(0,p.jsx)(o.X2,{form:!0,children:(0,p.jsx)(o.JX,{md:"12",className:"form-group"})}),(0,p.jsx)(o.zx,{block:!0,type:"submit",className:"center",onClick:this.handleActivation,children:P("login")}),(0,p.jsx)(o.zx,{outline:!0,type:"button",className:"center btn-block outline the-less-important",onClick:this.handleWrongPhoneNumber,children:P("Wrong phone number?")}),Boolean(!k)&&(0,p.jsx)("div",{className:"flex-item-relative center ",children:(0,p.jsx)(o.zx,{outline:!0,type:"button",className:"center btn-block outline the-less-important the-no-border",onClick:e=>this.handleRegister(e),children:P("Send code again?")})})]})})})}),m&&(0,p.jsx)(o.WI,{className:"p-3",children:(0,p.jsx)(o.X2,{children:(0,p.jsx)(o.JX,{children:(0,p.jsxs)(o.l0,{onSubmit:this.savePasswordAndData,children:[(0,p.jsxs)(o.X2,{form:!0,children:[(0,p.jsxs)(o.JX,{md:"12",className:"form-group",children:[(0,p.jsx)("label",{htmlFor:"olfirstname",children:P("Your first name")}),(0,p.jsx)(o.BZ,{className:"mb-3",children:(0,p.jsx)(o.yt,{placeholder:P("First name (persian)"),type:"text",id:"olfirstname",dir:"rtl",value:r,onChange:e=>this.setState({firstName:e.target.value})})})]}),(0,p.jsxs)(o.JX,{md:"12",className:"form-group",children:[(0,p.jsx)("label",{htmlFor:"ollastname",children:P("Your last name")}),(0,p.jsx)(o.BZ,{className:"mb-3",children:(0,p.jsx)(o.yt,{placeholder:P("Last name (persian)"),type:"text",value:l,id:"ollastname",dir:"rtl",onChange:e=>this.setState({lastName:e.target.value})})})]}),(0,p.jsxs)(o.JX,{md:"12",className:"form-group",children:[(0,p.jsx)("label",{htmlFor:"ollastname",children:P("Your domain Name")}),(0,p.jsx)(o.BZ,{className:"mb-3",children:(0,p.jsx)(o.yt,{placeholder:P("Website"),type:"text",value:b,id:"ollastname",dir:"rtl",onChange:e=>this.setState({webSite:e.target.value})})})]}),u&&u.map((e=>"internationalCode"==(null===e||void 0===e?void 0:e.name)?(0,p.jsxs)(o.JX,{md:"12",className:"form-group "+N,children:[(0,p.jsx)("label",{htmlFor:"internationalCode",children:P("International Code")}),(0,p.jsx)(o.BZ,{className:"mb-3",children:(0,p.jsx)(o.yt,{className:"iuygfghuji ltr",placeholder:P("xxxxxxxxxx"),type:"number",value:v,id:"internationalCode",dir:"ltr",onChange:t=>{let s=w;s[null===e||void 0===e?void 0:e.name]=t.target.value,this.setState({internationalCode:t.target.value,internationalCodeClass:(0,c.zu)(t.target.value),extraFields:{...s}})}})})]}):(0,p.jsxs)(o.JX,{md:"12",className:"form-group",children:[(0,p.jsx)("label",{htmlFor:"ollastname",children:null===e||void 0===e?void 0:e.label}),(0,p.jsx)(o.BZ,{className:"mb-3",children:(0,p.jsx)(o.yt,{placeholder:null===e||void 0===e?void 0:e.label,type:"text",value:w[null===e||void 0===e?void 0:e.name],id:"ollastname",dir:"rtl",onChange:t=>{let s=w;s[null===e||void 0===e?void 0:e.name]=t.target.value,this.setState({extraFields:{...s}})}})})]}))),S&&(0,p.jsxs)(o.JX,{md:"12",className:"form-group",children:[(0,p.jsx)("label",{htmlFor:"oiuytpaswword",children:P("set new password")}),(0,p.jsx)(o.BZ,{className:"mb-3",children:(0,p.jsx)(o.yt,{placeholder:"******",type:"password",id:"oiuytpaswword",dir:"ltr",onChange:e=>this.setState({password:e.target.value})})})]})]}),(0,p.jsx)(o.X2,{form:!0,children:(0,p.jsx)(o.JX,{md:"12",className:"form-group"})}),(0,p.jsx)(o.zx,{type:"submit",className:"center btn-block",onClick:this.savePasswordAndData,children:P("Register")}),(0,p.jsx)(o.zx,{type:"submit",className:"center btn-block",onClick:c.RD,children:P("Logout")})]})})})}),g&&(0,p.jsx)(o.WI,{className:"p-3",children:(0,p.jsx)(o.X2,{children:(0,p.jsx)(o.JX,{children:(0,p.jsxs)(o.l0,{onSubmit:this.handlePassword,children:[(0,p.jsx)(o.X2,{form:!0,children:(0,p.jsxs)(o.JX,{md:"12",className:"form-group",children:[(0,p.jsx)("div",{className:"your-phone-number d-flex justify-content-sb",children:(0,p.jsx)("div",{className:"mb-2 flex-item",children:P("You registered before, please enter your password.")})}),(0,p.jsxs)("div",{className:"your-phone-number d-flex justify-content-sb",children:[(0,p.jsx)("div",{className:"flex-item ",children:P("your phone number")+":"}),(0,p.jsx)("div",{className:"flex-item ltr",children:"+"+this.state.countryCode+this.state.thePhoneNumber})]}),(0,p.jsx)("label",{htmlFor:"oiuytgpaswword",children:P("Enter password")}),(0,p.jsx)(o.BZ,{className:"mb-3",children:(0,p.jsx)(o.yt,{placeholder:"******",type:"password",id:"oiuytgpaswword",dir:"ltr",onChange:e=>this.setState({password:e.target.value})})})]})}),(0,p.jsx)(o.X2,{form:!0,children:(0,p.jsx)(o.JX,{md:"12",className:"form-group"})}),(0,p.jsx)(o.zx,{block:!0,type:"submit",className:"center",onClick:this.handlePassword,children:P("Login")}),(0,p.jsx)(o.zx,{type:"button",className:"center btn-block",onClick:this.handleForgotPass,children:P("Forgot Password")}),(0,p.jsx)(o.zx,{outline:!0,type:"button",className:"center btn-block outline the-less-important",onClick:this.handleWrongPhoneNumber,children:P("Wrong phone number?")})]})})})})]})}}const v=(0,a.Zh)()(g);function f(){const{t:e}=(0,a.$G)(),[t]=(0,r.lr)(),s=(0,i.UO)(),n=t.get("fromPage");return"goToCheckout"===s._state&&(0,c.TJ)({goToCheckout:!0}),"goToChat"===s._state&&(0,c.TJ)({goToChat:!0}),(0,p.jsxs)(o.W2,{fluid:!0,className:"main-content-container px-4",children:[(0,p.jsx)(o.X2,{noGutters:!0,className:"page-header py-4",children:(0,p.jsx)(l.Z,{sm:"12",title:e("login / register"),subtitle:e("user account"),className:"text-sm-left"})}),(0,p.jsx)("div",{className:"w-100 login-register-form-wrapper",children:(0,p.jsx)(o.JX,{lg:"4",className:"mx-auto mb-4",children:(0,p.jsx)(o.Zb,{children:(0,p.jsx)(v,{goToCheckout:"goToCheckout"===s._state,fromPage:n})})})})]})}}}]);