import{be as A,bv as e,bs as t,b6 as i,bw as s,bo as n,bx as r,by as o,bz as a,bc as c,bA as l,bk as g,bB as d,bC as h,bD as E,bE as p,bF as Q,bG as B,ba as b,bH as m,bI as u,bJ as I,bK as w,bL as C,bM as S,bN as U,bO as k,bP as J,bQ as G,bR as f,bS as v,bT as R,bU as M,b7 as x,bV as z,bW as y,b5 as j,bh as D,bX as Y,w as Z,af as L}from"./vendor-e22d82ce.js";import{c as O}from"./index-dadfedf9.js";const N=A=>((A,e)=>Object.prototype.toString.call(e)===`[object ${A}]`)("Object",A),W=(A,e=new Map)=>{if(null!=A&&N(A)){let t=e.get(A);if(t)return t;const i=Array.isArray(A);let s=i?[]:{};return t=e.set(A,s),i?A.forEach(((A,e)=>{s[e]=W(A,t)})):Object.keys(A).forEach((e=>{N(s[e])?s[e]=W(A[e],t):s[e]=A[e]})),s}return A},P=(A,e)=>{A=W(A);for(let t in e)t in A&&N(e[t])&&N(A[t])?A[t]=P(A[t],e[t]):A[t]=e[t];return A},F=(A,e)=>Math.floor(Math.random()*(e-A+1))+A,T=(A,e="")=>Array.isArray(A)?A.map((A=>T(A,e))):!(A=>{if(!A&&(A=""),!/^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}(\/\S*)?$/.test(A))return/^(https?:\/\/)(?:\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::\d{1,5})?(?:[/?#]\S*)?$/.test(A);return!0})(A)&&A.indexOf(e)<0?e+A:A,V=(A=0,e=2)=>{if(Math.abs(A)>=1e8){return 1*(A/1e8).toFixed(e)+"亿"}if(Math.abs(A)>=1e4){return 1*(A/1e4).toFixed(e)+"万"}return 1*A.toFixed(e)},X={container:document.body,width:window.innerWidth,height:window.innerHeight,baseUrl:"",bgColor:null,bgUrl:null,env:null,scale:1,fog:{visible:!1,near:100,far:1e3},render:{antialias:!0,logarithmicDepthBuffer:!0,preserveDrawingBuffer:!1},controls:{visible:!0,autoRotate:!1,autoRotateSpeed:2,enableDamping:!1,dampingFactor:.25,enablePan:!0,enableRotate:!0,enableZoom:!0,maxAzimuthAngle:1/0,minAzimuthAngle:1/0,minDistance:1,maxDistance:2e3,minPolarAngle:0,maxPolarAngle:Math.PI,maxTargetRadius:1/0,rotateSpeed:1,screenSpacePanning:!0},ambientLight:{visible:!0,color:16777215,intensity:1.5},directionalLight:{visible:!0,helper:!1,position:[500,1e3,800],position2:[-500,800,-800],light2:!0,color:16777215,intensity:1.5},camera:{helper:!1,near:1,far:1e4,position:[-350,510,700]},cruise:{visible:!1,enabled:!1,runing:!1,helper:!1,points:[],segment:2,tension:0,baseUrl:"",repeat:[.1,1],width:15,speed:1,mapSpeed:.006,offset:10,factor:1,auto:!1,animateBack:void 0},grid:{visible:!1,opacity:.3,transparent:!0,width:800,divisions:80,centerLineColor:10592673,gridColor:10592673,fork:!1,forkSize:1.4,forkColor:10592673},axes:{visible:!1,size:50}},H="/imgs/arrow-388f6ce2.png",K="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGUAAAE1CAYAAAD+hS6MAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALrSURBVHgB7dOxDQJBEMDABV1fdE5Mhr4IwkMiIUNPGw5mWrB8ue19DinXIUeUIFGCRAkSJUiUIFGCRAkSJUiUIFGCRAkSJUiUIFGCRAkSJUiUIFGCRAkSJUiUIFGCRAkSJUiUIFGCRAkSJUiUIFGCRAkSJUiUIFGCRAkSJUiUIFGCRAkSJUiUIFGCRAkSJUiUIFGCRAkSJUiUIFGCRAlax+M+tDglSJQgUYJECRIlSJQgUYJECRIlSJQgUYJECRIlSJQgUYJECRIlSJQgUYJECRIlSJQgUYJECRIlSJQgUYJECRIlSJQgUYJECRIlSJQgUYJECRIlSJQgUYJECRIlaH2fx9DilCBRgkQJEiVIlCBRgkQJEiVIlCBRgkQJEiVIlCBRgkQJEiVIlCBRgkQJEiVIlCBRgkQJEiVIlCBRgkQJEiVIlCBRgkQJEiVIlCBRgkQJEiVIlCBRgkQJWud+Dy1OCRIlSJQgUYJECRIlSJQgUYJECRIlSJQgUYJECRIlSJQgUYJECRIlSJQgUYJECRIlSJQgUYJECRIlSJQgUYJECRIlSJQgUYJECRIlSJQgUYJECRIlSJQgUYJECRIlSJQgUYJECVq/12docUqQKEGiBIkSJEqQKEGiBIkSJEqQKEGiBIkSJEqQKEGiBIkSJEqQKEGiBIkSJEqQKEGiBIkSJEqQKEGiBIkSJEqQKEGiBIkSJEqQKEGiBIkSJEqQKEGiBIkSJEqQKEGiBIkSJEqQKEGiBIkSJEqQKEGiBIkSJEqQKEGiBIkSJEqQKEGiBIkSJEqQKEGiBIkSJEqQKEGiBIkSJEqQKEGiBIkSJEqQKEGiBIkSJEqQKEGiBIkSJEqQKEGiBIkSJEqQKEGiBIkSJEqQKEGiBIkSJEqQKEGiBIkSJEqQKEGiBIkSJEqQKEGiBIkSJEqQKEGiBIkSJEqQKEGiBIkSJEqQKEGiBIkSJEqQKEGiBIkSJEqQKEGiBIkSJEqQKEGiBP0B9I0QJBOMnj4AAAAASUVORK5CYII=",q="/imgs/circle-f2c3f6ed.png",_="/imgs/fenceMap0-f5b83c5b.png",$="/imgs/fenceMap1-edfa8012.png",AA="/imgs/fenceMap2-8f612558.png",eA="/imgs/gz-map-fx-c5e413a7.jpg",tA="/imgs/gz-map-15a6793f.jpg",iA="/imgs/inner-circle-8c61cf85.png",sA="/imgs/lensflare0-cc6aae5d.png",nA="/imgs/lensflare0_alpha-6d875cbf.png",rA="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAIAAAB7GkOtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpGQkMyNkM0QkNCNUFFMDExQjZBNjgzNDc0RDE0NzY2QyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxOTUwNTY2MDUzMUMxMUUwOTA3Qzg4QzFDQkY2MUZCQiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxOTUwNTY1RjUzMUMxMUUwOTA3Qzg4QzFDQkY2MUZCQiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjAxODAxMTc0MDcyMDY4MTE5NDU3OUVEN0U5QjAxNEY5IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkZCQzI2QzRCQ0I1QUUwMTFCNkE2ODM0NzREMTQ3NjZDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+J87OtwAABgBJREFUeNrs2jEOgzAQRUHspUCyRMn9L0lpHANSbhCl2Jkm/S/8YotyHMd5ngsAmbTWlm3bDAGQzTz8a0QYAiCbefhXKwDkJAAAAgCAAAAgAAAIAAACAIAAACAAAAgAAAIAgAAAIAAACAAAAgCAAAAgAAAIAAACAIAAACAAAAgAAAIAgAAAIAAAAgCAAAAgAAAIAAACAIAAACAAAAgAAAIAgAAAIAAACAAAAgCAAAAgAAAIAAACAIAAACAAAAgAAAIAgAAAIAAAAmACAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAA/ma9I1DrGMMWAHmUUtb3ZzIHQB7zr/97AxAAgFwingA8zz+egAASGWO8AZinvxsAQKoA+AoIIKvvDQCAVDeA5wnoui5bAKTSe/cEBJCUAAAIAAACAIAAACAAAAgAAAIAgAAAIAAACAAAAgCAAAAgAAAIAAACAIAAACAAAAgAAAIAgAAAIAAACAAAAgCAAAAIAAACAIAAACAAAAgAAAIAgAAAIAAACAAAAgCAAAAgAAAIAAACAIAAACAAAAgAAAIAgAAAIAAACAAAAgCAAAAIgAkABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABABAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABABAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAOBnAei9WwEgm3n4r/u+R4QtAFJprX0EGAAFhyfXeeWZyAAAAABJRU5ErkJggg==",oA="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAIAAAB7GkOtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MUY2OTVBMjM1MzFFMTFFMDkwN0M4OEMxQ0JGNjFGQkIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MUY2OTVBMjQ1MzFFMTFFMDkwN0M4OEMxQ0JGNjFGQkIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxRjY5NUEyMTUzMUUxMUUwOTA3Qzg4QzFDQkY2MUZCQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxRjY5NUEyMjUzMUUxMUUwOTA3Qzg4QzFDQkY2MUZCQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PslCyYYAAASvSURBVHja7NkNb5swEABQQPv//3jcvBiM8UempdnUqu9VIgc4TuqQO+wsCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB+1GgIGl8W6DndTEBHbtqVt36zYtt/HU5vc/uW38dpT1398UX/gH3rxveVxzuOZg+F7KB9KDurtWz4OFAC+UfbPQbfbnkr1IMeVpWxG2hP9q8zrUHQXbZxXcjkV9ys8Rtd5/P03IkbNYvIqcS8Vx9mSlOtcnIJ931NwbqPE5dR1Ng51mxyXznPHdf91oAZQ/DAEPMn+w1xcUvas8SMjXvl9O1xxDnIlqHevdrcycb1iuQv+EuqMfKTp2HNOf2yjistjnLtrbnP2UGrGVTzqm/37LOEoS02zehrnUkcB4H+sIJUkmFPPmbP2XERKasszicmSS8x6/uSpv54HNGk3WnuuE9UQ9XOQaF5CTkcB4POlv/XxN5lJPLbXBCLXgHS3mw5E/OxXh9avvFYZS4zS/bWQf/6bqf7tdUXsRzWNQywSPe+7VzMEzG7h5z8G3I7UK0LNmn7dQV0Pmg4ZzRvyxOd8XNZqQakNuuNtb8MAfAOZFoDlzz/Jzp5eJ7X2YJ1/JKPROD8bvX4M+xLyJDbgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABv8EuAAQDmbqQRXFC3OAAAAABJRU5ErkJggg==",aA="/imgs/lensflare3-b777765d.png",cA="/imgs/light-aa132c89.png",lA="/imgs/out-circle-6854860a.png",gA="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+IEmuOgAABCtJREFUWIXVmU1oXFUUx3/zSptF4qYliNAUJB8tUnRhXSiSWhcmEekiXVi1C20Ximm7li5EsFDUrYsuBVeNCCroIgXF2iKtCRioIp1shIC1I0g7TUIS7d/FPTfz+vLu+5i8GewfLjP33vPxf3fu3HfuOTVJbAG9wLPAQeAxYAR4GOiz+bvAn8AN4FfgEvADsNS2R0llW03SuKQLkpZVHsumO262SvmvlVzhSeBd4Anr3wNmgW+BOVvJxdgK9gK7gWHgAHAIeAqIbH4eeA/4ouoVHpQ0E1ulRUlnJO1p4xfaY7qLMXsz5iNXv4iDlyXdNsMNSScl9bRBNNl6zFbDbN+WdHQrhGuSzsZW4TNJuyogmmy7zLbHWWXs7SyyH5uBfySd6gDRZDspad18ng+RDimfM8VlSYe7QNa3lyQtme9zRQkfja1sEbI1SaOSPpB0WdJNSavWbtrYhyZT5Bg7bL4l6ZU8woNq/cFO5xiOJB2XVFdx1E0nyrF92uTvKHF6JAX90TWdY/BRSddKEE3imtnI8jFtsjMhwpMm8Jek/gxDz6l1FG0FDbltEvKzU9Itk51MEq5J+tkmpzKMvCC3N6vCqqSxDH9vmdy8cdwgPGYTv0vaHlDeK7enqkbTbKf53G6cJBd7bLzT37DP88B6yht8G/Ap8FDhd35x9JntbSlz68YJ4HUAJPVKWpH0r6SBwJMe78DKJnEi4HvAuK1I6o1vh6sBhZrKHV3toq7wOX3VZMYiXPANLkRMwygwVNkGCGPIfKXBczsYAfutMxcQfrFKVjkI+fLc9ke44Brgt4DwM5VSysbTgXHPbTgC+q3zR0B4ODDeCYwExj23/pqkVWAH0AOspQj7+W5gzXgkscN4rEUpk/9rREDTvodeCn93iUuWL8+tGQEN6zwSEK5XSikbNwLjnlsjokVob0D4x0opZSPky3OrR8B16zwZEP66UkrZ+CYwfsA+r0e49BHA8wHhS8BClawCWMClsdJwaIOLigU/J7oQSxQKfiJcWulL3IlxLPCEn+BSUp3CnPlIwzEct6+AJf8U4/aUWQH8Prlgu2o0zXZeAD+hxBVp3ibeDihjSlVfkSYy/L1pcpuuSGUuoROqZqWbOWTjl9AjfjwpVPSav0/S7BbIziq8DXy7YLIX4+NJoUG1Lpp5+TSfSFkoQXRBxRIpp0z+jqShLMKofKoqkssvfCTpijanqq7Y3GgBoqhkqsq3ByoZiB7AdKsnHU9oT6szCe2dauXRpDYT2vH2qu4vGUypupLBlO4vGbyWp1fU+JDc8eKxKOkdtVeUGTDdeFHmohKnQaiVLXsdwZW9Hrf+PeAn4DtcrOHLXndtvg9X9hohXPZ6H/i8MIM2VsgXFqflIqiyWDHdrhQWk+jDlW5HcQmZYTaXbm/hVv4X4HvgMq1foDT+A+dj9DaZa2PgAAAAAElFTkSuQmCC",dA=A=>new URL(Object.assign({"../assets/imgs/texttures/arrow.png":H,"../assets/imgs/texttures/border.png":K,"../assets/imgs/texttures/circle.png":q,"../assets/imgs/texttures/fenceMap0.png":_,"../assets/imgs/texttures/fenceMap1.png":$,"../assets/imgs/texttures/fenceMap2.png":AA,"../assets/imgs/texttures/gz-map-fx.jpg":eA,"../assets/imgs/texttures/gz-map.jpg":tA,"../assets/imgs/texttures/inner-circle.png":iA,"../assets/imgs/texttures/lensflare0.png":sA,"../assets/imgs/texttures/lensflare0_alpha.png":nA,"../assets/imgs/texttures/lensflare1.png":rA,"../assets/imgs/texttures/lensflare2.png":oA,"../assets/imgs/texttures/lensflare3.png":aA,"../assets/imgs/texttures/light.png":cA,"../assets/imgs/texttures/out-circle.png":lA,"../assets/imgs/texttures/point.png":gA})[`../assets/imgs/texttures/${A}`],self.location).href,hA=()=>({visible:!0,enabled:!1,runing:!1,helper:!1,points:[],segment:2,close:!0,tension:0,baseUrl:"",mapUrl:dA("arrow.png"),repeat:[.1,1],width:15,speed:1,mapSpeed:.006,offset:10,factor:1,index:0,auto:!1,tube:!1,color:16777215,radius:1,radialSegments:1,animateBack:void 0});var EA,pA,QA=(A,e,t)=>(((A,e,t)=>{if(!e.has(A))throw TypeError("Cannot "+t)})(A,e,"access private method"),t);const{createCruise:BA,cruiseAnimate:bA,updateCruise:mA,bindEvent:uA,removeEvent:IA}=(()=>{let b,m,u,I=hA();const w=(A,e)=>{u=new c(new l(2),new g({color:0,opacity:.8,depthTest:!1,transparent:!0})),A.add(u);const t=(new d).setFromPoints(e.concat(e[0])),i=new h({color:255,opacity:1,depthTest:!1,transparent:!0}),s=new E(t,i);A.add(s);const n=new p(b,100,I.width/2,3,!0),r=new Q({color:16711935,opacity:.1,depthTest:!1,transparent:!0}),o=new c(n,r),a=new g({color:16715760,opacity:.3,wireframe:!0,depthTest:!1,transparent:!0}),B=new c(n,a);o.add(B),A.add(o)},C=()=>900*(I.segment??2),S=()=>null==b?void 0:b.getPoints(C()),U=(e,t)=>new A(t.x,t.y+e,t.z),k=A=>{if(!I.enabled)return;switch(A.keyCode){case 38:case 87:I.runing?(I.factor*=1.5,I.factor>10&&(I.factor=10)):I.index+=5;break;case 83:case 40:I.runing||(I.index-=5,I.index<0&&(I.index=C()))}},J=A=>{if(!I.enabled)return;I.factor=1;switch(A.keyCode){case 32:I.runing=!I.runing;break;case 38:case 87:I.runing||(I.index+=10);break;case 83:case 40:I.runing||(I.index-=10,I.index<0&&(I.index=C()))}};return{createCruise:(l={},g)=>{I=P(hA(),l);const{points:d,tension:h,mapUrl:E,baseUrl:p,repeat:Q,width:u,helper:C,close:U,tube:k,color:J,radius:G,radialSegments:f}=I,v=[];for(let e=0;e<d.length;e++){const t=d[e];v.push(new A(t[0],t[1],t[2]))}b=new e(v,U,"catmullrom",h??0),b=new e(S(),U,"catmullrom",h??0);const R=new t;m=(new i).load(T(E,p),(A=>{A.wrapS=s,A.repeat.x=Q[0],A.repeat.y=Q[1],A.anisotropy=g.capabilities.getMaxAnisotropy()}));const M=new n({color:J,map:m,opacity:.9,transparent:!0,depthTest:!0,side:r}),x=new A(0,1,0),z=new B;z.set(S(),G,f,x,!1);const y=k?new o:new a;y.update(z,k?{radius:G,radialSegments:f,progress:1,startRad:0}:{width:u,arrow:!1,progress:1,side:"both"});const j=new c(y,M);return R.add(j),R.name="cruise",C&&w(R,v),R.renderOrder=99,R},updateCruise:(A={})=>{I=P(I,A)},cruiseAnimate:A=>{if(!A)return;if(!b)return;const{mapSpeed:e,speed:t,factor:i,enabled:s,runing:n,offset:r,helper:o,auto:a,animateBack:c}=I;if(m&&(m.offset.x-=e),!(a||n&&s))return;(a||n&&s)&&(I.index+=i*t);const l=C(),g=I.index%l/l;let d=g+.001;d>1&&(d-=1);const h=b.getPointAt(d);if(o&&u){const A=U(r,h);u.position.copy(A)}const E=U(r,b.getPointAt(g));if(!a||n&&s){A.position.copy(E);const e=U(r,h);A._lookAt_=e,A.lookAt(e)}"function"==typeof c&&c(E,h,b,g)},bindEvent:()=>{window.addEventListener("keydown",k,!1),window.addEventListener("keyup",J,!1)},removeEvent:()=>{window.removeEventListener("keyup",J),window.removeEventListener("keydown",k)}}})(),{createFork:wA}={createFork:(A={})=>{const{width:e=800,divisions:i=80,forkSize:s=1.4,forkColor:n=10592673}=A;let r=e/i,o=-e/2;const a=new t;for(let t=0;t<=i;t++)for(let A=0;A<=i;A++){const e=o+t*r,i=o+A*r,l=new b(s,s/5),g=new Q({color:n,transparent:!0,opacity:.9}),d=new c(l,g);d.rotateX(.5*-Math.PI),d.position.set(e,0,i);const h=d.clone();h.rotateZ(.5*Math.PI),a.add(d,h)}return a}},CA=class A{constructor(e={}){((A,e,t)=>{if(e.has(A))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(A):e.set(A,t)})(this,EA);const t=X;var i;this.options=P(t,e),A.total++,this.pointer={tsp:0,isClick:!1},(i=this.options.container)&&("object"==typeof HTMLElement?i instanceof HTMLElement:i&&"object"==typeof i&&1===i.nodeType&&"string"==typeof i.nodeName)?this.container=this.options.container:this.container=document.querySelector(this.options.container),this.options.width=this.container.offsetWidth,this.options.height=this.container.offsetHeight,this.scene=new m,this.renderer=this.initRenderer(),this.baseCamera=this.initCamera(),this.controls=this.initControls(),this.init(),this.initCruise()}get camera(){const{visible:A,runing:e,auto:t}=this.options.cruise;return A&&this.cruiseCamera&&e?this.cruiseCamera:this.baseCamera}init(){this.initLight(),this.initGrid(),this.initAxes(),this.initModel()}run(){this.loop()}loop(){this.animationId=window.requestAnimationFrame((()=>{this.loop()})),this.animate(),this.modelAnimate()}animate(){this.renderer&&this.renderer.render(this.scene,this.camera),this.options.controls.visible&&this.controls.update(),bA(this.cruiseCamera),u()}initModel(){}modelAnimate(){}initRenderer(){const{width:A,height:e,bgColor:t,bgUrl:i,env:s}=this.options,n=new I(this.options.render);if(s&&this.setEnvironment(s),i?this.setBgTexture(i):this.setBgColor(t),this.options.fog.visible){const{color:A,near:e,far:t}=this.options.fog;this.scene.fog=new w(A??this.scene.background,e,t)}return n.sortObjects=!0,n.shadowMap.enabled=!0,n.shadowMap.type=C,n.setSize(A,e),n.setPixelRatio(window.devicePixelRatio),this.container.appendChild(n.domElement),n}initLight(){const{ambientLight:A,directionalLight:e}=this.options;if(A.visible){const e=new S(A.color,A.intensity);this.addObject(e)}if(e.visible){const A=this.createDirectionalLight();if(A.position.set(...e.position),this.addObject(A),e.helper){const e=new U(A,1);this.addObject(e)}if(e.light2){const A=this.createDirectionalLight(!1);if(A.position.set(...e.position2),this.addObject(A),e.helper){const e=new U(A,1);this.addObject(e)}}}}createDirectionalLight(A=!0,e=2e3,t=4096,i=1,s=2e4){const{color:n,intensity:r}=this.options.directionalLight,o=new k(n,r);if(A){o.shadow.mapSize.setScalar(t),o.shadow.bias=-1e-5,o.shadow.normalBias=.01,o.castShadow=A;const n=o.shadow.camera;n.radius=10,n.near=i,n.far=s,n.top=n.right=e,n.left=n.bottom=-e,n.updateProjectionMatrix()}return o}initCamera(){const{width:A,height:e,camera:t}=this.options;let i=new J(36,A/e,t.near,t.far);if(t.orthogonal){let s=A/e,n=260;i=new G(-n*s,n*s,n,-n,t.near,t.far)}if(i.position.set(...t.position),i.lookAt(0,0,0),t.helper){const A=new f(i);this.addObject(A)}return i}initControls(){const A=this.options.controls;if(!A.visible)return;const e=new v(this.camera,this.renderer.domElement);return Object.keys(A).forEach((t=>{e[t]=A[t]})),e.target.set(0,0,0),e.saveState(),e}initCruise(){const{visible:A}=this.options.cruise;A&&(this.cruiseCamera=this.initCamera(),QA(this,EA,pA).call(this))}initGrid(){const A=this.options.grid;if(!A.visible)return;const{width:e,divisions:t,centerLineColor:i,gridColor:s,opacity:n,transparent:r,fork:o}=A,a=new R(e,t,i,s);if(a.material.opacity=n,a.material.transparent=r,this.grid=a,this.addObject(a),o){const e=wA(A);e.name="辅助交叉点",e._isGridFork_=!0,this.addObject(e)}}initAxes(){if(!this.options.axes.visible)return;const A=new M(this.options.axes.size);this.addObject(A)}createGround(A=5e3,e,t=11721691){const i=new b(A,e=void 0===e?A:e),s=new n({color:t,shininess:10}),r=new c(i,s);return r.name="ground",r.rotation.x=1.5*Math.PI,r.receiveShadow=!0,r}createClock(){this.clock=new x}setCruisePoint(A){this.options.cruise.points=A,this.createCruise()}createCruise(){const{visible:A,points:e}=this.options.cruise;if(!A)return;if(this.cruiseGroup&&this.disposeObj(this.cruiseGroup),uA(),!e||0==e.length)return;const t=BA(this.options.cruise,this.renderer);this.cruiseGroup=t,t.visible=!1,this.addObject(t)}toggleCruise(A){let{visible:e,runing:t,auto:i}=this.options.cruise;e&&(t=null!=A?A:t,this.options.cruise.runing=!t,this.options.cruise.enabled=!t,this.controls.enabled=i||t,this.cruiseGroup.visible=!t,mA(this.options.cruise))}toggleCruiseDepthTest(A){this.cruiseGroup.traverse((e=>{(e.isMesh||e.isLine)&&(e.material.depthTest=null!=A?A:!e.material.depthTest)}))}setScale(A){this.options.scale=A}setEnvironment(A){(new z).load(T(A,this.options.baseUrl),(A=>{A.mapping=y,this.scene.environment=A}))}setBgTexture(A){if(Array.isArray(A)){const e=(new j).load(T(A,this.options.baseUrl));this.scene.background=e}else this.scene.background=(new i).load(T(A))}setBgColor(A){this.scene.background=A?new D(A):null}bindEvent(){const A=this.renderer.domElement;A.addEventListener("dblclick",this.onDblclick.bind(this)),A.addEventListener("pointerdown",this.onPointerDown.bind(this)),A.addEventListener("pointermove",this.onPointerMove.bind(this)),A.addEventListener("pointerup",this.onPointerUp.bind(this))}onDblclick(A){}onPointerDown(A){this.pointer.isClick=!0,this.pointer.tsp=A.timeStamp}onPointerMove(A){}onPointerUp(A){this.pointer.isClick=!1}exportImage(){const A=document.createElement("a");A.download="render.png",A.href=this.renderer.domElement.toDataURL().replace("image/png","image/octet-stream"),A.click()}getPosition(){return{position:this.camera.position,target:this.controls.target}}isCameraMove(A,e=1){const t=this.camera.position;return Math.abs(t.x-A.x)<e&&Math.abs(t.y-A.y)<e&&Math.abs(t.z-A.z)<e}addObject(...A){this.scene.add(...A)}controlSave(){this.controls.saveState()}controlReset(){this.controls.reset(),this.toggleCruise(!0)}getValidTargetPosition(A,e,t,i={x:-104,y:7,z:58}){const s=e||A.to||i,n=t||A.target||{x:0,y:0,z:0},r=this.controls;return r&&r.target&&r.target.set(n.x,n.y,n.z),s}resize(){this.options.width=this.container.offsetWidth||window.innerWidth,this.options.height=this.container.offsetHeight||window.innerHeight;const{width:A,height:e}=this.options,t=A/e;this.baseCamera.aspect=t,this.baseCamera.updateProjectionMatrix(),this.cruiseCamera&&(this.cruiseCamera.aspect=t,this.cruiseCamera.updateProjectionMatrix()),this.renderer.setSize(A,e)}stopAnimate(){window.cancelAnimationFrame(this.animationId)}clear(A){A&&A.traverse&&(A.traverse((A=>{A.material&&A.material.dispose(),A.geometry&&A.geometry.dispose(),null==A||A.clear()})),null==A||A.clear())}disposeObj(A){A&&A.traverse&&(A.traverse((A=>{A.material&&A.material.dispose(),A.geometry&&A.geometry.dispose(),null==A||A.clear()})),null==A||A.clear(),this.scene.remove(A))}dispose(){IA(),this.stopAnimate();try{Y.clear(),this.disposeObj(this.scene),this.scene.clear(),this.renderer.dispose(),this.renderer.forceContextLoss(),this.renderer.content=null;let A=this.renderer.domElement.getContext("webgl");A&&A.getExtension("WEBGL_lose_context").loseContext(),this.disposeObj(this.cruiseGroup),this.disposeObj(this.grid),this.controls&&this.controls.dispose(),this.scene=null,this.renderer=null,this.baseCamera=null,this.cruiseCamera=null,this.controls=null,this.grid=null,this.cruiseGroup=null,this.container.innerHTML=""}catch(A){}}};EA=new WeakSet,pA=function(){const A=this.options.cruise;A.enabled=!1,A.runing=!1,A.baseUrl&&(A.baseUrl=this.options.baseUrl),A.factor=1},CA.total=0;let SA=CA;const UA=A=>({resize:()=>{const e=()=>null==A?void 0:A.resize();Z((()=>O().sidebar.opened),(()=>{setTimeout(e,300)})),window.addEventListener("resize",e,!1),L((()=>{null==A||A.dispose(),window.removeEventListener("resize",e)}))}});export{SA as T,H as _,dA as a,K as b,q as c,P as d,_ as e,$ as f,T as g,AA as h,eA as i,tA as j,iA as k,sA as l,nA as m,rA as n,oA as o,aA as p,cA as q,F as r,lA as s,gA as t,UA as u,V as v};