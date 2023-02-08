import { BaseModule, ModuleFactory, MiddlewareFactory, IEStore, IceFetch } from 'icetf'
import { fecthMiddlewares } from './Middlewares/FecthMiddlewares'
import RootRedux from './IEReduxs/RootRedux'

class Module extends BaseModule
{
    key = 'sfy-core';

    preInitialize(){
    }

    initialize(){
        // 注册一个Redux中间件
        MiddlewareFactory.register(fecthMiddlewares);
        // 注册当前模块的 reducer
        IEStore.register(RootRedux);
    }

    postInitialize(){
        // 生成 redux store
        IEStore.createStore();
    }
}

const module = new Module();
export default module;

ModuleFactory.register(module, [
]);