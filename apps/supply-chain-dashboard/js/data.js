/* ============================================================
   SC Data Model - 供应链数据模型
   ============================================================ */

const SC = window.SC || {};

/* ---- Months ---- */
SC.months = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
SC.monthsShort = ['1月','2月','3月','4月','5月','6月'];

/* ============================================================
   Overview KPIs
   ============================================================ */
SC.overviewKPI = [
  { id:'ov1', label:'供应链总成本', val:2863.2, unit:'万元', change:3.2, up:true, badge:'良好', badgeType:'good', icon:'💰', sub:'本月累计', color:'#1890ff' },
  { id:'ov2', label:'库存周转率', val:5.8, unit:'次', change:8.7, up:true, badge:'优化', badgeType:'good', icon:'🔄', sub:'较上月提升', color:'#13c2c2' },
  { id:'ov3', label:'订单履约率', val:96.8, unit:'%', change:1.5, up:true, badge:'达标', badgeType:'good', icon:'✅', sub:'目标98.5%', color:'#52c41a' },
  { id:'ov4', label:'准时交货率', val:93.6, unit:'%', change:2.1, up:false, badge:'关注', badgeType:'bad', icon:'🚚', sub:'需重点关注', color:'#fa8c16' },
];

SC.overviewTrend = {
  months: SC.monthsShort,
  procurement: [210, 225, 240, 255, 270],
  inventory: [1850, 1920, 1880, 1960, 1900],
  logisticsCost: [98, 105, 112, 108, 115],
};

SC.overviewPie = [
  { value: 3850, name: '电子元器件' },
  { value: 2100, name: '金属材料' },
  { value: 1680, name: '化工原料' },
  { value: 1240, name: '包装材料' },
  { value: 950, name: '备品备件' },
  { value: 580, name: '其他' },
];

SC.overviewBar = [
  { name: '宏远电子', score: 96 },
  { name: '鑫达金属', score: 93 },
  { name: '楚天化工', score: 90 },
  { name: '盛邦包装', score: 87 },
  { name: '华威精密', score: 84 },
];

SC.radarData = {
  indicator: ['成本控制', '交付能力', '质量水平', '库存效率', '物流时效', '供应商管理'],
  current: [85, 92, 88, 78, 83, 80],
  target: [90, 95, 92, 85, 90, 85],
};

/* ============================================================
   Procurement
   ============================================================ */
SC.procurementKPI = [
  { id:'pr1', label:'本月采购额', val:2846, unit:'万元', change:5.8, up:true, badge:'增长', badgeType:'good', icon:'💰', sub:'目标3000万', color:'#1890ff' },
  { id:'pr2', label:'同比增长', val:12.3, unit:'%', change:2.1, up:true, badge:'向好', badgeType:'good', icon:'📈', sub:'较去年同期', color:'#13c2c2' },
  { id:'pr3', label:'在途订单', val:48, unit:'单', change:6, up:false, badge:'增加', badgeType:'warn', icon:'📋', sub:'较上月+6单', color:'#fa8c16' },
  { id:'pr4', label:'平均交货周期', val:6.8, unit:'天', change:0.5, up:true, badge:'缩短', badgeType:'good', icon:'⏱', sub:'较上月-0.5天', color:'#52c41a' },
];

SC.procurementTrend = {
  months: [1,2,3,4,5,6,7,8,9,10,11,12],
  plan: [2100,2250,2400,2550,2700,2850,3000,3100,3200,3300,3450,3600],
  actual: [1950,2180,2350,2480,2650,2780,2950,3020,3150,3220,3380,3520],
};

SC.procurementPie = [
  { value: 35, name: '电子元器件' },
  { value: 20, name: '金属材料' },
  { value: 15, name: '化工原料' },
  { value: 12, name: '包装材料' },
  { value: 10, name: '设备备件' },
  { value: 8, name: '其他' },
];

SC.procurementStatus = [
  { status: '待审批', count: 12, color: '#fa8c16' },
  { status: '已审批', count: 35, color: '#1890ff' },
  { status: '在途', count: 48, color: '#13c2c2' },
  { status: '已到货', count: 86, color: '#52c41a' },
  { status: '已验收', count: 72, color: '#722ed1' },
];

SC.procurementSupplierShare = [
  { name: '宏远电子', val: 18.5 },
  { name: '鑫达金属', val: 14.2 },
  { name: '楚天化工', val: 11.8 },
  { name: '盛邦包装', val: 9.5 },
  { name: '华威精密', val: 7.6 },
  { name: '振华物流', val: 6.1 },
  { name: '天工装备', val: 5.2 },
  { name: '恒通原料', val: 4.8 },
];

SC.procurementOrders = [
  { id:'PO-2026-0451', supplier:'宏远电子', category:'电子元器件', amount:368.5, status:'在途', date:'2026-05-06' },
  { id:'PO-2026-0450', supplier:'鑫达金属', category:'金属材料', amount:285.2, status:'已审批', date:'2026-05-05' },
  { id:'PO-2026-0448', supplier:'楚天化工', category:'化工原料', amount:196.8, status:'在途', date:'2026-05-04' },
  { id:'PO-2026-0445', supplier:'盛邦包装', category:'包装材料', amount:88.5, status:'已到货', date:'2026-05-03' },
  { id:'PO-2026-0442', supplier:'华威精密', category:'设备备件', amount:156.3, status:'待审批', date:'2026-05-02' },
  { id:'PO-2026-0438', supplier:'振华物流', category:'物流服务', amount:45.6, status:'已验收', date:'2026-04-30' },
];

/* ============================================================
   Inventory
   ============================================================ */
SC.inventoryKPI = [
  { id:'inv1', label:'库存总金额', val:18650, unit:'万元', change:2.3, up:false, badge:'略升', badgeType:'warn', icon:'💰', sub:'较上月+2.3%', color:'#1890ff' },
  { id:'inv2', label:'库存周转率', val:5.8, unit:'次', change:8.7, up:true, badge:'优化', badgeType:'good', icon:'🔄', sub:'较上月提升', color:'#13c2c2' },
  { id:'inv3', label:'缺货率', val:1.2, unit:'%', change:0.3, up:true, badge:'改善', badgeType:'good', icon:'⚠️', sub:'较上月-0.3pp', color:'#52c41a' },
  { id:'inv4', label:'呆滞库存占比', val:4.8, unit:'%', change:0.5, up:false, badge:'偏高', badgeType:'bad', icon:'📦', sub:'超90天未移动', color:'#ff4d4f' },
];

SC.inventoryTrend = {
  months: SC.monthsShort,
  raw: [17200, 17800, 17500, 18200, 18650, 18300, 18000, 18500, 18800, 18400, 18100, 17900],
  safety: [16000, 16000, 16000, 16000, 16000, 16000, 16000, 16000, 16000, 16000, 16000, 16000],
};

SC.inventoryABC = [
  { name:'A类(高价值)', value: 65, items: 42 },
  { name:'B类(中价值)', value: 25, items: 156 },
  { name:'C类(低价值)', value: 10, items: 328 },
];

SC.inventoryTurnoverDays = {
  categories: ['电子元器件','金属材料','化工原料','包装材料','备品备件'],
  days: [45, 62, 38, 28, 55],
  avg: 45.6,
};

SC.inventorySlowMoving = [
  { name:'电子元器件', val: 420 },
  { name:'金属材料', val: 350 },
  { name:'包装材料', val: 280 },
  { name:'化工原料', val: 190 },
  { name:'备品备件', val: 120 },
];

SC.inventoryAlerts = [
  { sku:'EL-0082', name:'电阻器 RX-220', category:'电子元器件', stock:1250, safety:2000, shortage:750 },
  { sku:'MT-0015', name:'不锈钢板 304', category:'金属材料', stock:580, safety:1000, shortage:420 },
  { sku:'CH-0031', name:'工业酒精 99.9%', category:'化工原料', stock:320, safety:500, shortage:180 },
  { sku:'PK-0010', name:'瓦楞纸箱 600×400', category:'包装材料', stock:2800, safety:5000, shortage:2200 },
  { sku:'EL-0150', name:'传感器模块', category:'电子元器件', stock:85, safety:200, shortage:115 },
];

/* ============================================================
   Logistics
   ============================================================ */
SC.logisticsKPI = [
  { id:'lg1', label:'物流准时率', val:93.6, unit:'%', change:2.1, up:false, badge:'下降', badgeType:'bad', icon:'🚚', sub:'目标≥95%', color:'#ff4d4f' },
  { id:'lg2', label:'平均配送时长', val:2.8, unit:'天', change:0.3, up:true, badge:'改善', badgeType:'good', icon:'⏱', sub:'较上月-0.3天', color:'#1890ff' },
  { id:'lg3', label:'物流成本占比', val:4.2, unit:'%', change:0.1, up:false, badge:'持平', badgeType:'warn', icon:'💰', sub:'占销售额比', color:'#fa8c16' },
  { id:'lg4', label:'投诉率', val:0.8, unit:'‰', change:0.2, up:true, badge:'降低', badgeType:'good', icon:'📉', sub:'较上月-0.2‰', color:'#52c41a' },
];

SC.logisticsRegion = {
  regions: ['华东','华南','华北','华中','西南','西北','东北'],
  avg: [2.1, 2.5, 3.2, 2.8, 4.1, 5.3, 3.8],
  target: [2.5, 2.5, 3.0, 3.0, 4.0, 5.0, 3.5],
  onTime: [96, 94, 90, 92, 85, 78, 88],
};

SC.logisticsPie = [
  { value: 38, name: '运输费用' },
  { value: 22, name: '仓储费用' },
  { value: 18, name: '人力成本' },
  { value: 12, name: '包装费用' },
  { value: 10, name: '管理及其他' },
];

SC.logisticsCarrier = [
  { name:'顺丰快运', rate: 98.5, volume: 35 },
  { name:'京东物流', rate: 97.2, volume: 28 },
  { name:'德邦快递', rate: 95.8, volume: 18 },
  { name:'中通快运', rate: 93.5, volume: 12 },
  { name:'韵达快运', rate: 91.2, volume: 5 },
  { name:'其他', rate: 88.6, volume: 2 },
];

SC.logisticsTrend = {
  months: SC.monthsShort,
  cost: [98, 105, 112, 108, 115, 118, 122, 120, 125, 128, 130, 135],
  target: [100, 105, 110, 110, 115, 115, 120, 120, 125, 125, 130, 130],
};

/* ============================================================
   Supplier
   ============================================================ */
SC.supplierKPI = [
  { id:'sp1', label:'供应商总数', val:326, unit:'家', change:12, up:true, badge:'新增', badgeType:'good', icon:'🏢', sub:'本季度新增', color:'#1890ff' },
  { id:'sp2', label:'合格供应商占比', val:82.5, unit:'%', change:3.2, up:true, badge:'提升', badgeType:'good', icon:'✅', sub:'通过认证', color:'#52c41a' },
  { id:'sp3', label:'平均综合评分', val:86.4, unit:'分', change:1.8, up:true, badge:'上升', badgeType:'good', icon:'⭐', sub:'百分制', color:'#722ed1' },
  { id:'sp4', label:'高风险供应商', val:8, unit:'家', change:2, up:false, badge:'增加', badgeType:'bad', icon:'⚠️', sub:'需重点关注', color:'#ff4d4f' },
];

SC.supplierScoreDist = [
  { range:'90-100', count: 42 },
  { range:'80-89', count: 86 },
  { range:'70-79', count: 58 },
  { range:'60-69', count: 28 },
  { range:'<60', count: 12 },
];

SC.supplierLevel = [
  { value: 52, name: 'A级(优质)', itemStyle: { color: '#52c41a' } },
  { value: 86, name: 'B级(良好)', itemStyle: { color: '#1890ff' } },
  { value: 58, name: 'C级(合格)', itemStyle: { color: '#fa8c16' } },
  { value: 30, name: 'D级(待改进)', itemStyle: { color: '#ff4d4f' } },
];

SC.supplierCoverage = [
  { category:'电子元器件', count: 68 },
  { category:'金属材料', count: 45 },
  { category:'化工原料', count: 38 },
  { category:'包装材料', count: 52 },
  { category:'设备备件', count: 72 },
  { category:'物流服务', count: 28 },
  { category:'IT服务', count: 23 },
];

SC.supplierRisk = [
  { name:'恒通原料', finance: 82, delivery: 75 },
  { name:'天工装备', finance: 60, delivery: 72 },
  { name:'鹏程科技', finance: 88, delivery: 40 },
  { name:'瑞丰包装', finance: 45, delivery: 55 },
  { name:'华信电子', finance: 70, delivery: 68 },
  { name:'大地化工', finance: 90, delivery: 30 },
  { name:'永昌金属', finance: 35, delivery: 80 },
  { name:'东华材料', finance: 55, delivery: 45 },
  { name:'振华物流', finance: 65, delivery: 85 },
  { name:'宏远电子', finance: 25, delivery: 15 },
];

SC.supplierHighRisk = [
  { name:'天工装备', score: 68, level:'D', risk:'财务风险', status:'观察中' },
  { name:'鹏程科技', score: 64, level:'D', risk:'交付风险', status:'限期整改' },
  { name:'恒通原料', score: 72, level:'C', risk:'财务风险', status:'加强监控' },
  { name:'大地化工', score: 70, level:'C', risk:'交付风险', status:'观察中' },
  { name:'瑞丰包装', score: 74, level:'C', risk:'综合风险', status:'限期整改' },
];

/* ============================================================
   KPI Drill-Down Data
   ============================================================ */
SC.drillDown = {
  ov1: {
    title: '供应链总成本',
    value: '2,863.2',
    unit: '万元',
    formula: '供应链总成本 = 采购成本 + 仓储成本 + 物流成本 + 管理成本',
    components: [
      { name: '采购成本', value: 1850, pct: 64.6, color: '#1890ff' },
      { name: '仓储成本', value: 420, pct: 14.7, color: '#13c2c2' },
      { name: '物流成本', value: 385, pct: 13.4, color: '#52c41a' },
      { name: '管理成本', value: 208.2, pct: 7.3, color: '#fa8c16' },
    ],
    comparison: { label: '上月', value: '2,774.5', direction: 'up', change: 3.2 },
    trend: [2650, 2680, 2720, 2750, 2774.5, 2863.2],
    trendLabels: ['12月','1月','2月','3月','4月','5月'],
    source: '财务系统 · 统计周期：2026年5月',
  },
  ov2: {
    title: '库存周转率',
    value: '5.8',
    unit: '次',
    formula: '库存周转率 = 月度销售成本 ÷ 平均库存金额',
    steps: [
      { label: '① 本月销售成本', value: '10,980 万元', detail: 'ERP系统销售出库汇总' },
      { label: '② 期初库存金额', value: '18,200 万元', detail: '5月1日库存账面金额' },
      { label: '③ 期末库存金额', value: '18,650 万元', detail: '5月31日库存账面金额' },
      { label: '④ 平均库存金额', value: '(18,200 + 18,650) ÷ 2 = 18,425 万元', detail: '(期初 + 期末) / 2' },
      { label: '⑤ 周转率', value: '10,980 ÷ 18,425 ≈ 5.8 次/月', detail: '本月销售成本 / 平均库存' },
    ],
    comparison: { label: '上月', value: '5.3', direction: 'up', change: 8.7 },
    industryAvg: 4.5,
    industryMax: 7.2,
    source: 'WMS系统 · 行业参考值：4.0-6.0次/月',
  },
  ov3: {
    title: '订单履约率',
    value: '96.8',
    unit: '%',
    formula: '订单履约率 = 按时交付订单数 ÷ 总订单数 × 100%',
    steps: [
      { label: '① 总订单数', value: '2,580 单', detail: '本月全部有效订单' },
      { label: '② 按时交付', value: '2,497 单', detail: '在承诺时效内完成交付' },
      { label: '③ 延迟交付', value: '83 单', detail: '超出承诺时效' },
      { label: '④ 履约率计算', value: '2,497 ÷ 2,580 × 100% = 96.8%', detail: '目标值：≥98.5%' },
    ],
    comparison: { label: '上月', value: '95.3%', direction: 'up', change: 1.5 },
    gap: { target: 98.5, current: 96.8, shortfall: 1.7 },
    source: 'OMS订单系统 · 统计周期：2026年5月',
  },
  ov4: {
    title: '准时交货率',
    value: '93.6',
    unit: '%',
    formula: '准时交货率 = 准时到达订单数 ÷ 总发货订单数 × 100%',
    steps: [
      { label: '① 总发货单数', value: '3,450 单', detail: '本月全部发货订单' },
      { label: '② 准时到达', value: '3,229 单', detail: '客户签收时间在承诺时效内' },
      { label: '③ 延迟到达', value: '221 单', detail: '超出承诺时效签收' },
      { label: '④ 准时率计算', value: '3,229 ÷ 3,450 × 100% = 93.6%', detail: '目标值：≥95.0%' },
    ],
    comparison: { label: '上月', value: '95.7%', direction: 'down', change: 2.1 },
    carriers: [
      { name: '顺丰快运', rate: 98.5, volume: 35 },
      { name: '京东物流', rate: 97.2, volume: 28 },
      { name: '德邦快递', rate: 94.8, volume: 18 },
      { name: '中通快运', rate: 92.5, volume: 12 },
      { name: '韵达快运', rate: 90.1, volume: 7 },
    ],
    source: 'TMS运输系统 · 统计周期：2026年5月',
  },
};
