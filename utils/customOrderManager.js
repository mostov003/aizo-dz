/**
 * Custom Order Manager
 * Handles data validation, separation, and state management
 * Ensures no design overlap or mixing in database or UI
 */

class CustomOrderManager {
  /**
   * Validate custom order data against schema
   * @param {Object} order - Order object to validate
   * @returns {Object} - { isValid: boolean, errors: string[] }
   */
  static validateOrder(order) {
    const errors = [];

    // Required fields
    if (!order.orderId) errors.push('Order ID is required');
    if (!order.productType) errors.push('Product type is required');
    if (!order.color) errors.push('Color is required');
    if (!order.quantity || order.quantity < 1) errors.push('Quantity must be at least 1');

    // Validate designs array
    if (!Array.isArray(order.designs) || order.designs.length === 0) {
      errors.push('At least one design is required');
      return { isValid: false, errors };
    }

    // Validate each design independently
    const validSideIds = new Set(['front', 'back', 'left_sleeve', 'right_sleeve', 'pocket']);
    const sideIdsUsed = new Set();

    order.designs.forEach((design, index) => {
      // Check for duplicate sides
      if (sideIdsUsed.has(design.sideId)) {
        errors.push(`Duplicate side found: ${design.sideId}`);
      }
      sideIdsUsed.add(design.sideId);

      // Validate side ID
      if (!validSideIds.has(design.sideId)) {
        errors.push(`Design ${index}: Invalid side ID "${design.sideId}"`);
      }

      // Validate required design fields
      if (!design.sideName) {
        errors.push(`Design ${index}: Side name is required`);
      }
      if (!design.imagePath) {
        errors.push(`Design ${index}: Image path is required`);
      }

      // Validate placement
      if (!design.placement) {
        errors.push(`Design ${index}: Placement object is required`);
      } else {
        if (typeof design.placement.x !== 'number') {
          errors.push(`Design ${index}: X coordinate must be a number`);
        }
        if (typeof design.placement.y !== 'number') {
          errors.push(`Design ${index}: Y coordinate must be a number`);
        }
        if (typeof design.placement.scale !== 'number' || 
            design.placement.scale < 0.1 || design.placement.scale > 2.0) {
          errors.push(`Design ${index}: Scale must be between 0.1 and 2.0`);
        }
      }
    });

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Create a new custom order with isolated designs
   * @param {Object} orderData - Raw order data
   * @returns {Object} - Validated and formatted order
   */
  static createOrder(orderData) {
    const validation = this.validateOrder(orderData);
    if (!validation.isValid) {
      throw new Error(`Order validation failed: ${validation.errors.join(', ')}`);
    }

    return {
      orderId: orderData.orderId || `CO-${Date.now()}`,
      productType: orderData.productType,
      color: orderData.color,
      quantity: orderData.quantity,
      designs: orderData.designs.map(design => ({
        ...design,
        uploadedAt: design.uploadedAt || new Date().toISOString(),
        status: design.status || 'pending'
      })),
      customerInfo: orderData.customerInfo || {},
      notes: orderData.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Get design by side ID - ensures no mixing of designs
   * @param {Object} order - Order object
   * @param {string} sideId - Side identifier
   * @returns {Object|null} - Design object or null if not found
   */
  static getDesignBySide(order, sideId) {
    return order.designs.find(d => d.sideId === sideId) || null;
  }

  /**
   * Get all designs for order - in separate objects
   * @param {Object} order - Order object
   * @returns {Array} - Array of isolated design objects
   */
  static getDesigns(order) {
    return order.designs.map(design => ({
      sideId: design.sideId,
      sideName: design.sideName,
      imagePath: design.imagePath,
      placement: { ...design.placement },
      imageData: design.imageData ? { ...design.imageData } : null,
      status: design.status,
      uploadedAt: design.uploadedAt,
      colors: design.colors ? { ...design.colors } : null
    }));
  }

  /**
   * Update a single design without affecting others
   * @param {Object} order - Order object
   * @param {string} sideId - Side to update
   * @param {Object} updates - Properties to update
   * @returns {Object} - Updated order
   */
  static updateDesign(order, sideId, updates) {
    const designIndex = order.designs.findIndex(d => d.sideId === sideId);
    if (designIndex === -1) {
      throw new Error(`Design for side "${sideId}" not found`);
    }

    const updatedDesign = {
      ...order.designs[designIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // Validate updated design
    const tempOrder = {
      ...order,
      designs: [updatedDesign]
    };
    const validation = this.validateOrder(tempOrder);
    if (!validation.isValid) {
      throw new Error(`Design update failed: ${validation.errors.join(', ')}`);
    }

    return {
      ...order,
      designs: [
        ...order.designs.slice(0, designIndex),
        updatedDesign,
        ...order.designs.slice(designIndex + 1)
      ],
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Remove a design by side ID
   * @param {Object} order - Order object
   * @param {string} sideId - Side to remove
   * @returns {Object} - Updated order without the removed design
   */
  static removeDesign(order, sideId) {
    const newDesigns = order.designs.filter(d => d.sideId !== sideId);
    
    if (newDesigns.length === 0) {
      throw new Error('Cannot remove the last design from an order');
    }

    return {
      ...order,
      designs: newDesigns,
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Add a new design to order
   * @param {Object} order - Order object
   * @param {Object} design - New design to add
   * @returns {Object} - Updated order
   */
  static addDesign(order, design) {
    // Check if side already exists
    if (order.designs.some(d => d.sideId === design.sideId)) {
      throw new Error(`Design for side "${design.sideId}" already exists`);
    }

    const newDesign = {
      ...design,
      uploadedAt: design.uploadedAt || new Date().toISOString(),
      status: design.status || 'pending'
    };

    const updatedOrder = {
      ...order,
      designs: [...order.designs, newDesign],
      updatedAt: new Date().toISOString()
    };

    // Validate
    const validation = this.validateOrder(updatedOrder);
    if (!validation.isValid) {
      throw new Error(`Design addition failed: ${validation.errors.join(', ')}`);
    }

    return updatedOrder;
  }

  /**
   * Export order as JSON (for database storage)
   * Each design is isolated and identifiable
   * @param {Object} order - Order object
   * @returns {string} - JSON string
   */
  static toJSON(order) {
    return JSON.stringify(order, null, 2);
  }

  /**
   * Import order from JSON (from database)
   * @param {string} jsonString - JSON string
   * @returns {Object} - Parsed order
   */
  static fromJSON(jsonString) {
    const order = JSON.parse(jsonString);
    const validation = this.validateOrder(order);
    if (!validation.isValid) {
      throw new Error(`Invalid order JSON: ${validation.errors.join(', ')}`);
    }
    return order;
  }

  /**
   * Generate summary report for all designs
   * @param {Object} order - Order object
   * @returns {Object} - Summary statistics
   */
  static generateSummary(order) {
    return {
      orderId: order.orderId,
      totalDesigns: order.designs.length,
      designsBySide: order.designs.map(d => ({
        side: d.sideId,
        name: d.sideName,
        status: d.status,
        imageSize: d.imageData ? `${d.imageData.width}x${d.imageData.height}` : 'unknown'
      })),
      statusCounts: {
        pending: order.designs.filter(d => d.status === 'pending').length,
        approved: order.designs.filter(d => d.status === 'approved').length,
        rejected: order.designs.filter(d => d.status === 'rejected').length
      },
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    };
  }
}

// Example usage
const exampleOrder = {
  orderId: 'CO-2024-001',
  productType: 'tshirt',
  color: 'black',
  quantity: 5,
  designs: [
    {
      sideId: 'front',
      sideName: 'Poitrine / Front',
      imagePath: '/uploads/designs/front-design.png',
      imageData: { width: 800, height: 600, format: 'png', fileSize: 45000 },
      placement: { x: 264, y: 236, scale: 1.0, rotation: 0 },
      status: 'pending'
    },
    {
      sideId: 'back',
      sideName: 'Dos / Back',
      imagePath: '/uploads/designs/back-design.png',
      imageData: { width: 800, height: 600, format: 'png', fileSize: 52000 },
      placement: { x: 300, y: 250, scale: 0.95, rotation: 0 },
      status: 'pending'
    }
  ],
  customerInfo: {
    name: 'John Doe',
    phone: '0612345678',
    wilaya: '16 - Alger'
  }
};

export default CustomOrderManager;
