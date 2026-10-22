#!/bin/zsh
cd "$(dirname "$0")"
cp web/index.html web/game.js web/art.js web/art_eras.js web/art_units.js web/chars_data.js web/chars.js web/maps_data.js web/nature_data.js web/nature.js web/terrain_data.js web/render3d.js web/audio.js web/net.js web/ui.js web/campaign.js web/conquest.js web/menu_bg.jpg build/Chronosvisor.app/Contents/Resources/web/
codesign --force --deep --sign - build/Chronosvisor.app 2>/dev/null
pkill -f build/Chronosvisor.app/Contents/MacOS/Chronosvisor; sleep 1
(nohup build/Chronosvisor.app/Contents/MacOS/Chronosvisor > build/log.txt 2>&1 &)
