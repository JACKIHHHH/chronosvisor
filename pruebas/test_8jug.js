// 8 jugadores en todos los mapas: bases separadas, sin excepciones, rendimiento de la simulación
globalThis.window=globalThis;require('../web/maps_data.js');require('../web/game.js');const I=globalThis.Imperia;let fails=0;
for(const map of Object.keys(I.MAPS))for(const teams of['ffa','teams']){const G=I.newGame({map,size:'medium',nAI:7,teams,diff:'normal',civ:'iberos',pop:'200'},77);
 const T=I.T;let md=1e9;for(let a=0;a<G.bases.length;a++)for(let b=a+1;b<G.bases.length;b++)md=Math.min(md,Math.hypot(G.bases[a].cx-G.bases[b].cx,G.bases[a].cy-G.bases[b].cy));
 const tcs=G.bl.filter(b=>b.type==='tc').length;G.players[0].ai=true;G.ai[0]={tick:1,next:400,wave:7,attacking:false};
 let err=null;const t0=Date.now();try{for(let i=0;i<6*60*15;i++){I.update(1/15);G.ev.length=0;if(G.over)break}}catch(e){err=e.stack}
 const ms=(Date.now()-t0)/(6*60*15);console.log(`${map} ${teams}: MW ${I.MW} TCs ${tcs} dist.mín ${md.toFixed(1)} pob ${G.players.map(p=>p.pop).join(',')} equipos ${G.players.map(p=>p.team).join('')} ${ms.toFixed(2)} ms/tick ${err?'ERROR '+err.split('\n').slice(0,3).join(' '):''}`);
 if(err||tcs!==8||md<12)fails++}
console.log(fails?'FALLOS '+fails:'TODO OK');
