import * as THREE from './vendor/three.module.js';
import {worldField,fittedRadius,constrain} from './layout.js';
import {CHAPTERS,getChapter,medal,cleanProgress} from './resonance.js';
const $=id=>document.getElementById(id);
const TYPES=[{name:'Bruma',sub:'EL COMIENZO',color:'#65e9d4'},{name:'Pulso',sub:'LA CONEXIÓN',color:'#a68bfa'},{name:'Aurora',sub:'LA TRANSFORMACIÓN',color:'#f0a0bf'},{name:'Prisma',sub:'EL EQUILIBRIO',color:'#f6ce88'},{name:'Cosmos',sub:'LA EXPANSIÓN',color:'#b9dcff'}];
let campaign=cleanProgress(null);try{campaign=cleanProgress(JSON.parse(localStorage.getItem('orbita-resonance-v2')||'null'))}catch{}
let chapterIndex=campaign.current,created=[0,0,0,0,0],failed=false,roundId=0,resultTimer=null,chainPending=null,stageBestChain=1;
let unlocked=new Set([0]);try{JSON.parse(localStorage.getItem('orbita-discoveries')||'[0]').filter(n=>Number.isInteger(n)&&n>=0&&n<5).forEach(n=>unlocked.add(n))}catch{}
let renderer,renderMode='webgl';try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'})}catch{renderMode='canvas';renderer=createCanvasRenderer()}
function createCanvasRenderer(){
const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');let pixelRatio=1;
return {domElement:canvas,setPixelRatio(r){pixelRatio=r},setClearColor(){},setSize(w,h){canvas.width=w*pixelRatio;canvas.height=h*pixelRatio;canvas.style.width=w+'px';canvas.style.height=h+'px'},render(scene,camera){
scene.updateMatrixWorld();camera.updateMatrixWorld();ctx.setTransform(pixelRatio,0,0,pixelRatio,0,0);ctx.clearRect(0,0,W,H);ctx.fillStyle='#080b17';ctx.fillRect(0,0,W,H);
const proj=p=>{const v=p.clone().project(camera);return {x:(v.x+1)*W/2,y:(1-v.y)*H/2}};
const c=proj(new THREE.Vector3(centerX,centerY,0));const px=H/(Math.tan(39*Math.PI/360)*52);
let bg=ctx.createRadialGradient(c.x,c.y,0,c.x,c.y,px*8);bg.addColorStop(0,mode==='challenge'?TYPES[getChapter(chapterIndex).goals.at(-1).level].color+'24':'#18303b55');bg.addColorStop(.5,'#22203b22');bg.addColorStop(1,'#080b1700');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
ctx.save();ctx.beginPath();ctx.ellipse(c.x,c.y,(field.right-field.left)*px*.56,(field.top-field.bottom)*px*.55,0,0,Math.PI*2);ctx.clip();ctx.globalCompositeOperation='lighter';
for(let ribbon=0;ribbon<7;ribbon++){
 let width=(field.right-field.left)*px*.9,height=(field.top-field.bottom)*px;
 let grad=ctx.createLinearGradient(c.x-width/2,c.y,c.x+width/2,c.y);grad.addColorStop(0,'#9f8ced00');grad.addColorStop(.25,ribbon%2?'#ad9ee830':'#8ed9ce28');grad.addColorStop(.7,ribbon%2?'#9bdaea28':'#d29fcb25');grad.addColorStop(1,'#9f8ced00');
 ctx.strokeStyle=grad;ctx.lineWidth=.6+ribbon*.09;ctx.shadowColor=ribbon%2?'#bba6f5':'#9ddfd6';ctx.shadowBlur=12;ctx.beginPath();for(let k=0;k<=60;k++){let u=k/60,x=c.x+(u-.5)*width,y=c.y+Math.sin(u*4.1+visualTime*.07+ribbon*.10)*height*.19+Math.sin(u*7-visualTime*.1+ribbon*.4)*height*.045+(ribbon-3)*height*.025;k?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke();
}ctx.restore();
ctx.save();ctx.translate(c.x,c.y);ctx.rotate(Math.sin(visualTime*.05)*.12);for(let j=0;j<3;j++){ctx.strokeStyle='#7ea1b51a';ctx.lineWidth=.7;ctx.beginPath();ctx.ellipse(0,0,(field.right-field.left)*px*(.35+j*.055),(field.top-field.bottom)*px*(.36+j*.05),j*.45,0,Math.PI*2);ctx.stroke()}ctx.restore();
const stars=starsGeo.attributes.position;for(let i=0;i<stars.count;i++){const p=proj(new THREE.Vector3(stars.getX(i),stars.getY(i),stars.getZ(i)));ctx.globalAlpha=.15+(Math.sin(i+visualTime*.3)+1)*.15;ctx.fillStyle='#9bbbd2';ctx.beginPath();ctx.arc(p.x,p.y,i%7===0?1.1:.6,0,Math.PI*2);ctx.fill()}ctx.globalAlpha=1;
for(const o of orbs){if(o.trail.length<2)continue;ctx.strokeStyle=TYPES[o.level].color;ctx.lineWidth=.8;ctx.beginPath();o.trail.forEach((v,i)=>{const p=proj(v);i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y)});ctx.globalAlpha=.14;ctx.stroke();ctx.globalAlpha=1;}
for(const o of [...orbs].sort((a,b)=>a.mesh.position.z-b.mesh.position.z)){let p=proj(o.mesh.position),r=o.mesh.scale.x*px,col=TYPES[o.level].color;let halo=ctx.createRadialGradient(p.x,p.y,r*.7,p.x,p.y,r*3);halo.addColorStop(0,col+'25');halo.addColorStop(1,col+'00');ctx.fillStyle=halo;ctx.fillRect(p.x-r*3,p.y-r*3,r*6,r*6);ctx.save();ctx.beginPath();ctx.arc(p.x,p.y,r,0,Math.PI*2);ctx.clip();let glass=ctx.createRadialGradient(p.x-r*.4,p.y-r*.5,r*.02,p.x+r*.15,p.y+r*.1,r*1.5);glass.addColorStop(0,col+'99');glass.addColorStop(.22,'#18313f');glass.addColorStop(.64,'#0d1829');glass.addColorStop(.84,col+'88');glass.addColorStop(1,col);ctx.fillStyle=glass;ctx.fillRect(p.x-r,p.y-r,r*2,r*2);
ctx.translate(p.x,p.y);ctx.rotate(Math.sin(visualTime*.15+o.seed)*.3);ctx.strokeStyle=col;for(let j=0;j<12;j++){ctx.globalAlpha=.05+(j%3)*.035;ctx.beginPath();for(let k=0;k<=60;k++){let a=k/60*Math.PI*2,rr=r*(.3+j*.045),xx=Math.cos(a)*rr,yy=Math.sin(a)*rr*.7+Math.sin(a*3+visualTime*.4+j*.4)*r*.13;k?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy)}ctx.stroke()}ctx.globalAlpha=.18;ctx.strokeStyle='#e0e9ff';for(let j=0;j<3;j++){ctx.beginPath();ctx.ellipse(0,0,r*(.4+j*.18),r*(.75-j*.12),visualTime*.05+j*.8,0,Math.PI*2);ctx.stroke()}ctx.globalAlpha=.55;const pts=o.points.geometry.attributes.position;for(let k=0;k<pts.count;k++){let a=visualTime*.18,x=pts.getX(k)*Math.cos(a)-pts.getZ(k)*Math.sin(a),z=pts.getX(k)*Math.sin(a)+pts.getZ(k)*Math.cos(a);ctx.globalAlpha=(z+1)*.28;ctx.fillStyle=col;ctx.beginPath();ctx.arc(x*r,pts.getY(k)*r,.6+(z+1)*.45,0,Math.PI*2);ctx.fill()}ctx.restore();ctx.globalAlpha=1;if(o.level>=2){ctx.strokeStyle=col+'80';ctx.beginPath();ctx.ellipse(p.x,p.y,r*1.4,r*.48,-.45,0,Math.PI*2);ctx.stroke()}
ctx.strokeStyle=col+'b0';ctx.lineWidth=.9;ctx.beginPath();ctx.arc(p.x,p.y,r,0,Math.PI*2);ctx.stroke();ctx.strokeStyle='#e2ffffaa';ctx.lineWidth=1.4;ctx.beginPath();ctx.ellipse(p.x-r*.22,p.y-r*.24,r*.64,r*.61,-.4,3.5,4.8);ctx.stroke();let shine=ctx.createRadialGradient(p.x-r*.4,p.y-r*.55,0,p.x-r*.4,p.y-r*.55,r*.26);shine.addColorStop(0,'#e3ffff90');shine.addColorStop(1,'#ffffff00');ctx.fillStyle=shine;ctx.beginPath();ctx.arc(p.x-r*.4,p.y-r*.55,r*.26,0,Math.PI*2);ctx.fill();if(o.mesh.material.uniforms.selected.value){ctx.strokeStyle=col+'60';ctx.beginPath();ctx.arc(p.x,p.y,r+6,0,Math.PI*2);ctx.stroke()}}
for(const b of bursts){ctx.fillStyle='#b7ffed';ctx.globalAlpha=b.pts.material.opacity;const p=b.pts.geometry.attributes.position;for(let i=0;i<p.count;i++){const v=proj(new THREE.Vector3(p.getX(i),p.getY(i),p.getZ(i)));ctx.beginPath();ctx.arc(v.x,v.y,1.2,0,Math.PI*2);ctx.fill()}}ctx.globalAlpha=1;for(const ring of ripples){const p=proj(ring.mesh.position);ctx.strokeStyle='#a3eedb';ctx.globalAlpha=ring.mesh.material.opacity;ctx.lineWidth=1;ctx.beginPath();ctx.arc(p.x,p.y,ring.mesh.scale.x*px,0,Math.PI*2);ctx.stroke()}ctx.globalAlpha=1;
}}}

renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.setClearColor(0x080b17,1);$('universe').appendChild(renderer.domElement);
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(39,1,.1,100);camera.position.set(0,0,26);
const ray=new THREE.Raycaster(),pointer=new THREE.Vector2(),plane=new THREE.Plane(new THREE.Vector3(0,0,1),0),target=new THREE.Vector3();
let W=innerWidth,H=innerHeight,bounds={x:8,y:5},field=null,mobile=false,centerX=1.1,centerY=.3;
function resize(){
 const old=field;W=innerWidth;H=Math.round(Math.min(innerHeight,window.visualViewport?.height||innerHeight));mobile=W<=700||H<=500;
 document.body.style.height=H+'px';renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.5:1.75));renderer.setSize(W,H);camera.aspect=W/H;camera.updateProjectionMatrix();
 const y=Math.tan(THREE.MathUtils.degToRad(19.5))*26;bounds={x:y*camera.aspect,y};field=worldField(W,H,$('playfield').getBoundingClientRect(),y);
 centerX=(field.left+field.right)/2;centerY=(field.top+field.bottom)/2;
 for(const o of orbs){
  if(old){o.mesh.position.x=field.left+(o.mesh.position.x-old.left)/(old.right-old.left)*(field.right-field.left);o.mesh.position.y=field.bottom+(o.mesh.position.y-old.bottom)/(old.top-old.bottom)*(field.top-field.bottom)}
  o.r=radius(o.level);keepInField(o);o.mesh.scale.setScalar(o.r);
 }
 renderer.domElement.dataset.field=JSON.stringify({left:Math.round($('playfield').getBoundingClientRect().left),top:Math.round($('playfield').getBoundingClientRect().top),right:Math.round($('playfield').getBoundingClientRect().right),bottom:Math.round($('playfield').getBoundingClientRect().bottom)});
}
function keepInField(o){o.mesh.position.x=constrain(o.mesh.position.x,field.left+o.r*1.12,field.right-o.r*1.12);o.mesh.position.y=constrain(o.mesh.position.y,field.bottom+o.r*1.12,field.top-o.r*1.12)}
function placeLevels(levels){
 const maxR=Math.max(...levels.map(radius))*1.22,rx=Math.max(.2,(field.right-field.left)/2-maxR),ry=Math.max(.2,(field.top-field.bottom)/2-maxR);
 levels.forEach((level,i)=>{let a=i*2.39996+chapterIndex*.27,rad=Math.sqrt((i+.65)/levels.length);createOrb(level,centerX+Math.cos(a)*rad*rx,centerY+Math.sin(a)*rad*ry)});
}
function mergeReach(o){return mobile?o.r*3.65:o.r*2+1.25}
const orbGeo=new THREE.SphereGeometry(1,48,40);
const vertex=`varying vec3 vNormal;varying vec3 vPos;varying vec3 vView;void main(){vPos=position;vNormal=normalize(normalMatrix*normal);vec4 mv=modelViewMatrix*vec4(position,1.);vView=-mv.xyz;gl_Position=projectionMatrix*mv;}`;
const fragment=`precision highp float;uniform float time;uniform vec3 tint;uniform float selected;varying vec3 vNormal;varying vec3 vPos;varying vec3 vView;void main(){vec3 n=normalize(vNormal);float facing=max(dot(n,normalize(vView)),0.);float rim=pow(1.-facing,2.7);float wave=sin(vPos.x*5.+sin(vPos.y*6.+time*.5)*1.5+time*.32);float flow=sin(vPos.y*12.+sin(vPos.x*7.+time*.3)*2.+time*.4);float inner=pow(max(0.,wave*flow),4.);float spec=pow(max(0.,dot(n,normalize(vec3(-.6,.8,1.)))),44.);float spec2=pow(max(0.,dot(n,normalize(vec3(.8,-.5,.3)))),22.);vec3 col=mix(vec3(.025,.055,.10),tint*.29,facing*.55+.25);col+=tint*(rim*1.1+inner*.36)+vec3(.63,.95,1.)*spec*.8+vec3(.6,.4,.9)*spec2*.45;col+=vec3(.6,.9,1.)*pow(rim,8.)*.7;vec3 pearl=.5+.5*cos(vec3(0.,2.1,4.2)+vPos.y*3.+vPos.x*2.+time*.15);col+=pearl*rim*.15;float filament=pow(.5+.5*sin(vPos.y*10.+sin(vPos.x*7.+time*.3)*2.5),14.);col+=mix(tint,vec3(.8,.9,1.),.25)*filament*.09;col+=tint*selected*.15;float latitude=pow(.5+.5*sin(vPos.y*35.+vPos.x*7.+time*.2),30.);col+=tint*latitude*.045;gl_FragColor=vec4(col,1.);}`;
const glowCanvas=document.createElement('canvas');glowCanvas.width=128;glowCanvas.height=128;let gc=glowCanvas.getContext('2d');let g=gc.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(255,255,255,.25)');g.addColorStop(.25,'rgba(255,255,255,.13)');g.addColorStop(1,'rgba(255,255,255,0)');gc.fillStyle=g;gc.fillRect(0,0,128,128);const glowTex=new THREE.CanvasTexture(glowCanvas);
const dotCanvas=document.createElement('canvas');dotCanvas.width=32;dotCanvas.height=32;let dc=dotCanvas.getContext('2d');let dg=dc.createRadialGradient(16,16,0,16,16,16);dg.addColorStop(0,'white');dg.addColorStop(.2,'rgba(255,255,255,.8)');dg.addColorStop(1,'rgba(255,255,255,0)');dc.fillStyle=dg;dc.fillRect(0,0,32,32);const dotTex=new THREE.CanvasTexture(dotCanvas);
const orbs=[],bursts=[],ripples=[];let score=0,merges=0,mode='flow',moves=18,completed=false,paused=false,breathing=false,sound=false,drag=null,dragMoved=false,dragStart=null,activePointerId=null,dragOffset=new THREE.Vector3(),combo=0,chainTimer=null,lastFusion=0,startTime=performance.now(),visualTime=0,lastFrame=performance.now(),toastTimer,labelTimer;
function updateCollection(){$('levels').innerHTML=TYPES.map((t,i)=>`<div class="element ${unlocked.has(i)?'':'locked'}"><div class="orb-icon" style="--c:${t.color}"></div><div><b>${t.name}</b><small>${unlocked.has(i)?t.sub:'POR DESCUBRIR'}</small></div><span class="mark">${unlocked.has(i)?'✦':'·'}</span></div>`).join('');$('discovered-count').textContent=unlocked.size+' / 5'}
function toast(s){$('toast').textContent=s;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),3500)}
function label(s){$('fusion-label').textContent=s;$('fusion-label').classList.add('show');clearTimeout(labelTimer);labelTimer=setTimeout(()=>$('fusion-label').classList.remove('show'),2200)}
function radius(level){return mobile&&field?fittedRadius(field,mode==='challenge'?getChapter(chapterIndex).seed.reduce((a,b)=>a+b,0):15,level):.67+level*.15}
function createOrb(level,x,y){const r=radius(level);const mat=new THREE.ShaderMaterial({vertexShader:vertex,fragmentShader:fragment,uniforms:{time:{value:0},tint:{value:new THREE.Color(TYPES[level].color)},selected:{value:0}}});const mesh=new THREE.Mesh(orbGeo,mat);mesh.position.set(x,y,0);mesh.scale.setScalar(r*.1);scene.add(mesh);const halo=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:TYPES[level].color,transparent:true,opacity:.65,depthWrite:false,blending:THREE.AdditiveBlending}));halo.scale.setScalar(r*5);mesh.add(halo);const p=new Float32Array(60*3);for(let i=0;i<60;i++){let v=new THREE.Vector3(Math.random()-.5,Math.random()-.5,Math.random()-.5).normalize().multiplyScalar(Math.cbrt(Math.random())*.92);p.set([v.x,v.y,v.z],i*3)}const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(p,3));const points=new THREE.Points(geo,new THREE.PointsMaterial({color:TYPES[level].color,size:.035,map:dotTex,transparent:true,opacity:.8,depthWrite:false,depthTest:false,blending:THREE.AdditiveBlending}));mesh.add(points);const o={mesh,level,r,trail:[],v:new THREE.Vector2((Math.random()-.5)*.12,(Math.random()-.5)*.12),seed:Math.random()*100,age:0,points};if(level>=2){const ring=new THREE.Mesh(new THREE.TorusGeometry(1.32,.014,8,90),new THREE.MeshBasicMaterial({color:TYPES[level].color,transparent:true,opacity:.55}));ring.rotation.x=.9;ring.rotation.y=.3;mesh.add(ring)}o.silk=new THREE.Line(new THREE.BufferGeometry().setAttribute('position',new THREE.BufferAttribute(new Float32Array(24*3),3)),new THREE.LineBasicMaterial({color:TYPES[level].color,transparent:true,opacity:.12,depthWrite:false}));if(renderMode==='webgl')scene.add(o.silk);mesh.userData.orb=o;keepInField(o);orbs.push(o);return o}
function removeOrb(o){const i=orbs.indexOf(o);if(i>=0)orbs.splice(i,1);scene.remove(o.mesh);scene.remove(o.silk);o.silk.geometry.dispose();o.silk.material.dispose();o.mesh.material.dispose();o.mesh.children.forEach(c=>{c.material?.dispose();if(c.geometry)c.geometry.dispose()})}
function addSeed(count=3){if(orbs.length+count>33){toast('Tu jardin está lleno. Uní algunas esferas para abrir espacio.');return}for(let i=0;i<count;i++){let a=Math.random()*Math.PI*2,rad=.3+Math.random()*.5;createOrb(0,centerX+Math.cos(a)*rad*(field.right-field.left)/2,centerY+Math.sin(a)*rad*(field.top-field.bottom)/2)}}
function saveCampaign(){try{localStorage.setItem('orbita-resonance-v2',JSON.stringify(campaign))}catch{}}
function goalDescription(chapter){return chapter.goals.map(g=>`${g.count} ${TYPES[g.level].name}${g.count>1&&g.level!==4?'s':''}`).join(' + ')}
function goalsMet(){return getChapter(chapterIndex).goals.every(g=>created[g.level]>=g.count)}
function starsText(n){return '★'.repeat(n)+'☆'.repeat(3-n)}
function hasModal(){return [...document.querySelectorAll('dialog')].some(d=>d.open)}
function stats(){
 $('score').textContent=score.toLocaleString('es-AR');$('merges').textContent=merges;
 const ch=getChapter(chapterIndex),done=ch.goals.reduce((n,g)=>n+Math.min(g.count,created[g.level]),0),total=ch.goals.reduce((n,g)=>n+g.count,0),pct=Math.round(done/total*100);
 $('chapter-number').textContent=ch.infinite?`RESONANCIA ∞ · ${chapterIndex-7}`:`RESONANCIA ${String(chapterIndex+1).padStart(2,'0')} / 08`;
 $('chapter-name').textContent=ch.name;$('chapter-subtitle').textContent=ch.subtitle;
 $('goals').innerHTML=ch.goals.map(g=>`<div class="goal-row ${created[g.level]>=g.count?'done':''}"><i style="--c:${TYPES[g.level].color}"></i><span>Crear ${g.count} ${TYPES[g.level].name}${g.count>1&&g.level!==4?'s':''}</span><b>${Math.min(g.count,created[g.level])}<em> / ${g.count}</em></b></div>`).join('');
 $('moves').innerHTML=completed?'✦ Capítulo completo':failed?'Un nuevo intento te espera':`<b>${moves}</b> ${moves===1?'movimiento':'movimientos'}`;
 $('moves').classList.toggle('low-moves',moves<=4&&!completed);
 $('chapter-stars').textContent=campaign.stars[chapterIndex]?starsText(campaign.stars[chapterIndex]):'';
 $('progress').style.width=pct+'%';document.querySelector('#mission .progress').setAttribute('aria-valuenow',String(pct));
 $('stage-action').hidden=!completed&&!failed;$('stage-action').textContent=completed?'Siguiente resonancia ↗':'Volver a intentarlo ↻';
 $('state-label').textContent=paused?'Tu jardín está en pausa':mode==='flow'?'A tu propio ritmo':`Resonancia ${ch.infinite?'∞':String(chapterIndex+1).padStart(2,'0')}`;
 $('add').disabled=mode==='challenge';
 if(mode==='challenge')document.querySelector('.below-dock>span').innerHTML=`<i></i> ${completed?'RESONANCIA COMPLETA':ch.infinite?'SEGUÍ EXPLORANDO':`CAPÍTULO ${chapterIndex+1} DE 8`}`;
}
function reset(){
 roundId++;clearTimeout(chainTimer);clearTimeout(resultTimer);chainPending=null;release(null,true);breatheOff();
 for(const d of [$('result'),$('journey-dialog')])if(d.open)d.close();
 for(const o of [...orbs])removeOrb(o);
 for(const b of bursts){scene.remove(b.pts);b.pts.geometry.dispose();b.pts.material.dispose()}bursts.length=0;
 for(const r of ripples){scene.remove(r.mesh);r.mesh.geometry.dispose();r.mesh.material.dispose()}ripples.length=0;
 score=0;merges=0;moves=getChapter(chapterIndex).moves;completed=false;failed=false;created=[0,0,0,0,0];combo=0;stageBestChain=1;paused=false;
 $('pause').textContent='Ⅱ';$('pause').setAttribute('aria-pressed','false');$('pause').setAttribute('aria-label','Pausar');$('fusion-label').classList.remove('show');
 applyAudioState();if(sound)ensureAudio();
 resize();if(mode==='challenge')seedChapter();else seedGarden();stats();
}
function seedChapter(){
 const ch=getChapter(chapterIndex),levels=ch.seed.flatMap((n,l)=>Array(n).fill(l));
 // Interleave the frequencies so mixed chapters require deliberate connections.
 levels.sort((a,b)=>a-b);const order=[];while(levels.length){order.push(levels.shift());if(levels.length)order.push(levels.pop())}
 placeLevels(order);
 const accent=TYPES[ch.goals.at(-1).level].color;document.documentElement.style.setProperty('--resonance',accent);orbitGroup.children.forEach(line=>line.material.color.set(accent));
}
function startChapter(index){
 chapterIndex=Math.max(0,Math.min(index,campaign.highest));campaign.current=chapterIndex;saveCampaign();
 if(mode!=='challenge'){mode='challenge';setModeUI()}
 reset();toast(`${getChapter(chapterIndex).name} · ${goalDescription(getChapter(chapterIndex))}`);
}
function finishChapter(){
 if(completed||failed)return;completed=true;const rating=medal(moves,getChapter(chapterIndex).moves);
 campaign.stars[chapterIndex]=Math.max(campaign.stars[chapterIndex]||0,rating);campaign.highest=Math.max(campaign.highest,chapterIndex+1);campaign.current=chapterIndex+1;saveCampaign();
 label('RESONANCIA COMPLETA · '+starsText(rating));
 const pos=new THREE.Vector3(centerX,centerY,0),color=TYPES[getChapter(chapterIndex).goals.at(-1).level].color;particles(pos,color);
 const id=roundId;resultTimer=setTimeout(()=>{if(roundId===id&&mode==='challenge'&&completed)showResult(true)},1000);stats();
}
function showResult(won){
 const ch=getChapter(chapterIndex),next=getChapter(chapterIndex+1),rating=won?medal(moves,ch.moves):0;
 $('result').classList.toggle('is-loss',!won);$('result-eyebrow').textContent=won?chapterIndex===7?'LOS OCHO CAPÍTULOS, COMPLETOS':'RESONANCIA COMPLETA':'OTRA FORMA DE CONECTAR';
 $('result-title').textContent=won?chapterIndex===7?'Tu universo se expande.':'Encontraste tu frecuencia.':'Respirá. Volvé a conectar.';
 $('result-description').textContent=won?`${ch.name} · ${goalDescription(ch)}. ${chapterIndex===7?'El viaje continúa en el modo infinito.':'Una nueva resonancia te espera.'}`:'Se agotaron los movimientos. Probá acercar las esferas en grupos y preparar las próximas fusiones.';
 $('result-stars').textContent=won?starsText(rating):'◎';$('result-stars').setAttribute('aria-label',won?`${rating} de 3 estrellas`:'Intento terminado');
 $('result-energy').textContent=score.toLocaleString('es-AR');$('result-moves').textContent=ch.moves-moves;
 $('next-preview').hidden=!won;$('next-preview').innerHTML=`<small>SIGUIENTE FRECUENCIA</small><b>${next.name}</b><span>${goalDescription(next)} · ${next.moves} movimientos</span>`;
 $('next-chapter').hidden=!won;$('next-chapter').textContent=chapterIndex===7?'Entrar en el infinito ↗':'Siguiente resonancia ↗';
 $('replay-chapter').textContent=won?'Repetir para mejorar mis estrellas':'Volver a intentarlo ↻';
 if(!$('result').open)$('result').showModal();
}
function showJourney(){
 $('journey-grid').innerHTML=CHAPTERS.map((ch,i)=>`<button class="chapter-card ${i===chapterIndex?'current':''} ${campaign.stars[i]?'solved':''}" data-chapter="${i}" ${i>campaign.highest?'disabled':''}><span class="chapter-card-number">${String(i+1).padStart(2,'0')}<i>${campaign.stars[i]?'✦':i>campaign.highest?'·':'↗'}</i></span><b>${ch.name}</b><small>${goalDescription(ch)}</small><span class="card-stars">${campaign.stars[i]?starsText(campaign.stars[i]):i>campaign.highest?'POR DESCUBRIR':'DISPONIBLE'}</span></button>`).join('');
 $('infinite-chapter').hidden=campaign.highest<8;if(!$('journey-dialog').open)$('journey-dialog').showModal();
}
function seedGarden(){placeLevels([0,0,0,0,0,0,0,0,0,1,1,1])}
function particles(pos,color){const count=mobile?65:120,p=new Float32Array(count*3),vel=new Float32Array(count*3);for(let i=0;i<count;i++){p.set([pos.x,pos.y,0],i*3);const a=i/count*Math.PI*2,s=(1.1+Math.sin(a*5)*.55+Math.random()*.35)*(mobile?.65:1);vel.set([Math.cos(a)*s,Math.sin(a)*s,(Math.random()-.5)*.7],i*3)}const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(p,3));const pts=new THREE.Points(geo,new THREE.PointsMaterial({color,size:.095,map:dotTex,transparent:true,opacity:1,blending:THREE.AdditiveBlending,depthWrite:false}));scene.add(pts);bursts.push({pts,vel,life:0});const ring=new THREE.Mesh(new THREE.RingGeometry(.97,1,100),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.7,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));ring.position.copy(pos);ring.position.z=-.3;scene.add(ring);ripples.push({mesh:ring,life:0})}
function fuse(group,depth=1){if(!group.every(o=>orbs.includes(o)))return;let pos=new THREE.Vector3();group.forEach(o=>pos.add(o.mesh.position));pos.divideScalar(3);const level=group[0].level;group.forEach(removeOrb);const next=(level+1)%5;const born=createOrb(next,pos.x,pos.y);particles(pos,TYPES[next].color);score+=Math.pow(3,level+1)*10*depth;merges++;combo=depth;lastFusion=visualTime;unlocked.add(next);try{localStorage.setItem('orbita-discoveries',JSON.stringify([...unlocked]))}catch{}updateCollection();label((depth>1?'CADENA ×'+depth+' · ':'')+TYPES[next].name.toUpperCase());playFusion(next,depth);if(mode==='challenge'){created[next]++;stageBestChain=Math.max(stageBestChain,depth);if(goalsMet())finishChapter()}stats();if(mode==='flow'&&orbs.length<7)setTimeout(()=>{if(mode==='flow'&&!paused&&orbs.length<7)addSeed(3)},500);clearTimeout(chainTimer);if(!completed){chainPending={born,depth,id:roundId};chainTimer=setTimeout(runChain,650)}}
function runChain(){if(!chainPending||paused||hasModal())return;const pending=chainPending;chainPending=null;if(pending.id!==roundId||completed||failed)return;const near=findGroup(pending.born);if(near)fuse(near,pending.depth+1);else settleChallenge()}
function findGroup(o){if(!orbs.includes(o))return null;const near=orbs.filter(b=>b!==o&&b.level===o.level&&b.mesh.position.distanceTo(o.mesh.position)<mergeReach(o)).sort((a,b)=>a.mesh.position.distanceTo(o.mesh.position)-b.mesh.position.distanceTo(o.mesh.position));return near.length>=2?[o,...near.slice(0,2)]:null}
function settleChallenge(){if(mode==='challenge'&&!completed&&!failed&&moves<=0&&!chainPending){failed=true;stats();showResult(false)}}
function projectPointer(e){scene.updateMatrixWorld();camera.updateMatrixWorld();const r=renderer.domElement.getBoundingClientRect();pointer.set(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);ray.setFromCamera(pointer,camera);ray.ray.intersectPlane(plane,target);return target}
renderer.domElement.addEventListener('pointerdown',e=>{if(!e.isPrimary||drag)return;if(paused||hasModal()||chainPending||(mode==='challenge'&&(completed||failed||moves<=0)))return;projectPointer(e);const hits=ray.intersectObjects(orbs.map(o=>o.mesh),false);let picked=hits[0]?.object.userData.orb;if(!picked&&mobile){const candidates=orbs.map(o=>({o,d:Math.hypot(target.x-o.mesh.position.x,target.y-o.mesh.position.y)})).filter(v=>v.d<=Math.max(v.o.r,22*field.units)).sort((a,b)=>a.d-b.d);picked=candidates[0]?.o}if(picked){drag=picked;dragMoved=false;dragStart={x:e.clientX,y:e.clientY};activePointerId=e.pointerId;dragOffset.copy(drag.mesh.position).sub(target);renderer.domElement.setPointerCapture(e.pointerId);renderer.domElement.style.cursor='grabbing';if(sound)ensureAudio();}});
renderer.domElement.addEventListener('pointermove',e=>{projectPointer(e);if(drag){if(e.pointerId!==activePointerId)return;if(!dragMoved&&Math.hypot(e.clientX-dragStart.x,e.clientY-dragStart.y)<5)return;dragMoved=true;drag.mesh.position.x=target.x+dragOffset.x;drag.mesh.position.y=target.y+dragOffset.y;keepInField(drag);drag.v.set(0,0);const matches=orbs.filter(o=>o!==drag&&o.level===drag.level&&o.mesh.position.distanceTo(drag.mesh.position)<mergeReach(drag));for(const o of orbs)o.mesh.material.uniforms.selected.value=(o===drag||matches.includes(o))?.8:0;$('hint').textContent=matches.length>=2?'Soltá. Algo nuevo está por nacer.':'Acercala a otras dos del mismo color.'}else{ray.setFromCamera(pointer,camera);renderer.domElement.style.cursor=ray.intersectObjects(orbs.map(o=>o.mesh),false).length?'grab':'default'}});
function release(e,cancel=false){if(!drag||(e&&e.pointerId!==activePointerId))return;activePointerId=null;const o=drag;drag=null;for(const b of orbs)b.mesh.material.uniforms.selected.value=0;renderer.domElement.style.cursor='grab';if(dragMoved&&!cancel){if(mode==='challenge'&&!completed)moves=Math.max(0,moves-1);const group=findGroup(o);if(group)fuse(group);else{settleChallenge();stats()}}$('hint').textContent='Arrastrá una esfera junto a otras dos del mismo color.';if(e&&renderer.domElement.hasPointerCapture(e.pointerId))renderer.domElement.releasePointerCapture(e.pointerId)}
renderer.domElement.addEventListener('pointerup',e=>release(e));renderer.domElement.addEventListener('pointercancel',e=>release(e,true));renderer.domElement.addEventListener('lostpointercapture',e=>release(e,true));
// A small generative pentatonic instrument, synthesized locally.
let audio,master,delay,step=0,lastBeat=0;const notes=[130.81,155.56,174.61,196,233.08,261.63,311.13,349.23,392,466.16];
const ambient=$('ambient');let audioAttempt=0;
function audioIsRunning(){return sound&&((audio?.state==='running')||(!ambient.paused&&ambient.readyState>=2))}
function audioUI(){
 const active=audioIsRunning(),waiting=sound&&!active;
 $('sound').setAttribute('aria-pressed',String(active));$('sound').setAttribute('aria-label',active?'Desactivar sonido':waiting?'Reactivar sonido':'Activar sonido');
 $('sound').querySelector('label').textContent=active?'Sonido on':waiting?'Reactivar':'Activar sonido';
 $('sound').dataset.context=audio?.state||'unavailable';$('sound').dataset.media=!ambient.paused?'playing':'paused';
}
function applyAudioState(){
 const audible=sound&&!paused&&!document.hidden;
 if(audio&&master)master.gain.setTargetAtTime(audible?.5:0,audio.currentTime,.15);
 if(!audible)ambient.pause();
 audioUI();
}
function ensureAudio(){
 if(!sound)return;
 try{if(navigator.audioSession)navigator.audioSession.type='playback'}catch{}
 // Both resume and play run synchronously inside the user's gesture.
 // The media layer stays independent so older Safari can still play music.
 try{
 if(!audio||audio.state==='closed'){
 const Context=window.AudioContext||window.webkitAudioContext;if(Context){audio=new Context({latencyHint:'interactive'});master=audio.createGain();master.gain.value=.5;
 const limiter=audio.createDynamicsCompressor();limiter.threshold.value=-18;limiter.knee.value=18;limiter.ratio.value=3;master.connect(limiter);limiter.connect(audio.destination);
 delay=audio.createDelay(1);delay.delayTime.value=.375;const feedback=audio.createGain();feedback.gain.value=.25;const wet=audio.createGain();wet.gain.value=.22;delay.connect(feedback);feedback.connect(delay);delay.connect(wet);wet.connect(master);
 audio.onstatechange=()=>{audioUI();if(sound&&!paused&&!document.hidden&&audio.state!=='running'&&ambient.paused){$('audio-message').hidden=false;$('audio-message').textContent='El audio se interrumpió. Tocá Reactivar para volver a escucharlo.'}};
 }}
 if(audio){const resume=audio.resume();resume?.then(()=>{applyAudioState();if(audio.state==='running')$('audio-message').hidden=true}).catch(()=>audioUI());
 // A short audible confirmation is scheduled before the first async boundary.
 note(notes[4],.8,.12);}
 }catch{audioUI()}
 ambient.volume=.42;
 if(!paused&&!document.hidden){const play=ambient.play();play?.then(()=>{if(!sound||paused||document.hidden)ambient.pause();$('audio-message').hidden=true;audioUI()}).catch(()=>{if(sound&&!audioIsRunning()){$('audio-message').hidden=false;$('audio-message').textContent='No se pudo activar el sonido. Tocá Reactivar; si sigue igual, abrí el juego en Safari y revisá el volumen multimedia.'}audioUI()})}
 audioUI();
}
ambient.addEventListener('playing',audioUI);ambient.addEventListener('pause',audioUI);
function note(freq,dur=1.3,volume=.14,type='sine'){if(!sound||paused||!audio||audio.state!=='running')return;const t=audio.currentTime;const osc=audio.createOscillator(),gain=audio.createGain();osc.type=type;osc.frequency.value=freq;gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(volume,t+.025);gain.gain.exponentialRampToValueAtTime(.001,t+dur);osc.connect(gain);gain.connect(master);gain.connect(delay);osc.start();osc.stop(t+dur+.1);osc.onended=()=>{osc.disconnect();gain.disconnect()}}
function playFusion(level,depth){if(!sound)return;[0,2,4].forEach((n,i)=>setTimeout(()=>note(notes[(level+n)%notes.length]*2,1.8,.15),i*110));}
function music(t){if(!sound||paused||!audio||audio.state!=='running')return;if(t-lastBeat>.375){lastBeat=t;step++;const scale=[0,2,4,2,1,3,4,6];if(step%2===0)note(notes[scale[(step/2)%8|0]],2,.07);if(merges>0&&step%4===0)note(notes[(step/4|0)%5]/2,1.3,.12);if(merges>3&&step%2===1)note(700+Math.random()*500,.07,.012,'triangle')}}
// Quiet celestial dust and orbital paths.
const starsGeo=new THREE.BufferGeometry();const sp=new Float32Array(600*3);for(let i=0;i<600;i++)sp.set([(Math.random()-.5)*55,(Math.random()-.5)*35,-3-Math.random()*12],i*3);starsGeo.setAttribute('position',new THREE.BufferAttribute(sp,3));const stars=new THREE.Points(starsGeo,new THREE.PointsMaterial({color:0x8faec3,size:.045,map:dotTex,transparent:true,opacity:.4,depthWrite:false}));scene.add(stars);
const orbitGroup=new THREE.Group();scene.add(orbitGroup);for(let j=0;j<3;j++){const pts=[];for(let i=0;i<=160;i++){let a=i/160*Math.PI*2;pts.push(new THREE.Vector3(Math.cos(a)*(4.5+j*1.15),Math.sin(a)*(4.5+j*1.15),0))}const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0x5c8395,transparent:true,opacity:.075}));line.rotation.x=.35+j*.2;line.rotation.z=j*.45;orbitGroup.add(line)}orbitGroup.position.z=-2;
const auroraMaterial=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{time:{value:0}},vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`precision highp float;varying vec2 vUv;uniform float time;void main(){vec2 p=vUv;vec3 col=vec3(0.);float mask=smoothstep(0.,.22,p.x)*smoothstep(0.,.22,1.-p.x)*smoothstep(0.,.2,p.y)*smoothstep(0.,.2,1.-p.y);for(int i=0;i<7;i++){float f=float(i);float curve=.5+sin(p.x*4.1+time*.07+f*.1)*.19+sin(p.x*7.-time*.1+f*.4)*.045+(f-3.)*.025;float d=abs(p.y-curve);vec3 tint=mix(vec3(.35,.8,.72),vec3(.7,.5,.9),.5+.5*sin(f*.9));col+=tint*(exp(-d*420.)*.13+exp(-d*45.)*.012);}gl_FragColor=vec4(col*mask,.65);}`});
const auroraMesh=new THREE.Mesh(new THREE.PlaneGeometry(1,1),auroraMaterial);auroraMesh.position.z=-2;scene.add(auroraMesh);
resize();seedGarden();updateCollection();stats();window.addEventListener('resize',resize);window.visualViewport?.addEventListener('resize',resize);new ResizeObserver(()=>resize()).observe($('playfield'));
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function animate(now){requestAnimationFrame(animate);const dt=Math.max(0,Math.min((now-lastFrame)/1000,.04));lastFrame=now;if(!paused&&!document.hidden&&!hasModal()){visualTime+=dt;const t=visualTime;music(t);auroraMaterial.uniforms.time.value=t;auroraMesh.position.set(centerX,centerY,-2);auroraMesh.scale.set((field.right-field.left)*1.07,(field.top-field.bottom)*1.07,1);orbitGroup.position.x=centerX;orbitGroup.position.y=centerY;orbitGroup.rotation.z=Math.sin(t*.05)*.12;orbitGroup.scale.set((field.right-field.left)/15,(field.top-field.bottom)/14,1);stars.rotation.z=t*.002;for(const o of orbs){o.age+=dt;if(!reduce&&o.age>.5){o.trail.push(o.mesh.position.clone());if(o.trail.length>24)o.trail.shift();if(renderMode==='webgl'&&o.trail.length>1){const attr=o.silk.geometry.attributes.position;o.trail.forEach((v,i)=>attr.setXYZ(i,v.x,v.y,v.z));attr.needsUpdate=true;o.silk.geometry.setDrawRange(0,o.trail.length)}}o.mesh.material.uniforms.time.value=t+o.seed;o.points.rotation.y=t*.2+o.seed;o.points.rotation.z=t*.08;const growth=Math.min(1,o.age*2.5);const pulse=breathing?1+Math.sin(t*1.2)*.08:1+Math.sin(t*1.1+o.seed)*.018;o.mesh.scale.setScalar(o.r*(1-Math.pow(1-growth,3))*pulse);if(o!==drag){o.v.x+=Math.sin(t*.5+o.seed)*dt*.018;o.v.y+=Math.cos(t*.4+o.seed)*dt*.018;o.v.multiplyScalar(.994);o.mesh.position.x+=o.v.x*dt*(reduce?.2:1);o.mesh.position.y+=o.v.y*dt*(reduce?.2:1);keepInField(o);}o.mesh.position.z=Math.sin(t*.4+o.seed)*.05;}
for(let i=0;i<orbs.length;i++)for(let j=i+1;j<orbs.length;j++){let a=orbs[i],b=orbs[j];if(a===drag||b===drag)continue;let dx=b.mesh.position.x-a.mesh.position.x,dy=b.mesh.position.y-a.mesh.position.y,d=Math.hypot(dx,dy)||.01,min=(a.r+b.r)*1.05;if(d<min){let push=(min-d)*.035;a.mesh.position.x-=dx/d*push;a.mesh.position.y-=dy/d*push;b.mesh.position.x+=dx/d*push;b.mesh.position.y+=dy/d*push;keepInField(a);keepInField(b)}}
for(const b of [...bursts]){b.life+=dt;let p=b.pts.geometry.attributes.position;for(let i=0;i<p.count;i++){p.array[i*3]+=b.vel[i*3]*dt;p.array[i*3+1]+=b.vel[i*3+1]*dt;p.array[i*3+2]+=b.vel[i*3+2]*dt}p.needsUpdate=true;b.pts.material.opacity=Math.max(0,1-b.life/2.5);if(b.life>2.5){scene.remove(b.pts);b.pts.geometry.dispose();b.pts.material.dispose();bursts.splice(bursts.indexOf(b),1)}}for(const r of [...ripples]){r.life+=dt;r.mesh.scale.setScalar(1+r.life*3);r.mesh.material.opacity=Math.max(0,.5-r.life*.28);if(r.life>2){scene.remove(r.mesh);r.mesh.geometry.dispose();r.mesh.material.dispose();ripples.splice(ripples.indexOf(r),1)}}if(breathing){$('breathe').style.color='#b0f4df';$('breathe').style.opacity=.7+Math.sin(t*1.2)*.3;$('hint').textContent=Math.sin(t*1.2)>0?'Inhalá. Dejá que el espacio crezca.':'Exhalá. Soltá un poquito más.'}}
renderer.domElement.dataset.orbs=JSON.stringify(orbs.map(o=>{const p=o.mesh.position.clone().project(camera);return {level:o.level,radius:Math.round(o.r/field.units),x:Math.round((p.x+1)*W/2),y:Math.round((1-p.y)*H/2)}}));renderer.render(scene,camera)}requestAnimationFrame(animate);
$('add').onclick=()=>{if(paused){toast('Reanudá tu jardín para sembrar energía.');return}if(mode==='flow'){addSeed();note(notes[4],1,.08)}};
$('flow').onclick=()=>changeMode('flow');$('challenge').onclick=()=>changeMode('challenge');
function setModeUI(){
 $('flow').classList.toggle('active',mode==='flow');$('challenge').classList.toggle('active',mode==='challenge');$('mission').hidden=mode!=='challenge';document.body.classList.toggle('is-challenge',mode==='challenge');
 if(mode==='flow'){document.querySelector('.below-dock>span').innerHTML='<i></i> SIN PRISA. SIN PERDER.';orbitGroup.children.forEach(line=>line.material.color.set(0x5c8395))}
 $('reset').setAttribute('aria-label',mode==='challenge'?'Reiniciar capítulo':'Nuevo jardín');
}
function changeMode(m){if(m===mode)return;mode=m;if(m==='challenge')chapterIndex=Math.min(campaign.current,campaign.highest);setModeUI();reset();toast(m==='flow'?'Tu espacio, tu ritmo.':`${getChapter(chapterIndex).name} · ${goalDescription(getChapter(chapterIndex))}`)}
$('journey').onclick=showJourney;$('close-journey').onclick=()=>$('journey-dialog').close();
$('journey-grid').onclick=e=>{const card=e.target.closest('[data-chapter]');if(card&&!card.disabled){$('journey-dialog').close();startChapter(Number(card.dataset.chapter))}};
$('infinite-chapter').onclick=()=>{$('journey-dialog').close();startChapter(Math.max(8,campaign.highest))};
$('next-chapter').onclick=()=>startChapter(chapterIndex+1);$('replay-chapter').onclick=()=>startChapter(chapterIndex);$('result-flow').onclick=()=>changeMode('flow');
$('stage-action').onclick=()=>completed?startChapter(chapterIndex+1):reset();document.querySelector('.close-result').onclick=()=>$('result').close();
for(const dialog of document.querySelectorAll('dialog'))dialog.addEventListener('close',()=>{if(chainPending&&!paused)chainTimer=setTimeout(runChain,150)});
$('sound').onclick=()=>{
 if(sound&&audioIsRunning()){sound=false;audioAttempt++;$('audio-message').hidden=true;applyAudioState()}
 else{sound=true;audioAttempt++;ensureAudio()}
};
function pauseToggle(){release(null,true);paused=!paused;$('pause').textContent=paused?'▷':'Ⅱ';$('pause').setAttribute('aria-pressed',String(paused));$('pause').setAttribute('aria-label',paused?'Reanudar':'Pausar');applyAudioState();if(sound&&!paused)ensureAudio();stats();toast(paused?'El jardín te espera.':'Volvé a tu ritmo.');if(!paused){if(chainPending)chainTimer=setTimeout(runChain,150);else settleChallenge()}}
$('pause').onclick=pauseToggle;
function breatheOn(){if(paused)return;breathing=true}function breatheOff(){breathing=false;$('breathe').style.opacity='1';$('breathe').style.color='';$('hint').textContent='Arrastrá una esfera junto a otras dos del mismo color.'}
$('breathe').addEventListener('pointerdown',e=>{e.preventDefault();$('breathe').setPointerCapture(e.pointerId);breatheOn()});$('breathe').addEventListener('pointerup',breatheOff);$('breathe').addEventListener('pointercancel',breatheOff);document.addEventListener('keydown',e=>{if(e.code==='Space'&&!e.repeat&&!hasModal()&&e.target===document.body){e.preventDefault();breatheOn()}if(e.code==='KeyP'&&!hasModal())pauseToggle()});document.addEventListener('keyup',e=>{if(e.code==='Space')breatheOff()});window.addEventListener('blur',()=>{breatheOff();release(null,true)});document.addEventListener('visibilitychange',()=>{applyAudioState();if(!document.hidden&&sound&&!paused)ensureAudio()});
// After a Safari interruption, the next intentional tap can resume the session.
document.addEventListener('pointerup',e=>{if(sound&&!paused&&!document.hidden&&!audioIsRunning()&&!e.target.closest('#sound'))ensureAudio()},{passive:true});

$('help').onclick=()=>$('guide').showModal();document.querySelectorAll('#guide .close,#guide .close-guide').forEach(b=>b.onclick=()=>$('guide').close());$('reset').onclick=()=>$('confirm').showModal();$('cancel-reset').onclick=()=>$('confirm').close();$('confirm-reset').onclick=()=>{reset();$('confirm').close();toast('Un nuevo jardín. Las posibilidades empiezan de nuevo.')};$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{toast('La pantalla completa no está disponible en esta ventana.')}};
// Read-only diagnostics support manual play verification.
window.orbita={get state(){return {score,merges,mode,moves,completed,failed,chapterIndex,created:[...created],paused,renderMode,orbs:orbs.map(o=>{const p=o.mesh.position.clone().project(camera);return {level:o.level,x:(p.x+1)*W/2,y:(1-p.y)*H/2}}),unlocked:[...unlocked]}}};
setTimeout(()=>{try{if(!localStorage.getItem('orbita-welcomed')&&!hasModal()){$('guide').showModal();localStorage.setItem('orbita-welcomed','1')}}catch{}},700);
