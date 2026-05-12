const STORAGE_KEYS = {
  cart: "mamma-mia-cart",
  mode: "mamma-mia-order-mode",
  promo: "mamma-mia-promo-code",
  customer: "mamma-mia-customer",
  orders: "mamma-mia-orders"
};

const ORDER_MODES = {
  delivery: {
    label: "外卖配送",
    hint: "当前为外卖配送，满 ¥168 免配送费，预计 30-45 分钟送达。",
    feeLabel: "配送费",
    timeLabel: "送达时间"
  },
  pickup: {
    label: "门店自取",
    hint: "当前为门店自取，到店前 5 分钟会开始最后复烤，自取默认免配送费。",
    feeLabel: "自取服务",
    timeLabel: "取餐时间"
  },
  dinein: {
    label: "堂食预订",
    hint: "当前为堂食预订，我们会按到店时间为你保留餐位并优先安排出炉。",
    feeLabel: "预订服务",
    timeLabel: "到店时间"
  }
};

const CATEGORY_PRODUCTS = {
  classic: ["margherita", "italian-sausage", "quattro-formaggi"],
  meat: ["volcano-sausage", "beef-bacon", "herb-chicken"],
  veggie: ["truffle-mushroom", "garden-veggie", "spinach-pesto"],
  snacks: ["potato-wedges", "buffalo-wings", "baked-mushroom"],
  salad: ["caesar-salad", "pumpkin-salad", "burrata-fruit"],
  dessert: ["tiramisu", "brownie", "apple-roll"],
  drinks: ["lemon-sparkling", "iced-tea", "latte"]
};

const PRODUCT_CATALOG = {
  margherita: {
    id: "margherita",
    category: "classic",
    name: "玛格丽特披萨",
    desc: "番茄、莫扎里拉、罗勒的经典组合，轻盈耐吃。",
    serve: "适合 1-2 人",
    extra: "可加芝士边、罗勒酱",
    isPizza: true,
    sizes: [
      { label: "6寸", price: 58 },
      { label: "9寸", price: 76 },
      { label: "12寸", price: 96 }
    ]
  },
  "italian-sausage": {
    id: "italian-sausage",
    category: "classic",
    name: "意式风情披萨",
    desc: "番茄底配意式香肠和甜椒，风味明快，老少都容易接受。",
    serve: "适合 2-3 人",
    extra: "可加双倍香肠",
    isPizza: true,
    sizes: [
      { label: "9寸", price: 66 },
      { label: "12寸", price: 88 }
    ]
  },
  "quattro-formaggi": {
    id: "quattro-formaggi",
    category: "classic",
    name: "四重芝士披萨",
    desc: "莫扎里拉、切达、帕玛森与蓝纹，奶香饱满又不厚重。",
    serve: "适合 1-2 人",
    extra: "可加蜂蜜脆核桃",
    isPizza: true,
    sizes: [
      { label: "6寸", price: 78 },
      { label: "9寸", price: 96 },
      { label: "12寸", price: 118 }
    ]
  },
  "volcano-sausage": {
    id: "volcano-sausage",
    category: "meat",
    name: "火山辣香肠披萨",
    desc: "意式辣香肠、双倍芝士和番茄底，香辣感干净利落。",
    serve: "适合 2-3 人",
    extra: "可加墨西哥辣椒",
    isPizza: true,
    sizes: [
      { label: "9寸", price: 72 },
      { label: "12寸", price: 98 }
    ]
  },
  "beef-bacon": {
    id: "beef-bacon",
    category: "meat",
    name: "培根牛肉拼盘披萨",
    desc: "烟熏培根与牛肉粒双重咸香，聚会很受欢迎。",
    serve: "适合 2-4 人",
    extra: "可加洋葱、黑橄榄",
    isPizza: true,
    sizes: [
      { label: "9寸", price: 82 },
      { label: "12寸", price: 108 }
    ]
  },
  "herb-chicken": {
    id: "herb-chicken",
    category: "meat",
    name: "烤鸡青酱披萨",
    desc: "香草烤鸡和青酱的组合，风味更清爽、更有层次。",
    serve: "适合 2-3 人",
    extra: "可升级薄脆饼底",
    isPizza: true,
    sizes: [
      { label: "9寸", price: 76 },
      { label: "12寸", price: 102 }
    ]
  },
  "truffle-mushroom": {
    id: "truffle-mushroom",
    category: "veggie",
    name: "松露蘑菇披萨",
    desc: "蘑菇鲜味和松露香气平衡得刚刚好，回味很细腻。",
    serve: "适合 1-2 人",
    extra: "可加温泉蛋",
    isPizza: true,
    sizes: [
      { label: "6寸", price: 84 },
      { label: "9寸", price: 102 },
      { label: "12寸", price: 124 }
    ]
  },
  "garden-veggie": {
    id: "garden-veggie",
    category: "veggie",
    name: "田园蔬菜披萨",
    desc: "彩椒、洋葱、蘑菇、玉米与番茄底，口感鲜甜。",
    serve: "适合 1-2 人",
    extra: "可加菲达芝士",
    isPizza: true,
    sizes: [
      { label: "6寸", price: 62 },
      { label: "9寸", price: 82 },
      { label: "12寸", price: 102 }
    ]
  },
  "spinach-pesto": {
    id: "spinach-pesto",
    category: "veggie",
    name: "青酱菠菜芝士披萨",
    desc: "菠菜、青酱和莫扎里拉，轻盈但不会寡淡。",
    serve: "适合 2-3 人",
    extra: "可加烤南瓜",
    isPizza: true,
    sizes: [
      { label: "9寸", price: 68 },
      { label: "12寸", price: 92 }
    ]
  },
  "cheese-bacon-half": {
    id: "cheese-bacon-half",
    category: "classic",
    name: "芝士培根双拼",
    desc: "一半浓郁四重芝士，一半烟熏培根洋葱，适合两种口味都想要的人。",
    serve: "适合 2-3 人",
    extra: "双拼可换半边口味",
    isPizza: true,
    sizes: [
      { label: "9寸", price: 76 },
      { label: "12寸", price: 104 }
    ]
  },
  hawaiian: {
    id: "hawaiian",
    category: "classic",
    name: "夏威夷风味",
    desc: "火腿、菠萝、马苏里拉，酸甜风味很讨小朋友和第一次尝试的人喜欢。",
    serve: "适合 1-2 人",
    extra: "可加玉米或培根",
    isPizza: true,
    sizes: [
      { label: "6寸", price: 68 },
      { label: "9寸", price: 88 },
      { label: "12寸", price: 108 }
    ]
  },
  "seafood-platter": {
    id: "seafood-platter",
    category: "classic",
    name: "海鲜拼盘披萨",
    desc: "虾仁、鱿鱼、蒜香白酱和焦香芝士组合，口感鲜甜，适合分享。",
    serve: "适合 2-4 人",
    extra: "可加蒜香奶酱",
    isPizza: true,
    sizes: [
      { label: "9寸", price: 88 },
      { label: "12寸", price: 118 }
    ]
  },
  "potato-wedges": {
    id: "potato-wedges",
    category: "snacks",
    name: "蒜香黄油薯角",
    desc: "外酥里糯，搭配蒜香黄油和帕玛森碎，特别适合分享。",
    serve: "加餐首选",
    extra: "可加辣味蛋黄酱",
    isPizza: false,
    sizes: [{ label: "标准份", price: 22 }]
  },
  "buffalo-wings": {
    id: "buffalo-wings",
    category: "snacks",
    name: "水牛城辣鸡翅",
    desc: "微辣开胃，表皮焦香，和冰饮一起点刚刚好。",
    serve: "适合分享",
    extra: "可选无骨版本",
    isPizza: false,
    sizes: [
      { label: "6 只", price: 32 },
      { label: "12 只", price: 56 }
    ]
  },
  "baked-mushroom": {
    id: "baked-mushroom",
    category: "snacks",
    name: "芝士焗蘑菇",
    desc: "奶香浓郁，出炉后带一点咕嘟咕嘟的热气，口感很治愈。",
    serve: "适合 1-2 人",
    extra: "可加蒜香面包",
    isPizza: false,
    sizes: [{ label: "标准份", price: 28 }]
  },
  "caesar-salad": {
    id: "caesar-salad",
    category: "salad",
    name: "凯撒沙拉",
    desc: "罗马生菜、面包丁、培根脆片与凯撒酱，平衡披萨的浓郁感。",
    serve: "轻食搭配",
    extra: "可加烤鸡胸",
    isPizza: false,
    sizes: [
      { label: "单人份", price: 26 },
      { label: "双人份", price: 39 }
    ]
  },
  "pumpkin-salad": {
    id: "pumpkin-salad",
    category: "salad",
    name: "烤南瓜芝麻菜沙拉",
    desc: "暖烤南瓜、芝麻菜和轻乳酪，适合喜欢清爽口感的人。",
    serve: "素食友好",
    extra: "可加坚果碎",
    isPizza: false,
    sizes: [
      { label: "单人份", price: 29 },
      { label: "双人份", price: 42 }
    ]
  },
  "burrata-fruit": {
    id: "burrata-fruit",
    category: "salad",
    name: "水果布拉塔沙拉",
    desc: "布拉塔芝士搭配时令水果，甜润和奶香都很舒服。",
    serve: "适合分享",
    extra: "限量供应",
    isPizza: false,
    sizes: [{ label: "标准份", price: 38 }]
  },
  tiramisu: {
    id: "tiramisu",
    category: "dessert",
    name: "提拉米苏",
    desc: "酒香和咖啡香恰到好处，作为一顿饭的结尾很温柔。",
    serve: "店内人气",
    extra: "可做低糖版",
    isPizza: false,
    sizes: [{ label: "单份", price: 26 }]
  },
  brownie: {
    id: "brownie",
    category: "dessert",
    name: "岩浆巧克力布朗尼",
    desc: "热热的巧克力流心搭配香草冰淇淋，甜度很满足。",
    serve: "适合分享",
    extra: "可加榛果碎",
    isPizza: false,
    sizes: [{ label: "单份", price: 28 }]
  },
  "apple-roll": {
    id: "apple-roll",
    category: "dessert",
    name: "肉桂苹果披萨卷",
    desc: "披萨面团延展出的甜口小点，外脆内软，很有记忆点。",
    serve: "下午茶推荐",
    extra: "可搭香草酱",
    isPizza: false,
    sizes: [{ label: "4 个装", price: 24 }]
  },
  "lemon-sparkling": {
    id: "lemon-sparkling",
    category: "drinks",
    name: "自制柠檬气泡饮",
    desc: "清爽解腻，带一点果皮香，搭配芝士披萨尤其舒服。",
    serve: "冰饮",
    extra: "可做低糖",
    isPizza: false,
    sizes: [
      { label: "中杯", price: 16 },
      { label: "大杯", price: 20 }
    ]
  },
  "iced-tea": {
    id: "iced-tea",
    category: "drinks",
    name: "冰镇手冲茶",
    desc: "带有茶香和回甘，不抢主食风头，也不会显得寡淡。",
    serve: "堂食推荐",
    extra: "可选白桃风味",
    isPizza: false,
    sizes: [
      { label: "单杯", price: 18 },
      { label: "分享壶", price: 34 }
    ]
  },
  latte: {
    id: "latte",
    category: "drinks",
    name: "意式拿铁",
    desc: "奶香柔和，适合午餐套餐和甜品搭配。",
    serve: "全天供应",
    extra: "可加燕麦奶",
    isPizza: false,
    sizes: [
      { label: "热", price: 22 },
      { label: "冰", price: 24 }
    ]
  }
};

const state = {
  currentCategory: "classic",
  selectedSizes: {},
  cart: loadStorage(STORAGE_KEYS.cart, []),
  orderMode: loadStorage(STORAGE_KEYS.mode, "delivery"),
  promoCode: loadStorage(STORAGE_KEYS.promo, ""),
  customer: loadStorage(STORAGE_KEYS.customer, {
    customerName: "",
    customerPhone: "",
    deliveryAddress: "",
    serviceTime: "尽快安排",
    guestCount: "2 位",
    paymentMethod: "到店付款 / 货到付款",
    tableware: "按人数准备",
    orderNote: ""
  }),
  promoMessage: "支持首单立减、自取折扣和午餐套餐优惠。",
  promoSeverity: "neutral"
};

const menuGrid = document.getElementById("menu-grid");
const tabButtons = document.querySelectorAll("[data-category]");
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const header = document.querySelector("[data-header]");
const cartDrawer = document.querySelector("[data-cart-drawer]");
const cartOverlay = document.querySelector("[data-cart-overlay]");
const cartItemsContainer = document.querySelector("[data-cart-items]");
const cartEmpty = document.querySelector("[data-cart-empty]");
const cartCountNodes = document.querySelectorAll("[data-cart-count]");
const orderModeHint = document.querySelector("[data-order-mode-hint]");
const orderModeBadge = document.querySelector("[data-order-mode-badge]");
const cartSummaryCount = document.querySelector("[data-cart-summary-count]");
const modeButtons = document.querySelectorAll("[data-order-mode]");
const promoCodeInput = document.getElementById("promo-code");
const promoFeedback = document.querySelector("[data-promo-feedback]");
const checkoutForm = document.getElementById("checkout-form");
const timeLabel = document.querySelector("[data-time-label]");
const summarySubtotal = document.querySelector("[data-summary-subtotal]");
const summaryDiscount = document.querySelector("[data-summary-discount]");
const summaryFee = document.querySelector("[data-summary-fee]");
const summaryFeeLabel = document.querySelector("[data-summary-fee-label]");
const summaryTotal = document.querySelector("[data-summary-total]");
const checkoutNote = document.querySelector(".checkout-note");
const orderModal = document.querySelector("[data-order-modal]");
const orderIdNode = document.querySelector("[data-order-id]");
const orderTotalNode = document.querySelector("[data-order-total]");
const orderSummaryText = document.querySelector("[data-order-summary-text]");
const orderSuccessMessage = document.querySelector("[data-order-success-message]");
const orderEmailLink = document.querySelector("[data-order-email]");

function loadStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
}

function saveStorage(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function formatCurrency(value) {
  return `¥${Math.max(0, Math.round(value))}`;
}

function getProduct(productId) {
  return PRODUCT_CATALOG[productId];
}

function getDefaultSize(productId) {
  const product = getProduct(productId);
  return product ? product.sizes[0].label : "";
}

function getSelectedSize(productId) {
  return state.selectedSizes[productId] || getDefaultSize(productId);
}

function getSizeOption(product, sizeLabel) {
  return product.sizes.find((size) => size.label === sizeLabel) || product.sizes[0];
}

function getCartCount() {
  return state.cart.reduce((total, item) => total + item.qty, 0);
}

function getPizzaCount() {
  return state.cart.reduce((total, item) => {
    const product = getProduct(item.productId);
    return total + (product && product.isPizza ? item.qty : 0);
  }, 0);
}

function getSubtotal() {
  return state.cart.reduce((total, item) => total + item.price * item.qty, 0);
}

function getDeliveryFee(subtotal) {
  if (state.orderMode !== "delivery") {
    return 0;
  }

  return subtotal >= 168 ? 0 : 12;
}

function getOrderHistory() {
  return loadStorage(STORAGE_KEYS.orders, []);
}

function evaluatePromo(code, subtotal) {
  const normalized = (code || "").trim().toUpperCase();

  if (!normalized) {
    return {
      code: "",
      amount: 0,
      valid: false,
      text: "支持首单立减、自取折扣和午餐套餐优惠。"
    };
  }

  if (normalized === "MAMMA20") {
    if (getOrderHistory().length > 0) {
      return {
        code: normalized,
        amount: 0,
        valid: false,
        text: "MAMMA20 仅限首单使用，这台设备已经有历史订单记录。"
      };
    }

    if (subtotal < 99) {
      return {
        code: normalized,
        amount: 0,
        valid: false,
        text: "MAMMA20 需商品小计满 ¥99 才能使用。"
      };
    }

    return {
      code: normalized,
      amount: 20,
      valid: true,
      text: "首单立减 ¥20 已应用。"
    };
  }

  if (normalized === "SELF20") {
    if (state.orderMode !== "pickup") {
      return {
        code: normalized,
        amount: 0,
        valid: false,
        text: "SELF20 仅适用于门店自取，下单方式已切到自取后可重新应用。"
      };
    }

    return {
      code: normalized,
      amount: Math.min(30, Math.round(subtotal * 0.2)),
      valid: subtotal > 0,
      text: subtotal > 0 ? "自取 8 折优惠已应用，最高减 ¥30。" : "先加入商品后再使用 SELF20。"
    };
  }

  if (normalized === "LUNCH68") {
    if (subtotal < 68) {
      return {
        code: normalized,
        amount: 0,
        valid: false,
        text: "LUNCH68 建议用于午餐双人餐，当前商品小计还未达到 ¥68。"
      };
    }

    return {
      code: normalized,
      amount: 18,
      valid: true,
      text: "午餐双人餐优惠已应用，已减 ¥18。"
    };
  }

  if (normalized === "TUESDAY") {
    const isTuesday = new Date().getDay() === 2;

    if (!isTuesday) {
      return {
        code: normalized,
        amount: 0,
        valid: false,
        text: "TUESDAY 仅限周二使用，今天先看看别的优惠吧。"
      };
    }

    if (getPizzaCount() < 2) {
      return {
        code: normalized,
        amount: 0,
        valid: false,
        text: "TUESDAY 需购物车内至少有 2 份披萨。"
      };
    }

    return {
      code: normalized,
      amount: 30,
      valid: true,
      text: "周二披萨优惠已应用，已减 ¥30。"
    };
  }

  return {
    code: normalized,
    amount: 0,
    valid: false,
    text: "这个优惠码暂时不可用，可以试试 MAMMA20、SELF20 或 LUNCH68。"
  };
}

function calculateTotals() {
  const subtotal = getSubtotal();
  const fee = getDeliveryFee(subtotal);
  const promo = evaluatePromo(state.promoCode, subtotal);
  const total = Math.max(0, subtotal + fee - promo.amount);

  return {
    subtotal,
    fee,
    total,
    promo
  };
}

function buildCartItemKey(productId, sizeLabel) {
  return `${productId}__${sizeLabel}`;
}

function addProductToCart(productId) {
  const product = getProduct(productId);

  if (!product) {
    return;
  }

  const selectedSize = getSelectedSize(productId);
  const sizeOption = getSizeOption(product, selectedSize);
  const key = buildCartItemKey(productId, sizeOption.label);
  const existing = state.cart.find((item) => item.key === key);

  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({
      key,
      productId,
      sizeLabel: sizeOption.label,
      price: sizeOption.price,
      qty: 1
    });
  }

  persistCart();
  updateUI();
}

function updateCartItemQuantity(itemKey, delta) {
  const target = state.cart.find((item) => item.key === itemKey);

  if (!target) {
    return;
  }

  target.qty += delta;

  if (target.qty <= 0) {
    state.cart = state.cart.filter((item) => item.key !== itemKey);
  }

  persistCart();
  updateUI();
}

function removeCartItem(itemKey) {
  state.cart = state.cart.filter((item) => item.key !== itemKey);
  persistCart();
  updateUI();
}

function persistCart() {
  saveStorage(STORAGE_KEYS.cart, state.cart);
}

function persistCustomer() {
  const formData = new FormData(checkoutForm);
  const snapshot = {};

  for (const [key, value] of formData.entries()) {
    snapshot[key] = value;
  }

  state.customer = snapshot;
  saveStorage(STORAGE_KEYS.customer, state.customer);
}

function hydrateCustomerForm() {
  Object.entries(state.customer).forEach(([key, value]) => {
    const field = checkoutForm.elements.namedItem(key);
    if (field) {
      field.value = value;
    }
  });
}

function renderMenu(category) {
  const productIds = CATEGORY_PRODUCTS[category] || [];

  menuGrid.innerHTML = productIds
    .map((productId) => {
      const product = getProduct(productId);
      const selectedSize = getSelectedSize(productId);

      return `
        <article class="menu-card reveal is-visible">
          <div class="menu-card-head">
            <h3>${product.name}</h3>
            <strong>${formatCurrency(getSizeOption(product, selectedSize).price)}</strong>
          </div>
          <p>${product.desc}</p>
          <div class="menu-card-size-group">
            ${product.sizes
              .map(
                (size) => `
                  <button
                    class="size-chip ${selectedSize === size.label ? "is-active" : ""}"
                    type="button"
                    data-size-label="${size.label}"
                    data-product-id="${product.id}"
                  >
                    ${size.label}
                    <span>${formatCurrency(size.price)}</span>
                  </button>
                `
              )
              .join("")}
          </div>
          <div class="menu-card-meta">
            <span>${product.serve}</span>
            <span>${product.extra}</span>
          </div>
          <div class="menu-card-footer">
            <span class="menu-card-extra">${product.category === "drinks" ? "饮品可单点或加购" : "支持备注定制和不同规格"}</span>
            <button class="btn btn-primary" type="button" data-add-product data-product-id="${product.id}">加购</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderCartItems() {
  if (state.cart.length === 0) {
    cartEmpty.classList.remove("is-hidden");
    cartItemsContainer.innerHTML = "";
    return;
  }

  cartEmpty.classList.add("is-hidden");

  cartItemsContainer.innerHTML = state.cart
    .map((item) => {
      const product = getProduct(item.productId);
      const itemTotal = item.price * item.qty;

      return `
        <article class="cart-item">
          <div class="cart-item-main">
            <div class="cart-item-top">
              <h4>${product.name}</h4>
              <strong>${formatCurrency(itemTotal)}</strong>
            </div>
            <div class="cart-item-meta">
              <span>${item.sizeLabel}</span>
              <span>${formatCurrency(item.price)} / 份</span>
              <span>${product.serve}</span>
            </div>
          </div>
          <div class="cart-item-actions">
            <div class="qty-stepper">
              <button type="button" data-cart-decrease="${item.key}">−</button>
              <span>${item.qty}</span>
              <button type="button" data-cart-increase="${item.key}">+</button>
            </div>
            <button class="cart-remove" type="button" data-cart-remove="${item.key}">删除</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function updateModeUI() {
  const mode = ORDER_MODES[state.orderMode];
  const deliveryFields = document.querySelectorAll('[data-mode-field="delivery"]');
  const dineinFields = document.querySelectorAll('[data-mode-field="dinein"]');
  const submitButton = document.querySelector("[data-submit-order]");

  modeButtons.forEach((button) => {
    const isActive = button.dataset.orderMode === state.orderMode;
    button.classList.toggle("is-active", isActive);
  });

  orderModeHint.textContent = mode.hint;
  orderModeBadge.textContent = `当前方式：${mode.label}`;
  summaryFeeLabel.textContent = mode.feeLabel;
  timeLabel.textContent = mode.timeLabel;
  submitButton.textContent =
    state.orderMode === "delivery"
      ? "提交外卖订单"
      : state.orderMode === "pickup"
        ? "确认自取订单"
        : "提交堂食预订";

  deliveryFields.forEach((field) => field.classList.toggle("is-hidden", state.orderMode !== "delivery"));
  dineinFields.forEach((field) => field.classList.toggle("is-hidden", state.orderMode !== "dinein"));
}

function updateSummaryUI() {
  const totals = calculateTotals();
  summarySubtotal.textContent = formatCurrency(totals.subtotal);
  summaryDiscount.textContent = `-${formatCurrency(totals.promo.amount)}`;
  summaryFee.textContent = formatCurrency(totals.fee);
  summaryTotal.textContent = formatCurrency(totals.total);
  promoCodeInput.value = state.promoCode;
  promoFeedback.textContent = totals.promo.text;
  promoFeedback.dataset.severity = totals.promo.valid ? "success" : "neutral";
}

function updateCartBadges() {
  const count = getCartCount();
  cartCountNodes.forEach((node) => {
    node.textContent = String(count);
  });
  cartSummaryCount.textContent = `${count} 件商品`;
}

function updateUI() {
  renderCartItems();
  updateCartBadges();
  updateModeUI();
  updateSummaryUI();
  persistCart();
  saveStorage(STORAGE_KEYS.mode, state.orderMode);
  saveStorage(STORAGE_KEYS.promo, state.promoCode);
}

function openCart() {
  cartOverlay.hidden = false;
  cartDrawer.classList.add("is-open");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartOverlay.hidden = true;
  cartDrawer.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function openOrderModal(order) {
  const summary = buildOrderSummary(order);

  orderIdNode.textContent = order.id;
  orderTotalNode.textContent = formatCurrency(order.total);
  orderSummaryText.textContent = summary;
  orderSuccessMessage.textContent =
    order.mode === "delivery"
      ? "订单已生成。你可以直接复制摘要，或者通过邮件 / 电话与门店确认配送。"
      : order.mode === "pickup"
        ? "自取订单已生成。建议在到店前 5 分钟再次确认，确保披萨以最佳口感出炉。"
        : "堂食预订已生成。建议保留订单摘要，方便到店时快速核对。";

  orderEmailLink.href =
    `mailto:hello@mammamiapizza.com?subject=${encodeURIComponent(`新订单 ${order.id}`)}` +
    `&body=${encodeURIComponent(summary)}`;

  orderModal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeOrderModal() {
  orderModal.hidden = true;
  document.body.style.overflow = "";
}

function buildOrderSummary(order) {
  const itemsText = order.items
    .map((item) => `- ${item.name} / ${item.sizeLabel} x ${item.qty} = ${formatCurrency(item.qty * item.price)}`)
    .join("\n");

  return [
    `订单号：${order.id}`,
    `下单方式：${ORDER_MODES[order.mode].label}`,
    `联系人：${order.customer.customerName}`,
    `电话：${order.customer.customerPhone}`,
    order.mode === "delivery" ? `地址：${order.customer.deliveryAddress}` : null,
    order.mode === "dinein" ? `人数：${order.customer.guestCount}` : null,
    `${ORDER_MODES[order.mode].timeLabel}：${order.customer.serviceTime}`,
    `支付方式：${order.customer.paymentMethod}`,
    `餐具需求：${order.customer.tableware}`,
    order.customer.orderNote ? `备注：${order.customer.orderNote}` : null,
    "",
    "商品明细：",
    itemsText,
    "",
    `商品小计：${formatCurrency(order.subtotal)}`,
    `优惠金额：-${formatCurrency(order.discount)}`,
    `${ORDER_MODES[order.mode].feeLabel}：${formatCurrency(order.fee)}`,
    `合计：${formatCurrency(order.total)}`
  ]
    .filter(Boolean)
    .join("\n");
}

function generateOrderId() {
  const now = new Date();
  const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const randomPart = String(Math.floor(Math.random() * 9000) + 1000);
  return `MM-${datePart}-${randomPart}`;
}

function resetFieldErrors() {
  checkoutForm.querySelectorAll(".field-input").forEach((field) => {
    field.classList.remove("is-invalid");
  });
}

function validateCheckoutForm() {
  resetFieldErrors();

  const nameField = checkoutForm.elements.namedItem("customerName");
  const phoneField = checkoutForm.elements.namedItem("customerPhone");
  const addressField = checkoutForm.elements.namedItem("deliveryAddress");

  if (state.cart.length === 0) {
    checkoutNote.textContent = "请先加入至少一件商品再提交订单。";
    openCart();
    return false;
  }

  if (!String(nameField.value).trim()) {
    nameField.classList.add("is-invalid");
    nameField.focus();
    checkoutNote.textContent = "请先填写联系人姓名。";
    return false;
  }

  if (!/^[0-9+\-\s]{6,}$/.test(String(phoneField.value).trim())) {
    phoneField.classList.add("is-invalid");
    phoneField.focus();
    checkoutNote.textContent = "请填写可联系的手机号或电话。";
    return false;
  }

  if (state.orderMode === "delivery" && !String(addressField.value).trim()) {
    addressField.classList.add("is-invalid");
    addressField.focus();
    checkoutNote.textContent = "外卖配送需要填写详细地址。";
    return false;
  }

  checkoutNote.textContent = "当前版本支持完整下单流程和订单确认，支付采用到店或配送确认方式。";
  return true;
}

function submitOrder(event) {
  event.preventDefault();

  if (!validateCheckoutForm()) {
    return;
  }

  persistCustomer();
  const totals = calculateTotals();
  const order = {
    id: generateOrderId(),
    createdAt: new Date().toISOString(),
    mode: state.orderMode,
    subtotal: totals.subtotal,
    discount: totals.promo.amount,
    fee: totals.fee,
    total: totals.total,
    promoCode: totals.promo.valid ? totals.promo.code : "",
    customer: { ...state.customer },
    items: state.cart.map((item) => ({
      ...item,
      name: getProduct(item.productId).name
    }))
  };

  const orders = getOrderHistory();
  orders.unshift(order);
  saveStorage(STORAGE_KEYS.orders, orders);

  state.cart = [];
  state.promoCode = "";
  saveStorage(STORAGE_KEYS.cart, state.cart);
  saveStorage(STORAGE_KEYS.promo, state.promoCode);

  checkoutForm.elements.namedItem("orderNote").value = "";
  persistCustomer();
  updateUI();
  closeCart();
  openOrderModal(order);
}

function applyPromoCode(code) {
  state.promoCode = (code || "").trim().toUpperCase();
  saveStorage(STORAGE_KEYS.promo, state.promoCode);
  updateSummaryUI();
}

function setOrderMode(mode) {
  if (!ORDER_MODES[mode]) {
    return;
  }

  state.orderMode = mode;
  saveStorage(STORAGE_KEYS.mode, state.orderMode);
  updateUI();
}

function copyOrderSummary() {
  const text = orderSummaryText.textContent;

  if (!text) {
    return;
  }

  navigator.clipboard.writeText(text).then(() => {
    orderSuccessMessage.textContent = "订单摘要已经复制好了，可以直接发给门店确认。";
  });
}

function initializeSizeSelections() {
  Object.keys(PRODUCT_CATALOG).forEach((productId) => {
    state.selectedSizes[productId] = getSelectedSize(productId);
  });
}

function bindEvents() {
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.category;
      state.currentCategory = category;

      tabButtons.forEach((tab) => {
        tab.classList.remove("is-active");
        tab.setAttribute("aria-selected", "false");
      });

      button.classList.add("is-active");
      button.setAttribute("aria-selected", "true");
      renderMenu(category);
    });
  });

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  window.addEventListener("scroll", () => {
    if (window.scrollY > 18) {
      header.classList.add("is-condensed");
    } else {
      header.classList.remove("is-condensed");
    }
  });

  document.addEventListener("click", (event) => {
    const openCartButton = event.target.closest("[data-open-cart]");
    const closeCartButton = event.target.closest("[data-close-cart]");
    const closeOrderModalButton = event.target.closest("[data-close-order-modal]");
    const addProductButton = event.target.closest("[data-add-product]");
    const sizeButton = event.target.closest("[data-size-label]");
    const modeButton = event.target.closest("[data-order-mode]");
    const promoButton = event.target.closest("[data-apply-promo]");
    const switchModeButton = event.target.closest("[data-switch-mode]");
    const removeButton = event.target.closest("[data-cart-remove]");
    const decreaseButton = event.target.closest("[data-cart-decrease]");
    const increaseButton = event.target.closest("[data-cart-increase]");
    const applyManualPromoButton = event.target.closest("[data-apply-promo-manual]");
    const copyButton = event.target.closest("[data-copy-order]");

    if (openCartButton) {
      openCart();
    }

    if (closeCartButton || event.target === cartOverlay) {
      closeCart();
    }

    if (closeOrderModalButton || event.target === orderModal) {
      closeOrderModal();
    }

    if (switchModeButton) {
      setOrderMode(switchModeButton.dataset.switchMode);
    }

    if (promoButton) {
      applyPromoCode(promoButton.dataset.applyPromo);
    }

    if (applyManualPromoButton) {
      applyPromoCode(promoCodeInput.value);
    }

    if (modeButton) {
      setOrderMode(modeButton.dataset.orderMode);
    }

    if (sizeButton) {
      state.selectedSizes[sizeButton.dataset.productId] = sizeButton.dataset.sizeLabel;
      renderMenu(state.currentCategory);
    }

    if (addProductButton) {
      addProductToCart(addProductButton.dataset.productId);
      openCart();
    }

    if (removeButton) {
      removeCartItem(removeButton.dataset.cartRemove);
    }

    if (decreaseButton) {
      updateCartItemQuantity(decreaseButton.dataset.cartDecrease, -1);
    }

    if (increaseButton) {
      updateCartItemQuantity(increaseButton.dataset.cartIncrease, 1);
    }

    if (copyButton) {
      copyOrderSummary();
    }
  });

  checkoutForm.addEventListener("submit", submitOrder);
  checkoutForm.addEventListener("input", (event) => {
    if (event.target.classList.contains("field-input")) {
      event.target.classList.remove("is-invalid");
    }
    persistCustomer();
  });
}

function initRevealAnimations() {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16
    }
  );

  document.querySelectorAll(".reveal").forEach((element) => {
    revealObserver.observe(element);
  });
}

function init() {
  initializeSizeSelections();
  hydrateCustomerForm();
  renderMenu(state.currentCategory);
  bindEvents();
  initRevealAnimations();
  updateUI();
}

init();
