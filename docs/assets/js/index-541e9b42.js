import{e,j as t,m as a,af as o,o as l,g as n,h as r}from"./vendor-8d16b5c9.js";import{_ as i}from"./common-9b4b1eeb.js";const s=i(e({__name:"index",setup(e){const i=t(),s=t();let c,d=0,f=0,v=[];const h=()=>{const e=s.value,t=e.getContext("2d"),a=window.devicePixelRatio;s.value.height=i.value.clientHeight*a,s.value.width=i.value.clientWidth*a,d=15*a,t.font=`${d}px "Roboto Mono"`,f=Math.floor(e.width/d),v=new Array(f).fill(0),m(),clearInterval(c),c=setInterval(m,50)},g=()=>{const e="qwertyuiopasdfghjklzxcvbnm1234567890";return e[Math.floor(36*Math.random())]},m=()=>{const e=s.value,t=e.getContext("2d");t.fillStyle="rgba(0,0,0,.1)",t.fillRect(0,0,e.width,e.height),t.fillStyle="#6BE445",t.textAlign="left",t.textBaseline="top";for(let a=0;a<f;a++){const o=g(),l=a*d,n=v[a]*d;t.fillText(o,l,n),n>e.height&&Math.random()>.99?v[a]=0:v[a]++}};return a((()=>{h(),window.addEventListener("resize",h)})),o((()=>{clearInterval(c),window.removeEventListener("resize",h)})),(e,t)=>(l(),n("div",{class:"page",ref_key:"page",ref:i},[r("canvas",{ref_key:"canvas",ref:s},null,512)],512))}}),[["__scopeId","data-v-f0ce75fc"]]);export{s as default};