// «Refugiar a todos»: las unidades de tierra entran en los edificios y al repetir salen y vuelven a sus tareas
globalThis.window=globalThis;require('../web/maps_data.js');require('../web/game.js');const I=globalThis.Imperia,T=I.T;let fails=0;const ok=(c,m)=>{if(!c)fails++;console.log(c?'  ✓':'  ✗',m)};
const G=I.newGame({map:'continental',size:'small',nAI:1,diff:'easy',civ:'iberos',startAge:3},8);G.ai[1].passive=true;
{const vs=G.ul.filter(u=>u.owner===0&&u.type==='villager');for(const v of vs){let best=null,bd=1e9;for(const r of G.rl){if(r.dead||r.type!=='tree')continue;const d=Math.hypot(r.x-v.x,r.y-v.y);if(d<bd){bd=d;best=r}}if(best)I.exec(0,{c:'right',ids:[v.id],x:best.x,y:best.y,tgt:best.id})}}
for(let i=0;i<30*15;i++){I.update(1/15);G.ev.length=0}
const land=()=>G.ul.filter(u=>!u.dead&&u.owner===0&&!I.U[u.type].naval&&!I.U[u.type].air);const n0=land().length;
const work0=new Map(land().map(u=>[u.id,u.o.t]));
ok(I.exec(0,{c:'shelter'}),'la orden se acepta');for(let i=0;i<40*15;i++){I.update(1/15);G.ev.length=0}
const inside=land().filter(u=>u.gar).length;console.log('  unidades',n0,'refugiadas',inside,'casas usadas',G.bl.filter(b=>b.owner===0&&b.type==='house'&&b.gar.length).length);
ok(inside>=n0*.85,'al menos el 85 % de las unidades está a cubierto');ok(G.players[0].shel,'estado de refugio activo');
I.exec(0,{c:'shelter'});for(let i=0;i<20*15;i++){I.update(1/15);G.ev.length=0}
ok(land().every(u=>!u.gar),'al repetir salen todas');const back=land().filter(u=>work0.get(u.id)==='gather'&&u.o.t==='gather').length,was=[...work0.values()].filter(t=>t==='gather').length;
ok(back>=was*.9,'los recolectores vuelven a recolectar ('+back+'/'+was+')');
console.log(fails?'FALLOS '+fails:'TODO OK');
