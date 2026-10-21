// Paso estrecho: muralla con un hueco de 1 casilla entre el almacén y el bosque; 20 aldeanos van y vienen por él
globalThis.window=globalThis;require(process.argv[2]||'../web/game.js');const I=globalThis.Imperia,T=I.T;let tot=0,tstill=0,tosc=0;
for(const sd of[1,2,3]){const G=I.newGame({map:'continental',size:'small',nAI:1,diff:'easy',civ:'iberos',startAge:2},sd);G.ai[1].passive=true;
 const tc=G.bl.find(b=>b.owner===0&&b.type==='tc');let tree=null,bd=1e9;for(const r of G.rl){if(r.dead||r.type!=='tree')continue;const d=Math.hypot(r.x-tc.x,r.y-tc.y);if(d<bd&&d>5*T){bd=d;tree=r}}
 // muro perpendicular a la línea centro-árbol, a medio camino, con un hueco
 const mx=((tc.x+tree.x)/2/T)|0,my=((tc.y+tree.y)/2/T)|0,dx=tree.x-tc.x,dy=tree.y-tc.y,horiz=Math.abs(dx)<Math.abs(dy);
 for(let k=-8;k<=8;k++){if(k===0)continue;const x=horiz?mx+k:mx,y=horiz?my:my+k;if(I.canPlace('wall',x,y,0))I._dbg.mkBld('wall',0,x,y,true)}
 const vs=[];for(let k=0;k<20;k++){let x,y,t=0;do{x=tc.x+(Math.random()*9-4.5)*T;y=tc.y+(Math.random()*9-4.5)*T;t++}while(t<200&&(G.block[I.idx((x/T)|0,(y/T)|0)]||G.ter[I.idx((x/T)|0,(y/T)|0)]!==0));vs.push(I._dbg.mkUnit('villager',0,x,y))}
 I.exec(0,{c:'right',ids:vs.map(v=>v.id),x:tree.x,y:tree.y,tgt:tree.id});
 const p=G.players[0],g0=p.stats.gathered;let still=0,osc=0;const last=new Map(),mv=new Map();
 for(let i=0;i<4*60*15;i++){const pre=vs.map(v=>[v.x,v.y]);I.update(1/15);G.ev.length=0;
  vs.forEach((v,k)=>{if(v.dead)return;const dx=v.x-pre[k][0],dy=v.y-pre[k][1],d=Math.hypot(dx,dy);if(!v.work&&v.o.t!=='idle'&&d<.05)still++;if(d<.3)return;const m=mv.get(v.id)||[];const dot=(a,b)=>(a[0]*b[0]+a[1]*b[1])/(Math.hypot(a[0],a[1])*Math.hypot(b[0],b[1])||1);if(m.length>=2&&dot(m[1],[dx,dy])<-.2&&dot(m[0],m[1])<-.2)osc++;mv.set(v.id,[m[1]||[dx,dy],[dx,dy]])})}
 console.log('semilla',sd,'recogido',Math.round(p.stats.gathered-g0),'ticks quietos sin trabajar',still,'oscilaciones',osc,'ociosos',vs.filter(v=>v.o.t==='idle').length);tot+=p.stats.gathered-g0;tstill+=still;tosc+=osc}
console.log('TOTAL',Math.round(tot),'quietos',tstill,'oscilaciones',tosc);
