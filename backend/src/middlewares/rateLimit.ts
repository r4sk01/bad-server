// eslint-disable-next-line import/no-extraneous-dependencies
import { rateLimit } from 'express-rate-limit'

export const limiter = rateLimit({

    windowMs:  30 * 1000,
    limit: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Слишком много запросов с IP адреса. Попробуйте позже.'
    }
})
