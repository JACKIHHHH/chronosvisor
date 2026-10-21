// Imperia — vehículos y máquinas de las edades IV a IX: artillería, blindados, drones, camiones y barcos modernos.
// Amplía ImperiaArt con A.unitEra(tipo,jugador,edad): devuelve un modelo (mirando a +X) o null si esa edad usa el modelo clásico.
(function(root){
'use strict';
const A=root.ImperiaArt,TH=root.THREE;if(!A)return;
const {box,cyl,cylC,cone,sph,Kit,M,PC}=A._;
const DARK=0x24262a,GUN=0x3a3d42,OLIVE=0x7a8a50,OLIVE2=0x606c40,SAND=0xb8a47a,GREY=0x7c828a,LGREY=0xb4bac2,WHITE=0xe8ecef,TIRE=0x1c1c1e,WOOD=0x8a6443,BRASS=0xc8a040,CYAN=0x39f0ff;
const km=(mat)=>M[mat]||M.matte;
function mesh(build){const k=new Kit();build(k);const g=new TH.Group();const gs=k.geos();for(const m in gs){const me=new TH.Mesh(gs[m],km(m));me.castShadow=true;me.receiveShadow=true;g.add(me)}return g}
function pivot(x,y,z){const g=new TH.Group();g.position.set(x,y,z);return g}
const cache=new Map();
function cached(key,build){let g=cache.get(key);if(!g){g=mesh(build);cache.set(key,g)}return g.clone()}
// ---------- piezas
function tireK(k,r,w){k.add(new TH.CylinderGeometry(r,r,w,14).rotateX(Math.PI/2),'rubber',TIRE,0,0,0);k.add(new TH.CylinderGeometry(r*.55,r*.55,w+.01,10).rotateX(Math.PI/2),'metal',GREY,0,0,0)}
function spokedK(k,r,w,col){k.add(new TH.TorusGeometry(r,.02,5,16),'planks',col||WOOD,0,0,0);k.add(new TH.CylinderGeometry(.03,.03,w,8).rotateX(Math.PI/2),'metal',0x505358,0,0,0);for(let i=0;i<6;i++)k.add(box(.014,r*2,.014),'planks',col||WOOD,0,0,0,0,0,i*Math.PI/6)}
function wheels(parts,list,build,key){parts.wheels=parts.wheels||[];for(const [x,y,z] of list){const w=pivot(x,y,z);w.add(cached(key,build));parts.body.add(w);parts.wheels.push(w)}}
function trackK(k,L,h,w,z,col){return runningGear(k,{L,h,w,z,n:5,r:h*.3,sprocket:'rear',ret:1,col:col===0x444||col===0x3a3a3a?0x4a4e48:col})}
function barrelK(k,len,r,x,y,z,col,mat){k.add(new TH.CylinderGeometry(r,r*1.05,len,10).rotateZ(-Math.PI/2),mat||'metal',col||GUN,x+len/2,y,z)}
function carriageK(k,col){k.add(box(.62,.06,.08),'planks',col||WOOD,-.2,.2,.13,0,0,-.25);k.add(box(.62,.06,.08),'planks',col||WOOD,-.2,.2,-.13,0,0,-.25);k.add(box(.12,.1,.34),'planks',col||WOOD,.08,.3,0);k.add(box(.08,.05,.3),'planks',col||WOOD,-.46,.08,0)}
function flagK(k,pc,x,y,z,h){k.add(cyl(.008,.008,h||.35,4),'metal',LGREY,x,y,z);k.add(box(.005,.09,.13),'cloth',pc,x,y+(h||.35)-.06,z+.07)}
function lightsK(k,x,y,z,col){k.add(box(.02,.04,.05),'neon',col||0xfff2c8,x,y,z)}
// ---------- vehículos terrestres
function jeep(parts,pc,camo){parts.body.add(mesh(k=>{k.add(box(.72,.14,.42),camo?'camo':'steel',OLIVE,0,.2,0);k.add(box(.28,.1,.4),'steel',OLIVE,.24,.31,0);k.add(box(.04,.14,.36),'glass',0x9fc4d8,.08,.38,0,0,0,-.3);
 k.add(box(.3,.05,.44),'steel',OLIVE2,-.2,.3,0);k.add(cyl(.02,.02,.2,6),'metal',DARK,-.15,.4,0);k.add(box(.26,.03,.03),'metal',DARK,-.05,.5,0);k.add(box(.2,.06,.3),'cloth',pc,-.28,.32,0);flagK(k,pc,-.33,.3,-.18,.3)}));
 wheels(parts,[[.24,.12,.23],[.24,.12,-.23],[-.24,.12,.23],[-.24,.12,-.23]],k=>tireK(k,.11,.08),'jtire')}
function recon(parts,pc){parts.body.add(mesh(k=>{k.add(box(.95,.22,.48),'steel',OLIVE,0,.27,0);k.add(box(.2,.14,.44),'steel',OLIVE,.42,.24,0,0,0,.5);k.add(cyl(.14,.16,.12,10),'steel',OLIVE2,-.05,.44,0);
 barrelK(k,.36,.022,.02,.46,0);k.add(box(.6,.02,.5),'cloth',pc,-.1,.385,0);lightsK(k,.5,.3,.14);lightsK(k,.5,.3,-.14)}));
 wheels(parts,[[.3,.13,.27],[.3,.13,-.27],[0,.13,.27],[0,.13,-.27],[-.3,.13,.27],[-.3,.13,-.27]],k=>tireK(k,.12,.09),'rtire')}
function drone(parts,pc){parts.fly=true;parts.rotors=[];parts.body.add(mesh(k=>{k.add(sph(.14,12,8).scale(1.4,.5,1),'poly',WHITE,0,.02,0);k.add(box(.3,.03,.03),'poly',LGREY,.12,0,0);
 for(const [x,z] of[[.22,.22],[.22,-.22],[-.22,.22],[-.22,-.22]]){k.add(box(Math.hypot(x,z),.025,.03),'poly',LGREY,x/2,0,z/2,-Math.atan2(z,x));k.add(cyl(.05,.05,.04,10),'poly',DARK,x,.01,z)}
 k.add(sph(.05,8,6),'glass',0x223040,.18,-.05,0);k.add(box(.1,.02,.1),'cloth',pc,-.05,.08,0);barrelK(k,.22,.015,.05,-.08,0,DARK);lightsK(k,.24,0,.05,CYAN);lightsK(k,.24,0,-.05,CYAN)}));
 for(const [x,z] of[[.22,.22],[.22,-.22],[-.22,.22],[-.22,-.22]]){const r=pivot(x,.05,z);r.add(cached('rotor',k=>{k.add(box(.26,.006,.03),'poly',0x222222,0,0,0);k.add(box(.03,.006,.26),'poly',0x222222,0,0,0)}));parts.body.add(r);parts.rotors.push(r)}}
function hoverTank(parts,pc,big){parts.hover=true;const s=big?1.2:1;parts.body.add(mesh(k=>{k.add(box(1.0*s,.16,.62*s),'poly',WHITE,0,.28,0);k.add(box(.9*s,.08,.56*s),'panel',0x3a4048,0,.18,0);k.add(box(.3*s,.1,.5*s),'poly',WHITE,.45*s,.24,0,0,0,.4);
 k.add(box(.9*s,.03,.64*s),'neon',CYAN,0,.12,0);k.add(cyl(.18*s,.22*s,.14,8),'poly',LGREY,-.05,.43,0);barrelK(k,.5*s,.03,.05,.45,.06,0x2a3036);barrelK(k,.5*s,.03,.05,.45,-.06,0x2a3036);
 k.add(box(.5*s,.02,.4*s),'cloth',pc,-.1,.365,0);k.add(box(.04,.04,.2),'neon',CYAN,.1+.5*s,.45,0)}))}
// ---------- blindados con perfiles reales (extrusiones de silueta en vez de cajas)
function exG(shape,depth,bev){return new TH.ExtrudeGeometry(shape,{depth,bevelEnabled:!!bev,bevelThickness:bev||0,bevelSize:bev||0,bevelSegments:1,curveSegments:8})}
function shapeOf(pts){const s=new TH.Shape();pts.forEach(([a,b],i)=>i?s.lineTo(a,b):s.moveTo(a,b));s.closePath();return s}
// silueta lateral (x adelante, y arriba) extruida a lo ancho, centrada en z
function sideG(pts,width,bev){const g=exG(shapeOf(pts),width,bev);g.translate(0,0,-width/2);return g}
// planta (x adelante, z lateral) extruida hacia arriba; taper estrecha la parte alta (laterales inclinados)
function topG(pts,h,taper,bev){const g=exG(shapeOf(pts.map(([x,z])=>[x,-z])),h,bev);g.rotateX(-Math.PI/2);
 if(taper){g.computeBoundingBox();const bb=g.boundingBox,cx=(bb.min.x+bb.max.x)/2,cz=(bb.min.z+bb.max.z)/2,p=g.attributes.position;
  for(let i=0;i<p.count;i++){const t=Math.max(0,Math.min(1,p.getY(i)/h)),f=1-taper*t;p.setX(i,cx+(p.getX(i)-cx)*(1-taper*.35*t));p.setZ(i,cz+(p.getZ(i)-cz)*f)}g.computeVertexNormals()}
 return g}
// envolvente convexa y desplazamiento hacia dentro (para la cadena: anillo con hueco)
function hull2(P){P=P.slice().sort((a,b)=>a[0]-b[0]||a[1]-b[1]);const cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);const lo=[],up=[];
 for(const p of P){while(lo.length>=2&&cr(lo[lo.length-2],lo[lo.length-1],p)<=0)lo.pop();lo.push(p)}
 for(const p of P.slice().reverse()){while(up.length>=2&&cr(up[up.length-2],up[up.length-1],p)<=0)up.pop();up.push(p)}up.pop();lo.pop();return lo.concat(up)}
function inset(poly,t){const n=poly.length,out=[];for(let i=0;i<n;i++){const a=poly[(i-1+n)%n],b=poly[i],c=poly[(i+1)%n];
 const n1=nrm(a,b),n2=nrm(b,c);const p1=[a[0]+n1[0]*t,a[1]+n1[1]*t],d1=[b[0]-a[0],b[1]-a[1]],p2=[b[0]+n2[0]*t,b[1]+n2[1]*t],d2=[c[0]-b[0],c[1]-b[1]];
 const den=d1[0]*d2[1]-d1[1]*d2[0];if(Math.abs(den)<1e-9){out.push([b[0]+n1[0]*t,b[1]+n1[1]*t]);continue}const s=((p2[0]-p1[0])*d2[1]-(p2[1]-p1[1])*d2[0])/den;out.push([p1[0]+d1[0]*s,p1[1]+d1[1]*s])}return out}
function nrm(a,b){const dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1;return[-dy/l,dx/l]}
// tren de rodaje completo de un lado: cadena (anillo), ruedas de rodaje con buje, rueda motriz dentada, rueda tensora y rodillos de retorno
// o={L,h,w,z,n (ruedas),r (radio rueda),sprocket:'rear'|'front',ret (rodillos),bogie (suspensión de bogies tipo Sherman),col}
function runningGear(k,o){const L=o.L,h=o.h,w=o.w,z=o.z,n=o.n||6,r=o.r||h*.36,col=o.col||0x4a4e48,rr=h*.27,x0=-L/2,x1=L/2;
 const xR=x0+rr+.01,xF=x1-rr-.01,yR=o.sprocket==='front'?h*.62:h*.68,yF=o.sprocket==='front'?h*.68:h*.6;
 const wx=[];const first=x0+L*.15,last=x1-L*.15;for(let i=0;i<n;i++)wx.push(first+(last-first)*i/(n-1));
 const pts=[];const circ=(cx,cy,R)=>{for(let a=0;a<16;a++)pts.push([cx+Math.cos(a/16*6.283)*R,cy+Math.sin(a/16*6.283)*R])};
 circ(xR,yR,rr+.022);circ(xF,yF,rr+.022);for(const x of wx)circ(x,r,r+.022);
 const outer=hull2(pts);const inner=inset(outer,.024);const sh=shapeOf(outer);sh.holes.push(new TH.Path(inner.map(p=>new TH.Vector2(p[0],p[1]))));
 const belt=exG(sh,w,0);belt.translate(0,0,z-w/2);k.add(belt,'rubber',0x2a2a28,0,0,0);
 // tacos de la cadena por encima y por debajo
 const topY=Math.max(...outer.map(p=>p[1]));for(let x=xR;x<xF;x+=.055){k.add(box(.022,.012,w+.006),'metal',0x3c3c3a,x,topY-.002,z)}
 for(let x=wx[0];x<=wx[wx.length-1];x+=.055){k.add(box(.022,.012,w+.006),'metal',0x3c3c3a,x,.004,z)}
 const wheel=(x,y,R,ww,c,hub)=>{k.add(new TH.CylinderGeometry(R,R,ww,16).rotateX(Math.PI/2),'steel',c,x,y,z);k.add(new TH.CylinderGeometry(R*.62,R*.62,ww+.012,12).rotateX(Math.PI/2),'steel',hub,x,y,z);
  k.add(new TH.CylinderGeometry(R*.18,R*.18,ww+.024,8).rotateX(Math.PI/2),'metal',0x2a2c2a,x,y,z)};
 for(const x of wx)wheel(x,r,r,w*.82,col,0x3a3d38);
 if(o.bogie){for(let i=0;i<n;i+=2){const xm=(wx[i]+wx[Math.min(n-1,i+1)])/2;k.add(box(Math.abs(wx[Math.min(n-1,i+1)]-wx[i])+.05,.07,.03),'steel',col,xm,r+.04,z+Math.sign(z)*(w*.42));k.add(box(.05,.09,.04),'steel',col,xm,r+.1,z+Math.sign(z)*(w*.42))}}
 // rueda motriz (dientes) y tensora
 const xs=o.sprocket==='front'?xF:xR,ys=o.sprocket==='front'?yF:yR,xi=o.sprocket==='front'?xR:xF,yi=o.sprocket==='front'?yR:yF;
 wheel(xs,ys,rr,w*.7,0x3a3d38,0x2c2e2c);for(let a=0;a<10;a++){const an=a/10*6.283;k.add(box(.026,.018,w*.6),'metal',0x2c2e2c,xs+Math.cos(an)*rr,ys+Math.sin(an)*rr,z,0,0,an)}
 wheel(xi,yi,rr*.92,w*.7,col,0x3a3d38);
 if(o.ret)for(let i=0;i<o.ret;i++){const x=xR+(xF-xR)*(i+1)/(o.ret+1);k.add(new TH.CylinderGeometry(.022,.022,w*.6,8).rotateX(Math.PI/2),'steel',0x3a3d38,x,topY-.04,z)}
 return topY}
// cañón con manguito térmico, extractor de humos, freno de boca opcional
function gunK(k,len,r,x,y,o){o=o||{};const col=o.col||0x3c4036;
 k.add(new TH.CylinderGeometry(r*.92,r*1.08,len,12).rotateZ(-Math.PI/2),'steel',col,x+len/2,y,0);
 if(o.sleeve)for(let i=1;i<4;i++)k.add(new TH.CylinderGeometry(r*1.12,r*1.12,.012,12).rotateZ(-Math.PI/2),'steel',0x2e312a,x+len*i/4.2,y,0);
 if(o.evac!=null)k.add(new TH.CylinderGeometry(r*1.55,r*1.55,len*.11,12).rotateZ(-Math.PI/2),'steel',col,x+len*o.evac,y,0);
 if(o.brake){k.add(box(len*.08,r*2.6,r*2.6),'steel',col,x+len-len*.03,y,0);k.add(box(len*.04,r*1.2,r*3.2),'steel',0x2e312a,x+len-len*.035,y,0)}
 if(o.mrs)k.add(box(.03,.02,.02),'steel',0x2e312a,x+len-.03,y+r*1.3,0)}
function smokeK(k,x,y,z,s){for(let i=0;i<4;i++)k.add(new TH.CylinderGeometry(.012,.012,.05,6).rotateZ(-Math.PI/2+.5).rotateY(s*.5),'steel',0x2e312a,x-i*.025,y+(i%2)*.02,z)}
// carro de combate según la edad: 5 = Segunda Guerra Mundial (cuerpo alto, torreta fundida, bogies); 6 = Guerra Fría (torreta de domo, cinco ruedas grandes);
// 7 = moderno (torreta angular de blindaje compuesto, faldones, cañón largo)
function tank(parts,pc,tier){
 if(tier===5){const col=0x5d6537,L=1.04,W=.6,tw=.13,z=W/2-tw/2;
  parts.body.add(mesh(k=>{for(const s of[1,-1])runningGear(k,{L,h:.2,w:tw,z:s*z,n:6,r:.055,sprocket:'front',bogie:true,ret:3,col});
   k.add(sideG([[-.5,.12],[.46,.12],[.53,.2],[.42,.42],[-.4,.44],[-.52,.34]],W-.02,.006),'steel',col,0,0,0);
   k.add(box(.14,.04,.07),'steel',0x4e5530,.28,.42,.13);k.add(box(.1,.03,.09),'steel',0x4e5530,-.36,.45,0);
   for(const s of[1,-1]){k.add(box(.9,.012,.13),'steel',0x4e5530,0,.215,s*z);lightsK(k,.47,.36,s*.2)}
   k.add(new TH.CylinderGeometry(.008,.008,.07,6).rotateZ(-Math.PI/2),'steel',0x2e312a,.46,.4,-.12);
   k.add(box(.28,.012,.24),'cloth',pc,-.28,.448,0)}));
  const t=pivot(.02,.44,0);parts.body.add(t);parts.turret=t;
  t.add(cached('tank5t',k=>{k.add(new TH.LatheGeometry([new TH.Vector2(0,0),new TH.Vector2(.2,0),new TH.Vector2(.21,.05),new TH.Vector2(.19,.12),new TH.Vector2(.12,.17),new TH.Vector2(0,.18)],16).scale(1.15,1,1),'steel',col,0,0,0);
   k.add(box(.08,.11,.17),'steel',0x4e5530,.21,.07,0);gunK(k,.5,.026,.22,.075,{col:0x4e5530,brake:false});k.add(new TH.CylinderGeometry(.034,.034,.03,10).rotateZ(-Math.PI/2),'steel',0x4e5530,.72,.075,0);
   k.add(cyl(.05,.055,.05,10),'steel',0x4e5530,-.06,.15,.07);k.add(new TH.CylinderGeometry(.006,.006,.12,5).rotateZ(-Math.PI/2),'steel',0x2e312a,-.02,.22,.07);
   k.add(cyl(.004,.004,.3,4),'metal',0x222,-.15,.14,-.1);k.add(box(.003,.05,.07),'cloth',pc,-.15,.4,-.065)}));return}
 if(tier===6){const col=0x6f6a4c,L=1.12,W=.64,tw=.14,z=W/2-tw/2;
  parts.body.add(mesh(k=>{for(const s of[1,-1])runningGear(k,{L,h:.19,w:tw,z:s*z,n:5,r:.068,sprocket:'rear',col});
   k.add(sideG([[-.55,.1],[.4,.1],[.56,.2],[.5,.3],[-.5,.32],[-.56,.26]],W-.05,.006),'steel',col,0,0,0);
   for(const s of[1,-1]){k.add(box(1.06,.014,tw+.02),'steel',0x5e5a40,0,.205,s*z);k.add(box(.22,.06,.06),'steel',0x5e5a40,-.25,.24,s*(z+.0))}
   k.add(cyl(.05,.05,.02,10),'steel',0x5e5a40,.32,.3,.12);for(let i=0;i<5;i++)k.add(box(.012,.006,.3),'metal',0x3a3828,-.48+i*.03,.322,0);
   lightsK(k,.53,.27,.2);lightsK(k,.53,.27,-.2);k.add(box(.24,.012,.26),'cloth',pc,-.38,.325,0)}));
  const t=pivot(.06,.32,0);parts.body.add(t);parts.turret=t;
  t.add(cached('tank6t',k=>{k.add(new TH.LatheGeometry([new TH.Vector2(0,0),new TH.Vector2(.24,0),new TH.Vector2(.25,.03),new TH.Vector2(.22,.09),new TH.Vector2(.15,.14),new TH.Vector2(0,.155)],20).scale(1.2,1,1),'steel',col,-.02,0,0);
   k.add(sph(.08,10,8).scale(1,.7,1.4),'steel',col,.22,.07,0);gunK(k,.78,.028,.24,.07,{col:0x5e5a40,evac:.78});
   k.add(cyl(.055,.06,.05,10),'steel',0x5e5a40,-.08,.14,-.08);k.add(new TH.CylinderGeometry(.007,.007,.14,5).rotateZ(-Math.PI/2),'steel',0x2e2c22,-.05,.21,-.08);
   k.add(box(.06,.05,.05),'glass',0x2a3a40,.04,.13,.12);k.add(cyl(.004,.004,.32,4),'metal',0x222,-.2,.14,.12);k.add(box(.003,.05,.07),'cloth',pc,-.2,.42,.155)}));return}
 // moderno
 const col=0x6a6d55,dk=0x55584a,L=1.26,W=.68,tw=.15,z=W/2-tw/2;
 parts.body.add(mesh(k=>{for(const s of[1,-1])runningGear(k,{L,h:.19,w:tw,z:s*z,n:7,r:.05,sprocket:'rear',ret:2,col:dk});
  k.add(sideG([[-.6,.09],[.48,.09],[.63,.2],[.62,.22],[-.6,.26]],W-.08,.005),'steel',col,0,0,0);
  k.add(topG([[-.62,-W/2],[.5,-W/2],[.6,-W/2+.06],[.6,W/2-.06],[.5,W/2],[-.62,W/2]],.03,0,.003),'steel',col,0,.235,0);
  // faldones laterales con paneles
  for(const s of[1,-1]){const sk=sideG([[-.5,.11],[.5,.11],[.58,.2],[.58,.235],[-.5,.235]],.018,0);k.add(sk,'steel',col,0,0,s*(W/2+.004));
   for(let i=0;i<6;i++)k.add(box(.006,.1,.021),'steel',dk,-.42+i*.17,.172,s*(W/2+.004))}
  for(let i=0;i<6;i++)k.add(box(.012,.006,.34),'metal',0x3a3c32,-.58+i*.022,.268,0);k.add(box(.06,.03,.5),'steel',dk,-.6,.2,0);
  lightsK(k,.6,.24,.24);lightsK(k,.6,.24,-.24);k.add(box(.05,.014,.08),'glass',0x2a3a40,.5,.262,0)}));
 const t=pivot(-.02,.265,0);parts.body.add(t);parts.turret=t;
 t.add(cached('tank7t',k=>{
  // torreta de blindaje compuesto: frontal en cuña, laterales inclinados, cesto trasero
  k.add(topG([[.34,-.09],[.34,.09],[.14,.27],[-.26,.28],[-.38,.23],[-.42,.17],[-.42,-.17],[-.38,-.23],[-.26,-.28],[.14,-.27]],.13,.16,.006),'steel',col,0,0,0);
  k.add(box(.1,.07,.14),'steel',dk,.36,.065,0);gunK(k,.92,.026,.38,.065,{col:dk,sleeve:true,evac:.42,mrs:true});
  for(const s of[1,-1]){k.add(box(.04,.035,.07),'steel',dk,.12,.14,s*.15);smokeK(k,.1,.1,s*.27,s)}
  k.add(cyl(.05,.055,.04,10),'steel',dk,-.1,.13,.11);k.add(box(.06,.035,.035),'glass',0x2a3a40,-.06,.17,.11);k.add(new TH.CylinderGeometry(.006,.006,.14,5).rotateZ(-Math.PI/2),'steel',0x2e312a,-.04,.2,.11);
  k.add(cyl(.04,.045,.03,10),'steel',dk,-.08,.13,-.11);k.add(box(.07,.06,.06),'steel',dk,.02,.16,-.17);k.add(box(.02,.04,.05),'glass',0x2a3a40,.055,.17,-.17);
  // cesto de equipaje y antenas
  for(const s of[1,-1])k.add(box(.2,.05,.008),'metal',0x3a3c32,-.47,.08,s*.18);k.add(box(.008,.05,.36),'metal',0x3a3c32,-.57,.08,0);k.add(box(.2,.04,.3),'cloth',0x6d6550,-.47,.06,0);
  k.add(cyl(.004,.004,.36,4),'metal',0x222,-.34,.13,.16);k.add(cyl(.004,.004,.3,4),'metal',0x222,-.34,.13,-.16);k.add(box(.003,.05,.07),'cloth',pc,-.34,.44,.195);
  k.add(box(.22,.006,.22),'cloth',pc,-.2,.131,0)}))}
// lanzacohetes múltiple sobre camión 6×6 (estilo HIMARS): cabina blindada, contenedor de 6 tubos elevado y estabilizadores
function rocketTruck(parts,pc,tier){const col=tier>=7?0x5e6252:0x6b7148,dk=tier>=7?0x4a4e42:0x565c38;
 parts.body.add(mesh(k=>{
  k.add(box(1.12,.05,.3),'steel',0x2c2e2a,-.05,.19,0);
  // cabina con parabrisas inclinado
  k.add(sideG([[.3,.2],[.62,.2],[.62,.3],[.56,.46],[.34,.47],[.3,.44]],.48,.008),'steel',col,0,0,0);
  for(const s of[1,-1])k.add(box(.14,.08,.004),'glass',0x2a3a44,.47,.39,s*.245);k.add(box(.004,.09,.38),'glass',0x2a3a44,.59,.4,0,0,0,-.62);
  k.add(box(.03,.07,.4),'metal',0x2c2e2a,.63,.25,0);lightsK(k,.63,.29,.17);lightsK(k,.63,.29,-.17);for(const s of[1,-1])k.add(box(.03,.04,.02),'metal',0x222,.5,.44,s*.26);
  for(const s of[1,-1]){k.add(box(.2,.025,.1),'steel',dk,.42,.29,s*.22);k.add(box(.5,.025,.1),'steel',dk,-.25,.29,s*.22)}
  // plataforma, contenedor de cohetes elevado (6 tubos) y estabilizadores
  k.add(box(.62,.06,.46),'steel',dk,-.22,.25,0);k.add(box(.2,.08,.2),'steel',dk,-.12,.32,0);
  const ang=.32;
  k.add(box(.62,.2,.34),'steel',col,-.22,.47,0,0,0,ang);
  const fx=-.22+Math.cos(ang)*.31,fy=.47+Math.sin(ang)*.31;
  for(let i=0;i<2;i++)for(let j=0;j<3;j++)k.add(new TH.CylinderGeometry(.04,.04,.012,10).rotateZ(Math.PI/2+ang),'metal',0x1c1d1a,fx+.004,fy-.05+i*.1,-.1+j*.1);
  for(const s of[1,-1])k.add(box(.05,.12,.04),'steel',dk,-.5,.2,s*.2);
  k.add(box(.22,.012,.2),'cloth',pc,-.32,.505,0,0,0,ang);flagK(k,pc,.35,.47,-.18,.25)}));
 wheels(parts,[[.44,.12,.24],[.44,.12,-.24],[-.2,.12,.24],[-.2,.12,-.24],[-.44,.12,.24],[-.44,.12,-.24]],k=>{tireK(k,.12,.09);for(let a=0;a<12;a++){const an=a/12*6.283;k.add(box(.03,.02,.092),'rubber',0x151515,Math.cos(an)*.115,Math.sin(an)*.115,0,0,0,an)}},'ttire2')}
function mechFallback(parts,pc){hoverTank(parts,pc,true)}
// ---------- artillería
function cannon(parts,pc,tier,type){const long=type==='mangonel';parts.body.add(mesh(k=>{
 if(tier<=4){carriageK(k,tier===4?0x5a4a3a:WOOD);barrelK(k,long?.72:.55,long?.04:.07,-.1,.34,0,tier===3?BRASS:0x3a3d42,'metal');k.add(cyl(long?.05:.085,long?.05:.085,.06,10).rotateZ(Math.PI/2),'metal',tier===3?BRASS:0x3a3d42,-.13,.34,0);
  if(type==='ram'&&tier===3){k.add(box(.12,.22,.3),'planks',WOOD,.08,.28,0)}for(let i=0;i<3;i++)k.add(sph(.035,6,4),'metal',0x222,-.4-i*.07,.05,.25);flagK(k,pc,-.45,.08,-.2,.4)}
 else if(tier===5){k.add(box(.1,.3,.5),'steel',OLIVE,.05,.35,0);carriageK(k,OLIVE2);barrelK(k,long?.3:.7,long?.07:.05,long?.05:-.05,long?.22:.38,0,OLIVE2,'steel');if(long){k.add(box(.3,.02,.3),'steel',OLIVE2,0,.02,0)}k.add(box(.26,.02,.2),'cloth',pc,-.35,.13,0)}
 }));if(tier<=5)wheels(parts,[[0,.16,.21],[0,.16,-.21]],k=>tier<=4?spokedK(k,.16,.05):tireK(k,.15,.07),tier<=4?'swheel':'atire')}
function spArt(parts,pc){const col=0x6f6a4c,dk=0x5a563c;parts.body.add(mesh(k=>{for(const sd of[1,-1])runningGear(k,{L:1.12,h:.19,w:.14,z:sd*.25,n:6,r:.052,sprocket:'front',ret:2,col:dk});
 k.add(sideG([[-.56,.09],[.42,.09],[.57,.19],[.5,.27],[-.56,.27]],.5,.005),'steel',col,0,0,0);for(const sd of[1,-1])k.add(box(1.08,.014,.16),'steel',dk,0,.2,sd*.25);
 k.add(topG([[.26,-.22],[.26,.22],[.1,.27],[-.5,.27],[-.56,.22],[-.56,-.22],[-.5,-.27],[.1,-.27]],.22,.12,.006),'steel',col,-.06,.27,0);
 gunK(k,.82,.03,.18,.39,{col:dk,evac:.55,brake:true});k.add(box(.1,.1,.16),'steel',dk,.22,.39,0);k.add(cyl(.045,.05,.04,10),'steel',dk,-.25,.49,.12);
 k.add(new TH.CylinderGeometry(.006,.006,.12,5).rotateZ(-Math.PI/2),'steel',0x2e312a,-.22,.55,.12);k.add(box(.26,.008,.26),'cloth',pc,-.3,.495,-.04);lightsK(k,.55,.24,.18);lightsK(k,.55,.24,-.18)}))}
function truckBase(k,col,cabW){k.add(box(.3,.26,cabW||.46),'steel',col,.42,.3,0);k.add(box(.04,.12,.4),'glass',0x9fc4d8,.575,.36,0);k.add(box(1.05,.08,.46),'steel',DARK,-.05,.17,0);lightsK(k,.58,.22,.16);lightsK(k,.58,.22,-.16)}
function smartArt(parts,pc){const col=0x6a6f66,dk=0x50554e;parts.body.add(mesh(k=>{for(const sd of[1,-1])runningGear(k,{L:1.1,h:.18,w:.14,z:sd*.25,n:6,r:.05,sprocket:'rear',ret:2,col:dk});
 k.add(sideG([[-.55,.09],[.45,.09],[.58,.18],[.56,.22],[-.55,.25]],.5,.005),'steel',col,0,0,0);for(const sd of[1,-1])k.add(sideG([[-.48,.11],[.5,.11],[.56,.19],[.56,.22],[-.48,.22]],.016,0),'steel',col,0,0,sd*.33);
 k.add(topG([[.3,-.14],[.3,.14],[.12,.25],[-.46,.25],[-.52,.18],[-.52,-.18],[-.46,-.25],[.12,-.25]],.2,.2,.006),'steel',col,-.05,.25,0);
 gunK(k,.9,.03,.24,.35,{col:dk,sleeve:true,brake:true,mrs:true});k.add(box(.09,.09,.13),'steel',dk,.27,.35,0);
 k.add(box(.1,.06,.08),'steel',dk,.0,.47,.14);k.add(box(.02,.04,.06),'glass',0x223040,.05,.48,.14);k.add(box(.03,.02,.3),'neon',CYAN,-.1,.455,0);
 k.add(cyl(.004,.004,.3,4),'metal',0x222,-.4,.45,.18);k.add(box(.24,.008,.24),'cloth',pc,-.28,.452,-.04);lightsK(k,.56,.21,.18);lightsK(k,.56,.21,-.18)}))}
function railgun(parts,pc,plasma){parts.hover=true;parts.body.add(mesh(k=>{k.add(box(1.0,.14,.6),'poly',WHITE,0,.25,0);k.add(box(.95,.03,.62),'neon',CYAN,0,.15,0);
 if(plasma){k.add(cyl(.12,.16,.26,10),'poly',LGREY,-.1,.42,0);k.add(sph(.13,12,10),'neon',0xb06bff,.22,.52,0);barrelK(k,.35,.05,-.05,.52,0,0x2a3036)}
 else{for(const z of[.07,-.07])k.add(box(1.1,.05,.03),'panel',0x2a3036,.25,.45,z);k.add(box(1.0,.02,.03),'neon',CYAN,.28,.45,0);k.add(box(.4,.18,.3),'poly',LGREY,-.25,.4,0)}
 k.add(box(.3,.02,.3),'cloth',pc,-.3,.505,0)}))}
// ---------- comercio
function wagon(parts,pc,tier){parts.body.add(mesh(k=>{k.add(box(.7,.12,.4),'planks',WOOD,-.05,.26,0);if(tier===3){k.add(new TH.CylinderGeometry(.24,.24,.68,12,1,true,0,Math.PI).rotateZ(Math.PI/2).rotateX(Math.PI/2),'cloth',0xe8e0cc,-.05,.32,0);k.add(box(.7,.02,.06),'cloth',pc,-.05,.5,0)}
 else{k.add(box(.6,.3,.42),'planks',0x5a2a22,-.05,.46,0);k.add(box(.64,.03,.46),'planks',DARK,-.05,.62,0);k.add(box(.1,.12,.3),'cloth',pc,-.05,.46,.215);k.add(box(.3,.08,.3),'planks',0x7a5a3a,-.05,.68,0)}
 const H=(x,z)=>{k.add(sph(.08,8,6).scale(1.8,1,.8),'matte',0x6a4a30,x,.42,z);k.add(sph(.05,8,6).scale(1.2,1,.8),'matte',0x6a4a30,x+.14,.5,z);for(const dx of[-.06,.06])for(const dz of[-.03,.03])k.add(cyl(.018,.016,.3,5),'matte',0x5a3a26,x+dx,.2,z+dz)};H(.55,.1);H(.55,-.1);k.add(box(.5,.02,.02),'planks',WOOD,.3,.28,0)}));
 wheels(parts,[[.18,.16,.22],[.18,.16,-.22],[-.28,.16,.22],[-.28,.16,-.22]],k=>spokedK(k,.15,.04),'wwheel')}
function truck(parts,pc,tier){const auto=tier>=7;parts.body.add(mesh(k=>{truckBase(k,auto?WHITE:0x3a5a7a);if(auto){k.add(box(.05,.14,.42),'neon',CYAN,.58,.32,0)}
 k.add(box(.66,.34,.46),auto?'poly':'panel',auto?LGREY:0xc8c0b0,-.22,.4,0);k.add(box(.3,.2,.02),'cloth',pc,-.22,.42,.235);k.add(box(.3,.2,.02),'cloth',pc,-.22,.42,-.235)}));
 wheels(parts,[[.38,.12,.24],[.38,.12,-.24],[-.35,.12,.24],[-.35,.12,-.24]],k=>tireK(k,.12,.08),'ttire')}
function cargoDrone(parts,pc){drone(parts,pc);parts.body.add(mesh(k=>{k.add(box(.22,.16,.2),'panel',0xc8c0b0,0,-.14,0);k.add(box(.23,.05,.21),'cloth',pc,0,-.1,0)}))}
// ---------- barcos
function hullK(k,L,W,H,col,deck){const s=new TH.Shape();s.moveTo(-L/2,-W/2*.85);s.lineTo(L/2-W*.8,-W/2);s.quadraticCurveTo(L/2,-W*.2,L/2+W*.35,0);s.quadraticCurveTo(L/2,W*.2,L/2-W*.8,W/2);s.lineTo(-L/2,W/2*.85);s.closePath();
 const g=new TH.ExtrudeGeometry(s,{depth:H,bevelEnabled:false});g.rotateX(Math.PI/2);g.translate(0,H-.06,0);k.add(g,'steel',col,0,0,0);k.add(box(L*.9,.02,W*.82),'steel',deck||0x6a6e72,-.03,H-.05,0);k.add(box(L*.98,.03,W*.9),'steel',0x7a2a22,-.02,.02,0)}
function shipEra(parts,pc,type,tier){parts.ship=true;parts.legs=[];parts.body.add(mesh(k=>{
 if(type==='galley'){
  if(tier===3){hullK(k,1.9,.62,.34,0x7a5232,0x9a7a52);for(const x of[-.5,.05,.55])k.add(cyl(.025,.03,1.3,6),'timber',0xffffff,x,.3,0);for(const x of[-.5,.05,.55])for(const y of[.75,1.2])k.add(box(.04,.34,.6),'cloth',y>1?0xf2ead8:pc,x+.02,y,0);k.add(box(.4,.3,.6),'planks',0x6a4a2a,-.75,.42,0);for(let i=0;i<4;i++)for(const z of[.3,-.3])k.add(cyl(.03,.03,.1,6).rotateX(Math.PI/2),'metal',DARK,-.4+i*.3,.2,z)}
  else if(tier===4){hullK(k,2.0,.6,.3,0x2a2c30,0x6a5a48);k.add(cyl(.08,.1,.5,8),'metal',DARK,-.1,.5,0);k.add(box(.5,.18,.4),'steel',0x3a3e44,.25,.35,0);barrelK(k,.4,.04,.3,.42,0,DARK);for(const x of[-.6,.6])k.add(cyl(.02,.02,.9,5),'timber',0xffffff,x,.6,0);flagK(k,pc,-.85,.3,0,.4)}
  else if(tier===5){hullK(k,2.3,.5,.28,0x6e7680);k.add(box(.5,.24,.34),'steel',0x7e868e,-.1,.38,0);k.add(box(.2,.3,.16),'steel',0x7e868e,-.1,.6,0);k.add(cyl(.07,.08,.3,8),'steel',0x5e666e,-.45,.45,0);
   for(const x of[.55,-.75]){k.add(box(.2,.1,.18),'steel',0x7e868e,x,.33,0);barrelK(k,.3,.025,x+.08,.36,0,DARK)}flagK(k,pc,-1.05,.26,0,.35)}
  else if(tier===6){hullK(k,2.4,.52,.3,0x7a828a);k.add(box(.7,.3,.4),'steel',0x8a929a,-.15,.4,0);k.add(box(.25,.25,.3),'steel',0x8a929a,-.1,.66,0);k.add(cyl(.12,.12,.04,12),'metal',LGREY,-.1,.82,0);
   for(let i=0;i<4;i++)k.add(box(.06,.04,.06),'metal',DARK,.45+i*.1,.31,0);barrelK(k,.25,.03,.75,.36,0,DARK);k.add(box(.3,.02,.3),'cloth',pc,-.5,.305,0)}
  else if(tier===7){hullK(k,2.4,.54,.3,0x4a5058,0x3a3e44);k.add(box(1.0,.32,.44),'panel',0x4a5058,-.15,.42,0,0,0,0);k.add(box(.5,.24,.36),'panel',0x4a5058,-.1,.66,0);k.add(box(.3,.05,.3),'glass',0x223040,.05,.66,0);
   barrelK(k,.25,.03,.72,.36,0,DARK);k.add(box(.3,.02,.3),'cloth',pc,-.6,.305,0)}
  else{parts.hover=true;hullK(k,2.2,.55,.24,0xe8ecef,0xc8ccd0);k.add(box(1.8,.03,.58),'neon',CYAN,0,.05,0);k.add(box(.7,.26,.42),'poly',WHITE,-.2,.38,0);k.add(sph(.12,10,8),'neon',0xb06bff,.55,.4,0);
   for(const z of[.28,-.28])k.add(box(.5,.3,.03),'poly',LGREY,.2,-.05,z);k.add(box(.3,.02,.3),'cloth',pc,-.4,.515,0)}}
 else if(type==='transport'){
  if(tier===3){hullK(k,1.6,.7,.34,0x7a5232,0x9a7a52);k.add(cyl(.03,.035,1.2,6),'timber',0xffffff,0,.3,0);k.add(box(.04,.5,.62),'cloth',pc,.02,.9,0);k.add(box(.4,.34,.66),'planks',0x6a4a2a,-.55,.45,0)}
  else if(tier===4){hullK(k,1.8,.7,.3,0x2a2c30,0x6a5a48);k.add(box(.7,.22,.5),'planks',0x8a6a48,-.2,.4,0);k.add(cyl(.08,.1,.5,8),'metal',DARK,.1,.5,0);flagK(k,pc,-.8,.3,0,.4)}
  else if(tier===5||tier===6){hullK(k,1.8,.8,.28,0x6e7650);k.add(box(.14,.3,.8),'steel',0x5e6644,.9,.3,0);k.add(box(.3,.3,.3),'steel',0x5e6644,-.7,.45,0);k.add(box(.3,.02,.3),'cloth',pc,-.7,.605,0)}
  else{parts.hover=true;k.add(box(1.6,.2,.8),'poly',0x4a5058,0,.28,0);k.add(new TH.TorusGeometry(.42,.1,6,20).scale(2,1,1).rotateX(Math.PI/2),'rubber',TIRE,0,.14,0);for(const z of[.2,-.2])k.add(cyl(.14,.14,.12,12).rotateZ(Math.PI/2),'panel',0x3a3e44,-.75,.55,z);k.add(box(.4,.24,.5),'glass',0x223040,.45,.45,0);k.add(box(.3,.02,.3),'cloth',pc,-.2,.385,0)}}
 else{// pesquero
  hullK(k,1.3,.5,.26,tier>=7?0xd8dde2:0x3a4a5a,0x7a6a58);k.add(box(.34,.26,.34),'steel',tier>=7?WHITE:0xe8e0d0,-.25,.38,0);k.add(box(.3,.04,.36),'steel',DARK,-.25,.52,0);
  if(tier===4)k.add(cyl(.05,.06,.3,8),'metal',DARK,-.3,.65,0);k.add(cyl(.015,.015,.7,5),'metal',LGREY,.2,.5,0);k.add(cyl(.01,.01,.6,4),'metal',LGREY,.35,.45,0,0,0,-.8);k.add(box(.2,.02,.2),'cloth',pc,-.25,.545,0);if(tier>=7)k.add(box(.3,.03,.3),'solar',0x223040,.05,.3,0)}
 }));if(type==='fishship'){const n=new TH.Mesh(new TH.IcosahedronGeometry(.1,1),new TH.MeshStandardMaterial({color:0xcfc4a8,transparent:true,opacity:.7}));n.position.set(.5,.02,0);parts.body.add(n);parts.net=n}}

// qué edad concreta usa cada tipo (null = modelo clásico)
const STEPS={scout:[5,6,7,8],knight:[5,6,7,8],ram:[3,4,5,6,7,8],mangonel:[3,4,5,6,7,8],trade:[3,4,5,7,8],galley:[3,4,5,6,7,8],transport:[3,4,5,7],fishship:[4,5,7]};
A.unitEraTier=function(type,age){const s=STEPS[type];if(!s)return null;let t=null;for(const v of s)if(age>=v)t=v;return t};
A.unitEra=function(type,o,age){const tier=A.unitEraTier(type,age);if(tier==null)return null;const g=new TH.Group(),body=new TH.Group();g.add(body);const parts={body};const pc=PC[o%4];
 switch(type){
 case'scout':if(tier===5)jeep(parts,pc,false);else if(tier===6)recon(parts,pc);else if(tier===7)drone(parts,pc);else hoverTank(parts,pc,false);break;
 case'knight':if(tier===8)mechFallback(parts,pc);else tank(parts,pc,tier);break;
 case'ram':if(tier<=5)cannon(parts,pc,tier,'ram');else if(tier===6)spArt(parts,pc);else if(tier===7)rocketTruck(parts,pc,7);else railgun(parts,pc,false);break;
 case'mangonel':if(tier<=5)cannon(parts,pc,tier,'mangonel');else if(tier===6)rocketTruck(parts,pc,6);else if(tier===7)smartArt(parts,pc);else railgun(parts,pc,true);break;
 case'trade':if(tier<=4)wagon(parts,pc,tier);else if(tier<=7)truck(parts,pc,tier);else cargoDrone(parts,pc);break;
 default:shipEra(parts,pc,type,tier)}
 const ring=new TH.Mesh(new TH.RingGeometry(.3,.37,32).rotateX(-Math.PI/2),new TH.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.9,depthWrite:false}));ring.position.y=.03;ring.visible=false;ring.renderOrder=2;g.add(ring);parts.ring=ring;
 ring.scale.setScalar(type==='galley'||type==='transport'?2.3:type==='fishship'?1.6:1.6);
 g.userData.parts=parts;g.userData.era=tier;return g};
})(window);
