import express from 'express'
import {placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus, verifyStripe, verifyRazorpay} from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter = express.Router()

// ✅ Admin Routes
orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)

// ✅ Payment Routes
orderRouter.post('/place', authUser, placeOrder)              // COD
orderRouter.post('/stripe', authUser, placeOrderStripe)       // Stripe
orderRouter.post('/razorpay', authUser, placeOrderRazorpay)   // Razorpay

// ✅ User Routes
orderRouter.post('/userorders', authUser, userOrders)

// Verify payment
orderRouter.post('/verifyStripe',authUser,verifyStripe)
orderRouter.post('/verifyRazorpay',authUser,verifyRazorpay)

export default orderRouter
