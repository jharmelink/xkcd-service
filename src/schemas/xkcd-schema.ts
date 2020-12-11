import {Document, model, Schema} from 'mongoose';
import {Xkcd} from "../models/xkcd";

const schema = new Schema({
    number: {type: Number, required: true, unique: true, index: true},
    url: {type: String, required: true, unique: true},
    filename: {type: String, required: true, unique: true},
    title: {type: String},
    description: {type: String},
    year: {type: Number},
    month: {type: Number},
    day: {type: Number},
    image: {data: {type: Buffer}, contentType: {type: String}}
});

export interface XkcdDocument extends Xkcd, Document {
}

export const Xkcds = model<XkcdDocument>('Xkcd', schema)
