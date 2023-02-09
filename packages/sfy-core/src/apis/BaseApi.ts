import { Entity } from "./models";

// 请求数据
fetchDates() {
    let urlParams: any = {
        page: this.state.table.page,
        itemsPerPage: this.state.table.pageSize,
    };

    if (this.state.table.selectClass && this.props.classConfig) {
        urlParams[this.props.classConfig.queryName] = this.state.table.selectClass;
    }

    let sorter = this.state.table.sorter;
    if (sorter && sorter.field && sorter.order) {
        urlParams[`order[${sorter.field}]`] = sorter.order == 'ascend' ? 'asc' : 'desc';
    }

    if (this.state.filters) {
        Object.keys(this.state.filters).forEach(key => {
            if (this.state.filters[key]) {
                urlParams[key] = this.state.filters[key];
            }
        });
    }

    this.setState({ isLoading: true });

    IceFetch.fetch({
        url: this.props.url,
        method: 'GET',
        urlParams: urlParams,
    }).then(data => {
        let datas = data['hydra:member'];

        datas.forEach((item: any) => {
            item.key = item.id;
        });
        this.setState({
            datas: datas,
            total: data['hydra:totalItems']
        });

        // 清空选择的行
        this.setState({
            selectedRowKeys: [],
            selectedRows: [],
        }, () => {
            this.props.onSelectChange?.([], []);
        });
    }).catch(() => {
    }).finally(() => {
        this.setState({ isLoading: false });
    })
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

abstract class BaseApi<T extends Entity> {
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

    getList(
        page: number, 
        itemsPerPage: number, 
        filters: T,
        sortField: keyof T, 
        sortDirection: 'asc' | 'desc') 
    {
        fetch(this.url, {
            
        })
    }
}