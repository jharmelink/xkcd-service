import {Document, model, Schema} from 'mongoose';
import {Image} from "../models/image";

const schema = new Schema({
    url: {type: String, required: true, unique: true},
    filename: {type: String, required: true, unique: true, index: true},
    data: {type: Buffer},
    contentType: {type: String}
});

export interface ImageDocument extends Image, Document {
}

export const Images = model<ImageDocument>('Image', schema)
