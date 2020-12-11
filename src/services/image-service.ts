import xkcdClient from '../clients/xkcd-client'
import {Image} from "../models/image";
import {Images} from "../schemas/image-schema";
import {Response} from 'express';

/**
 *  Image service singleton.
 */
class ImageService {

    private static instance: ImageService;

    /**
     *  Private constructor to prevent initialisation of a new instance.
     */
    private constructor() {
    }

    /**
     * Lazy initialisation of singleton instance.
     */
    static getInstance(): ImageService {
        if (!ImageService.instance) {
            ImageService.instance = new ImageService();
        }

        return ImageService.instance;
    }

    getImage(filename: string, response: Response): Promise<void> {
        return Images.findOne({filename: filename}).exec()
            .then(image => !image ? this.getAndCacheImage(filename) : image)
            .then(image => {
                response.setHeader('Access-Control-Allow-Origin', '*')
                response.contentType(image.contentType);
                response.send(image.data);
            });
    }

    private getAndCacheImage(filename: string): Promise<Image> {
        return xkcdClient.getImage(filename)
            .then(image => this.cacheImage(image));
    }

    private cacheImage(image: Image): Image {
        Images.create(image)
            .then((savedImage) => console.debug('Cached image: %s', savedImage))
            .catch((error) => console.error('Unable to cache xkcd: %s', error));

        return image;
    }
}

export default ImageService.getInstance();
