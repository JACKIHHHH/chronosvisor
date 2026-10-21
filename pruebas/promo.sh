#!/bin/zsh
# Capturas promocionales (sin interfaz) con la copia Electron de pruebas. Uso: promo.sh <escena> <nombre> [yaw] [pitch] [dist]
cd "$(dirname "$0")/.."
SC="$1"; N="$2"; YW="${3:-0.785}"; PT="${4:-0.62}"; DS="${5:-22}"
E="$PWD/windows/macprueba/Electron.app/Contents/MacOS/Electron"
SD="$HOME/Library/Application Support/Imperia"; rm -f "$SD/shot_$N.json"
pkill -f "windows/macprueba"; sleep 1
JS="setTimeout(function(){try{var sc='$SC',I=Imperia,R=__imperia.R,T=32;
 var cfg={escenas:{oscura:['continental',0],castillos:['continental',2],imperial:['continental',3],industrial:['continental',4],mundial:['continental',5],atomica:['continental',6],info:['continental',7],futuro:['continental',8],himalaya:['asia',2],cascada:['europa',2],nilo:['africa',2],amazonas:['samerica',2],iberia:['iberia',2],islas:['islas',2]}}.escenas[sc];
 __imperia.start({map:cfg[0],size:'medium',nAI:1,diff:'easy',civ:'francos',reveal:'all'});var G=__imperia.G,b=G.bases[0],age=cfg[1];G.players.forEach(function(p){p.age=age});
 var S=R._scene();var sky=new THREE.Color(age>=7?0x8fa6c4:0xa9bfd3);S.background=sky;S.fog.color=sky;
 var place=function(t,o,dx,dy){var x=b.x+dx,y=b.y+dy;for(var k=0;k<6;k++){if(I.canPlace(t,x,y,o)){I._dbg.mkBld(t,o,x,y,true);return}x+=1}};
 var cx=b.cx,cy=b.cy;
 if(['oscura','castillos','imperial','industrial','mundial','atomica','info','futuro'].indexOf(sc)>=0){
  place('house',0,-5,-1);place('house',0,-5,2);place('house',0,-2,5);place('barracks',0,5,-2);place('store',0,1,-6);place('farm',0,4,4);place('farm',0,6,4);place('market',0,-7,-6);place('smith',0,6,7);place('tower',0,-1,8);
  if(age>=2){place('castle',0,10,-1);place('stable',0,-9,4);place('range',0,9,9);place('monastery',0,-10,9)}
  var vs=G.ul.filter(function(e){return e.owner===0&&e.type==='villager'});for(var z=0;z<10;z++)I._dbg.mkUnit('villager',0,(cx+2+z%4)*T,(cy-3+(z>>2))*T);vs=G.ul.filter(function(e){return e.owner===0&&e.type==='villager'});
  var tr=G.list.filter(function(e){return e.type==='tree'&&!e.dead}).sort(function(a,c){return Math.hypot(a.x-b.cx*T,a.y-b.cy*T)-Math.hypot(c.x-b.cx*T,c.y-b.cy*T)})[0];
  var fm=G.bl.filter(function(e){return e.owner===0&&e.type==='farm'});vs.forEach(function(v,i){var t=i<2&&fm[i]?fm[i]:tr;I.exec(0,{c:'right',ids:[v.id],x:t.x,y:t.y,tgt:t.id})});
  if(age>=1){var MW=I.MW,best=-1,ax=cx+6,ay=cy+12;for(var a=0;a<24;a++)for(var r=10;r<=15;r+=1){var px=Math.round(cx+Math.cos(a/24*6.283)*r),py=Math.round(cy+Math.sin(a/24*6.283)*r),c=0;for(var dy=-5;dy<=9;dy++)for(var dx=-5;dx<=5;dx++){var X=px+dx,Y=py+dy;if(X<1||Y<1||X>=MW-1||Y>=I.MH-1)continue;var ii=Y*MW+X;if(G.ter[ii]===0&&!G.occ[ii])c++}if(c>best){best=c;ax=px;ay=py}}window.__bat=[ax,ay+2.5];var types=age>=2?['knight','knight','archer','archer','spear','spear','militia','militia','mangonel','ram']:['militia','spear','archer','scout'];var mine=[],theirs=[];
   for(var z=0;z<28;z++){var t=types[z%types.length];mine.push(I._dbg.mkUnit(t,0,(ax-3+(z%7)*.8)*T,(ay+(z/7|0)*.8)*T));theirs.push(I._dbg.mkUnit(t,1,(ax-3+(z%7)*.8)*T,(ay+5+(z/7|0)*.8)*T))}
   mine=mine.filter(Boolean);theirs=theirs.filter(Boolean);I.exec(0,{c:'amove',ids:mine.map(function(u){return u.id}),x:ax*T,y:(ay+5)*T});I.exec(1,{c:'amove',ids:theirs.map(function(u){return u.id}),x:ax*T,y:ay*T})}
  for(var k=0;k<30*(age>=1?3.2:6);k++)I.update(1/30);
  if(window.__bat)R.centerOn((cx+window.__bat[0]*2)/3,(cy+window.__bat[1]*2)/3);else R.centerOn(cx+2,cy+1)}
 else{var mx=b.cx,mz=b.cy,MW=I.MW,MH=I.MH;
  if(sc==='himalaya'){var bs=-1;for(var y=4;y<MH-4;y++)for(var x=4;x<MW-4;x++){if(G.ter[y*MW+x]!==3)continue;var c=0;for(var dy=-3;dy<=3;dy++)for(var dx=-3;dx<=3;dx++)if(G.ter[(y+dy)*MW+x+dx]===3)c++;if(c>bs){bs=c;mx=x;mz=y}}mz+=6}
  else if(sc==='cascada'){var f=R.falls();if(f.length){var k2=Math.floor(f.length/2);mx=f[k2][0];mz=f[k2][2]}}
  for(var k=0;k<30*2;k++)I.update(1/30);R.centerOn(mx,mz)}
 R.view.yaw=+'$YW';R.view.pitch=+'$PT';R.view.tdist=R.view.dist=+'$DS';R.setQuality('high');
 var rr=R._renderer();var n=0;function tick(){R.render(0.016,G);n++;if(n<70){requestAnimationFrame(tick);return}
  rr.setPixelRatio(2);R.resize();for(var q=0;q<4;q++)R.render(0.016,G);var url=document.querySelector('canvas').toDataURL('image/png');
  window.webkit.messageHandlers.store.postMessage({id:9,op:'write',key:'shot_$N',data:url})}
 setTimeout(tick,800)}catch(e){console.log('FALLO '+e.stack)}},2500);"
(IMPERIA_WINDOWED=1 IMPERIA_EVAL="$JS" nohup "$E" > build/promo.txt 2>&1 &)
for i in $(seq 1 40); do sleep 1; [ -f "$SD/shot_$N.json" ] && break; done
sleep 1; pkill -f "windows/macprueba"; grep -E "FALLO" build/promo.txt | head -3
mkdir -p promo
python3 -c "
import base64;s=open('$SD/shot_$N.json').read();open('promo/raw_$N.png','wb').write(base64.b64decode(s.split(',',1)[1]));print('ok promo/raw_$N.png')"
rm -f "$SD/shot_$N.json"
