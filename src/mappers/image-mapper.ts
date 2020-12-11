import {Image} from "../models/image";
import {StringMapper} from "./string-mapper";

export class ImageMapper {

    public static mapToImage(url: string, data: any, headers: any): Image {
        return {
            url: url,
            filename: StringMapper.getFilename(url),
            data: Buffer.from(data, 'binary'),
            contentType: headers['content-type']
        }
    }
}
