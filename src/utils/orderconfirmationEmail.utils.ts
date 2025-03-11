import { sendEmail } from "./sendemail.utils"

interface IOrderDetails {
    orderId: string,
    items: any[],
    totalAmount: number
}

interface IOptions {
    to:string,
    orderDetails?: IOrderDetails 
}

export const sendOrderConfirmationEmail = async (options: IOptions) => {

    const mailOptions = {
        text: 'order placed successfully',
        subject: 'order placed',
        to: options.to
    }

    await sendEmail(mailOptions);
}