import{ba as e,cg as n,bh as i,cl as t,bp as a,bc as o,bX as r}from"./vendor-16889df9.js";const l=()=>{let r;return{createDiffusion:(l=10,d=16715760,c=5)=>{const u=new e(l,l,1,1),s=["varying vec2 vUv;","void main() {","vUv = uv;","gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );","}"].join(""),f=["varying vec2 vUv;","uniform vec3 uColor;","uniform float uOpacity;","uniform float uSpeed;","uniform float uSge;","uniform float time;","float PI = 3.14159265;","float drawCircle(float index, float range) {","  float opacity = 1.0;","  if (index >= 1.0 - range) {","    opacity = 1.0 - (index - (1.0 - range)) / range;","  } else if(index <= range) {","    opacity = index / range;","  }","  return opacity;","}","float distanceTo(vec2 src, vec2 dst) {","  float dx = src.x - dst.x;","  float dy = src.y - dst.y;","  float dv = dx * dx + dy * dy;","  return sqrt(dv);","}","void main() {","  float iTime = -time * uSpeed;","  float opacity = 0.0;","  float len = distanceTo(vec2(0.5, 0.5), vec2(vUv.x, vUv.y));","  float size = 1.0 / uSge;","  vec2 range = vec2(0.65, 0.75);","  float index = mod(iTime + len, size);","  vec2 cRadius = vec2(0.06, 0.12);","  if (index < size && len <= 0.5) {","    float i = sin(index / size * PI);","    if (i >= range.x && i <= range.y){","      float t = (i - range.x) / (range.y - range.x);","      float r = 0.3;","      opacity = drawCircle(t, r);","    }","    opacity *=  1.0 - len / 0.5;","  };","  gl_FragColor = vec4(uColor, uOpacity * opacity);","}"].join("");r=new n({uniforms:{uColor:{value:new i(d)},uOpacity:{value:1},uSpeed:{value:.1},uSge:{value:c},uRadius:{value:l/2},time:{value:0}},transparent:!0,vertexShader:s,fragmentShader:f,depthTest:!1,blending:t,side:a});return new o(u,r)},updateDiffusion:(e=1)=>{if(!r)return;const n=.001*performance.now()*e;r.uniforms.time.value=n}}},d=()=>{let e;const n={index:0,length:0,runing:!1,model:void 0,speed:1,endCallback:void 0,rungingCall:void 0},i=n=>null==e?void 0:e.getPoints(n),t=(i=!0)=>{if(n.runing=!1,i){const i=n.index-1;n.model.position.copy((i=>{let t=i/n.length;return t>1?t=1:t<0&&(t=0),e.getPointAt(t)})(i))}};return{createMove:(t,a,o,l)=>{const d=t.position,c=Math.atan2(-a.z+d.z,a.x-d.x);t.rotation.y=.5*Math.PI+c;const u=d.distanceTo(a);let s=Math.floor(u/n.speed);s<2&&(s=2);e=new r([d,a],!1,"catmullrom",0),e=new r(i(s),!1,"catmullrom",0),n.model=t,n.index=0,n.length=s,n.rungingCall=o,n.endCallback=l,n.runing=!0},moveAnimate:(i=1)=>{if(!n.runing)return;n.index+=i;let a=n.index/n.length;a>1&&(a=1);const o=e.getPointAt(a);n.model.position.copy(o),a>=1?(n.runing=!1,"function"==typeof n.endCallback&&n.endCallback(o)):"function"==typeof n.rungingCall&&n.rungingCall(o,t)}}};export{d as a,l as u};