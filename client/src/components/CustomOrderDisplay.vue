import React, { useState, useRef, useEffect } from 'react';
import './custom-order-display.css';

/**
 * CustomOrderDisplay Component
 * Renders each design in a separate, non-overlapping container
 * Prevents design overlap and confusion in the dashboard
 */
const CustomOrderDisplay = ({ order: initialOrder, onOrderChange }) => {
  const [selectedSide, setSelectedSide] = useState(null);
  const [order, setOrder] = useState(initialOrder || {});
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const canvasRef = useRef(null);
  const thumbRefs = useRef({});
  const cardRefs = useRef({});

  const selectSide = (sideId) => {
    setSelectedSide(sideId);
    // scroll corresponding card into view
    const el = cardRefs.current[sideId];
    if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const selectNext = () => {
    const idx = order.designs.findIndex(d => d.sideId === selectedSide);
    const next = order.designs[(idx + 1) % order.designs.length];
    if (next) selectSide(next.sideId);
  };

  const selectPrev = () => {
    const idx = order.designs.findIndex(d => d.sideId === selectedSide);
    const prev = order.designs[(idx - 1 + order.designs.length) % order.designs.length];
    if (prev) selectSide(prev.sideId);
  };

  useEffect(() => {
    const nextOrder = initialOrder || {};
    setOrder(nextOrder);
    if (nextOrder.designs && nextOrder.designs.length > 0 && !selectedSide) {
      setSelectedSide(nextOrder.designs[0].sideId);
    }
  }, [initialOrder]);

  // lazy-load model-viewer web component if not present
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.customElements.get('model-viewer')) {
      const s = document.createElement('script');
      s.type = 'module';
      s.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
      s.defer = true;
      document.head.appendChild(s);
      return () => { document.head.removeChild(s); };
    }
  }, []);
  if (!order || !order.designs || order.designs.length === 0) {
    return (
      <div className="co-empty-state">
        <p>Aucun design personnalisé trouvé.</p>
      </div>
    );
  }

  // Map of side IDs to garment preview areas
  const SIDE_LABELS = {
    front: { fr: 'Poitrine / Front', en: 'Front Chest', ar: 'الصدر' },
    back: { fr: 'Dos / Back', en: 'Back', ar: 'الظهر' },
    left_sleeve: { fr: 'Manche Gauche', en: 'Left Sleeve', ar: 'الكم الأيسر' },
    right_sleeve: { fr: 'Manche Droite', en: 'Right Sleeve', ar: 'الكم الأيمن' },
    pocket: { fr: 'Poche / Pocket', en: 'Pocket', ar: 'الجيب' }
  };

  const getGarmentPreview = (productType, color) => {
    const previewMap = {
      tshirt: `https://via.placeholder.com/300x400/000000/ffffff?text=T-Shirt`,
      hoodie: `https://via.placeholder.com/300x400/000000/ffffff?text=Hoodie`,
      polo: `https://via.placeholder.com/300x400/000000/ffffff?text=Polo`,
      cap: `https://via.placeholder.com/300x300/000000/ffffff?text=Cap`,
      bob: `https://via.placeholder.com/300x300/000000/ffffff?text=Bob`,
      jogging: `https://via.placeholder.com/300x400/000000/ffffff?text=Jogging`,
      short: `https://via.placeholder.com/300x400/000000/ffffff?text=Short`
    };
    return previewMap[productType] || previewMap.tshirt;
  };

  const onUploadForSide = (sideId, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const img = new Image();
      img.onload = () => {
        setOrder((prev) => {
          const designs = prev.designs.map((d) => {
            if (d.sideId === sideId) {
              return {
                ...d,
                imagePath: dataUrl,
                imageData: { width: img.width, height: img.height },
                uploadedAt: new Date().toISOString()
              };
            }
            return d;
          });
          const next = { ...prev, designs };
          if (onOrderChange) onOrderChange(next);
          return next;
        });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const onDownloadForSide = (design) => {
    if (!design || !design.imagePath) return;
    const a = document.createElement('a');
    a.href = design.imagePath;
    a.download = `${order.orderId || 'design'}-${design.sideId || 'side'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const onSaveDetailsForSide = (sideId, details) => {
    setOrder((prev) => {
      const designs = prev.designs.map((d) => {
        if (d.sideId === sideId) {
          return { ...d, details: { ...(d.details||{}), ...details } };
        }
        return d;
      });
      const next = { ...prev, designs };
      if (onOrderChange) onOrderChange(next);
      return next;
    });
  };

  const renderDesignCard = (design, index) => {
    const labels = SIDE_LABELS[design.sideId] || { fr: design.sideName, en: design.sideName, ar: design.sideName };
    const title = `${labels.ar} / ${labels.en}`;
    const isSelected = selectedSide === design.sideId;

    return (
      <div
        key={`${order.orderId}-${design.sideId}-${index}`}
        ref={el => cardRefs.current[design.sideId]=el}
        className={`co-design-card ${isSelected ? 'co-design-card--selected' : ''}`}
        onClick={() => selectSide(design.sideId)}
        style={{ border: '1px solid #e3e6ea', padding: 12, marginBottom: 12, borderRadius: 6, background: '#fff' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ margin: 0 }}>{title}</h4>
          <span style={{ fontSize: 12, color: '#666' }}>{design.status}</span>
        </div>

        {/* Small viewport that shows only the side; overflow hidden prevents duplicates */}
        <div className="co-side-viewport" style={{ width: 220, height: 220, overflow: 'hidden', marginTop: 10, position: 'relative', border: '1px solid #f0f0f0', borderRadius: 4 }}>
          <img
            src={getGarmentPreview(order.productType, order.color)}
            alt="garment"
            style={{ width: 300, height: '100%', position: 'absolute', left: -40, top: 0 }}
          />

          {design.imagePath && (
            <img
              src={design.imagePath}
              alt={`design-${design.sideId}`}
              style={{
                position: 'absolute',
                left: design.placement?.x || 0,
                top: design.placement?.y || 0,
                transform: `rotate(${design.placement?.rotation || 0}deg) scale(${design.placement?.scale || 1})`,
                maxWidth: 160,
                pointerEvents: 'none'
              }}
            />
          )}
        </div>

        <div style={{ marginTop: 10 }}>
          <label style={{ display: 'inline-block', marginBottom: 6, fontSize: 13, color: '#333' }}>تحميل الصورة لهذا الجزء / Upload Image for this Side</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onUploadForSide(design.sideId, e.target.files[0])}
            style={{ display: 'block', marginTop: 6 }}
          />
          <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            <button onClick={() => onDownloadForSide(design)} style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #d0d7de', background:'#fff', cursor:'pointer' }}>Download Design</button>
          </div>
        </div>

        <div className="co-design-card__info" style={{ marginTop: 10, fontSize: 13 }}>
          <div className="co-design-card__info-row">
            <span className="co-design-card__label">X:</span>
            <span className="co-design-card__value">{design.placement?.x ?? 0}</span>
            <span style={{ marginLeft: 12 }} className="co-design-card__label">Y:</span>
            <span className="co-design-card__value">{design.placement?.y ?? 0}</span>
          </div>
          <div className="co-design-card__info-row" style={{ marginTop: 6 }}>
            <span className="co-design-card__label">زاوية / Angle:</span>
            <span className="co-design-card__value">{design.placement?.rotation ?? 0}°</span>
            <span style={{ marginLeft: 12 }} className="co-design-card__label">مقياس / Scale:</span>
            <span className="co-design-card__value">{Math.round((design.placement?.scale ?? 1) * 100)}%</span>
          </div>
        </div>

        {/* Add Custom Details form per side */}
        <div style={{ marginTop: 12, borderTop: '1px solid #f0f0f0', paddingTop: 10 }}>
          <div style={{ marginBottom: 8, fontWeight: 600 }}>Add Custom Details</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <select defaultValue={design.details?.technique || ''} onChange={(e) => { design._tmpTechnique = e.target.value; }} style={{ padding: 8 }}>
              <option value="">Select Technique</option>
              <option value="screen">Screen Print</option>
              <option value="embroidery">Embroidery</option>
              <option value="heat">Heat Transfer</option>
            </select>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label style={{ fontSize: 13 }}>Color:</label>
              <input type="color" defaultValue={design.details?.color || '#000000'} onChange={(e) => { design._tmpColor = e.target.value; }} />
            </div>

            <textarea placeholder="Notes" defaultValue={design.details?.notes || ''} onChange={(e) => { design._tmpNotes = e.target.value; }} style={{ minHeight: 60, padding: 8 }} />

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => onSaveDetailsForSide(design.sideId, { technique: design._tmpTechnique || design.details?.technique, color: design._tmpColor || design.details?.color, notes: design._tmpNotes || design.details?.notes })} style={{ background: '#0366d6', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 6, cursor: 'pointer' }}>Save Details</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="co-display-wrapper" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>
      {/* Order Header */}
      <div className="co-order-header" style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontSize: 22 }}>Custom Order Details</h1>
        <div className="co-order-meta">
          <span className="co-meta-item">
            <strong>Commande:</strong> {order.orderId}
          </span>
          <span className="co-meta-item">
            <strong>Vêtement:</strong> {order.productType}
          </span>
          <span className="co-meta-item">
            <strong>Couleur:</strong> {order.color}
          </span>
          <span className="co-meta-item">
            <strong>Quantité:</strong> {order.quantity}
          </span>
        </div>
      </div>

      {/* Main layout: thumbnails, canvas, right-side cards */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        {/* Left: Thumbnails column */}
        <div className="co-thumbs-column" style={{ marginRight: 8 }}>
          {order.designs.map((d, index) => (
            <div key={`thumb-${d.sideId}`} ref={el => thumbRefs.current[d.sideId]=el} className={`co-thumb ${selectedSide===d.sideId ? 'co-thumb--active':''}`} onClick={() => selectSide(d.sideId)} title={SIDE_LABELS[d.sideId]?.fr || d.sideName}>
              <div className="co-thumb-index">{index + 1}</div>
              {d.imagePath ? <img src={d.imagePath} alt={d.sideId}/> : <div style={{padding:6,fontSize:11,color:'#666',textAlign:'center'}}>{(SIDE_LABELS[d.sideId]?.en)||d.sideName}</div>}
            </div>
          ))}
        </div>

        {/* Main: Interactive Design Canvas */}
        <div className="co-canvas-column">
          <div className="co-canvas-box">
            <div style={{ marginBottom: 8, fontWeight: 600 }}>Interactive Design Canvas</div>
            <div className="co-preview-toolbar" style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', borderRadius: 8, background: '#f5f6f8', padding: 6 }}>
                {order.designs.map((design, idx) => (
                  <button
                    key={design.sideId}
                    onClick={() => selectSide(design.sideId)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 6,
                      border: 'none',
                      background: selectedSide === design.sideId ? '#2ecc71' : '#fff',
                      color: selectedSide === design.sideId ? '#fff' : '#333',
                      cursor: 'pointer',
                      fontWeight: selectedSide === design.sideId ? 600 : 400,
                      fontSize: 13,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {`L${idx + 1}: ${SIDE_LABELS[design.sideId]?.ar || design.sideName}`}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowPreviewModal(true)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 6,
                  border: 'none',
                  background: '#2185d0',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 13
                }}
              >
                👁️ Preview Full Design
              </button>
            </div>
            <div ref={canvasRef} className="co-canvas-inner" style={{ position: 'relative' }}>
              <div className="canvas-nav-btn canvas-nav-btn--left" onClick={selectPrev}>&lt;</div>
              <div className="canvas-nav-btn canvas-nav-btn--right" onClick={selectNext}>&gt;</div>
              {/* Use 3D model if available, fall back to image */}
              {order.product3DModel ? (
                // eslint-disable-next-line react/no-unknown-property
                <model-viewer
                  src={order.product3DModel}
                  alt="3D garment preview"
                  camera-controls
                  auto-rotate
                  interaction-prompt="auto"
                  exposure="1"
                  className="co-model-viewer"
                />
              ) : (
                <img src={getGarmentPreview(order.productType, order.color)} alt="garment-large" className="co-garment-base" />
              )}

              {(() => {
                const selected = order.designs.find(d => d.sideId === selectedSide) || order.designs[0];
                if (!selected || !selected.imagePath) return null;
                const left = selected.placement?.x || 0;
                const top = selected.placement?.y || 0;
                const rotate = selected.placement?.rotation || 0;
                const scale = selected.placement?.scale || 1;
                const width = (selected.imageData?.width || 160) * scale;
                const height = (selected.imageData?.height || 160) * scale;
                return (
                  <>
                    <div className="co-placement-highlight" style={{ left, top, width, height, transform: `rotate(${rotate}deg)` }} />
                    <img src={selected.imagePath} alt="selected-design" className="co-design-overlay" style={{ left, top, width, height, transform: `rotate(${rotate}deg)` }} />
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Right: Independent Sides Panels - vertical cards */}
        <div className="co-sides-column">
          {order.designs.map((design, index) => renderDesignCard(design, index))}
        </div>
      </div>

      {/* Full Design Preview Modal */}
      {showPreviewModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: 20,
            maxWidth: 900,
            maxHeight: 85 * window.innerHeight / 100,
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: 20, color: '#222' }}>Design Preview</h2>
              <button
                onClick={() => setShowPreviewModal(false)}
                style={{
                  background: '#f0f0f0',
                  border: 'none',
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 18
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              {order.designs.map((design, idx) => (
                <div key={design.sideId} style={{ flex: 1, textAlign: 'center', minWidth: 280 }}>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: 14, color: '#556472' }}>
                    {`Layer ${idx + 1}: ${SIDE_LABELS[design.sideId]?.ar} / ${SIDE_LABELS[design.sideId]?.en}`}
                  </h3>
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    height: 400,
                    background: '#f9fafb',
                    border: '1px solid #e3e6ea',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    {order.product3DModel ? (
                      // eslint-disable-next-line react/no-unknown-property
                      <model-viewer
                        src={order.product3DModel}
                        alt="3D garment"
                        camera-controls
                        auto-rotate
                        style={{ width: '100%', height: '100%' }}
                      />
                    ) : (
                      <img src={getGarmentPreview(order.productType, order.color)} alt="garment" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    )}
                    {design.imagePath && (() => {
                      const left = design.placement?.x || 0;
                      const top = design.placement?.y || 0;
                      const rotate = design.placement?.rotation || 0;
                      const scale = design.placement?.scale || 1;
                      return (
                        <>
                          <div style={{
                            position: 'absolute',
                            left,
                            top,
                            width: (design.imageData?.width || 160) * scale,
                            height: (design.imageData?.height || 160) * scale,
                            border: '2px dashed rgba(46, 204, 113, 0.9)',
                            borderRadius: 8,
                            transform: `rotate(${rotate}deg)`,
                            pointerEvents: 'none'
                          }} />
                          <img src={design.imagePath} alt={`layer-${design.sideId}`} style={{
                            position: 'absolute',
                            left,
                            top,
                            width: (design.imageData?.width || 160) * scale,
                            height: (design.imageData?.height || 160) * scale,
                            transform: `rotate(${rotate}deg)`,
                            pointerEvents: 'none',
                            borderRadius: 6
                          }} />
                        </>
                      );
                    })()}
                  </div>
                  <div style={{ marginTop: 10, fontSize: 12, color: '#556472' }}>
                    <div>X: {design.placement?.x ?? 0}, Y: {design.placement?.y ?? 0}</div>
                    <div>Angle: {design.placement?.rotation ?? 0}°, Scale: {Math.round((design.placement?.scale ?? 1) * 100)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

          <h3>Résumé des designs</h3>
          <div className="co-summary-list">
            {order.designs.map((design) => (
              <div key={design.sideId} className="co-summary-item">
                <span className="co-summary-side">
                  {SIDE_LABELS[design.sideId]?.fr || design.sideName}
                </span>
                <span className={`co-summary-status co-summary-status--${design.status}`}>
                  {design.status === 'pending' && 'En attente'}
                  {design.status === 'approved' && 'Approuvé'}
                  {design.status === 'rejected' && 'Rejeté'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomOrderDisplay;
