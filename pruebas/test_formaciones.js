// Formaciones: cada una coloca a las tropas con su forma y llegan juntas
globalThis.window=globalThis;require('../web/game.js');const I=globalThis.Imperia,T=I.T;let fails=0;
for(const f of Object.keys(I.FORMS)){const G=I.newGame({map:'arabia',size:'small',nAI:1,diff:'easy',civ:'francos',startAge:3},4);G.ai[1].passive=true;
 const tc=G.bl.find(b=>b.owner===0&&b.type==='tc');const us=[];for(let k=0;k<12;k++)us.push(I._dbg.mkUnit(k<6?'militia':k<9?'archer':'knight',0,tc.x+5*T+(k%4)*T*.5,tc.y+(k>>2)*T*.5));
 const ids=us.map(u=>u.id);I.exec(0,{c:'form',ids,f});for(let i=0;i<90;i++)I.update(1/15);
 const tx=tc.x+5*T,ty=tc.y+14*T;I.exec(0,{c:'right',ids,x:tx,y:ty});for(let i=0;i<60*15;i++)I.update(1/15);
 // forma resultante: anchura lateral (x) y profundidad (y), y dispersión
 const xs=us.map(u=>u.x/T),ys=us.map(u=>u.y/T);const w=Math.max(...xs)-Math.min(...xs),d=Math.max(...ys)-Math.min(...ys);const far=us.filter(u=>Math.hypot(u.x-tx,u.y-ty)>6*T).length;
 console.log(f.padEnd(7),'ancho',w.toFixed(1),'fondo',d.toFixed(1),'lejos',far,'fm',[...new Set(us.map(u=>u.fm))].join());if(far>1||us.some(u=>u.fm!==f))fails++}
console.log(fails?'FALLOS '+fails:'TODO OK');
