var e=Object.defineProperty,s=(s,t,o)=>(((s,t,o)=>{t in s?e(s,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):s[t]=o})(s,"symbol"!=typeof t?t+"":t,o),o);import{cY as t,cZ as o,bW as a,c_ as r,b7 as i,c$ as n,d0 as d,bS as l,b8 as h,e as m,i as c,l as p,o as b,g as u,h as g,n as f}from"./vendor-16889df9.js";import{S as x}from"./three-scene.module-24b3c661.js";import{u as _}from"./model-loader-8f6422bf.js";import{u as P}from"./scene-resize-81793ab7.js";import{_ as v}from"./index-c95106e6.js";import"./convert-17a5875b.js";import"./model-3a962665.js";import"./object-fb68a4c2.js";const{loadModel:w}=_({baseUrl:"",indexDB:{cache:!1,dbName:"THREE__BLOOM__DB",tbName:"TB",version:1}}),j={glb:"/oss/model/gltf/PrimaryIonDrive.glb",threshold:0,strength:1,radius:0,exposure:1};class y extends x{constructor(e){super(e),s(this,"bloomPass"),s(this,"composer"),s(this,"mixer"),s(this,"clock");const l=new t(this.scene,this.camera),{width:h,height:m}=this.options,c=new o(new a(h,m),1.5,.4,.85);c.threshold=j.threshold,c.strength=j.strength,c.radius=j.radius,this.bloomPass=c;const p=new r;this.clock=new i;const b=new n(this.renderer);b.addPass(l),b.addPass(c),b.addPass(p),this.composer=b,this.renderer.toneMapping=d,this.createGUI()}initModel(){w({url:j.glb,key:"",name:""}).then((e=>{e.scale.setScalar(50),this.addObject(e);const s=new l(e),t=e.animations[0];s.clipAction(t.optimize()).play(),this.mixer=s}))}createGUI(){var e;const s=new h,t=s.addFolder("泛光");t.add(j,"threshold",0,1).name("限制发光值").onChange((e=>{this.bloomPass&&(this.bloomPass.threshold=Number(e))})),t.add(j,"strength",0,3).name("强度").onChange((e=>{this.bloomPass&&(this.bloomPass.strength=Number(e))})),t.add(j,"radius",0,1).step(.01).name("半径").onChange((e=>{this.bloomPass&&(this.bloomPass.radius=Number(e))}));s.addFolder("渲染器").add(j,"exposure",.1,2).name("亮度").onChange((e=>{this.renderer.toneMappingExposure=Math.pow(e,4)})),s.domElement.style="position: absolute; top: 10px; right: 10px",null==(e=this.container)||e.appendChild(s.domElement)}animate(){if(this.composer&&this.composer.render(),this.mixer){const e=this.clock.getDelta();this.mixer.update(e)}}}const M=v(m({__name:"index",setup(e){const s=c(),t={camera:{position:[0,80,300]},grid:{visible:!1},axes:{visible:!1}};let o;return p((()=>{t.container=s.value,o=new y(t),o.run(),P(o).resize()})),(e,t)=>(b(),u("div",{class:f([e.$style.page,"h-100 o-h"])},[g("div",{ref_key:"containerRef",ref:s,class:"h-100"},null,512)],2))}}),[["__cssModules",{$style:{page:"_page_12f6y_2"}}]]);export{M as default};