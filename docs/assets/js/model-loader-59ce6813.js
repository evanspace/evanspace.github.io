import{bJ as e,bM as t,c9 as o,ca as a,co as n,bK as s,bc as r,bO as i,cp as l,cg as c,cq as d,cr as m,Y as p,cs as u,bt as h,ct as b,bu as w,bC as x,bP as y,bV as f,b7 as g,cu as v,cv as z,cw as M,cx as S}from"./vendor-7f6cb255.js";import{d as B,g as D}from"./scene-resize-a9ec2e62.js";import{D as P}from"./background-abedecce.js";const E=()=>({initCSS2DRender:(t,o)=>{const{width:a,height:n}=t,s=new e;return s.setSize(a,n),s.domElement.style.position="absolute",s.domElement.style.left="0px",s.domElement.style.top="0px",s.domElement.style.pointerEvents="none",o.appendChild(s.domElement),s},createCSS2DDom:e=>{const{name:o,className:a="",onClick:n,position:s}=e,r=document.createElement("div");r.innerHTML=o,r.className=a;const i=new t(r);return r.style.pointerEvents=n?"auto":"none",r.style.position="absolute","function"==typeof n&&r.addEventListener("click",n),s&&i.position.set(...s),i}}),N=(e,t,o=1)=>{const a=e.position,n=e.rotation,s=e.scale,r=t.position||{x:0,y:0,z:0},i=t.rotation||{x:0,y:0,z:0},l=t.scale||{x:1,y:1,z:1},c=Math.abs(i.x)<2?1:180,d=Math.abs(i.y)<2?1:180,m=Math.abs(i.z)<2?1:180;return{position:[a.x+r.x,a.y+r.y,a.z+r.z],rotation:[n.x+Math.PI/c*i.x,n.y+Math.PI/d*i.y,n.z+Math.PI/m*i.z],scale:[s.x*o*l.x,s.y*o*l.y,s.z*o*l.z]}},k=e=>{e.material instanceof Array?e.material=e.material.map((e=>e.clone())):e.material=e.material.clone()},_=e=>{let t=e.clone();return(e.isMesh||e.isSprite)&&k(e),t.traverse((e=>{e.isMesh&&k(e)})),t},A=e=>{let t=[];return Array.isArray(e)?t=e:null!=e&&(t=[e]),t},T=(e,t)=>{e.traverse((e=>{e.isMesh&&(Array.isArray(e.material)?e.material.forEach((e=>{e.color.set(t)})):e.material.color.set(t))}))},L=(e,t,n)=>(e.lookAt(n),e._lookAt_=n,new Promise((s=>{new o(e.position).to(t,1e3).easing(a.Quadratic.In).start().onUpdate((()=>{e.lookAt(n),e._lookAt_=n})).onComplete((()=>{s(e)}))}))),O=(e,t,o)=>{let a=e.clientWidth/2,n=e.clientHeight/2,s=t.position.clone();const r=t.scale;s.y+=r.x/2;let i=s.project(o);return{left:i.x*a+a,top:-i.y*n+n}},U=(e,t,o="name")=>{let a=[];if(!e||!e.length)return[];return function e(n){n.forEach((n=>{const s=n[o];"string"==typeof s&&t.some((e=>s.indexOf(e)>-1))&&a.push(n),n.children&&e(n.children)}))}(e),a},j=P.statusOffset,C=(e,t,o={})=>{const a=t.type,n=j[e]||{},s=o[a]||n[a]||{};let r=B({x:0,y:0,z:0},s.position||{}),i=B({x:0,y:0,z:0},s.rotation||{});return i.x=Math.PI/180*i.x,i.y=Math.PI/180*i.y,i.z=Math.PI/180*i.z,{position:r,rotation:i}},I=(e,t,o=16777215,a)=>{const i=C("TEXT",e,a);let l=e.font||{},c=new n(e.name||"",{font:t,size:l.size||10,depth:0,curveSegments:12,bevelThickness:1,bevelSize:.1,bevelEnabled:!0});const d=i.rotation;c.rotateX(d.x),c.rotateY(d.y),c.rotateZ(d.z);const m=i.position;c.computeBoundingBox(),c.computeVertexNormals();let p=.5*(c.boundingBox.max.x-c.boundingBox.min.x),u=.5*(c.boundingBox.max.z-c.boundingBox.min.z),h=new s({color:null!=l.color?l.color:o,flatShading:!1}),b=new r(c,h);return b.castShadow=!0,b.position.set((m.x||0)-p,m.y||0,(m.z||0)-u),b.name="text",b._isText_=!0,b},K=(e,t,o,a,n=100,s=1)=>{if(!o)return;const r=C("WARNING",t,a);let p=new i,u=_(o);u.scale.set(s,s,s);const h=r.position;u.position.set(h.x,h.y,h.z);const b=r.rotation;u.rotation.set(b.x,b.y,b.z),p.add(u);let w=new l(12717056,8,n,0);w.name="灯光",w.position.y=h.y+30,p.add(w),p.name=e;let x=new c(p),y=new d("红色.material.color",[0,.25,.75],[1,0,0,1,1,0,1,0,0]),f=new d("灯光.color",[0,.25,.75],[1,0,0,1,1,0,1,0,0]),g=new d("警告标识.scale",[0,.5,1],[1,1,1,1.2,1.2,2,1,1,1]),v=new m("warning_",1,[y,f,g]),z=x.clipAction(v);return z.paused=!0,z.play(),p.visible=!1,p._isWarning_=!0,{group:p,action:z,mixer:x}},R=(e,t,o,a)=>{if(!t)return;const n=C(a?"DISABLED":"STATUS",e,o);let s=_(t);const r=n.position;s.position.set(r.x,r.y,r.z);const i=n.rotation;return s.rotation.set(i.x,i.y,i.z),s.visible=!1,s._isStatus_=!0,s},H=e=>new Promise((t=>{const o=window.indexedDB.deleteDatabase(e);o.onsuccess=e=>{t(!0)},o.onerror=e=>{t(!1)}})),W=async(e,t="THREE__MODEL_DB",o=1)=>{if(!window.indexedDB)return Promise.resolve(void 0);await((e,t,o)=>new Promise((a=>{window.indexedDB.open(e).onsuccess=n=>{const s=n.target.result,r=s.version;s.close(),r!==t?H(e).then((e=>{a(e?t:r)})):s.objectStoreNames.contains(o)?a(r):H(e).then((e=>{a(e?t:r)}))}})))(t,o,e);let a=window.indexedDB.open(t,o);return new Promise((t=>{a.onupgradeneeded=t=>{const o=t.target.result;o.objectStoreNames.contains(e)||o.createObjectStore(e,{keyPath:"path"})},a.onsuccess=e=>{const o=e.target.result;t(o)},a.onerror=e=>{t(void 0)}}))},X=(e={})=>{let t;const o=B({baseUrl:"",dracoPath:"/three/draco/gltf/",basisPath:"/three/basis/",modelSizeKB:1048576,colors:{normal:{color:8954293},runing:{color:3045368},error:{color:12717056}},loadCache:!0,colorMeshName:[],indexDB:{cache:!0}},e),a=p({percentage:0,show:!1,isEnd:!1,list:[],total:0,loaded:0}),n={base:"base",device:"device",font:"font",sprite:"sprite",pipe:"pipe",warning:"warning",remote:"remote",local:"local",disabled:"disabled"},s=new Map,r=new u;r.setDecoderPath(o.baseUrl+o.dracoPath);const l=new h;l.setDRACOLoader(r);const c=new b;c.setTranscoderPath(o.baseUrl+o.basisPath),l.setKTX2Loader(c),l.setMeshoptDecoder(w);const d=e=>{const t=e.loaded,o=a.total;let n=Number((t+a.loaded)/o*100);n>100&&(n=100),a.percentage=Number(n.toFixed(2))},m=(e,t,a,n)=>{if(!a)return;const{baseUrl:r,colorMeshName:i}=o,{mapUrl:l,key:c,mapMeshName:d,repeat:m=[1,1]}=e;let p;l&&d&&(p=(new x).load(D(l,r)),p.wrapS=y,p.wrapT=y,p.repeat.set(m[0],m[1]));const u=_(a);return u.traverse((e=>{e.isMesh&&p&&e.name.indexOf(d)>-1?e.material=new f({side:g,transparent:!0,opacity:0,map:p.clone()}):((e,t=6776165,o,a)=>{const{type:n,name:s}=e;n.indexOf("Light"),P.mesh.receiveShadowName.some((e=>s.indexOf(e)>-1))?e.traverse((e=>{e.isMesh&&(e.receiveShadow=!0)})):o.some((e=>s.indexOf(e)>-1))?T(e,t):e.isMesh&&(a&&(e.material.envMap=a),e.castShadow=!0)})(e,t,i||[])})),l&&d&&(u._mapMeshName_=d),u.animations=n,c&&s.set(c,u),u},E=(e,a=0)=>new Promise((async n=>{var s;o.indexDB.cache||n(null);const r=v.get(e);if(r)r instanceof ArrayBuffer?(d({loaded:r.byteLength}),l.parse(r,"",(t=>{v.add(e,t),n(t)}))):(d({loaded:a*o.modelSizeKB}),setTimeout((()=>{n(r)}),10));else{const a=await((e,t,o)=>{if(!e||!t||!o)return Promise.resolve(null);const a=e.transaction([t],"readonly").objectStore(t).get(o);return new Promise(((e,t)=>{a.onsuccess=t=>{const o=t.target.result;e(o)},a.onerror=e=>{t(e)}}))})(t,(null==(s=o.indexDB)?void 0:s.tbName)||P.indexdb.tbName,e);if(a&&a.data){const e=a.data;"string"==typeof e?(d({loaded:e.length}),v.add(a.path,e),setTimeout((()=>{n(e)}),10)):(d({loaded:e.byteLength}),l.parse(e,"",(e=>{v.add(a.path,e),n(e)})))}else n(null)}})),N=e=>{var a;if(!o.indexDB.cache)return;const n=v.get(e);if(n&&t){const s=(null==(a=o.indexDB)?void 0:a.tbName)||P.indexdb.tbName;t.transaction(s,"readwrite").objectStore(s).add({path:e,data:n})}},k=(e,t)=>{const{key:a,url:n="",size:s=0}=e,{baseUrl:r,colors:c}=o;return new Promise((async(o,p)=>{let u=c.normal[a]||c.normal.color;u=A(u)[0];const h=D(n,r),b=await E(h,s);if(b){const t=b.scene.children[0],a=m(e,u,t,b.animations);return void o(a)}let w=h.split(".").pop().toLowerCase();if("glb"!==w)throw new Error("模型类型错误,必须为 GLB 格式，当前格式："+w);l.load(h,(t=>{const a=t.scene.children;let n=new i;a.length>1?n.add(...a):n=a[a.length-1];const s=m(e,u,n,t.animations);N(h),o(s)}),(e=>{d(e),"function"==typeof t&&t(e)}),p)}))};return{progress:a,MODEL_MAP:n,loadModel:k,loadModels:async(e,r,i)=>{var l,c,m;await W((null==(l=o.indexDB)?void 0:l.tbName)||P.indexdb.tbName,(null==(c=o.indexDB)?void 0:c.dbName)||P.indexdb.dbName,(null==(m=o.indexDB)?void 0:m.version)||P.indexdb.version).then((e=>(e&&(v.enabled=!0,t=e),e)));const p=e.length;if(!(0==p?(a.isEnd=!0,a.show=!1,0):(a.isEnd=!1,a.percentage=0,a.show=!0,1)))return;(e=>{for(let t=0;t<e.length;t++)a.total+=e[t].size*o.modelSizeKB})(e);let u=0;const h=async()=>{const t=e[u],{type:l=n.device,size:c=0}=t;switch(l){case n.device:case n.pipe:await k(t,i);break;case n.sprite:(e=>{const{key:t,range:a={x:1,y:1},mapUrl:n=""}=e;let r=(new x).load(o.baseUrl+n),i=new z({map:r}),l=new M(i),c=a.x,d=a.y;l.scale.set(c,d,1),l.name="sprite",s.set(t,l)})(t);break;case n.font:await((e,t)=>{const{url:a="",size:r=0}=e,{baseUrl:i}=o,l=D(a,i),c=new S;return new Promise((async(e,o)=>{const a=await E(l,r);if(a){const t=c.parse(JSON.parse(a));return s.set(n.font,t),void setTimeout((()=>{e(t)}),10)}c.load(l,(t=>{s.set(n.font,t),N(l),e(t)}),(e=>{d(e),"function"==typeof t&&t(e)}),o)}))})(t,i);break;case n.warning:t.key=n.warning,await k(t,i);break;case n.local:t.key=n.local,await k(t,i);break;case n.disabled:t.key=n.disabled,await k(t,i)}u++,a.loaded+=c*o.modelSizeKB,u>=p?(a.isEnd=!0,r()):h()};h()},getModel:e=>s.get(e)}};export{X as a,A as b,L as c,_ as d,N as e,U as f,O as g,I as h,K as i,R as j,T as s,E as u};