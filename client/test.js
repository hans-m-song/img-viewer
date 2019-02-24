const fs = require('fs');
const path = '/home/axatol/Pictures';
const files = fs.readdirSync(path).filter(file => /\.(png|gif|jp[e]?g)$/ig.test(file));
console.log(files);