// Atascos: 30 aldeanos recogiendo en el mismo bosque y la misma mina (caminos compartidos); mide recursos, aldeanos atascados y quietos
globalThis.window=globalThis;require('../web/maps_data.js');require(process.argv[2]||'../web/game.js');const I=globalThis.Imperia,T=I.T;
let tot={wood:0,gold:0,stuck:0,still:0};
for(const [map,sd] of[['continental',3],['arabia',8],['bosque',5],['iberia',11]]){const G=I.newGame({map,size:'small',nAI:1,diff:'easy',civ:'iberos',startAge:2},sd);G.ai[1].passive=true;
 const tc=G.bl.find(b=>b.owner===0&&b.type==='tc');const vs=G.ul.filter(e=>e.owner===0&&e.type==='villager');for(let k=vs.length;k<30;k++)vs.push(I._dbg.mkUnit('villager',0,tc.x+(k%5-2)*T*.4,tc.y+3*T));
 const near=t=>{let b=null,bd=1e9;for(const r of G.rl){if(r.dead||r.type!==t)continue;const d=Math.hypot(r.x-tc.x,r.y-tc.y);if(d<bd){bd=d;b=r}}return b};
 const w=near('tree'),g=near('gold');vs.forEach((v,i)=>{const r=i%3?w:g;I.exec(0,{c:'right',ids:[v.id],x:r.x,y:r.y,tgt:r.id})});
 const p=G.players[0],w0=p.stats.gathered;let still=0,jit=0,side=0;const last=new Map(),mv=new Map();
 for(let i=0;i<5*60*15;i++){const pre=vs.map(v=>[v.x,v.y]);I.update(1/15);G.ev.length=0;vs.forEach((v,k)=>{if(v.dead||!v.walk)return;const dx=v.x-pre[k][0],dy=v.y-pre[k][1],d=Math.hypot(dx,dy);if(d<.3)return;const m=mv.get(v.id)||[];const dot=(a,b)=>(a[0]*b[0]+a[1]*b[1])/(Math.hypot(a[0],a[1])*Math.hypot(b[0],b[1])||1);if(m.length>=2&&dot(m[1],[dx,dy])<-.2&&dot(m[0],m[1])<-.2)jit++;mv.set(v.id,[m[1]||[dx,dy],[dx,dy]]);const hd=[Math.cos(v.dir),Math.sin(v.dir)];if(Math.abs(hd[0]*dy-hd[1]*dx)/d>.7)side++});if(i%15===0)for(const v of vs){if(v.dead)continue;const l=last.get(v.id);if(l&&Math.hypot(l[0]-v.x,l[1]-v.y)<2&&!v.work&&v.o.t!=='idle')still++;last.set(v.id,[v.x,v.y])}}
 const stuck=vs.filter(v=>v.stuckT).length,idle=vs.filter(v=>v.o.t==='idle').length;
 console.log(map,'recogido',Math.round(p.stats.gathered-w0),'atascados',stuck,'ociosos',idle,'quietos',still,'tirones',jit,'deslizamientos laterales',side);tot.jit=(tot.jit||0)+jit;tot.side=(tot.side||0)+side;tot.wood+=p.stats.gathered-w0;tot.stuck+=stuck;tot.still+=still}
console.log('TOTAL recogido',Math.round(tot.wood),'atascados',tot.stuck,'quietos',tot.still,'tirones',tot.jit,'laterales',tot.side);
