"use strict";(self.webpackChunkgomrok24=self.webpackChunkgomrok24||[]).push([[135],{5135:(e,s,a)=>{a.r(s),a.d(s,{default:()=>v});var t=a(94146),r=a(81398),c=a(47313),l=a(8869),n=a(2135),i=a(85554),d=a(61708),o=a(82036),h=a(75590),m=(a(17237),a(11198)),x=a(9109),p=a(46417);const u=(0,h.Zh)()((function(e){let{t:s,hideLogoText:a=!1}=e;const t=(0,i.v9)((e=>!!e.store.cardVisible)),r=(0,i.v9)((e=>e.store.card));let c=0;return r&&r.length&&(c=r.length),(0,p.jsx)("div",{className:"main-navbar",children:(0,p.jsxs)(l.wp,{className:"align-items-stretch bg-white flex-md-nowrap border-bottom p-0",type:"light",children:[(0,p.jsx)("div",{className:"d-sm-inline ",children:(0,p.jsxs)("div",{className:"jhgfdfg",children:[(0,p.jsx)(x.Z,{}),c,(0,p.jsx)("span",{className:"ml-1 mr-2",children:s("item")})]})}),(0,p.jsx)("div",{className:"toggle-sidebar d-sm-inline",onClick:()=>(0,d.oO)(t),children:(0,p.jsx)(m.Z,{})})]})})}));var f=a(68562),g=a(23148);const j=(0,h.Zh)()((e=>{let{props:s,t:a}=e;const r=(0,i.v9)((e=>e.store.themeData));r.currency||(r.currency="toman");const h=(0,i.v9)((e=>!!e.store.cardVisible)),m=(0,i.v9)((e=>e.store.card)),x=(0,t.Z)("main-sidebar","card-sidebar","px-0","col-12",h&&"open");let[j,N]=(0,c.useState)(0),[v,b]=(0,c.useState)(0),[w,k]=(0,c.useState)(g.ZP.getState().store.lan||"fa");const y=async e=>{let s=[];await m.forEach((async(a,t)=>{e!==t?await s.push(a):e===t&&(j-=(a.salePrice||a.price)*a.count)})),(j<0||s.length<1)&&(j=0),await(0,d.OV)(s,j).then((()=>{N(j),(0,o.Am)(a("Item deleted!"),{type:"warning"})}))},P=async()=>{(0,o.Am)(a("You did not add anything to cart!"),{type:"error"})},C=e=>{if(r.tax&&r.taxAmount){let s=parseInt(r.taxAmount);e=parseInt((s/100+1)*parseInt(e))}if(e)return e.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")+" "+a(r.currency)};let Z=0;return(0,p.jsxs)(l.JX,{tag:"aside",className:x,lg:{size:3},md:{size:4},children:[(0,p.jsx)(u,{}),(0,p.jsx)("div",{flush:"true",className:"card-add",children:m&&m.length>0&&m.map(((e,s)=>(Z+=e.count*(e.salePrice||e.price),(0,p.jsxs)(l.WI,{className:"d-flex px-3 border-0 wedkuhg",children:[(0,p.jsx)("div",{className:"flex-1 txc",children:(0,p.jsxs)("div",{className:"bge",children:[(0,p.jsxs)(l.zx,{className:" thisiscarda",onClick:e=>{e.preventDefault(),(async e=>{j=0;let s=[];await m.forEach((async(a,t)=>{j+=(a.salePrice||a.price)*a.count,e===t&&(a.count=a.count+1,j+=(a.salePrice||a.price)*a.count),await s.push(a)})),await(0,d.OV)(s,j).then((()=>{N(j)}))})(s).then((e=>{}))},children:[" ",(0,p.jsx)("span",{className:"material-icons",children:"add"})]}),(0,p.jsx)("div",{className:"number",children:e.count}),(0,p.jsxs)(l.zx,{className:" thisiscarda",onClick:e=>{e.preventDefault(),(async e=>{j=0;let s=[];await m.forEach((async(a,t)=>{j+=(a.salePrice||a.price)*a.count,e!==t||(a.count=a.count-1,j-=(a.salePrice||a.price)*a.count,0!==a.count)?await s.push(a):y(e)})),await(0,d.OV)(s,j).then((()=>{N(j)}))})(s).then((e=>{}))},children:[" ",(0,p.jsx)("span",{className:"material-icons",children:"remove"})]})]})}),(0,p.jsx)("div",{className:"flex-1 txc imgds mr-2 ml-2",children:(0,p.jsx)(f.Z,{perPage:1,arrows:!1,interval:Math.floor(1e3+4001*Math.random()),breakpoints:{1024:{perPage:1},768:{perPage:1},640:{perPage:1},320:{perPage:1}},className:"p-0 m-0",children:e.photos&&e.photos.map(((e,s)=>(0,p.jsx)("img",{className:"gfdsdf",src:d.nS+"/"+e},s)))})}),(0,p.jsxs)("div",{className:"flex-8 mr-2",children:[(0,p.jsx)("div",{className:"ttl",children:e.title[w]}),e.price&&!e.salePrice&&(0,p.jsx)("div",{className:"prc",children:C(e.price)}),e.price&&e.salePrice&&(0,p.jsxs)("div",{className:"prc",children:[C(e.salePrice),(0,p.jsx)("del",{className:"ml-2",children:C(e.price)})]})]}),(0,p.jsx)("div",{className:"flex-1",children:(0,p.jsxs)(l.zx,{className:"notred smallx",onClick:()=>{y(s).then((e=>{}))},children:[" ",(0,p.jsx)("span",{className:"material-icons",children:"delete"})]})})]},s))))}),(0,p.jsxs)("div",{className:"fdsdf pl-3 pr-3",onClick:()=>(0,d.oO)(!0),children:[m&&m.length>0&&(0,p.jsxs)(n.rU,{to:"/checkout",className:"go-to-checkout ml-auto ffgg btn btn-accent btn-lg mt-4 posrel textAlignLeft",children:[(0,p.jsx)("span",{className:"gfdfghj",children:a("Checkout")}),(0,p.jsx)("span",{className:"juytrftyu",children:Z&&(0,p.jsx)("span",{className:"ttl gtrf",children:C(Z)})})]}),!m||!m.length&&(0,p.jsxs)(l.zx,{onClick:()=>P,className:"go-to-checkout-without-items ml-auto ffgg btn btn-accent btn-lg mt-4 posrel textAlignLeft",children:[(0,p.jsx)("span",{className:"gfdfghj",children:a("Checkout")}),(0,p.jsx)("span",{className:"juytrftyu",children:Z&&(0,p.jsx)("span",{className:"ttl gtrf",children:C(Z)})})]})]})]})})),N=e=>{const{children:s,width:a,noNavbar:c,onChange:l=(()=>null),themeData:n}=e;if(!n)return;let i=(0,d.tt)(n.header);delete i.maxWidth;let o=(0,d.tt)(n.footer);return delete o.maxWidth,(0,p.jsxs)(p.Fragment,{children:[n.header&&n.header.elements&&(0,p.jsx)("header",{style:i,className:"main-header d-flex  "+n.header.classes+(n.header.showInDesktop?" showInDesktop ":"")+(n.header.showInMobile?" showInMobile ":""),children:(0,p.jsx)(r.Z,{elements:n.header.elements,maxWidth:n.header.maxWidth})}),s,(0,p.jsx)(j,{}),n.footer&&n.footer.elements&&(0,p.jsx)("footer",{style:o,className:(0,t.Z)("main-footer border-top",n.footer.classes),children:(0,p.jsx)(r.Z,{elements:n.footer.elements,maxWidth:n.footer.maxWidth})})]})};N.defaultProps={noNavbar:!1,noFooter:!1};const v=N}}]);