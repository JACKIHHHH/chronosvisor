// Aviación, antiaéreos y armadas: quién puede atacar a quién, combates y partidas IA en la Edad Mundial sin errores
globalThis.window=globalThis;require('../web/maps_data.js');require('../web/game.js');const I=globalThis.Imperia,T=I.T;let fails=0;const ok=(c,m)=>{if(!c){fails++;console.log('  ✗',m)}else console.log('  ✓',m)};
{const G=I.newGame({map:'arabia',size:'small',nAI:1,diff:'normal',civ:'iberos',startAge:5},11);const D=I._dbg;
 const tc0=G.bl.find(b=>b.owner===0&&b.type==='tc'),tc1=G.bl.find(b=>b.owner===1&&b.type==='tc');
 const mk=(t,o,dx,dy)=>D.mkUnit(t,o,(o?tc1:tc0).x+dx*T,(o?tc1:tc0).y+dy*T);
 const f=mk('fighter',0,4,0),inf=mk('militia',1,4,0),aa=mk('aagun',1,5,0),arc=mk('archer',1,6,0),kn=mk('knight',1,6,1);
 ok(!I.canHitT(kn,f),'un tanque no puede disparar a un avión');ok(I.canHitT(aa,f),'el antiaéreo sí');ok(I.canHitT(arc,f),'el ametrallador (edad 5) sí');
 ok(!I.canHitT(aa,inf),'el antiaéreo no dispara a tierra');
 const s=mk('sub',0,0,0),g=mk('galley',1,0,0);ok(!I.canHitT(inf,s),'la infantería no ataca submarinos');}
for(const [map,age] of[['islas',5],['islas',7],['arabia',6],['mediterraneo',5]]){const G=I.newGame({map,size:'small',nAI:1,diff:'hard',civ:'britanos',startAge:age},500+age);G.players[0].ai=true;G.ai[0]={tick:1,next:240,wave:9,attacking:false};
 let err=null,max={};try{for(let i=0;i<14*60*15;i++){I.update(1/15);G.ev.length=0;if(i%450===0)for(const t of['fighter','bomber','aagun','sub','battleship']){const n=G.ul.filter(e=>!e.dead&&e.type===t).length;max[t]=Math.max(max[t]||0,n)}if(G.over)break}}catch(e){err=e.stack}
 console.log(`${map} edad ${age}: t=${(G.t/60).toFixed(1)} fin=${G.over} máx ${JSON.stringify(max)} ${err?'ERROR '+err.split('\n').slice(0,4).join(' | '):''}`);if(err)fails++}
console.log(fails?'FALLOS '+fails:'TODO OK');
