#!/bin/zsh
# Captura en la app real de los vehículos de la edad 7 (tanque, lanzacohetes, artillería) junto al centro urbano
cd "$(dirname "$0")/.."
APP="${APP:-build/Chronosvisor.app/Contents/MacOS/Chronosvisor}"
SD="$HOME/Library/Application Support/Imperia"; rm -f "$SD/tq_done.json" "$SD/shot_tanques.json"
pkill -f "build/Chronosvisor.app/Contents/MacOS/Chronosvisor"; sleep 1
JS="setTimeout(function(){try{var W=function(k,d){window.webkit.messageHandlers.store.postMessage({id:9,op:'write',key:k,data:d})};
 __imperia.start({map:'arabia',size:'small',nAI:1,diff:'easy',civ:'francos',reveal:'all'});var G=__imperia.G,R=__imperia.R,I=Imperia,T=I.T;
 G.players[0].age=7;var tc=G.bl.find(function(b){return b.owner===0});var x=tc.x+T*4,y=tc.y+T*1;
 var D=I._dbg;[['knight',0,0],['knight',1.4,1.2],['ram',0,2.6],['mangonel',1.6,3.8],['knight',-1.4,1.4]].forEach(function(a){D.mkUnit(a[0],0,x+a[1]*T,y+a[2]*T)});
 setTimeout(function(){R.centerOn(x/T+.3,y/T+1.8);R.zoom(.4);for(var f=0;f<8;f++)R.render(0.016,G);
  W('shot_tanques',document.querySelector('canvas').toDataURL('image/jpeg',.85));console.log('QA tanques ok edad '+G.players[0].age);setTimeout(function(){W('tq_done','1')},500)},2500)}catch(e){console.log('FALLO '+e.stack)}},3000);"
(IMPERIA_WINDOWED=1 IMPERIA_EVAL="$JS" nohup "$APP" > build/tq.txt 2>&1 &)
for i in $(seq 1 30); do sleep 1; [ -f "$SD/tq_done.json" ] && break; done
pkill -f "build/Chronosvisor.app/Contents/MacOS/Chronosvisor"
grep -E "QA |FALLO|rror" build/tq.txt | grep -v deprecated | cut -c1-400
python3 -c "
import base64
s=open('$SD/shot_tanques.json').read();open('pruebas/shot_tanques.jpg','wb').write(base64.b64decode(s.split(',',1)[1]));print('ok tanques')"
