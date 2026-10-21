// Personalidades de la IA y nivel «Muy difícil»: 4 IA todos contra todos 20 min, sin errores y con estilos distintos
globalThis.window=globalThis;require('../web/maps_data.js');require('../web/game.js');const I=globalThis.Imperia;let ok=true;
for(const diff of['hard','expert']){const G=I.newGame({map:'continental',size:'medium',nAI:3,diff,civ:'iberos'},77);G.players[0].ai=true;G.ai[0]={pers:'bal',tick:1,next:480,wave:9,attacking:false};
 G.players.forEach((p,i)=>{if(i){const k=['rush','boom','turtle'][i-1];G.ai[i].pers=k;p.pers=k;G.ai[i].next=I.DIFF[diff].first*(I.PERS[k].first||1);G.ai[i].wave=Math.max(3,I.DIFF[diff].wave+(I.PERS[k].wave||0))}});const first={};
 try{for(let k=0;k<20*60*15;k++){I.update(1/15);for(const e of G.ev)if(e.ev==='msg'&&/avanza hacia/.test(e.text||''))0;G.ev.length=0;
  for(const p of G.players){const A=G.ai[p.i];if(A&&A.attacking&&first[p.i]==null)first[p.i]=Math.round(G.t)}if(G.over)break}}catch(e){console.log('ERROR',e.stack);ok=false}
 console.log(diff,G.players.map(p=>`${p.pers}: edad ${p.age} pob ${p.pop} torres ${G.bl.filter(b=>!b.dead&&b.owner===p.i&&b.type==='tower').length} 1.er ataque ${first[p.i]??'-'}s recogido ${Math.round(p.stats.gathered)}${p.out?' (eliminado)':''}`).join('\n  '))}
const s=I.serialize();const G2=I.deserialize(s);console.log('guardado conserva personalidad',G2.players.map(p=>p.pers).join(','));
console.log(ok?'TODO OK':'FALLOS')
