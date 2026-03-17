const fs = require('fs');

function extractLighthouseData(htmlPath, envName) {
  const html = fs.readFileSync(htmlPath, 'utf8');

  // 简单提取分数 - 直接搜索 JSON 模式
  const results = {};

  // Performance score
  const perfMatch = html.match(/"id":\s*"performance"[\s\S]*?"score":\s*([0-9.]+)/);
  if (perfMatch) {
    results.performance = Math.round(parseFloat(perfMatch[1]) * 100);
  }

  // LCP
  const lcpMatch = html.match(/"id":\s*"largest-contentful-paint"[\s\S]*?"displayValue":\s*"([^"]*)"/);
  const lcpScoreMatch = html.match(/"id":\s*"largest-contentful-paint"[\s\S]*?"score":\s*([0-9.]+)/);
  if (lcpMatch) results.lcp = lcpMatch[1];
  if (lcpScoreMatch) results.lcpScore = Math.round(parseFloat(lcpScoreMatch[1]) * 100);

  // INP
  const inpMatch = html.match(/"id":\s*"interaction-to-next-paint"[\s\S]*?"displayValue":\s*"([^"]*)"/);
  const inpScoreMatch = html.match(/"id":\s*"interaction-to-next-paint"[\s\S]*?"score":\s*([0-9.]+)/);
  if (inpMatch) results.inp = inpMatch[1];
  if (inpScoreMatch) results.inpScore = Math.round(parseFloat(inpScoreMatch[1]) * 100);

  // CLS
  const clsMatch = html.match(/"id":\s*"cumulative-layout-shift"[\s\S]*?"displayValue":\s*"([^"]*)"/);
  const clsScoreMatch = html.match(/"id":\s*"cumulative-layout-shift"[\s\S]*?"score":\s*([0-9.]+)/);
  if (clsMatch) results.cls = clsMatch[1];
  if (clsScoreMatch) results.clsScore = Math.round(parseFloat(clsScoreMatch[1]) * 100);

  // TBT
  const tbtMatch = html.match(/"id":\s*"total-blocking-time"[\s\S]*?"displayValue":\s*"([^"]*)"/);
  const tbtScoreMatch = html.match(/"id":\s*"total-blocking-time"[\s\S]*?"score":\s*([0-9.]+)/);
  if (tbtMatch) results.tbt = tbtMatch[1];
  if (tbtScoreMatch) results.tbtScore = Math.round(parseFloat(tbtScoreMatch[1]) * 100);

  // FCP
  const fcpMatch = html.match(/"id":\s*"first-contentful-paint"[\s\S]*?"displayValue":\s*"([^"]*)"/);
  const fcpScoreMatch = html.match(/"id":\s*"first-contentful-paint"[\s\S]*?"score":\s*([0-9.]+)/);
  if (fcpMatch) results.fcp = fcpMatch[1];
  if (fcpScoreMatch) results.fcpScore = Math.round(parseFloat(fcpScoreMatch[1]) * 100);

  return results;
}

console.log('\n' + '='.repeat(65));
console.log('Lighthouse 性能对比报告');
console.log('='.repeat(65));

const devMetrics = extractLighthouseData(
  'D:/Projects/demo/games/2048/.planning/phases/07-performance-validation/lighthouse-reports/localhost_5173-20260317T120831.html',
  'Dev'
);

const previewMetrics = extractLighthouseData(
  'D:/Projects/demo/games/2048/.planning/phases/07-performance-validation/lighthouse-reports/localhost_4173-20260317T120800.html',
  'Preview'
);

console.log('\n---------------------------------------------------');
console.log('开发环境 (pnpm dev, localhost:5173)');
console.log('---------------------------------------------------');
console.log('  Performance:   ' + devMetrics.performance + '/100');
console.log('  LCP:           ' + devMetrics.lcp + ' (' + devMetrics.lcpScore + '/100)');
console.log('  INP:           ' + devMetrics.inp + ' (' + devMetrics.inpScore + '/100)');
console.log('  CLS:           ' + devMetrics.cls + ' (' + devMetrics.clsScore + '/100)');
console.log('  TBT:           ' + devMetrics.tbt + ' (' + devMetrics.tbtScore + '/100)');
console.log('  FCP:           ' + devMetrics.fcp + ' (' + devMetrics.fcpScore + '/100)');

console.log('\n---------------------------------------------------');
console.log('生产环境 (pnpm build + preview, localhost:4173)');
console.log('---------------------------------------------------');
console.log('  Performance:   ' + previewMetrics.performance + '/100');
console.log('  LCP:           ' + previewMetrics.lcp + ' (' + previewMetrics.lcpScore + '/100)');
console.log('  INP:           ' + previewMetrics.inp + ' (' + previewMetrics.inpScore + '/100)');
console.log('  CLS:           ' + previewMetrics.cls + ' (' + previewMetrics.clsScore + '/100)');
console.log('  TBT:           ' + previewMetrics.tbt + ' (' + previewMetrics.tbtScore + '/100)');
console.log('  FCP:           ' + previewMetrics.fcp + ' (' + previewMetrics.fcpScore + '/100)');

console.log('\n---------------------------------------------------');
console.log('对比分析');
console.log('---------------------------------------------------');
const perfImprovement = previewMetrics.performance - devMetrics.performance;
console.log('  Performance 提升: +' + perfImprovement + ' 分 (' + devMetrics.performance + ' → ' + previewMetrics.performance + ')');

const status = previewMetrics.performance >= 90 ? '✅ 达到优秀标准 (≥ 90)'
              : previewMetrics.performance >= 50 ? '⚠️ 需要改进 (50-89)'
              : '❌ 性能较差 (< 50)';
console.log('  评估: ' + status);

// 保存到文件
const report = `# Lighthouse 性能对比报告

## 开发环境 (pnpm dev, localhost:5173)
- **Performance Score:** ${devMetrics.performance}/100
- **LCP:** ${devMetrics.lcp} (${devMetrics.lcpScore}/100)
- **INP:** ${devMetrics.inp} (${devMetrics.inpScore}/100)
- **CLS:** ${devMetrics.cls} (${devMetrics.clsScore}/100)
- **TBT:** ${devMetrics.tbt} (${devMetrics.tbtScore}/100)
- **FCP:** ${devMetrics.fcp} (${devMetrics.fcpScore}/100)

## 生产环境 (pnpm build + preview, localhost:4173)
- **Performance Score:** ${previewMetrics.performance}/100
- **LCP:** ${previewMetrics.lcp} (${previewMetrics.lcpScore}/100)
- **INP:** ${previewMetrics.inp} (${previewMetrics.inpScore}/100)
- **CLS:** ${previewMetrics.cls} (${previewMetrics.clsScore}/100)
- **TBT:** ${previewMetrics.tbt} (${previewMetrics.tbtScore}/100)
- **FCP:** ${previewMetrics.fcp} (${previewMetrics.fcpScore}/100)

## 对比分析
- **Performance 提升:** +${perfImprovement} 分 (${devMetrics.performance} → ${previewMetrics.performance})
- **评估:** ${status}

## 结论
生产环境构建显著提升了性能评分。${previewMetrics.performance >= 90 ? '达到优秀标准（≥90），可以发布。' : '建议进一步优化以达到 90 分以上。'}
`;

fs.writeFileSync('D:/Projects/demo/games/2048/.planning/phases/07-performance-validation/lighthouse-reports/analysis.md', report, 'utf8');
console.log('\n报告已保存到: lighthouse-reports/analysis.md');
