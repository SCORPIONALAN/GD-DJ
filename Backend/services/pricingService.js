// Calcula el total de una venta a partir de sus items.
// Se usa al crear una venta via Mercado Pago (pendiente de habilitar).
export const calcTotal = (items) =>
  items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

// Aplica un descuento porcentual sobre un monto.
export const applyDiscount = (amount, percent) =>
  parseFloat((amount * (1 - percent / 100)).toFixed(2));
