import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, extname, basename } from 'path';

const TEMPLATE_DIR = 'src/app';
const OUTPUT_DIR = 'cypress/e2e';
const TARGET_TAGS = ['youtube-player', 'download-link'];

if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`📁 Created: ${OUTPUT_DIR}`);
}

function findTemplates(dir) {
  const files = readdirSync(dir, { withFileTypes: true });
  let templates = [];

  for (const file of files) {
    const fullPath = join(dir, file.name);
    if (file.isDirectory()) {
      templates = templates.concat(findTemplates(fullPath));
    } else if (extname(file.name) === '.html') {
      templates.push(fullPath);
    }
  }

  return templates;
}

function extractTargets(content) {
  return TARGET_TAGS.filter(tag => content.includes(`<${tag}`));
}

function generateSpec(templatePath, targets) {
  const baseName = basename(templatePath).replace('.component.html', '');
  const specName = `${baseName}.cy.ts`;
  const specPath = join(OUTPUT_DIR, specName);

  if (existsSync(specPath)) {
    console.log(`⚠️ Skipped (already exists): ${specPath}`);
    return;
  }

  const testBlocks = targets.map(tag => `
  it('should render <${tag}> correctly', () => {
    cy.visit('/${baseName}');
    cy.get('${tag}').should('exist');
  });`).join('\n');

  const content = `describe('${baseName} component', () => {${testBlocks}
});`;

  writeFileSync(specPath, content);
  console.log(`✅ Created: ${specPath}`);
}

// Main execution
const templates = findTemplates(TEMPLATE_DIR);

templates.forEach(templatePath => {
  const html = readFileSync(templatePath, 'utf-8');
  const targets = extractTargets(html);
  if (targets.length > 0) {
    generateSpec(templatePath, targets);
  }
});