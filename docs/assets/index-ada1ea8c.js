import{c as e,w as s,i as n,b4 as t,b5 as a,b6 as o,l as i,ae as l,o as d,f as c,g as r,n as p,b7 as m,b8 as u,b9 as h,ba as b,bb as v,bc as w,bd as g,be as E,bf as f,bg as _,bh as x,aK as y,bi as M,bj as k}from"./vendor-828bb737.js";import{c as j,a as $,b as L,d as C,e as S,l as T}from"./common-c87e5003.js";import{u as z,h as H,_ as P}from"./common-404c9468.js";const A={class:"page h-100"},W=P(e({__name:"index",setup(e){const P=z(),W=H();let F;s((()=>P.sidebar.opened),(()=>{clearTimeout(F),F=setTimeout(J,300)}));const I=n(),K=new t;let N,q,B,D,G,O,R;K.background=new a("#fff");const J=()=>{const e=I.value;if(!N)return;const s=(null==e?void 0:e.clientWidth)??0,n=(null==e?void 0:e.clientHeight)??0,t=s/n;N.aspect=t,N.updateProjectionMatrix(),q.setSize(s,n),ee&&ee.setSize(s,n)};let Q;const U=()=>{Q=requestAnimationFrame(U),Y(),q.render(K,N)},V=new v;let X;const Y=()=>{m(),ee.render(K,N);const e=V.getElapsedTime();X&&X.position.set(200*Math.sin(e),0,200*Math.cos(e))},Z=n("217");let ee;const se=new o,ne=()=>{const e=new E(50,160,160),s=new f({specular:3355443,shininess:5,map:se.load(`${W.oss}/textures/planets/earth_atmos_2048.jpg`),specularMap:se.load(`${W.oss}/textures/planets/earth_specular_2048.jpg`),normalMap:se.load(`${W.oss}/textures/planets/earth_normal_2048.jpg`),normalScale:new _(.85,.85)}),n=new x(e,s);n.name="earth",K.add(n);const t=document.createElement("div");t.className="dot",t.innerHTML='\n    <div class="bg"></div>\n    <span class="inner">Earth</span>\n  ',t.style.pointerEvents="auto",t.addEventListener("click",(e=>{y.success("click Earth ！")}));const a=new M(t);a.position.set(0,50,0),n.add(a)},te=()=>{const e=new E(40,160,160),s=new f({shininess:5,map:se.load(`${W.oss}/textures/planets/moon_1024.jpg`)});X=new x(e,s),X.position.set(0,100,0),K.add(X);const n=document.createElement("div");n.className="dot",n.innerHTML='\n    <div class="bg"></div>\n    <span class="inner">Moon</span>\n  ',n.style.pointerEvents="auto",n.addEventListener("click",(e=>{y.success("click Moon ！")}));const t=new M(n);t.position.set(0,40,0),X.add(t)},ae=()=>{const e=I.value;q=j(e),N=$(e,1,1e6),G=new h(16777215,1.5),K.add(G),O=S(16777215,1.5),K.add(O),R=new b(16777215,1.5),R.position.set(-500,800,-500),K.add(R),B=L(N,q),B.maxPolarAngle=.45*Math.PI,B.screenSpacePanning=!1,D=C(),K.add(D);let s=new u(50);K.add(s),(()=>{T(K,`${W.oss}/img/sky/${Z.value}`),q.shadowMap.enabled=!0,q.shadowMap.type=w;const e=I.value;ee=new g,ee.domElement.style.pointerEvents="none";const s=(null==e?void 0:e.clientWidth)??0,n=(null==e?void 0:e.clientHeight)??0;ee.setSize(s,n),ee.domElement.style.position="absolute",ee.domElement.style.top="0px";const t=I.value;null==t||t.appendChild(ee.domElement),ne(),te()})(),(e=>{const s=new k,n={background:"217",display:()=>{K.children.forEach((e=>{if(e.isMesh){const s=e.children.find((e=>e.isCSS2DObject));s.visible=!s.visible}}))},earth:()=>{const e=K.children.find((e=>"earth"==e.name));e?(e.clear(),K.remove(e)):ne()}};s.add(n,"background").options(["216","217","218","219","220","221","222","223","224","225"]).name("切换背景").onChange((e=>{Z.value=e,T(K,`${W.oss}/img/sky/${Z.value}`)})),s.add(n,"display").name("隐藏/展示"),s.add(n,"earth").name("删除/添加地球"),s.domElement.style="position: absolute; top: 10px; right: 10px",e.appendChild(s.domElement)})(e)};return i((()=>{ae(),U(),window.addEventListener("resize",J,!1)})),l((()=>{clearTimeout(F),window.addEventListener("resize",J,!1),cancelAnimationFrame(Q);try{K.clear(),q.dispose(),q.forceContextLoss(),q.content=null;let e=q.domElement.getContext("webgl");e&&e.getExtension("WEBGL_lose_context").loseContext()}catch(e){}})),(e,s)=>(d(),c("div",A,[r("div",{ref_key:"containerRef",ref:I,class:p(e.$style.container)},null,2)]))}}),[["__cssModules",{$style:{container:"_container_1kxrr_2"}}]]);export{W as default};