import{h as s,r as t,f as o,o as a,c as e,a as r,L as i,a7 as n,u as p}from"./@vue-a135adea.js";import{_ as l}from"./common-e45c8610.js";import"./element-plus-b235a374.js";import"./lodash-es-7cdd8bf7.js";import"./async-validator-cf877c1f.js";import"./@vueuse-1c227f78.js";import"./@element-plus-53304ce0.js";import"./@ctrl-91de2ec7.js";import"./@popperjs-b78c3215.js";import"./nprogress-bb8bbc26.js";import"./@intlify-70f8e63b.js";import"./source-map-cb1fe5b8.js";import"./axios-a8ee11a1.js";const m={class:"page"},c={class:"container"},h=["src"],d=l(s({__name:"index",setup(s){const l=t([]),d=t(),u=()=>{const s=["https://cdn.seovx.com/?mom=302","https://cdn.seovx.com/d/?mom=302","https://cdn.seovx.com/ha/?mom=302","https://api.btstu.cn/sjbz/api.php","https://bing.ioliu.cn/v1/rand?w=900&h=600","https://api.r10086.com/PPT/PPT.php?PPT=赛马娘","https://bing.ioliu.cn/v1/rand?w=800&h=600"];let t=[],o=0;for(let a=0;a<9;a++)if(Math.random()>.3)t.push(s[o]),o++,o>=s.length&&(o=0);else{const s=`https://loremflickr.com/${Math.floor(70*Math.random()+30)}0/${Math.floor(70*Math.random()+10)}0`;t.push(s)}l.value=l.value.concat(t)};return o((()=>{new IntersectionObserver((s=>{s[0].isIntersecting&&u()}),{root:null,threshold:1}).observe(d.value)})),(s,t)=>(a(),e("div",m,[r("div",c,[(a(!0),e(i,null,n(p(l),((s,t)=>(a(),e("div",{class:"item",key:t},[r("img",{src:s,alt:""},null,8,h)])))),128))]),r("div",{class:"loading",ref_key:"loading",ref:d},null,512)]))}}),[["__scopeId","data-v-9833c775"]]);export{d as default};