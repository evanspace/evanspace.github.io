var e=Object.defineProperty,s=(s,t,n)=>(((s,t,n)=>{t in s?e(s,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):s[t]=n})(s,"symbol"!=typeof t?t+"":t,n),n);import{b7 as t,b8 as n,be as i,ba as a,bb as o,bc as r,bd as d,af as h,e as c,i as l,l as b,o as w,g as u,h as m}from"./vendor-2cdf7600.js";import{T as p,u as v}from"./scene-resize-261bb492.js";import"./index-e477636a.js";class y extends p{constructor(e){super(e),s(this,"clock"),s(this,"gui"),s(this,"transformControls"),this.clock=new t,this.addControls(),this.initModel(),this.gui=new n,this.addGui()}init(){this.initLight(),this.initGrid(),this.initAxes()}addControls(){const e=this.camera,s=new i(e,this.renderer.domElement);s.addEventListener("dragging-changed",(e=>{this.controls.enabled=!e.value})),this.transformControls=s,this.addObject(s)}addGui(){var e;const s=this.gui;this.controls;s.domElement.style="position: absolute; top: 0px; right: 0px",null==(e=this.container.parentNode)||e.appendChild(s.domElement)}initModel(){const e=new a(300,300),s=new o({color:11721691,shininess:10}),t=new r(e,s);t.name="ground",t.rotation.x=1.5*Math.PI,t.receiveShadow=!0,this.addObject(t);const n=new d(50,50,50),i=new o({color:1276674,shininess:10}),c=new r(n,i);c.position.y=25,c.castShadow=!0,this.addObject(c),this.transformControls.attach(c),window.addEventListener("keydown",this.onKeydown.bind(this)),window.addEventListener("keyup",this.onKeyup.bind(this)),h((()=>{window.removeEventListener("keydown",this.onKeydown.bind(this)),window.removeEventListener("keyup",this.onKeyup.bind(this))}))}modelAnimate(){}onKeydown(e){const s=this.transformControls;switch(e.key){case"w":s.setMode("translate");break;case"e":s.setMode("rotate");break;case"r":s.setMode("scale");break;case"+":case"=":s.setSize(s.size+.1);break;case"-":case"_":s.setSize(Math.max(s.size-.1,.1));break;case"x":s.showX=!s.showX;break;case"y":s.showY=!s.showY;break;case"z":s.showZ=!s.showZ;break;case" ":s.enabled=!s.enabled;break;case"Escape":s.reset()}}onKeyup(e){}}const k={class:"three-page"},f=c({__name:"index",setup(e){const s=l(),t={axes:{visible:!0},grid:{visible:!0}};let n;return b((()=>{t.container=s.value,n=new y(t),n.run(),v(n).resize()})),(e,t)=>(w(),u("div",k,[m("div",{class:"h-100",ref_key:"containerRef",ref:s},null,512)]))}});export{f as default};