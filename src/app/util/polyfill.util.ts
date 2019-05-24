export class PolyfillUtil {

    public static objectValues(object:any) {
        if (!Object.values) return Object.keys(object).map(key => object[key]);
        else return Object.values(object);
    }

}