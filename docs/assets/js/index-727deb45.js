import{e,i as t,l as a,ad as l,o,g as n,h as i}from"./vendor-fd8a184d.js";import{_ as r}from"./common-ce9ec953.js";const s=r(e({__name:"index",setup(e){const r=t(),s=t();let d,c=0,f=0,v=[];const h=()=>{const e=s.value,t=e.getContext("2d"),a=window.devicePixelRatio;s.value.height=r.value.clientHeight*a,s.value.width=r.value.clientWidth*a,c=15*a,t.font=`${c}px "Roboto Mono"`,f=Math.floor(e.width/c),v=new Array(f).fill(0),u(),clearInterval(d),d=setInterval(u,50)},g=()=>{const e="qwertyuiopasdfghjklzxcvbnm1234567890";return e[Math.floor(36*Math.random())]},u=()=>{const e=s.value,t=e.getContext("2d");t.fillStyle="rgba(0,0,0,.1)",t.fillRect(0,0,e.width,e.height),t.fillStyle="#6BE445",t.textAlign="left",t.textBaseline="top";for(let a=0;a<f;a++){const l=g(),o=a*c,n=v[a]*c;t.fillText(l,o,n),n>e.height&&Math.random()>.99?v[a]=0:v[a]++}};return a((()=>{h(),window.addEventListener("resize",h)})),l((()=>{clearInterval(d),window.removeEventListener("resize",h)})),(e,t)=>(o(),n("div",{class:"page",ref_key:"page",ref:r},[i("canvas",{ref_key:"canvas",ref:s},null,512)],512))}}),[["__scopeId","data-v-f0ce75fc"]]);export{s as default};