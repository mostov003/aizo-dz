const DEFAULTS = {
  basePrice: 0,
  purchasePrice: 0,
  localStock: 0,
  dimensions: {
    length: 0,
    width: 0,
    height: 0,
    weight: 0
  }
};

function makeUniqueSku(name, fallbackId = Date.now()) {
  const base = String(name || '').trim().replace(/\s+/g, '-').replace(/[^A-Za-z0-9\-_]/g, '').toUpperCase();
  return (base || `SKU-${fallbackId}`).slice(0, 40) + `-${fallbackId}`;
}

function normalizeProductPayload(product = {}) {
  const dimensions = product.dimensions || {};
  const fallbackSku = makeUniqueSku(product.name, product.id || Date.now());

  return {
    name: String(product.name || '').trim() || 'Product',
    sku: String(product.sku || '').trim() || fallbackSku,
    basePrice: Number(product.basePrice ?? DEFAULTS.basePrice) || 0,
    purchasePrice: Number(product.purchasePrice ?? DEFAULTS.purchasePrice) || 0,
    dimensions: {
      length: Number(dimensions.length ?? DEFAULTS.dimensions.length) || 0,
      width: Number(dimensions.width ?? DEFAULTS.dimensions.width) || 0,
      height: Number(dimensions.height ?? DEFAULTS.dimensions.height) || 0,
      weight: Number(dimensions.weight ?? DEFAULTS.dimensions.weight) || 0
    },
    localStock: Number(product.localStock ?? DEFAULTS.localStock) || 0,
    categoryId: product.categoryId || null,
    subCategoryId: product.subCategoryId || null
  };
}

function extractErrorDetail(body, fallback = '') {
  if (!body) return fallback;

  return (
    body.detail ||
    body.message ||
    body.error ||
    body.title ||
    (Array.isArray(body.errors) ? body.errors.map(e => e.message || e.description || JSON.stringify(e)).join('; ') : '') ||
    fallback
  );
}

async function createZRProduct(product, { tenantId, apiKey, baseUrl } = {}) {
  if (!tenantId || !apiKey) {
    throw new Error('ZR tenantId and apiKey are required');
  }

  const payload = normalizeProductPayload(product);

  let response = await fetch(`${baseUrl || 'https://api.zrexpress.app/api/v1'}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Tenant': tenantId,
      'X-Api-Key': apiKey
    },
    body: JSON.stringify(payload)
  });

  const text = await response.text();
  let body = null;

  try {
    body = text ? JSON.parse(text) : null;
  } catch (_) {
    body = { message: text };
  }

  if (!response.ok) {
    const detail = extractErrorDetail(body, text || 'ZR product creation failed');
    const isDuplicateSku = /sku\s+.*already exists|already exists/i.test(String(detail));

    if (isDuplicateSku && payload.sku) {
      const retryPayload = {
        ...payload,
        sku: makeUniqueSku(payload.name, Date.now())
      };

      response = await fetch(`${baseUrl || 'https://api.zrexpress.app/api/v1'}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant': tenantId,
          'X-Api-Key': apiKey
        },
        body: JSON.stringify(retryPayload)
      });

      const retryText = await response.text();
      let retryBody = null;
      try { retryBody = retryText ? JSON.parse(retryText) : null; } catch (_) { retryBody = { message: retryText }; }

      if (!response.ok) {
        const retryDetail = extractErrorDetail(retryBody, retryText || 'ZR product creation failed');
        throw Object.assign(new Error(`ZR API Error ${response.status}: ${retryDetail}`), { status: response.status, body: retryBody });
      }

      const retryProductId = retryBody?.productId || retryBody?.id || retryBody?.data?.id || retryBody?.data?.productId;
      return { success: true, productId: retryProductId, body: retryBody, payload: retryPayload };
    }

    const error = new Error(`ZR API Error ${response.status}: ${detail}`);
    error.status = response.status;
    error.body = body;
    throw error;
  }

  const productId = body?.productId || body?.id || body?.data?.id || body?.data?.productId;

  return {
    success: true,
    productId,
    body,
    payload
  };
}

module.exports = {
  normalizeProductPayload,
  extractErrorDetail,
  createZRProduct
};
