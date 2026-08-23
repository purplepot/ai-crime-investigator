import fs from 'fs';

let q = fs.readFileSync('backend/src/db/queries.js', 'utf8');

const mapHelper = `
const mapResult = (result) => {
  if (!result || !result.resultSet || !result.resultSet.data || !result.resultSet.columns) return [];
  const cols = result.resultSet.columns.map(c => c.name.toLowerCase());
  return result.resultSet.data.map(row => {
    const obj = {};
    cols.forEach((col, i) => { obj[col] = row[i]; });
    return obj;
  });
};
`;

if (!q.includes('mapResult')) {
  q = q.replace("import crypto from 'crypto';", "import crypto from 'crypto';\n" + mapHelper);
  
  // Replace direct returns
  q = q.replace(/return await db\.query\((.*?)\);/g, 'return mapResult(await db.query($1));');
  
  // Replace assigned queries
  q = q.replace(/const result = await db\.query/g, 'const resultRaw = await db.query');
  
  // Fix specific returns
  q = q.replace(/return result;/g, 'return mapResult(resultRaw);');
  q = q.replace(/return result && result\.length > 0 \? result\[0\] : null;/g, 'const rows = mapResult(resultRaw);\n  return rows.length > 0 ? rows[0] : null;');
  
  // Fix state json unparsing
  q = q.replace(/if \(result && result\.length > 0\)/g, 'const rows = mapResult(resultRaw);\n  if (rows && rows.length > 0)');
  q = q.replace(/return JSON\.parse\(result\[0\]\[1\]\);/g, 'return JSON.parse(rows[0].state_json);');
  
  fs.writeFileSync('backend/src/db/queries.js', q);
}
