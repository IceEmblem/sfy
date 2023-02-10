import token from './token';

export default async function sfyFetch<T>(input: string, init?: RequestInit | undefined): Promise<T> {
    let newInit: RequestInit = {
        ...init
    };

    if (!newInit.headers) {
        newInit.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }

    if (token.token) {
        (newInit.headers as any)['Authorization'] = `Bearer ${token.token}`;
    }

    let response = await fetch(input, newInit);

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