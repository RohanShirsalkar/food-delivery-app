const calculateCartTotal = (cartItems) => {
  let total = 0;
  cartItems.forEach((item) => {
    total += item.price * item.quantity;
  });
  return total;
};

module.exports = { calculateCartTotal };
