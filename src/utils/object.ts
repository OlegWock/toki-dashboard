export const walkObject = (obj: any, cb: (key: string, val: any) => any) => {
    Object.keys(obj).forEach(key => {

    obj[key] = cb(key, obj[key]);

    if (typeof obj[key] === 'object' && obj[key] !== null) {
            walkObject(obj[key], cb)
        }
    });
}