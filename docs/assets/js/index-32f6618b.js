var e=Object.defineProperty,s=(s,i,t)=>(((s,i,t)=>{i in s?e(s,i,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[i]=t})(s,"symbol"!=typeof i?i+"":i,t),t);import{cM as i,cN as t,cf as o,b3 as r,bW as n,c1 as h,bv as a,bZ as l,e as d,i as p,l as c,o as m,g,h as b,n as u}from"./vendor-eaf8386d.js";import{T as y,u as f}from"./scene-resize-a0557c92.js";import{_ as w}from"./common-1ec71d92.js";const v={wireframe:!0,helper:!0,intensity:1,skyColor:16777215,groundColor:6406335};class C extends y{constructor(e){super(e),s(this,"hemisphereLight"),s(this,"hemisphereLightHelper"),s(this,"wireframe"),this.addModel()}addModel(){const e=new i(v.skyColor,v.groundColor,v.intensity);e.position.set(0,50,0),this.addObject(e),this.hemisphereLight=e;const s=new t(e,5);s.visible=v.helper,this.addObject(s),this.hemisphereLightHelper=s;const d=new o(10,10),p=new r(d,new n);p.position.set(0,25,0),p.castShadow=!0,this.addObject(p);const c=new h(500,500),m=new r(c,new a({color:16777215}));m.rotation.x=.5*-Math.PI,m.receiveShadow=!0,this.addObject(m),(e=>{const s=new l;s.add(v,"intensity",.1,10).name("光照强度"),s.add(v,"helper").name("辅助器"),s.addColor(v,"skyColor").name("天空光颜色"),s.addColor(v,"groundColor").name("地面光颜色"),s.domElement.style="position: absolute; top: 10px; right: 10px",null==e||e.appendChild(s.domElement)})(this.container)}modelAnimate(){this.hemisphereLight&&(this.hemisphereLight.intensity=v.intensity,this.hemisphereLight.color.set(v.skyColor),this.hemisphereLight.groundColor.set(v.groundColor)),this.hemisphereLightHelper&&(this.hemisphereLightHelper.visible=v.helper,this.hemisphereLightHelper.update())}}const L=w(d({__name:"index",setup(e){const s=p(),i={bgColor:3218751,fog:{visible:!0,color:16777215,near:100,far:500},camera:{position:[0,100,150]},ambientLight:{visible:!1},directionalLight:{helper:!0,light2:!1},grid:{visible:!0}};let t;return c((()=>{i.container=s.value,t=new C(i),t.run(),f(t).resize()})),(e,i)=>(m(),g("div",{class:u([e.$style.page,"h-100 o-h"])},[b("div",{ref_key:"containerRef",ref:s,class:"h-100"},null,512)],2))}}),[["__cssModules",{$style:{page:"_page_12f6y_2"}}]]);export{L as default};