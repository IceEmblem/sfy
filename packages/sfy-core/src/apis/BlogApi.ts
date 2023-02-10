import BaseApi from './BaseApi';
import { Blog } from './models';

class BlogApi extends BaseApi<Blog> {
    url = '/api/blog';
}

export default new BlogApi();