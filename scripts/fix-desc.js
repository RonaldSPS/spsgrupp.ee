const fs = require('fs');

// Fix serviceDescription in all generated pages
const descs = {
  'ehitusjargne-koristus': {et:'Ehitusjargne koristus Tallinnas — tolm, praht, varvitilgad. Objekt valmis.',ru:'Послестроительная уборка в Таллинне — пыль, мусор, краска.',en:'Post-construction cleaning in Tallinn — dust, debris, paint drops.'},
  'eskalaatorite-suvapuhastus': {et:'Eskalaatorite suvapuhastus Tallinnas.',ru:'Глубокая чистка эскалаторов в Таллинне.',en:'Escalator deep cleaning in Tallinn.'},
  'desinfitseerimine': {et:'Professionaalne desinfitseerimine Tallinnas.',ru:'Профессиональная дезинфекция в Таллинне.',en:'Professional disinfection in Tallinn.'},
  'porandate-hooldus': {et:'Porandate hooldus ja suvapuhastus Tallinnas.',ru:'Уход за полами в Таллинне.',en:'Floor maintenance in Tallinn.'},
  'suitsu-ja-tulekahjustuste-puhastamine': {et:'Suitsu- ja tulekahjustuste puhastamine Tallinnas.',ru:'Устранение последствий пожара в Таллинне.',en:'Fire and smoke damage restoration in Tallinn.'},
  'elektritood': {et:'Elektritood arikinnisvarale Tallinnas.',ru:'Электромонтажные работы в Таллинне.',en:'Electrical work in Tallinn.'},
  'torutood': {et:'Torutood arikinnisvarale Tallinnas.',ru:'Сантехнические работы в Таллинне.',en:'Plumbing in Tallinn.'},
  'siseviimistlustood': {et:'Siseviimistlustood Tallinnas.',ru:'Внутренняя отделка в Таллинне.',en:'Interior finishing in Tallinn.'},
  'sanitaarremont-ja-umberehitus': {et:'Sanitaarremont arikinnisvarale Tallinnas.',ru:'Ремонт санузлов в Таллинне.',en:'Bathroom renovation in Tallinn.'},
  'ventilatsioonide-ehitus-ja-hooldus': {et:'Ventilatsioonitood Tallinnas.',ru:'Вентиляционные системы в Таллинне.',en:'Ventilation systems in Tallinn.'},
  'plaatimistood': {et:'Plaatimistood Tallinnas.',ru:'Плиточные работы в Таллинне.',en:'Tiling services in Tallinn.'},
  'katuse-remont': {et:'Katuse remont Tallinnas.',ru:'Ремонт кровли в Таллинне.',en:'Roof repair in Tallinn.'},
  'lammutustood': {et:'Lammutustood Tallinnas.',ru:'Демонтажные работы в Таллинне.',en:'Demolition services in Tallinn.'},
};

const dirs = [
  'app/puhastusteenused/ehitusjargne-koristus',
  'app/puhastusteenused/eskalaatorite-suvapuhastus',
  'app/puhastusteenused/desinfitseerimine',
  'app/puhastusteenused/porandate-hooldus',
  'app/puhastusteenused/suitsu-ja-tulekahjustuste-puhastamine',
  'app/remonditeenused-tallinnas/elektritood',
  'app/remonditeenused-tallinnas/torutood',
  'app/remonditeenused-tallinnas/siseviimistlustood',
  'app/remonditeenused-tallinnas/sanitaarremont-ja-umberehitus',
  'app/remonditeenused-tallinnas/ventilatsioonide-ehitus-ja-hooldus',
  'app/remonditeenused-tallinnas/plaatimistood',
  'app/remonditeenused-tallinnas/katuse-remont',
  'app/remonditeenused-tallinnas/lammutustood',
];

for (const dir of dirs) {
  const file = dir + '/page.tsx';
  if (!fs.existsSync(file)) { console.log('SKIP:', file); continue; }
  const slug = dir.split('/').pop();
  const desc = descs[slug];
  if (!desc) { console.log('SKIP (no desc):', slug); continue; }

  let c = fs.readFileSync(file, 'utf-8');
  const oldStr = 'serviceDescription=""';
  const newStr = `serviceDescription={locale==="et"?${JSON.stringify(desc.et)}:locale==="ru"?${JSON.stringify(desc.ru)}:${JSON.stringify(desc.en)}}`;
  
  if (c.includes(oldStr)) {
    c = c.replace(oldStr, newStr);
    fs.writeFileSync(file, c, 'utf-8');
    console.log('Fixed:', slug);
  } else {
    console.log('No match:', slug);
  }
}
