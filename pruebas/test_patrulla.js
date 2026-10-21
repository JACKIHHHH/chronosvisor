// Patrulla: las tropas van y vienen entre dos puntos y atacan a lo que encuentran
require('../web/game.js');const I=globalThis.Imperia,T=I.T;let fails=0;
const G=I.newGame({map:'arabia',size:'small',nAI:1,diff:'easy',civ:'francos'},5);G.ai[1].passive=true;
const tc=G.bl.find(b=>b.owner===0&&b.type==='tc');const ks=[0,1,2].map(i=>I._dbg.mkUnit('knight',0,tc.x+3*T+i*T,tc.y+3*T));
const ok=I.exec(0,{c:'patrol',ids:ks.map(k=>k.id),x:tc.x+15*T,y:tc.y+3*T});const xs=[];
for(let i=0;i<60*15;i++){I.update(1/15);G.ev.length=0;if(i%30===0)xs.push(Math.round((ks[0].x-tc.x)/T))}
const turns=xs.filter((x,i)=>i>1&&(xs[i-1]-xs[i-2])*(x-xs[i-1])<0).length;console.log('orden aceptada',ok,'posiciones',xs.join(' '),'giros',turns,'orden',ks[0].o.t);
if(!ok||turns<2)fails++;console.log(fails?'FALLO':'TODO OK');
