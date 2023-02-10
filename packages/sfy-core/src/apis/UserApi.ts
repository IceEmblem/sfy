import BaseApi from './BaseApi';
import { User } from './models';

class UserApi extends BaseApi<User> {
    url = '/api/user';
}

export default new UserApi();

// let userapi = new UserApi();
// userapi.getList(
//     // 页大小
//     1,
//     // 页大小
//     10,
//     // 过滤器
//     {
//         age: [10, 18],
//         name: 'chen'
//     },
//     // 排序器
//     'name',
//     // 排序方向
//     'asc'
// ).then(userlist => {
//     console.log(userlist['hydra:totalItems']);
//     userlist['hydra:member'].forEach(user => {

//     });
// });