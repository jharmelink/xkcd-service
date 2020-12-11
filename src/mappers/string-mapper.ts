export class StringMapper {

    public static getNumber(value: string): number {
        const parsedNumber = parseInt(value);

        if (isNaN(parsedNumber)) {
            return 0;
        }

        return parsedNumber;
    }

    public static getFilename(url: string): string {
        return url.substring(url.lastIndexOf('/') + 1)
    }
}
