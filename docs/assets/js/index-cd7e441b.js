import{e,Y as o,i as a,l as s,c as t,o as r,g as l,h as n,q as i,u as c,p as d,I as m,n as y,t as p,cg as _,R as u,aL as g,_ as f}from"./vendor-509147fa.js";import{e as O,A as h}from"./index-e7e71650.js";import{u as v}from"./scene-resize-2cf1f3dc.js";const b={class:"flex flex-ac"},E=f(e({__name:"index",setup(e){const f=o({devEnv:!0,baseUrl:"",bgColor:"",skyCode:"221",render:{alpha:!0,preserveDrawingBuffer:!0},env:"/oss/textures/hdr/skidpan_2k.hdr",camera:{far:1e6},colors:{normal:{main:65280},runing:{main:16715760,text:0}},cruise:{visible:!0,points:[[450,490,450],[450,490,-450],[-450,490,-450],[-450,490,450]],offset:10},controls:{screenSpacePanning:!1,maxDistance:5e3,maxPolarAngle:.46*Math.PI},directionalLight:{helper:!1},grid:{visible:!0},models:[{key:"FLOOR_ONE",name:"大堂",size:8.5,url:"/1楼.glb"},{key:"FLOOR_COMMON",name:"楼层",size:13.7,url:"/楼层.glb"},{key:"FLOOR_ATTIC",name:"楼顶",size:.1,url:"/楼顶.glb"},{key:"COLD_CAMERA",name:"摄像头",type:"sprite",size:1,range:{x:37,y:77},mapUrl:"/sxt.png"},{key:"COLD_ROOM_INLET",name:"房间入口",type:"sprite",size:1,range:{x:37,y:77},mapUrl:"/fjdw.png"},{key:"COLD_GPS",name:"定位",type:"sprite",size:1,range:{x:51,y:56},mapUrl:"/dw.png"}].map((e=>(e.url&&(e.url="/oss/model/floor"+e.url),e.mapUrl&&(e.mapUrl="/oss/textures/floor"+e.mapUrl),e))),objects:[],config:{},indexDB:{cache:!0,dbName:"THREE__FLOOR__DB",tbName:"TB",version:1},dotShowStrict:!1,colorMeshName:[],floorModelType:["FLOOR_COMMON","FLOOR_ONE","FLOOR_TWO_FIVE","FLOOR_SIX","FLOOR_SEVEN_ELEVEN","FLOOR_TWELVE_THIRTEEN","FLOOR_FOURTEEN_SIXTEEN","FLOOR_SEVENTEEN_EIGHTEEN"],anchorType:["COLD_CAMERA","COLD_ROOM_INLET","COLD_GPS"],mainBodyChangeColor:!0,mainBodyMeshName:["立方体062"],animationModelType:["FLOOR_COMMON"]}),E=a(),C=(e,o)=>{const a=40*Math.random();return void 0!==a&&(e.value=a),e.show=Math.random()>.5,e.value=Number(Number(e.value||0).toFixed(2)),{value:e.value,show:e.show,font:{...e.font||{},color:e.value>35?"#f00":null}}},L=(e,o)=>{const a=Math.random()>.5?1:0,s=Math.random()>.5?1:0,t=Math.random()>.8?1:0,r=Math.floor(3*Math.random());return{status:t>0?0:a,error:t>0?0:s,remote:1==r?1:0,local:2==r?1:0,disabled:t}},M=e=>{v(e).resize()},N=(e,o)=>{},R=()=>{const e=[[450,1,450],[450,1,-450],[-450,1,-450],[-450,1,450]].map((e=>e.map((e=>e*(.5-.5*Math.random()+1)))));f.cruise&&(f.cruise.points=e)},x=()=>{var e;return null==(e=E.value)?void 0:e.exportImage()};return s((()=>{O.get(h.d3.floor).then((e=>{let o=e.JsonList;const a=e.ModelUrl;o.unshift({name:e.Name,type:"",url:a?`${f.baseUrl}${a}`:""});let s={};if(e.ConfigJson instanceof Object)s=e.ConfigJson;else if("string"==typeof e.ConfigJson)try{s=JSON.parse(e.ConfigJson)}catch(r){}Object.keys(s).forEach((e=>{f.config&&(f.config[e]=s[e])})),f.objects=o.map((e=>("COLD_ROOM_INLET"===e.type&&(e.onClick=e=>{t.success({message:e.name,grouping:!0})}),e)))}))})),(e,o)=>{const a=u,s=g;return r(),l("div",{class:y([e.$style.page,"h-100 o-h"])},[n("div",{class:y(e.$style.operate)},[n("div",b,[o[1]||(o[1]=n("span",null,"点位：",-1)),i(a,{modelValue:c(f).dotShowStrict,"onUpdate:modelValue":o[0]||(o[0]=e=>c(f).dotShowStrict=e),"active-text":"严格","inactive-text":"全显","inline-prompt":""},null,8,["modelValue"])]),i(s,{type:"success",onClick:R},{default:d((()=>o[2]||(o[2]=[m("切换巡航点位")]))),_:1}),i(s,{type:"primary",size:"small",onClick:x},{default:d((()=>o[3]||(o[3]=[m("导出")]))),_:1})],2),i(_,{ref_key:"threeSceneRef",ref:E,"dev-env":c(f).devEnv,"base-url":c(f).baseUrl,"bg-color":c(f).bgColor,"bg-url":c(f).bgUrl,env:c(f).env,indexDB:c(f).indexDB,"sky-code":c(f).skyCode,camera:c(f).camera,colors:c(f).colors,cruise:c(f).cruise,render:c(f).render,controls:c(f).controls,grid:c(f).grid,"directional-light":c(f).directionalLight,config:c(f).config,models:c(f).models,"anchor-type":c(f).anchorType,"dot-show-strict":c(f).dotShowStrict,"floor-model-type":c(f).floorModelType,"main-body-change-color":c(f).mainBodyChangeColor,"main-body-mesh-name":c(f).mainBodyMeshName,"animation-model-type":c(f).animationModelType,objects:c(f).objects,"dot-update-object-call":C,"update-object-call":L,onInit:M,onClickDot:N},{dialog:d((({data:o,title:a})=>[n("div",{class:y(e.$style["dialog-wrap"])},[n("div",{class:y(e.$style.circle)},null,2),n("div",{class:y(e.$style.line)},null,2),n("div",{class:y(e.$style.content)},[n("div",{class:y(e.$style.title)},p(a),3),n("div",{class:y(e.$style.data)},p(o),3)],2)],2)])),_:1},8,["dev-env","base-url","bg-color","bg-url","env","indexDB","sky-code","camera","colors","cruise","render","controls","grid","directional-light","config","models","anchor-type","dot-show-strict","floor-model-type","main-body-change-color","main-body-mesh-name","animation-model-type","objects"])],2)}}}),[["__cssModules",{$style:{page:"_page_fyyv5_2",operate:"_operate_fyyv5_8","dialog-wrap":"_dialog-wrap_fyyv5_20",circle:"_circle_fyyv5_26",line:"_line_fyyv5_56",content:"_content_fyyv5_82",title:"_title_fyyv5_89",data:"_data_fyyv5_93"}}]]);export{E as default};