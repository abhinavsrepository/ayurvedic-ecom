const fs = require('fs');

const report = JSON.parse(fs.readFileSync('lighthouse-report.json', 'utf8'));
const audits = report.audits;

console.log('Overall Accessibility Score:', report.categories.accessibility.score);
console.log('\n=== Failed Audits (score < 1.0) ===\n');

Object.keys(audits).forEach(key => {
  const audit = audits[key];
  if (audit.score !== null && audit.score < 1) {
    console.log(`\n${audit.title}:`);
    console.log(`  Score: ${audit.score}`);
    console.log(`  Description: ${audit.description}`);

    if (audit.details && audit.details.items && audit.details.items.length > 0) {
      console.log(`  Issues found: ${audit.details.items.length}`);
      audit.details.items.slice(0, 5).forEach((item, i) => {
        console.log(`  ${i + 1}. ${JSON.stringify(item).substring(0, 300)}`);
      });
    }
  }
});
