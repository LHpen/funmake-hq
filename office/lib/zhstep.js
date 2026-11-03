// Display-only fallback: when a bot's step text is mostly English, translate common phrases to Chinese.
// Unknown words (proper nouns like MakerWorld, Temu, Codex, v136) are kept as they are.
const PHRASES = [
  [/\bstatus check\b/gi, '状态检查'], [/\bin progress\b/gi, '进行中'], [/\bset(?:ting)? up\b/gi, '设置'],
  [/\blog ?in\b/gi, '登录'], [/\bsign(?:ing)? in\b/gi, '登录'], [/\bfollow[- ]?up\b/gi, '跟进'],
  [/\broutine paused\b/gi, '定时任务已暂停'], [/\bnot started\b/gi, '未开始'], [/\bwaiting (?:for|on)\b/gi, '等'],
];
const WORDS = {
  waiting: '等', wait: '等', awaiting: '等待', diagnosing: '诊断', diagnose: '诊断', coding: '写代码', code: '代码',
  checking: '检查', check: '检查', checked: '已检查', analyzing: '分析', analysing: '分析', analyze: '分析', reviewing: '审查', review: '审查',
  fixing: '修复', fix: '修复', fixed: '已修复', testing: '测试', test: '测试', building: '构建', build: '构建', deploying: '部署', deploy: '部署',
  updating: '更新', update: '更新', updated: '已更新', writing: '写', reading: '读', researching: '调研', searching: '搜索', search: '搜索',
  running: '运行', run: '运行', syncing: '同步', sync: '同步', uploading: '上传', upload: '上传', downloading: '下载', listing: '上架',
  posting: '发布', publishing: '发布', generating: '生成', scraping: '抓取', monitoring: '监控', planning: '规划', drafting: '起草',
  forwarding: '转发', sending: '发送', preparing: '准备', processing: '处理', finishing: '收尾', finish: '完成', starting: '开始',
  idle: '空闲', done: '完成', finished: '已完成', completed: '已完成', paused: '已暂停', blocked: '受阻', stuck: '卡住', failed: '失败', error: '出错',
  local: '本地', remote: '远程', template: '模板', issue: '问题', bug: '问题', office: '办公室', codebase: '代码库', codebases: '代码库',
  text: '文本', routing: '路由', change: '改动', changes: '改动', selection: '选品', routine: '定时任务', task: '任务', notice: '通知',
  order: '订单', orders: '订单', price: '价格', prices: '价格', product: '商品', products: '商品', store: '店铺', shop: '店铺', report: '报告',
  completion: '完成', forwarded: '已转发', sent: '已发送', posted: '已发布', ready: '就绪', setup: '设置', login: '登录', fixes: '修复', progress: '进度', result: '结果', results: '结果', message: '消息', messages: '消息', now: '现在',
  daily: '每日', new: '新', look: '外观', dashboard: '看板', user: '用户', reply: '回复', approval: '批准', data: '数据', image: '图片', images: '图片',
};
const DROP = new Set(['a', 'an', 'the', 'of', 'for', 'on', 'to', 'and', 'with', 'in', 'is', 'my', 'your']);

export function zhStep(step) {
  if (!step || typeof step !== 'string') return step;
  const latin = (step.match(/[A-Za-z]/g) || []).length, cjk = (step.match(/[\u4e00-\u9fff]/g) || []).length;
  if (latin < 3 || cjk * 2 >= latin) return step;                     // already mostly Chinese
  let s = step;
  for (const [re, zh] of PHRASES) s = s.replace(re, ` ${zh} `);
  s = s.replace(/[A-Za-z][A-Za-z0-9'-]*/g, (w) => {
    const k = w.toLowerCase();
    if (DROP.has(k)) return ' ';
    return WORDS[k] ? ` ${WORDS[k]} ` : ` ${w} `;
  });
  // tidy spaces: none between Chinese characters, one between Chinese and Latin
  s = s.replace(/\s+/g, ' ').trim().replace(/([\u4e00-\u9fff])\s+(?=[\u4e00-\u9fff])/g, '$1');
  return s || step;
}
