// Every chapter has a finite, solvable supply. Goals count new creations.
export const CHAPTERS = [
  {name:'El despertar',subtitle:'Toda conexión tiene un comienzo.',moves:18,seed:[9,0,0,0,0],goals:[{level:2,count:1}]},
  {name:'Ecos gemelos',subtitle:'Una aurora encuentra su reflejo.',moves:20,seed:[18,0,0,0,0],goals:[{level:2,count:2}]},
  {name:'La luz se abre',subtitle:'Transformá el pulso en equilibrio.',moves:16,seed:[0,9,0,0,0],goals:[{level:3,count:1}]},
  {name:'Entre dos mundos',subtitle:'Dos frecuencias, una misma armonía.',moves:16,seed:[0,6,6,0,0],goals:[{level:2,count:1},{level:3,count:1}]},
  {name:'Polvo de estrellas',subtitle:'Lo pequeño también contiene un universo.',moves:15,seed:[0,0,9,0,0],goals:[{level:4,count:1}]},
  {name:'El equilibrio',subtitle:'Encontrá la belleza entre dos destinos.',moves:15,seed:[0,0,6,6,0],goals:[{level:3,count:1},{level:4,count:1}]},
  {name:'Universos paralelos',subtitle:'Hacé que el cosmos resuene dos veces.',moves:16,seed:[0,0,9,3,0],goals:[{level:4,count:2}]},
  {name:'La gran resonancia',subtitle:'Todo lo que conectaste llega hasta acá.',moves:15,seed:[0,0,9,6,0],goals:[{level:4,count:3}]}
];
export function getChapter(index){
  if(index<CHAPTERS.length)return CHAPTERS[index];
  const wave=index-CHAPTERS.length,amount=2+wave%3;
  return {name:`Infinito ${wave+1}`,subtitle:'Siempre hay otra forma de conectar.',moves:Math.max(12,18-Math.floor(wave/3)),seed:[0,0,9,(amount-1)*3,0],goals:[{level:4,count:amount}],infinite:true};
}
export function medal(moves,budget){return moves>=Math.ceil(budget*.55)?3:moves>=Math.ceil(budget*.25)?2:1}
export function cleanProgress(raw){
  const highest=Number.isInteger(raw?.highest)&&raw.highest>=0?Math.min(raw.highest,10000):0;
  const current=Number.isInteger(raw?.current)&&raw.current>=0?Math.min(raw.current,highest):0;
  const stars={};if(raw?.stars&&typeof raw.stars==='object')for(const [k,v] of Object.entries(raw.stars)){const n=Number(k);if(Number.isInteger(n)&&n>=0&&n<=highest&&[1,2,3].includes(v))stars[n]=v;}
  return {highest,current,stars};
}
