import{s as e,t,u as a,v as i}from"./element-plus-c17a5b2d.js";import{d as o,r as s,G as r,w as l,h as n,z as d,c,o as u,i as h,K as m,u as p,a as g,O as f,X as x,a8 as v}from"./@vue-a65f2bcd.js";import{u as w,o as y,q as b}from"./@element-plus-a81da9ad.js";import{u as j,A as k,b as _}from"./index-de788d04.js";import{a as M,u as z}from"./vue-router-d68a7028.js";import"./lodash-es-e892efce.js";import"./async-validator-cf877c1f.js";import"./@vueuse-98deaf90.js";import"./@ctrl-91de2ec7.js";import"./@popperjs-b78c3215.js";import"./pinia-7137c8a0.js";import"./common-483d9c9f.js";import"./nprogress-8c9189ea.js";import"./@intlify-6938da42.js";import"./axios-9048dd51.js";import"./vue-i18n-685a72aa.js";import"./vue-d9a30721.js";import"./path-to-regexp-b4f1402b.js";import"./path-browserify-1e9555d6.js";import"./vite-plugin-mock-91d15c87.js";import"./mockjs-aec3d243.js";const C=o({__name:"title",props:{name:String,height:Number,color:{type:String,default:"#ffffff"},size:{type:Number,default:80},mouseRadius:{type:Number,default:30}},setup(e){const t=window.requestAnimationFrame||window.requestAnimationFrame||window.requestAnimationFrame||window.requestAnimationFrame||window.requestAnimationFrame||function(e){window.setTimeout(e,1e3/60)},a=e,i=s("canvasRef"),o={x:null,y:null},h=r({sizeX:2,sizeY:2,oldColor:""}),m=r([]),p=s([]);let g,f,x;const v=()=>{let e=i.value;g=e,f=e.getContext("2d"),g.width=window.innerWidth,g.height=a.height||window.innerHeight;let t=document.createElement("canvas");t.width=600,t.height=200;let o=t.getContext("2d");o.textAlign="center",o.textBaseline="middle",o.font=`bold ${a.size}px 微软雅黑`,o.fillStyle=a.color,o.fillText(a.name||"平台",t.width/2,t.height/2),x=t,w()},w=()=>{b(),j(),z()},y=r({ite:0,start:0,end:0}),b=()=>{m.length=0,p.length=0,p.values=[],y.ite=100,y.start=0,y.end=y.start+y.ite},j=()=>{let e=g,t=x,a=(e.width-t.width)/2,i=(e.height-t.height)/2;f.clearRect(0,0,e.width,e.height),f.drawImage(t,a,i,t.width,t.height);const o=f.getImageData(a,i,t.width,t.height);for(let s=0;s<t.width;s+=h.sizeX)for(let e=0;e<t.height;e+=h.sizeY){const r=4*(e*o.width+s);if(o.data[r+3]>=125){const l=`rgba(${o.data[r]} , ${o.data[r+1]} ,  ${o.data[r+2]} , ${o.data[r+3]})`;let n,d=s+20*Math.random(),c=200*-Math.random()+400,u=t.height/2-40*Math.random()+20;n=u<i+t.height/2?300*Math.random():300*-Math.random(),m.push({x:d+a,y:u+i,ex:s+a,ey:e+i,vx:c,vy:n,color:l,a:1500,width:h.sizeX,height:h.sizeY,stop:!1,checkLength:5,maxCheckTimes:10,checkTimes:0});let p=m[m.length-1];k(p)}}},k=e=>{h.oldColor!=e.color&&(f.fillStyle=e.color,h.oldColor=e.color),f.fillRect(e.x-e.width/2,e.y-e.height/2,e.width,e.height)},_=e=>{"WORD_CANVAS"==e.target.id?(o.x=e.clientX-e.target.getBoundingClientRect().left,o.y=e.clientY-e.target.getBoundingClientRect().top):(o.x=null,o.y=null)};let M=!1;const z=()=>{m.sort(((e,t)=>e.ex-t.ex)),M||(M=!0,C((e=>{if(p.length<m.length){y.end>m.length-1&&(y.end=m.length-1);let e=m.slice(y.start,y.end);p.values=p.values.concat(e),y.start+=y.ite,y.end+=y.ite}p.values.forEach((t=>{R(t,e)}))})))},C=e=>{if("function"==typeof e){let a=16;f.clearRect(0,0,g.width,g.height),e(a),t((()=>{C(e)}))}},R=(e,t)=>{q(e,t),k(e),A(e)},q=(e,t)=>{if(e.stop)e.x=e.ex,e.y=e.ey;else{t/=1e3;const a=e.ex-e.x,i=e.ey-e.y,o=Math.atan(i/a);let s=Math.abs(e.a*Math.cos(o));s=e.x>e.ex?-s:s;let r=Math.abs(e.a*Math.sin(o));r=e.y>e.ey?-r:r,e.vx+=s*t,e.vy+=r*t,e.vx*=.95,e.vy*=.95,e.x+=e.vx*t,e.y+=e.vy*t,Math.abs(e.x-e.ex)<=e.checkLength&&Math.abs(e.y-e.ey)<=e.checkLength?(e.checkTimes++,e.checkTimes>=e.maxCheckTimes&&(e.stop=!0)):e.checkTimes=0}},A=e=>{if(!o.x)return void r();const t=a.mouseRadius,i=Math.sqrt(Math.pow(o.x-e.x,2)+Math.pow(o.y-e.y,2)),s=Math.atan((o.y-e.y)/(o.x-e.x));if(i<t){e.stop=!1,e.checkTimes=0,e.recordX||(e.recordX=e.ex,e.recordY=e.ey),e.a=2e3+1e3*(1-i/t);let a=Math.abs((t-i)*Math.cos(s)),r=Math.abs((t-i)*Math.sin(s));a=o.x>e.x?-a:a,r=o.y>e.y?-r:r,e.ex=e.x+a,e.ey=e.y+r}else r();function r(){e.recordX&&(e.stop=!1,e.checkTimes=0,e.a=1500,e.ex=e.recordX,e.ey=e.recordY,e.recordX=null,e.recordY=null)}};return l(a,(()=>{v()})),n((()=>{window.addEventListener("mousemove",_,!1),v(),window.addEventListener("resize",v,!1)})),d((()=>{window.removeEventListener("mousemove",_),window.removeEventListener("resize",v)})),(e,t)=>(u(),c("canvas",{ref_key:"canvasRef",ref:i,id:"WORD_CANVAS",style:{position:"relative","z-index":"2"}},null,512))}}),R={class:"login-page"},q={class:"login-page__panel flex flex-ac"},A={class:"login-page__left f-x"},V=["src"],T={class:"login-page__right"},X=g("div",{class:"bg"},null,-1),L=g("h1",{class:"title"},[g("span",null,"请登录！")],-1),S=o({__name:"index",setup(o){const n={mounted:e=>{e.querySelector("input").focus()}},d=new URL("/imgs/login-icon.png",self.location).href,S=r({username:"",password:"",code:"",randomStr:""}),E=r({username:[{required:!0,message:"请输入账号",trigger:"blur"}],password:[{required:!0,message:"请输入密码",trigger:"blur"}],code:[{required:!0,validator:(e,t,a)=>{!t&&(t=""),""==t?a(new Error("请输入验证码!")):a()},trigger:"blur"}]}),Y=s(!1),$=s(""),F=s({}),K=s(null),N=s(null),O=j(),U=M(),B=z(),D=h((()=>k.base.title));l(U,(({query:e})=>{e&&($.value="error"!=e.redirect&&e.redirect||"",F.value=(e=>Object.keys(e).reduce(((t,a)=>("redirect"!==a&&(t[a]=e[a]),t)),{}))(e))}),{immediate:!0});const I=()=>{const e=K.value;e&&e.validate((e=>{e&&O.login(S,N.value).then((e=>{$.value.indexOf(k.base.domian)<0?B.push({path:$.value||`${_}/`,query:F.value}):window.location.href=decodeURIComponent($.value)}))}))},W=({shiftKey:e,key:t,keyCode:a}={})=>{13!=a?(t&&1===t.length&&(Y.value=!!(e&&t>="a"&&t<="z"||!e&&t>="A"&&t<="Z")),"CapsLock"===t&&!0===Y.value&&(Y.value=!1)):I()};return(o,s)=>{const r=t,l=a,h=i,j=e;return u(),c("div",R,[m(C,{name:p(D),height:200,color:"#ffffff",size:35,"mouse-radius":50},null,8,["name"]),g("div",q,[g("div",A,[g("img",{src:p(d),alt:""},null,8,V)]),g("div",T,[g("div",{class:"login-page--right_form",ref_key:"loadingRef",ref:N},[X,L,m(j,{class:"form",ref_key:"loginRef",ref:K,model:p(S),rules:p(E)},{default:f((()=>[m(l,{prop:"username",key:"username"},{default:f((()=>[x(m(r,{clearable:"",modelValue:p(S).username,"onUpdate:modelValue":s[0]||(s[0]=e=>p(S).username=e),placeholder:"账户",tabindex:"1",size:"large","prefix-icon":p(w),onKeyup:v(I,["enter"])},null,8,["modelValue","prefix-icon"]),[[n]])])),_:1}),m(h,{visible:p(Y),content:"大小写锁定",placement:"right",manual:""},{default:f((()=>[m(l,{prop:"password",key:"password"},{default:f((()=>[m(r,{clearable:"",placeholder:"密码",tabindex:"2",modelValue:p(S).password,"onUpdate:modelValue":s[1]||(s[1]=e=>p(S).password=e),type:"password","show-password":"",size:"large","prefix-icon":p(y),onKeyup:W,onBlur:s[2]||(s[2]=e=>Y.value=!1)},null,8,["modelValue","prefix-icon"])])),_:1})])),_:1},8,["visible"]),m(l,{prop:"code",key:"code"},{default:f((()=>[m(r,{modelValue:p(S).code,"onUpdate:modelValue":s[3]||(s[3]=e=>p(S).code=e),clearable:"",placeholder:"验证码",maxlength:"6",tabindex:"3",size:"large","prefix-icon":p(b),onKeyup:v(I,["enter"])},null,8,["modelValue","prefix-icon"])])),_:1}),g("div",{class:"btn-wrap"},[g("div",{class:"btn",onClick:I},"login")])])),_:1},8,["model","rules"])],512)])])])}}});export{S as default};