import React, { useState, useEffect } from "react";
import productData from "./products.json";
import inventoryData from "./inventory.json";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [layout, setLayout] = useState("grid");

  useEffect(() => {
    setProducts(productData);
    setInventory(inventoryData);
  }, []);

  const addToCart = (product) => {
    const itemIndex = cartItems.findIndex((item) => item.id === product.id);
    if (itemIndex === -1) {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    } else {
      const updatedItems = [...cartItems];
      updatedItems[itemIndex].quantity += 1;
      setCartItems(updatedItems);
    }
  };

  const removeFromCart = (product) => {
    const itemIndex = cartItems.findIndex((item) => item.id === product.id);
    if (cartItems[itemIndex].quantity === 1) {
      setCartItems(cartItems.filter((item) => item.id !== product.id));
    } else {
      const updatedItems = [...cartItems];
      updatedItems[itemIndex].quantity -= 1;
      setCartItems(updatedItems);
    }
  };

  const getProductInventory = (productId) => {
    return inventory[productId] ? inventory[productId].count : 0;
  };

  const getCartItemTotal = (item) => {
    return item.price * item.quantity;
  };

  const getTotalCartValue = () => {
    return cartItems.reduce((total, item) => total + getCartItemTotal(item), 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleLayoutChange = () => {
    setLayout(layout === "grid" ? "table" : "grid");
  };

  return (
    <div className="App">
      <header>
        <h1>Product Catalog with Cart</h1>
        <div className="cart">
          <button onClick={handleLayoutChange}>
            {layout === "grid" ? "Table View" : "Grid View"}
          </button>
          <span>{getItemCount()} Items</span>
          <span>Total: ${getTotalCartValue()}</span>
        </div>
      </header>

      <main>
      <div className={`products container-${layout === 'grid' ? 'grid' : 'table'}`}>
          {products.map((product) => {
            const inventoryCount = getProductInventory(product.id);
            const cartItem = cartItems.find((item) => item.id === product.id);

            return (
              <div key={product.id} className={`product item-${layout === 'grid' ? 'grid' : 'table'}`}>
                <img src={product.image} alt={product.name} />
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <div className="price">${product.price}</div>
                {inventoryCount <= 5 && (
                  <div className="inventory-warning">
                    Only {inventoryCount} items left in stock!
                  </div>
                )}
                {cartItem ? (
                  <div className="cart-quantity">
                    <button onClick={() => removeFromCart(product)}>-</button>
                    <span>{cartItem.quantity}</span>
                    <button onClick={() => addToCart(product)}>+</button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(product)}
                    disabled={inventoryCount === 0}
                  >
                    {" "}
                    {inventoryCount === 0 ? "Out of Stock" : "Add to Cart"}{" "}
                  </button>
                )}{" "}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
export default App;
