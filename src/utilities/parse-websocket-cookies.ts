export default function parseCookies(cookies: string) {
    const list = {}
    cookies.split(`;`).forEach(function (cookie) {
        let [name, ...rest] = cookie.split(`=`);
        name = name?.trim();
        if (!name) return;
        const value = rest.join(`=`).trim();
        if (!value) return;
        let decoded = decodeURIComponent(value);
        if (decoded[0] === 'j') {
            const obj = decoded.substring(1);
            decoded = JSON.parse(`{"${decoded[0]}"${obj}}`)["j"]
        }
        list[name] = decoded;
    });
    return list;
}
