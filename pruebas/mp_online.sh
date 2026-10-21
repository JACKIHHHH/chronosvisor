#!/bin/zsh
# Prueba real del multijugador por Internet (con CORTE=1: desincroniza al cliente y le corta la conexión para comprobar la resincronización y la reconexión): servidor local (wrangler dev) y dos instancias de la app (anfitrión y cliente) conectadas por código de sala
cd "$(dirname "$0")/.."
SRV="${SRV:-ws://127.0.0.1:8787}"
SD="$HOME/Library/Application Support/Imperia"; rm -f "$SD/online_code.json"
pkill -f "build/Chronosvisor.app/Contents/MacOS/Chronosvisor"; sleep 1
if [ "$SRV" = "ws://127.0.0.1:8787" ]; then pkill -f "wrangler dev"; (cd online && nohup npx wrangler dev --port 8787 --ip 127.0.0.1 > ../build/wdev.txt 2>&1 &); for i in $(seq 1 30); do sleep 1; curl -s http://127.0.0.1:8787/ >/dev/null && break; done; fi
APPB=build/Chronosvisor.app/Contents/MacOS/Chronosvisor
LOGJS='setInterval(function(){var G=window.__imperia&&__imperia.G,N=ImperiaNet;console.log("ESTADO modo="+N.mode+" rol="+N.role+" código="+N.code+" enJuego="+N.inGame+" turno="+N.execTurn+" t="+(G?G.t.toFixed(1):0)+" edad="+(G&&N.inGame?G.players[G.me].age:"-")+" hash="+(G&&N.inGame?Imperia.hash():0)+" desync="+N.desync+" rtt="+N.rtt+" cola="+N.q.length+" espera="+(N.hostWait||0).toFixed(1)+" pend="+N.pending.length)},3000);'
PRE='ImperiaNet.server="'$SRV'";ImperiaNet.cfgOK=true;'
HJS=$LOGJS$PRE'setTimeout(function(){ImperiaNet.hostOnline("Ana",true)},500);var _cw=setInterval(function(){if(ImperiaNet.code&&ImperiaNet.code.length===5){window.webkit.messageHandlers.store.postMessage({id:9,op:"write",key:"online_code",data:ImperiaNet.code});clearInterval(_cw)}},300);
setTimeout(function(){ImperiaNet.setCfg({map:"arabia",size:"small",startAge:"5"});console.log("SALA "+JSON.stringify(ImperiaNet.L.slots.map(function(s){return s.k+":"+(s.name||"")})))},14000);setTimeout(function(){console.log("START "+ImperiaNet.start())},16000);'
(IMPERIA_WINDOWED=1 IMPERIA_EVAL="$HJS" nohup $APPB > build/on_host.txt 2>&1 &)
for i in $(seq 1 20); do sleep 1; [ -f "$SD/online_code.json" ] && break; done
CODE=$(cat "$SD/online_code.json"); echo "código de sala: $CODE"
LIST=$(curl -s ${SRV/ws/http}/rooms); echo "lista pública: $LIST"
if [ "$SPEC" = 1 ]; then CLI=$LOGJS$PRE'setTimeout(function(){ImperiaNet.joinOnline("'$CODE'","Mirón",true)},22000);setInterval(function(){var G=__imperia.G;if(G&&G.spectate)console.log("ESPECTADOR t="+G.t.toFixed(1)+" yo="+G.me+" barra="+!document.getElementById("replayBar").hidden)},5000);'; else
CLI=$LOGJS$PRE'setTimeout(function(){ImperiaNet.joinOnline("'$CODE'","Luis")},1500);setTimeout(function(){var G=__imperia.G,v=G.ul.find(function(e){return e.owner===G.me&&e.type==="villager"});__imperia.cmd({c:"move",ids:[v.id],x:v.x+90,y:v.y+20});console.log("ORDEN enviada "+v.id)},26000);'
fi
[ "$CORTE" = 1 ] && CLI=$CLI'setTimeout(function(){var G=__imperia.G,v=G.ul.find(function(e){return e.owner===0});v.hp=1;v.x+=50;console.log("CORRUPTO")},32000);setTimeout(function(){console.log("CORTE");ImperiaNet._dropWS()},48000);'
(IMPERIA_WINDOWED=1 IMPERIA_EVAL="$CLI" nohup $APPB > build/on_cli.txt 2>&1 &)
sleep ${1:-40}
echo "--- ANFITRIÓN"; grep -E "ESTADO|SALA|START|ERROR|error|uncaught" build/on_host.txt | tail -5
echo "--- CLIENTE"; grep -E "ESTADO|ORDEN|ERROR|error|uncaught" build/on_cli.txt | tail -5
pkill -f "build/Chronosvisor.app/Contents/MacOS/Chronosvisor"
