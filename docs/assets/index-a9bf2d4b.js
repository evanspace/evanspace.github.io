import{d as e,_ as l,c as t,o as a,e as s,f as n,a8 as r,aD as i,u as o,x as d,s as u,F as m,r as c,t as p,ay as f,p as x,i as g,q as h,M as T,az as I}from"./vendor-2b8b4662.js";import{_}from"./common-437062e2.js";const v=e=>(x("data-v-f0899d85"),e=e(),g(),e),E={class:"page"},y={class:"wrap"},A={class:"flex flex-ac flex-jc"},G={class:"content"},R={viewBox:"0 0 800 300"},M={id:"text"},w=["href"],X=v((()=>n("feColorMatrix",{in:"ORIGIN_IMAGE",type:"saturate",values:"0",result:"GRAY_IMAGE"},null,-1))),j=v((()=>n("feDisplacementMap",{in:"SourceGraphic",in2:"GRAY_IMAGE",scale:"15",xChannelSelector:"R",yChannelSelector:"R",result:"TEXTTUREN_TEXT"},null,-1))),C=["href"],b=v((()=>n("feColorMatrix",{in:"TEXTTUREN_TEXT",retult:"OPACITY_TEXT",type:"matrix",values:"1 0 0 0 0\n                  0 1 0 0 0\n                  0 0 1 0 0 \n                  0 0 0 .9 0"},null,-1))),B=v((()=>n("feBlend",{in:"BG",in2:"OPACITY_TEXT",mode:"multiply",result:"BLEND_TEXT"},null,-1))),N=["href"],U=["fill"],V=_(e({__name:"index",setup(e){const x=l({text:"Hello world!",color:"rgb(0 0 0)",imgIndex:0,imgs:[{src:"/imgs/06.jpg",name:"墙面1"},{src:"/imgs/07.jpg",name:"墙面2"},{src:"/imgs/08.jpg",name:"毛绒"}]}),g=t((()=>{var e;return null==(e=x.imgs[x.imgIndex])?void 0:e.src}));return(e,l)=>{const t=I,_=f;return a(),s("div",E,[n("div",y,[n("div",A,[r(n("input",{type:"text","onUpdate:modelValue":l[0]||(l[0]=e=>o(x).text=e)},null,512),[[i,o(x).text]]),r(n("input",{type:"color","onUpdate:modelValue":l[1]||(l[1]=e=>o(x).color=e)},null,512),[[i,o(x).color]]),d(_,{modelValue:o(x).imgIndex,"onUpdate:modelValue":l[2]||(l[2]=e=>o(x).imgIndex=e),style:{"margin-left":"5px"}},{default:u((()=>[(a(!0),s(m,null,c(o(x).imgs,((e,l)=>(a(),h(t,{label:l},{default:u((()=>[T(p(e.name),1)])),_:2},1032,["label"])))),256))])),_:1},8,["modelValue"])]),n("div",G,[(a(),s("svg",R,[n("defs",null,[n("filter",M,[n("feImage",{href:o(g),x:"0",y:"0",width:"800",height:"300",preserveAspectRatio:"none",result:"ORIGIN_IMAGE"},null,8,w),X,j,n("feImage",{href:o(g),x:"0",y:"0",width:"800",height:"300",preserveAspectRatio:"none",result:"BG"},null,8,C),b,B])]),n("image",{href:o(g),x:"0",y:"0",width:"800",height:"300",preserveAspectRatio:"none"},null,8,N),n("text",{x:"50%",y:"50%","font-size":"80px","font-weight":"bold","text-anchor":"middle","alignment-baseline":"middle",fill:o(x).color,filter:"url(#text)"},p(o(x).text),9,U)]))])])])}}}),[["__scopeId","data-v-f0899d85"]]);export{V as default};