import {Xkcd} from "../models/xkcd";
import {StringMapper} from "./string-mapper";

export class XkcdMapper {

    public static mapBody(body: JSON): Xkcd {
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
