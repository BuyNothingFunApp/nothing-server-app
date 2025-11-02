import { Request, Response } from 'express';
import { ContactSchema, ShareSchema } from '../schema';
import { OrderModel } from '../models/model';
import { ApiResponse } from '../utils/apiResponse';
import { logger } from '../utils/logger';
import { sendContactEmail } from '../utils/emailService';

export class ShareController {


    async handleShare(req: Request, res: Response) {

        const result = ShareSchema.safeParse(req.body);
        if (!result.success) {
            new ApiResponse(res).error('Failed to share', result.error)
            return;
        }

        const { orderNumber, platform } = result.data;

        try {
            const order = await OrderModel.findOne({ orderId: orderNumber });
            if (!order) {
                new ApiResponse(res).error('Order not found' );
                return;
            }

            order.sharedOnSocial = true;
            order.socialShares.push({ platform, sharedAt: new Date() });
            await order.save();

            const shareUrl = generateShareUrl(orderNumber, platform, order)
            new ApiResponse(res).success(`Successfully shared on ${platform}`, shareUrl)
        } catch (err) {
            logger.error('Failed to share', err);
            new ApiResponse(res).error('Failed to share', err)
        }
    };

    async handleContact(req: Request, res: Response) {

        const result = ContactSchema.safeParse(req.body);
        if (!result.success) {
            new ApiResponse(res).error('Error While sending Message!',result.error);
            return;
        }
        try {
            const { message, customerEmail, customerName } = result.data;
            await sendContactEmail(customerEmail, customerName, message);
            logger.info(`Message Recieved from ${customerName} with email ${customerEmail}. Message Body: ${message}`);
            new ApiResponse(res).success('Message Sent!')
        }
        catch (err) {
            logger.error("Contact Message Sent Failed ", err);
            new ApiResponse(res).error('Error While sending Message!')
        }
    }
}


function generateShareUrl(orderNumber: string, platform: string, order: any): string {
    const baseUrl = process.env.BASE_URL || "https://buynothing.com";
    const message = encodeURIComponent(`I just bought ${order.amount} worth of absolutely nothing from buyNothing.com! 🎯 Order #${orderNumber} - achieving peak minimalism! 💫`);
    const url = encodeURIComponent(`${baseUrl}?ref=${orderNumber}`);

    const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${message}`,
        twitter: `https://twitter.com/intent/tweet?text=${message}&url=${url}&hashtags=buynothing,minimalism,nothing`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${message}`,
        whatsapp: `https://wa.me/?text=${message}%20${url}`,
        instagram: `${baseUrl}?share=instagram&order=${orderNumber}` // Instagram doesn't support direct URL sharing
    };

    return shareUrls[platform as keyof typeof shareUrls] || shareUrls.facebook;
}