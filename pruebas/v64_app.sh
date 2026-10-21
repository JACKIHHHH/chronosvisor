#!/bin/zsh
# 6.4 en la app real: misión 6 de la campaña (edad 5) con unidades únicas modernas de cada civilización, objetivos y captura
cd "$(dirname "$0")/.."
APP="${APP:-build/Chronosvisor.app/Contents/MacOS/Chronosvisor}"
SD="$HOME/Library/Application Support/Imperia"; rm -f "$SD/v64_done.json" "$SD/shot_v64a.json" "$SD/shot_v64b.json"
pkill -f "build/Chronosvisor.app/Contents/MacOS/Chronosvisor"; sleep 1
JS="setTimeout(function(){try{var W=function(k,d){window.webkit.messageHandlers.store.postMessage({id:9,op:'write',key:k,data:d})};var I=Imperia,T=I.T;
 console.log('QA campaña misiones '+(window.CHRONO_CAMPAIGN||[]).length+' botón '+!!document.querySelector('[data-go=camp]'));
 document.querySelector('[data-go=camp]').click();
 setTimeout(function(){console.log('QA pantalla campaña '+!document.getElementById('camp').hidden+' lista '+document.querySelectorAll('#campList .cm').length);
  playMissionTest();},800);
 function playMissionTest(){var m=CHRONO_CAMPAIGN[5];__imperia.start({map:m.map,size:m.size,diff:m.diff,startAge:m.startAge,reveal:'all',win:'scn',scn:m.id,players:m.players,civ:'iberos'});
  var G=__imperia.G,R=__imperia.R;console.log('QA misión '+G.cfg.scn+' edad '+G.players[0].age+' castillos enemigos '+G.bl.filter(function(b){return b.owner===2&&b.type==='castle'}).length);
  var tc=G.bl.find(function(b){return b.owner===0&&b.type==='tc'});var sp=G.ul.filter(function(e){return e.owner===0&&e.type==='villager'});var x=sp[0].x,y=sp[0].y+T*2;var civs=['iberos','francos','britanos','teutones','bizantinos'];
  civs.forEach(function(c,i){G.players[0].civ=c;var u=I._dbg.mkUnit(I.CIVS[c].uu,0,x+(i%3)*1.6*T,y+Math.floor(i/3)*1.8*T);console.log('QA única '+c+': '+I.uName(u.type,0)+' vida '+u.maxhp)});G.players[0].civ='iberos';
  setTimeout(function(){R.centerOn(x/T+1.5,y/T+1);R.zoom(.45);for(var f=0;f<8;f++)R.render(0.016,G);W('shot_v64a',document.getElementById('c3d').toDataURL('image/jpeg',.85));
   console.log('QA objetivos: '+document.getElementById('scnObj').innerText.replace(/\n/g,' | '));
   setTimeout(function(){W('v64_done','1')},600)},3000)}
 }catch(e){console.log('FALLO '+e.stack)}},3000);"
(IMPERIA_WINDOWED=1 IMPERIA_EVAL="$JS" nohup "$APP" > build/v64.txt 2>&1 &)
for i in $(seq 1 40); do sleep 1; [ -f "$SD/v64_done.json" ] && break; done
pkill -f "build/Chronosvisor.app/Contents/MacOS/Chronosvisor"
grep -E "QA |FALLO|rror" build/v64.txt | grep -v deprecated | cut -c1-300
python3 -c "
import base64
s=open('$SD/shot_v64a.json').read();open('pruebas/shot_v64a.jpg','wb').write(base64.b64decode(s.split(',',1)[1]));print('ok captura')"
