import{be as e,bX as t,bs as i,b6 as s,bV as n,bo as o,bY as r,bZ as a,b_ as c,bc as h,b$ as l,bk as d,c0 as p,c1 as u,c2 as m,c3 as b,c4 as g,cr as w,ba as f,bx as v,by as C,bz as y,bA as x,bB as k,bC as E,bD as S,bE as j,bF as L,bG as P,bH as A,bI as M,bJ as O,bK as z,b7 as U,bL as D,bM as G,b5 as T,bh as B,bN as R}from"./vendor-16889df9.js";import{g as F}from"./convert-17a5875b.js";import{d as I,i as W}from"./object-fb68a4c2.js";import{g as _}from"./asssets-c6facb32.js";const H={container:document.body,width:window.innerWidth,height:window.innerHeight,baseUrl:"",bgColor:null,bgUrl:null,env:null,scale:1,fog:{visible:!1,near:100,far:1e3},render:{antialias:!0,logarithmicDepthBuffer:!0,preserveDrawingBuffer:!1},controls:{visible:!0,autoRotate:!1,autoRotateSpeed:2,enableDamping:!1,dampingFactor:.25,enablePan:!0,enableRotate:!0,enableZoom:!0,maxAzimuthAngle:1/0,minAzimuthAngle:1/0,minDistance:1,maxDistance:2e3,minPolarAngle:0,maxPolarAngle:Math.PI,maxTargetRadius:1/0,rotateSpeed:1,screenSpacePanning:!0},ambientLight:{visible:!0,color:16777215,intensity:1.5},directionalLight:{visible:!0,helper:!1,position:[500,1e3,800],position2:[-500,800,-800],light2:!0,color:16777215,intensity:1.5},camera:{helper:!1,near:1,far:1e4,position:[-350,510,700]},cruise:{visible:!1,enabled:!1,runing:!1,helper:!1,points:[],segment:2,tension:0,baseUrl:"",repeat:[.1,1],width:15,speed:1,mapSpeed:.006,offset:10,factor:1,auto:!1,animateBack:void 0,alway:!1},grid:{visible:!1,opacity:.3,transparent:!0,width:800,divisions:80,centerLineColor:10592673,gridColor:10592673,fork:!1,forkSize:1.4,forkColor:10592673},axes:{visible:!1,size:50}},Z=()=>({visible:!0,enabled:!1,runing:!1,helper:!1,points:[],segment:2,close:!0,tension:0,baseUrl:"",mapUrl:_("arrow.png"),repeat:[.1,1],width:15,speed:1,mapSpeed:.006,offset:10,factor:1,index:0,auto:!1,tube:!1,color:16777215,radius:1,radialSegments:1,animateBack:void 0,alway:!1});var q,V,X=(e,t,i)=>(((e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)})(e,t,"access private method"),i);const{createCruise:J,cruiseAnimate:K,updateCruise:N,bindEvent:Y,removeEvent:$}=(()=>{let f,v,C,y=Z();const x=(e,t)=>{C=new h(new l(2),new d({color:0,opacity:.8,depthTest:!1,transparent:!0})),e.add(C);const i=(new p).setFromPoints(t.concat(t[0])),s=new u({color:255,opacity:1,depthTest:!1,transparent:!0}),n=new m(i,s);e.add(n);const o=new b(f,100,y.width/2,3,!0),r=new g({color:16711935,opacity:.1,depthTest:!1,transparent:!0}),a=new h(o,r),c=new d({color:16715760,opacity:.3,wireframe:!0,depthTest:!1,transparent:!0}),w=new h(o,c);a.add(w),e.add(a)},k=()=>900*(y.segment??2),E=()=>null==f?void 0:f.getPoints(k()),S=(t,i)=>new e(i.x,i.y+t,i.z),j=e=>{if(!y.enabled)return;switch(e.keyCode){case 38:case 87:y.runing?(y.factor*=1.5,y.factor>10&&(y.factor=10)):y.index+=5;break;case 83:case 40:y.runing||(y.index-=5,y.index<0&&(y.index=k()))}},L=e=>{if(!y.enabled)return;y.factor=1;switch(e.keyCode){case 32:y.runing=!y.runing;break;case 38:case 87:y.runing||(y.index+=10);break;case 83:case 40:y.runing||(y.index-=10,y.index<0&&(y.index=k()))}};return{createCruise:(l={},d)=>{y=I(Z(),l);const{points:p,tension:u,mapUrl:m,baseUrl:b,repeat:g,width:C,helper:k,close:S,tube:j,color:L,radius:P,radialSegments:A}=y,M=[];for(let t=0;t<p.length;t++){const i=p[t];M.push(new e(i[0],i[1],i[2]))}f=new t(M,S,"catmullrom",u??0),f=new t(E(),S,"catmullrom",u??0);const O=new i;v=(new s).load(F(m,b),(e=>{e.wrapS=n,e.repeat.x=g[0],e.repeat.y=g[1],e.anisotropy=d.capabilities.getMaxAnisotropy()}));const z=new o({color:L,map:v,opacity:.9,transparent:!0,depthTest:!0,side:r}),U=new e(0,1,0),D=new w;D.set(E(),P,A,U,!1);const G=j?new a:new c;G.update(D,j?{radius:P,radialSegments:A,progress:1,startRad:0}:{width:C,arrow:!1,progress:1,side:"both"});const T=new h(G,z);return O.add(T),O.name="cruise",k&&x(O,M),O.renderOrder=99,O},updateCruise:(e={})=>{y=I(y,e)},cruiseAnimate:e=>{if(!e)return;if(!f)return;const{mapSpeed:t,speed:i,factor:s,enabled:n,runing:o,offset:r,helper:a,auto:c,animateBack:h}=y;if(v&&(v.offset.x-=t),!(c||o&&n))return;(c||o&&n)&&(y.index+=s*i);const l=k(),d=y.index%l/l;let p=d+.001;p>1&&(p-=1);const u=f.getPointAt(p);if(a&&C){const e=S(r,u);C.position.copy(e)}const m=S(r,f.getPointAt(d));if(!c||o&&n){e.position.copy(m);const t=S(r,u);e._lookAt_=t,e.lookAt(t)}"function"==typeof h&&h(m,u,f,d)},bindEvent:()=>{window.addEventListener("keydown",j,!1),window.addEventListener("keyup",L,!1)},removeEvent:()=>{window.removeEventListener("keyup",L),window.removeEventListener("keydown",j)}}})(),{createFork:Q}={createFork:(e={})=>{const{width:t=800,divisions:s=80,forkSize:n=1.4,forkColor:o=10592673}=e;let r=t/s,a=-t/2;const c=new i;for(let i=0;i<=s;i++)for(let e=0;e<=s;e++){const t=a+i*r,s=a+e*r,l=new f(n,n/5),d=new g({color:o,transparent:!0,opacity:.9}),p=new h(l,d);p.rotateX(.5*-Math.PI),p.position.set(t,0,s);const u=p.clone();u.rotateZ(.5*Math.PI),c.add(p,u)}return c}},ee=class e{constructor(t={}){((e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)})(this,q);const i=H;this.options=I(i,t),e.total++,this.pointer={tsp:0,isClick:!1},W(this.options.container)?this.container=this.options.container:this.container=document.querySelector(this.options.container),this.options.width=this.container.offsetWidth,this.options.height=this.container.offsetHeight,this.scene=new v,this.renderer=this.initRenderer(),this.baseCamera=this.initCamera(),this.controls=this.initControls(),this.init(),this.initCruise()}get camera(){const{visible:e,runing:t,auto:i}=this.options.cruise;return e&&this.cruiseCamera&&t?this.cruiseCamera:this.baseCamera}init(){this.initLight(),this.initGrid(),this.initAxes(),this.initModel()}run(){this.loop()}loop(){this.animationId=window.requestAnimationFrame((()=>{this.loop()})),this.animate(),this.modelAnimate()}animate(){var e;this.renderer&&this.renderer.render(this.scene,this.camera),this.options.controls.visible&&(null==(e=this.controls)||e.update()),K(this.cruiseCamera),C()}initModel(){}modelAnimate(){}initRenderer(){const{width:e,height:t,bgColor:i,bgUrl:s,env:n}=this.options,o=new y(this.options.render);if(n&&this.setEnvironment(n),s?this.setBgTexture(s):this.setBgColor(i),this.options.fog.visible){const{color:e,near:t,far:i}=this.options.fog;this.scene.fog=new x(e??this.scene.background,t,i)}return o.sortObjects=!0,o.shadowMap.enabled=!0,o.shadowMap.type=k,o.setSize(e,t),o.setPixelRatio(window.devicePixelRatio),this.container.appendChild(o.domElement),o}initLight(){const{ambientLight:e,directionalLight:t}=this.options;if(e.visible){const t=new E(e.color,e.intensity);this.addObject(t)}if(t.visible){const e=this.createDirectionalLight(),[i=0,s=0,n=0]=t.position;if(e.position.set(i,s,n),this.addObject(e),t.helper){const t=new S(e,1);this.addObject(t)}if(t.light2){const e=this.createDirectionalLight(!1),[i=0,s=0,n=0]=t.position2;if(e.position.set(i,s,n),this.addObject(e),t.helper){const t=new S(e,1);this.addObject(t)}}}}createDirectionalLight(e=!0,t=2e3,i=4096,s=1,n=2e4){const{color:o,intensity:r}=this.options.directionalLight,a=new j(o,r);if(e){a.shadow.mapSize.setScalar(i),a.shadow.bias=-1e-5,a.shadow.normalBias=.01,a.castShadow=e;const o=a.shadow.camera;o.near=s,o.far=n,o.top=o.right=t,o.left=o.bottom=-t,o.updateProjectionMatrix()}return a}initCamera(){const{width:e,height:t,camera:i}=this.options;let s=new L(36,e/t,i.near,i.far);if(i.orthogonal){let n=e/t,o=260;s=new P(-o*n,o*n,o,-o,i.near,i.far)}if(s.position.set(...i.position),s.lookAt(0,0,0),i.helper){const e=new A(s);this.addObject(e)}return s}initControls(){const e=this.options.controls;if(!e.visible)return;const t=new M(this.camera,this.renderer.domElement);return Object.keys(e).forEach((i=>{t[i]=e[i]})),t.target.set(0,0,0),t.saveState(),t}initCruise(){const{visible:e}=this.options.cruise;e&&(this.cruiseCamera=this.initCamera(),X(this,q,V).call(this))}initGrid(){const e=this.options.grid;if(!e.visible)return;const{width:t,divisions:i,centerLineColor:s,gridColor:n,opacity:o,transparent:r,fork:a}=e,c=new O(t,i,s,n);if(c.material.opacity=o,c.material.transparent=r,this.grid=c,this.addObject(c),a){const t=Q(e);t.name="辅助交叉点",t._isGridFork_=!0,this.addObject(t)}}initAxes(){if(!this.options.axes.visible)return;const e=new z(this.options.axes.size);this.addObject(e)}createGround(e=5e3,t,i=11721691){const s=new f(e,t=void 0===t?e:t),n=new o({color:i,shininess:10}),r=new h(s,n);return r.name="ground",r.rotation.x=1.5*Math.PI,r.receiveShadow=!0,r}createClock(){this.clock=new U}setCruisePoint(e){this.options.cruise.points=e,this.createCruise()}createCruise(){const{visible:e,points:t,alway:i}=this.options.cruise;if(!e)return;if(this.cruiseGroup&&this.disposeObj(this.cruiseGroup),Y(),!t||0==t.length)return;const s=J(this.options.cruise,this.renderer);this.cruiseGroup=s,s.visible=i,this.addObject(s)}toggleCruise(e){let{visible:t,runing:i,auto:s,alway:n}=this.options.cruise;t&&(i=null!=e?e:i,this.options.cruise.runing=!i,this.options.cruise.enabled=!i,this.controls&&(this.controls.enabled=s||i),this.cruiseGroup&&!n&&(this.cruiseGroup.visible=!i),N(this.options.cruise))}toggleCruiseDepthTest(e){this.cruiseGroup&&this.cruiseGroup.traverse((t=>{(t.isMesh||t.isLine)&&(t.material.depthTest=null!=e?e:!t.material.depthTest)}))}setScale(e){this.options.scale=e}setEnvironment(e){(new D).load(F(e,this.options.baseUrl),(e=>{e.mapping=G,this.scene.environment=e}))}setBgTexture(e){if(Array.isArray(e)){const t=(new T).load(F(e,this.options.baseUrl));this.scene.background=t}else this.scene.background=(new s).load(F(e))}setBgColor(e){this.scene.background=e?new B(e):null}bindEvent(){const e=this.renderer.domElement;e.addEventListener("dblclick",this.onDblclick.bind(this)),e.addEventListener("pointerdown",this.onPointerDown.bind(this)),e.addEventListener("pointermove",this.onPointerMove.bind(this)),e.addEventListener("pointerup",this.onPointerUp.bind(this))}onDblclick(e){}onPointerDown(e){this.pointer.isClick=!0,this.pointer.tsp=e.timeStamp}onPointerMove(e){}onPointerUp(e){this.pointer.isClick=!1}exportImage(){const e=document.createElement("a");e.download="render.png",e.href=this.renderer.domElement.toDataURL().replace("image/png","image/octet-stream"),e.click()}getPosition(){var e;return{position:this.camera.position,target:null==(e=this.controls)?void 0:e.target}}isCameraMove(e,t=1){const i=this.camera.position;return Math.abs(i.x-e.x)<t&&Math.abs(i.y-e.y)<t&&Math.abs(i.z-e.z)<t}addObject(...e){this.scene.add(...e)}controlSave(){var e;null==(e=this.controls)||e.saveState()}controlReset(){var e;null==(e=this.controls)||e.reset(),this.toggleCruise(!0)}getValidTargetPosition(e,t,i,s={x:-104,y:7,z:58}){const n=t||e.to||s,o=i||e.target||{x:0,y:0,z:0},r=this.controls;return r&&r.target&&r.target.set(o.x,o.y,o.z),n}resize(){this.options.width=this.container.offsetWidth||window.innerWidth,this.options.height=this.container.offsetHeight||window.innerHeight;const{width:e,height:t,camera:i}=this.options,s=e/t;i.orthogonal||(this.baseCamera.aspect=s),this.baseCamera.updateProjectionMatrix(),this.cruiseCamera&&(i.orthogonal||(this.cruiseCamera.aspect=s),this.cruiseCamera.updateProjectionMatrix()),this.renderer.setSize(e,t)}stopAnimate(){window.cancelAnimationFrame(this.animationId)}clear(e){e&&e.traverse&&(e.traverse((e=>{e.material&&e.material.dispose(),e.geometry&&e.geometry.dispose(),null==e||e.clear()})),null==e||e.clear())}disposeObj(e){e&&e.traverse&&(e.traverse((e=>{e.material&&e.material.dispose(),e.geometry&&e.geometry.dispose(),null==e||e.clear()})),null==e||e.clear(),this.scene.remove(e))}dispose(){var e;$(),this.stopAnimate();try{R.clear(),this.disposeObj(this.scene),this.scene.clear(),this.renderer.dispose(),this.renderer.forceContextLoss();let t=this.renderer.domElement.getContext("webgl");t&&(null==(e=t.getExtension("WEBGL_lose_context"))||e.loseContext()),this.disposeObj(this.cruiseGroup),this.disposeObj(this.grid),this.controls&&this.controls.dispose(),this.scene=void 0,this.renderer=void 0,this.baseCamera=void 0,this.cruiseCamera=void 0,this.controls=void 0,this.grid=void 0,this.cruiseGroup=void 0,this.container.innerHTML=""}catch(t){}}};q=new WeakSet,V=function(){const e=this.options.cruise;e.enabled=!1,e.runing=!1,e.baseUrl&&(e.baseUrl=this.options.baseUrl),e.factor=1},ee.total=0;let te=ee;export{te as S};