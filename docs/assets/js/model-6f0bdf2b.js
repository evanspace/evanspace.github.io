import{cm as t,cn as e,cG as o,cH as n,cz as a,cI as s,bo as i,bc as r,bs as c,cJ as l}from"./vendor-4ee42cfe.js";import{d as p}from"./scene-resize-11b2619d.js";import{D as m}from"./config-9a637eb0.js";const x=(t,e,o=1)=>{const n=t.position,a=t.rotation,s=t.scale,i=e.position||{x:0,y:0,z:0},r=e.rotation||{x:0,y:0,z:0},c=e.scale||{x:1,y:1,z:1},l=Math.abs(r.x)<2?1:180,p=Math.abs(r.y)<2?1:180,m=Math.abs(r.z)<2?1:180;return{position:[n.x+i.x,n.y+i.y,n.z+i.z],rotation:[a.x+Math.PI/l*r.x,a.y+Math.PI/p*r.y,a.z+Math.PI/m*r.z],scale:[s.x*o*c.x,s.y*o*c.y,s.z*o*c.z]}},d=t=>{t.material instanceof Array?t.material=t.material.map((t=>t.clone())):t.material=t.material.clone()},h=t=>{let e=t.clone();return(t.isMesh||t.isSprite)&&d(t),e.traverse((t=>{t.isMesh&&d(t)})),e},u=(t,e=6776165,o,n)=>{const{type:a,name:s}=t;a.indexOf("Light"),m.mesh.receiveShadowName.some((t=>s.indexOf(t)>-1))?t.traverse((t=>{t.isMesh&&(t.receiveShadow=!0)})):o.some((t=>s.indexOf(t)>-1))?w(t,e):t.isMesh&&(n&&(t.material.envMap=n),t.castShadow=!0,t.receiveShadow=!0)},y=t=>{let e=[];return Array.isArray(t)?e=t:null!=t&&(e=[t]),e},w=(t,e)=>{t.traverse((t=>{t.isMesh&&(t.castShadow=!0,t.receiveShadow=!0,Array.isArray(t.material)?t.material.forEach((t=>{t.color.set(e)})):t.material.color.set(e))}))},z=(o,n,a)=>(o.lookAt(a),o._lookAt_=a,new Promise((s=>{new t(o.position).to(n,1e3).easing(e.Quadratic.In).start().onUpdate((()=>{o.lookAt(a),o._lookAt_=a})).onComplete((()=>{s(o)}))}))),_=(o,n,a)=>new Promise((s=>{new t(a).to(n,1e3).easing(e.Quadratic.In).start().onUpdate((t=>{o.lookAt(t),o._lookAt_=t})).onComplete((()=>{s(o)}))})),f=(o,n,a,s)=>new Promise((i=>{new t(n.position).to(a,1e3).easing(e.Quadratic.In).start().onUpdate((()=>{const t=o.target;n.lookAt(t),n._lookAt_=t})),new t(o.target).to(s,1e3).easing(e.Quadratic.In).start().onComplete((()=>{i(n)}))})),g=(t,e,s=1,i=10)=>{let r=[0,i/2,i],c=[...e,e[0],e[1]+s,e[2],...e],l=new o("sprite.position",r,c),p=new n("sprite_up_down",i,[l]);const m=new a(t),x=m.clipAction(p);return x.timeScale=5,x.play(),t.__action__=x,t.__mixer__=m,t},A=(t,e,o)=>{let n=t.clientWidth/2,a=t.clientHeight/2,s=e.position.clone();const i=e.scale;s.y+=i.x/2;let r=s.project(o);return{left:r.x*n+n,top:-r.y*a+a}},b=(t,e,o="name")=>{let n=[];if(!t||!t.length)return[];return function t(a){a.forEach((a=>{const s=a[o];"string"==typeof s&&e.some((t=>s.indexOf(t)>-1))&&n.push(a),a.children&&t(a.children)}))}(t),n},S=m.statusOffset,v=(t,e,o={})=>{const n=e.type,a=S[t]||{},s=o[n]||a[n]||{};let i=p({x:0,y:0,z:0},s.position||{}),r=p({x:0,y:0,z:0},s.rotation||{});return r.x=Math.PI/180*r.x,r.y=Math.PI/180*r.y,r.z=Math.PI/180*r.z,{position:i,rotation:r}},M=(t,e,o=16777215,n)=>{const a=v("TEXT",t,n);let c=t.font||{},l=new s(t.name||"",{font:e,size:c.size||10,depth:0,curveSegments:12,bevelThickness:1,bevelSize:.1,bevelEnabled:!0});const p=a.rotation;l.rotateX(p.x),l.rotateY(p.y),l.rotateZ(p.z);const m=a.position;l.computeBoundingBox(),l.computeVertexNormals();let x=.5*(l.boundingBox.max.x-l.boundingBox.min.x),d=.5*(l.boundingBox.max.z-l.boundingBox.min.z),h=new i({color:null!=c.color?c.color:o,flatShading:!1}),u=new r(l,h);return u.castShadow=!0,u.position.set((m.x||0)-x,m.y||0,(m.z||0)-d),u.name="text",u._isText_=!0,u},I=(t,e,s,i,r=100,p=1)=>{if(!s)return;const m=v("WARNING",e,i);let x=new c,d=h(s);d.scale.set(p,p,p);const u=m.position;d.position.set(u.x,u.y,u.z);const y=m.rotation;d.rotation.set(y.x,y.y,y.z),x.add(d);let w=new l(12717056,8,r,0);w.name="灯光",w.position.y=u.y+30,x.add(w),x.name=t;let z=new a(x),_=new o("红色.material.color",[0,.25,.75],[1,0,0,1,1,0,1,0,0]),f=new o("灯光.color",[0,.25,.75],[1,0,0,1,1,0,1,0,0]),g=new o("警告标识.scale",[0,.5,1],[1,1,1,1.2,1.2,2,1,1,1]),A=new n("warning_",1,[_,f,g]),b=z.clipAction(A);return b.paused=!0,b.play(),x.visible=!1,x._isWarning_=!0,{group:x,action:b,mixer:z}},k=(t,e,o,n)=>{if(!e)return;const a=v(n?"DISABLED":"STATUS",t,o);let s=h(e);const i=a.position;s.position.set(i.x,i.y,i.z);const r=a.rotation;return s.rotation.set(r.x,r.y,r.z),s.visible=!1,s._isStatus_=!0,s};export{A as a,x as b,z as c,h as d,M as e,b as f,y as g,I as h,k as i,g as j,_ as k,f as l,u as r,w as s};