var e=Object.defineProperty,t=(t,o,s)=>(((t,o,s)=>{o in t?e(t,o,{enumerable:!0,configurable:!0,writable:!0,value:s}):t[o]=s})(t,"symbol"!=typeof o?o+"":o,s),s);import{be as o,bf as s,b8 as i,bg as n,ba as a,bh as r,bi as c,bj as h,bk as l,bc as d,bl as m,bm as u,bn as b,bo as p,bp as w,bq as y,br as g,bs as v,bt as f,bd as x,af as k,e as M,i as A,l as S,o as L,g as j,h as z,n as K,I as E}from"./vendor-e7f34225.js";import{T as O,u as _}from"./scene-resize-5d485f13.js";import{_ as H}from"./index-60228787.js";class B extends O{constructor(e){super(e),t(this,"gui"),t(this,"operate",{moveForward:!1,moveLeft:!1,moveBackward:!1,moveRight:!1,canJump:!1}),t(this,"velocity",new o),t(this,"direction",new o),t(this,"prevTime",performance.now()),t(this,"raycaster",new s(new o,new o(0,-1,0),0,10)),t(this,"objects",[]),t(this,"simulate"),t(this,"skeleton"),t(this,"time",0),this.addControls(),this.initModel(),this.gui=new i,this.addGui()}init(){this.initLight(),this.initGrid(),this.initAxes()}addControls(){const e=this.camera;e.lookAt(0,10,0);const t=new n(e,this.container);this.controls=t,this.addObject(t.getObject())}initModel(){this.createGround(),this.createSimulate(),this.createObject(),this.bindOperateEvent()}createGround(){let e=new a(2e3,2e3,100,100);e.rotateX(.5*-Math.PI);const t=new o,s=new r;let i=e.attributes.position;for(let o=0;o<i.count;o++)t.fromBufferAttribute(i,o),t.x+=20*Math.random()-10,t.y+=2*Math.random(),t.z+=20*Math.random()-10,i.setXYZ(o,t.x,t.y,t.z);e=e.toNonIndexed(),i=e.attributes.position;const n=[];for(let o=0;o<i.count;o++)s.setHSL(.3*Math.random()+.5,.75,.25*Math.random()+.6,c),n.push(s.r,s.g,s.b);e.setAttribute("color",new h(n,3));const m=new l({vertexColors:!0}),u=new d(e,m);this.addObject(u)}createSimulate(){const e={segmentHeight:20,segmentCount:3,height:60,halfHeight:30},t=this.createSimulateGeometry(e),o=this.createSimulateBones(e),s=this.createSimulateMesh(t,o,e);s.position.set(0,0,-50),s.rotation.y=.5*Math.PI,s.scale.multiplyScalar(.1),this.simulate=s,this.addObject(s)}createSimulateGeometry(e){const t=new m(8,5,e.height,80,3*e.segmentCount,!1),s=t.attributes.position,i=new o,n=[],a=[];for(let o=0;o<s.count;o++){i.fromBufferAttribute(s,o);let t=i.y+e.halfHeight,r=Math.floor(t/e.segmentHeight),c=t%e.segmentHeight/e.segmentHeight;n.push(r,r+1,0,0),a.push(1-c,c,0,0)}return t.setAttribute("skinIndex",new u(n,4)),t.setAttribute("skinWeight",new h(a,4)),t}createSimulateBones(e){const t=[];let o=new b;t.push(o),o.position.y=e.halfHeight;for(let s=0;s<e.segmentCount;s++){const s=new b;s.position.y=e.segmentHeight,t.push(s),o.add(s),o=s}return t}createSimulateMesh(e,t,o){const s=new p({skinning:!0,color:1401481,emissive:468276,side:w,flatShading:!0});let i=new y(e,s),n=new g(t);i.add(t[0]),i.bind(n),i.position.set(0,o.height/2,0);const a=new v;let r=new f(i);return a.add(i,r),this.skeleton=n,a}createObject(){const e=new x(20,20,20).toNonIndexed(),t=e.attributes.position,o=[],s=new r;for(let i=0,n=t.count;i<n;i++)s.setHSL(.3*Math.random()+.5,.75,.25*Math.random()+.75,c),o.push(s.r,s.g,s.b);e.setAttribute("color",new h(o,3));for(let i=0;i<500;i++){const t=new p({specular:16777215,flatShading:!0,vertexColors:!0});t.color.setHSL(.2*Math.random()+.5,.75,.25*Math.random()+.75,c);const o=new d(e,t);o.position.x=20*Math.floor(20*Math.random()-10),o.position.y=20*Math.floor(20*Math.random())+10,o.position.z=20*Math.floor(20*Math.random()-10),this.addObject(o),this.objects.push(o)}}bindOperateEvent(){const e=this.controls,t=document.getElementById("blocker"),o=document.getElementById("instructions");o&&o.addEventListener("click",(function(){e.lock()})),e.addEventListener("lock",(function(){t&&(t.style.display="none")})),e.addEventListener("unlock",(function(){t&&(t.style.display="block")})),window.addEventListener("keydown",this.onKeydown.bind(this)),window.addEventListener("keyup",this.onKeyup.bind(this)),k((()=>{window.removeEventListener("keydown",this.onKeydown.bind(this)),window.removeEventListener("keyup",this.onKeyup.bind(this))}))}addGui(){var e;const t=this.gui,o=this.controls;t.add(o,"minPolarAngle",0,Math.PI).name("垂直角度下限"),t.add(o,"maxPolarAngle",0,Math.PI).name("垂直角度上限"),t.add(o,"pointerSpeed",.01,1).name("旋转速度"),t.domElement.style="position: absolute; top: 0px; right: 0px",null==(e=this.container.parentNode)||e.appendChild(t.domElement)}onKeydown(e){switch(e.code){case"ArrowUp":case"KeyW":this.operate.moveForward=!0;break;case"ArrowLeft":case"KeyA":this.operate.moveLeft=!0;break;case"ArrowDown":case"KeyS":this.operate.moveBackward=!0;break;case"ArrowRight":case"KeyD":this.operate.moveRight=!0;break;case"Space":!0===this.operate.canJump&&(this.velocity.y+=350),this.operate.canJump=!1}}onKeyup(e){switch(e.code){case"ArrowUp":case"KeyW":this.operate.moveForward=!1;break;case"ArrowLeft":case"KeyA":this.operate.moveLeft=!1;break;case"ArrowDown":case"KeyS":this.operate.moveBackward=!1;break;case"ArrowRight":case"KeyD":this.operate.moveRight=!1}}modelAnimate(){const e=performance.now();if(this.controls&&!0===this.controls.isLocked){const{raycaster:t,controls:s,prevTime:i,velocity:n,operate:a,direction:r,objects:c}=this,h=s.getObject();t.ray.origin.copy(h.position),t.ray.origin.y-=10;const l=t.intersectObjects(c,!1).length>0,d=(e-i)/1e3;n.x-=10*n.x*d,n.z-=10*n.z*d,n.y-=9.8*100*d;const{moveForward:m,moveBackward:u,moveRight:b,moveLeft:p}=a;if(r.z=Number(m)-Number(u),r.x=Number(b)-Number(p),r.normalize(),(m||u)&&(n.z-=400*r.z*d),(p||b)&&(n.x-=400*r.x*d),!0===l&&(n.y=Math.max(0,n.y),this.operate.canJump=!0),s.moveRight(-n.x*d),s.moveForward(-n.z*d),h.position.y+=n.y*d,h.position.y<10&&(n.y=0,h.position.y=10,this.operate.canJump=!0),this.simulate){const e=new o;h.getWorldDirection(e);const t=e.clone().multiplyScalar(30),s=h.position.clone().clone().add(t);this.simulate.position.x=s.x,this.simulate.position.z=s.z;const i=h.rotation.clone();this.simulate.rotation.setFromVector3(i)}}if(this.prevTime=e,this.skeleton){let e=this.time,t=25,o=.01,s=this.skeleton;e+=1,e<t&&(s.bones[0].rotation.x=s.bones[0].rotation.x-2*o,s.bones[1].rotation.x=s.bones[1].rotation.x+o,s.bones[2].rotation.x=s.bones[2].rotation.x+o/2),e<2*t&&e>t&&(s.bones[0].rotation.x=s.bones[0].rotation.x+2*o,s.bones[1].rotation.x=s.bones[1].rotation.x-o,s.bones[2].rotation.x=s.bones[2].rotation.x-o/2),e===2*t&&(e=0),this.time=e}}}const I={class:"three-page"},C=H(M({__name:"index",setup(e){const t=A(),o={axes:{visible:!0},grid:{visible:!0},camera:{position:[0,10,0]},controls:{visible:!1}};let s;return S((()=>{o.container=t.value,s=new B(o),s.run(),_(s).resize()})),(e,o)=>(L(),j("div",I,[z("div",{class:"h-100",ref_key:"containerRef",ref:t},null,512),z("div",{class:K(e.$style.blocker),id:"blocker"},[z("div",{class:K(e.$style.instructions),id:"instructions"},o[0]||(o[0]=[z("div",null,"点击开始",-1),z("p",null,[E(" 移动: W、A、S、D"),z("br"),E(" 跳跃: 空格"),z("br"),E(" 视角: 鼠标移动 ")],-1)]),2)],2)]))}}),[["__cssModules",{$style:{blocker:"_blocker_ewsl7_2",instructions:"_instructions_ewsl7_11"}}]]);export{C as default};