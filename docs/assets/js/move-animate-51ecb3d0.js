import{ba as n,co as e,bh as a,bx as i,bp as t,bc as o,bv as r}from"./vendor-a6dc29a3.js";const l=()=>{let r;return{createDiffusion:(l=10,d=16715760,c=5)=>{const u=new n(l,l,1,1);r=new e({uniforms:{uColor:{value:new a(d)},uOpacity:{value:1},uSpeed:{value:.1},uSge:{value:c},uRadius:{value:l/2},time:{value:0}},transparent:!0,vertexShader:"\n      varying vec2 vUv;\n      void main() {\n        vUv = uv;\n        // 最终顶点位置信息=投影矩阵*模型视图矩阵*每个顶点坐标\n        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n      }\n    ",fragmentShader:"\n      varying vec2 vUv;\n      uniform vec3 uColor;\n      uniform float uOpacity;\n      uniform float uSpeed;\n      uniform float uSge;\n      uniform float time;\n      float PI = 3.14159265;\n      float drawCircle(float index, float range) {\n        float opacity = 1.0;\n        if (index >= 1.0 - range) {\n          opacity = 1.0 - (index - (1.0 - range)) / range;\n        } else if(index <= range) {\n          opacity = index / range;\n        }\n        return opacity;\n      }\n      float distanceTo(vec2 src, vec2 dst) {\n        float dx = src.x - dst.x;\n        float dy = src.y - dst.y;\n        float dv = dx * dx + dy * dy;\n        return sqrt(dv);\n      }\n      void main() {\n        float iTime = -time * uSpeed;\n        float opacity = 0.0;\n        float len = distanceTo(vec2(0.5, 0.5), vec2(vUv.x, vUv.y));\n\n        float size = 1.0 / uSge;\n        vec2 range = vec2(0.65, 0.75);\n        float index = mod(iTime + len, size);\n        // 中心圆\n        vec2 cRadius = vec2(0.06, 0.12);\n\n        if (index < size && len <= 0.5) {\n          float i = sin(index / size * PI);\n\n          // 处理边缘锯齿\n          if (i >= range.x && i <= range.y){\n            // 归一\n            float t = (i - range.x) / (range.y - range.x);\n            // 边缘锯齿范围\n            float r = 0.3;\n            opacity = drawCircle(t, r);\n          }\n          // 渐变\n          opacity *=  1.0 - len / 0.5;\n        };\n        gl_FragColor = vec4(uColor, uOpacity * opacity);\n      }\n    ",depthTest:!1,blending:i,side:t});return new o(u,r)},updateDiffusion:(n=1)=>{if(!r)return;const e=.001*performance.now()*n;r.uniforms.time.value=e}}},d=()=>{let n;const e={index:0,length:0,runing:!1,model:void 0,speed:1,endCallback:void 0,rungingCall:void 0},a=e=>null==n?void 0:n.getPoints(e);return{createMove:(i,t,o,l)=>{const d=i.position,c=Math.atan2(-t.z+d.z,t.x-d.x);i.rotation.y=.5*Math.PI+c;const u=d.distanceTo(t);let s=Math.floor(u/e.speed);s<2&&(s=2);n=new r([d,t],!1,"catmullrom",0),n=new r(a(s),!1,"catmullrom",0),e.model=i,e.index=0,e.length=s,e.rungingCall=o,e.endCallback=l,e.runing=!0},moveAnimate:(a=1)=>{if(!e.runing)return;e.index+=a;let i=e.index/e.length;i>1&&(i=1);const t=n.getPointAt(i),{x:o,y:r,z:l}=t;e.model.position.set(o,r,l),i>=1?(e.runing=!1,"function"==typeof e.endCallback&&e.endCallback(t)):"function"==typeof e.rungingCall&&e.rungingCall(t)}}};export{d as a,l as u};