import{i as e,Y as s,cA as o}from"./vendor-eaf8386d.js";import{d as a}from"./scene-resize-e467973e.js";const t={indexdb:{dbName:"THREE__MODEL__DB",tbName:"TB",version:1},mesh:{receiveShadowName:["地面","底座","底板","基础","基础底座","冷却塔基础"]},keys:{TEXT:"TEXT",JSQ:"JSQ",LDB:"LDB",LQB:"LQB",XBC:"XBC",LXJ:"LXJ",LGJ:"LGJ",LGJ_2:"LGJ_2",LGJ_3:"LGJ_3",LGJ_4:"LGJ_4",LQT:"LQT",GL:"GL",BSHRQ:"BSHRQ",BSHLQ:"BSHLQ",FLRB:"FLRB",FJY_X:"FJY_X",FJZ_X:"FJZ_X",FJY:"FJY",FJZ:"FJZ",FM:"FM",XFM:"XFM"},rightClickBackDiffTime:100,meshKey:{body:Symbol("__BODY_")}},n=(s="")=>{const o=["216","217","218","219","220","221","222","223","224","225"],a=e("/oss/img/sky"),t=o.findIndex((e=>e==s)),n=e(t<0?0:t),L=e=>{const s=o[n.value];s&&(J(e,s),n.value++,n.value>=o.length&&(n.value=0))},J=(e,s)=>{null==e||e.setBgTexture(["/posX.jpeg","/negX.jpeg","/posY.jpeg","/negY.jpeg","/posZ.jpeg","/negZ.jpeg"].map((e=>`${a.value}/${s}${e}`)))};return{skys:o,index:n,skyPath:a,change:L,changeBackground:L,load:J,backgroundLoad:J}},L=(e={})=>{const t=s(a({show:!1,style:{left:"",top:""},select:[],data:{},title:"",position:{top:0,left:0}},e));return{dialog:t,options:t,show:o(t.show)}};export{t as D,L as a,n as u};