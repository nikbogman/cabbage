export default function parseCookies(cookies: string) {
    const list = {}
    if (!cookies) return undefined;
    cookies.split(`;`).forEach(cookie => {
        let [name, ...rest] = cookie.split(`=`);
        name = name?.trim();
        if (!name) return;
        const value = rest.join(`=`).trim();
        if (!value) return;
        let decoded = decodeURIComponent(value);
        console.log(decoded)
        if (decoded[0] === 'j') {
            const obj = decoded.substring(1);
            decoded = JSON.parse(`{"${decoded[0]}"${obj}}`)["j"]
        }
        list[name] = decoded;
    });
    return list;
}
