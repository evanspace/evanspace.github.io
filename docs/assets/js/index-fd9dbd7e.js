var t=Object.defineProperty,e=(e,i,s)=>(((e,i,s)=>{i in e?t(e,i,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[i]=s})(e,"symbol"!=typeof i?i+"":i,s),s);import{bf as i,be as s,bs as o,ct as n,bS as r,c as a,bO as c,bh as l,e as h,Y as d,i as u,f as p,l as m,o as _,g,h as f,u as y,n as v,q as b,F as k,r as C,t as x,a7 as w,a8 as G,m as j,p as A,I as D,a9 as O,B as S,ak as P,aa as T}from"./vendor-16889df9.js";import{u as M,t as L}from"./css2d-3dcf2e48.js";import{S as z}from"./three-scene.module-24b3c661.js";import{c as E,i as B,j as $,k as N,h as I,d as F,e as R,f as U,g as H,a as W,l as K,b as J,m as V,r as q,s as Y}from"./model-3a962665.js";import{u as Q}from"./fence-d2aaa4a6.js";import{u as X,a as Z}from"./move-animate-17c323af.js";import{u as tt}from"./raycaster-7977e527.js";import{e as et,A as it,_ as st}from"./index-c95106e6.js";import{u as ot}from"./scene-resize-81793ab7.js";import{u as nt}from"./background-b37af10e.js";import{c as rt,d as at,g as ct,a as lt,b as ht,u as dt}from"./model-loader-8f6422bf.js";import{g as ut}from"./asssets-c6facb32.js";import{c as pt,g as mt,n as _t}from"./convert-17a5875b.js";import{a as gt,d as ft,i as yt,b as vt,c as bt}from"./object-fb68a4c2.js";import{r as kt}from"./random-8d361657.js";Symbol.toStringTag;const Ct="ANCHOR_POS",xt="ANCHOR_TARGET",wt="MAIN_SCENE",Gt="ROBOT",jt="CHARACTER",At="WAIT_LIFT",Dt="LIGHT_SWITCH",Ot="access_gate",St="GATE_SWITCH",Pt=.1,Tt=146,Mt=104,Lt=[];for(let ae=0;ae<5;ae++)Lt.push([Tt-20*ae,Pt,20*((0==ae?1:ae)-1)-104]),Lt.push([Tt-20*ae,Pt,Mt-20*ae]),Lt.push([20*ae-146,Pt,Mt-20*ae]),Lt.push([20*ae-146,Pt,20*ae-104]);const zt=300,{raycaster:Et,pointer:Bt,update:$t,style:Nt}=tt(),{initCSS2DRender:It,createCSS2DDom:Ft}=M(),{createDiffusion:Rt,updateDiffusion:Ut}=X(),{createMove:Ht,moveAnimate:Wt}=Z(),{createFence:Kt,fenceAnimate:Jt}=Q(),{keyboardPressed:Vt,destroyEvent:qt,insertEvent:Yt}=(()=>{const t=["shift","ctrl","alt","meta"],e={left:37,up:38,right:39,down:40,space:32,pageup:33,pagedown:34,tab:9},i={},s={};let o,n;const r=(t,e)=>{var o=t.keyCode;i[o]=e,s.shift=t.shiftKey,s.ctrl=t.ctrlKey,s.alt=t.altKey,s.meta=t.metaKey},a=t=>{r(t,!0),"function"==typeof o&&o(t)},c=t=>{r(t,!1),"function"==typeof n&&n(t)};document.addEventListener("keydown",a,!1),document.addEventListener("keyup",c,!1);const l=o=>{for(var n=o.split("+"),r=0;r<n.length;r++){var a=n[r];if(!(-1!==t.indexOf(a)?s[a]:-1!=Object.keys(e).indexOf(a)?i[e[a]]:i[a.toUpperCase().charCodeAt(0)]))return!1}return!0};return{keyboardPressed:t=>Array.isArray(t)?t.findIndex(l)>-1:l(t),insertEvent:(t,e)=>{o=t,n=e},destroyEvent:()=>{document.removeEventListener("keydown",a,!1),document.removeEventListener("keyup",c,!1)}}})(),{checkCollide:Qt}=(()=>{const t=new i,e=new s(0,2,0);return{checkCollide:(i,o,n,r=!0,a=e)=>{const c=o.clone().add(a),l=new s;i.getWorldDirection(l),l.normalize(),t.ray.origin.copy(c),t.ray.direction.copy(l);return t.intersectObjects(n,r)}}})(),Xt="FULL",Zt="NPC";class te extends z{constructor(t,i){super(t),e(this,"buildingGroup"),e(this,"anchorGroup"),e(this,"dotGroup"),e(this,"lightGroup"),e(this,"extend"),e(this,"css2DRender"),e(this,"mouseClickDiffusion"),e(this,"character"),e(this,"currentSight"),e(this,"historyTarget"),e(this,"historyCameraPosition"),e(this,"animateModels"),e(this,"moveFactor",1),e(this,"fence"),this.extend=i,this.css2DRender=It(this.options,this.container),this.css2DRender.domElement.className="three-scene__dot-wrap",this.mouseClickDiffusion=Rt(4,void 0,6),this.mouseClickDiffusion.rotation.x=.5*-Math.PI,this.mouseClickDiffusion.position.y=.5,this.mouseClickDiffusion.visible=!1,this.addObject(this.mouseClickDiffusion),this.createClock(),this.currentSight=Xt,this.historyTarget=new s,this.historyCameraPosition=new s,this.animateModels=[],this.bindEvent(),this.addBuildingGroup(),this.addAnchorGroup(),this.addDotGroup(),this.addLightGroup()}addBuildingGroup(){const t=new o;t.name="建筑组",this.buildingGroup=t,this.addObject(t)}clearBuilding(){this.buildingGroup&&this.disposeObj(this.buildingGroup),this.animateModels=[],this.addBuildingGroup(),this.clearAnchor(),this.clearDot()}addBuilding(...t){this.buildingGroup&&this.buildingGroup.add(...t)}addAnchorGroup(){const t=new o;t.name="锚点组",this.anchorGroup=t,this.addObject(t)}clearAnchor(){this.anchorGroup&&this.disposeObj(this.anchorGroup),this.addAnchorGroup()}addAnchor(t){this.anchorGroup&&this.anchorGroup.add(t);const{x:e,y:i,z:s}=t.position;N(t,[e,i,s],.2,8)}addDotGroup(){const t=new o;t.name="点位组",this.dotGroup=t,this.scene.add(t)}clearDot(){this.dotGroup&&this.disposeObj(this.dotGroup),this.addDotGroup()}addDot(t,e){var i;const s=t.position,{size:o,color:n}=t.font||{},{x:r=0,y:a=0,z:c=0}=s||{},l=Ft({name:`\n        <div class="bg"></div>\n        <span class="inner" style="${null!=o?`font-size: ${"string"==typeof o?o:o+"px"};`:""} ${null!=n?`color: ${n}`:""}"></span>\n      `,className:"dot-2D-label",position:[r,a,c],onClick:e});return l.name=t.name,l.data=t,l._position_={x:r,y:a,z:c},null==(i=this.dotGroup)||i.add(l),l}addLightGroup(){const t=new o;t.name="灯光组",this.lightGroup=t,this.addObject(t)}clearLightGroup(){this.lightGroup&&this.disposeObj(this.lightGroup),this.addLightGroup()}addLight(t,e,i){if(this.lightGroup){e.name=t.name;const{to:s={x:0,y:0,z:0}}=t;if(e.target.position.set(s.x,s.y,s.z),this.lightGroup.add(e),i){const t=new n(e,e.color);this.lightGroup.add(t)}}}addCharacter(t,e){const{x:i,y:s,z:o}=e;t.position.set(i,s,o),this.character=t;const n=t.animations,a=new r(t),c={};for(let r=0;r<n.length;r++){const t=n[r],e=a.clipAction(t);c[t.name]=e}c.Dance.play();const l=c.Walking;t.extra={mixer:a,actions:c,runging:l},this.addObject(t);const h=["W","S"].map((t=>t.toUpperCase().charCodeAt(0)));Yt((e=>{t.__runing__||h.includes(e.keyCode)&&l.play()}),(e=>{t.__runing__||h.includes(e.keyCode)&&l.stop()}))}toggleSight(){if(this.judgeCruise())return;const t=this.currentSight==Xt?Zt:Xt;this.currentSight=t;const e=t===Zt;if(!this.controls)return;if(this.controls.maxDistance=e?10:800,this.controls.screenSpacePanning=!e,this.controls.enablePan=!e,this.controls.maxPolarAngle=Math.PI*(e?.8:.48),!this.character)return;const i=this.character.position,o=new s(0,1.5,0);if(e){a.success({message:"鼠标点击地面移动，或键盘 W、S 前后移动，A、D调整左右方向！",duration:15e3}),this.historyTarget=this.controls.target.clone(),this.historyCameraPosition=this.camera.position.clone();const t=i.clone().add(o);this.camera.lookAt(t)}else this.camera.position.copy(this.historyCameraPosition),this.camera.lookAt(i);const n=(e?i:this.historyTarget).clone().add(o);this.controls.target.copy(n)}isPerspectives(){return this.currentSight==Zt}characterAccelerate(t=1){this.moveFactor+=t,this.moveFactor>=10?this.moveFactor=10:this.moveFactor<=1&&(this.moveFactor=1),a.success({message:"人物速度："+this.moveFactor,grouping:!0})}setControlTarget(t){this.controls&&(this.controls.target.copy(t.clone().add(new s(0,1.5,0))),this.camera.lookAt(this.controls.target))}waitLift(t,e,i){var s;const o=this.scene.getObjectByName(e),n=null==(s=t.data)?void 0:s.to;if(!o||!n)return;const r=o.position;if(n.y!=r.y){const s=o.__bind_lift__;void 0!==s&&this.openTheDoubleSlidingDoor({data:{bind:s}},200,!1),this.openTheDoubleSlidingDoor({data:{bind:e}},4,!1).then((()=>{new c(r).to({y:n.y},1500).delay(0).start().onUpdate((t=>{if(i){if(!this.character)return;this.character.position.y=t.y,this.camera.position.y=t.y,this.setControlTarget(this.character.position)}})).onComplete((()=>{o.__bind_lift__=t.data.bind,this.openLift(t,e)}))}))}else this.openLift(t,e)}openLift(t,e){this.openTheDoubleSlidingDoor(t,60),this.openTheDoubleSlidingDoor({data:{bind:e}},1.2)}lightSwitch(t){var e,i;const s=null==(i=this.lightGroup)?void 0:i.getObjectsByProperty("name",null==(e=t.data)?void 0:e.bind);s&&s.forEach((t=>{t.visible=!t.visible}))}openTheDoubleSlidingDoor(t,e=400,i){const o=this.scene.getObjectByName(t.data.bind);if(!o)return Promise.reject();const n=o.children.find((t=>t.name.indexOf("左")>-1)),r=o.children.find((t=>t.name.indexOf("右")>-1)),a=n.position,l=r.position;return null==o.__open__&&(n.__position__=(new s).copy(a),r.__position__=(new s).copy(l)),o.__open__=void 0!==i?i:!o.__open__,new Promise((t=>{const i=r.__position__.x+(o.__open__?e:0);if(l.x===i)return t(o);new c(a).to({x:n.__position__.x+(o.__open__?-e:0)},1e3).delay(0).start(),new c(l).to({x:i},1e3).delay(0).start().onComplete((()=>{t(o)}))}))}openGate(t){const e=this.scene.getObjectByName(t.data.bind);if(!e)return;clearTimeout(t.__timer__);const i=e.getObjectByName("左-玻璃"),o=e.getObjectByName("右-玻璃"),n=i.position,r=o.position;null==e.__open__&&(i.__position__=(new s).copy(n),o.__position__=(new s).copy(r)),e.__open__=!e.__open__;new c(i.rotation).to({z:e.__open__?.5*Math.PI:0},1500).delay(0).start(),new c(o.rotation).to({z:e.__open__?.5*-Math.PI:0},1500).delay(0).start(),e.__open__&&(t.__timer__=setTimeout((()=>{this.openGate(t)}),3500))}mouseClickGround(t,e){if(this.currentSight!==Zt)return Promise.reject();const i=this.character;if(!i)return Promise.reject();const{runing:s}=this.options.cruise;if(s)return Promise.reject();const o=t.point,n=this.mouseClickDiffusion,{runging:r}=i.extra;return r.play(),n.position.copy(o),n.visible=!0,i.__runing__=!0,new Promise((s=>{Ht(i,o,((s,o)=>{this.setControlTarget(s),this.checkCharacterCollide(s,t.object.name===e?2:.14)&&(o(),r.stop(),i.__runing__=!1,n.visible=!1)}),(t=>{this.setControlTarget(t),r.stop(),i.__runing__=!1,n.visible=!1,s(i)}))}))}checkCharacterCollide(t,e=.14){var i;if(!this.character)return;const o=Qt(this.character,t,null==(i=this.buildingGroup)?void 0:i.children,!0,new s(0,e,0));if(o.length){if(o[0].distance<.2)return a.warning({message:"撞到了！",grouping:!0}),!0}}cameraLookatMoveTo(t){this.controls&&$(this.camera,t,this.controls.target)}judgeCruise(){return!!this.options.cruise.runing&&(a.warning({message:"请退出巡航！",grouping:!0}),!0)}addModelAnimate(t,e=[],i=!0,s=1){if(!e.length)return;const o=new r(t),n=e.reduce(((t,e)=>{const n=e.name||"";return t[n]=o.clipAction(e),i&&t[n].play(),t[n].timeScale=s,t}),{});t.__action__=n,t.__mixer__=o,this.animateModels.push(t)}cameraTransition(t){var e;if(this.judgeCruise())return;if(this.mouseClickDiffusion.visible)return void a.warning({message:"人物移动中，不可操作！",grouping:!0});this.isPerspectives()&&this.toggleSight();const{to:i,target:s=t.position}=t.data;if(!i)return;this.isCameraMove(i)||B(this.controls,this.camera,i,s);const{bind:o}=t.data;if(!o)return;const n=null==(e=this.buildingGroup)?void 0:e.getObjectByName(o);this.addFence(n)}addFence(t){if(this.fence&&(this.disposeObj(this.fence),this.fence=void 0),t){const e=Kt(t,5439406);this.fence=e,this.addObject(e)}}modelAnimate(){var t,e,i;this.css2DRender.render(this.scene,this.camera),"function"==typeof this.extend.animateCall&&this.extend.animateCall(),this.restoreAnchorMaterial();let o=null==(t=this.clock)?void 0:t.getDelta();if(this.animateModels.length&&this.animateModels.forEach((t=>{t.__mixer__&&t.__mixer__.update(o)})),null==(e=this.anchorGroup)||e.children.forEach((t=>{t.__mixer__&&t.__mixer__.update(o)})),this.character){this.character.extra.mixer.update(o),Wt(.2*this.moveFactor)}if(this.mouseClickDiffusion.visible&&Ut(),Jt(),this.isPerspectives()&&!(null==(i=this.character)?void 0:i.__runing__)){const t=10*o,e=.2*Math.PI*o,i=this.character;if(!i)return;const n=Vt("S");if(Vt("W")||n){const e=new s;null==i||i.getWorldDirection(e);const o=e.clone().multiplyScalar(n?-t:t),r=(null==i?void 0:i.position.clone().add(o))||new s;this.checkCharacterCollide(r)||(null==i||i.position.copy(r),this.setControlTarget(null==i?void 0:i.position))}Vt("A")?i.rotation.y+=e:Vt("D")&&(i.rotation.y-=e)}}onPointerMove(t){this.checkIntersectObjects(t)}onPointerUp(t){var e;super.onPointerUp(t);const i=t.timeStamp-this.pointer.tsp<zt;2==t.button?i&&"function"==typeof(null==(e=this.extend)?void 0:e.onClickRight)&&this.extend.onClickRight(t):0==t.button?i&&this.checkIntersectObjects(t):t.button}checkIntersectObjects(t){var e,i,s,o,n;const r=this.container,a=this.options.scale;$t(t,r,a);let c="pointerdown"==t.type||"pointerup"==t.type;const l=(null==(i=this.buildingGroup)?void 0:i.children.filter((t=>t.visible&&(c||t.__ground__))).concat((null==(e=this.anchorGroup)?void 0:e.children)||[]))||[];Et.setFromCamera(Bt,this.camera);let h=Et.intersectObjects(l,c);if(c)if(r.style.cursor="auto",h.length){const t=h[0],e=t.object,i="string"==typeof e.name&&(this.extend.groundMeshName||[]).some((t=>e.name.indexOf(t)>-1)),n=this.findParentGroup(e);if(i&&"function"==typeof(null==(s=this.extend)?void 0:s.onClickGround)&&this.extend.onClickGround(n,t),!n)return;"function"==typeof(null==(o=this.extend)?void 0:o.onClickLeft)&&this.extend.onClickLeft(n,t)}else"function"==typeof(null==(n=this.extend)?void 0:n.onClickLeft)&&this.extend.onClickLeft();else this.hoverAnchor(h)}hoverAnchor(t){var e,i;if("function"==typeof this.extend.onHoverAnchor&&this.extend.onHoverAnchor(t[0],Nt),t.length){const i=t[0].object;if(this.container.style.cursor=i._isAnchor_?"pointer":"auto",!i._isAnchor_)return;const s=i.material;void 0===i.__mat_color__&&(i.__mat_color__=s.color),s.color=new l(16715760),null==(e=this.anchorGroup)||e.children.forEach((t=>{t.__change_color__=t.uuid===i.uuid}))}else this.container.style.cursor="auto",null==(i=this.anchorGroup)||i.children.forEach((t=>{t.__change_color__=!1}))}restoreAnchorMaterial(){var t;null==(t=this.anchorGroup)||t.traverse((t=>{t.isSprite&&!t.__change_color__&&t.__mat_color__&&(t.material.color=t.__mat_color__)}))}findParentGroup(t){const e=t=>{if(t._isBuilding_)return t;let i=t.parent;return i?i&&i._isBuilding_?i:e(i):void 0};return e(t)}getAll(){var t,e;return(null==(e=this.buildingGroup)?void 0:e.children.concat((null==(t=this.dotGroup)?void 0:t.children)||[]))||[]}resize(){super.resize();const{width:t,height:e}=this.options;this.css2DRender.setSize(t,e)}dispose(){qt(),this.animateModels=[],this.disposeObj(this.buildingGroup),this.disposeObj(this.character),this.disposeObj(this.dotGroup),this.disposeObj(this.anchorGroup),this.disposeObj(this.fence),this.disposeObj(this.lightGroup),this.disposeObj(this.mouseClickDiffusion),this.clock=void 0,this.css2DRender=void 0,this.buildingGroup=void 0,this.character=void 0,this.dotGroup=void 0,this.anchorGroup=void 0,this.lightGroup=void 0,this.fence=void 0,this.mouseClickDiffusion=void 0,this.extend={},super.dispose()}}const ee=(t,e)=>{const i=40*Math.random();return void 0!==i&&(t.value=i),t.show=Math.random()>.5,t.value=Number(Number(t.value||0).toFixed(2)),{value:t.value,show:t.show,font:{...t.font||{},color:"#"+(16777215+1e6*i).toString(16).substring(0,6)}}},ie={class:"scene-operation"},se=["onClick"],oe=["innerHTML"],ne="单元1号电梯",re=st(h({__name:"index",setup(t){const e=d((i=(t,e,i,o)=>{if(!H)return;(o+=.005)>1&&(o-=1),t=((t,e=0)=>new s(t.x,t.y+e,t.z))(i.getPointAt(o));let n=o+.001;n>1&&(n-=1),e=i.getPointAt(n),H.position.set(t.x,Pt,t.z);const r=Math.atan2(-e.z+t.z,e.x-t.x);H.rotation.z=.5*Math.PI+r},{devEnv:!0,baseUrl:"",bgColor:"",skyCode:"221",env:"/oss/textures/hdr/3.hdr",config:{},dotKey:"DOT",dotShowStrict:!1,anchorType:[Ct,xt,At,Dt,St],animationModelType:[wt],models:[{key:wt,name:"场景",size:3.1,url:"/电梯.glb"},{key:Ot,name:"闸机",size:.3,url:"/闸机.glb"},{key:Ct,name:"定位",type:"sprite",range:{x:4,y:4},mapUrl:"/pos.png"},{key:xt,name:"锚点",type:"sprite",range:{x:4,y:4},mapUrl:"/dw.png"},{key:At,name:"电梯门",type:"sprite",range:{x:1,y:1},mapUrl:"/lift.png"},{key:St,name:"闸机",type:"sprite",range:{x:1,y:1},mapUrl:"/gate.png"},{key:Gt,name:"机器人",size:.3,url:"/oss/model/park/机器人.glb"},{key:jt,name:"人物",size:2.2,url:"/oss/model/park/RobotExpressive.glb"},{key:"spot_light_floor_2",type:"spotlight",name:"聚光灯",intensity:8,color:57599,distance:8},{key:Dt,name:"开关灯",type:"sprite",range:{x:1.2,y:1.2},mapUrl:"/light.png"}].map((t=>(t.url&&t.url.indexOf("oss")<0&&(t.url="/oss/model/office"+t.url),t.mapUrl&&(t.mapUrl="/oss/textures/office"+t.mapUrl),t))),cruise:{visible:!0,auto:!0,mapUrl:"/oss/textures/cruise/line18.png",repeat:[1,1],width:2,segment:30,tension:.01,speed:1,mapSpeed:.01,points:Lt,close:!1,offset:5.2,animateBack:i}}));var i;const o=d({active:1,show:!1,list:[{name:"一楼",key:1,y:.2},{name:"二楼",key:2,y:13.8},{name:"三楼",key:3,y:19.83},{name:"五楼",key:5,y:31.76}]}),n=d({show:!1,style:{left:0,top:0},msg:""}),{changeBackground:r,backgroundLoad:a}=nt(),{progress:c,loadModels:l,getModel:h}=dt({baseUrl:e.baseUrl,indexDB:{cache:!0,dbName:"THREE__OFFICE__DB",tbName:"TB",version:15}}),M=u(),z={env:e.env,cruise:e.cruise,controls:{visible:!0,enableDamping:!0,dampingFactor:.48,maxPolarAngle:.48*Math.PI,screenSpacePanning:!1,maxDistance:800},camera:{},directionalLight:{},axes:{visible:!0}};let B;const $=t=>{var i;const s=t.data;{const t=ee(s,B.buildingGroup);"object"==typeof t&&Object.keys(t).forEach((e=>{s[e]=t[e]}))}t.visible=s.show||!e.dotShowStrict;const o=null==(i=t.element)?void 0:i.getElementsByClassName("inner")[0];if(o){const{size:t,color:e}=s.font||{};null!=t&&(o.style.fontSize="string"==typeof t?t:t+"px"),null!=e&&(o.style.color=e),o.textContent=`${s.value||0}${s.unit}`}},N=async t=>{if(!t)return;const{type:i}=t,s=h(i);if(!s)return void(i===e.dotKey&&(t=>{$(B.addDot(t,(e=>{B.cameraLookatMoveTo(t.position)})))})(t));const{anchorType:o=[],animationModelType:n=[]}=e;let r=V(s);const{position:a,scale:c,rotation:l}=J(r,t),[d,u,p]=a;return r.scale.set(...c),r.position.set(d,u,p),r.rotation.set(...l),r._isBuilding_=!0,r.data=t,n.includes(i)&&B.addModelAnimate(r,s.animations,!0,1),i===Ot&&(r.name=t.name),o.includes(i)?(r._isAnchor_=!0,B.addAnchor(r)):r.isSpotLight?B.addLight(t,r,!0):B.addBuilding(r),Promise.resolve()},I=async()=>{c.percentage=100,c.show=!1,B.clearBuilding(),await T(),await(()=>{let t=0,e=F.value.length;return new Promise((i=>{if(0==e)return i(null);const s=async()=>{const o=F.value[t];await N(o),t++,t<e?s():i(t)};s()}))})(),B.setCruisePoint(e.cruise.points);const t=B.getValidTargetPosition(e.config||{});E(B.camera,t,B.controls.target).then((()=>{B.controlSave()}))},F=u([]),R=p((()=>F.value.filter((t=>t.type===Ct)))),U=()=>{l(e.models,(()=>{et.get(it.d3.office).then((async t=>{let i={};if(t.ConfigJson instanceof Object)i=t.ConfigJson;else if("string"==typeof t.ConfigJson)try{i=JSON.parse(t.ConfigJson)}catch(s){}F.value=t.JsonList,Object.keys(i).forEach((t=>{e.config&&(e.config[t]=i[t])})),await I(),W(),K()}))}))};let H;const W=()=>{H=h(Gt),H.position.z=Pt,H.rotation.z=.5*Math.PI,B.addObject(H)},K=()=>{const t=h(jt);t.traverse((t=>{t.isMesh&&(t.castShadow=!0)}));t.scale.setScalar(.5),B.addCharacter(t,{x:0,y:0,z:0})};return m((()=>{z.container=M.value;const t="轿厢-ground";B=new te(z,{groundMeshName:["ground",t],onClickLeft:(t,e)=>{if(t&&t.data){const e=t.data;switch(null==e?void 0:e.type){case Ct:B.cameraTransition(t);break;case At:B.waitLift(t,ne);break;case Dt:B.lightSwitch(t);break;case St:B.openGate(t)}}},onClickGround:(e,i)=>{B.mouseClickGround(i,t).then((e=>{o.show=i.object.name===t})).catch((()=>{}))},onHoverAnchor:(t,e)=>{const i=!!t&&t.object._isAnchor_;if(n.show=i,i){n.style.top=e.top,n.style.left=e.left;const i=t.object.data;n.msg=`\n          <p>${i.name}</p>\n          <p>类型：${i.type}</p>\n          <p>绑定：${i.bind||"无"}</p>\n        `}}}),B.run(),ot(B).resize(),U(),a(B,e.skyCode)})),(t,i)=>{const s=P;return _(),g("div",{class:v(t.$style.page)},[f("div",ie,[f("div",{class:"btn",onClick:i[0]||(i[0]=()=>{B.getAll().forEach(((t,i)=>{t.data&&(t.data.type!==e.dotKey||$(t))}))})},"随机更新"),f("div",{class:"btn",onClick:i[1]||(i[1]=()=>{var t;return null==(t=y(B))?void 0:t.getPosition()})},"场景坐标"),f("div",{class:"btn",onClick:i[2]||(i[2]=()=>y(r)(y(B)))},"切换背景")]),f("div",{class:v(t.$style.container),ref_key:"containerRef",ref:M},null,2),b(L,{modelValue:y(c).show,"onUpdate:modelValue":i[3]||(i[3]=t=>y(c).show=t),progress:y(c).percentage},null,8,["modelValue","progress"]),f("div",{class:v(t.$style.camera)},[(_(!0),g(k,null,C(y(R),(e=>(_(),g("div",{class:v(t.$style.item),onClick:t=>(t=>{B.cameraTransition({position:t.position,data:t})})(e)},x(e.name),11,se)))),256)),f("div",{class:v(t.$style.item),onClick:i[4]||(i[4]=()=>{var t;return null==(t=y(B))?void 0:t.toggleCruise()})},"定点巡航",2),f("div",{class:v(t.$style.item),onClick:i[5]||(i[5]=()=>{var t;return null==(t=y(B))?void 0:t.controlReset()})},"视角重置",2),f("div",{class:v(t.$style.item),onClick:i[6]||(i[6]=()=>y(B).toggleSight())},"人物视角",2),f("div",{class:v(t.$style.item),onClick:i[7]||(i[7]=()=>y(B).characterAccelerate())},"人物加速",2),f("div",{class:v(t.$style.item),onClick:i[8]||(i[8]=()=>y(B).characterAccelerate(-1))},"人物减速",2)],2),w(f("div",{class:v(t.$style["floor-select"])},[(_(!0),g(k,null,C(y(o).list,(t=>(_(),j(s,{type:"primary",disabled:y(o).active===t.key,onClick:e=>(t=>{o.active=t.key;const e="电梯门"+t.key;B.waitLift({data:{bind:e,to:{y:t.y}}},ne,!0)})(t)},{default:A((()=>[D(x(t.name),1)])),_:2},1032,["disabled","onClick"])))),256))],2),[[G,y(o).show]]),y(n).show?(_(),g("div",{key:0,class:v(t.$style.tip),style:O({left:y(n).style.left+"px",top:y(n).style.top+"px"})},[f("div",{class:v(t.$style.msg),innerHTML:y(n).msg},null,10,oe)],6)):S("",!0)],2)}}}),[["__cssModules",{$style:{page:"_page_1sasb_2",container:"_container_1sasb_10","floor-select":"_floor-select_1sasb_14",tip:"_tip_1sasb_20",msg:"_msg_1sasb_30",camera:"_camera_1sasb_38",item:"_item_1sasb_45"}}]]);export{re as default};