import{bH as e,bO as t,e as o,i,w as s,l as n,aP as a,o as l,g as r,h as c,u as d,B as p,n as u,a9 as h,s as f,t as m,a5 as g,aa as v,cg as y}from"./vendor-7f6cb255.js";import{T as b,d as C}from"./scene-resize-a9ec2e62.js";import{u as x,D as _,a as k}from"./background-abedecce.js";import{u as D,a as G,g as j,s as w,c as O,b as P,d as M,e as E,f as T,h as B,i as S,j as $}from"./model-loader-59ce6813.js";import{u as A}from"./dialog-bb6e0574.js";import{_ as L}from"./index-cf96eee7.js";const{raycaster:U,pointer:z,update:K}=x(),{initCSS2DRender:N,createCSS2DDom:F}=D();class R extends b{constructor(t,o){super(t),this.findFilterDevice=(e,t)=>{if(0==e.length||0==t.length)return[];let o=[];return e.forEach((e=>{if(e instanceof Array){let i=[];e.filter((e=>{if(e instanceof Array){const o=t.filter((t=>e.includes(t.deviceCode)));return o.length&&o.forEach((e=>{i.includes(e)||i.push(e)})),o.length>0}const o=t.find((t=>t.deviceCode==e));return o&&!i.includes(o)&&i.push(o),!!o})).length==e.length&&(o=o.concat(i))}else{const i=t.find((t=>t.deviceCode==e));i&&o.push(i)}})),o},this.extend=o,this.css2DRender=N(this.options,this.container),this.css2DRender.domElement.className="three-scene__dot-wrap",this.clock=new e,this.addDeviceGroup(),this.addDotGroup(),this.addPipeGroup(),this.bindEvent()}addDeviceGroup(){const e=new t;e.name="设备组",this.deviceGroup=e,this.addObject(e)}clearDevice(){this.deviceGroup&&this.disposeObj(this.deviceGroup),this.addDeviceGroup(),this.clearDot(),this.clearPipe()}addDevice(...e){this.deviceGroup&&this.deviceGroup.add(...e)}addDotGroup(){const e=new t;e.name="点位组",this.scene.add(e),this.dotGroup=e}clearDot(){this.dotGroup&&this.disposeObj(this.dotGroup),this.addDotGroup()}addDot(e,t){const o=e.position,{size:i,color:s}=e.font||{},{x:n=0,y:a=0,z:l=0}=o||{},r=F({name:`\n        <div class="bg"></div>\n        <span class="inner" style="${null!=i?`font-size: ${"string"==typeof i?i:i+"px"};`:""} ${null!=s?`color: ${s}`:""}"></span>\n      `,className:"dot-2D-label",position:[n,a,l],onClick:t});return r.name=e.name,r.data=e,this.dotGroup.add(r),r}addPipeGroup(){const e=new t;e.name="管路组",this.scene.add(e),this.pipeGroup=e}addPipe(...e){this.pipeGroup&&this.pipeGroup.add(...e)}clearPipe(){this.pipeGroup&&this.disposeObj(this.pipeGroup),this.addPipeGroup()}onDblclick(e){var t;const o=this.container,i=this.options.scale;if(K(e,o,i),this.deviceGroup){U.setFromCamera(z,this.camera);const e=[this.deviceGroup,this.pipeGroup],o=U.intersectObjects(e);if(o.length){const e=o[0].object,i=this.findParentGroupGroup(e);if(!i)return;"function"==typeof(null==(t=this.extend)?void 0:t.onDblclick)&&this.extend.onDblclick(i)}}}onPointerMove(e){this.checkIntersectObjects(e)}onPointerUp(e){var t;super.onPointerUp(e);const o=e.timeStamp-this.pointer.tsp<_.rightClickBackDiffTime;2==e.button?o&&"function"==typeof(null==(t=this.extend)?void 0:t.onClickRight)&&this.extend.onClickRight(e):0==e.button?o&&this.checkIntersectObjects(e):e.button}checkIntersectObjects(e){var t,o;const i=this.container,s=this.options.scale;K(e,i,s);let n="pointerdown"==e.type||"pointerup"==e.type;const a=this.deviceGroup.children.filter((e=>e.visible&&e._isAnchor_));U.setFromCamera(z,this.camera);let l=U.intersectObjects(a,n);if(i.style.cursor=l.length>0?"pointer":"auto",n)if(l.length){const e=l[0].object;if(!e)return;"function"==typeof(null==(t=this.extend)?void 0:t.onClickLeft)&&this.extend.onClickLeft(e)}else"function"==typeof(null==(o=this.extend)?void 0:o.onClickLeft)&&this.extend.onClickLeft()}findParentGroupGroup(e){const t=e=>{let o=e.parent;if(o)return o&&(o._isDevice_||o._isPipe_)?o:t(o)};return t(e)}modelAnimate(){if(this.css2DRender.render(this.scene,this.camera),"function"==typeof this.extend.animateCall&&this.extend.animateCall(),this.deviceGroup.children.length){let e=this.clock.getDelta();this.deviceGroup.children.forEach((t=>{let o=t.data;if(!o)return;let i=t.extra;i&&((null==o?void 0:o.status)??0)>0&&i.mixer.update(e);const s=t[_.meshKey.warning];s&&((null==o?void 0:o.error)||0)>0&&s.mixer.update(e)}))}this.pipeGroup.children.length&&this.pipeGroup.children.forEach((e=>{const t=e[_.meshKey.pipe];if(t){const o=e.data,i=o.bind||[],s=this.deviceGroup.children.filter((e=>{var t;return e.data&&e.data.deviceCode&&((null==(t=e.data)?void 0:t.status)??0)>0})).map((e=>e.data)),n=this.findFilterDevice(i,s),a=n.length>0;let l=.01;if(o.left&&o.right){const{left:e,right:t}=o,i=this.findFilterDevice(t,n).length>0,s=this.findFilterDevice(e,n).length>0;l=s&&i?0:i?-.01:.01}t.forEach((e=>{a&&(e.material.map.offset.y-=l),e.material.opacity=a?.3:0}))}}))}getPosition(){}getAnimTargetPos(e,t,o){const i=t||e.to||{x:-104,y:7,z:58},s=o||e.target||{x:0,y:0,z:0};return this.controls.target.set(s.x,s.y,s.z),i}getAll(){return this.deviceGroup.children.concat(this.dotGroup.children)}resize(){super.resize();const{width:e,height:t}=this.options;this.css2DRender.setSize(e,t)}}const I={normal:{color:8954293,main:[8954293,2698801],text:12180479,FM:6319220},runing:{color:3045368,main:3045368,FM:422935},error:{color:12717056,main:11879461,FM:15215899}},H={class:"scene-operation"},W=L(o({__name:"index",props:{devEnv:{type:Boolean},baseUrl:{},dracoPath:{},basisPath:{},bgColor:{},skyCode:{},bgUrl:{},env:{},scale:{},colors:{default:()=>({})},indexDB:{default:()=>({cache:!0})},camera:{default:()=>({})},cruise:{default:()=>({})},fog:{default:()=>({})},render:{default:()=>({})},controls:{default:()=>({})},grid:{default:()=>({})},axes:{default:()=>({})},ambientLight:{},directionalLight:{default:()=>({})},models:{},config:{},objects:{},pipes:{},dotKey:{default:"DOT"},dotShowStrict:{type:Boolean,default:!0},statusOffset:{},getColorCall:{},formatObject:{},dotUpdateObjectCall:{},updateObjectCall:{},colorMeshName:{default:()=>[]},colorModelType:{default:()=>["FM"]},animationModelType:{},textModelType:{},anchorType:{default:()=>[]},textChangeColor:{type:Boolean},mainBodyChangeColor:{type:Boolean},mainBodyMeshName:{default:()=>["主体"]},mainBodyExcludeType:{default:()=>["FM"]}},emits:["init","loaded","update","select","dblclick","click-dot","click-dialog-dot"],setup(e,{expose:o,emit:b}){const x=e,D=b,L=C(I,x.colors),{changeBackground:U,backgroundLoad:z}=k(),{progress:K,MODEL_MAP:N,loadModel:F,loadModels:W,getModel:X}=G({baseUrl:x.baseUrl,dracoPath:x.dracoPath,basisPath:x.basisPath,colors:L,colorMeshName:x.colorMeshName,indexDB:x.indexDB}),{dialog:Z}=A(),q=i(),J={baseUrl:x.baseUrl,bgUrl:x.bgUrl,env:x.env,bgColor:x.bgColor,camera:x.camera,cruise:x.cruise,fog:x.fog,render:x.render,grid:x.grid,controls:x.controls,axes:x.axes,ambientLight:x.ambientLight,directionalLight:x.directionalLight};let Q;s((()=>x.dotShowStrict),(()=>V())),s((()=>x.scale),(e=>{null==Q||Q.setScale(e||1)})),s((()=>x.cruise.points),(e=>{K.isEnd&&Q.setCruisePoint(e)})),s((()=>x.objects),(()=>{K.isEnd&&oe()}));const V=()=>{const e=Q.dotGroup.children;for(let t=0;t<e.length;t++){const o=e[t];if(!o.data)continue;o.data.type===x.dotKey&&Y(o)}},Y=e=>{var t;const o=e.data;if("function"==typeof x.dotUpdateObjectCall){const e=x.dotUpdateObjectCall(o,Q.deviceGroup);"object"==typeof e&&Object.keys(e).forEach((t=>{o[t]=e[t]}))}e.visible=o.show||!x.dotShowStrict;const i=null==(t=e.element)?void 0:t.getElementsByClassName("inner")[0];if(i){const{size:e,color:t}=o.font||{};null!=e&&(i.style.fontSize="string"==typeof e?e:e+"px"),null!=t&&(i.style.color=t),i.textContent=`${o.value||0}${o.unit}`}},ee=async e=>{var o;if(!e)return;const{type:i,url:s}=e,n=X(i);if(!n)return void(s?await(async e=>{const{type:t,url:o="",name:i}=e,s=await F({key:t,url:o,name:i,size:0}),{position:n,scale:a,rotation:l}=E(s,e);return s.scale.set(...a),s.position.set(...n),s.rotation.set(...l),s._isBase_=!0,Q.addDevice(s),Promise.resolve(s)})(e):i===x.dotKey&&(e=>{Y(Q.addDot(e,(t=>{D("click-dot",a(e),t)})))})(e));const l=x.anchorType||[];let r=M(n);const{position:c,scale:d,rotation:p}=E(r,e),[u,h,f]=c;r.scale.set(...d);const m=x.animationModelType||[],g=x.colorMeshName||[],v=x.mainBodyExcludeType||[],b=x.textModelType||[],C=X(N.font);if(b.includes(i)&&C){const i=new t;i.add(r);const s=B(e,C,L.normal.text,null==(o=x.statusOffset)?void 0:o.TEXT);i.add(s),i.name=e.name,r=i}if(m.includes(i)){if("Group"!==r.type){const e=new t;e.add(r),e.name=r.name,r=e}if(((e,t)=>{var o,i,s;const n=X(N.warning);if(n){const i=_.meshKey.warning,{group:s,action:a,mixer:l}=S(i,t,n,null==(o=x.statusOffset)?void 0:o.WARNING);e.add(s),e[i]={action:a,mixer:l}}const a=X(N.local);if(a){const o=_.meshKey.local,s=$(t,a,null==(i=x.statusOffset)?void 0:i.STATUS);e.add(s),e[o]=s}const l=X(N.disabled);if(l){const o=_.meshKey.disabled,i=$(t,l,null==(s=x.statusOffset)?void 0:s.DISABLED,!0);e.add(i),e[o]=i}})(r,e),x.mainBodyChangeColor&&!v.includes(i)){const e=T(r.children,x.mainBodyMeshName),t=L.normal;let o=null!=t.main?t.main:t.color,i=P(o);i.length&&e.forEach(((e,t)=>{w(e,i[t%i.length])})),r[_.meshKey.body]=e}const o=T(r.children,g);let s,a=new y(r);n.animations.length&&(s=a.clipAction(n.animations[0]),s.paused=!0,s.timeScale=1.5,s.play()),r.extra={action:s,mixer:a,meshs:o}}else{const e=[];r.traverse((t=>{"string"==typeof t.name&&g.some((e=>t.name.indexOf(e)>-1))&&e.push(t)})),e.length&&(r[_.meshKey.color]=e)}return r.position.set(u,h,f),r.rotation.set(...p),r._isDevice_=!0,r.data=e,l.includes(i)&&(r._isAnchor_=!0),Q.addDevice(r),Promise.resolve()},te=i([]),oe=async()=>{var e,t;K.percentage=100,K.show=!1,Q.clearDevice(),await v(),(()=>{te.value.length=0;const e=a(x.objects)||[];if("function"!=typeof x.formatObject)te.value=e;else{const t=x.formatObject(e);te.value=t}})(),await(()=>{let e=0,t=te.value.length;return new Promise((o=>{if(0==t)return o(null);const i=async()=>{const s=te.value[e];await ee(s),e++,e<t?i():o(e)};i()}))})(),(()=>{if(!x.pipes||0==x.pipes.length)return;const e=x.pipes;for(let t=0;t<e.length;t++){const o=e[t],{type:i,map:s}=o,n=X(i);if(!n)continue;let a=M(n);const l=n._mapMeshName_,{position:r,scale:c,rotation:d}=E(a,o),[p,u,h]=r,f=T(a.children,[l]);f.length&&(f.forEach((e=>{if(e.material.map=e.material.map.clone(),s){const t=e.material.map.repeat;e.material.map.repeat.set(t.x*(s[0]??1),t.y*(s[1]??1))}})),a[_.meshKey.pipe]=f),a.scale.set(...c),a.position.set(p,u,h),a.rotation.set(...d),a._isPipe_=!0,a.data=o,Q.addPipe(a)}})(),Q.setCruisePoint(x.cruise.points),"function"==typeof(null==(e=x.config)?void 0:e.load)&&(null==(t=x.config)||t.load(Q));const o=Q.getAnimTargetPos(x.config||{});O(Q.camera,o,Q.controls.target).then((()=>{D("loaded"),Q.controlSave()}))},ie=()=>{W(x.models,(()=>{oe()})),x.skyCode&&z(Q,x.skyCode)},se=e=>{const t=q.value,o=j(t,e,Q.camera);return Z.position=o,Z.style.left=o.left+"px",Z.style.top=o.top+"px",o},ne=e=>{const t=[];x.updateObjectCall,Q.getAll().forEach(((o,i)=>{if(!o.data)return;const s=o.data;let n=s.type;if(n===x.dotKey)return void Y(o);if("function"==typeof x.updateObjectCall){const t=x.updateObjectCall(s,e);if(!t)return;Object.keys(t).forEach((e=>{s[e]=t[e]}))}t.push(a(s));let{status:l=0,error:r=0,remote:c=0,local:d=0,disabled:p=0}=s;const u=L[r>0?"error":l>0?"runing":"normal"];let h=null!=u[n]?u[n]:u.color;if("function"==typeof x.getColorCall){const e=x.getColorCall(s);e&&(h=e)}ae({type:n,el:o,colorObj:u,color:h,paused:0==l,error:r>0,remote:c>0,local:d>0,disabled:p>0})})),D("update",t,e)},ae=e=>{let{el:t,type:o,colorObj:i,color:s,paused:n,error:a}=e,l=P(s);s=l[0];const r=_.meshKey;if(x.colorModelType.includes(o)&&null!=s){return void(t[r.color]||[]).forEach((e=>{w(e,s)}))}if(!(x.animationModelType||[]).includes(o))return;if(x.textChangeColor){const e=null!=i.text?i.text:i.color,o=t.getObjectByProperty("_isText_",!0);let s=P(e);w(o,s[0])}const c=t.extra;if(c&&(c.action&&(c.action.paused=n),null!=s)){(c.meshs||[]).forEach((e=>{w(e,s)}))}if(x.mainBodyChangeColor&&t[r.body]){const e=null!=i.main?i.main:i.color;let o=P(e);o.length&&t[r.body].forEach(((e,t)=>{w(e,o[t%o.length])}))}const d=t[r.warning];if(d){const e=t.children.find((e=>e.name==r.warning));e&&(e.visible=a,d.action.paused=!a)}t[r.local]&&(t[r.local].visible=e.local),t[r.disabled]&&(t[r.disabled].visible=e.disabled)};return n((()=>{J.container=q.value,Q=new R(J,{onDblclick(e){const t=e.data;"function"==typeof t.onDblclick?t.onDblclick(a(t),e):D("dblclick",a(t))},onClickLeft(e){if(e){const t=e.data,o=a(t);D("select",o),"function"==typeof t.onClick?(Z.show=!1,t.onClick(o)):(Z.select=[e],(()=>{const e=Z.select[0],t=e.data;Z.data=t,Z.title=(null==t?void 0:t.name)||"",Z.show=!0;const o=se(e);D("click-dialog-dot",t,o)})())}else Z.select=[],Z.show=!1},onClickRight(e){var t;"function"==typeof(null==(t=x.config)?void 0:t.back)&&x.config.back(Q)},animateCall:()=>{if(Z.show&&Z.select.length){const e=Z.select[0];se(e)}}}),Q.run(),D("init",Q),ie()})),o({update:ne,exportImage:()=>null==Q?void 0:Q.exportImage()}),(e,t)=>(l(),r("div",{class:u(e.$style["device-scene"])},[c("div",H,[c("div",{class:"btn",onClick:t[0]||(t[0]=()=>ne(!0))},"随机更新"),e.cruise.visible?(l(),r("div",{key:0,class:"btn",onClick:t[1]||(t[1]=()=>{var e;return null==(e=d(Q))?void 0:e.toggleCruise()})},"定点巡航")):p("",!0),c("div",{class:"btn",onClick:t[2]||(t[2]=()=>{var e;return null==(e=d(Q))?void 0:e.getPosition()})},"场景坐标"),c("div",{class:"btn",onClick:t[3]||(t[3]=()=>d(U)(d(Q)))},"切换背景"),c("div",{class:"btn",onClick:t[4]||(t[4]=()=>{var e;return null==(e=d(Q))?void 0:e.controlReset()})},"控制器重置"),e.cruise.visible?(l(),r("div",{key:1,class:"btn",onClick:t[5]||(t[5]=()=>{var e;return null==(e=d(Q))?void 0:e.toggleCruiseDepthTest()})},"巡航深度")):p("",!0)]),c("div",{class:u(e.$style.container),ref_key:"containerRef",ref:q},null,2),d(K).show?(l(),r("div",{key:0,class:u(["loading",e.$style.loading]),style:h({"--bg-color":e.bgColor?String(e.bgColor):""}),onDblclick:t[6]||(t[6]=f((()=>{}),["stop"]))},[c("div",{class:u(e.$style.progress),style:h({"--percentage":d(K).percentage+"%"})},[c("div",{class:u(e.$style["bar-out"])},[c("div",{class:u(e.$style.bar)},null,2)],2),c("div",{class:u(e.$style.text)},m(d(K).percentage)+"%",3)],6)],38)):p("",!0),d(Z).show?(l(),r("div",{key:1,class:u(e.$style.dialog),style:h(d(Z).style)},[g(e.$slots,"dialog",{data:d(Z).data,title:d(Z).title,position:d(Z).position})],6)):p("",!0)],2))}}),[["__cssModules",{$style:{"device-scene":"_device-scene_1ps2f_2",container:"_container_1ps2f_8",loading:"_loading_1ps2f_12",progress:"_progress_1ps2f_27","bar-out":"_bar-out_1ps2f_31",bar:"_bar_1ps2f_31","striped-flow":"_striped-flow_1ps2f_1",text:"_text_1ps2f_55",dialog:"_dialog_1ps2f_63"}}]]);export{W as t};