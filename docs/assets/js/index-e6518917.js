var e=Object.defineProperty,s=(s,a,t)=>(((s,a,t)=>{a in s?e(s,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[a]=t})(s,"symbol"!=typeof a?a+"":a,t),t);import{b6 as a,b7 as t,b5 as r,bc as o,bk as n,bl as i,bm as l,bg as u,ba as h,bn as p,bo as d,bd as c,bp as m,bq as b,br as f,bs as w,bf as y,be as g,bt as O,bu as S,bv as v,bi as G,b8 as x,b9 as B,bw as C,bx as R,e as E,i as I,l as M,o as _,g as T,h as N,n as W}from"./vendor-8986b6ad.js";import{T as j,u as A}from"./scene-resize-6ab2e993.js";import{_ as U}from"./index-c2ca0eee.js";const z={glb:"/oss/model/csg/bunny.glb",operation:m,wireframe:!1,displayBrushes:!1,shadows:!0,useGroups:!0,consolidateGroups:!0},F=new Map,D=new a({opacity:.15,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:.1,polygonOffsetUnits:.1,side:t,premultipliedAlpha:!0,roughness:.25,color:5099745}),L=50;let k=new r;k.attributes=["position","normal"],k.useGroups=!1;class H extends j{constructor(e){super(e),s(this,"bunnyBrush"),s(this,"brushResult"),s(this,"wireframeResult"),s(this,"brushes"),s(this,"surfaceSampler"),this.brushes=[],this.addModel()}initModel(){const e=new o(new n(1e3,1e3),new i({color:16442329,transparent:!0,opacity:.35,side:t}));e.rotation.x=-Math.PI/2,e.scale.setScalar(10),e.receiveShadow=!0,this.addObject(e)}async addModel(){const e=await(async()=>{const e=(await(new O).setMeshoptDecoder(S).loadAsync(z.glb)).scene.children[0];e.updateMatrixWorld();const s=e.geometry.clone(),r=new v,o=new G(0,0,0),n=new C,i=new R,l=new G(L,L,L);n.setFromEuler(i),r.compose(o,n,l),s.applyMatrix4(r),s.computeVertexNormals();const u=new x(s,new a);return u.updateMatrixWorld(),u.castShadow=!0,u.name="兔子",u.material.opacity=.15,u.material.transparent=!0,u.material.depthWrite=!1,u.material.polygonOffset=!0,u.material.polygonOffsetFactor=.1,u.material.polygonOffsetUnits=.1,u.material.side=t,u.material.premultipliedAlpha=!0,u.material.color.set(14743546),u})();this.bunnyBrush=e,this.addObject(e);const s=new l(e);s.build(),this.surfaceSampler=s;const{brushes:r,material:n}=(e=>{let s=[];for(let a=0;a<50;a++){const a=new x(new B(50,15,15),D);a.receiveShadow=!0,e.add(a),s.push(a)}return{brushes:s,material:D}})(this.scene);let i;this.brushes=r,i=e.material.clone(),i.opacity=1,i.transparent=!1,i.depthWrite=!0,F.set(e.material,i),i=n.clone(),i.opacity=1,i.transparent=!1,i.depthWrite=!0,F.set(n,i);const p=new o(new u,new a({roughness:.1,flatShading:!1,polygonOffset:!0,polygonOffsetUnits:L,polygonOffsetFactor:L}));p.castShadow=!0,p.receiveShadow=!0,this.brushResult=p,this.addObject(p);const d=new o(p.geometry,new h({wireframe:!0,color:0,opacity:.15,transparent:!0}));d.material.color.set(5398),this.wireframeResult=d,this.addObject(d),this.randomizeBrushes(),this.updateCSG(),this.createGUI()}randomizeBrushes(){const e=this.surfaceSampler;if(!e)return;const s=this.brushes,a=this.bunnyBrush;for(let t=0;t<s.length;t++){const r=s[t];e.sample(r.position),r.position.applyMatrix4(a.matrixWorld),r.scale.setScalar(p.lerp(.05,.15,Math.random())),r.updateMatrixWorld()}}updateCSG(){const{brushes:e,bunnyBrush:s,brushResult:a}=this;let t=e[0];k.useGroups=z.useGroups,k.consolidateGroups=z.consolidateGroups;for(let r=1,o=e.length;r<o;r++){const s=e[r];t=k.evaluate(t,s,d),t.material=D}k.evaluate(s,t,z.operation,a),a.material=z.useGroups?a.material.map((e=>F.get(e))):F.get(s.material)}createGUI(){var e;const s=new c;s.add(z,"operation",{ADDITION:d,SUBTRACTION:m,REVERSE_SUBTRACTION:b,INTERSECTION:f,DIFFERENCE:w,HOLLOW_SUBTRACTION:y,HOLLOW_INTERSECTION:g}).name("布尔类型").onChange((()=>{this.updateCSG()})),s.add(z,"wireframe").name("线框材质"),s.add(z,"displayBrushes").name("计算元素"),s.add(z,"useGroups").name("使用组合").onChange((()=>{this.updateCSG()})),s.add(z,"consolidateGroups").name("合并组").onChange((()=>{this.updateCSG()})),s.add({randomize:()=>{this.randomizeBrushes(),this.updateCSG()}},"randomize").name("随机更新"),s.domElement.style="position: absolute; top: 10px; right: 10px",null==(e=this.container)||e.appendChild(s.domElement)}modelAnimate(){this.bunnyBrush&&(this.bunnyBrush.visible=z.displayBrushes),this.brushes.length&&this.brushes.forEach((e=>e.visible=z.displayBrushes)),this.wireframeResult&&(this.wireframeResult.visible=z.wireframe)}}const P=U(E({__name:"index",setup(e){const s=I(),a={camera:{position:[0,80,300]},grid:{visible:!0},axes:{visible:!0}};let t;return M((()=>{a.container=s.value,t=new H(a),t.run(),A(t).resize()})),(e,a)=>(_(),T("div",{class:W([e.$style.page,"h-100 o-h"])},[N("div",{ref_key:"containerRef",ref:s,class:"h-100"},null,512)],2))}}),[["__cssModules",{$style:{page:"_page_12f6y_2"}}]]);export{P as default};