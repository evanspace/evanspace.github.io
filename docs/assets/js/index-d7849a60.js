import{e,w as s,i as n,b9 as t,ba as a,bw as o,l as i,ad as l,o as d,g as c,h as r,n as p,bb as m,bc as u,bd as h,b0 as b,bg as v,bf as w,bz as g,bp as E,b2 as _,bh as f,b3 as x,c as y,bH as M,bZ as k}from"./vendor-20ed11f5.js";import{c as $,a as j,b as L,d as C,e as S,l as z}from"./common-7901a1c0.js";import{u as T,b as H,_ as P}from"./common-e92e0709.js";const W={class:"page h-100"},A=P(e({__name:"index",setup(e){const P=T(),A=H();let F;s((()=>P.sidebar.opened),(()=>{clearTimeout(F),F=setTimeout(J,300)}));const N=n(),Z=new t;let q,B,D,G,I,O,R;Z.background=new a("#fff");const J=()=>{const e=N.value;if(!q)return;const s=(null==e?void 0:e.clientWidth)??0,n=(null==e?void 0:e.clientHeight)??0,t=s/n;q.aspect=t,q.updateProjectionMatrix(),B.setSize(s,n),ee&&ee.setSize(s,n)};let K;const Q=()=>{K=requestAnimationFrame(Q),X(),B.render(Z,q)},U=new v;let V;const X=()=>{m(),ee.render(Z,q);const e=U.getElapsedTime();V&&V.position.set(200*Math.sin(e),0,200*Math.cos(e))},Y=n("217");let ee;const se=new o,ne=()=>{const e=new E(50,160,160),s=new _({specular:3355443,shininess:5,map:se.load(`${A.oss}/textures/planets/earth_atmos_2048.jpg`),specularMap:se.load(`${A.oss}/textures/planets/earth_specular_2048.jpg`),normalMap:se.load(`${A.oss}/textures/planets/earth_normal_2048.jpg`),normalScale:new f(.85,.85)}),n=new x(e,s);n.name="earth",Z.add(n);const t=document.createElement("div");t.className="dot",t.innerHTML='\n    <div class="bg"></div>\n    <span class="inner">Earth</span>\n  ',t.style.pointerEvents="auto",t.addEventListener("click",(e=>{y.success("click Earth ！")}));const a=new M(t);a.position.set(0,50,0),n.add(a)},te=()=>{const e=new E(40,160,160),s=new _({shininess:5,map:se.load(`${A.oss}/textures/planets/moon_1024.jpg`)});V=new x(e,s),V.position.set(0,100,0),Z.add(V);const n=document.createElement("div");n.className="dot",n.innerHTML='\n    <div class="bg"></div>\n    <span class="inner">Moon</span>\n  ',n.style.pointerEvents="auto",n.addEventListener("click",(e=>{y.success("click Moon ！")}));const t=new M(n);t.position.set(0,40,0),V.add(t)},ae=()=>{const e=N.value;B=$(e),q=j(e,1,1e6),I=new h(16777215,1.5),Z.add(I),O=S(16777215,1.5),Z.add(O),R=new b(16777215,1.5),R.position.set(-500,800,-500),Z.add(R),D=L(q,B),D.maxPolarAngle=.45*Math.PI,D.screenSpacePanning=!1,G=C(),Z.add(G);let s=new u(50);Z.add(s),(()=>{z(Z,`${A.oss}/img/sky/${Y.value}`),B.shadowMap.enabled=!0,B.shadowMap.type=w;const e=N.value;ee=new g,ee.domElement.style.pointerEvents="none";const s=(null==e?void 0:e.clientWidth)??0,n=(null==e?void 0:e.clientHeight)??0;ee.setSize(s,n),ee.domElement.style.position="absolute",ee.domElement.style.top="0px";const t=N.value;null==t||t.appendChild(ee.domElement),ne(),te()})(),(e=>{const s=new k,n={background:"217",display:()=>{Z.children.forEach((e=>{if(e.isMesh){const s=e.children.find((e=>e.isCSS2DObject));s.visible=!s.visible}}))},earth:()=>{const e=Z.children.find((e=>"earth"==e.name));e?(e.clear(),Z.remove(e)):ne()}};s.add(n,"background").options(["216","217","218","219","220","221","222","223","224","225"]).name("切换背景").onChange((e=>{Y.value=e,z(Z,`${A.oss}/img/sky/${Y.value}`)})),s.add(n,"display").name("隐藏/展示"),s.add(n,"earth").name("删除/添加地球"),s.domElement.style="position: absolute; top: 10px; right: 10px",e.appendChild(s.domElement)})(e)};return i((()=>{ae(),Q(),window.addEventListener("resize",J,!1)})),l((()=>{clearTimeout(F),window.addEventListener("resize",J,!1),cancelAnimationFrame(K);try{Z.clear(),B.dispose(),B.forceContextLoss(),B.content=null;let e=B.domElement.getContext("webgl");e&&e.getExtension("WEBGL_lose_context").loseContext()}catch(e){}})),(e,s)=>(d(),c("div",W,[r("div",{ref_key:"containerRef",ref:N,class:p(e.$style.container)},null,2)]))}}),[["__cssModules",{$style:{container:"_container_1kxrr_2"}}]]);export{A as default};