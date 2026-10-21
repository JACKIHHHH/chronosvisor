// Chronosvisor — campaña «Crónicas del Chronosvisor»: nueve misiones, una por edad.
// Solo datos: el motor de escenarios está en game.js (scnInit / scnTick) y la interfaz en ui.js.
// objetivos: age · units · build · trained · kill · destroy · eliminate · survive · gather · wonder · relics
// derrota:   time (límite en s) · lost (perder todos los edificios de un tipo)
// sucesos:   {t|every,from, msg, say, res, wave:{owner,units,grow,alert}}
// setup:     por jugador: blds [tipo,n,rmin,rmax,haciaElEnemigo(0..1)], units [tipo,n], res, passive
(function(root){'use strict';
const C=[
{id:'m1',title:'El despertar de Iberia',year:'Siglo V',map:'iberia',size:'small',diff:'easy',startAge:0,reveal:'normal',
 players:[{civ:'iberos',team:0,ai:false,name:'Tú'},{civ:'francos',team:1,ai:true,name:'Reino franco'}],
 brief:['El Chronosvisor se enciende por primera vez. La imagen tiembla y aparece la península ibérica tras la caída de Roma.',
  'Un pequeño poblado necesita crecer. Reúne comida y madera, levanta un cuartel y lleva a tu pueblo a la Edad Feudal antes de que los francos se fijen en vosotros.'],
 objectives:[{k:'units',type:'villager',n:12,text:'Ten 12 aldeanos'},{k:'build',type:'barracks',n:1,text:'Construye un cuartel'},{k:'age',n:1,text:'Avanza a la Edad Feudal'}],
 lose:[{k:'lost',type:'tc'}],
 setup:[{owner:1,passive:true}],
 events:[{t:4,msg:'Selecciona tu centro urbano y entrena aldeanos. Envíalos a las bayas, a los árboles y al oro.',say:true},
  {t:90,msg:'Construye casas: cada una da espacio para cinco personas más.'},
  {t:240,msg:'Con 500 de comida podrás avanzar a la Edad Feudal desde el centro urbano.'}]},

{id:'m2',title:'La Compañía Catalana',year:'1303',map:'mediterraneo',size:'medium',diff:'normal',startAge:2,reveal:'normal',
 players:[{civ:'iberos',team:0,ai:false,name:'Tú'},{civ:'teutones',team:1,ai:true,name:'Señores de Anatolia'}],
 brief:['Los almogávares, infantería ligera temida en todo el Mediterráneo, cruzan el mar como mercenarios al servicio de Bizancio.',
  'El enemigo se ha atrincherado tras un castillo. Forma una compañía de almogávares en tu propio castillo y derriba su fortaleza.'],
 objectives:[{k:'trained',type:'almogavar',n:10,text:'Entrena 10 almogávares'},{k:'destroy',type:'castle',owner:1,text:'Destruye el castillo enemigo'}],
 lose:[{k:'lost',type:'tc'}],
 setup:[{owner:0,res:{stone:500,gold:300}},{owner:1,blds:[['castle',1,4,10,.2],['tower',2,4,9,.3]]}],
 events:[{t:5,msg:'Construye un castillo (pestaña militar de los aldeanos) para entrenar almogávares.',say:true},
  {t:420,wave:{owner:1,units:[['militia',5],['archer',3]],alert:'¡Una partida enemiga viene a por tu aldea!'}}]},

{id:'m3',title:'Granada',year:'1492',map:'iberia',size:'medium',diff:'normal',startAge:3,reveal:'explored',
 players:[{civ:'iberos',team:0,ai:false,name:'Tú'},{civ:'iberos',team:0,ai:true,name:'Corona de Aragón'},{civ:'bizantinos',team:1,ai:true,name:'Reino nazarí'}],
 brief:['Final de la Reconquista. Granada es el último reino nazarí de la península, protegido por fortalezas y torres.',
  'Con tu aliado aragonés, rinde sus dos fortalezas y su centro urbano antes de que pasen 40 minutos.'],
 objectives:[{k:'destroy',type:'castle',owner:2,text:'Destruye las fortalezas nazaríes'},{k:'destroy',type:'tc',owner:2,text:'Toma el centro urbano de Granada'}],
 lose:[{k:'lost',type:'tc'},{k:'time',t:2400}],
 setup:[{owner:0,res:{wood:400,gold:600}},{owner:2,blds:[['castle',2,4,12,.15],['tower',3,4,10,.25]],units:[['militia',6],['archer',6]]}],
 events:[{t:5,msg:'Las bombardas del taller de asedio derriban murallas y castillos.',say:true},{t:1800,msg:'Quedan 10 minutos.',warn:true},{t:2280,msg:'¡Solo 2 minutos!',warn:true}]},

{id:'m4',title:'Trafalgar',year:'1805',map:'islas',size:'medium',diff:'hard',startAge:4,reveal:'explored',
 players:[{civ:'iberos',team:0,ai:false,name:'Tú'},{civ:'francos',team:0,ai:true,name:'Flota francesa'},{civ:'britanos',team:1,ai:true,name:'Royal Navy'}],
 brief:['Frente al cabo de Trafalgar, la flota combinada hispano-francesa se enfrenta a la armada británica.',
  'Domina el mar: construye muelles y hunde 12 buques enemigos. Protege tu ciudad.'],
 objectives:[{k:'kill',cls:'ship',n:12,text:'Hunde 12 barcos británicos'}],
 lose:[{k:'lost',type:'tc'}],
 setup:[{owner:0,res:{wood:1200,gold:800}},{owner:2,units:[['galley',4]]}],
 events:[{t:5,msg:'Construye muelles en la costa y entrena buques de guerra.',say:true},
  {t:300,every:300,wave:{owner:2,units:[['galley',3]],grow:1,alert:'¡Buques británicos a la vista!'}}]},

{id:'m5',title:'El Dos de Mayo',year:'1808',map:'iberia',size:'small',diff:'hard',startAge:4,reveal:'explored',
 players:[{civ:'iberos',team:0,ai:false,name:'Tú'},{civ:'francos',team:1,ai:true,name:'Ejército imperial francés'}],
 brief:['Madrid se levanta contra las tropas napoleónicas. Empieza la guerra de la Independencia.',
  'Resiste 15 minutos las oleadas francesas sin perder tu centro urbano. Cada oleada será mayor que la anterior.'],
 objectives:[{k:'survive',t:900,text:'Resiste 15 minutos'}],
 lose:[{k:'lost',type:'tc'}],
 setup:[{owner:1,passive:true},{owner:0,res:{stone:400}}],
 events:[{t:5,msg:'Fortifica tu ciudad: torres, murallas y tropas. La primera oleada llega en dos minutos.',say:true},
  {t:120,every:150,wave:{owner:1,units:[['militia',5],['knight',2],['mangonel',1]],grow:2,alert:'¡Las tropas francesas avanzan!'}},
  {t:600,msg:'¡Aguanta! Ya falta poco.'}]},

{id:'m6',title:'Frente occidental',year:'1916',map:'europa',size:'medium',diff:'hard',startAge:5,reveal:'explored',
 players:[{civ:'iberos',team:0,ai:false,name:'Tú'},{civ:'britanos',team:0,ai:true,name:'Fuerza Expedicionaria'},{civ:'teutones',team:1,ai:true,name:'Imperio alemán'}],
 brief:['Europa está en guerra y el frente se ha estancado en las trincheras.',
  'Rompe el frente: destruye los dos búnkeres de mando enemigos antes de 45 minutos.'],
 objectives:[{k:'destroy',type:'castle',owner:2,text:'Destruye los búnkeres de mando enemigos'}],
 lose:[{k:'lost',type:'tc'},{k:'time',t:2700}],
 setup:[{owner:0,res:{food:800,gold:800}},{owner:2,blds:[['castle',2,5,12,.2],['tower',4,4,10,.3]],units:[['militia',8],['archer',4]]}],
 events:[{t:5,msg:'Los obuses y los tanques son la clave para romper las defensas.',say:true}]},

{id:'m7',title:'Carrera atómica',year:'1957',map:'namerica',size:'medium',diff:'normal',startAge:6,reveal:'normal',
 players:[{civ:'iberos',team:0,ai:false,name:'Tú'},{civ:'britanos',team:1,ai:true,name:'Bloque occidental'},{civ:'teutones',team:2,ai:true,name:'Bloque oriental'}],
 brief:['Empieza la era espacial. Las grandes potencias compiten por un logro que cambie la historia.',
  'Construye una maravilla y mantenla en pie 5 minutos. Los dos bloques intentarán impedirlo.'],
 objectives:[{k:'wonder',text:'Construye una maravilla y defiéndela 5 minutos'}],
 lose:[{k:'lost',type:'tc'}],
 setup:[{owner:0,res:{wood:800,gold:800,stone:800}}],
 events:[{t:5,msg:'Una maravilla cuesta 1000 de madera, oro y piedra. Protégela con defensas.',say:true}]},

{id:'m8',title:'La guerra de la información',year:'2000',map:'asia',size:'medium',diff:'hard',startAge:7,reveal:'normal',
 players:[{civ:'iberos',team:0,ai:false,name:'Tú'},{civ:'bizantinos',team:0,ai:true,name:'Aliado'},{civ:'teutones',team:1,ai:true,name:'Consorcio del Norte'},{civ:'francos',team:1,ai:true,name:'Consorcio del Sur'}],
 brief:['Drones, satélites y misiles guiados. Dos consorcios quieren controlar Asia.',
  'Con tu aliado, derrota a los dos consorcios.'],
 objectives:[{k:'eliminate',text:'Derrota a los dos consorcios'}],
 lose:[{k:'lost',type:'tc'}],
 setup:[{owner:0,res:{gold:600}}],
 events:[{t:5,msg:'Los misiles guiados (cuartel) destrozan tanques; los tiradores de precisión, la infantería.',say:true}]},

{id:'m9',title:'Chronosvisor',year:'2100',map:'oceania',size:'medium',diff:'hard',startAge:8,reveal:'normal',
 players:[{civ:'iberos',team:0,ai:false,name:'Tú'},{civ:'britanos',team:1,ai:true,name:'Dominio de Oceanía'},{civ:'teutones',team:2,ai:true,name:'Federación del Pacífico'}],
 brief:['El Chronosvisor muestra el futuro: exosoldados, mechs y cañones de plasma.',
  'Dos potencias luchan por el último continente. Derrótalas a ambas para cerrar la crónica.'],
 objectives:[{k:'eliminate',text:'Derrota a las dos potencias'}],
 lose:[{k:'lost',type:'tc'}],
 setup:[{owner:0,res:{food:600,gold:600}}],
 events:[{t:5,msg:'Última misión. Los cañones de riel derriban cualquier fortaleza.',say:true}]}
];
for(const m of C){m.win='scn';m.scn=m.id}
root.CHRONO_CAMPAIGN=C;
})(typeof window!=='undefined'?window:globalThis);
