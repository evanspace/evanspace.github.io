import{e as t,i as l,l as e,o,g as a,h as r,n,F as d,r as s,a9 as c,t as p,u,s as f}from"./vendor-2eef8948.js";import{_ as i}from"./index-a4d797ea.js";const _={border:"1",cellspacing:"0"},m={"data-drop":"copy"},v={"data-drop":"copy"},g={"data-drop":"copy"},y={"data-drop":"copy"},h={"data-drop":"copy"},b={"data-drop":"copy"},q={"data-drop":"copy"},$={"data-drop":"copy"},w=i(t({__name:"index",setup(t){const i=l([{name:"语文",color:"#f0578a"},{name:"数学",color:"#59eda2"},{name:"英语",color:"#ed694f"},{name:"政治",color:"orange"},{name:"历史",color:"purple"},{name:"地理",color:"#73dff6"},{name:"生物",color:"olive"},{name:"音乐",color:"#bb7bd9"}]);let w;const D=t=>{var l;t.dataTransfer.effectAllowed=null==(l=t.target.dataset)?void 0:l.effect,w=t.target},A=t=>{t.preventDefault()},T=t=>{L();const l=j(t.target);l&&l.dataset.drop==t.dataTransfer.effectAllowed&&l.classList.add("drop-over")},x=t=>{L();const l=j(t.target);if(l&&l.dataset.drop==t.dataTransfer.effectAllowed)if("copy"==l.dataset.drop){const t=w.cloneNode(!0);l.innerHTML="",t.dataset.effect="move",l.appendChild(t)}else w.remove()},L=()=>{document.querySelectorAll(".drop-over").forEach((t=>{t.classList.remove("drop-over")}))},j=t=>{for(;t;){if(t.dataset&&t.dataset.drop)return t;t=t.parentNode}};return e((()=>{})),(t,l)=>(o(),a("div",{class:n(t.$style.page)},[r("div",{class:n(t.$style.container),onDragstart:D,onDragover:f(A,["prevent"]),onDragenter:T,onDrop:f(x,["prevent"])},[r("div",{class:n(t.$style.left),"data-drop":"move"},[(o(!0),a(d,null,s(u(i),((l,e)=>(o(),a("div",{class:n(t.$style.item),key:e,style:c({background:l.color}),"data-effect":"copy",draggable:!0},p(l.name),7)))),128))],2),r("div",{class:n(t.$style.right)},[r("table",_,[l[2]||(l[2]=r("colgroup",null,[r("col"),r("col"),r("col"),r("col"),r("col"),r("col"),r("col")],-1)),l[3]||(l[3]=r("thead",null,[r("tr",null,[r("th"),r("th",null,"星期一"),r("th",null,"星期二"),r("th",null,"星期三"),r("th",null,"星期四"),r("th",null,"星期五"),r("th",null,"星期六"),r("th",null,"星期日")])],-1)),r("tbody",null,[r("tr",null,[l[0]||(l[0]=r("td",{rowspan:"4"},"上午",-1)),(o(),a(d,null,s(7,(t=>r("td",m))),64))]),r("tr",null,[(o(),a(d,null,s(7,(t=>r("td",v))),64))]),r("tr",null,[(o(),a(d,null,s(7,(t=>r("td",g))),64))]),r("tr",null,[(o(),a(d,null,s(7,(t=>r("td",y))),64))]),r("tr",null,[l[1]||(l[1]=r("td",{rowspan:"4"},"下午",-1)),(o(),a(d,null,s(7,(t=>r("td",h))),64))]),r("tr",null,[(o(),a(d,null,s(7,(t=>r("td",b))),64))]),r("tr",null,[(o(),a(d,null,s(7,(t=>r("td",q))),64))]),r("tr",null,[(o(),a(d,null,s(7,(t=>r("td",$))),64))])])])],2)],34)],2))}}),[["__cssModules",{$style:{page:"_page_1qcno_2",container:"_container_1qcno_7",left:"_left_1qcno_30",right:"_right_1qcno_31",item:"_item_1qcno_38","drop-over":"_drop-over_1qcno_49"}}]]);export{w as default};