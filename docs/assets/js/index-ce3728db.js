var e=Object.defineProperty,s=(s,a,o)=>(((s,a,o)=>{a in s?e(s,a,{enumerable:!0,configurable:!0,writable:!0,value:o}):s[a]=o})(s,"symbol"!=typeof a?a+"":a,o),o);import{cs as a,bA as o,bo as i,b_ as t,bc as n,ct as r,bk as d,ba as c,bx as l,bp as u,e as h,i as p,l as m,o as b,g as w,h as g}from"./vendor-e22d82ce.js";import{T as f,u as x}from"./scene-resize-97ffaa82.js";import{u as j}from"./background-1400bbec.js";import"./index-dadfedf9.js";import"./posZ-95d90af9.js";class v extends f{constructor(e){super(e),s(this,"gui"),s(this,"material"),s(this,"outLineMaterial"),this.addModel(),this.gui=new a,this.addGui()}addModel(){const e=this.createGround();this.addObject(e);const s=20,a=new o(10,32,32),l=new i({color:1276674,shininess:2,specular:3204042,side:t}),u=new n(a,l);u.position.y=s,u.position.x=-20,u.castShadow=!0;const h=new r(10,3,100,16),p=new n(h,l);p.position.x=s,p.position.y=s,p.castShadow=!0;const m=new d({color:16768637,side:t});this.outLineMaterial=m;const b=new n(h,m);b.scale.setScalar(1.05),b.position.copy(p.position);const w=new c(20,20),g=new n(w,l);g.position.x=-60,g.position.y=s,g.castShadow=!0,this.addObject(u,p,b,g),this.material=l}addGui(){var e;const s=this.gui;s.add(this.material,"side",{FrontSide:l,BackSide:t,DoubleSide:u}).onChange((e=>{this.material.side=Number(e)}));const a={color:this.outLineMaterial.color.getHex()};s.addColor(a,"color").name("轮廓颜色").onChange((e=>{this.outLineMaterial.color.set(e)})),s.domElement.className+=" gui-wrap",null==(e=this.container.parentNode)||e.appendChild(s.domElement)}}const y={class:"three-page"},S=h({__name:"index",setup(e){const s=p(),a={grid:{visible:!0}};let o;const{backgroundLoad:i}=j();return m((()=>{a.container=s.value,o=new v(a),o.run(),x(o).resize(),i(o,"226")})),(e,a)=>(b(),w("div",y,[g("div",{class:"h-100",ref_key:"containerRef",ref:s},null,512)]))}});export{S as default};