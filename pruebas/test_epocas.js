// Empezar en cada época: la aldea inicial es coherente y dos IA juegan 12 minutos sin excepciones ni bloqueos
globalThis.window=globalThis;require('../web/maps_data.js');
require('../web/game.js');const I=globalThis.Imperia;let fails=0;
for(let a=0;a<=8;a++){for(const map of['continental','europa','iberia']){
 const G=I.newGame({map,size:'small',nAI:1,diff:'hard',civ:'iberos',startAge:a},1000+a);
 G.players[0].ai=true;G.ai[0]={tick:1,next:300,wave:9,attacking:false,passive:false};
 const cnt=(o,k)=>G.list.filter(e=>!e.dead&&e.owner===o&&(e.type===k)).length;
 const sum=o=>`edad ${G.players[o].age} ald ${cnt(o,'villager')} casas ${cnt(o,'house')} cuart ${cnt(o,'barracks')} granjas ${cnt(o,'farm')} edif ${G.bl.filter(e=>!e.dead&&e.owner===o).length} ejército ${G.ul.filter(e=>!e.dead&&e.owner===o&&e.type!=='villager').length}`;
 const s0=sum(0)+' | '+sum(1);let err=null;const t0=Date.now();
 try{for(let i=0;i<12*60*15;i++){I.update(1/15);G.ev.length=0;if(G.over)break}}catch(e){err=e.stack}
 for(const o of[0,1])if(G.players[o].age<a){err='la edad bajó';}
 const pop=o=>G.players[o].pop;
 console.log(`época ${a} ${map}: inicio [${s0}] → 12 min: pob ${pop(0)}/${pop(1)} edades ${G.players[0].age}/${G.players[1].age} fin=${G.over} ${((Date.now()-t0)/1000).toFixed(1)}s ${err?'ERROR '+err:''}`);
 if(err)fails++;
 if(G.players[0].res.food<0||G.players[0].res.wood<0){console.log('recursos negativos');fails++}}}
console.log(fails?'FALLOS '+fails:'TODO OK');process.exit(fails?1:0);
