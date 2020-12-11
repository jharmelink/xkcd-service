import xkcdClient from '../clients/xkcd-client'
import {Xkcd} from '../models/xkcd';
import {Xkcds} from "../schemas/xkcd-schema";

/**
 *  xkcd service singleton.
 */
class XkcdService {

    private static instance: XkcdService;

    /**
     *  Private constructor to prevent initialisation of a new instance.
     */
    private constructor() {
    }

    /**
     * Lazy initialisation of singleton instance.
     */
    static getInstance(): XkcdService {
        if (!XkcdService.instance) {
            XkcdService.instance = new XkcdService();
        }

        return XkcdService.instance;
    }

    getXkcd(query: { number?: number }): Promise<Xkcd> {
        if (!query.number) {
            return this.getAndCacheRandomXkcd();
        }

        return Xkcds.findOne(query).exec()
            .then(xkcd => !xkcd ? this.getAndCacheXkcd(query.number) : xkcd);
    }

    private getAndCacheRandomXkcd(): Promise<Xkcd> {
        return xkcdClient.getRandomXkcd()
            .then(xkcd => this.cacheXkcd(xkcd));
    }

    private getAndCacheXkcd(number: number): Promise<Xkcd> {
        return xkcdClient.getXkcdByNumber(number)
            .then(xkcd => this.cacheXkcd(xkcd));
    }

    private cacheXkcd(xkcd: Xkcd): Xkcd {
        Xkcds.create(xkcd)
            .then((savedXkcd) => console.debug('Cached xkcd: %s', savedXkcd))
            .catch((error) => console.error('Unable to cache xkcd: %s', error));

        return xkcd;
    }
}

export default XkcdService.getInstance();
