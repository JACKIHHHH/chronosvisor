// Repeticiones: misma semilla + mismas órdenes en el mismo tic = misma partida (también partiendo de una partida cargada)
globalThis.window=globalThis;require('../web/maps_data.js');require('../web/campaign.js');require('../web/game.js');const I=globalThis.Imperia,T=I.T;let fails=0;
function jugar(G,cmds,rec,ticks){let ci=0;for(let t=0;t<ticks;t++){
  if(rec){if(t%90===0){const v=G.ul.filter(e=>!e.dead&&e.owner===0&&e.type==='villager');const r=G.rl.find(x=>x.type==='tree'&&!x.dead);if(v.length&&r){const c={c:'right',ids:v.slice(0,2).map(e=>e.id),x:r.x,y:r.y,tgt:r.id,q:false};if(I.exec(0,c)!==false)cmds.push([t,0,c])}}
   if(t===300){const tc=G.bl.find(b=>b.owner===0&&b.type==='tc');const c={c:'queue',id:tc.id,k:'villager',n:3};if(I.exec(0,c)!==false)cmds.push([t,0,c])}}
  else while(ci<cmds.length&&cmds[ci][0]<=t){I.exec(cmds[ci][1],cmds[ci][2]);ci++}
  I.update(1/30);G.ev.length=0}return I.hash()}
for(const cfg of[{map:'arabia',size:'small',nAI:1,diff:'hard',civ:'iberos'},{map:'iberia',size:'small',nAI:2,diff:'normal',civ:'francos',startAge:4},Object.assign({},globalThis.CHRONO_CAMPAIGN[4])]){
 const seed=12345,cmds=[];let G=I.newGame(cfg,seed);const h1=jugar(G,cmds,true,30*240);
 G=I.newGame(cfg,seed);const h2=jugar(G,cmds,false,30*240);
 console.log((cfg.scn||cfg.map),'órdenes',cmds.length,'hash',h1,h2,h1===h2?'✓':'✗');if(h1!==h2)fails++}
// desde una partida cargada
{let G=I.newGame({map:'continental',size:'small',nAI:1,diff:'hard',civ:'teutones'},99);for(let t=0;t<30*60;t++)I.update(1/30);const snap=I.serialize();
 G=I.deserialize(snap);const cmds=[];const h1=jugar(G,cmds,true,30*180);G=I.deserialize(snap);const h2=jugar(G,cmds,false,30*180);console.log('desde guardado','hash',h1,h2,h1===h2?'✓':'✗');if(h1!==h2)fails++}
console.log(fails?'FALLOS '+fails:'TODO OK');
