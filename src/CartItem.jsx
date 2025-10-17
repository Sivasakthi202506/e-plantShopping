import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeItem, updateQuantity } from './CartSlice';
import './CartItem.css';
import { useNavigate } from 'react-router-dom';

const CartItem = ({ onContinueShopping }) => {
  const cart = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  // ✅ Calculate total cost for a single item
  const calculateTotalCost = (item) => {
    const cost = Number(String(item?.cost).replace(/[^0-9.-]+/g, '')) || 0; // Strip $, etc.
    const quantity = Number(item?.quantity) || 0;
    return cost * quantity;
  };

  // ✅ Calculate grand total using useMemo
  const totalAmount = React.useMemo(() => {
    if (!Array.isArray(cart) || cart.length === 0) return '0.00';
    const total = cart.reduce((sum, item) => sum + calculateTotalCost(item), 0);
    return total.toFixed(2);
  }, [cart]);

  // ✅ Calculate subtotals by type (e.g., different plant types)
  const calculateSubtotalsByType = () => {
    const subtotals = {};
    cart.forEach((item) => {
      if (!subtotals[item.type]) {
        subtotals[item.type] = 0;
      }
      subtotals[item.type] += calculateTotalCost(item);
    });
    return subtotals;
  };

  const subtotals = calculateSubtotalsByType();

  // ✅ Quantity change handlers
  const handleIncrement = (item) => {
    dispatch(updateQuantity({ name: item.name, quantity: item.quantity + 1 }));
  };

  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      dispatch(updateQuantity({ name: item.name, quantity: item.quantity - 1 }));
    }
  };

  // ✅ Remove item handler
  const handleRemove = (item) => {
    dispatch(removeItem(item.name));
  };

 const navigate = useNavigate();

const handleContinueShopping = (e) => {
  e.preventDefault();

  // If a parent callback is provided, call it (optional)
  if (onContinueShopping) {
    onContinueShopping();
  }

  // Navigate to product list page
  navigate('/ProductList');
};


  return (
    <div className="cart-container">
      {/* Subtotals by plant type */}
      <div className="subtotals-by-type d-flex">
        <h3 style={{ color: 'black' }}>Total Amount:  </h3>
       <ul>
          {Object.entries(subtotals).map(([type, amount]) => (
            <li key={type} style={{ color: 'black' }}> ${amount.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>

      {/* Cart items list */}
      <div>
        {cart.map((item) => (
          <div className="cart-item" key={item.name}>
            <img className="cart-item-image" src={item.image} alt={item.name} />
            <div className="cart-item-details">
              <div className="cart-item-name">{item.name}</div>
              <div className="cart-item-cost">Price: {item.cost}</div>

              <div className="cart-item-quantity">
                <button
                  className="cart-item-button cart-item-button-dec"
                  onClick={() => handleDecrement(item)}
                >
                  -
                </button>
                <span className="cart-item-quantity-value">{item.quantity}</span>
                <button
                  className="cart-item-button cart-item-button-inc"
                  onClick={() => handleIncrement(item)}
                >
                  +
                </button>
              </div>

              <div className="cart-item-total">
                Total: ${calculateTotalCost(item).toFixed(2)}
              </div>

              <button
                className="cart-item-delete"
                onClick={() => handleRemove(item)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>


      {/* Buttons */}
      <div className="continue_shopping_btn">
        <button className="get-started-button" onClick={handleContinueShopping}>
          Continue Shopping
        </button>
        <br />
        <button className="get-started-button1">Checkout</button>
      </div>
    </div>
  );
};

export default CartItem;
