import{e,u as s,b as l}from"./common-28167f74.js";import{c as n,i as t,l as a,ae as r,f as o,g as i,s as u,j as c,B as d,o as m}from"./vendor-8f5629ee.js";const p={class:"h-100"},v={style:{display:"none"}},b=[i("defs",null,[i("filter",{id:"blob"},[i("feGaussianBlur",{in:"SourceGraphic",stdDeviation:"10",result:"blur"}),i("feColorMatrix",{in:"blur",mode:"matrix",values:"\r\n            1 0 0 0 0\r\n            0 1 0 0 0\r\n            0 0 1 0 0\r\n            0 0 0 20 -10\r\n            "})])],-1)],h={class:"home-container"},f={class:"inner"},y={class:"svg"},g=i("span",null,"+",-1),x=i("span",null,"+",-1),M=i("span",null,"+",-1),P=i("h1",null,"Welcome to system.",-1),j={class:"bg"},I=[i("div",{class:"bubble"},null,-1)],R=n({__name:"home",setup(n){const R=t(null),$=()=>{const e=R.value,s=e.clientWidth;for(let l=0;l<10;l++){const l=document.createElement("dev");l.className="bubble";const n=100*Math.random()+50,t=Math.random()*(s-n),a=4*Math.random()+2;l.style.setProperty("--s",`${n}px`),l.style.setProperty("--x",`${t}px`),l.style.setProperty("--d",`${a}s`),e.appendChild(l)}},_=e=>{e.target.remove()};let k=null;a((()=>{$(),k=setInterval($,1e3)})),r((()=>{clearInterval(k)}));const A=c(),B=e(),C=s(),D=l(),E=e=>{let s=e[0];return s.children&&s.children.length&&(s=E(s.children)),s};return(()=>{if(!C.isAutoJump)return;let e=B.addRoutes,s=E(e);C.ISPROD||(s.query={TOKEN:D.token}),A.push(s)})(),(e,s)=>{const l=d("svg-icon");return m(),o("div",p,[(m(),o("svg",v,b)),i("div",h,[i("div",f,[i("div",y,[u(l,{name:"lg-vue",color:"#f00"}),g,u(l,{name:"lg-vite"}),x,u(l,{name:"lg-typescript"}),M,u(l,{name:"lg-pinia"})]),P]),i("div",j,[i("div",{class:"bubbles",ref_key:"bubblesRef",ref:R,onAnimationend:_},I,544)])])])}}});export{R as default};