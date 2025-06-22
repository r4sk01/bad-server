import { NextFunction, Request, Response } from 'express'
import { constants } from 'http2'
import * as fs from 'fs'
import sharp from 'sharp'
import BadRequestError from '../errors/bad-request-error'

const MIN_FILE_SIZE = 2 * 1024

export const uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.file || !req.file.size) {
            return next(new BadRequestError('Файл не загружен'))
        }

        if (req.file.size < MIN_FILE_SIZE) {
            fs.unlink(req.file.path, (unlinkErr) => {
                if (unlinkErr)
                    console.error('Ошибка при удалении файла: ', unlinkErr)
            })
            return next(
                new BadRequestError(
                    `Файл слишком маленький. Минимально допустимый размер: ${MIN_FILE_SIZE / 1024} KB.`
                )
            )
        }
        const tempFilePath = req.file.path
        const metadata = await sharp(tempFilePath).metadata()

        console.log('Метаданные изображения:', metadata)
        if (metadata.width === undefined || metadata.height === undefined) {
            return next(
                new BadRequestError(
                    'Не удалось получить размер изображения. Возможно, файл поврежден или не является изображением.'
                )
            )
        }
        if (
            !['jpeg', 'png', 'gif', 'webp'].includes(metadata.format as string)
        ) {
            return next(
                new BadRequestError(
                    `Недопустимый формат изображения: ${metadata.format}.`
                )
            )
        }

        const fileName = process.env.UPLOAD_PATH
            ? `/${process.env.UPLOAD_PATH}/${req.file.filename}`
            : `/${req.file?.filename}`
        return res.status(constants.HTTP_STATUS_CREATED).send({
            fileName,
            originalName: req.file?.originalname,
        })
    } catch (error) {
        return next(error)
    }
}

export default {}
