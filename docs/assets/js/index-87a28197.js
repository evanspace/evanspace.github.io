import{e,i as a,ag as t,o,g as s,h as n,q as r,p as l,F as u,r as c,m as i,I as h,t as m,u as d,C as f,a8 as v,a9 as p,aB as k,aC as g}from"./vendor-509147fa.js";import{_ as y}from"./005-743a63e1.js";const M={class:"page"},w={style:{padding:"20px"}},T={style:{padding:"20px 0"}},b=e({__name:"index",setup(e){const b=a([{key:"Moon",name:"月亮脸"},{key:"Clock",name:"时钟"},{key:"Boy",name:"小男孩"},{key:"Earth",name:"地球转动"},{key:"Wave",name:"波浪"},{key:"Flex",name:"伸缩"},{key:"Progress",name:"进度"}]),C=a(""),_=a([]);let x;const D=e=>{switch(clearTimeout(x),_.value=[],e){case"Moon":E();break;case"Clock":B();break;case"Boy":F();break;case"Earth":P();break;case"Wave":S();break;case"Flex":V();break;case"Progress":H()}},j=e=>{_.value=e;const a=window.location.href,t="HASH_ANIM="+e.join(""),o=a.split("?")[0]+"?"+t;window.history.pushState(null,"",o)},E=()=>{const e=["🌑","🌒","🌓","🌔","🌝","🌖","🌗","🌘"],a=e.length;_.value=[];const t=()=>{const o=Math.floor(Date.now()/100%a);j([e[o]]),x=setTimeout(t,100)};t()},B=()=>{const e=["🕐","🕑","🕒","🕓","🕔","🕕","🕖","🕗","🕘","🕙","🕚","🕛"],a=e.length;_.value=[];const t=()=>{const o=Math.floor(Date.now()/100%a);j([e[o]]),x=setTimeout(t,100)};t()},F=()=>{const e=["🏻","🏼","🏽","🏾","🏿"],a=()=>{let t,o;_.value=[];let s=[];for(t=0;t<10;t++){o=Math.floor(e.length*((Math.sin(Date.now()/100+t)+1)/2));const a="👶"+e[o];s.push(a)}j(s),x=setTimeout(a,100)};a()},P=()=>{let e=["🌑","🌘","🌗","🌖","🌕","🌔","🌓","🌒"],a=[0,0,0,0,0,0,0,0,0,0],t=0;const o=()=>{let s=[],n=0;if(_.value=[],t){for(;0==a[n];)n++;n>=a.length?t=0:(a[n]++,8==a[n]&&(a[n]=0))}else{for(;4==a[n];)n++;n>=a.length?t=1:a[n]++}a.forEach((a=>{s.push(e[a])})),j(s),x=setTimeout(o,100)};o()},S=()=>{const e=()=>{let a,t,o=[];for(_.value=[],a=0;a<10;a++){t=Math.floor(4*Math.sin(Date.now()/200+a/2))+4;const e=String.fromCharCode(9601+t);o.push(e)}j(o),x=setTimeout(e,100)};e()},V=()=>{const e=()=>{let a,t=[];for(_.value=[],a=Math.floor((Math.sin(Date.now()/300)+1)/2*100);a>=8;)t.push("█"),a-=8;const o=["⠀","▏","▎","▍","▌","▋","▊","▉"][a];t.push(o),j(t),x=setTimeout(e,100)};e()},A=a(),H=()=>{const e=A.value,a=e=>{const a=Math.floor(e/60);return e=Math.floor(e-60*a),("0"+a).substring(-2)+":"+("0"+e).substring(-2)},t=()=>{var t,o="",s=Math.floor(e.currentTime/e.duration*14);for(t=0;t<15;t++)o+=t==s?"◯":t<s?"─":"┄";const n=["╭",o,"╮",a(e.currentTime),"╱",a(e.duration)];j(n)};t(),e.addEventListener("timeupdate",t)};return t((()=>{clearTimeout(x)})),(e,a)=>{const t=k,x=g;return o(),s("div",M,[n("div",w,[r(x,{modelValue:d(C),"onUpdate:modelValue":a[0]||(a[0]=e=>f(C)?C.value=e:null),onChange:D},{default:l((()=>[(o(!0),s(u,null,c(d(b),((e,a)=>(o(),i(t,{value:e.key,key:a},{default:l((()=>[h(m(e.name),1)])),_:2},1032,["value"])))),128))])),_:1},8,["modelValue"]),n("div",T,m(d(_).join("")),1),v(n("video",{src:y,ref_key:"video",ref:A,controls:""},null,512),[[p,"Progress"==d(C)]])])])}}});export{b as default};