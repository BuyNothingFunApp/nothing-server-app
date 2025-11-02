import mongoose from 'mongoose';
import { ApiResponse } from '../utils/apiResponse';
import { logger } from '../utils/logger';
import { ProductModel } from './../models/model';
import { Request, Response } from 'express';


export class ProductController {
    /**
     *
     */
    constructor() { }

    async getProduct(req: Request, res: Response) {
        try {
            const { featured } = req.query;
            console.log('Featured query param:', featured);

            let query : any= {};
            if (featured) {
                query.featured = featured === 'true';
            }
            
            const products = await ProductModel.find(query);
            console.log('Fetched products:', products);
            new ApiResponse(res).success('Products fetched successfully', products);
        } catch (error) {
            logger.error('Error fetching products:', error);
            new ApiResponse(res).error('Error fetching products');
        }
    };

    async getProductById(req: Request, res: Response) {
        try {
            const products = await ProductModel.findById(req.params.id);
            new ApiResponse(res).success('Product fetched successfully', products);
        } catch (error) {
            logger.error('Error fetching products', error)
            new ApiResponse(res).error('Error fetching product');
        }
    };
}