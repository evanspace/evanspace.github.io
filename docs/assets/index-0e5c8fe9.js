import{d as e,r as t,h as o,z as s,o as a,c as r,a as i}from"./@vue-a65f2bcd.js";import{_ as l}from"./common-483d9c9f.js";import"./element-plus-c17a5b2d.js";import"./lodash-es-e892efce.js";import"./async-validator-cf877c1f.js";import"./@vueuse-98deaf90.js";import"./@element-plus-a81da9ad.js";import"./@ctrl-91de2ec7.js";import"./@popperjs-b78c3215.js";import"./nprogress-8c9189ea.js";import"./@intlify-6938da42.js";import"./axios-9048dd51.js";const n=l(e({__name:"index",setup(e){const l=t(),n=t();let p,c=0,d=0,m=[];const f=()=>{const e=n.value,t=e.getContext("2d"),o=window.devicePixelRatio;n.value.height=l.value.clientHeight*o,n.value.width=l.value.clientWidth*o,c=15*o,t.font=`${c}px "Roboto Mono"`,d=Math.floor(e.width/c),m=new Array(d).fill(0),h(),clearInterval(p),p=setInterval(h,50)},v=()=>{const e="qwertyuiopasdfghjklzxcvbnm1234567890";return e[Math.floor(36*Math.random())]},h=()=>{const e=n.value,t=e.getContext("2d");t.fillStyle="rgba(0,0,0,.1)",t.fillRect(0,0,e.width,e.height),t.fillStyle="#6BE445",t.textAlign="left",t.textBaseline="top";for(let o=0;o<d;o++){const s=v(),a=o*c,r=m[o]*c;t.fillText(s,a,r),r>e.height&&Math.random()>.99?m[o]=0:m[o]++}};return o((()=>{f(),window.addEventListener("resize",f)})),s((()=>{clearInterval(p),window.removeEventListener("resize",f)})),(e,t)=>(a(),r("div",{class:"page",ref_key:"page",ref:l},[i("canvas",{ref_key:"canvas",ref:n},null,512)],512))}}),[["__scopeId","data-v-f0ce75fc"]]);export{n as default};