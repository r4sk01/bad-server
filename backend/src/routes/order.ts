import { Router } from 'express'
import { orderValidation } from '../middlewares/break-injection'
import {
    createOrder,
    deleteOrder,
    getOrderByNumber,
    getOrderCurrentUserByNumber,
    getOrders,
    getOrdersCurrentUser,
    updateOrder,
} from '../controllers/order'
import auth, { roleGuardMiddleware } from '../middlewares/auth'
import { validateOrderBody } from '../middlewares/validations'
import { Role } from '../models/user'

const orderRouter = Router()

orderRouter.post('/', auth, validateOrderBody, createOrder)
orderRouter.get('/all', auth, orderValidation.getAllOrders, roleGuardMiddleware(Role.Admin), getOrders)
orderRouter.get('/all/me', auth, orderValidation.getOrdersCurrentUser, getOrdersCurrentUser)
orderRouter.get('/:orderNumber', auth, orderValidation.getOrderByNumber, roleGuardMiddleware(Role.Admin), getOrderByNumber)
orderRouter.get('/me/:orderNumber', auth, orderValidation.getOrderByNumberCurrentUser, getOrderCurrentUserByNumber)
orderRouter.patch('/:orderNumber', auth, roleGuardMiddleware(Role.Admin), updateOrder)
orderRouter.delete('/:id', auth, roleGuardMiddleware(Role.Admin), deleteOrder)

export default orderRouter
