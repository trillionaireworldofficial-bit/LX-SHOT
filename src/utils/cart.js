export const currency = 'USD';

export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);
}

export function addToCart(cart, product, quantity = 1) {
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    return cart.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
  }
  return [...cart, { id: product.id, product, quantity }];
}

export function updateQuantity(cart, productId, delta) {
  return cart.flatMap((item) => {
    if (item.id !== productId) return [item];
    const nextQuantity = item.quantity + delta;
    return nextQuantity > 0 ? [{ ...item, quantity: nextQuantity }] : [];
  });
}

export function removeFromCart(cart, productId) {
  return cart.filter((item) => item.id !== productId);
}

export function calculateTotals(cart) {
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 120 ? 0 : 12;
  return { subtotal, shipping, total: subtotal + shipping };
}
