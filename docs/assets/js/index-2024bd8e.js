import{e as s,i as a,l as e,o,g as t,h as n,a7 as r,a8 as l,u as c,q as d,p as i,I as u,ah as v}from"./vendor-fd8a184d.js";import{_ as m}from"./005-743a63e1.js";import{_ as p}from"./common-14d39d16.js";const _={class:"page"},f={class:"box"},g={class:"modal"},b=p(s({__name:"index",setup(s){const p=a(!1),b=a(),h=()=>{const s=b.value;s.muted=!0,s.play();const a=new AudioContext,e="running"===a.state;a.close(),e?(p.value=!0,s.muted=!1):p.value=!1},x=()=>{h()};return e((()=>{h(),new IntersectionObserver((s=>{const a=s[0];a.isIntersecting?h():a.target.pause()}),{root:null,threshold:.9}).observe(b.value)})),(s,a)=>{const e=v;return o(),t("div",_,[n("div",f,[r(n("div",g,[d(e,{type:"primary",onClick:x},{default:i((()=>a[0]||(a[0]=[u("打开声音")]))),_:1})],512),[[l,!c(p)]]),n("video",{src:m,ref_key:"video",ref:b,loop:"",controls:""},null,512)]),a[1]||(a[1]=n("div",{class:"bg"},null,-1))])}}}),[["__scopeId","data-v-189a5d76"]]);export{b as default};