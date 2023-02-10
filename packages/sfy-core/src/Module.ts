import { BaseModule, ModuleFactory, MiddlewareFactory, IEStore, IceFetch } from 'icetf'

class Module extends BaseModule {
    key = 'sfy-core';

    preInitialize() {
    }

    initialize() {
    }

    postInitialize() {
        IEStore.createStore();
    }
}

const module = new Module();
export default module;

ModuleFactory.register(module, [
]);