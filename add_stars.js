const fs = require('fs');
let content = fs.readFileSync('data_hotel.py', 'utf8');
const lines = content.split('\n');
const newLines = [];
let insideLuxury = false;
let insideMid = false;
let insideBudget = false;
let stars = 3;

for (let i = 0; i < lines.length; i++) {
    newLines.push(lines[i]);
    if (lines[i].includes('LUXURY')) { insideLuxury = true; insideMid = false; insideBudget = false; }
    if (lines[i].includes('MID-RANGE')) { insideLuxury = false; insideMid = true; insideBudget = false; }
    if (lines[i].includes('BUDGET')) { insideLuxury = false; insideMid = false; insideBudget = true; }
    
    const m = lines[i].match(/"id":\s*"([^"]+)",/);
    if (m) {
        const id = m[1];
        if (id === 'luxury_01') stars = 6;
        else if (id === 'budget_06') stars = 2;
        else if (insideLuxury) stars = 5;
        else if (insideMid) stars = 4;
        else stars = 3;
    }
    
    if (lines[i].match(/"est_price_vnd":\s*(\d+),/)) {
        newLines.push('        "stars": ' + stars + ',');
    }
}
fs.writeFileSync('data_hotel.py', newLines.join('\n'));
