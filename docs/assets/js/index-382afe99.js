import{e as s,i as a,l as e,o,g as t,h as n,a8 as l,a9 as r,u as d,q as u,p as c,I as i,al as v,_ as p}from"./vendor-509147fa.js";import{_ as m}from"./005-743a63e1.js";const _={class:"page"},f={class:"box"},g={class:"modal"},b=p(s({__name:"index",setup(s){const p=a(!1),b=a(),x=()=>{const s=b.value;s.muted=!0,s.play();const a=new AudioContext,e="running"===a.state;a.close(),e?(p.value=!0,s.muted=!1):p.value=!1},y=()=>{x()};return e((()=>{x(),new IntersectionObserver((s=>{const a=s[0];a.isIntersecting?x():a.target.pause()}),{root:null,threshold:.9}).observe(b.value)})),(s,a)=>{const e=v;return o(),t("div",_,[n("div",f,[l(n("div",g,[u(e,{type:"primary",onClick:y},{default:c((()=>a[0]||(a[0]=[i("打开声音")]))),_:1})],512),[[r,!d(p)]]),n("video",{src:m,ref_key:"video",ref:b,loop:"",controls:""},null,512)]),a[1]||(a[1]=n("div",{class:"bg"},null,-1))])}}}),[["__scopeId","data-v-189a5d76"]]);export{b as default};