var e=Object.defineProperty,t=(t,i,s)=>(((t,i,s)=>{i in t?e(t,i,{enumerable:!0,configurable:!0,writable:!0,value:s}):t[i]=s})(t,"symbol"!=typeof i?i+"":i,s),s);import{bC as i,bk as s,cd as a,ce as n,b7 as r,bc as o,cf as l,e as h,i as m,l as u,o as v,g as c,h as p,n as f}from"./vendor-c8aa99b3.js";import{T as d,u as g}from"./scene-resize-479b00ff.js";import{_ as x}from"./index-2da77948.js";const y=new i,w=["01.jpeg","02.jpeg"].map((e=>`/oss/textures/effect/${e}`));class b extends d{constructor(e){return super(e),t(this,"textures",[]),t(this,"material"),t(this,"isPlaying",!1),t(this,"time",0),t(this,"move",0),t(this,"activeIndex",0),t(this,"progress",0),t(this,"isComplete",!0),this}async initModel(){this.textures=await new Promise((e=>{const t=w.length,i=new Array(t);w.forEach(((s,a)=>{y.load(s,(s=>{i[a]=s,i.filter(Boolean).length===t&&e(i)}))}))})),this.addMesh(),this.play(),this.change()}addMesh(){const e=new s(1920,1280),t=new a({fragmentShader:"\n        varying vec2 vUv;\n        varying vec2 vPosition;\n\n        uniform float time;\n        uniform float progress;\n        uniform vec4 resolution;\n        uniform sampler2D t1;\n        uniform sampler2D t2;\n\n        void main(){\n          vec2 newUV=vec2(vUv-vec2(0.5))*resolution.zw+vec2(.5);\n          vec4 tt1=texture2D(t1,newUV);\n          vec4 tt2=texture2D(t2,newUV);\n          float dist=distance(tt1,tt2)*.5;\n          // dist = newUV.x / 2. + .03 * sin(newUV.y*10. + time* 10.) + 0.2;\n          float pr=step(dist,progress);\n          vec4 final=mix(mix(tt1,tt2,pr),tt2,pr);\n          gl_FragColor=final;\n        }\n      ",vertexShader:"\n        varying vec2 vUv;\n        void main() {\n          vUv = uv;\n          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n        }\n      ",uniforms:{progress:{type:"f",value:0},time:{type:"f",value:0},resolution:{value:new n},t1:{type:"t",value:this.textures[0]},t2:{type:"t",value:this.textures[1]}},side:r,transparent:!0,depthTest:!1,depthWrite:!1,wireframe:!1}),i=new o(e,t);this.material=t,this.addObject(i),this.setTextureSize()}setTextureSize(){if(!this.material)return;const e=1280/1920,{width:t,height:i}=this.options;let s,a;i/t>e?(s=t/i*e,a=1):(s=1,a=i/t/e),this.material.uniforms.resolution.value.x=t,this.material.uniforms.resolution.value.y=i,this.material.uniforms.resolution.value.z=s,this.material.uniforms.resolution.value.w=a}change(){this.material&&this.isComplete&&(this.isComplete=!1,this.material.uniforms.t1.value=this.textures[this.activeIndex++],this.activeIndex%=this.textures.length,this.material.uniforms.t2.value=this.textures[this.activeIndex],l.fromTo(this,{progress:0},{duration:2.1,delay:1.2,progress:1,onComplete:()=>{this.isComplete=!0,this.change()}}))}play(){this.isPlaying||(this.isPlaying=!0)}stop(){this.isPlaying=!1}modelAnimate(){this.isPlaying&&(this.time+=.01,this.material&&(this.material.uniforms.time.value=this.time,this.material.uniforms.progress.value=this.progress))}}const _=x(h({__name:"index",setup(e){const t=m(),i={axes:{visible:!0},camera:{position:[2e3,0,2500]},controls:{maxDistance:1e4},directionalLight:{visible:!1},ambientLight:{visible:!1},grid:{visible:!0}};let s;return u((()=>{i.container=t.value,s=new b(i),s.run(),g(s).resize()})),(e,i)=>(v(),c("div",{class:f(e.$style.page)},[p("div",{class:f(e.$style.container),ref_key:"containerRef",ref:t},null,2)],2))}}),[["__cssModules",{$style:{page:"_page_4vabc_2",container:"_container_4vabc_10"}}]]);export{_ as default};