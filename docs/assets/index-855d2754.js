import{c as e,i as a,b4 as n,b5 as t,Z as o,l as i,ae as s,o as r,f as l,g as d,b9 as c,br as m,bs as u,bn as p,bt as g,bu as f,b6 as h,bv as w,bw as x,bx as b,by as v,bz as C,bh as y,bj as E}from"./vendor-828bb737.js";import{c as z,a as S,b as M,e as j}from"./common-c87e5003.js";import{h as D}from"./common-404c9468.js";const P={class:"page h-100"},F=e({__name:"index",setup(e){const F=D(),G=a(),_=new n;let L,W,k,A;_.background=new t("#fff");const I=()=>{const e=G.value;if(!L)return;const a=e.clientWidth,n=e.clientHeight,t=a/n;L.aspect=t,L.updateProjectionMatrix(),W.setSize(a,n)};let R;const T=()=>{R=requestAnimationFrame(T),H(),W.render(_,L)},H=()=>{let e=.001*performance.now();Q.position.y=20*Math.sin(e)+5,Q.rotation.x=.5*e,Q.rotation.z=.51*e,K.material.uniforms.time.value+=1/60},q=o({turbidity:10,rayleigh:2,mieCoefficient:.005,mieDirectionalG:.2,elevation:2,azimuth:180,exposure:null});let B;let K;const N=()=>{const e=new g(1e4,1e4);K=new f(e,{textureWidth:512,textureHeight:512,waterNormals:(new h).load(`${F.oss}/textures/waternormals.jpg`,(e=>{e.wrapS=e.wrapT=w})),sunDirection:new p,sunColor:16777215,waterColor:7695,distortionScale:3.7,fog:void 0!==_.fog}),K.rotation.x=-Math.PI/2,_.add(K)};let Z;const $=()=>{Z=new x,Z.scale.setScalar(1e4),_.add(Z)};let J;const O=()=>{const e=Z.material.uniforms;e.turbidity.value=q.turbidity,e.rayleigh.value=q.rayleigh,e.mieCoefficient.value=q.mieCoefficient,e.mieDirectionalG.value=q.mieDirectionalG;const a=b.degToRad(90-q.elevation),n=b.degToRad(q.azimuth);J.setFromSphericalCoords(1,a,n),Z.material.uniforms.sunPosition.value.copy(J),K.material.uniforms.sunDirection.value.copy(J).normalize(),_.environment=B.fromScene(Z).texture,W.toneMappingExposure=q.exposure};let Q;const U=()=>{let e=new v(30,30,30),a=new C({roughness:0,color:1365});Q=new y(e,a),_.add(Q)},V=()=>{const e=G.value;W=z(e),L=S(e,1,1e6),A=new c(16777215,1.5),_.add(A),j(16777215,1.5),k=M(L,W),k.maxPolarAngle=.45*Math.PI,k.screenSpacePanning=!1,N(),$(),W.toneMapping=m,W.outputEncoding=void 0,W.toneMappingExposure=1,q.exposure=W.toneMappingExposure,B=new u(W),J=new p,O(),U(),(e=>{const a=new E,n=a.addFolder("Sky");n.add(q,"turbidity",0,100,.1).name("浑浊").onChange(O),n.add(q,"rayleigh",0,4,.001).name("锐利").onChange(O),n.add(q,"mieCoefficient",0,.1,.001).name("散射系数").onChange(O),n.add(q,"mieDirectionalG",0,1,.001).name("方向").onChange(O),n.add(q,"elevation",0,90,.1).name("高度").onChange(O),n.add(q,"azimuth",-180,180,.1).name("方位").onChange(O),n.add(q,"exposure",0,1,1e-4).name("光晕强度").onChange(O);const t=a.addFolder("Water"),o=K.material.uniforms;t.add(o.distortionScale,"value",0,100,.1).name("变形尺度"),t.add(o.size,"value",.1,10,.1).name("大小"),a.domElement.style="position: absolute; top: 10px; right: 10px",e.appendChild(a.domElement)})(e)};return i((()=>{V(),T(),window.addEventListener("resize",I,!1)})),s((()=>{window.addEventListener("resize",I,!1),cancelAnimationFrame(R);try{_.clear(),W.dispose(),W.forceContextLoss(),W.content=null;let e=W.domElement.getContext("webgl");e&&e.getExtension("WEBGL_lose_context").loseContext()}catch(e){}})),(e,a)=>(r(),l("div",P,[d("div",{ref_key:"containerRef",ref:G,class:"container h-100",style:{position:"relative"}},null,512)]))}});export{F as default};