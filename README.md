## 环境
node: 14+ (示例使用版本 v14.18.1)
yarn: 执行 npm install -g yarn 安装

## 开发环境运行
前台项目：yarn start:next
后台项目：yarn start:react
注：2个项目都是使用3000端口，不可同时运行

## 部署
#### 前台项目执行如下命令
yarn install
yarn build:next
sudo docker build -f ./Dockerfile.next -t sfy/next:0.1 .
sudo docker run -itd --name sfy -p 3000:3000 sfy/next:0.1

#### 后台项目执行如下命令
yarn install
yarn build:react
sudo docker build -f ./Dockerfile.react -t sfy/react:0.1 .
sudo docker run -itd --name sfy -p 3001:3000 sfy/react:0.1