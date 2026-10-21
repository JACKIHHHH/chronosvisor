// Patrulla con todo tipo de unidades de ataque: infantería, caballería, asedio, avión, barco
globalThis.window=globalThis;require('../web/game.js');const I=globalThis.Imperia,T=I.T;
const G=I.newGame({map:'islas',size:'small',nAI:1,diff:'easy',civ:'iberos',startAge:6},5);G.ai[1].passive=true;
const v=G.ul.find(e=>e.owner===0&&e.type==='villager');let w=null;for(let y=0;y<I.MH&&!w;y++)for(let x=0;x<I.MW;x++)if(G.ter[y*I.MW+x]===1&&Math.hypot(x*T-v.x,y*T-v.y)<14*T){w=[x,y];break}
const out={};for(const t of['militia','knight','mangonel','fighter','bomber','aagun','galley','sub','battleship']){if(!I.U[t])continue;const nav=I.U[t].naval;
 const u=I._dbg.mkUnit(t,0,nav?(w[0]+.5)*T:v.x+T,nav?(w[1]+.5)*T:v.y+T);const ok=I.exec(0,{c:'patrol',ids:[u.id],x:u.x+3*T,y:u.y});let legs=0,l=u.o.leg;
 for(let i=0;i<15*40;i++){I.update(1/15);G.ev.length=0;if(u.o.leg!==l){legs++;l=u.o.leg}}out[t]=(ok?'ok ':'NO ')+u.o.t+' tramos '+legs}
console.log(out);
