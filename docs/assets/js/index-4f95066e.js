import{e,i as t,l as a,ad as l,o,g as n,h as i}from"./vendor-eaf8386d.js";import{_ as r}from"./common-1ec71d92.js";const s=r(e({__name:"index",setup(e){const r=t(),s=t();let d,c=0,v=0,f=[];const h=()=>{const e=s.value,t=e.getContext("2d"),a=window.devicePixelRatio;s.value.height=r.value.clientHeight*a,s.value.width=r.value.clientWidth*a,c=15*a,t.font=`${c}px "Roboto Mono"`,v=Math.floor(e.width/c),f=new Array(v).fill(0),u(),clearInterval(d),d=setInterval(u,50)},g=()=>{const e="qwertyuiopasdfghjklzxcvbnm1234567890`!@#$%^&*()_+-[]|";return e[Math.floor(53*Math.random())]},u=()=>{const e=s.value,t=e.getContext("2d");t.fillStyle="rgba(0,0,0,.1)",t.fillRect(0,0,e.width,e.height),t.fillStyle="#6BE445",t.textAlign="left",t.textBaseline="top";for(let a=0;a<v;a++){const l=g(),o=a*c,n=f[a]*c;t.fillText(l,o,n),n>e.height&&Math.random()>.99?f[a]=0:f[a]++}};return a((()=>{h(),window.addEventListener("resize",h)})),l((()=>{clearInterval(d),window.removeEventListener("resize",h)})),(e,t)=>(o(),n("div",{class:"page",ref_key:"page",ref:r},[i("canvas",{ref_key:"canvas",ref:s},null,512)],512))}}),[["__scopeId","data-v-e0998d68"]]);export{s as default};