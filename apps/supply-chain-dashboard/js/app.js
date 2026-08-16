/* ============================================================
   SC App - Application Shell
   ============================================================ */
const SC = window.SC || {};
SC.App = {};

/* ---- State ---- */
SC.App.state = {
  currentPage: 'overview',
  charts: [],      // active echarts instances
  chartCache: {},  // page -> [charts]
};

/* ---- DOM refs ---- */
SC.App.$ = function(s) { return document.querySelector(s); };
SC.App.$$ = function(s) { return document.querySelectorAll(s); };

/* ============================================================
   Loading
   ============================================================ */
SC.App.showLoading = function(done) {
  const mask = document.getElementById('loadingScreen');
  const progressEl = document.getElementById('loadProgress');
  let p = 0;
  const iv = setInterval(function() {
    p += 2 + Math.floor(Math.random() * 5);
    if (p > 100) p = 100;
    if (progressEl) progressEl.textContent = p;
    if (p >= 100) {
      clearInterval(iv);
      mask.classList.add('hide');
      if (done) done();
    }
  }, 40);
};

/* ============================================================
   Clock
   ============================================================ */
SC.App.updateClock = function() {
  const el = document.getElementById('liveTime');
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit' });
};

/* ============================================================
   KPI Renderer
   ============================================================ */
SC.App.renderKPI = function(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = data.map(function(k) {
    const changeIcon = k.up ? '▲' : '▼';
    const changeCls = k.up ? 'up' : 'down';
    return `<div class="kpi-card" data-kpi-id="${k.id}" style="--kpi-color:${k.color}">
      <div class="kpi-top">
        <div class="kpi-label"><span class="icon">${k.icon}</span> ${k.label}</div>
        ${k.badge ? `<span class="kpi-badge ${k.badgeType}">${k.badge}</span>` : ''}
      </div>
      <div class="kpi-value"><span class="kpi-num" data-target="${k.val}">0</span><span class="unit">${k.unit}</span></div>
      <div class="kpi-change ${changeCls}">${changeIcon} ${Math.abs(k.change)}${k.unit ? '%' : ''} 环比</div>
      <div class="kpi-sub">${k.sub || ''}</div>
    </div>`;
  }).join('');

  // Animate numbers
  container.querySelectorAll('.kpi-num').forEach(function(el) {
    var target = parseFloat(el.getAttribute('data-target'));
    SC.App.animateNumber(el, target, 1000);
  });
};

/* ---- Number animation ---- */
SC.App.animateNumber = function(el, target, duration) {
  var start = 0, startTime = performance.now();
  function tick(now) {
    var p = Math.min((now - startTime) / duration, 1);
    var ease = 1 - Math.pow(1 - p, 3);
    var val = start + (target - start) * ease;
    el.textContent = target % 1 === 0 ? Math.round(val) : val.toFixed(1);
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = target % 1 === 0 ? Math.round(target) : target.toFixed(1);
  }
  requestAnimationFrame(tick);
};

/* ============================================================
   Table Renderer
   ============================================================ */
SC.App.renderTable = function(containerId, headers, rows, formatters) {
  var container = document.getElementById(containerId);
  if (!container) return;
  var h = '<thead><tr>' + headers.map(function(h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead>';
  var b = '<tbody>' + rows.map(function(row) {
    return '<tr>' + row.map(function(cell, ci) {
      if (formatters && formatters[ci]) return '<td>' + formatters[ci](cell) + '</td>';
      return '<td>' + (cell != null ? cell : '-') + '</td>';
    }).join('') + '</tr>';
  }).join('') + '</tbody>';
  container.innerHTML = h + b;
};

/* ---- Status tag helper ---- */
SC.App.statusTag = function(text, type) {
  return '<span class="status-tag ' + type + '">' + text + '</span>';
};

/* ---- Money formatter ---- */
SC.App.fmtMoney = function(v) {
  return '¥' + Number(v).toLocaleString('zh-CN', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
};

/* ============================================================
   Page Navigation
   ============================================================ */
SC.App.switchPage = function(pageId) {
  if (SC.App.state.currentPage === pageId) return;

  // Update tabs
  document.querySelectorAll('.tab').forEach(function(t) {
    t.classList.toggle('active', t.getAttribute('data-page') === pageId);
  });

  // Update pages
  document.querySelectorAll('.page').forEach(function(p) {
    p.classList.toggle('active', p.getAttribute('data-page') === pageId);
  });

  // Update header title
  var titles = { overview:'总览', procurement:'采购管理', inventory:'库存管理', logistics:'物流配送', supplier:'供应商管理' };
  var titleEl = document.getElementById('pageTitle');
  if (titleEl) titleEl.textContent = titles[pageId] || '总览';

  SC.App.state.currentPage = pageId;

  // Init charts for this page
  SC.App.initPageCharts(pageId);
};

/* ============================================================
   Chart Lifecycle
   ============================================================ */
SC.App.initPageCharts = function(pageId) {
  // Dispose previous charts
  SC.App.state.charts.forEach(function(c) { try { c.dispose(); } catch(e) {} });
  SC.App.state.charts = [];

  // Check cache
  if (SC.App.state.chartCache[pageId]) {
    SC.App.state.charts = SC.App.state.chartCache[pageId];
    return;
  }

  // Allow a small delay for DOM rendering
  setTimeout(function() {
    var newCharts = SC.Charts.init(pageId) || [];
    SC.App.state.charts = newCharts;
    SC.App.state.chartCache[pageId] = newCharts;
  }, 100);
};

/* ============================================================
   Init specific page tables
   ============================================================ */
SC.App.initTables = function() {
  // Procurement orders table
  SC.App.renderTable('prTable',
    ['订单号', '供应商', '品类', '金额', '状态', '日期'],
    SC.procurementOrders.map(function(o) {
      var st = { '待审批':'orange', '已审批':'blue', '在途':'cyan', '已到货':'green', '已验收':'purple' };
      return [o.id, o.supplier, o.category, SC.App.fmtMoney(o.amount), SC.App.statusTag(o.status, st[o.status]||'blue'), o.date];
    })
  );

  // Inventory alerts table
  SC.App.renderTable('invTable',
    ['SKU', '名称', '品类', '当前库存', '安全库存', '缺货量'],
    SC.inventoryAlerts.map(function(o) {
      return [o.sku, o.name, o.category, o.stock, o.safety, '<span style="color:#ff4d4f;font-weight:600">' + o.shortage + '</span>'];
    })
  );

  // High-risk supplier table
  SC.App.renderTable('spTable',
    ['供应商名称', '综合评分', '等级', '风险类型', '处理状态'],
    SC.supplierHighRisk.map(function(o) {
      var lv = { 'D':'red', 'C':'orange' };
      return [o.name, o.score, SC.App.statusTag(o.level, lv[o.level]||'blue'), o.risk, o.status];
    })
  );
};

/* ============================================================
   Real-time data refresh simulation
   ============================================================ */
SC.App.startLiveUpdate = function() {
  setInterval(function() {
    // Update KPI numbers with random drift
    document.querySelectorAll('.page.active .kpi-num').forEach(function(el) {
      var target = parseFloat(el.getAttribute('data-target'));
      var current = parseFloat(el.textContent) || target;
      var drift = (Math.random() - 0.5) * target * 0.01;
      var newVal = target + drift;
      el.textContent = target % 1 === 0 ? Math.round(newVal) : newVal.toFixed(1);
    });
  }, 10000);
};

/* ============================================================
   Toast
   ============================================================ */
SC.App.toast = function(msg, icon) {
  var existing = document.querySelector('.toast');
  if (existing) existing.remove();

  var t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = (icon ? '<span class="t-icon">' + icon + '</span>' : '') + msg;
  document.body.appendChild(t);
  requestAnimationFrame(function() { t.classList.add('show'); });
  setTimeout(function() { t.classList.remove('show'); setTimeout(function() { t.remove(); }, 300); }, 2000);
};

/* ============================================================
   Drill-Down Modal
   ============================================================ */

/* ---- Show modal for a KPI ---- */
SC.App.showDrillDown = function(kpiId) {
  var data = SC.drillDown[kpiId];
  if (!data) return;

  var overlay = document.getElementById('drillModal');
  var icon = document.getElementById('modalIcon');
  var title = document.getElementById('modalTitle');
  var body = document.getElementById('modalBody');

  // Set header
  var kpi = SC.overviewKPI.find(function(k) { return k.id === kpiId; });
  if (icon) icon.textContent = kpi ? kpi.icon : '📊';
  if (title) title.textContent = data.title;

  // Render body
  if (body) {
    body.innerHTML = SC.App.renderDrillContent(kpiId, data);
    // Animate bars after DOM insert
    requestAnimationFrame(function() {
      body.querySelectorAll('.comp-bar, .cr-fill, .mini-bar-item .bar').forEach(function(el) {
        var w = el.getAttribute('data-width');
        if (w) el.style.width = w + '%';
        var h = el.getAttribute('data-height');
        if (h) el.style.height = h + 'px';
      });
    });
  }

  // Show
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
};

/* ---- Close modal ---- */
SC.App.closeDrillDown = function() {
  var overlay = document.getElementById('drillModal');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
};

/* ---- Render drill-down body content ---- */
SC.App.renderDrillContent = function(kpiId, d) {
  var html = '';

  // Hero value
  html += '<div class="modal-section"><div class="modal-value-hero">' +
    '<span class="num">' + d.value + '</span><span class="unit">' + d.unit + '</span></div></div>';

  // Formula
  if (d.formula) {
    html += '<div class="modal-section"><div class="modal-section-title">计算公式</div>' +
      '<div class="modal-formula">' + d.formula + '</div></div>';
  }

  // Components / breakdown
  if (d.components) {
    var maxVal = Math.max.apply(null, d.components.map(function(c) { return c.pct; }));
    html += '<div class="modal-section"><div class="modal-section-title">成本构成</div><div class="comp-list">';
    d.components.forEach(function(c) {
      var pctW = (c.pct / maxVal * 100);
      html += '<div class="comp-item">' +
        '<span class="comp-name">' + c.name + '</span>' +
        '<div class="comp-bar-wrap"><div class="comp-bar" style="width:0%;background:' + c.color + '" data-width="' + pctW + '"></div></div>' +
        '<span class="comp-info"><strong>' + c.value.toLocaleString() + '</strong> 万元</span>' +
        '<span class="comp-info" style="width:36px">' + c.pct + '%</span>' +
        '</div>';
    });
    html += '</div></div>';
  }

  // Steps (calculation process)
  if (d.steps) {
    html += '<div class="modal-section"><div class="modal-section-title">计算过程</div><div class="steps-list">';
    d.steps.forEach(function(s) {
      html += '<div class="step-item">' +
        '<span class="step-label">' + s.label + '</span>' +
        '<span class="step-value">' + s.value +
          (s.detail ? '<span class="step-detail">' + s.detail + '</span>' : '') +
        '</span></div>';
    });
    html += '</div></div>';
  }

  // Comparison
  if (d.comparison) {
    var c = d.comparison;
    var arrow = c.direction === 'up' ? '▲' : '▼';
    var cls = c.direction === 'up' ? 'up' : 'down';
    html += '<div class="modal-section"><div class="modal-section-title">环比对比</div>' +
      '<div class="comp-row">' +
      '<span class="cr-label">' + (c.label || '上月') + '</span>' +
      '<span class="cr-value">' + c.value + '</span>' +
      '<span class="cr-change ' + cls + '">' + arrow + ' ' + c.change + '%</span>' +
      '</div></div>';
  }

  // Trend mini bars
  if (d.trend && d.trendLabels) {
    var maxT = Math.max.apply(null, d.trend);
    html += '<div class="modal-section"><div class="modal-section-title">近半年趋势</div><div class="mini-bars">';
    d.trend.forEach(function(v, i) {
      var h = Math.max(4, v / maxT * 80);
      html += '<div class="mini-bar-item"><div class="bar" style="height:2px;background:' +
        (i === d.trend.length - 1 ? '#1890ff' : 'rgba(24,144,255,.4)') +
        '" data-height="' + h + '"></div>' +
        '<span class="bar-label">' + d.trendLabels[i] + '</span></div>';
    });
    html += '</div></div>';
  }

  // Industry average comparison
  if (d.industryAvg !== undefined) {
    html += '<div class="modal-section"><div class="modal-section-title">行业对比</div><div class="industry-comp">' +
      '<div class="ic-item"><div class="ic-num">' + d.value + '</div><div class="ic-label">本企业</div></div>' +
      '<div class="ic-item"><div class="ic-num" style="color:#fa8c16">' + d.industryAvg + '</div><div class="ic-label">行业均值</div></div>' +
      (d.industryMax ? '<div class="ic-item"><div class="ic-num" style="color:#52c41a">' + d.industryMax + '</div><div class="ic-label">行业标杆</div></div>' : '') +
      '</div></div>';
  }

  // Gap indicator (for 履约率 %)
  if (d.gap) {
    html += '<div class="modal-section"><div class="modal-section-title">与目标差距</div>' +
      '<div class="gap-indicator">' +
      '<div class="gi-item"><div class="gi-num" style="color:' + (d.gap.current >= d.gap.target ? '#52c41a' : '#fa8c16') + '">' + d.gap.current + '%</div><div class="gi-label">当前值</div></div>' +
      '<span class="gi-arrow">→</span>' +
      '<div class="gi-item"><div class="gi-num" style="color:#1890ff">' + d.gap.target + '%</div><div class="gi-label">目标值</div></div>' +
      '<span class="gi-arrow">→</span>' +
      '<div class="gi-item gi-gap"><div class="gi-num">' + d.gap.shortfall + 'pp</div><div class="gi-label">差距</div></div>' +
      '</div></div>';
  }

  // Carrier breakdown
  if (d.carriers) {
    html += '<div class="modal-section"><div class="modal-section-title">承运商准时率明细</div><div class="carrier-list">';
    d.carriers.forEach(function(c) {
      html += '<div class="carrier-row">' +
        '<span class="cr-name">' + c.name + '</span>' +
        '<div class="cr-bar"><div class="cr-fill" style="width:0%;background:' +
          (c.rate >= 95 ? '#52c41a' : c.rate >= 90 ? '#fa8c16' : '#ff4d4f') +
          '" data-width="' + c.rate + '"></div></div>' +
        '<span class="cr-rate">' + c.rate + '%</span></div>';
    });
    html += '</div></div>';
  }

  // Source
  if (d.source) {
    html += '<div class="modal-source">' + d.source + '</div>';
  }

  return html;
};

/* ============================================================
   Init
   ============================================================ */
SC.App.init = function() {
  var self = this;

  // Clock
  self.updateClock();
  setInterval(self.updateClock.bind(self), 1000);

  // Refresh button
  var refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', function() {
      refreshBtn.classList.add('spin');
      setTimeout(function() { refreshBtn.classList.remove('spin'); }, 500);
      self.toast('数据已刷新', '🔄');

      // Clear chart cache, re-init
      self.state.chartCache = {};
      // Force re-init of current page after cache clear
      var cur = self.state.currentPage;
      setTimeout(function() { self.initPageCharts(cur); }, 200);
    });
  }

  // Menu / Drawer
  var menuBtn = document.getElementById('menuBtn');
  var drawerOverlay = document.getElementById('drawerOverlay');
  var drawer = document.getElementById('drawer');
  if (menuBtn && drawerOverlay && drawer) {
    var openDrawer = function() {
      drawer.classList.add('open');
      drawerOverlay.classList.add('open');
    };
    var closeDrawer = function() {
      drawer.classList.remove('open');
      drawerOverlay.classList.remove('open');
    };
    menuBtn.addEventListener('click', openDrawer);
    drawerOverlay.addEventListener('click', closeDrawer);
  }

  // Tab navigation
  document.querySelectorAll('.tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      var page = tab.getAttribute('data-page');
      self.switchPage(page);
    });
  });

  // KPI Click drill-down (event delegation)
  document.querySelectorAll('.kpi-grid').forEach(function(grid) {
    grid.addEventListener('click', function(e) {
      var card = e.target.closest('.kpi-card');
      if (card) {
        var kpiId = card.getAttribute('data-kpi-id');
        if (kpiId && SC.drillDown && SC.drillDown[kpiId]) {
          self.showDrillDown(kpiId);
        }
      }
    });
  });

  // Modal close
  var modalOverlay = document.getElementById('drillModal');
  var modalClose = document.getElementById('modalClose');
  if (modalClose) {
    modalClose.addEventListener('click', self.closeDrillDown);
  }
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function(e) {
      if (e.target === modalOverlay) self.closeDrillDown();
    });
  }

  // ---- Render initial page (overview) ----
  self.renderKPI('ovKpi', SC.overviewKPI);
  self.initTables();

  // Init charts after KPI animation settles
  setTimeout(function() {
    self.initPageCharts('overview');
    self.startLiveUpdate();
  }, 400);

  // Resize handler
  var resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      self.state.charts.forEach(function(c) {
        try { if (c.resize) c.resize(); } catch(e) {}
      });
    }, 200);
  });
};

/* ============================================================
   Boot
   ============================================================ */
document.addEventListener('DOMContentLoaded', function() {
  SC.App.showLoading(function() {
    SC.App.init();
  });
});
