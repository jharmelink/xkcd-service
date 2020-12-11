import axios from 'axios';
import {Xkcd} from '../models/xkcd';
import {XkcdMapper} from "../mappers/xkcd-mapper";
import {ImageMapper} from "../mappers/image-mapper";
import {Image} from "../models/image";
import {StringMapper} from "../mappers/string-mapper";

/**
 *  xkcd client singleton.
 */
class XkcdClient {

    private static instance: XkcdClient;

    private maxNumber: number;

    /**
     *  Private constructor to prevent initialisation of a new instance.
     */
    private constructor() {
        this.initMaxNumber();
    }

    /**
     * Lazy initialisation of singleton instance.
     */
    static getInstance(): XkcdClient {
        if (!XkcdClient.instance) {
            XkcdClient.instance = new XkcdClient();
        }

        return XkcdClient.instance;
    }

    async getRandomXkcd(): Promise<Xkcd> {
        const randomNumber = Math.floor((Math.random() * this.maxNumber) + 1);

        return this.getXkcdByNumber(randomNumber);
    }

    async getXkcdByNumber(number: number): Promise<Xkcd> {
        const url = 'http://xkcd.com/' + number + '/info.0.json';

        return axios.get(url)
            .then((response) => XkcdMapper.mapBody(response.data))
            .catch((error) => {
                throw new Error('Unable to get xkcd: ' + error)
            });
    }

    async getImage(filename: string): Promise<Image> {
        const url: string = 'https://imgs.xkcd.com/comics/' + filename;

        return axios.get(url, {responseType: 'arraybuffer'})
            .then((response) => ImageMapper.mapToImage(url, response.data, response.headers))
            .catch((error) => {
                throw new Error('Unable to get image: ' + error)
            });
    }

    private initMaxNumber(): void {
        axios.get('http://xkcd.com/info.0.json')
            .then((response) => StringMapper.getNumber(response.data['num']))
            .then(maxNumber => this.maxNumber = maxNumber)
            .then(() => console.debug('Maximum XKCD number is now set on: ' + this.maxNumber));
    }
}

export default XkcdClient.getInstance();
