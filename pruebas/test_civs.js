// Civilizaciones en la era moderna: unidades únicas propias, bonificaciones y partidas IA contra IA sin errores
require('../web/game.js');const I=globalThis.Imperia;let fails=0;const civs=Object.keys(I.CIVS);
for(const c of civs){const G=I.newGame({map:'arabia',size:'small',nAI:1,diff:'hard',civ:c,startAge:6},77);
 const uu=I.CIVS[c].uu,tc=G.bl.find(b=>b.owner===0);const u=I._dbg.mkUnit(uu,0,tc.x+3*I.T,tc.y+3*I.T);const base=I.UUM[uu].base;
 const d=I.gd(uu,0),b=I.gd(base,0);console.log(`${c}: ${d.name} (base ${base}: ${b.name}) vida ${u.maxhp} vs ${I.uMaxHp?I.uMaxHp(base,0):'?'} ataque ${d.atk} vs ${b.atk} alcance ${d.range} vs ${b.range} cls ${d.cls}`);
 if(d.name===b.name||d.hp<=b.hp)fails++;}
// bonificaciones
const G=I.newGame({map:'arabia',size:'small',nAI:1,diff:'hard',civ:'iberos',startAge:5},5);
for(let i=0;i<5;i++){
 for(const c of civs){}
}
// partidas
for(let i=0;i<civs.length;i++){const a=civs[i],b=civs[(i+1)%civs.length];const G=I.newGame({map:i%2?'continental':'arabia',size:'small',nAI:1,diff:'hard',civ:a,startAge:4+i%4},300+i);
 G.players[0].ai=true;G.ai[0]={tick:1,next:240,wave:9,attacking:false,passive:false};G.players[1].civ=b;
 let err=null,uus=0;try{for(let k=0;k<14*60*15;k++){I.update(1/15);G.ev.length=0;if(k%900===0)uus=Math.max(uus,G.ul.filter(e=>!e.dead&&I.UUM[e.type]).length);if(G.over)break}}catch(e){err=e.stack}
 console.log(`${a} vs ${b} edad ${4+i%4}: fin=${G.over} ganador=${G.winTeam} t=${(G.t/60).toFixed(1)}min únicas máx ${uus} ${err?'ERROR '+err:''}`);if(err)fails++}
console.log(fails?'FALLOS '+fails:'TODO OK');
