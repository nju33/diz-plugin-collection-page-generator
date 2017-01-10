import {object, string, number, any, maybe} from 'validated/schema';
import {validate as validateObject} from 'validated/object';
import toPairs from 'lodash.topairs';
import pluralize from 'pluralize';
import chunk from 'lodash.chunk';
import flatten from 'lodash.flatten';
import pupa from 'pupa';

const defaultOpts = {
  type: 'LIST',
  pager: 20,
  target: null,
  title(opts) {
    if (opts.target) {
      if (opts.page > 1) {
        return '{target}: {name} / {page} - {sitetitle}';
      } else {
        return '{target}: {name} - {sitetitle}';
      }
    }

    if (opts.page > 1) {
      return '{sitetitle} / {page}';
    } else {
      return '{sitetitle}';
    }
  },
  description: null
};

export default class CollectionPageGenerator {
  constructor(opts = {}) {
    opts = Object.assign({}, defaultOpts, opts);
    this.type = opts.type;
    this.pager = opts.pager;
    this.target = opts.target;
    this.title = opts.title;
    this.description = opts.description;
  }

  groupBy(posts, target) {
    return posts.reduce((result, post) => {
      const targetValue = post.data[target];
      if (!targetValue) {
        return result;
      }

      const values = flatten([targetValue]);
      values.forEach(value => {
        if (Array.isArray(result[value])) {
          result[value].push(post);
        } else {
          result[value] = [post];
        }
      });
      return result;
    }, {});
  }

  process(root) {
    const {posts} = root.mainDirectory;
    if (posts.length === 0) {
      return;
    }

    const dir = root.createDirectory(this.target ? pluralize(this.target) : '');
    let pairs = null;

    if (this.target) {
      pairs = toPairs(this.groupBy(posts, this.target));
    } else {
      pairs = [['', posts]];
    }

    pairs.forEach(([slug, posts]) => {
      const pagePosts = chunk(posts, this.pager).map((_chunk, idx) => {
        const post = dir.createPost({
          type: 'LIST',
          slug,
          data: {
            title: (t => {
              if (!t) {
                return null;
              }

              const opts = {
                sitename: root.config.title,
                target: this.target,
                name: slug,
                page: idx + 1
              };

              if (typeof t === 'function') {
                return pupa(t(opts), opts);
              }
              return pupa(t, opts);
            })(this.title),
            description: (d => {
              if (!d) {
                return null;
              }

              const opts = {
                sitename: root.config.title,
                target: this.target,
                name: slug,
                page: idx + 1
              };

              if (typeof d === 'function') {
                return pupa(d(opts), opts);
              }
              return pupa(d, opts);
            })(this.description),
            page: idx + 1,
            items: _chunk
          }
        });
        return post;
      });
    });
  }
}
