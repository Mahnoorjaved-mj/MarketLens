const fs = require('fs');
const path = require('path');
const layoutPath = path.join(__dirname, 'powerbi_layout.json');
let content = fs.readFileSync(layoutPath, 'utf8').replace(/^\uFEFF/, '');
const layout = JSON.parse(content);
const vcs = layout.sections[0].visualContainers;

console.log('Total visuals:', vcs.length);

vcs.forEach((v, idx) => {
  const config = JSON.parse(v.config || '{}');
  const sv = config.singleVisual || {};
  console.log(`\n----------------------------------------`);
  console.log(`Visual #${idx + 1}: ${sv.visualType}`);
  console.log(`Position: x=${v.x}, y=${v.y}, width=${v.width}, height=${v.height}`);
  console.log(`Projections:`, JSON.stringify(sv.projections));
  if (sv.prototypeQuery) {
    console.log(`PrototypeQuery From:`, JSON.stringify(sv.prototypeQuery.From));
    console.log(`PrototypeQuery Select:`, JSON.stringify(sv.prototypeQuery.Select?.map(s => ({
      name: s.Name,
      col: s.Column?.Property,
      measure: s.Measure?.Property,
      agg: s.Aggregation?.Expression?.Column?.Property
    }))));
    console.log(`PrototypeQuery OrderBy:`, JSON.stringify(sv.prototypeQuery.OrderBy?.map(o => ({
      dir: o.Direction,
      col: o.Expression?.Column?.Property || o.Expression?.Measure?.Property
    }))));
  }
  if (sv.vcObjects) {
    console.log(`vcObjects:`, Object.keys(sv.vcObjects));
  }
});
