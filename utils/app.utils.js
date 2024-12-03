const calculateCartTotal = (cartItems) => {
  let total = 0;
  cartItems.forEach((item) => {
    // console.log(item);
    total += item.price * item.quantity;
  });
  return total;
};

module.exports = { calculateCartTotal };
