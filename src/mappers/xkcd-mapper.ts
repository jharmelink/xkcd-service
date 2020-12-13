import {Xkcd} from "../models/xkcd";
import {StringMapper} from "./string-mapper";

class XkcdMapper {

    private static instance: XkcdMapper;

    /**
     * Lazy initialisation of singleton instance.
     */
    static getInstance(): XkcdMapper {
        if (!XkcdMapper.instance) {
            XkcdMapper.instance = new XkcdMapper();
        }

        return XkcdMapper.instance;
    }

    public mapBody(body: JSON): Xkcd {
        return {
            number: body['num'],
            url: body['img'],
            filename: StringMapper.getFilename(body['img']),
            title: body['title'],
            description: body['alt'],
            year: StringMapper.getNumber(body['year']),
            month: StringMapper.getNumber(body['month']),
            day: StringMapper.getNumber(body['day'])
        }
    }
}

export default XkcdMapper.getInstance();
