var e=Object.defineProperty,s=(s,a,t)=>(((s,a,t)=>{a in s?e(s,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[a]=t})(s,"symbol"!=typeof a?a+"":a,t),t);import{bX as a,bc as t,bd as o,bk as r,ba as i,c1 as n,bp as l,c5 as d,ce as c,bb as h,bY as p,bl as u,b8 as f,c7 as m,c4 as w,e as b,i as y,l as v,o as g,g as O,h as x,n as S}from"./vendor-a6dc29a3.js";import{T as _,u as j}from"./scene-resize-24d4948c.js";import{_ as I}from"./index-574215cd.js";const M={operation:d,useGroups:!0,wireframe:!1};let G;class T extends _{constructor(e){super(e),s(this,"evaluator"),s(this,"baseBrush"),s(this,"brush"),s(this,"wireframe"),this.evaluator=new a,this.baseBrush=(()=>{const e=new c(20,3),s=new h({flatShading:!0,polygonOffset:!0,polygonOffsetUnits:1,polygonOffsetFactor:1});return new p(e,s)})(),this.brush=(()=>{const e=new u(10,10,50,45,1),s=new h({flatShading:!0,color:16750592,emissive:16750592,emissiveIntensity:.35,polygonOffset:!0,polygonOffsetUnits:10,polygonOffsetFactor:10});return new p(e,s)})(),this.wireframe=new t(new o(1,1,1),new r({color:38536,wireframe:!0})),this.addModel()}initModel(){const e=new t(new i(1e3,1e3),new n({color:16442329,transparent:!0,opacity:.35,side:l}));e.rotation.x=-Math.PI/2,e.scale.setScalar(10),e.receiveShadow=!0,this.addObject(e),(e=>{const s=new f;s.add(M,"operation",{SUBTRACTION:d,INTERSECTION:m,ADDITION:w}).name("布尔类型"),s.add(M,"wireframe").name("线框材质"),s.add(M,"useGroups").name("使用组合"),s.domElement.style="position: absolute; top: 10px; right: 10px",null==e||e.appendChild(s.domElement)})(this.container)}addModel(){const e=this.wireframe;e.position.set(0,50,0),this.addObject(e)}updateCSG(){this.evaluator.useGroups=M.useGroups,G=this.evaluator.evaluate(this.baseBrush,this.brush,M.operation,G),G.castShadow=!0,G.position.set(0,50,0),G.receiveShadow=!0,this.addObject(G)}modelAnimate(){const e=window.performance.now()+9e3,s=this.brush;s.rotation.x=-2e-4*e,s.rotation.y=-5e-4*e,s.rotation.z=-.001*e;const a=.5+.5*(1+Math.sin(.001*e));s.scale.set(a,1,a),s.updateMatrixWorld(),this.updateCSG(),this.wireframe.geometry=G.geometry,this.wireframe.visible=M.wireframe}}const C=I(b({__name:"index",setup(e){const s=y(),a={camera:{position:[0,100,260]},render:{alpha:!0},grid:{visible:!0},axes:{visible:!0}};let t;return v((()=>{a.container=s.value,t=new T(a),t.run(),j(t).resize()})),(e,a)=>(g(),O("div",{class:S([e.$style.page,"h-100 o-h"])},[x("div",{ref_key:"containerRef",ref:s,class:"h-100"},null,512)],2))}}),[["__cssModules",{$style:{page:"_page_12f6y_2"}}]]);export{C as default};