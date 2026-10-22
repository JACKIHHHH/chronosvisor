// Patrulla para todos los tipos de unidad de ataque: tierra, distancia, asedio, aire, antiaérea y barcos
globalThis.window=globalThis;require(process.argv[2]||'../web/game.js');const I=globalThis.Imperia,T=I.T;let fails=0;
const tipos=Object.keys(I.U).filter(t=>I.U[t].atk>0&&t!=='villager');
for(const t of tipos){const nav=!!I.U[t].naval;const G=I.newGame({map:nav?'islas':'arabia',size:'small',nAI:1,diff:'easy',civ:'francos',startAge:I.U[t].age||0},5);G.ai[1].passive=true;
 const tc=G.bl.find(b=>b.owner===0&&b.type==='tc');let sx=tc.x+3*T,sy=tc.y+3*T,dx=12*T,dy=0;
 if(nav){let w=null;for(let r=3;r<40&&!w;r++)for(let y=-r;y<=r&&!w;y++)for(let x=-r;x<=r;x++){const X=tc.tx+x,Y=tc.ty+y;if(X<2||Y<2||X>I.MW-14||Y>=I.MH-2)continue;let ok=true;for(let k=0;k<=10;k++)if(G.ter[Y*I.MW+X+k]!==1){ok=false;break}if(ok){w=[X,Y];break}}if(!w){console.log(t,'sin agua');continue}sx=(w[0]+.5)*T;sy=(w[1]+.5)*T;dx=9*T}
 const u=I._dbg.mkUnit(t,0,sx,sy);const ok=I.exec(0,{c:'patrol',ids:[u.id],x:sx+dx,y:sy+dy});const xs=[];
 for(let i=0;i<80*15;i++){I.update(1/15);G.ev.length=0;if(i%20===0)xs.push(Math.round((u.x-sx)/T))}
 const turns=xs.filter((x,i)=>i>1&&(xs[i-1]-xs[i-2])*(x-xs[i-1])<0).length;const bien=ok&&turns>=(I.U[t].speed<40?1:2)&&u.o.t==='patrol';if(!bien)fails++;
 console.log((bien?'ok   ':'FALLO'),t.padEnd(12),'giros',turns,'orden',u.o.t,'max',Math.max(...xs))}
console.log(fails?'FALLOS '+fails:'TODO OK');
// ruta de 3 puntos con Mayús
{const G=I.newGame({map:'arabia',size:'small',nAI:1,diff:'easy',civ:'francos'},5);G.ai[1].passive=true;const tc=G.bl.find(b=>b.owner===0&&b.type==='tc');
 const sx=tc.x+3*T,sy=tc.y+3*T,u=I._dbg.mkUnit('knight',0,sx,sy);I.exec(0,{c:'patrol',ids:[u.id],x:sx+10*T,y:sy});I.exec(0,{c:'patrol',ids:[u.id],x:sx+10*T,y:sy+8*T,q:true});
 const seen=[0,0,0];for(let i=0;i<120*15;i++){I.update(1/15);G.ev.length=0;u.o.pts.forEach((p,k)=>{if(Math.hypot(u.x-p[0],u.y-p[1])<T)seen[k]++})}
 const r=u.o.pts.length===3&&seen.every(v=>v>0);console.log(r?'ok   ':'FALLO','ruta de 3 puntos',u.o.pts.length,seen.join(','));if(!r)console.log('FALLOS ruta')}
