// Conquista del mundo: reglas (adyacencias simétricas, objetivos, defensa, fin) y cada territorio crea una partida jugable
globalThis.window=globalThis;require('../web/maps_data.js');require('../web/conquest.js');require('../web/game.js');const Q=globalThis.CHRONO_CONQUEST,I=globalThis.Imperia;let bad=0;const ok=(c,m)=>{console.log((c?'  ✓ ':'  ✗ ')+m);if(!c)bad++};
ok(Q.TER.length===15&&Q.TER.every(t=>Q.adj[t.id].length>0&&Q.adj[t.id].every(n=>Q.adj[n].includes(t.id))),'15 territorios con vecinos simétricos');
ok(Q.TER.every(t=>I.MAPS[t.map]),'todos los mapas existen');
for(const civ of Object.keys(I.CIVS)){let s=Q.newState(civ,'normal',0),r=1;const rn=()=>{r=(r*16807)%2147483647;return r/2147483647};let n=0;
 while(!s.over&&n<400){n++;if(s.pending)Q.resolve(s,s.pending,rn()<.7);else{const t=Q.targets(s);Q.resolve(s,{kind:'atk',to:t[0],from:Q.attackerFrom(s,t[0],s.civ),civ:s.own[t[0]]},rn()<.7)}if(!s.over)Q.aiTurn(s,rn)}
 ok(!!s.over,civ+': la conquista termina ('+s.over+') en '+s.turn+' turnos, época final '+Q.era(s))}
for(const t of Q.TER){let err=null;try{const G=I.newGame({map:t.map,size:'medium',diff:'normal',startAge:4,win:'standard',civ:'iberos',players:[{civ:'iberos',team:0,ai:false,name:'Tú'},{civ:t.civ==='iberos'?'francos':t.civ,team:1,ai:true,name:'X'}],conq:{kind:'atk',to:t.id}},3);for(let k=0;k<15*60;k++)I.update(1/15)}catch(e){err=e.message}ok(!err,t.name+' ('+t.map+') se juega 1 min'+(err?' '+err:''))}
console.log(bad?'FALLOS '+bad:'TODO OK')
