var e,t,n,o=Object.defineProperty,a=(e,t,n)=>(((e,t,n)=>{t in e?o(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n})(e,"symbol"!=typeof t?t+"":t,n),n),r=(e,t,n)=>{if(!t.has(e))throw TypeError("Cannot "+n)},i=(e,t,n)=>(r(e,t,"read from private field"),n?n.call(e):t.get(e)),s=(e,t,n)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,n)},l=(e,t,n)=>(r(e,t,"access private method"),n);import{cu as c,cv as u,ba as p,bG as d,b3 as h,c1 as m,cb as v,bm as f,cc as g,cd as y,br as w,c0 as x,cw as b,cx as C,bs as S,cy as M,b4 as P,cz as _,cA as j,cB as I,cj as O,cC as z,ck as G,bw as L,bq as R,a_ as T,bn as k,bu as E,cD as D,ce as F,bx as U,bg as B,c as W,aY as $,bv as N,bo as X,bh as A,a$ as V,cE as q,cF as J,cG as Y,b2 as H,cH as Z,cI as K,bp as Q,Y as ee,cJ as te,i as ne,cK as oe,e as ae,l as re,o as ie,g as se,h as le,q as ce,p as ue,I as pe,n as de,u as he,a9 as me,t as ve,B as fe,F as ge,r as ye,ah as we}from"./vendor-fd8a184d.js";import{j as xe,A as be,n as Ce,_ as Se}from"./common-ce9ec953.js";import{d as Me,r as Pe,T as _e,u as je}from"./scene-resize-e304954a.js";import{u as Ie}from"./raycaster-e549834a.js";const Oe=()=>({initCSS3DRender:(e,t)=>{const{width:n,height:o}=e,a=new O;return a.setSize(n,o),a.domElement.style.position="absolute",a.domElement.style.left="0px",a.domElement.style.top="0px",a.domElement.style.pointerEvents="none",t.appendChild(a.domElement),a},createCSS3DDom:e=>{const{name:t,className:n="",onClick:o,position:a,sprite:r}=e,i=document.createElement("div");i.innerHTML=t,i.className=n;const s=r?new z(i):new G(i);return i.style.pointerEvents=o?"auto":"none",i.style.position="absolute","function"==typeof o&&i.addEventListener("click",o),a&&s.position.set(...a),s}}),{createCSS3DDom:ze}=Oe(),Ge=1,Le=40,Re=100,Te=3377879,ke=9633791,Ee=9633791,De=1066618,Fe=3377879,Ue=1066618,Be=9559027,We=6421501,$e=663606,Ne=927811,Xe=11856636,Ae=13303807,Ve=6945023,qe=9559027,Je=6421501,Ye=9559027,He=6421501,{createCorrugatedPlate:Ze,update:Ke}=((e={})=>{const t=Me({range:100,interval:.8,size:.2,color:47273,light:881527,factor:1},e);return{createCorrugatedPlate:()=>{let{range:e,color:n,light:o,factor:a}=t;e*=a;const r=(()=>{let{range:e,interval:n,size:o,factor:a}=t;e*=a,n*=a,o*=a;const r=[],i=Math.floor(e/n);for(let t=-i;t<=i;t++)for(let e=-i;e<=i;e++){const a=new m(o,o),i=t*n,s=e*n,l=new v,c=new f(i,-o,s),u=new g,p=new y,d=new f(1,1,1);u.setFromEuler(p),l.compose(c,u,d),a.applyMatrix4(l),r.push(a)}return r})(),i=c(r),s=new u({uniforms:{uColor:{value:new p(o)},uTcolor:{value:new p(n)},uRadius:{value:1.25},uLength:{value:e/10},uRange:{value:e}},vertexShader:"\n        varying vec3 vp;\n        void main(){\n          vp = position;\n          gl_Position\t= projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n        }\n      ",fragmentShader:"\n        varying vec3 vp;\n        uniform vec3 uColor;\n        uniform vec3 uTcolor;\n        uniform float uRadius;\n        uniform float uLength;\n        float getLeng(float x, float y){\n          return  sqrt((x-0.0)*(x-0.0)+(y-0.0)*(y-0.0));\n        }\n        void main(){\n          float uOpacity = 0.8;\n          vec3 vColor = uColor;\n          float length = getLeng(vp.x,vp.z);\n          if ( length <= uRadius && length > uRadius - uLength ) {\n            float op = sin( (uRadius - length) / uLength ) ;\n            uOpacity = op;\n            if ( vp.y < 0.0 ) {\n              vColor = uColor * op;\n            } else {\n              vColor = uTcolor;\n            };\n            vColor = uTcolor;\n          }\n          gl_FragColor = vec4(vColor,uOpacity);\n        }\n      ",transparent:!0,depthWrite:!1,side:d}),l=new h(i,s);return l.name="波纹板",l},update:(e,t)=>{const n=e.material,o=n.uniforms.uRange.value,a=n.uniforms.uLength.value;n.uniforms.uRadius.value+=t*(o/4),n.uniforms.uRadius.value>=o+a&&(n.uniforms.uRadius.value=0)}}})({factor:Le,color:Fe,light:Ue}),{createOutline:Qe,update:et}=((e={})=>{const t=Me({size:.1,color:16085360,range:500,factor:1,speed:6},e);return{createOutline:e=>{const{size:n,factor:o,range:a,color:r}=t,i=new Float32Array(e),s=new w;s.setAttribute("position",new x(i,3));const l=new Float32Array(Math.floor(i.length/3)).map(((e,t)=>t));s.setAttribute("aIndex",new x(l,1));const c=new u({vertexShader:"\n        attribute float aOpacity;\n        uniform float uSize;\n\n        attribute float aIndex;\n        varying vec3 vp;\n        varying float vertexIndex;\n\n        void main(){\n          gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);\n          gl_PointSize = uSize;\n\n          vp = position;\n          vertexIndex = aIndex;\n        }\n      ",fragmentShader:"\n        varying float vertexIndex;\n        uniform vec3 uColor;\n        uniform float uIndex;\n        uniform float uRange;\n\n        float invert(float n){\n          return 1.-n;\n        }\n\n        void main(){\n          float uOpacity = 1.0;\n          if(vertexIndex <= uIndex || vertexIndex >= (uRange + uIndex)){\n              discard;\n          }\n          uOpacity = (vertexIndex - uIndex)/uRange;\n          if ( uOpacity < 0.2) {\n            discard;\n          }\n          vec2 uv=vec2(gl_PointCoord.x,invert(gl_PointCoord.y));\n          vec2 cUv=2.*uv-1.;\n          vec4 color=vec4(1./length(cUv));\n          color*=uOpacity;\n          color.rgb*=uColor;\n          gl_FragColor=color;\n        }\n      ",transparent:!0,depthTest:!1,uniforms:{uSize:{value:n*o},uIndex:{value:0},uLength:{value:l.length},uRange:{value:a},uColor:{value:new p(r)}}}),d=new b(s,c);return d.name="轮廓",d.scale.setScalar(o),d},update:e=>{const n=e.material,o=n.uniforms.uLength.value;n.uniforms.uIndex.value+=t.speed,n.uniforms.uIndex.value>=o&&(n.uniforms.uIndex.value=0)}}})({factor:Le,color:Xe}),{getBoundingBox:tt}={getBoundingBox:e=>{var t=new C;t.expandByObject(e);var n=new f;t.getSize(n);var o=new f;return t.getCenter(o),{box3:t,center:o,size:n}}},{createCountryFlatLine:nt,getPoints:ot}=(()=>{const e=(e,t,n="LineLoop")=>{let o;if("Line2"===n){const n=new _;n.setPositions(e),o=new j(n,t),o.name="countryLine2",o.computeLineDistances()}else{const a=new w;a.setFromPoints(e),o=new I[n](a,t),o.name="countryLine"}return o};return{createCountryFlatLine:(t,n={},o="LineLoop")=>{let a={color:65535,linewidth:1,depthTest:!1};a=Me(a,n);let r=new S(a);"Line2"===o&&(r=new M(a));let i=t.features,s=new P;for(let l=0;l<i.length;l++){const t=i[l].geometry.coordinates;for(let n=0;n<t.length;n++){const a=t[n],i=[];"Line2"===o?a.forEach((e=>{e.forEach((e=>{i.push(e[0],0,-e[1])}))})):a.forEach((e=>{e.forEach((e=>{i.push(new f(e[0],e[1],0))}))}));let l=e(i,r,o);s.add(l)}}return s},getPoints:(e,t=0,n)=>{let o=e.features;const a=[];for(let r=0;r<o.length;r++){const e=o[r].geometry.coordinates;for(let o=0;o<e.length;o++)e[o].forEach((e=>{e.forEach((e=>{n?a.push(new f(e[0],t,-e[1])):a.push(e[0],t,-e[1])}))}))}return a}}})(),{initCSS3DRender:at,createCSS3DDom:rt}=Oe(),{createMarkLight:it}=(e=>{const t=Me({pointTextureUrl:"/oss/textures/map/point.png",circleTextureUrl:"/oss/textures/map/circle.png",lightTextureUrl:"/oss/textures/map/light.png",factor:1,color:65535},e),n=new L;return{createMarkLight:(e=[0,0,0],o=10)=>{const a=new P,r=new m(o/6.219,o);r.rotateX(-Math.PI/2),r.translate(0,0,o/2);const i=new R({map:n.load(t.lightTextureUrl),color:t.color,transparent:!0,depthWrite:!1,side:d});let s=new h(r,i);s.rotateX(Math.PI),s.position.z=o,s.renderOrder=3,s.name="光柱 01";let l=s.clone();l.name="光柱 02",l.rotateZ(Math.PI/2);const c=(()=>{const e=new m(3,3),o=new R({map:n.load(t.pointTextureUrl),color:t.color,side:d,transparent:!0,depthWrite:!1});let a=new h(e,o);a.renderOrder=1,a.name="底部光点";const r=.3*t.factor;return a.scale.setScalar(r),a})(),u=(()=>{const e=new m(3,3),o=new R({map:n.load(t.circleTextureUrl),color:t.color,side:d,opacity:0,transparent:!0,depthWrite:!1});let a=new h(e,o);a.renderOrder=2,a.name="createLightHalo";const r=.5*t.factor;a.scale.setScalar(r);const i=Pe(0,2e3);return a.tween1=new T({scale:r,opacity:0}).to({scale:1.5*r,opacity:1},1e3).delay(i).onUpdate((e=>{let{scale:t,opacity:n}=e;a.scale.setScalar(t),a.material.opacity=n})),a.tween2=new T({scale:1.5*r,opacity:1}).to({scale:2*r,opacity:0},1e3).onUpdate((e=>{let{scale:t,opacity:n}=e;a.scale.setScalar(t),a.material.opacity=n})),a.tween1.chain(a.tween2),a.tween2.chain(a.tween1),a.tween1.start(),a})();return a.add(s,l,c,u),a.position.set(...e),a.rotateX(.5*Math.PI),a.name="光柱标记",a}}})({pointTextureUrl:"/oss/textures/map/point.png",circleTextureUrl:"/oss/textures/map/circle.png",lightTextureUrl:"/oss/textures/map/light.png",factor:Le,color:Ae}),{raycaster:st,pointer:lt,style:ct,update:ut}=Ie(),{createFlywire:pt,update:dt}=((e={})=>{const t=Me({depth:0,height:4,divisions:1e3,color:16777215,flyColor:16761095,pointColor:16715760,pointWidth:2.5,flyPointWidth:2.4,tubularSegments:256,radius:.5,radialSegments:8,closed:!1,length:100,factor:1,speed:4},e),n=new u({depthTest:!1,uniforms:{uColor:{value:new p(t.flyColor)},uIndex:{value:0},uTotal:{value:t.divisions},uWidth:{value:t.flyPointWidth},uLength:{value:t.length}},vertexShader:"\n      attribute float aIndex;\n      uniform float uIndex;\n      uniform float uWidth;\n      uniform vec3 uColor;\n      varying float vSize;\n      uniform float uLength;\n\n      void main(){\n          vec4 viewPosition = viewMatrix * modelMatrix * vec4(position,1);\n          gl_Position = projectionMatrix * viewPosition;\n\n          if(aIndex >= uIndex - uLength && aIndex < uIndex){\n            vSize = uWidth * ((aIndex - uIndex + uLength) / uLength);\n          }\n          gl_PointSize = vSize;\n      }\n    ",side:d,fragmentShader:"\n      varying float vSize;\n      uniform vec3 uColor;\n      void main(){\n          if(vSize<=0.0){\n            gl_FragColor = vec4(1,0,0,0);\n          }else{\n            gl_FragColor = vec4(uColor,1);\n          }\n      }\n    ",transparent:!0,vertexColors:!1}),o=new u({uniforms:{uColor:{value:new p(t.pointColor)},uOpacity:{value:1},uSpeed:{value:.1},uSge:{value:4},uRadius:{value:t.pointWidth*t.factor/2},time:{value:0}},transparent:!0,depthTest:!1,vertexShader:"\n      varying vec2 vUv;\n      void main() {\n        vUv = uv;\n        // 最终顶点位置信息=投影矩阵*模型视图矩阵*每个顶点坐标\n        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n      }\n    ",fragmentShader:"\n      varying vec2 vUv;\n      uniform vec3 uColor;\n      uniform float uOpacity;\n      uniform float uSpeed;\n      uniform float uSge;\n      uniform float time;\n      float PI = 3.14159265;\n      float drawCircle(float index, float range) {\n        float opacity = 1.0;\n        if (index >= 1.0 - range) {\n          opacity = 1.0 - (index - (1.0 - range)) / range;\n        } else if(index <= range) {\n          opacity = index / range;\n        }\n        return opacity;\n      }\n      float distanceTo(vec2 src, vec2 dst) {\n        float dx = src.x - dst.x;\n        float dy = src.y - dst.y;\n        float dv = dx * dx + dy * dy;\n        return sqrt(dv);\n      }\n      void main() {\n        float iTime = -time * uSpeed;\n        float opacity = 0.0;\n        float len = distanceTo(vec2(0.5, 0.5), vec2(vUv.x, vUv.y));\n\n        float size = 1.0 / uSge;\n        vec2 range = vec2(0.65, 0.75);\n        float index = mod(iTime + len, size);\n        // 中心圆\n        vec2 cRadius = vec2(0.06, 0.12);\n\n        if (index < size && len <= 0.5) {\n          float i = sin(index / size * PI);\n\n          // 处理边缘锯齿\n          if (i >= range.x && i <= range.y){\n            // 归一\n            float t = (i - range.x) / (range.y - range.x);\n            // 边缘锯齿范围\n            float r = 0.3;\n            opacity = drawCircle(t, r);\n          }\n          // 渐变\n          opacity *=  1.0 - len / 0.5;\n        };\n        gl_FragColor = vec4(uColor, uOpacity * opacity);\n      }\n    ",side:d}),a=e=>{const[n,a]=e;let{pointWidth:r,depth:i,factor:s}=t;const l=r*s;i*=s;const c=new m(l,l,1,1),u=new h(c,o);return u.position.set(n,i,-a),u.rotateX(.5*-Math.PI),u};return{createFlywire:e=>{const o=new P,r=a(e[0]),i=a(e[1]);o.add(r,i);const s=(e=>{const[n,o]=e[0],[a,r]=e[1];let{depth:i,height:s,factor:l,divisions:c}=t;s=(i+s)*l,i*=l;const u=new f(n,i,-o),p=new f(n+(a-n)/4,s,-(o+(r-o)/4)),d=new f(n+3*(a-n)/4,s,-(o+3*(r-o)/4)),h=new f(a,i,-r);return new D(u,p,d,h).getPoints(c)})(e),l=new k(s,!1,"centripetal",.5),c=new E(l,t.tubularSegments,t.radius,t.radialSegments,t.closed),d=new u({transparent:!0,opacity:1,depthTest:!1,vertexColors:!1,uniforms:{uColor:{value:new p(t.color)},uOpacity:{value:.6}},vertexShader:"\n        varying vec3 vColor;\n        uniform vec3 uColor;\n        void main() {\n          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n        }\n      ",fragmentShader:"\n        uniform vec3 uColor;\n        uniform float uOpacity;\n        void main() {\n          gl_FragColor = vec4(uColor, uOpacity);\n        }\n      "}),m=new h(c,d);m.renderOrder=10;const v=(e=>{const t=new Float32Array(e.map(((e,t)=>t))),o=(new w).setFromPoints(e);return o.setAttribute("aIndex",new x(t,1)),new b(o,n)})(s);return o.add(m,v),o},update:()=>{const e=n,a=e.uniforms.uTotal.value;e.uniforms.uIndex.value+=t.speed,e.uniforms.uIndex.value>=a&&(e.uniforms.uIndex.value=0);const r=.001*performance.now();o.uniforms.time.value=r}}})({depth:Ge,color:Be,flyColor:Je,pointColor:qe,factor:Le}),{createBar:ht}=((e={})=>{const t=Me({height:10,size:2,factor:1,color1:1048575,color2:16777215},e);return{createBar:(e={})=>{let{size:n,height:o,factor:a,color1:r,color2:i}=t;n*=a,o*=a,o*=e.heightRatio??a;const[s,l,c]=e.position||[0,0,0],d=new P,m=new F(n,n,o),v=new u({depthTest:!1,transparent:!0,vertexColors:!1,uniforms:{uColor1:{value:new p(r)},uColor2:{value:new p(i)},uOpacity:{value:.6}},vertexShader:"\n        varying vec3 vColor;\n        uniform vec3 uColor1;\n        uniform vec3 uColor2;\n        void main() {\n          float percent = (position.z + 0.0) / 100.0; // 计算当前像素点在立方体高度上的百分比\n          vColor = mix(uColor1.rgb, uColor2.rgb, percent);\n          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n        }\n      ",fragmentShader:"\n        varying vec3 vColor;\n        uniform float uOpacity;\n        void main() {\n          gl_FragColor = vec4(vColor, uOpacity);\n        }\n      "}),f=new h(m,v);if(d.add(f),d.name="柱状图",d.position.set(s,l,c+o/2),d.renderOrder=99,e.label){const{name:t="",className:n="",onClick:a}=e.label,r=ze({name:t,className:n,position:[0,0,o/2],onClick:a});r.rotateX(.5*Math.PI),d.add(r)}return d}}})({height:5,size:.2,factor:Le,color1:Ae,color2:Ve}),mt=new q;mt.setURLModifier((e=>"/oss/textures/map"+e));const vt=new L(mt),ft={x:105.06,y:0,z:32.93},gt=vt.load("/gz-map.jpg"),yt=vt.load("/gz-map-fx.jpg"),wt=vt.load("/border.png");gt.wrapS=yt.wrapS=wt.wrapS=U,gt.wrapT=yt.wrapT=wt.wrapT=U,gt.flipY=!1;const xt=.0128;gt.repeat.set(xt,xt),yt.repeat.set(xt,xt);const bt=e=>{const t=new J(e),n=new Y(t,{depth:Ge,bevelEnabled:!0,bevelSegments:1,bevelThickness:0,steps:0,bevelSize:0}),o=new H({color:Te,map:gt,normalMap:yt,combine:Z,transparent:!0,opacity:.8}),a=new N({color:Ee,map:wt,transparent:!0,opacity:.9}),r=new h(n,[o,a]);return r.scale.setScalar(Le),r.name="地图拼块",r},Ct=(e,t)=>{if(!e.centroid&&!e.center)return!1;const[n,o]=e.centroid||e.center,a=rt({name:`\n      <img src="/oss/img/map/label.png" />\n      <div class="name">${e.name}</div>\n    `,className:"map-3D-label",position:[n*Le,o*Le*.995,Ge*Le]});a.rotateX(.5*Math.PI),a.name=e.name+"_CSS3D_label",a.isLabel=!0,t.add(a)},St=(e,t)=>{if(!e.centroid&&!e.center)return!1;const n=1+(o=5,a=10,(Math.floor(Math.random()*(a-o+1))+o)/4);var o,a;const[r,i]=e.centroid||e.center,s=it([r,i,1.01*Ge].map((e=>e*Le)),n*Le);s.rotateX(-Math.PI/2),t.add(s)},Mt=(e,t)=>{const n=new P,o=.2*Le,a=new K(o,32),r=new R({color:Ye,transparent:!0,opacity:1}),i=new h(a,r),s=new Q(.8*o,32,32,0,Math.PI),l=new R({color:He,transparent:!0,opacity:1}),c=new h(s,l);return n.add(i,c),n.position.set(e*Le,t*Le,Ge*Le*1.005),n},Pt=vt.load("/out-circle2.png"),_t=vt.load("/inner-circle2.png");class jt extends _e{constructor(n){super(n),s(this,t),a(this,"corrugatedPlate"),a(this,"clock"),a(this,"mapGroup"),a(this,"scatterGroup"),a(this,"flywireGroup"),a(this,"css3DRender"),a(this,"outline"),s(this,e,void 0),a(this,"outRingMesh"),a(this,"innerRingMesh"),this.clock=new B,this.css3DRender=at(this.options,this.container),this.addModel(),this.bindEvent()}addModel(){const e=Ze();e.renderOrder=0,this.corrugatedPlate=e,this.addObject(e)}onDblclick(e){}onPointerDown(e){this.pointer.isClick=!0,this.pointer.tsp=e.timeStamp}onPointerMove(e){const o=this.container,a=this.options.scale;if(ut(e,o,a),this.mapGroup){st.setFromCamera(lt,this.camera);const e=[this.mapGroup];this.scatterGroup&&e.push(this.scatterGroup);const o=st.intersectObjects(e);if(this.container.style.cursor=o.length?"pointer":"auto",o.length>0){const e=o[0].object;let a;const r=this.findParentGroupGroupUuid(e);r&&(a=r.uuid,l(this,t,n).call(this,r)),this.setMapBlockColor(a)}else l(this,t,n).call(this),this.setMapBlockColor()}}onPointerUp(e){this.pointer.isClick=!1;const t=e.timeStamp-this.pointer.tsp<Re;2==e.button||(0==e.button?t&&this.clickObject(e):e.button)}clickObject(e){const t=this.container,n=this.options.scale;if(ut(e,t,n),this.scatterGroup){st.setFromCamera(lt,this.camera);const e=[this.scatterGroup],t=st.intersectObjects(e);if(this.container.style.cursor=t.length?"pointer":"auto",t.length){const e=t[0].object,n=this.findParentGroupGroupUuid(e).data||{};W.info({message:n.name,grouping:!0})}}}findParentGroupGroupUuid(e){const t=e=>{let n=e.parent;if(n)return n&&n.isProvinceGroup||n.isScatter?n:t(n)};return t(e)}setMapBlockColor(e){this.mapGroup.traverse((t=>{if(t.isProvinceBlock)t.material[0].color.set(t.parent.uuid===e?ke:Te),t.material[1].color.set(t.parent.uuid===e?De:Ee);else if(t.isLabel){const n=t.parent.uuid===e;t.element.className="map-3D-label"+(n?" is-active":"")}}))}initGrid(){const e=200*Le,t=1.4*Le,n=e/20,o=-e/2;let a=new $(e,20,$e,$e);this.grid=a;const r=new P;for(let i=0;i<=20;i++)for(let e=0;e<=20;e++){const a=o+i*n,s=o+e*n,l=new m(t,t/5),c=new N({color:Ne,transparent:!0,opacity:.9}),u=new h(l,c);u.rotateX(.5*-Math.PI),u.position.set(a,.1,s);const p=u.clone();p.rotateZ(.5*Math.PI),r.add(u,p)}r.name="辅助交点",this.addObject(a,r)}initMap(e){this.mapGroup&&(this.disposeObj(this.mapGroup),this.mapGroup=null);const t=new P;t.name="地图";const n=e.features,o=n.length;for(let u=0;u<o;u++){const e=n[u],o=new X,a=e.geometry.coordinates,r=e.properties;for(let t=0;t<a.length;t++)a[t].forEach((e=>{const t=e.map((e=>new A(e[0],e[1]))),n=bt(t);n.isProvinceBlock=!0,o.add(n)}));Ct(r,o),St(r,o),o.rotateX(-Math.PI/2),o.isProvinceGroup=!0,o.name=r.name,o.data=r,t.add(o)}((e,t)=>{let n=nt(e,{color:Be,transparent:!0},"Line2");n.name="地图上边框",n.position.y+=Ge*Le;let o=nt(e,{color:We},"Line2");o.name="地图下边框",n.scale.setScalar(Le),o.scale.setScalar(Le),t.add(n),t.add(o)})(e,this.scene);const a=tt(t);let{size:r,center:{x:i,y:s,z:l}}=a;this.mapGroup=t,ft.x=i,ft.y=s,ft.z=l,this.corrugatedPlate.position.set(i,0-.1*Le,l),this.resetSceneEle();const c=r.x<r.y?r.y+1:r.x+1;this.outRingMesh=((e,t)=>{let n=new m(t,t),o=new R({map:Pt,transparent:!0,opacity:1,depthTest:!0}),a=new h(n,o);const{x:r,z:i}=ft;return a.position.set(r,-1,i),a.scale.setScalar(1.2),a.rotateX(.5*-Math.PI),e.add(a),a})(this.scene,c),this.innerRingMesh=((e,t)=>{let n=new m(t,t),o=new R({map:_t,transparent:!0,opacity:1,depthTest:!0}),a=new h(n,o);const{x:r,z:i}=ft;return a.position.set(r,-2,i),a.scale.setScalar(1.2),a.rotateX(.5*-Math.PI),e.add(a),a})(this.scene,.9*c),this.addObject(t)}initMapBar(e){if(!this.mapGroup)return;this.clearMapBar();const t=Math.max(...e.map((e=>e.use)));for(let n=0;n<e.length;n++){const{name:o,use:a}=e[n],r=this.mapGroup.getObjectByName(o);if(r){const e=a/t,{centroid:n,center:o,name:i}=r.data,s=n||o,l=ht({position:[s[0]*Le,s[1]*Le,Ge*Le],heightRatio:e,label:{name:`\n              <div class="label-wrap">\n                <div class="name">${i}</div>\n                <div class="text">\n                  <span class="value">${Ce(a)}</span>\n                  <span class="unit">kWh</span>\n                </div>\n              </div>\n            `,className:"map-bar-label"}});l.isBar=!0,r.add(l)}else;}}clearMapBar(){this.mapGroup.traverse((e=>{e.isBar&&this.disposeObj(e)}))}initMapOutLine(e){this.outline&&(this.disposeObj(this.outline),this.outline=null);const t=ot(e,Ge,!1),n=Qe(t);n.renderOrder=10,this.outline=n,this.addObject(n)}initScatter(t,n){this.scatterGroup&&(this.disposeObj(this.scatterGroup),this.scatterGroup=null);const o=new P;o.name="散点集合";for(let e=0;e<t.length;e++){const n=t[e],[a=0,r=0]=n.coord||[],i=Mt(a,r);i.name=n.name,i.data=n,i.isScatter=!0,o.add(i)}var a,i,s,l;o.rotateX(.5*-Math.PI),this.scatterGroup=o,this.addObject(o),s=n,r(a=this,i=e,"write to private field"),l?l.call(a,s):i.set(a,s)}initFlywire(e){this.flywireGroup&&(this.disposeObj(this.flywireGroup),this.flywireGroup=null);const t=new P;for(let n=0;n<e.length;n++){const{coords:o,path:a}=e[n],r=pt(o.map((e=>e.map((e=>e*Le)))));r.name=a,t.add(r)}t.name="飞线集合",t.renderOrder=20,this.flywireGroup=t,this.addObject(t)}resetSceneEle(){const{x:e,y:t,z:n}=ft;if(this.camera.lookAt(e,t,n),new T(this.camera.position).to({x:e,y:40*Le,z:n+40*Le},1e3).easing(V.Quadratic.In).start().onUpdate((()=>{})),this.controls.target=new f(e,t,n),this.grid){this.grid.position.set(e,0,n);this.scene.getObjectByName("辅助交点").position.set(e,0,n)}}modelAnimate(){let e=this.clock.getDelta();this.corrugatedPlate&&Ke(this.corrugatedPlate,e),this.outline&&et(this.outline),this.css3DRender&&this.css3DRender.render(this.scene,this.camera),wt.offset.y+=.005,this.outRingMesh&&(this.outRingMesh.rotation.z+=5e-4),this.innerRingMesh&&(this.innerRingMesh.rotation.z-=5e-4),this.flywireGroup&&dt()}resize(){if(super.resize(),this.css3DRender){const{width:e,height:t}=this.options;this.css3DRender.setSize(e,t)}}}e=new WeakMap,t=new WeakSet,n=function(t){"function"==typeof i(this,e)&&i(this,e).call(this,t,ct)};const It=["src"],Ot=Se(ae({__name:"index",setup(e){const{show:t,options:n}=(e=>{const t=ee({show:!1,...e});return{options:t,show:te(t.show),filters:ee({})}})({style:{left:"0px",top:"0px"},list:[],extend:{isScatter:!1,city:"",title:"",total:0}}),{load:o}=(()=>{const e=ne(0);return{load:t=>{const n=new oe;return new Promise(((o,a)=>{n.load(t,(e=>{let t={};try{t=JSON.parse(e)}catch(n){}o(t)}),(t=>{let{loaded:n,total:o}=t;e.value=Number((n/o*100).toFixed(0))}),a)}))},progress:e}})(),{transformGeoJSON:a}={transformGeoJSON:e=>{let t=e.features;for(let n=0;n<t.length;n++){const e=t[n];"Polygon"===e.geometry.type&&(e.geometry.coordinates=[e.geometry.coordinates])}return e}},r=ne(),i={bgColor:464681,camera:{position:[0,100,200]},fog:{visible:!1,near:2e3,far:3e3},render:{preserveDrawingBuffer:!0},grid:{visible:!0},controls:{maxPolarAngle:.46*Math.PI,maxDistance:5e3,enableDamping:!0,screenSpacePanning:!1},axes:{visible:!1}};let s;const l=()=>null==s?void 0:s.exportImage(),c=()=>{xe.get(be.d3.map).then((e=>{const t=[],n=[];return e.list.forEach((e=>{const o=e.projects.length;let a=e.province;["重庆","北京","天津","上海"].includes(a)&&(a+="市"),["台湾"].includes(a)&&(a+="省"),e.projects.forEach((n=>{t.push({coord:[n.lng,n.lat],name:n.name,carbon:n.carbon,use:n.use,total:o,city:e.province,id:n.id})}));const r=e.total;-1===n.findIndex((e=>e.name===a))&&n.push({id:e.code,name:a,code:e.code,total:o,city:e.province,use:r})})),{citys:n,projects:t,lines:e.lines}})).then((e=>{const{projects:o,citys:a}=e;null==s||s.initScatter(o,((e,o)=>{let r=!!e;if(r){n.style&&(n.style.left=o.left+"px",n.style.top=o.top+"px");const t=e.isScatter,i=e.data;let s="",l="",c=0,u=[];if(t)s=i.city,l=i.name,c=i.total,u=[{name:"今日用电量",value:i.use,unit:"kWh"},{name:"今日碳排放",value:i.carbon,unit:"kgCO₂"}];else{const t=a.find((t=>t.name==e.name));t?(s=null==t?void 0:t.city,c=(null==t?void 0:t.total)??0,u=[{name:"今日用电量",value:null==t?void 0:t.use,unit:"kWh"}]):r=!1}n.list=u,n.extend.city=s,n.extend.title=l,n.extend.total=c,n.extend.isScatter=t}t.value=r})),null==s||s.initMapBar(a),null==s||s.initFlywire(e.lines)}))};return re((()=>{i.container=r.value,s=new jt(i),s.run(),o("/oss/map/china.json").then((e=>{s.initMap(a(e)),c()})),o("/oss/map/china-outline.json").then((e=>{s.initMapOutLine(a(e))})),je(s).resize()})),(e,o)=>{const a=we;return ie(),se("div",{class:de([e.$style.page,"h-100 o-h"])},[le("div",{class:"h-100",ref_key:"containerRef",ref:r},null,512),le("div",{class:de(e.$style.operate)},[ce(a,{type:"primary",size:"small",onClick:l},{default:ue((()=>o[0]||(o[0]=[pe("导出")]))),_:1})],2),he(t)?(ie(),se("div",{key:0,class:de(e.$style["dialog-view"]),style:me(he(n).style)},[he(n).extend.city?(ie(),se("div",{key:0,class:de([e.$style.city,"flex"])},[le("span",{class:de(e.$style.name)},ve(he(n).extend.city),3),le("span",{class:de(e.$style.total)},ve(he(n).extend.total)+"个项目",3)],2)):fe("",!0),he(n).extend.title?(ie(),se("div",{key:1,class:de([e.$style.project,"flex flex-ac"])},[le("img",{src:`${he("")}oss/img/map/pos.png`,alt:""},null,8,It),le("span",{class:de(e.$style.name)},ve(he(n).extend.title),3)],2)):fe("",!0),le("div",{class:de(e.$style.count)},[(ie(!0),se(ge,null,ye(he(n).list,(t=>(ie(),se("div",{class:de(e.$style.item)},[le("span",null,ve(t.name),1),le("span",null,ve(t.value),1),le("span",null,ve(t.unit),1)],2)))),256))],2)],6)):fe("",!0)],2)}}}),[["__cssModules",{$style:{page:"_page_foajx_2",operate:"_operate_foajx_6","dialog-view":"_dialog-view_foajx_12",city:"_city_foajx_21",name:"_name_foajx_21",total:"_total_foajx_29",project:"_project_foajx_34",count:"_count_foajx_49",item:"_item_foajx_53"}}]]);export{Ot as default};