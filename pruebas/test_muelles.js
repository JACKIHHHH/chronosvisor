// Muelles sobre el agua: hay muchos sitios válidos en la costa, se construyen, sacan barcos y los barcos no los atraviesan
globalThis.window=globalThis;require('../web/maps_data.js');require(process.argv[2]||'../web/game.js');const I=globalThis.Imperia,T=I.T;let fails=0;const ok=(c,m)=>{if(!c)fails++;console.log(c?'  ✓':'  ✗',m)};
for(const map of['islas','mediterraneo','continental']){const G=I.newGame({map,size:'small',nAI:1,diff:'easy',civ:'britanos',reveal:'all',startAge:2},21);G.ai[1].passive=true;const D=I._dbg;
 const tc=G.bl.find(b=>b.owner===0&&b.type==='tc');let n=0,best=null,bd=1e9;
 for(let y=tc.ty-25;y<tc.ty+25;y++)for(let x=tc.tx-25;x<tc.tx+25;x++)if(I.canPlace('dock',x,y,0)){n++;const d=Math.hypot(x-tc.tx,y-tc.ty);if(d<bd){bd=d;best=[x,y]}}
 console.log(map,'sitios válidos para muelle a 25 casillas:',n);if(!best){if(map!=='continental')ok(false,map+': hay sitio para muelle');continue}
 let water=0;for(let y=best[1];y<best[1]+3;y++)for(let x=best[0];x<best[0]+3;x++)if(G.ter[y*I.MW+x]===1)water++;ok(water>=5,map+': el muelle queda sobre el agua ('+water+'/9 casillas)');
 const vs=G.ul.filter(u=>u.owner===0&&u.type==='villager').slice(0,3);G.players[0].res.wood=1000;
 ok(I.exec(0,{c:'place',b:'dock',tx:best[0],ty:best[1],ids:vs.map(v=>v.id)}),map+': orden de construir aceptada');
 for(let i=0;i<90*15;i++){I.update(1/15);G.ev.length=0}const dk=G.bl.find(b=>b.owner===0&&b.type==='dock');ok(dk&&dk.bp>=1,map+': los aldeanos terminan el muelle');
 if(dk){G.players[0].res.wood=1000;G.players[0].res.gold=1000;I.exec(0,{c:'queue',id:dk.id,k:'galley'});for(let i=0;i<60*15;i++){I.update(1/15);G.ev.length=0}
  const sh=G.ul.find(u=>u.owner===0&&u.type==='galley');ok(!!sh,map+': sale un barco');
  if(sh){let w=null;for(let r=6;r<20&&!w;r++)for(let a=0;a<24;a++){const x=Math.round(dk.tx+1+Math.cos(a/4)*r),y=Math.round(dk.ty+1+Math.sin(a/4)*r);if(x>0&&y>0&&x<I.MW&&y<I.MH&&G.ter[y*I.MW+x]===1){w=[x,y];break}}
   let through=0;if(w){I.exec(0,{c:'right',ids:[sh.id],x:(w[0]+.5)*T,y:(w[1]+.5)*T});for(let i=0;i<40*15;i++){I.update(1/15);G.ev.length=0;const tx=(sh.x/T)|0,ty=(sh.y/T)|0;if(tx>=dk.tx&&tx<dk.tx+3&&ty>=dk.ty&&ty<dk.ty+3)through++}}
   ok(through<15,map+': el barco no navega a través del muelle')}}}
console.log(fails?'FALLOS '+fails:'TODO OK');
