var e=Object.defineProperty,s=(s,t,a)=>(((s,t,a)=>{t in s?e(s,t,{enumerable:!0,configurable:!0,writable:!0,value:a}):s[t]=a})(s,"symbol"!=typeof t?t+"":t,a),a);import{cE as t,bb as a,bp as o,cF as r,b$ as n,bk as i,cG as h,bc as l,b8 as d,cH as c,cI as u,c0 as p,bh as b,be as m,ch as w,ba as y,cJ as M,e as f,i as g,l as v,o as x,g as O,h as R,n as _}from"./vendor-16889df9.js";import{S as j}from"./three-scene.module-24b3c661.js";import{u as A}from"./scene-resize-81793ab7.js";import{_ as I}from"./index-c95106e6.js";let E=new t;E.attributes=["position","normal","color"],E.useGroups=!1;const S={displayBrush:!0,operation:c};class W extends j{constructor(e){super(e),s(this,"brush1"),s(this,"brush2"),s(this,"brushResult"),this.addModel()}addModel(){let e=(()=>{let e=new p;const s=new Float32Array(45e3),t=new Float32Array(45e3),a=new Float32Array(45e3),o=new b,r=500,n=250,i=new m,h=new m,l=new m,d=new m,c=new m;for(let p=0;p<s.length;p+=9){const e=Math.random()*r-n,u=Math.random()*r-n,b=Math.random()*r-n,m=e+80*Math.random()-40,w=u+80*Math.random()-40,y=b+80*Math.random()-40,M=e+Math.random()*r-n,f=u+Math.random()*r-n,g=b+Math.random()*r-n,v=e+Math.random()*r-n,x=u+Math.random()*r-n,O=b+Math.random()*r-n;s[p]=m,s[p+1]=w,s[p+2]=y,s[p+3]=M,s[p+4]=f,s[p+5]=g,s[p+6]=v,s[p+7]=x,s[p+8]=O,i.set(m,w,y),h.set(M,f,g),l.set(v,x,O),d.subVectors(l,h),c.subVectors(i,h),d.cross(c),d.normalize();const R=d.x,_=d.y,j=d.z;t[p]=R,t[p+1]=_,t[p+2]=j,t[p+3]=R,t[p+4]=_,t[p+5]=j,t[p+6]=R,t[p+6]=_,t[p+7]=j;const A=e/r+.5,I=u/r+.5,E=b/r+.5;o.setRGB(A,I,E),a[p]=o.r,a[p+1]=o.g,a[p+2]=o.b,a[p+3]=o.r,a[p+4]=o.g,a[p+5]=o.b,a[p+6]=o.r,a[p+7]=o.g,a[p+8]=o.b}e.setAttribute("position",new w(s,3)),e.setAttribute("normal",new w(t,3)),e.setAttribute("color",new w(a,3));const u=.002;return e.scale(u,u,u),e})(),s=new a({vertexColors:!0,side:o,roughness:.2});this.brush1=new r(e,s),this.brush1.position.y=1,this.brush1.updateMatrixWorld(!0),e=new n,s=new i({color:16777215,transparent:!0,depthWrite:!1,opacity:.1,side:h}),this.brush2=new r(e,s),this.addObject(this.brush2),this.brushResult=new l,this.addObject(this.brushResult);const t=(()=>{const e=new l(new y(5),new M({color:14743546,opacity:.05,depthWrite:!1,transparent:!0}));return e.scale.setScalar(10),e.rotation.x=-Math.PI/2,e.receiveShadow=!0,e})();this.addObject(t),this.createGUI()}createGUI(){var e;const s=new d;s.add(S,"operation",{NONE:-1,HOLLOW_INTERSECTION:c,HOLLOW_SUBTRACTION:u}).name("布尔类型"),s.add(S,"displayBrush").name("计算元素"),s.domElement.style="position: absolute; top: 10px; right: 10px",null==(e=this.container)||e.appendChild(s.domElement)}modelAnimate(){const{brush1:e,brush2:s,brushResult:t}=this;s&&(s.position.y=1*Math.sin(.0025*window.performance.now()*.5)+1,s.position.x=1*Math.sin(.0035*window.performance.now()*.5),s.position.z=1*Math.sin(.002*window.performance.now()*.5),s.visible=S.displayBrush,s.updateMatrixWorld(!0)),t&&e&&s&&t&&(-1===S.operation?(t.geometry.dispose(),t.geometry.copy(null==e?void 0:e.geometry),t.position.y=1):(this.brushResult=E.evaluate(e,s,S.operation,t),this.brushResult.position.y=0,this.brushResult.castShadow=!0))}}const z=I(f({__name:"index",setup(e){const s=g(),t={camera:{position:[0,3,5]},render:{alpha:!0},grid:{visible:!0},axes:{visible:!0}};let a;return v((()=>{t.container=s.value,a=new W(t),a.run(),A(a).resize()})),(e,t)=>(x(),O("div",{class:_([e.$style.page,"h-100 o-h"])},[R("div",{class:"h-100",ref_key:"containerRef",ref:s},null,512)],2))}}),[["__cssModules",{$style:{page:"_page_12f6y_2"}}]]);export{z as default};