/* ============================================================
   SC Charts - ECharts 渲染引擎
   ============================================================ */
const SC = window.SC || {};
SC.Charts = {};

/* ---- Theme helpers ---- */
const CT = {
  bg: 'transparent',
  text: 'rgba(232,237,245,.7)',
  textDim: 'rgba(232,237,245,.45)',
  textMuted: 'rgba(232,237,245,.25)',
  border: 'rgba(255,255,255,.06)',
  tooltip: {
    backgroundColor: 'rgba(10,22,40,.94)',
    borderColor: 'rgba(24,144,255,.25)',
    textStyle: { color: '#e8edf5', fontSize: 12 },
    extraCssText: 'border-radius:8px;padding:10px 14px;box-shadow:0 4px 20px rgba(0,0,0,.4)',
  },
  colors: ['#1890ff','#13c2c2','#52c41a','#fa8c16','#722ed1','#eb2f96','#f5222d','#2f54eb'],
  gaugeColors: [
    { offset: 0, color: '#1890ff' },
    { offset: .5, color: '#13c2c2' },
    { offset: 1, color: '#52c41a' },
  ],
};

/* ---- Overview ---- */

SC.Charts.ovTrend = function(id) {
  const dom = document.getElementById(id);
  if (!dom) return;
  const c = echarts.init(dom);
  const d = SC.overviewTrend;
  c.setOption({
    tooltip: { ...CT.tooltip, trigger: 'axis' },
    legend: { data: ['采购额','库存水平','物流费用'], bottom: 0, textStyle: { color: CT.text, fontSize: 11 } },
    grid: { top: 20, bottom: 36, left: 48, right: 16 },
    xAxis: { type: 'category', data: d.months, axisLine: { lineStyle: { color: CT.border } }, axisLabel: { color: CT.textDim, fontSize: 10 } },
    yAxis: [
      { type: 'value', name: '万元', nameTextStyle: { color: CT.textMuted, fontSize: 10 }, splitLine: { lineStyle: { color: 'rgba(255,255,255,.04)', type: 'dashed' } }, axisLabel: { color: CT.textDim, fontSize: 10 } },
    ],
    series: [
      { name: '采购额', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, lineStyle: { color: CT.colors[0], width: 2 }, itemStyle: { color: CT.colors[0] }, areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(24,144,255,.12)' }, { offset: 1, color: 'rgba(24,144,255,0)' }] } }, data: d.procurement },
      { name: '库存水平', type: 'line', smooth: true, symbol: 'diamond', symbolSize: 7, lineStyle: { color: CT.colors[1], width: 2 }, itemStyle: { color: CT.colors[1] }, areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(19,194,194,.1)' }, { offset: 1, color: 'rgba(19,194,194,0)' }] } }, data: d.inventory },
      { name: '物流费用', type: 'line', smooth: true, symbol: 'triangle', symbolSize: 7, lineStyle: { color: CT.colors[2], width: 2 }, itemStyle: { color: CT.colors[2] }, data: d.logisticsCost },
    ],
  });
  return c;
};

SC.Charts.ovPie = function(id) {
  const dom = document.getElementById(id);
  if (!dom) return;
  const c = echarts.init(dom);
  c.setOption({
    tooltip: { ...CT.tooltip, trigger: 'item', formatter: '{b}: {c} 万元 ({d}%)' },
    legend: { orient: 'vertical', right: 4, top: 'center', itemWidth: 10, itemHeight: 10, textStyle: { color: CT.text, fontSize: 11 } },
    series: [{
      type: 'pie', radius: ['38%', '68%'], center: ['35%', '50%'], padAngle: 2,
      itemStyle: { borderRadius: 4, borderColor: '#0a1628', borderWidth: 2 },
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 12, color: '#e8edf5' }, itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,.5)' } },
      data: SC.overviewPie.map((d, i) => ({ ...d, itemStyle: { color: CT.colors[i] } })),
    }],
  });
  return c;
};

SC.Charts.ovBar = function(id) {
  const dom = document.getElementById(id);
  if (!dom) return;
  const c = echarts.init(dom);
  const d = SC.overviewBar.slice().reverse();
  c.setOption({
    tooltip: { ...CT.tooltip, trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: p => `${p[0].name}<br/>综合评分: ${p[0].value} 分` },
    grid: { top: 10, bottom: 10, left: 72, right: 40 },
    xAxis: { type: 'value', max: 100, splitLine: { lineStyle: { color: 'rgba(255,255,255,.04)', type: 'dashed' } }, axisLabel: { color: CT.textDim, fontSize: 10, formatter: '{value}分' } },
    yAxis: { type: 'category', data: d.map(v => v.name), axisLabel: { color: CT.text, fontSize: 11 } },
    series: [{
      type: 'bar', barWidth: 14,
      data: d.map((v, i) => ({
        value: v.score,
        itemStyle: {
          color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: `rgba(24,144,255,${.3 + (4 - i) * .12})` }, { offset: 1, color: `rgba(19,194,194,${.3 + (4 - i) * .12})` }] },
          borderRadius: [0, 6, 6, 0],
        },
      })),
      label: { show: true, position: 'right', color: CT.text, fontSize: 11, formatter: '{c} 分' },
    }],
  });
  return c;
};

SC.Charts.ovRadar = function(id) {
  const dom = document.getElementById(id);
  if (!dom) return;
  const c = echarts.init(dom);
  const d = SC.radarData;
  c.setOption({
    tooltip: { ...CT.tooltip },
    legend: { data: ['当前值', '目标值'], bottom: 0, textStyle: { color: CT.text, fontSize: 11 } },
    radar: {
      indicator: d.indicator.map(v => ({ name: v, max: 100 })),
      shape: 'polygon',
      splitNumber: 4,
      axisName: { color: CT.text, fontSize: 11 },
      splitArea: { areaStyle: { color: ['rgba(24,144,255,.02)', 'rgba(24,144,255,.05)'] } },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,.08)' } },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,.08)' } },
    },
    series: [{
      type: 'radar',
      data: [
        { value: d.current, name: '当前值', areaStyle: { color: 'rgba(24,144,255,.2)' }, lineStyle: { color: CT.colors[0], width: 2 }, itemStyle: { color: CT.colors[0] } },
        { value: d.target, name: '目标值', areaStyle: { color: 'rgba(250,140,22,.12)' }, lineStyle: { color: CT.colors[3], width: 2, type: 'dashed' }, itemStyle: { color: CT.colors[3] } },
      ],
    }],
  });
  return c;
};

/* ---- Procurement ---- */

SC.Charts.prTrend = function(id) {
  const dom = document.getElementById(id);
  if (!dom) return;
  const c = echarts.init(dom);
  const d = SC.procurementTrend;
  const cur = 4;
  c.setOption({
    tooltip: { ...CT.tooltip, trigger: 'axis' },
    legend: { data: ['计划金额','实际金额'], bottom: 0, textStyle: { color: CT.text, fontSize: 11 } },
    grid: { top: 20, bottom: 36, left: 48, right: 16 },
    xAxis: { type: 'category', data: d.months.map(m => m + '月'), axisLabel: { color: CT.textDim, fontSize: 10, interval: 1 } },
    yAxis: { type: 'value', name: '万元', nameTextStyle: { color: CT.textMuted, fontSize: 10 }, splitLine: { lineStyle: { color: 'rgba(255,255,255,.04)', type: 'dashed' } }, axisLabel: { color: CT.textDim, fontSize: 10 } },
    series: [
      { name: '计划金额', type: 'line', smooth: true, symbol: 'none', lineStyle: { color: CT.colors[0], width: 2, type: 'dashed' }, itemStyle: { color: CT.colors[0] }, areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(24,144,255,.06)' }, { offset: 1, color: 'rgba(24,144,255,0)' }] } }, data: d.plan },
      { name: '实际金额', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, lineStyle: { color: CT.colors[1], width: 2 }, itemStyle: { color: CT.colors[1] }, areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(19,194,194,.1)' }, { offset: 1, color: 'rgba(19,194,194,0)' }] } }, data: d.actual,
        markLine: { silent: true, symbol: 'none', lineStyle: { color: 'rgba(250,140,22,.5)', type: 'dashed' }, label: { color: CT.textDim, fontSize: 10, formatter: '本月 {c} 万' }, data: [{ xAxis: cur }] } },
    ],
  });
  return c;
};

SC.Charts.prPie = function(id) {
  const dom = document.getElementById(id);
  if (!dom) return;
  const c = echarts.init(dom);
  c.setOption({
    tooltip: { ...CT.tooltip, trigger: 'item', formatter: '{b}: {d}%' },
    legend: { orient: 'vertical', right: 4, top: 'center', itemWidth: 10, itemHeight: 10, textStyle: { color: CT.text, fontSize: 11 } },
    series: [{
      type: 'pie', radius: ['40%', '70%'], center: ['32%', '50%'], padAngle: 2,
      itemStyle: { borderRadius: 4, borderColor: '#0a1628', borderWidth: 2 },
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 12, color: '#e8edf5' } },
      data: SC.procurementPie.map((d, i) => ({ ...d, itemStyle: { color: CT.colors[i] } })),
    }],
  });
  return c;
};

SC.Charts.prStatus = function(id) {
  const dom = document.getElementById(id);
  if (!dom) return;
  const c = echarts.init(dom);
  const d = SC.procurementStatus;
  c.setOption({
    tooltip: { ...CT.tooltip, trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { top: 10, bottom: 16, left: 56, right: 16 },
    xAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(255,255,255,.04)', type: 'dashed' } }, axisLabel: { color: CT.textDim, fontSize: 10 } },
    yAxis: { type: 'category', data: d.map(v => v.status), axisLabel: { color: CT.text, fontSize: 11 } },
    series: [{
      type: 'bar', barWidth: 16,
      data: d.map((v, i) => ({
        value: v.count,
        itemStyle: { color: v.color, borderRadius: [0, 6, 6, 0] },
      })),
      label: { show: true, position: 'right', color: CT.text, fontSize: 12, fontWeight: 600, formatter: '{c}' },
    }],
  });
  return c;
};

SC.Charts.prSupplier = function(id) {
  const dom = document.getElementById(id);
  if (!dom) return;
  const c = echarts.init(dom);
  const d = SC.procurementSupplierShare.slice().reverse();
  c.setOption({
    tooltip: { ...CT.tooltip, trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: p => `${p[0].name}<br/>占比: ${p[0].value}%` },
    grid: { top: 10, bottom: 10, left: 72, right: 40 },
    xAxis: { type: 'value', axisLabel: { color: CT.textDim, fontSize: 10, formatter: '{value}%' }, splitLine: { lineStyle: { color: 'rgba(255,255,255,.04)', type: 'dashed' } } },
    yAxis: { type: 'category', data: d.map(v => v.name), axisLabel: { color: CT.text, fontSize: 11 } },
    series: [{
      type: 'bar', barWidth: 12,
      data: d.map((v, i) => ({
        value: v.val,
        itemStyle: {
          color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: `rgba(24,144,255,${.3 + (7 - i) * .08})` }, { offset: 1, color: `rgba(19,194,194,${.3 + (7 - i) * .08})` }] },
          borderRadius: [0, 6, 6, 0],
        },
      })),
      label: { show: true, position: 'right', color: CT.text, fontSize: 11, formatter: '{c}%' },
    }],
  });
  return c;
};

/* ---- Inventory ---- */

SC.Charts.invTrend = function(id) {
  const dom = document.getElementById(id);
  if (!dom) return;
  const c = echarts.init(dom);
  const d = SC.inventoryTrend;
  c.setOption({
    tooltip: { ...CT.tooltip, trigger: 'axis' },
    legend: { data: ['库存金额','安全库存线'], bottom: 0, textStyle: { color: CT.text, fontSize: 11 } },
    grid: { top: 20, bottom: 36, left: 48, right: 16 },
    xAxis: { type: 'category', data: d.months, axisLabel: { color: CT.textDim, fontSize: 10 } },
    yAxis: { type: 'value', name: '万元', nameTextStyle: { color: CT.textMuted, fontSize: 10 }, splitLine: { lineStyle: { color: 'rgba(255,255,255,.04)', type: 'dashed' } }, axisLabel: { color: CT.textDim, fontSize: 10, formatter: v => (v / 1000).toFixed(0) + 'k' } },
    series: [
      { name: '库存金额', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, lineStyle: { color: CT.colors[1], width: 2 }, itemStyle: { color: CT.colors[1] },
        areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(19,194,194,.15)' }, { offset: 1, color: 'rgba(19,194,194,0)' }] } },
        data: d.raw,
        markPoint: { symbol: 'pin', symbolSize: 40, itemStyle: { color: '#fa8c16' }, label: { color: '#fff', fontSize: 10 }, data: [{ type: 'max', name: '峰值' }] } },
      { name: '安全库存线', type: 'line', smooth: true, symbol: 'none', lineStyle: { color: CT.colors[3], width: 2, type: 'dashed' }, itemStyle: { color: CT.colors[3] }, data: d.safety },
    ],
  });
  return c;
};

SC.Charts.invAbc = function(id) {
  const dom = document.getElementById(id);
  if (!dom) return;
  const c = echarts.init(dom);
  const d = SC.inventoryABC;
  c.setOption({
    tooltip: { ...CT.tooltip, trigger: 'item', formatter: p => `${p.name}<br/>金额占比: ${p.value}%<br/>SKU数量: ${p.data.items} 种` },
    legend: { bottom: 0, textStyle: { color: CT.text, fontSize: 11 } },
    series: [{
      type: 'pie', radius: ['30%', '65%'], center: ['50%', '45%'],
      label: { formatter: '{b}\n{d}%', color: CT.text, fontSize: 11 },
      labelLine: { lineStyle: { color: 'rgba(255,255,255,.15)' } },
      emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,.5)' } },
      data: [
        { value: d[0].value, name: d[0].name, itemStyle: { color: '#ff4d4f' } },
        { value: d[1].value, name: d[1].name, itemStyle: { color: '#fa8c16' } },
        { value: d[2].value, name: d[2].name, itemStyle: { color: '#1890ff' } },
      ],
    }],
  });
  return c;
};

SC.Charts.invTurnover = function(id) {
  const dom = document.getElementById(id);
  if (!dom) return;
  const c = echarts.init(dom);
  const d = SC.inventoryTurnoverDays;
  c.setOption({
    tooltip: { ...CT.tooltip, trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { top: 10, bottom: 16, left: 16, right: 16, containLabel: true },
    xAxis: { type: 'category', data: d.categories, axisLabel: { color: CT.textDim, fontSize: 10 }, axisLine: { lineStyle: { color: CT.border } } },
    yAxis: { type: 'value', name: '天', nameTextStyle: { color: CT.textMuted, fontSize: 10 }, splitLine: { lineStyle: { color: 'rgba(255,255,255,.04)', type: 'dashed' } }, axisLabel: { color: CT.textDim, fontSize: 10 } },
    series: [{
      type: 'bar', barWidth: '40%',
      data: d.days.map((v, i) => ({
        value: v,
        itemStyle: {
          color: { type: 'linear', x: 0, y: 1, x2: 0, y2: 0, colorStops: [{ offset: 0, color: `rgba(24,144,255,${.4 + i * .1})` }, { offset: 1, color: `rgba(19,194,194,${.4 + i * .1})` }] },
          borderRadius: [4, 4, 0, 0],
        },
      })),
      label: { show: true, position: 'top', color: CT.text, fontSize: 11, formatter: '{c}天' },
      markLine: { silent: true, symbol: 'none', lineStyle: { color: 'rgba(250,140,22,.5)', type: 'dashed' }, label: { color: CT.textDim, fontSize: 10, formatter: '均值 {c}天' }, data: [{ yAxis: d.avg }] },
    }],
  });
  return c;
};

SC.Charts.invSlow = function(id) {
  const dom = document.getElementById(id);
  if (!dom) return;
  const c = echarts.init(dom);
  const d = SC.inventorySlowMoving;
  c.setOption({
    tooltip: { ...CT.tooltip, trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: p => `${p[0].name}<br/>呆滞金额: ${p[0].value} 万元` },
    grid: { top: 10, bottom: 10, left: 72, right: 40 },
    xAxis: { type: 'value', axisLabel: { color: CT.textDim, fontSize: 10, formatter: '{value}万' }, splitLine: { lineStyle: { color: 'rgba(255,255,255,.04)', type: 'dashed' } } },
    yAxis: { type: 'category', data: d.map(v => v.name).reverse(), axisLabel: { color: CT.text, fontSize: 11 } },
    series: [{
      type: 'bar', barWidth: 14,
      data: d.slice().reverse().map((v, i) => ({
        value: v.val,
        itemStyle: {
          color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: `rgba(255,77,79,${.3 + i * .12})` }, { offset: 1, color: `rgba(250,140,22,${.3 + i * .12})` }] },
          borderRadius: [0, 6, 6, 0],
        },
      })),
      label: { show: true, position: 'right', color: CT.text, fontSize: 11, formatter: '{c} 万元' },
    }],
  });
  return c;
};

/* ---- Logistics ---- */

SC.Charts.lgRegion = function(id) {
  const dom = document.getElementById(id);
  if (!dom) return;
  const c = echarts.init(dom);
  const d = SC.logisticsRegion;
  c.setOption({
    tooltip: { ...CT.tooltip, trigger: 'axis', axisPointer: { type: 'cross' } },
    legend: { data: ['平均时效(天)','目标时效(天)','准时率(%)'], bottom: 0, textStyle: { color: CT.text, fontSize: 11 } },
    grid: { top: 20, bottom: 36, left: 48, right: 50 },
    xAxis: { type: 'category', data: d.regions, axisLabel: { color: CT.textDim, fontSize: 10 } },
    yAxis: [
      { type: 'value', name: '天', min: 0, max: 7, nameTextStyle: { color: CT.textMuted, fontSize: 10 }, splitLine: { lineStyle: { color: 'rgba(255,255,255,.04)', type: 'dashed' } }, axisLabel: { color: CT.textDim, fontSize: 10 } },
      { type: 'value', name: '%', min: 70, max: 100, nameTextStyle: { color: CT.textMuted, fontSize: 10 }, splitLine: { show: false }, axisLabel: { color: CT.textDim, fontSize: 10 } },
    ],
    series: [
      { name: '平均时效(天)', type: 'bar', barWidth: '15%', itemStyle: { color: { type: 'linear', x: 0, y: 1, x2: 0, y2: 0, colorStops: [{ offset: 0, color: 'rgba(24,144,255,.6)' }, { offset: 1, color: '#1890ff' }] }, borderRadius: [4, 4, 0, 0] }, data: d.avg },
      { name: '目标时效(天)', type: 'line', smooth: true, symbol: 'diamond', symbolSize: 10, lineStyle: { color: '#fa8c16', width: 2, type: 'dashed' }, itemStyle: { color: '#fa8c16' }, data: d.target },
      { name: '准时率(%)', type: 'line', smooth: true, yAxisIndex: 1, symbol: 'circle', symbolSize: 8, lineStyle: { color: '#52c41a', width: 2 }, itemStyle: { color: '#52c41a' }, areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(82,196,26,.12)' }, { offset: 1, color: 'rgba(82,196,26,0)' }] } }, data: d.onTime },
    ],
  });
  return c;
};

SC.Charts.lgPie = function(id) {
  const dom = document.getElementById(id);
  if (!dom) return;
  const c = echarts.init(dom);
  c.setOption({
    tooltip: { ...CT.tooltip, trigger: 'item', formatter: '{b}: {d}%' },
    series: [{
      type: 'pie', radius: ['35%', '65%'], center: ['50%', '50%'],
      padAngle: 2, itemStyle: { borderRadius: 4, borderColor: '#0a1628', borderWidth: 2 },
      label: { formatter: '{b}\n{d}%', color: CT.text, fontSize: 11 },
      labelLine: { lineStyle: { color: 'rgba(255,255,255,.15)' } },
      data: SC.logisticsPie.map((d, i) => ({ ...d, itemStyle: { color: CT.colors[i] } })),
    }],
  });
  return c;
};

SC.Charts.lgCarrier = function(id) {
  const dom = document.getElementById(id);
  if (!dom) return;
  const c = echarts.init(dom);
  const d = SC.logisticsCarrier;
  c.setOption({
    tooltip: { ...CT.tooltip, trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: p => `${p[0].name}<br/>准时率: ${p[0].value}%<br/>运力占比: ${d[p[0].dataIndex].volume}%` },
    grid: { top: 10, bottom: 10, left: 72, right: 40 },
    xAxis: { type: 'value', max: 100, axisLabel: { color: CT.textDim, fontSize: 10, formatter: '{value}%' }, splitLine: { lineStyle: { color: 'rgba(255,255,255,.04)', type: 'dashed' } } },
    yAxis: { type: 'category', data: d.map(v => v.name).reverse(), axisLabel: { color: CT.text, fontSize: 11 } },
    series: [{
      type: 'bar', barWidth: 14,
      data: d.slice().reverse().map((v, i) => ({
        value: v.rate,
        itemStyle: {
          color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: `rgba(82,196,26,${.3 + (5 - i) * .1})` }, { offset: 1, color: `rgba(19,194,194,${.3 + (5 - i) * .1})` }] },
          borderRadius: [0, 6, 6, 0],
        },
      })),
      label: { show: true, position: 'right', color: CT.text, fontSize: 11, formatter: '{c}%' },
      markLine: { silent: true, symbol: 'none', lineStyle: { color: 'rgba(250,140,22,.5)', type: 'dashed' }, label: { color: CT.textDim, fontSize: 10, formatter: '目标 95%' }, data: [{ xAxis: 95 }] },
    }],
  });
  return c;
};

SC.Charts.lgTrend = function(id) {
  const dom = document.getElementById(id);
  if (!dom) return;
  const c = echarts.init(dom);
  const d = SC.logisticsTrend;
  c.setOption({
    tooltip: { ...CT.tooltip, trigger: 'axis' },
    legend: { data: ['实际费用','预算线'], bottom: 0, textStyle: { color: CT.text, fontSize: 11 } },
    grid: { top: 20, bottom: 36, left: 48, right: 16 },
    xAxis: { type: 'category', data: d.months, axisLabel: { color: CT.textDim, fontSize: 10 } },
    yAxis: { type: 'value', name: '万元', nameTextStyle: { color: CT.textMuted, fontSize: 10 }, splitLine: { lineStyle: { color: 'rgba(255,255,255,.04)', type: 'dashed' } }, axisLabel: { color: CT.textDim, fontSize: 10 } },
    series: [
      { name: '实际费用', type: 'bar', barWidth: '35%', itemStyle: { color: { type: 'linear', x: 0, y: 1, x2: 0, y2: 0, colorStops: [{ offset: 0, color: 'rgba(24,144,255,.5)' }, { offset: 1, color: '#1890ff' }] }, borderRadius: [4, 4, 0, 0] }, data: d.cost },
      { name: '预算线', type: 'line', smooth: true, symbol: 'none', lineStyle: { color: '#fa8c16', width: 2, type: 'dashed' }, itemStyle: { color: '#fa8c16' }, data: d.target },
    ],
  });
  return c;
};

/* ---- Supplier ---- */

SC.Charts.spScore = function(id) {
  const dom = document.getElementById(id);
  if (!dom) return;
  const c = echarts.init(dom);
  const d = SC.supplierScoreDist;
  c.setOption({
    tooltip: { ...CT.tooltip, trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { top: 10, bottom: 16, left: 56, right: 16 },
    xAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(255,255,255,.04)', type: 'dashed' } }, axisLabel: { color: CT.textDim, fontSize: 10 } },
    yAxis: { type: 'category', data: d.map(v => v.range).reverse(), axisLabel: { color: CT.text, fontSize: 11 } },
    series: [{
      type: 'bar', barWidth: 18,
      data: d.slice().reverse().map((v, i) => ({
        value: v.count,
        itemStyle: {
          color: [CT.colors[2], CT.colors[0], CT.colors[3], CT.colors[6], CT.colors[5]][4 - i] || CT.colors[4],
          borderRadius: [0, 6, 6, 0],
        },
      })),
      label: { show: true, position: 'right', color: CT.text, fontSize: 12, fontWeight: 600, formatter: '{c} 家' },
    }],
  });
  return c;
};

SC.Charts.spLevel = function(id) {
  const dom = document.getElementById(id);
  if (!dom) return;
  const c = echarts.init(dom);
  c.setOption({
    tooltip: { ...CT.tooltip, trigger: 'item', formatter: '{b}: {c} 家 ({d}%)' },
    legend: { bottom: 0, textStyle: { color: CT.text, fontSize: 11 } },
    series: [{
      type: 'pie', radius: ['35%', '65%'], center: ['50%', '45%'],
      padAngle: 2, itemStyle: { borderRadius: 4, borderColor: '#0a1628', borderWidth: 2 },
      label: { formatter: '{b}\n{d}%', color: CT.text, fontSize: 11 },
      labelLine: { lineStyle: { color: 'rgba(255,255,255,.15)' } },
      data: SC.supplierLevel,
    }],
  });
  return c;
};

SC.Charts.spCoverage = function(id) {
  const dom = document.getElementById(id);
  if (!dom) return;
  const c = echarts.init(dom);
  const d = SC.supplierCoverage;
  c.setOption({
    tooltip: { ...CT.tooltip, trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { top: 10, bottom: 10, left: 72, right: 40 },
    xAxis: { type: 'value', axisLabel: { color: CT.textDim, fontSize: 10 }, splitLine: { lineStyle: { color: 'rgba(255,255,255,.04)', type: 'dashed' } } },
    yAxis: { type: 'category', data: d.map(v => v.category).reverse(), axisLabel: { color: CT.text, fontSize: 11 } },
    series: [{
      type: 'bar', barWidth: 12,
      data: d.slice().reverse().map((v, i) => ({
        value: v.count,
        itemStyle: {
          color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: `rgba(114,46,209,${.3 + (6 - i) * .08})` }, { offset: 1, color: `rgba(24,144,255,${.3 + (6 - i) * .08})` }] },
          borderRadius: [0, 6, 6, 0],
        },
      })),
      label: { show: true, position: 'right', color: CT.text, fontSize: 11, formatter: '{c} 家' },
    }],
  });
  return c;
};

SC.Charts.spRisk = function(id) {
  const dom = document.getElementById(id);
  if (!dom) return;
  const c = echarts.init(dom);
  const d = SC.supplierRisk;
  c.setOption({
    tooltip: { ...CT.tooltip, formatter: p => {
      const d = p.data;
      return `<strong>${d.name}</strong><br/>财务风险: ${d.value[0]}<br/>交付风险: ${d.value[1]}`;
    } },
    grid: { top: 20, bottom: 20, left: 48, right: 20 },
    xAxis: { type: 'value', name: '财务风险 →', nameLocation: 'center', nameGap: 25, min: 0, max: 100, nameTextStyle: { color: CT.textMuted, fontSize: 11 }, splitLine: { lineStyle: { color: 'rgba(255,255,255,.04)', type: 'dashed' } }, axisLabel: { color: CT.textDim, fontSize: 10 } },
    yAxis: { type: 'value', name: '交付风险 →', nameLocation: 'center', nameGap: 35, min: 0, max: 100, nameTextStyle: { color: CT.textMuted, fontSize: 11 }, splitLine: { lineStyle: { color: 'rgba(255,255,255,.04)', type: 'dashed' } }, axisLabel: { color: CT.textDim, fontSize: 10 } },
    series: [{
      type: 'scatter',
      symbolSize: function(d) { return 12 + (d[0] + d[1]) / 20; },
      data: d.map(v => ({
        value: [v.finance, v.delivery],
        name: v.name,
        itemStyle: {
          color: (v.finance > 60 && v.delivery > 60) ? '#ff4d4f' :
                 (v.finance > 50 || v.delivery > 50) ? '#fa8c16' : '#52c41a',
          shadowBlur: 6,
          shadowColor: 'rgba(0,0,0,.3)',
        },
      })),
      markArea: {
        silent: true,
        itemStyle: { color: 'rgba(255,77,79,.06)' },
        data: [[{ xAxis: 60, yAxis: 60 }, { xAxis: 100, yAxis: 100 }]],
      },
      label: { show: true, formatter: p => p.data.name, position: 'right', color: CT.text, fontSize: 10 },
    }],
  });
  return c;
};

/* ============================================================
   Init all visible charts
   ============================================================ */
SC.Charts.init = function(pageId) {
  const charts = [];
  switch (pageId) {
    case 'overview':
      charts.push(SC.Charts.ovTrend('ovTrend'));
      charts.push(SC.Charts.ovPie('ovPie'));
      charts.push(SC.Charts.ovBar('ovBar'));
      charts.push(SC.Charts.ovRadar('ovRadar'));
      break;
    case 'procurement':
      charts.push(SC.Charts.prTrend('prTrend'));
      charts.push(SC.Charts.prPie('prPie'));
      charts.push(SC.Charts.prStatus('prStatus'));
      charts.push(SC.Charts.prSupplier('prSupplier'));
      break;
    case 'inventory':
      charts.push(SC.Charts.invTrend('invTrend'));
      charts.push(SC.Charts.invAbc('invAbc'));
      charts.push(SC.Charts.invTurnover('invTurnover'));
      charts.push(SC.Charts.invSlow('invSlow'));
      break;
    case 'logistics':
      charts.push(SC.Charts.lgRegion('lgRegion'));
      charts.push(SC.Charts.lgPie('lgPie'));
      charts.push(SC.Charts.lgCarrier('lgCarrier'));
      charts.push(SC.Charts.lgTrend('lgTrend'));
      break;
    case 'supplier':
      charts.push(SC.Charts.spScore('spScore'));
      charts.push(SC.Charts.spLevel('spLevel'));
      charts.push(SC.Charts.spCoverage('spCoverage'));
      charts.push(SC.Charts.spRisk('spRisk'));
      break;
  }
  return charts.filter(Boolean);
};
