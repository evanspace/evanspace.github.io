var e=Object.defineProperty,s=(s,i,t)=>(((s,i,t)=>{i in s?e(s,i,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[i]=t})(s,"symbol"!=typeof i?i+"":i,t),t);import{cx as i,cy as t,bz as o,bc as r,b6 as n,bk as h,bV as a,bd as l,e as d,i as p,l as c,o as m,g,h as b,n as u}from"./vendor-2eef8948.js";import{T as y,u as f}from"./scene-resize-75078a75.js";import{_ as w}from"./index-a4d797ea.js";const C={wireframe:!0,helper:!0,intensity:1,skyColor:16777215,groundColor:6406335};class L extends y{constructor(e){super(e),s(this,"hemisphereLight"),s(this,"hemisphereLightHelper"),s(this,"wireframe"),this.addModel()}addModel(){const e=new i(C.skyColor,C.groundColor,C.intensity);e.position.set(0,50,0),this.addObject(e),this.hemisphereLight=e;const s=new t(e,5);s.visible=C.helper,this.addObject(s),this.hemisphereLightHelper=s;const d=new o(10,10),p=new r(d,new n);p.position.set(0,25,0),p.castShadow=!0,this.addObject(p);const c=new h(500,500),m=new r(c,new a({color:16777215}));m.rotation.x=.5*-Math.PI,m.receiveShadow=!0,this.addObject(m),(e=>{const s=new l;s.add(C,"intensity",.1,10).name("光照强度"),s.add(C,"helper").name("辅助器"),s.addColor(C,"skyColor").name("天空光颜色"),s.addColor(C,"groundColor").name("地面光颜色"),s.domElement.style="position: absolute; top: 10px; right: 10px",null==e||e.appendChild(s.domElement)})(this.container)}modelAnimate(){this.hemisphereLight&&(this.hemisphereLight.intensity=C.intensity,this.hemisphereLight.color.set(C.skyColor),this.hemisphereLight.groundColor.set(C.groundColor)),this.hemisphereLightHelper&&(this.hemisphereLightHelper.visible=C.helper,this.hemisphereLightHelper.update())}}const v=w(d({__name:"index",setup(e){const s=p(),i={bgColor:3218751,fog:{visible:!0,color:16777215,near:100,far:500},camera:{position:[0,100,150]},ambientLight:{visible:!1},directionalLight:{helper:!0,light2:!1},grid:{visible:!0}};let t;return c((()=>{i.container=s.value,t=new L(i),t.run(),f(t).resize()})),(e,i)=>(m(),g("div",{class:u([e.$style.page,"h-100 o-h"])},[b("div",{ref_key:"containerRef",ref:s,class:"h-100"},null,512)],2))}}),[["__cssModules",{$style:{page:"_page_12f6y_2"}}]]);export{v as default};