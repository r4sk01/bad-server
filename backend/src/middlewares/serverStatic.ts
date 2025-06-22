import { NextFunction, Request, Response } from 'express'
import fs from 'fs'
import path from 'path'

export default function serveStatic(baseDir: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        const filePath = path.join(baseDir, req.path)

        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                return next()
            }
            return res.sendFile(filePath, (errN) => {
                if (errN) {
                    next(errN)
                }
            })
        })
    }
}
