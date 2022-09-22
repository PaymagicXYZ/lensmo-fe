import{r as m}from"./index.12d2f6c3.js";const p="modulepreload",d=function(n){return"/"+n},f={},x=function(e,i,t){return!i||i.length===0?e():Promise.all(i.map(r=>{if(r=d(r),r in f)return;f[r]=!0;const o=r.endsWith(".css"),l=o?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${r}"]${l}`))return;const s=document.createElement("link");if(s.rel=o?"stylesheet":p,o||(s.as="script",s.crossOrigin=""),s.href=r,document.head.appendChild(s),o)return new Promise((a,_)=>{s.addEventListener("load",a),s.addEventListener("error",()=>_(new Error(`Unable to preload CSS for ${r}`)))})})).then(()=>e())};var y={exports:{}},c={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var h=m.exports,v=Symbol.for("react.element"),E=Symbol.for("react.fragment"),O=Object.prototype.hasOwnProperty,R=h.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,S={key:!0,ref:!0,__self:!0,__source:!0};function u(n,e,i){var t,r={},o=null,l=null;i!==void 0&&(o=""+i),e.key!==void 0&&(o=""+e.key),e.ref!==void 0&&(l=e.ref);for(t in e)O.call(e,t)&&!S.hasOwnProperty(t)&&(r[t]=e[t]);if(n&&n.defaultProps)for(t in e=n.defaultProps,e)r[t]===void 0&&(r[t]=e[t]);return{$$typeof:v,type:n,key:o,ref:l,props:r,_owner:R.current}}c.Fragment=E;c.jsx=u;c.jsxs=u;(function(n){n.exports=c})(y);export{x as _,y as j};
