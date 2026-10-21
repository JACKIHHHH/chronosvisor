// Chronosvisor online: repetidor (relay) de partidas por Internet en Cloudflare Workers + Durable Objects.
// Cada sala es un Durable Object que reenvía los mensajes entre el anfitrión (id 0) y los invitados (id 1..n),
// con el mismo formato de eventos que la red local nativa (hosted / open / close / msg). El juego sigue siendo
// lockstep determinista: el servidor no simula nada, solo retransmite.
const CODE_ABC='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const MAXP=8,MAXMSG=65536,VER=1;
const json=(o,s=200)=>new Response(JSON.stringify(o),{status:s,headers:{'content-type':'application/json','access-control-allow-origin':'*','cache-control':'no-store'}});
const clean=s=>String(s||'').replace(/[\u0000-\u001f<>]/g,'').trim().slice(0,24);
function newCode(){let c='';const b=crypto.getRandomValues(new Uint8Array(5));for(const x of b)c+=CODE_ABC[x%CODE_ABC.length];return c}

export default{
 async fetch(req,env){const url=new URL(req.url),p=url.pathname.replace(/\/+$/,'');
  if(req.method==='OPTIONS')return new Response(null,{headers:{'access-control-allow-origin':'*','access-control-allow-methods':'GET','access-control-allow-headers':'*'}});
  if(p===''||p==='/')return json({ok:true,servicio:'Chronosvisor online',v:VER});
  if(p==='/rooms'){const lob=env.LOBBY.get(env.LOBBY.idFromName('lobby'));return lob.fetch('https://lobby/list')}
  const ws=req.headers.get('Upgrade')==='websocket';
  if(p==='/host'){if(!ws)return json({error:'Se necesita WebSocket'},426);
   // código único: se reserva en el registro antes de crear la sala
   const lob=env.LOBBY.get(env.LOBBY.idFromName('lobby'));let code=null;
   for(let i=0;i<6&&!code;i++){const c=newCode();const r=await lob.fetch('https://lobby/reserve?code='+c);if(r.ok)code=c}
   if(!code)return json({error:'No se pudo crear la sala'},503);
   const room=env.ROOM.get(env.ROOM.idFromName(code));const u=new URL('https://room/host');u.searchParams.set('code',code);for(const k of['name','pub'])u.searchParams.set(k,url.searchParams.get(k)||'');
   return room.fetch(new Request(u,req))}
  const m=/^\/join\/([A-Za-z0-9]{5})$/.exec(p);
  if(m){if(!ws)return json({error:'Se necesita WebSocket'},426);const room=env.ROOM.get(env.ROOM.idFromName(m[1].toUpperCase()));const u=new URL('https://room/join');u.searchParams.set('name',url.searchParams.get('name')||'');return room.fetch(new Request(u,req))}
  return json({error:'No encontrado'},404)}};

// registro de salas abiertas (para la lista de partidas públicas y para no repetir códigos)
export class Lobby{
 constructor(state){this.state=state;this.rooms=null}
 async load(){if(!this.rooms)this.rooms=(await this.state.storage.get('rooms'))||{};const now=Date.now();for(const c in this.rooms)if(now-this.rooms[c].t>3*3600e3)delete this.rooms[c];return this.rooms}
 async fetch(req){const url=new URL(req.url),R=await this.load(),q=url.searchParams;
  if(url.pathname==='/reserve'){const c=q.get('code');if(R[c])return new Response('ocupado',{status:409});R[c]={t:Date.now(),open:false};await this.state.storage.put('rooms',R);return new Response('ok')}
  if(url.pathname==='/update'){const c=q.get('code');if(!R[c])R[c]={t:Date.now()};Object.assign(R[c],{t:Date.now(),name:clean(q.get('name')),n:+q.get('n')||1,max:+q.get('max')||4,open:q.get('open')==='1',pub:q.get('pub')==='1'});await this.state.storage.put('rooms',R);return new Response('ok')}
  if(url.pathname==='/remove'){delete R[q.get('code')];await this.state.storage.put('rooms',R);return new Response('ok')}
  if(url.pathname==='/list'){const list=Object.entries(R).filter(([c,r])=>r.open&&r.pub).map(([code,r])=>({code,name:r.name,n:r.n,max:r.max})).slice(0,50);return json({rooms:list})}
  return new Response('?',{status:404})}}

// una sala: anfitrión id 0, invitados 1..n. Usa la API de WebSockets con hibernación.
export class Room{
 constructor(state,env){this.state=state;this.env=env;this.meta=null}
 async getMeta(){if(!this.meta)this.meta=(await this.state.storage.get('meta'))||null;return this.meta}
 async saveMeta(){await this.state.storage.put('meta',this.meta)}
 sockets(){return this.state.getWebSockets()}
 byId(id){for(const w of this.sockets()){const a=w.deserializeAttachment();if(a&&a.id===id)return w}return null}
 send(w,o){try{w.send(JSON.stringify(o))}catch(e){}}
 async report(){const m=this.meta;if(!m)return;const lob=this.env.LOBBY.get(this.env.LOBBY.idFromName('lobby'));const n=this.sockets().length;
  const u=new URL('https://lobby/update');u.searchParams.set('code',m.code);u.searchParams.set('name',m.name);u.searchParams.set('n',n);u.searchParams.set('open',m.open&&n<MAXP?'1':'0');u.searchParams.set('pub',m.pub?'1':'0');await lob.fetch(u)}
 async close(why){const m=await this.getMeta();for(const w of this.sockets()){const a=w.deserializeAttachment();if(a&&a.id!==0)this.send(w,{type:'close',id:0,why});try{w.close(1000,why||'fin')}catch(e){}}
  if(m){const lob=this.env.LOBBY.get(this.env.LOBBY.idFromName('lobby'));await lob.fetch('https://lobby/remove?code='+m.code)}this.meta=null;await this.state.storage.deleteAll()}
 async fetch(req){const url=new URL(req.url),q=url.searchParams;const pair=new WebSocketPair(),[cl,sv]=Object.values(pair);
  if(url.pathname==='/host'){const old=await this.getMeta();if(old&&this.byId(0))return new Response('sala ocupada',{status:409});
   this.meta={code:q.get('code'),name:clean(q.get('name'))||'Partida',pub:q.get('pub')==='1',open:true,next:1,t:Date.now()};await this.saveMeta();
   this.state.acceptWebSocket(sv);sv.serializeAttachment({id:0,name:this.meta.name});this.send(sv,{type:'hosted',code:this.meta.code,online:true,v:VER});await this.report();
   return new Response(null,{status:101,webSocket:cl})}
  if(url.pathname==='/join'){const m=await this.getMeta();const host=this.byId(0);
   if(!m||!host){this.state.acceptWebSocket(sv);sv.serializeAttachment({id:-1});this.send(sv,{type:'error',msg:'No existe ninguna sala con ese código'});sv.close(4004,'sin sala');return new Response(null,{status:101,webSocket:cl})}
   if(!m.open||this.sockets().length>=MAXP){this.state.acceptWebSocket(sv);sv.serializeAttachment({id:-1});this.send(sv,{type:'error',msg:m.open?'La sala está llena':'La partida ya ha empezado'});sv.close(4003,'cerrada');return new Response(null,{status:101,webSocket:cl})}
   const id=m.next++;await this.saveMeta();const name=clean(q.get('name'))||'Jugador';
   this.state.acceptWebSocket(sv);sv.serializeAttachment({id,name});
   this.send(sv,{type:'open',id:0,addr:m.name});this.send(host,{type:'open',id,addr:name});await this.report();
   return new Response(null,{status:101,webSocket:cl})}
  return new Response('?',{status:404})}
 async webSocketMessage(w,raw){const a=w.deserializeAttachment();if(!a||a.id<0)return;if(typeof raw!=='string'||raw.length>MAXMSG)return;let m;try{m=JSON.parse(raw)}catch(e){return}
  if(a.id===0){// anfitrión
   if(m.op==='send'){const t=this.byId(m.id|0);if(t)this.send(t,{type:'msg',id:0,data:String(m.data)})}
   else if(m.op==='broadcast'){const out=JSON.stringify({type:'msg',id:0,data:String(m.data)});for(const t of this.sockets()){const b=t.deserializeAttachment();if(b&&b.id>0)try{t.send(out)}catch(e){}}}
   else if(m.op==='kick'){const t=this.byId(m.id|0);if(t){try{t.close(4001,'expulsado')}catch(e){}this.send(w,{type:'close',id:m.id|0})}}
   else if(m.op==='state'){const me=await this.getMeta();if(me){me.open=!!m.open;if(m.name)me.name=clean(m.name);await this.saveMeta();await this.report()}}
   else if(m.op==='ping')this.send(w,{type:'pong',t:m.t})}
  else{// invitado → anfitrión
   if(m.op==='send'){const h=this.byId(0);if(h)this.send(h,{type:'msg',id:a.id,data:String(m.data)})}
   else if(m.op==='ping')this.send(w,{type:'pong',t:m.t})}}
 async webSocketClose(w,code,reason){const a=w.deserializeAttachment();if(!a||a.id<0)return;
  if(a.id===0){await this.close('El anfitrión ha cerrado la partida')}
  else{const h=this.byId(0);if(h)this.send(h,{type:'close',id:a.id});await this.report()}}
 async webSocketError(w){await this.webSocketClose(w,1011,'error')}}
