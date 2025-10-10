// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Product = require('./models/Products');
const User = require('./models/User');
const Order = require('./models/Order');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// API route to fetch all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// User registration endpoint
app.post('/api/register', async (req, res) => {
  const { username, password, guestCart } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    const newUser = new User({ username, password });
    if (guestCart && guestCart.length > 0) {
      const formattedCart = guestCart.map(item => ({
        productId: item._id, // Map the client-side _id to the server's productId
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity
      }));
      newUser.cart = guestCart;
    }
    await newUser.save();
    const userWithoutPassword = {
      _id: newUser._id,
      username: newUser.username,
       cart: newUser.cart
    };
    res.status(201).json(userWithoutPassword);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// User login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    const userWithoutPassword = {
      _id: user._id,
      username: user.username,
    };
    res.json(userWithoutPassword);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's cart endpoint
app.get('/api/cart/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('cart');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Save or update user's cart endpoint
app.put('/api/cart/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.cart = req.body.cartItems;
    await user.save();
    res.json({ message: 'Cart saved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to merge guest cart with user cart
app.post('/api/cart/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { guestCart } = req.body;
    
    // Merge guest cart with existing user cart
    const mergedCart = [...user.cart];
    guestCart.forEach(guestItem => {
      const existingItem = mergedCart.find(item => item.productId.toString() === guestItem.productId);
      if (existingItem) {
        existingItem.quantity += guestItem.quantity;
      } else {
        mergedCart.push(guestItem);
      }
    });

    user.cart = mergedCart;
    await user.save();

    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// NEW: Endpoint to create a new order
app.post('/api/orders', async (req, res) => {
  try {
    const { userId, orderItems, shippingAddress, totalPrice } = req.body;

    const newOrder = new Order({
      user: userId,
      orderItems: orderItems.map(item => ({
        productId: item._id, // Ensure this maps correctly to Product ObjectId
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingAddress,
      totalPrice,
      isPaid: true, // We'll assume the payment is successful for this example
      paidAt: new Date(),
    });

    const savedOrder = await newOrder.save();

    // Clear the user's cart after the order is successfully placed
    const user = await User.findById(userId);
    if (user) {
      user.cart = [];
      await user.save();
    }

    res.status(201).json({ message: 'Order placed successfully!', order: savedOrder });
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ message: 'Server error, failed to place order' });
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));