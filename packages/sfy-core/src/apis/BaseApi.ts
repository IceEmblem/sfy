import { Entity } from "./models";

async function sfyFetch<T>(input: RequestInfo | URL, init?: RequestInit | undefined) : Promise<T> {
    let response = await fetch(input, init);

    // 再这里处理 html 异步请求结果，如 404 等问题
    if (response.status >= 200 && response.status < 300) {
        if (response.status == 204) {
            return null as T;
        }

        return response.json();
    }

    if (response.status == 401) {
        let error = new Error('401 Authentication failed');
        throw error;
    }

    if (response.status == 404) {
        let error = new Error('404 Resource not found');
        throw error;
    }

    if (response.status >= 400 && response.status < 500) {
        let data = await response.json();
        let error = new Error(`${data['hydra:description'] || 'unknown exception'}`);
        throw error;
    }

    const error = new Error(`${response.status} ${response.statusText}`);
    throw error;
}

const urlRegex = /\?[^\?]+$/;

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

        urlParamStr = urlParamStr + `${key}=${encodeURIComponent(param)}&`
    });

    return encodeURI(newUrl) + urlParamStr;
}

type FilterValueType = undefined | boolean | number | string | Array<number | string | Date>;
interface ListRespone<T> {
    'hydra:member': Array<T>,
    'hydra:totalItems': number
}

export default abstract class BaseApi<T extends Entity> {
    abstract url: string;

    get(id: string): T {
        return {} as any;
    }

    create(model: T): void {

    }

    update(model: T): void {

    }

    delete(id: string): void {

    }

    async getList(
        page: number,
        itemsPerPage: number,
        filters?: { [k in (keyof T)]: FilterValueType },
        sortField?: keyof T,
        sortDirection?: 'asc' | 'desc') {
        let urlParams = {
            page: page,
            itemsPerPage: itemsPerPage
        } as any;

        if (filters) {
            for (let key of Object.keys(filters)) {
                let value = (filters as any)[key] as FilterValueType;
                if (!value) {
                    continue;
                }

                if (Array.isArray(value) && value.length > 0) {
                    // 范围筛选
                    if (typeof (value[0]) == 'number') {
                        urlParams[`${key}%5Bgte%5D`] = value[0];
                        urlParams[`${key}%5Blte%5D`] = value[1];
                        continue;
                    }

                    // 多选值筛选
                    if (typeof (value[0]) == 'string') {
                        for (let s of value) {
                            urlParams[`${key}%5B%5D`] = s;
                        }
                        continue;
                    }

                    // 日期范围筛选
                    if (typeof (value[0]) == 'object') {
                        urlParams[`${key}%5Bafter%5D`] = (value[0] as Date)?.toISOString().substring(0, 19);
                        urlParams[`${key}%5Bbefore%5D`] = (value[1] as Date)?.toISOString().substring(0, 19);
                        continue;
                    }
                }

                urlParams[key] = value;
            }
        }

        if(sortField){
            urlParams[`order%5B${sortField as string}%5D`] = sortDirection;
        }

        let newUrl = mergeUrl(this.url, urlParams);
        return await sfyFetch<ListRespone<T>>(newUrl);
    }
}