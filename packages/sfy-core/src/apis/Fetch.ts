import { Token, Lang } from 'ice-common';
import DateRange from "./models/DateRange";
import NumRange from "./models/NumRange";

var domain = '';

const urlRegex = /\?[^\?]+$/;

export class StatusError extends Error {
    status: number | undefined
    response: any | undefined
}

// 合并url参数到url上
function mergeUrl(url: string, urlParams: any) {
    let newUrl = url;

    if (urlRegex.test(newUrl)) {
        newUrl = newUrl + '&';
    }
    else {
        newUrl = newUrl + '?';
    }

    let urlParamStr = '';
    Object.keys(urlParams).forEach(key => {
        let param = urlParams[key];

        if (param == undefined) {
            return;
        }

        if (Array.isArray(param)) {
            param.forEach(item => {
                // %5B%5D 就是 []
                urlParamStr = urlParamStr + `${key}%5B%5D=${encodeURIComponent(item)}&`
            });
        }
        else if (param instanceof NumRange) {
            if (param.min != undefined && param.min != null) {
                urlParamStr = urlParamStr + `${key}%5Bgte%5D=${param.min}&`
            }

            if (param.max != undefined && param.max != null) {
                urlParamStr = urlParamStr + `${key}%5Blte%5D=${param.max}&`
            }
        }
        else if (param instanceof DateRange) {
            if (param.min) {
                urlParamStr = urlParamStr + `${key}%5Bafter%5D=${param.min.toDate()?.toISOString().substring(0, 19)}&`
            }

            if (param.max) {
                urlParamStr = urlParamStr + `${key}%5Bbefore%5D=${param.max.toDate()?.toISOString().substring(0, 19)}&`
            }
        }
        else {
            urlParamStr = urlParamStr + `${encodeURI(key)}=${encodeURIComponent(param)}&`
        }
    });

    return encodeURI(newUrl) + urlParamStr;
}

// 设置域名
export function setDomain(url: string) {
    domain = url;
}

export default async (fetchData: any) => {
    let {
        url,
        body,
        method = 'POST',
        urlParams,
        headers = {
            'Content-Type': method == 'PATCH' ? 'application/merge-patch+json' : 'application/ld+json',
            'Accept': 'application/ld+json',
            'accept-language': Lang.lang == 'zh_cn' ? 'zh_CN' : 'en_GB'
        }
    } = fetchData;

    let newUrl = url;
    if (urlParams) {
        newUrl = mergeUrl(newUrl, urlParams);
    }

    if (Token.token) {
        headers.Authorization = `Bearer ${Token.token}`;
    }

    return fetch(domain + newUrl, {
        headers: headers,
        method: method,
        body: (body instanceof FormData) ? body : JSON.stringify(body)
    }).then(response => {
        // 再这里处理 html 异步请求结果，如 404 等问题
        if (response.status >= 200 && response.status < 300) {
            if (response.status == 204) {
                return null;
            }

            return response.json();
        }

        if (response.status == 401) {
            let error = new StatusError('401 Authentication failed');
            error.status = response.status;
            throw error;
        }

        if (response.status == 404) {
            let error = new StatusError('404 Resource not found');
            error.status = response.status;
            throw error;
        }

        if (response.status >= 400 && response.status < 500) {
            return response.json().then(res => {
                let error = new StatusError(`${res['hydra:description'] || 'unknown exception'}`);
                error.status = response.status;
                error.response = res;
                throw error;
            });
        }

        const error = new Error(`${response.status} ${response.statusText}`);

        throw error;
    }).then(res => {
        return res;
    });
}