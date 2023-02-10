import { Entity } from "./models";
import sfyFetch from "./sfyFetch";

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

    async get(id: string): Promise<T> {
        let newUrl = `${this.url}/${id}`;
        return await sfyFetch<T>(newUrl);
    }

    async create(model: T): Promise<T> {
        return await sfyFetch<T>(this.url, {
            method: 'POST',
            body: JSON.stringify(model)
        });
    }

    async update(model: T): Promise<T> {
        return await sfyFetch<T>(`${this.url}/${model.id}`, {
            method: 'PUT',
            body: JSON.stringify(model)
        });
    }

    async delete(id: string): Promise<void> {
        return await sfyFetch<void>(`${this.url}/${id}`, {
            method: 'DELETE'
        });
    }

    async getList(
        page: number,
        itemsPerPage: number,
        filters?: { [k in (keyof T)]: FilterValueType },
        sortField?: keyof T,
        sortDirection?: 'asc' | 'desc') 
    {
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