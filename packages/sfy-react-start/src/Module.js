import React from 'react';
import {PageProvider, Page, BaseModule, ModuleFactory} from 'icetf';
import { Module as RouteModule } from 'ice-router-dom';
import { Module as CoreModule } from 'sfy-core';

class Module extends BaseModule
{
    initialize(){
        // 注册首页
        PageProvider.register(new Page("Home", "/", () => (
            <div style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <p>Hello World!!!</p>
            </div>
        )));
    }
}

const module = new Module();
export default module;

// ModuleList 为当前区域的所有模块，ModuleList 在 js 编译阶段生成
ModuleFactory.register(module, [
    CoreModule,
    RouteModule
]);