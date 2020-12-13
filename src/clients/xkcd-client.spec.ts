import xkcdClient from './xkcd-client';
import axios from 'axios';
import xkcdMapper from '../mappers/xkcd-mapper';
import {Xkcd} from "../models/xkcd";

jest.mock('axios');

describe('XkcdClient', () => {

    test('getRandomXkcd should return and map an xkcd', async () => {
        const xkcd: Xkcd = {
            number: 3,
            url: 'https://imgs.xkcd.com/comics/island_color.jpg',
            filename: 'island_color.jpg',
            title: 'Island (sketch)',
            description: '[[A sketch of an Island]]\n{{Alt:Hello, island}}',
            year: 2006,
            month: 1,
            day: 1
        };
        const response = {
            data: {
                "month": "1",
                "num": 3,
                "link": "",
                "year": "2006",
                "news": "",
                "safe_title": "Island (sketch)",
                "transcript": "[[A sketch of an Island]]\n{{Alt:Hello, island}}",
                "alt": "Hello, island",
                "img": "https://imgs.xkcd.com/comics/island_color.jpg",
                "title": "Island (sketch)",
                "day": "1"
            }
        };

        xkcdClient['maxNumber'] = 100;

        axios.get = jest.fn().mockResolvedValue(response);
        xkcdMapper.mapBody = jest.fn().mockResolvedValue(xkcd);

        const result = await xkcdClient.getRandomXkcd();

        expect(result).toEqual(xkcd)
        expect(axios.get).toBeCalledWith(expect.stringMatching(/http:\/\/xkcd\.com\/\d{1,3}\/info\.0\.json/));
        expect(xkcdMapper.mapBody).toBeCalledWith(response.data);
    });

    test('getRandomXkcd when maxNumber is not initialized should throw an error', () => {
        expect(xkcdClient.getRandomXkcd()).rejects.toThrowError('Please initialize max number first');
    });
});
