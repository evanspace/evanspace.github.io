var t=Object.defineProperty,e=(e,i,s)=>(((e,i,s)=>{i in e?t(e,i,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[i]=s})(e,"symbol"!=typeof i?i+"":i,s),s);import{b7 as i,be as s,bs as o,d2 as n,cw as a,c as r,cm as c,bh as l,e as h,Y as d,i as u,f as p,l as m,o as g,g as _,h as f,u as y,n as b,q as v,F as k,r as x,t as C,a7 as w,a8 as G,m as j,p as D,I as O,a9 as A,B as S,ak as T,aa as P}from"./vendor-a6dc29a3.js";import{u as M,t as z}from"./css2d-eec57338.js";import{T as L,u as B}from"./scene-resize-46f23ed0.js";import{u as $}from"./raycaster-0fb433c0.js";import{u as E,a as N}from"./move-animate-51ecb3d0.js";import{u as F}from"./fence-f4feeecc.js";import{j as R,k as I,l as U,c as H,d as J,b as V}from"./model-a663f9ee.js";import{e as W,A as K,_ as q}from"./index-b0c68379.js";import{u as Y}from"./background-c7faf259.js";import{u as Z}from"./model-loader-d0c7c921.js";import"./config-9a637eb0.js";import"./posZ-54c73ffc.js";const Q="ANCHOR_POS",X="ANCHOR_TARGET",tt="MAIN_SCENE",et="ROBOT",it="CHARACTER",st="WAIT_LIFT",ot="LIGHT_SWITCH",nt="access_gate",at="GATE_SWITCH",rt=.1,ct=146,lt=104,ht=[];for(let Mt=0;Mt<5;Mt++)ht.push([ct-20*Mt,rt,20*((0==Mt?1:Mt)-1)-104]),ht.push([ct-20*Mt,rt,lt-20*Mt]),ht.push([20*Mt-146,rt,lt-20*Mt]),ht.push([20*Mt-146,rt,20*Mt-104]);const dt=300,{raycaster:ut,pointer:pt,update:mt,style:gt}=$(),{initCSS2DRender:_t,createCSS2DDom:ft}=M(),{createDiffusion:yt,updateDiffusion:bt}=E(),{createMove:vt,moveAnimate:kt}=N(),{createFence:xt,fenceAnimate:Ct}=F(),wt="FULL",Gt="NPC";class jt extends L{constructor(t,o){super(t),e(this,"buildingGroup"),e(this,"anchorGroup"),e(this,"dotGroup"),e(this,"lightGroup"),e(this,"extend"),e(this,"css2DRender"),e(this,"mouseClickDiffusion"),e(this,"character"),e(this,"clock"),e(this,"currentSight"),e(this,"historyTarget"),e(this,"historyCameraPosition"),e(this,"animateModels"),e(this,"moveFactor",1),e(this,"fence"),this.extend=o,this.css2DRender=_t(this.options,this.container),this.css2DRender.domElement.className="three-scene__dot-wrap",this.mouseClickDiffusion=yt(4,void 0,6),this.mouseClickDiffusion.rotation.x=.5*-Math.PI,this.mouseClickDiffusion.position.y=.5,this.mouseClickDiffusion.visible=!1,this.addObject(this.mouseClickDiffusion),this.clock=new i,this.currentSight=wt,this.historyTarget=new s,this.historyCameraPosition=new s,this.animateModels=[],this.bindEvent(),this.addBuildingGroup(),this.addAnchorGroup(),this.addDotGroup(),this.addLightGroup()}addBuildingGroup(){const t=new o;t.name="建筑组",this.buildingGroup=t,this.addObject(t)}clearBuilding(){this.buildingGroup&&this.disposeObj(this.buildingGroup),this.animateModels=[],this.addBuildingGroup(),this.clearAnchor(),this.clearDot()}addBuilding(...t){this.buildingGroup&&this.buildingGroup.add(...t)}addAnchorGroup(){const t=new o;t.name="锚点组",this.anchorGroup=t,this.addObject(t)}clearAnchor(){this.anchorGroup&&this.disposeObj(this.anchorGroup),this.addAnchorGroup()}addAnchor(t){this.anchorGroup&&this.anchorGroup.add(t);const{x:e,y:i,z:s}=t.position;R(t,[e,i,s],.2,8)}addDotGroup(){const t=new o;t.name="点位组",this.dotGroup=t,this.scene.add(t)}clearDot(){this.dotGroup&&this.disposeObj(this.dotGroup),this.addDotGroup()}addDot(t,e){const i=t.position,{size:s,color:o}=t.font||{},{x:n=0,y:a=0,z:r=0}=i||{},c=ft({name:`\n        <div class="bg"></div>\n        <span class="inner" style="${null!=s?`font-size: ${"string"==typeof s?s:s+"px"};`:""} ${null!=o?`color: ${o}`:""}"></span>\n      `,className:"dot-2D-label",position:[n,a,r],onClick:e});return c.name=t.name,c.data=t,c._position_={x:n,y:a,z:r},this.dotGroup.add(c),c}addLightGroup(){const t=new o;t.name="灯光组",this.lightGroup=t,this.addObject(t)}clearLightGroup(){this.lightGroup&&this.disposeObj(this.lightGroup),this.addLightGroup()}addLight(t,e,i){if(this.lightGroup){e.name=t.name;const{to:s={x:0,y:0,z:0}}=t;if(e.target.position.set(s.x,s.y,s.z),this.lightGroup.add(e),i){const t=new n(e,e.color);this.lightGroup.add(t)}}}addCharacter(t,e){const{x:i,y:s,z:o}=e;t.position.set(i,s,o),this.character=t;const n=t.animations,r=new a(t),c={};for(let a=0;a<n.length;a++){const t=n[a],e=r.clipAction(t);c[t.name]=e}c.Dance.play();const l=c.Walking;t.extra={mixer:r,actions:c,runging:l},this.addObject(t)}toggleSight(){if(this.judgeCruise())return;const t=this.currentSight==wt?Gt:wt;this.currentSight=t;const e=t===Gt;this.controls.maxDistance=e?10:800,this.controls.screenSpacePanning=!e,this.controls.enablePan=!e;const i=this.controls.target,o=this.character.position;if(e){const{x:t,y:e,z:n}=i;this.historyTarget=new s(t,e,n);const{x:a,y:r,z:c}=this.camera.position;this.historyCameraPosition=new s(a,r,c);const{x:l,y:h,z:d}=o;this.camera.lookAt(new s(l,h+1.5,d))}else{const{x:t,y:e,z:i}=this.historyCameraPosition;this.camera.position.set(t,e,i),this.camera.lookAt(o)}const{x:n,y:a,z:r}=e?o:this.historyTarget;i.set(n,a,r)}isPerspectives(){return this.currentSight==Gt}characterAccelerate(t=1){this.moveFactor+=t,this.moveFactor>=10?this.moveFactor=10:this.moveFactor<=1&&(this.moveFactor=1),r.success({message:"人物速度："+this.moveFactor,grouping:!0})}setControlTarget(t){const{x:e,y:i,z:s}=t;this.controls.target.set(e,i+1.5,s),this.camera.lookAt(this.controls.target)}waitLift(t,e,i){var s;const o=this.scene.getObjectByName(e),n=null==(s=t.data)?void 0:s.to;if(!o||!n)return;const a=o.position;if(n.y!=a.y){const s=o.__bind_lift__;void 0!==s&&this.openTheDoubleSlidingDoor({data:{bind:s}},200,!1),this.openTheDoubleSlidingDoor({data:{bind:e}},4,!1).then((()=>{new c(a).to({y:n.y},1500).delay(0).start().onUpdate((t=>{i&&(this.character.position.y=t.y,this.camera.position.y=t.y,this.setControlTarget(this.character.position))})).onComplete((()=>{o.__bind_lift__=t.data.bind,this.openLift(t,e)}))}))}else this.openLift(t,e)}openLift(t,e){this.openTheDoubleSlidingDoor(t,60),this.openTheDoubleSlidingDoor({data:{bind:e}},1.2)}lightSwitch(t){var e;this.lightGroup.getObjectsByProperty("name",null==(e=t.data)?void 0:e.bind).forEach((t=>{t.visible=!t.visible}))}openTheDoubleSlidingDoor(t,e=400,i){const o=this.scene.getObjectByName(t.data.bind);if(!o)return Promise.reject();const n=o.children.find((t=>t.name.indexOf("左")>-1)),a=o.children.find((t=>t.name.indexOf("右")>-1)),r=n.position,l=a.position;return null==o.__open__&&(n.__position__=(new s).copy(r),a.__position__=(new s).copy(l)),o.__open__=void 0!==i?i:!o.__open__,new Promise((t=>{const i=a.__position__.x+(o.__open__?e:0);if(l.x===i)return t(o);new c(r).to({x:n.__position__.x+(o.__open__?-e:0)},1e3).delay(0).start(),new c(l).to({x:i},1e3).delay(0).start().onComplete((()=>{t(o)}))}))}openGate(t){const e=this.scene.getObjectByName(t.data.bind);if(!e)return;const i=e.getObjectByName("左-玻璃"),o=e.getObjectByName("右-玻璃"),n=i.position,a=o.position;null==e.__open__&&(i.__position__=(new s).copy(n),o.__position__=(new s).copy(a)),e.__open__=!e.__open__,new c(i.rotation).to({y:e.__open__?.5*Math.PI:0},1500).delay(0).start(),new c(o.rotation).to({z:e.__open__?.5*Math.PI:0},1500).delay(0).start()}mouseClickGround(t){if(this.currentSight!==Gt)return Promise.reject();const e=this.character;if(!e)return Promise.reject();const{runing:i}=this.options.cruise;if(i)return Promise.reject();const s=t.point,o=this.mouseClickDiffusion,{runging:n}=e.extra;n.play();const{x:a,y:r,z:c}=s;return o.position.set(a,r,c),o.visible=!0,new Promise((t=>{vt(e,s,(t=>{this.setControlTarget(t)}),(i=>{this.setControlTarget(i),n.stop(),o.visible=!1,t(e)}))}))}cameraLookatMoveTo(t){I(this.camera,t,this.controls.target)}judgeCruise(){return!!this.options.cruise.runing&&(r.warning({message:"请退出巡航！",grouping:!0}),!0)}addModelAnimate(t,e=[],i=!0,s=1){if(!e.length)return;const o=new a(t),n=e.reduce(((t,e)=>{const n=e.name||"";return t[n]=o.clipAction(e),i&&t[n].play(),t[n].timeScale=s,t}),{});t.__action__=n,t.__mixer__=o,this.animateModels.push(t)}cameraTransition(t){var e;if(this.judgeCruise())return;if(this.mouseClickDiffusion.visible)return void r.warning({message:"人物移动中，不可操作！",grouping:!0});this.isPerspectives()&&this.toggleSight();const{to:i,target:s=t.position}=t.data;if(!i)return;this.isCameraMove(i)||U(this.controls,this.camera,i,s);const{bind:o}=t.data;if(!o)return;const n=null==(e=this.buildingGroup)?void 0:e.getObjectByName(o);this.addFence(n)}addFence(t){if(this.fence&&(this.disposeObj(this.fence),this.fence=void 0),t){const e=xt(t,5439406);this.fence=e,this.addObject(e)}}modelAnimate(){this.css2DRender.render(this.scene,this.camera),"function"==typeof this.extend.animateCall&&this.extend.animateCall(),this.restoreAnchorMaterial();let t=this.clock.getDelta();if(this.animateModels.length&&this.animateModels.forEach((e=>{e.__mixer__&&e.__mixer__.update(t)})),this.anchorGroup.children.forEach((e=>{e.__mixer__&&e.__mixer__.update(t)})),this.character){this.character.extra.mixer.update(t),kt(.2*this.moveFactor)}this.mouseClickDiffusion.visible&&bt(),Ct()}onPointerMove(t){this.checkIntersectObjects(t)}onPointerUp(t){var e;super.onPointerUp(t);const i=t.timeStamp-this.pointer.tsp<dt;2==t.button?i&&"function"==typeof(null==(e=this.extend)?void 0:e.onClickRight)&&this.extend.onClickRight(t):0==t.button?i&&this.checkIntersectObjects(t):t.button}checkIntersectObjects(t){var e,i,s;const o=this.container,n=this.options.scale;mt(t,o,n);let a="pointerdown"==t.type||"pointerup"==t.type;const r=this.buildingGroup.children.filter((t=>t.visible&&(a||t.__ground__))).concat(this.anchorGroup.children);ut.setFromCamera(pt,this.camera);let c=ut.intersectObjects(r,a);if(a)if(o.style.cursor="auto",c.length){const t=c[0],s=t.object,o="string"==typeof s.name&&(this.extend.groundMeshName||[]).some((t=>s.name.indexOf(t)>-1)),n=this.findParentGroup(s);if(o&&"function"==typeof(null==(e=this.extend)?void 0:e.onClickGround)&&this.extend.onClickGround(n,t),!n)return;"function"==typeof(null==(i=this.extend)?void 0:i.onClickLeft)&&this.extend.onClickLeft(n,t)}else"function"==typeof(null==(s=this.extend)?void 0:s.onClickLeft)&&this.extend.onClickLeft();else this.hoverAnchor(c)}hoverAnchor(t){if("function"==typeof this.extend.onHoverAnchor&&this.extend.onHoverAnchor(t[0],gt),t.length){const e=t[0].object;if(this.container.style.cursor=e._isAnchor_?"pointer":"auto",!e._isAnchor_)return;const i=e.material;void 0===e.__mat_color__&&(e.__mat_color__=i.color),i.color=new l(16715760),this.anchorGroup.children.forEach((t=>{t.__change_color__=t.uuid===e.uuid}))}else this.container.style.cursor="auto",this.anchorGroup.children.forEach((t=>{t.__change_color__=!1}))}restoreAnchorMaterial(){this.anchorGroup.traverse((t=>{t.isSprite&&!t.__change_color__&&t.__mat_color__&&(t.material.color=t.__mat_color__)}))}findParentGroup(t){const e=t=>{if(t._isBuilding_)return t;let i=t.parent;return i?i&&i._isBuilding_?i:e(i):void 0};return e(t)}getAll(){return this.buildingGroup.children.concat(this.dotGroup.children)}resize(){super.resize();const{width:t,height:e}=this.options;this.css2DRender.setSize(t,e)}dispose(){this.animateModels=[],this.disposeObj(this.buildingGroup),this.disposeObj(this.character),this.disposeObj(this.dotGroup),this.disposeObj(this.anchorGroup),this.disposeObj(this.fence),this.disposeObj(this.lightGroup),this.disposeObj(this.mouseClickDiffusion),this.clock=null,this.css2DRender=null,this.buildingGroup=null,this.character=null,this.dotGroup=null,this.anchorGroup=null,this.lightGroup=null,this.fence=null,this.mouseClickDiffusion=null,this.extend={},super.dispose()}}const Dt=(t,e)=>{const i=40*Math.random();return void 0!==i&&(t.value=i),t.show=Math.random()>.5,t.value=Number(Number(t.value||0).toFixed(2)),{value:t.value,show:t.show,font:{...t.font||{},color:"#"+(16777215+1e6*i).toString(16).substring(0,6)}}},Ot={class:"scene-operation"},At=["onClick"],St=["innerHTML"],Tt="单元1号电梯",Pt=q(h({__name:"index",setup(t){const e=d((i=(t,e,i,o)=>{if(!q)return;(o+=.005)>1&&(o-=1),t=((t,e=0)=>new s(t.x,t.y+e,t.z))(i.getPointAt(o));let n=o+.001;n>1&&(n-=1),e=i.getPointAt(n),q.position.set(t.x,rt,t.z);const a=Math.atan2(-e.z+t.z,e.x-t.x);q.rotation.z=.5*Math.PI+a},{devEnv:!0,baseUrl:"",bgColor:"",skyCode:"221",env:"/oss/textures/hdr/3.hdr",config:{},dotKey:"DOT",dotShowStrict:!1,anchorType:[Q,X,st,ot,at],animationModelType:[tt],models:[{key:tt,name:"场景",size:3.1,url:"/电梯.glb"},{key:nt,name:"闸机",size:.3,url:"/闸机.glb"},{key:Q,name:"定位",type:"sprite",range:{x:4,y:4},mapUrl:"/pos.png"},{key:X,name:"锚点",type:"sprite",range:{x:4,y:4},mapUrl:"/dw.png"},{key:st,name:"电梯门",type:"sprite",range:{x:1,y:1},mapUrl:"/lift.png"},{key:at,name:"闸机",type:"sprite",range:{x:1,y:1},mapUrl:"/gate.png"},{key:et,name:"机器人",size:.3,url:"/oss/model/park/机器人.glb"},{key:it,name:"人物",size:2.2,url:"/oss/model/park/RobotExpressive.glb"},{key:"spot_light_floor_2",type:"spotlight",name:"聚光灯",intensity:8,color:57599,distance:8},{key:ot,name:"开关灯",type:"sprite",range:{x:1.2,y:1.2},mapUrl:"/light.png"}].map((t=>(t.url&&t.url.indexOf("oss")<0&&(t.url="/oss/model/office"+t.url),t.mapUrl&&(t.mapUrl="/oss/textures/office"+t.mapUrl),t))),cruise:{visible:!0,auto:!0,mapUrl:"/oss/textures/cruise/line18.png",repeat:[1,1],width:2,segment:500,tension:0,speed:20,mapSpeed:.01,points:ht,close:!1,offset:5.2,animateBack:i}}));var i;const o=d({active:1,show:!1,list:[{name:"一楼",key:1,y:.2},{name:"二楼",key:2,y:13.8},{name:"三楼",key:3,y:19.83},{name:"五楼",key:5,y:31.76}]}),n=d({show:!1,style:{left:0,top:0},msg:""}),{changeBackground:a,backgroundLoad:r}=Y(),{progress:c,loadModels:l,getModel:h}=Z({baseUrl:e.baseUrl,indexDB:{cache:!0,dbName:"THREE__OFFICE__DB",tbName:"TB",version:12}}),M=u(),L={env:e.env,cruise:e.cruise,controls:{visible:!0,enableDamping:!0,dampingFactor:.48,maxPolarAngle:.48*Math.PI,screenSpacePanning:!1,maxDistance:800},camera:{},directionalLight:{},axes:{visible:!0}};let $;const E=t=>{var i;const s=t.data;{const t=Dt(s,$.buildingGroup);"object"==typeof t&&Object.keys(t).forEach((e=>{s[e]=t[e]}))}t.visible=s.show||!e.dotShowStrict;const o=null==(i=t.element)?void 0:i.getElementsByClassName("inner")[0];if(o){const{size:t,color:e}=s.font||{};null!=t&&(o.style.fontSize="string"==typeof t?t:t+"px"),null!=e&&(o.style.color=e),o.textContent=`${s.value||0}${s.unit}`}},N=async t=>{if(!t)return;const{type:i}=t,s=h(i);if(!s)return void(i===e.dotKey&&(t=>{E($.addDot(t,(e=>{$.cameraLookatMoveTo(t.position)})))})(t));const{anchorType:o=[],animationModelType:n=[]}=e;let a=J(s);const{position:r,scale:c,rotation:l}=V(a,t),[d,u,p]=r;return a.scale.set(...c),a.position.set(d,u,p),a.rotation.set(...l),a._isBuilding_=!0,a.data=t,n.includes(i)&&$.addModelAnimate(a,s.animations,!0,1),i===nt&&(a.name=t.name),o.includes(i)?(a._isAnchor_=!0,$.addAnchor(a)):a.isSpotLight?$.addLight(t,a,!0):$.addBuilding(a),Promise.resolve()},F=async()=>{c.percentage=100,c.show=!1,$.clearBuilding(),await P(),await(()=>{let t=0,e=R.value.length;return new Promise((i=>{if(0==e)return i(null);const s=async()=>{const o=R.value[t];await N(o),t++,t<e?s():i(t)};s()}))})(),$.setCruisePoint(e.cruise.points);const t=$.getValidTargetPosition(e.config||{});H($.camera,t,$.controls.target).then((()=>{$.controlSave()}))},R=u([]),I=p((()=>R.value.filter((t=>t.type===Q)))),U=()=>{l(e.models,(()=>{W.get(K.d3.office).then((async t=>{let i={};if(t.ConfigJson instanceof Object)i=t.ConfigJson;else if("string"==typeof t.ConfigJson)try{i=JSON.parse(t.ConfigJson)}catch(s){}R.value=t.JsonList,Object.keys(i).forEach((t=>{e.config&&(e.config[t]=i[t])})),await F(),ct(),lt()}))}))};let q;const ct=()=>{q=h(et),q.position.z=rt,q.rotation.z=.5*Math.PI,$.addObject(q)},lt=()=>{const t=h(it);t.traverse((t=>{t.isMesh&&(t.castShadow=!0)}));t.scale.setScalar(.5),$.addCharacter(t,{x:0,y:0,z:0})};return m((()=>{L.container=M.value;const t="轿厢-ground";$=new jt(L,{groundMeshName:["ground",t],onClickLeft:(t,e)=>{if(t&&t.data){const e=t.data;switch(null==e?void 0:e.type){case Q:$.cameraTransition(t);break;case st:$.waitLift(t,Tt);break;case ot:$.lightSwitch(t);break;case at:$.openGate(t)}}},onClickGround:(e,i)=>{$.mouseClickGround(i).then((e=>{o.show=i.object.name===t})).catch((()=>{}))},onHoverAnchor:(t,e)=>{const i=!!t&&t.object._isAnchor_;if(n.show=i,i){n.style.top=e.top,n.style.left=e.left;const i=t.object.data;n.msg=`\n          <p>${i.name}</p>\n          <p>类型：${i.type}</p>\n          <p>绑定：${i.bind||"无"}</p>\n        `}}}),$.run(),B($).resize(),U(),r($,e.skyCode)})),(t,i)=>{const s=T;return g(),_("div",{class:b(t.$style.page)},[f("div",Ot,[f("div",{class:"btn",onClick:i[0]||(i[0]=()=>{$.getAll().forEach(((t,i)=>{t.data&&(t.data.type!==e.dotKey||E(t))}))})},"随机更新"),f("div",{class:"btn",onClick:i[1]||(i[1]=()=>{var t;return null==(t=y($))?void 0:t.getPosition()})},"场景坐标"),f("div",{class:"btn",onClick:i[2]||(i[2]=()=>y(a)(y($)))},"切换背景")]),f("div",{class:b(t.$style.container),ref_key:"containerRef",ref:M},null,2),v(z,{modelValue:y(c).show,"onUpdate:modelValue":i[3]||(i[3]=t=>y(c).show=t),progress:y(c).percentage},null,8,["modelValue","progress"]),f("div",{class:b(t.$style.camera)},[(g(!0),_(k,null,x(y(I),(e=>(g(),_("div",{class:b(t.$style.item),onClick:t=>(t=>{$.cameraTransition({position:t.position,data:t})})(e)},C(e.name),11,At)))),256)),f("div",{class:b(t.$style.item),onClick:i[4]||(i[4]=()=>{var t;return null==(t=y($))?void 0:t.toggleCruise()})},"定点巡航",2),f("div",{class:b(t.$style.item),onClick:i[5]||(i[5]=()=>{var t;return null==(t=y($))?void 0:t.controlReset()})},"视角重置",2),f("div",{class:b(t.$style.item),onClick:i[6]||(i[6]=()=>y($).toggleSight())},"人物视角",2),f("div",{class:b(t.$style.item),onClick:i[7]||(i[7]=()=>y($).characterAccelerate())},"人物加速",2),f("div",{class:b(t.$style.item),onClick:i[8]||(i[8]=()=>y($).characterAccelerate(-1))},"人物减速",2)],2),w(f("div",{class:b(t.$style["floor-select"])},[(g(!0),_(k,null,x(y(o).list,(t=>(g(),j(s,{type:"primary",disabled:y(o).active===t.key,onClick:e=>(t=>{o.active=t.key;const e="电梯门"+t.key;$.waitLift({data:{bind:e,to:{y:t.y}}},Tt,!0)})(t)},{default:D((()=>[O(C(t.name),1)])),_:2},1032,["disabled","onClick"])))),256))],2),[[G,y(o).show]]),y(n).show?(g(),_("div",{key:0,class:b(t.$style.tip),style:A({left:y(n).style.left+"px",top:y(n).style.top+"px"})},[f("div",{class:b(t.$style.msg),innerHTML:y(n).msg},null,10,St)],6)):S("",!0)],2)}}}),[["__cssModules",{$style:{page:"_page_1w6dl_2",container:"_container_1w6dl_10","floor-select":"_floor-select_1w6dl_14",tip:"_tip_1w6dl_20",msg:"_msg_1w6dl_29",camera:"_camera_1w6dl_37",item:"_item_1w6dl_44"}}]]);export{Pt as default};