// Granjeros fijos: vuelven a su granja, la resiembran y esperan si no hay madera
globalThis.window=globalThis;require('../web/maps_data.js');require('../web/game.js');const I=globalThis.Imperia,T=I.T;let fails=0;const ok=(c,m)=>{if(!c)fails++;console.log(c?'  ✓':'  ✗',m)};
const G=I.newGame({map:'continental',size:'small',nAI:1,diff:'easy',civ:'iberos',startAge:2},5);G.ai[1].passive=true;const p=G.players[0];
const farms=G.bl.filter(b=>b.owner===0&&b.type==='farm');const vs=G.ul.filter(u=>u.owner===0&&u.type==='villager').slice(0,farms.length);
const spots=farms.map(f=>[f.tx,f.ty]);vs.forEach((v,k)=>I.exec(0,{c:'right',ids:[v.id],x:farms[k].x,y:farms[k].y,tgt:farms[k].id}));
// sin madera: al agotarse, esperan en su sitio
p.res.wood=0;for(const f of farms)f.amt=30;
for(let i=0;i<3*60*15;i++){I.update(1/15);G.ev.length=0;p.res.wood=0}
ok(vs.every((v,k)=>Math.hypot(v.x/T-(spots[k][0]+1.5),v.y/T-(spots[k][1]+1.5))<4),'sin madera, cada granjero espera junto a su granja');
p.res.wood=1000;for(let i=0;i<3*60*15;i++){I.update(1/15);G.ev.length=0}
ok(vs.every((v,k)=>{const f=G.ents.get(v.o.id);return v.o.t==='gather'&&f&&f.type==='farm'&&f.tx===spots[k][0]&&f.ty===spots[k][1]}),'con madera, resiembran su misma granja y siguen en ella');
// campana: vuelven a su granja
I.exec(0,{c:'bell'});for(let i=0;i<20*15;i++){I.update(1/15);G.ev.length=0}I.exec(0,{c:'bell'});for(let i=0;i<60*15;i++){I.update(1/15);G.ev.length=0}
ok(vs.every((v,k)=>{const f=G.ents.get(v.o.id);return v.o.t==='gather'&&f&&f.tx===spots[k][0]}),'tras la campana vuelven a su granja');
// una orden del jugador los libera
I.exec(0,{c:'stop',ids:[vs[0].id]});ok(!vs[0].farmAt,'una orden del jugador libera al granjero');
console.log(fails?'FALLOS '+fails:'TODO OK');
