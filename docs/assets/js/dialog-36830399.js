import{i as o,Y as i,cA as t}from"./vendor-eaf8386d.js";import{d as s}from"./scene-resize-a0557c92.js";const n={TEXT:"TEXT",JSQ:"JSQ",LDB:"LDB",LQB:"LQB",XBC:"XBC",LXJ:"LXJ",LGJ:"LGJ",LGJ_2:"LGJ_2",LGJ_3:"LGJ_3",LGJ_4:"LGJ_4",LQT:"LQT",GL:"GL",BSHRQ:"BSHRQ",BSHLQ:"BSHLQ",FLRB:"FLRB",FJY_X:"FJY_X",FJZ_X:"FJZ_X",FJY:"FJY",FJZ:"FJZ",FM:"FM",XFM:"XFM"},e={indexdb:{dbName:"THREE__MODEL__DB",tbName:"TB",version:1},mesh:{receiveShadowName:["地面","底座","底板","基础","基础底座","冷却塔基础"]},keys:n,rightClickBackDiffTime:300,meshKey:{body:Symbol("__BODY_"),color:Symbol("__COLOR_"),warning:Symbol("__WARNING_"),local:Symbol("__LOCAL_"),disabled:Symbol("__DISABLED_"),pipe:Symbol("__PIPE__")},statusOffset:{TEXT:{[n.JSQ]:{position:{x:-20,y:10,z:0},rotation:{x:0,y:270,z:0}},[n.LDB]:{position:{x:-60,y:0,z:0}},[n.LQB]:{position:{x:0,y:0,z:60},rotation:{x:0,y:270,z:0}},[n.LXJ]:{position:{x:0,y:16,z:50},rotation:{x:-20,y:0,z:0}},[n.LGJ]:{position:{x:0,y:16,z:50},rotation:{x:-20,y:0,z:0}},[n.LQT]:{position:{x:-60,y:0,z:0}},[n.BSHLQ]:{position:{x:0,y:16,z:40}}},WARNING:{[n.JSQ]:{position:{x:0,y:62,z:0}},[n.LDB]:{position:{x:-4,y:45,z:0}},[n.LQB]:{position:{x:0,y:45,z:4},rotation:{x:0,y:270,z:0}},[n.LXJ]:{position:{x:0,y:78,z:0}},[n.LGJ]:{position:{x:0,y:78,z:0}},[n.LQT]:{position:{x:0,y:85,z:0}},[n.BSHLQ]:{position:{x:0,y:88,z:0}}},STATUS:{[n.LDB]:{position:{x:9,y:47,z:0}},[n.LQB]:{position:{x:0,y:47,z:-9},rotation:{x:0,y:270,z:0}},[n.LXJ]:{position:{x:27,y:67,z:42}},[n.LGJ]:{position:{x:-47,y:67,z:42}},[n.LQT]:{position:{x:-35,y:69,z:26}}},DISABLED:{[n.LDB]:{position:{x:22,y:47,z:0}},[n.LQB]:{position:{x:0,y:47,z:-22},rotation:{x:0,y:270,z:0}},[n.LXJ]:{position:{x:40,y:67,z:42}},[n.LGJ]:{position:{x:-34,y:67,z:42}},[n.LQT]:{position:{x:-22,y:69,z:26}}}}},L=(i="")=>{const t=["216","217","218","219","220","221","222","223","224","225"],s=o("/oss/img/sky"),n=t.findIndex((o=>o==i)),e=o(n<0?0:n),L=o=>{const i=t[e.value];i&&(y(o,i),e.value++,e.value>=t.length&&(e.value=0))},y=(o,i)=>{null==o||o.setBgTexture(["/posX.jpeg","/negX.jpeg","/posY.jpeg","/negY.jpeg","/posZ.jpeg","/negZ.jpeg"].map((o=>`${s.value}/${i}${o}`)))};return{skys:t,index:e,skyPath:s,change:L,changeBackground:L,load:y,backgroundLoad:y}},y=(o={})=>{const n=i(s({show:!1,style:{left:"",top:""},select:[],data:{},title:"",position:{top:0,left:0}},o));return{dialog:n,options:n,show:t(n.show)}};export{e as D,y as a,L as u};