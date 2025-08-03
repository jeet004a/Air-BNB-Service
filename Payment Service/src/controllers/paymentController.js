import { paymentService, cancelOrderService } from "../services/paymentService.js"

export const mainPaymentController = async(req, res, next) => {
    try {
        const response = await paymentService(req.body)
        return res.status(201).json({
            success: response.success,
            msg: response
        })

    } catch (error) {
        return res.status(404).json({
            success: false,
            msg: "Erro from /payment controller routes",
            error
        })
    }
}


export const cancelOrderController = async(req, res, next) => {
    try {
        const response = await cancelOrderService(req.body)


        return res.status(201).json({
            success: response.success,
            msg: response
        })

    } catch (error) {
        return res.status(404).json({
            success: false,
            msg: "Erro from /payment controller routes",
            error
        })
    }
}