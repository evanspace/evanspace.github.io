import{e as s,Y as a,o,g as l,h as e,a9 as r,u as t,a7 as d,a8 as n}from"./vendor-4ee42cfe.js";import{_ as p}from"./index-0c9e2fa0.js";const x={class:"page"},f={class:"wrap"},i={class:"lamp"},m=p(s({__name:"index",setup(s){const p=a({lx:0,ly:0,rx:0,ry:0,showLamp:!1}),m=[-10,10],u=(s,a,o)=>s/a*(o[1]-o[0])+o[0],c=s=>{const{offsetX:a,offsetY:o}=s;p.lx=a,p.ly=o,p.showLamp=!0;const l=s.target,e=null==l?void 0:l.offsetWidth,r=null==l?void 0:l.offsetHeight,t=u(o,r,m),d=-u(a,e,m);p.rx=t,p.ry=d},v=s=>{p.showLamp=!1,p.rx=0,p.ry=0};return(s,a)=>(o(),l("div",x,[e("div",f,[a[1]||(a[1]=e("h3",null,"X、Y旋转",-1)),e("div",{class:"card",style:r({"--lx":t(p).lx+"px","--ly":t(p).ly+"px","--rx":t(p).rx+"deg","--ry":t(p).ry+"deg","--s":t(p).showLamp?"0s":".2s"}),onMousemove:c,onMouseleave:v},[a[0]||(a[0]=e("p",null,"Hello world!",-1)),d(e("div",i,null,512),[[n,t(p).showLamp]])],36)])]))}}),[["__scopeId","data-v-9af06112"]]);export{m as default};