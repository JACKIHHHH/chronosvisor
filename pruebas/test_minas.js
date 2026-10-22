// Oro y piedra (metal) repartidos en sitios distintos del mapa
globalThis.window=globalThis;require(process.argv[2]||'../web/maps_data.js');require(process.argv[3]||'../web/game.js');const I=globalThis.Imperia,T=I.T;let fails=0;
for(const map of Object.keys(I.MAPS)){const G=I.newGame({map,size:'medium',nAI:1,diff:'easy',civ:'iberos'},7);
 const cl={gold:[],stone:[]};const seen=new Set();for(const r of G.rl){if(r.type!=='gold'&&r.type!=='stone'||seen.has(r.id))continue;const q=[r],c=[];seen.add(r.id);while(q.length){const a=q.pop();c.push(a);for(const b of G.rl)if(b.type===a.type&&!seen.has(b.id)&&Math.abs(b.tx-a.tx)<=1&&Math.abs(b.ty-a.ty)<=1){seen.add(b.id);q.push(b)}}cl[r.type].push([c.reduce((s,a)=>s+a.tx,0)/c.length,c.reduce((s,a)=>s+a.ty,0)/c.length])}
 let md=1e9;for(const g of cl.gold)for(const s of cl.stone)md=Math.min(md,Math.hypot(g[0]-s[0],g[1]-s[1]));
 const ok=cl.gold.length>=4&&cl.stone.length>=4&&md>=3;if(!ok)fails++;console.log((ok?'ok   ':'FALLO'),map.padEnd(14),'oro',cl.gold.length,'piedra',cl.stone.length,'dist. mín oro-piedra',md.toFixed(1))}
console.log(fails?'FALLOS '+fails:'TODO OK');
