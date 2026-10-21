// Campaña: cada misión se crea, coloca su escenario, evalúa objetivos y sucesos; la IA juega por ti unos minutos
globalThis.window=globalThis;require('../web/maps_data.js');
require('../web/campaign.js');require('../web/game.js');const I=globalThis.Imperia,C=globalThis.CHRONO_CAMPAIGN;let fails=0;
for(const M of C){const cfg=Object.assign({},M,{players:M.players});let G,err=null;
 try{G=I.newGame(cfg,4242)}catch(e){console.log(M.id,'ERROR al crear',e.stack);fails++;continue}
 const cnt=(o,t)=>G.bl.filter(e=>!e.dead&&e.owner===o&&e.type===t).length;
 const pre=G.players.map(p=>`${p.name}:edad${p.age} tc${cnt(p.i,'tc')} cast${cnt(p.i,'castle')} torres${cnt(p.i,'tower')}`).join(' | ');
 G.players[0].ai=true;G.ai[0]={tick:1,next:200,wave:8,attacking:false,passive:false};
 let evs={};try{for(let k=0;k<15*60*15;k++){I.update(1/15);for(const e of G.ev)evs[e.ev]=(evs[e.ev]||0)+1;G.ev.length=0;if(G.over)break}}catch(e){err=e.stack}
 const st=I.scnStatus().map(o=>`${o.ok?'✔':'·'} ${o.text} ${o.v}/${o.n}`).join('; ');
 console.log(`${M.id} ${M.title}: [${pre}]\n   → t=${(G.t/60).toFixed(1)}min fin=${G.over} cómo=${G.how} ganó=${G.winTeam} | ${st} | olas/msg: ${evs.scnmsg||0} objs:${evs.scnobj||0} ${err?'ERROR '+err:''}`);
 if(err)fails++}
// guardar y cargar conserva el estado del escenario
{const M=C[1];const G=I.newGame(Object.assign({},M),9);for(let k=0;k<200*15;k++)I.update(1/15);const s=I.serialize();const G2=I.deserialize(s);console.log('guardar/cargar: scnS',!!G2.scnS,'estado',JSON.stringify(I.scnStatus().map(o=>o.v)));}
console.log(fails?'FALLOS '+fails:'TODO OK');
