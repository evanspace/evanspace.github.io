import{c as e,i as t,l as a,o as s,f as n,g as o}from"./vendor-828bb737.js";const l=e({__name:"index",setup(e){const l=t(),i=t(),r=e=>{const t=document.createElement("div");t.classList.add("ripple"),t.style.left=`${e.offsetX}px`,t.style.top=`${e.offsetY}px`,l.value.appendChild(t),t.addEventListener("animationend",(e=>{t.remove()})),f(e.offsetX,e.offsetY)},f=(e,t)=>{const a=i.value,s=l.value.getBoundingClientRect(),n=a.getBoundingClientRect(),o=n.width/2+n.left-s.left,r=n.height/2+n.top-s.top,f=180*Math.atan2(t-r,e-o)/Math.PI;a.getAnimations().forEach((e=>e.cancel())),a.animate([{transform:`translate(${o}px, ${r}px) rotate(${f}deg)`,easing:"ease-out"},{transform:`translate(${o}px, ${r}px) rotate(${f}deg) scaleX(1.5)`,offset:.6},{transform:`translate(${e}px, ${t}px) rotate(${f}deg) scaleX(1.5)`,offset:.8,easing:"ease-in"},{transform:`translate(${e}px, ${t}px) rotate(${f}deg)`}],{duration:800,fill:"forwards"})};return a((()=>{const e=l.value,t=e.clientWidth,a=e.clientHeight;f(t/2,a/2)})),(e,t)=>(s(),n("div",{class:"page js-animation-api",ref_key:"pageRef",ref:l,onClick:r},[o("div",{class:"ball",ref_key:"ballRef",ref:i},null,512)],512))}});export{l as default};