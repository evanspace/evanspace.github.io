var e=Object.defineProperty,t=(t,i,o)=>(((t,i,o)=>{i in t?e(t,i,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[i]=o})(t,"symbol"!=typeof i?i+"":i,o),o);import{b6 as i,bU as o,cm as n,cn as s,be as r,bs as a,ct as l,d2 as c,bS as d,dd as h,ba as u,bo as p,bc as _,de as m,bO as g,bh as y,d3 as b,bV as f,cL as v,e as k,Y as x,i as w,l as C,o as G,g as O,h as z,u as j,a7 as D,a8 as A,F as P,r as M,m as T,p as S,I as E,t as L,n as R,q as N,a9 as B,B as U,aP as I,ak as F,aa as H}from"./vendor-16889df9.js";import{u as $,t as K}from"./css2d-3dcf2e48.js";import{S as V}from"./three-scene.module-24b3c661.js";import{g as J,s as W,c as q,m as X,b as Y}from"./model-3a962665.js";import{u as Q,a as Z}from"./move-animate-17c323af.js";import{g as ee}from"./asssets-c6facb32.js";import{d as te}from"./object-fb68a4c2.js";import{u as ie}from"./raycaster-7977e527.js";import{e as oe,A as ne,_ as se}from"./index-c95106e6.js";import{u as re}from"./background-b37af10e.js";import{u as ae}from"./model-loader-8f6422bf.js";import{u as le}from"./scene-resize-81793ab7.js";import"./convert-17a5875b.js";const ce="ROBOT",de="CHARACTER",he="GROUND",ue="PARK_VIDEO",pe="OPEN_THE_DOOR",_e="HALF_OPEN_THE_DOOR",me="DOUBLE_OPEN_THE_DOOR",ge="WAIT_LIFT",ye="SLIDING_DOOR",be="LIGHT_SWITCH",fe=.2,ve=300,{raycaster:ke,pointer:xe,update:we,style:Ce}=ie(),{initCSS2DRender:Ge,createCSS2DDom:Oe}=$(),{createDiffusion:ze,updateDiffusion:je}=Q(),{createMove:De,moveAnimate:Ae}=Z(),{addLensflare:Pe}=((e={})=>{let t=te({mainTextureUrl:ee("lensflare0.png"),minorTextureUrl:ee("lensflare3.png")},e);const r=new i,a=r.load(t.mainTextureUrl),l=r.load(t.minorTextureUrl);return{addLensflare:(e,t,i,r)=>{const c=new o(16777215,1,2e3,0);c.color.set(e),c.position.set(t,i,r);const d=new n;return d.addElement(new s(a,700,0,c.color)),d.addElement(new s(l,60,.6)),d.addElement(new s(l,70,.7)),d.addElement(new s(l,120,.9)),d.addElement(new s(l,70,1)),c.add(d),c}}})(),Me={}.VITE_BEFORE_STATIC_PAT||"",Te=e=>{const t=document.createElement("video");return t.src=Me+(e||"/oss/textures/park/sintel.mp4"),t.loop=!0,t},Se=(new i).load(Me+"/oss/textures/park/cover.jpeg"),Ee="FULL",Le="NPC";class Re extends V{constructor(e,i){super(e),t(this,"water"),t(this,"sky"),t(this,"sun"),t(this,"buildingGroup"),t(this,"anchorGroup"),t(this,"dotGroup"),t(this,"lightGroup"),t(this,"extend"),t(this,"css2DRender"),t(this,"mouseClickDiffusion"),t(this,"character"),t(this,"currentSight"),t(this,"historyTarget"),t(this,"historyCameraPosition"),t(this,"animateModels"),t(this,"moveFactor",1),this.extend=i,this.css2DRender=Ge(this.options,this.container),this.css2DRender.domElement.className="three-scene__dot-wrap",this.mouseClickDiffusion=ze(4,void 0,6),this.mouseClickDiffusion.rotation.x=.5*-Math.PI,this.mouseClickDiffusion.position.y=.5,this.mouseClickDiffusion.visible=!1,this.addObject(this.mouseClickDiffusion),this.createClock(),this.currentSight=Ee,this.historyTarget=new r,this.historyCameraPosition=new r,this.animateModels=[],this.bindEvent(),this.addBuildingGroup(),this.addAnchorGroup(),this.addDotGroup(),this.addLightGroup(),this.addLensflare()}addBuildingGroup(){const e=new a;e.name="建筑组",this.buildingGroup=e,this.addObject(e)}clearBuilding(){this.buildingGroup&&this.disposeObj(this.buildingGroup),this.animateModels=[],this.addBuildingGroup(),this.clearAnchor(),this.clearDot(),this.clearLightGroup()}addBuilding(...e){this.buildingGroup&&this.buildingGroup.add(...e)}addAnchorGroup(){const e=new a;e.name="锚点组",this.anchorGroup=e,this.addObject(e)}clearAnchor(){this.anchorGroup&&this.disposeObj(this.anchorGroup),this.addAnchorGroup()}addAnchor(...e){this.anchorGroup&&this.anchorGroup.add(...e)}addDotGroup(){const e=new a;e.name="点位组",this.dotGroup=e,this.scene.add(e)}clearDot(){this.dotGroup&&this.disposeObj(this.dotGroup),this.addDotGroup()}addDot(e,t){var i;const o=e.position,{size:n,color:s}=e.font||{},{x:r=0,y:a=0,z:l=0}=o||{},c=Oe({name:`\n        <div class="bg"></div>\n        <span class="inner" style="${null!=n?`font-size: ${"string"==typeof n?n:n+"px"};`:""} ${null!=s?`color: ${s}`:""}"></span>\n      `,className:"dot-2D-label",position:[r,a,l],onClick:t});return c.name=e.name,c.data=e,c._position_={x:r,y:a,z:l},null==(i=this.dotGroup)||i.add(c),c}addLightGroup(){const e=new a;e.name="灯光组",this.lightGroup=e,this.addObject(e)}clearLightGroup(){this.lightGroup&&this.disposeObj(this.lightGroup),this.addLightGroup()}addLight(e,t,i){if(this.lightGroup){t.name=e.name;const{to:o={x:0,y:0,z:0}}=e;if(t.target.position.set(o.x,o.y,o.z),this.lightGroup.add(t),i){const e=new l(t,t.color);this.lightGroup.add(e)}}}addLensflare(){const{position:e=[500,1e3,800],color:t=16777215}=this.options.directionalLight,[o,n,s]=e,a=Pe(t,o,n,s);this.addObject(a),this.sun=new r(o,n,s),this.water=(()=>{const e=new u(900,50),t=new b(e,{textureWidth:512,textureHeight:512,waterNormals:(new i).load(Me+"/oss/textures/waternormals.jpg",(e=>{e.wrapS=e.wrapT=f})),sunDirection:new r,sunColor:15732480,waterColor:92299,distortionScale:3.5});return t.rotation.x=-Math.PI/2,t.rotation.z=.05*Math.PI,t.material.uniforms.size.value=.5,t.position.y=-1,t.position.x=65,t.position.z=230,t})(),this.addObject(this.water)}updateSkyAndSun(){const{water:e,sky:t,sun:i}=this,o=null==t?void 0:t.material.uniforms;if(!o)return;const n=10,s=1,r=.005,a=.2,l=4,d=180,h=1;o.turbidity.value=n,o.rayleigh.value=s,o.mieCoefficient.value=r,o.mieDirectionalG.value=a;const u=v.degToRad(90-l),p=v.degToRad(d);if(!i)return;if(i.setFromSphericalCoords(1,u,p),t.material.uniforms.sunPosition.value.copy(i),!e)return;e.material.uniforms.sunDirection.value.copy(i).normalize();const _=new c(this.renderer);this.scene.environment=_.fromScene(t).texture,this.renderer.toneMappingExposure=h}addCharacter(e,t){const{x:i,y:o,z:n}=t;e.position.set(i,o,n),this.character=e;const s=e.animations,r=new d(e),a={};for(let c=0;c<s.length;c++){const e=s[c],t=r.clipAction(e);a[e.name]=t}a.Dance.play();const l=a.Walking;e.extra={mixer:r,actions:a,runging:l},this.addObject(e)}toggleSight(){if(this.options.cruise.runing)return void this.toggleCruise(!0);if(!this.controls||!this.character)return;const e=this.currentSight==Ee?Le:Ee;this.currentSight=e;const t=e===Le;this.controls.maxDistance=t?15:1500,this.controls.screenSpacePanning=!t,this.controls.enablePan=!t,this.controls.maxPolarAngle=Math.PI*(t?.49:.45);const i=this.controls.target,o=this.character.position;if(t){const{x:e,y:t,z:n}=i;this.historyTarget=new r(e,t,n);const{x:s,y:a,z:l}=this.camera.position;this.historyCameraPosition=new r(s,a,l);const{x:c,y:d,z:h}=o;this.camera.lookAt(new r(c,d+3,h))}else{const{x:e,y:t,z:i}=this.historyCameraPosition;this.camera.position.set(e,t,i),this.camera.lookAt(o)}const{x:n,y:s,z:a}=t?o:this.historyTarget;i.set(n,s,a)}characterAccelerate(){this.moveFactor++,this.moveFactor>=10&&(this.moveFactor=10)}setControlTarget(e){if(!this.controls)return;const{x:t,y:i,z:o}=e;this.controls.target.set(t,i+3,o),this.camera.lookAt(this.controls.target)}mouseClickGround(e){if(this.currentSight!==Le)return Promise.reject();const t=this.character;if(!t)return Promise.reject();const{runing:i}=this.options.cruise;if(i)return Promise.reject();const o=e.point,n=this.mouseClickDiffusion,{runging:s}=t.extra;s.play();const{x:r,y:a,z:l}=o;return n.position.set(r,a,l),n.visible=!0,new Promise((e=>{De(t,o,(e=>{this.setControlTarget(e)}),(i=>{this.setControlTarget(i),s.stop(),n.visible=!1,e(t)}))}))}addVideoMaterial(){const e=Te(),t=new h(e),i=new u(10,5),o=new p({map:Se}),n=new _(i,o);n.__video_texture__=t,n.__cover_texture__=Se,n.position.set(-75,2.66,133),n.name="small_video",n.__video__=e,this.addObject(n);const s=new m(new u(20,20),{clipBias:.003,textureWidth:window.innerWidth*window.devicePixelRatio,textureHeight:window.innerHeight*window.devicePixelRatio,color:11908533});s.position.set(-75,.17,160),s.rotateX(-Math.PI/2),this.addObject(s);const r=this.scene.getObjectByName("大屏幕");if(!r)return;const a=Te(),l=new h(a);r.__video_texture__=l,r.__cover_texture__=Se.clone(),r.material=o.clone(),r.__video__=a}videoPlay(e){const t=this.scene.getObjectByName(e.data.bind);if(t&&t.__video__){const e=t.__video__;e.paused?(t.material.map=t.__video_texture__,null==e||e.play()):(null==e||e.pause(),t.material.map=t.__cover_texture__)}}openTheDoor(e,t){const i=this.scene.getObjectByName(e.data.bind);if(i)if(t)i.__open__=!i.__open__,new g(i.rotation).to({z:i.__open__?.5*Math.PI:0},1500).delay(0).start();else{const e=i.position;if(null==i.__open__){const{x:t,y:o,z:n}=e;i.__position__=new r(t,o,n)}i.__open__=!i.__open__,new g(e).to({x:i.__position__.x+(i.__open__?7:0)},1500).delay(0).start()}}openTheDoubleSlidingDoor(e,t=400,i){const o=this.scene.getObjectByName(e.data.bind);if(!o)return Promise.reject();const n=o.children.find((e=>e.name.indexOf("左")>-1)),s=o.children.find((e=>e.name.indexOf("右")>-1)),a=n.position,l=s.position;if(null==o.__open__){const{x:e,y:t,z:i}=a,{x:o,y:c,z:d}=l;n.__position__=new r(e,t,i),s.__position__=new r(o,c,d)}return o.__open__=void 0!==i?i:!o.__open__,new Promise((e=>{const i=s.__position__.x+(o.__open__?t:0);if(l.x===i)return e(o);new g(a).to({x:n.__position__.x+(o.__open__?-t:0)},1500).delay(0).start(),new g(l).to({x:i},1500).delay(0).start().onComplete((()=>{e(o)}))}))}openTheSlidingDoor(e){const t=this.scene.getObjectByName(e.data.bind);if(!t)return;const i=t.children.find((e=>e.name.indexOf("左")>-1)),o=i.position;if(null==t.__open__){const{x:e,y:t,z:n}=o;i.__position__=new r(e,t,n)}t.__open__=!t.__open__;const n=i.__position__.y+(t.__open__?4.5:0);o.y!==n&&new g(o).to({y:i.__position__.y+(t.__open__?4.5:0)},1500).delay(0).start()}waitLift(e,t){var i;const o="单元1号电梯",n=this.scene.getObjectByName(o),s=null==(i=e.data)?void 0:i.to;if(!n||!s)return;const r=n.position;if(s.y!=r.y){const i=n.__bind_lift__;void 0!==i&&this.openTheDoubleSlidingDoor({data:{bind:i}},200,!1),this.openTheDoubleSlidingDoor({data:{bind:o}},4,!1).then((()=>{new g(r).to({y:s.y},1500).delay(0).start().onUpdate((e=>{if(t){if(!this.character)return;this.character.position.y=e.y,this.camera.position.y=e.y,this.setControlTarget(this.character.position)}})).onComplete((()=>{n.__bind_lift__=e.data.bind,this.openLift(e,o)}))}))}else this.openLift(e,o)}openLift(e,t){this.openTheDoubleSlidingDoor(e,200),this.openTheDoubleSlidingDoor({data:{bind:t}},4)}lightSwitch(e){var t,i;(null==(i=this.lightGroup)?void 0:i.getObjectsByProperty("name",null==(t=e.data)?void 0:t.bind)).forEach((e=>{e.visible=!e.visible}))}addModelAnimate(e,t=[],i=!0,o=1){if(!t.length)return;const n=new d(e),s=t.reduce(((e,t)=>{const s=t.name||"";return e[s]=n.clipAction(t),i&&e[s].play(),e[s].timeScale=o,e}),{});e.__action__=s,e.__mixer__=n,this.animateModels.push(e)}modelAnimate(){var e;this.css2DRender.render(this.scene,this.camera),"function"==typeof this.extend.animateCall&&this.extend.animateCall(),this.water&&(this.water.material.uniforms.time.value+=1/60),this.mouseClickDiffusion.visible&&je();let t=null==(e=this.clock)?void 0:e.getDelta();if(this.character){this.character.extra.mixer.update(t),Ae(.5*this.moveFactor)}this.restoreAnchorMaterial(),this.animateModels.length&&this.animateModels.forEach((e=>{e.__mixer__.update(t)}))}onDblclick(e){var t;const i=this.container,o=this.options.scale;if(we(e,i,o),this.buildingGroup){ke.setFromCamera(xe,this.camera);const e=[this.buildingGroup],i=ke.intersectObjects(e);if(i.length){const e=i[0].object,o=this.findParentGroup(e);if(!o)return;"function"==typeof(null==(t=this.extend)?void 0:t.onDblclick)&&this.extend.onDblclick(o)}}}onPointerMove(e){this.checkIntersectObjects(e)}onPointerUp(e){var t;super.onPointerUp(e);const i=e.timeStamp-this.pointer.tsp<ve;2==e.button?i&&"function"==typeof(null==(t=this.extend)?void 0:t.onClickRight)&&this.extend.onClickRight(e):0==e.button?i&&this.checkIntersectObjects(e):e.button}checkIntersectObjects(e){var t,i,o,n,s;const r=this.container,a=this.options.scale;we(e,r,a);let l="pointerdown"==e.type||"pointerup"==e.type;const c=(null==(i=this.buildingGroup)?void 0:i.children.filter((e=>e.visible&&(l||e.__ground__))).concat((null==(t=this.anchorGroup)?void 0:t.children)||[]))||[];ke.setFromCamera(xe,this.camera);let d=ke.intersectObjects(c,l);if(l)if(r.style.cursor="auto",d.length){const e=d[0],t=e.object,i="string"==typeof t.name&&(this.extend.groundMeshName||[]).some((e=>t.name.indexOf(e)>-1)),s=this.findParentGroup(t);if(i&&"function"==typeof(null==(o=this.extend)?void 0:o.onClickGround)&&this.extend.onClickGround(s,e),!s)return;"function"==typeof(null==(n=this.extend)?void 0:n.onClickLeft)&&this.extend.onClickLeft(s,e)}else"function"==typeof(null==(s=this.extend)?void 0:s.onClickLeft)&&this.extend.onClickLeft();else this.hoverAnchor(d)}hoverAnchor(e){var t,i,o;if("function"==typeof this.extend.onHoverAnchor&&this.extend.onHoverAnchor(e[0],Ce),e.length){const o=e[0].object;if(this.container.style.cursor=o._isAnchor_?"pointer":"auto",!o._isAnchor_)return void(null==(t=this.anchorGroup)||t.children.forEach((e=>{e.__change_color__=!1})));const n=o.material;void 0===o.__mat_color__&&(o.__mat_color__=n.color),n.color=new y(16715760),null==(i=this.anchorGroup)||i.children.forEach((e=>{e.__change_color__=e.uuid===o.uuid}))}else this.container.style.cursor="auto",null==(o=this.anchorGroup)||o.children.forEach((e=>{e.__change_color__=!1}))}restoreAnchorMaterial(){var e;null==(e=this.anchorGroup)||e.traverse((e=>{e.isSprite&&!e.__change_color__&&e.__mat_color__&&(e.material.color=e.__mat_color__)}))}findParentGroup(e){const t=e=>{if(e._isBuilding_)return e;let i=e.parent;return i?i&&i._isBuilding_?i:t(i):void 0};return t(e)}getFloor(){var e;return null==(e=this.buildingGroup)?void 0:e.children.filter((e=>e._isFloor_))}hideOmitFloor(e){var t;null==(t=this.buildingGroup)||t.children.forEach((t=>{t.visible=t._isFloor_||e}))}getAll(){var e,t;return(null==(t=this.buildingGroup)?void 0:t.children.concat((null==(e=this.dotGroup)?void 0:e.children)||[]))||[]}getFlowMark(e){return this.getAll().filter((t=>{var i;return(null==(i=t.data)?void 0:i.followMark)===e}))}getAnimTargetPos(e,t,i){if(!this.controls)return;const o=t||e.to||{x:-104,y:7,z:58},n=i||e.target||{x:0,y:0,z:0};return this.controls.target.set(n.x,n.y,n.z),o}resize(){super.resize();const{width:e,height:t}=this.options;this.css2DRender.setSize(e,t)}dispose(){this.animateModels=[],this.disposeObj(this.water),this.disposeObj(this.sky),this.disposeObj(this.buildingGroup),this.disposeObj(this.character),this.disposeObj(this.dotGroup),this.disposeObj(this.anchorGroup),this.disposeObj(this.lightGroup),this.disposeObj(this.mouseClickDiffusion),this.clock=void 0,this.water=void 0,this.sky=void 0,this.css2DRender=void 0,this.buildingGroup=void 0,this.character=void 0,this.dotGroup=void 0,this.anchorGroup=void 0,this.lightGroup=void 0,this.mouseClickDiffusion=void 0,this.extend={},super.dispose()}}const Ne=(e,t)=>{const i=40*Math.random();return void 0!==i&&(e.value=i),e.show=Math.random()>.5,e.value=Number(Number(e.value||0).toFixed(2)),{value:e.value,show:e.show,font:{...e.font||{},color:"#"+(16777215+1e6*i).toString(16).substring(0,6)}}},Be=(e,t)=>{const i=Math.random()>.5?1:0,o=Math.random()>.5?1:0,n=Math.random()>.8?1:0,s=Math.floor(3*Math.random());return{status:n>0?0:i,error:n>0?0:o,remote:1==s?1:0,local:2==s?1:0,disabled:n}},Ue={normal:{color:8954293,main:[8954293,2698801],text:12180479,FM:6319220},runing:{color:3045368,main:3045368,FM:422935},error:{color:12717056,main:11879461,FM:15215899}},Ie={class:"scene-operation"},Fe=["innerHTML"],He=se(k({__name:"index",setup(e){const t=x({devEnv:!0,baseUrl:"",bgColor:"",skyCode:"223",env:"/oss/textures/hdr/3.hdr",dotKey:"DOT",dotShowStrict:!1,colorMeshName:[],floorModelType:["FLOOR_COMMON"],anchorType:["PARK_CAMERA","PARK_ROOM_INLET",ue,pe,_e,me,ge,ye,be],carType:["car_tanker","car_goods","car_trailer","car_crane"],animationModelType:["building_commercial_2"],colors:{},config:{},cruise:{visible:!0,auto:!0,mapUrl:"/oss/textures/cruise/line2.png",repeat:[.1,1],width:2,segment:100,tension:.1,speed:20,mapSpeed:.01,points:[[-89.57,fe,179.4],[-52.28,fe,179.4],[-52.28,fe,123.05],[-4.43,fe,123.05],[-4.43,fe,99.18],[6.26,fe,99.18],[6.26,fe,153.83],[92.71,fe,153.83],[147.75,fe,148.23],[147.75,fe,135.93],[144.21,fe,133.13],[144.21,fe,126.7],[86.6,fe,126.7],[86.6,fe,152.35],[77.55,fe,152.35],[77.55,fe,-137.3],[3.34,fe,-137.3],[3.34,fe,-52.04],[-89.57,fe,-52.04]],offset:1.8,animateBack:(e,t,i,o)=>{if(f){(o+=.02)>1&&(o-=1),e=((e,t=0)=>new r(e.x,e.y+t,e.z))(i.getPointAt(o));let n=o+.001;n>1&&(n-=1),t=i.getPointAt(n),f.position.set(e.x,.16,e.z);const s=Math.atan2(-t.z+e.z,t.x-e.x);f.rotation.z=.5*Math.PI+s}}},models:[{key:"SCENE",name:"场景",size:14.7,url:"/场景.glb"},{key:he,name:"地面",size:4,url:"/地面.glb"},{key:"PARKING_SPACE",name:"停车位",size:.06,url:"/停车位.glb"},{key:"building_1",name:"楼栋1",size:1.2,url:"/楼栋1.glb"},{key:"building_2",name:"楼栋2",size:2,url:"/楼栋2.glb"},{key:"building_3",name:"楼栋3",size:1.6,url:"/楼栋3.glb"},{key:"building_4",name:"楼栋4",size:2.8,url:"/楼栋4.glb"},{key:"building_5",name:"楼栋5",size:1.6,url:"/楼栋5.glb"},{key:"building_warehouse",name:"仓库",size:.7,url:"/仓库.glb"},{key:"building_commercial_1",name:"商业楼1",size:.6,url:"/商业楼1.glb"},{key:"building_commercial_2",name:"商业楼2",size:14.5,url:"/商业楼2.glb"},{key:"building_commercial_3",name:"商业楼3",size:.6,url:"/商业楼3.glb"},{key:"building_commercial_4",name:"电梯房",size:9.6,url:"/电梯房.glb"},{key:"building_commercial_5",name:"现代门窗",size:95,url:"/现代门窗.glb"},{key:"car_tanker",name:"油罐车",size:1,url:"/油罐车.glb"},{key:"car_goods",name:"货车",size:6.4,url:"/货车.glb"},{key:"car_trailer",name:"拖车",size:2,url:"/拖车.glb"},{key:"car_crane",name:"吊车",size:4.4,url:"/吊车.glb"},{key:"car_aodi",name:"奥迪",size:1,url:"/奥迪.glb"},{key:"car_kaidilake",name:"凯迪拉克",size:1.6,url:"/凯迪拉克.glb"},{key:"ARBOR_ONE",name:"小树",size:2,url:"/小树.glb"},{key:"FENCE",name:"围栏",size:.8,url:"/围栏.glb"},{key:"HANDRAIL",name:"栏杆",size:.1,url:"/栏杆.glb"},{key:ce,name:"机器人",size:.3,url:"/机器人.glb"},{key:de,name:"人物",size:2.2,url:"/RobotExpressive.glb"},{key:"PARK_CAMERA",name:"摄像头",type:"sprite",range:{x:18.5,y:38.5},mapUrl:"/sxt.png"},{key:ue,name:"视频播放",type:"sprite",range:{x:1,y:1},mapUrl:"/video.png"},{key:pe,name:"开门",type:"sprite",range:{x:1,y:1},mapUrl:"/open.png"},{key:_e,name:"半开门",type:"sprite",range:{x:1,y:1},mapUrl:"/open.png"},{key:me,name:"双开门",type:"sprite",range:{x:1,y:1},mapUrl:"/open.png"},{key:ye,name:"推拉门",type:"sprite",range:{x:1,y:1},mapUrl:"/open.png"},{key:ge,name:"电梯门",type:"sprite",range:{x:1,y:1},mapUrl:"/lift.png"},{key:"spot_light_reception",type:"spotlight",name:"聚光灯",intensity:8,distance:100,decay:0},{key:be,name:"开关灯",type:"sprite",range:{x:1.2,y:1.2},mapUrl:"/light.png"}].map((e=>(e.url&&(e.url="/oss/model/park"+e.url),e.mapUrl&&(e.mapUrl="/oss/textures/park"+e.mapUrl),e)))});const i=x({active:1,show:!1,list:[{name:"一楼",key:1,y:.2},{name:"二楼",key:2,y:13.8},{name:"三楼",key:3,y:19.83},{name:"五楼",key:5,y:31.76}]}),o=x({show:!1,style:{left:0,top:0},msg:""}),n=w(),s=te(Ue,t.colors),{changeBackground:a,backgroundLoad:l}=re(),{progress:c,loadModels:d,getModel:h,virtualization:u,closeVirtualization:p}=ae({baseUrl:t.baseUrl,colors:s,colorMeshName:t.colorMeshName,indexDB:{cache:!1,dbName:"THREE__PARK__DB",tbName:"TB",version:74}}),_={env:"/oss/textures/hdr/3.hdr",controls:{maxDistance:1500,maxPolarAngle:.45*Math.PI,screenSpacePanning:!0,enablePan:!0},camera:{position:[-85.7,3.6,208.6]},cruise:t.cruise,grid:{visible:!1},axes:{visible:!0},directionalLight:{visible:!0,intensity:3}},m=e=>{var i;const o=e.data;{const e=Ne(o,Q.buildingGroup);"object"==typeof e&&Object.keys(e).forEach((t=>{o[t]=e[t]}))}e.visible=o.show||!t.dotShowStrict;const n=null==(i=e.element)?void 0:i.getElementsByClassName("inner")[0];if(n){const{size:e,color:t}=o.font||{};null!=e&&(n.style.fontSize="string"==typeof e?e:e+"px"),null!=t&&(n.style.color=t),n.textContent=`${o.value||0}${o.unit}`}},y=async e=>{if(!e)return;const{type:i,url:o}=e,n=h(i);if(!n)return void(o||i===t.dotKey&&(e=>{m(Q.addDot(e,(e=>{})))})(e));const{floorModelType:s=[],anchorType:r=[],carType:a=[],animationModelType:l=[]}=t;let c=X(n);const{position:d,scale:u,rotation:p}=Y(c,e),[_,y,b]=d;return c.scale.set(...u),c.position.set(_,y,b),c.rotation.set(...p),c._isBuilding_=!0,c.data=e,a.includes(i)&&(e=>{const t=e.data,{to:i,position:o}=t;if(!i)return;const n=v.randInt(0,1e4);e.tween1=new g(e.position).to(i,3e4).delay(n).onUpdate((({x:t,y:i,z:o})=>{e.position.x=t,e.position.y=i,e.position.z=o})),e.tween2=new g(o).to(i,3e4).onUpdate((({x:t,y:i,z:o})=>{e.position.x=t,e.position.y=i,e.position.z=o})),e.tween1.chain(e.tween2),e.tween2.chain(e.tween1),e.tween1.start()})(c),l.includes(i)&&Q.addModelAnimate(c,n.animations,!0,.1),s.includes(i)&&(c._position_={x:_,y:y,z:b},c._isFloor_=!0),c.__ground__=i===he,r.includes(i)?(c._isAnchor_=!0,Q.addAnchor(c)):c.isSpotLight?Q.addLight(e,c,!0):Q.addBuilding(c),Promise.resolve()},b=async()=>{c.percentage=100,c.show=!1,Q.clearBuilding(),await H(),await(()=>{let e=0,t=k.value.length;return new Promise((i=>{if(0==t)return i(null);const o=async()=>{const n=k.value[e];await y(n),e++,e<t?o():i(e)};o()}))})(),Q.setCruisePoint(t.cruise.points);const e=Q.getAnimTargetPos(t.config||{});q(Q.camera,e,Q.controls.target).then((()=>{Q.controlSave()}))};let f;const k=w([]),$=()=>{d(t.models,(()=>{oe.get(ne.d3.park).then((async e=>{let i={};if(e.ConfigJson instanceof Object)i=e.ConfigJson;else if("string"==typeof e.ConfigJson)try{i=JSON.parse(e.ConfigJson)}catch(o){}k.value=e.JsonList,Object.keys(i).forEach((e=>{t.config&&(t.config[e]=i[e])})),await b(),f=h(ce),f.position.z=.16,f.rotation.z=.5*Math.PI,Q.addObject(f),(()=>{const e=h(de);e.traverse((e=>{e.isMesh&&(e.castShadow=!0)})),Q.addCharacter(e,{x:-80.6,y:.16,z:193.4})})(),Q.addVideoMaterial()}))}))},V=e=>{const i=[];Q.getAll().forEach(((e,o)=>{if(!e.data)return;const n=e.data;let r=n.type;if(r===t.dotKey)return void m(e);{const e=Be();if(!e)return;Object.keys(e).forEach((t=>{n[t]=e[t]}))}i.push(I(n));let{status:a=0,error:l=0,remote:c=0,local:d=0,disabled:h=0}=n;const u=s[l>0?"error":a>0?"runing":"normal"];(e=>{let{el:t,type:i,colorObj:o,color:n,paused:s}=e,r=J(n);n=r[0];const a=t.extra;a&&(a.action&&(a.action.paused=s),null!=n)&&(a.meshs||[]).forEach((e=>{W(e,n)}))})({type:r,el:e,colorObj:u,color:null!=u[r]?u[r]:u.color,paused:0==a,error:l>0,remote:c>0,local:d>0,disabled:h>0})}))};let Q;return C((()=>{_.container=n.value;const e="轿厢-ground";Q=new Re(_,{groundMeshName:["地面","楼板","mesh_0_4","ground",e],onDblclick:e=>{var t,i,o;"building_commercial_5"===(null==(t=e.data)?void 0:t.type)?u(null==(i=Q.buildingGroup)?void 0:i.children.filter((e=>!["地面","场景"].includes(e.name))),e,{wireframe:!0,opacity:.1}):p(null==(o=Q.buildingGroup)?void 0:o.children)},onClickLeft(e,t){if(e&&e.data){const t=e.data;switch(null==t?void 0:t.type){case ue:Q.videoPlay(e);break;case pe:case _e:Q.openTheDoor(e,t.type===_e);break;case me:Q.openTheDoubleSlidingDoor(e);break;case ge:Q.waitLift(e);break;case ye:Q.openTheSlidingDoor(e);break;case be:Q.lightSwitch(e)}}},onClickGround:(t,o)=>{Q.mouseClickGround(o).then((t=>{i.show=o.object.name===e}))},onClickRight:e=>{},onHoverAnchor:(e,t)=>{const i=!!e&&e.object._isAnchor_;if(o.show=i,i){o.style.top=t.top,o.style.left=t.left;const i=e.object.data;o.msg=`\n          <p>${i.name}</p>\n          <p>类型：${i.type}</p>\n          <p>绑定：${i.bind||"无"}</p>\n        `}}}),Q.run(),le(Q).resize(),$(),l(Q,t.skyCode)})),(e,s)=>{const r=F;return G(),O("div",{class:R(e.$style.page)},[z("div",Ie,[z("div",{class:"btn",onClick:s[0]||(s[0]=()=>V())},"随机更新"),z("div",{class:"btn",onClick:s[1]||(s[1]=()=>j(Q).toggleSight())},"人物视角切换"),z("div",{class:"btn",onClick:s[2]||(s[2]=()=>{var e;return null==(e=j(Q))?void 0:e.toggleCruise()})},"定点巡航"),z("div",{class:"btn",onClick:s[3]||(s[3]=()=>{var e;return null==(e=j(Q))?void 0:e.getPosition()})},"场景坐标"),z("div",{class:"btn",onClick:s[4]||(s[4]=()=>j(a)(j(Q)))},"切换背景"),z("div",{class:"btn",onClick:s[5]||(s[5]=()=>{var e;return null==(e=j(Q))?void 0:e.controlReset()})},"控制器重置"),z("div",{class:"btn",onClick:s[6]||(s[6]=()=>{var e;return null==(e=j(Q))?void 0:e.characterAccelerate()})},"人物加速"),z("div",{class:"btn",onClick:s[7]||(s[7]=()=>{var e;return null==(e=j(Q))?void 0:e.toggleCruiseDepthTest()})},"巡航深度")]),D(z("div",{class:R(e.$style["floor-select"])},[(G(!0),O(P,null,M(j(i).list,(e=>(G(),T(r,{type:"primary",disabled:j(i).active===e.key,onClick:t=>(e=>{i.active=e.key;const t="电梯门"+e.key;Q.waitLift({data:{bind:t,to:{y:e.y}}},!0)})(e)},{default:S((()=>[E(L(e.name),1)])),_:2},1032,["disabled","onClick"])))),256))],2),[[A,j(i).show]]),z("div",{class:R(e.$style.container),ref_key:"containerRef",ref:n},null,2),N(K,{modelValue:j(c).show,"onUpdate:modelValue":s[8]||(s[8]=e=>j(c).show=e),"bg-color":j(t).bgColor,progress:j(c).percentage},null,8,["modelValue","bg-color","progress"]),j(o).show?(G(),O("div",{key:0,class:R(e.$style.tip),style:B({left:j(o).style.left+"px",top:j(o).style.top+"px"})},[z("div",{class:R(e.$style.msg),innerHTML:j(o).msg},null,10,Fe)],6)):U("",!0)],2)}}}),[["__cssModules",{$style:{page:"_page_1m9si_2",container:"_container_1m9si_10","floor-select":"_floor-select_1m9si_14",tip:"_tip_1m9si_20",msg:"_msg_1m9si_29"}}]]);export{He as default};