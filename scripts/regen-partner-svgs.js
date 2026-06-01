const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..', 'web', 'images', 'partners');
const logos = {
  'acba.svg': { label: 'ACBA', color: '#005AA7' },
  'evoca.svg': { label: 'Evoca', color: '#DE3A3F' },
  'flyArna.svg': { label: 'Fly Arna', color: '#F7B500' },
  'uls.svg': { label: 'ULS', color: '#1A1A1A' },
  'fit24.svg': { label: 'Fit24', color: '#008B57' },
  'pesto.svg': { label: 'Pesto', color: '#FF6F00' },
  'viena.svg': { label: 'Viena', color: '#DA1884' },
  'vda.svg': { label: 'VDA', color: '#2E3A8C' },
  'dors.svg': { label: 'Dors', color: '#0E4C92' },
  'grand.svg': { label: 'Grand', color: '#4A2B0F' },
  'ax.svg': { label: 'AX', color: '#0C4A6E' },
  'saber.svg': { label: 'Saber', color: '#8338EC' },
  'technology/abb.svg': { label: 'ABB', color: '#E4002B' },
  'technology/jung.svg': { label: 'JUNG', color: '#F8B400' },
  'technology/huawei.svg': { label: 'Huawei', color: '#FF0000' },
  'technology/eaton.svg': { label: 'Eaton', color: '#0055A4' },
  'technology/schneider-electric.svg': { label: 'Schneider', color: '#09A3A0' },
  'technology/hdl.svg': { label: 'HDL', color: '#004F9F' },
  'technology/zennio.svg': { label: 'Zennio', color: '#D65A12' },
  'technology/extron.svg': { label: 'Extron', color: '#003087' },
  'technology/yealink.svg': { label: 'Yealink', color: '#2F8C5E' },
  'technology/beg.svg': { label: 'BEG', color: '#235F70' },
  'technology/yamaha.svg': { label: 'Yamaha', color: '#1A1F71' },
  'technology/hikvision.svg': { label: 'Hikvision', color: '#E60012' },
  'technology/zyxel.svg': { label: 'Zyxel', color: '#0055A2' },
  'technology/gira.svg': { label: 'Gira', color: '#292E2F' },
  'technology/beckhoff.svg': { label: 'Beckhoff', color: '#E94E1B' },
  'technology/carrier.svg': { label: 'Carrier', color: '#00529B' },
  'technology/siemens.svg': { label: 'Siemens', color: '#009873' },
  'technology/legrand.svg': { label: 'Legrand', color: '#0C4C8A' },
  'technology/honeywell.svg': { label: 'Honeywell', color: '#C8102E' },
  'technology/helvar.svg': { label: 'Helvar', color: '#4A4A4A' },
  'technology/interra.svg': { label: 'Interra', color: '#11A5B5' },
  'technology/sharp.svg': { label: 'Sharp', color: '#E60012' },
  'technology/wago.svg': { label: 'WAGO', color: '#FF5A00' },
  'technology/obo-bettermann.svg': { label: 'OBO Bettermann', color: '#009225' },
  'technology/polycom.svg': { label: 'Polycom', color: '#323E8F' },
  'technology/phoenix-contact.svg': { label: 'Phoenix Contact', color: '#007A33' },
  'technology/iridium-mobile.svg': { label: 'iRidium mobile', color: '#2A75BB' },
  'technology/vola.svg': { label: 'VOLA', color: '#2E3192' },
  'technology/ekinex.svg': { label: 'Ekinex', color: '#BB2A52' },
  'technology/schrack-seconet.svg': { label: 'Schrack Seconet', color: '#00A2E8' }
};

function makeSvg(label, fill) {
  const lines = label.split(' ').length > 2 ? label.split(/\s+/).reduce((acc, word) => {
    if (!acc.length || acc[acc.length - 1].length + word.length + 1 > 10) acc.push(word);
    else acc[acc.length - 1] += ' ' + word;
    return acc;
  }, []) : [label];

  const yStart = 80;
  let textContent = lines.map((line, index) =>
    `<tspan x=\"256\" dy=\"${index === 0 ? '0' : '1.1em'}\">${line}</tspan>`
  ).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 160" role="img" aria-label="${label} logo">\n` +
    `  <title>${label}</title>\n` +
    `  <defs>\n` +
    `    <linearGradient id=\"bggrad\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\">\n` +
    `      <stop offset=\"0%\" stop-color=\"${fill}\" stop-opacity=\"0.94\"/>\n` +
    `      <stop offset=\"100%\" stop-color=\"${fill}\" stop-opacity=\"0.8\"/>\n` +
    `    </linearGradient>\n` +
    `  </defs>\n` +
    `  <rect width=\"512\" height=\"160\" rx=\"20\" fill=\"url(#bggrad)\"/>\n` +
    `  <path d=\"M0 0 H512 V160 H0 Z\" fill=\"rgba(255,255,255,0.12)\"/>\n` +
    `  <text x=\"256\" y=\"${yStart}\" text-anchor=\"middle\" dominant-baseline=\"middle\" font-family=\"Inter, Arial, sans-serif\" font-size=\"54\" font-weight=\"800\" fill=\"#ffffff\">${textContent}</text>\n` +
    `</svg>\n`;
}

Object.entries(logos).forEach(([file, meta]) => {
  const filePath = path.resolve(root, file);
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, makeSvg(meta.label, meta.color), 'utf8');
  console.log('Created', filePath);
});