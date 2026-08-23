import fs from 'fs';
import path from 'path';

const agentsDir = 'c:/Users/priya/Desktop/exasol-hack/backend/src/agents';
const files = fs.readdirSync(agentsDir).filter(f => f.endsWith('.js'));

files.forEach(file => {
  const filePath = path.join(agentsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace import
  content = content.replace(
    'import { ChatOpenAI } from "@langchain/openai";',
    'import { ChatGoogle } from "@langchain/google";'
  );
  
  // Replace instantiation
  content = content.replace(
    /new ChatOpenAI\(\{ modelName: "gpt-4o-mini", temperature: ([\d.]+) \}\);/g,
    'new ChatGoogle({ model: "gemini-3.5-flash", temperature: $1 });'
  );
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
});
