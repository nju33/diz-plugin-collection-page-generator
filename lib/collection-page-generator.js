import {object, string, number, any, maybe} from 'validated/schema';
import {validate as validateObject} from 'validated/object';
import pluralize from 'pluralize';
import chunk from 'lodash.chunk';
import flatten from 'lodash.flatten';
import {Directory, Post, Plugin} from 'diz';

const optSchema = object({type: string, collectionKey: maybe(string), titleTemplate: any, descriptionTemplate: any, pager: number});

const defaultOpts = {
  type: 'LIST',
  collectionKey: '',
  titleTemplate() {
    const k = pluralize(this.collectionKey).replace(/^./, f => f.toUpperCase());
    return `${k}: {name} {currentPage}/{maxPageCount}`;
  },
  descriptionTemplate: '',
  pager: 20
};

export default class CollectionPageGenerator extends Plugin {
  constructor(opts) {
    super();
    opts = validateObject(optSchema, Object.assign({}, defaultOpts, opts));
    this.type = opts.type;
    this.collectionKey = opts.collectionKey;
    this.titleTemplate = opts.titleTemplate;
    this.descriptionTemplate = opts.descriptionTemplate;
    this.pager = opts.pager;
  }

  groupBy(posts) {
    return posts.reduce((result, post) => {
      const values = flatten([post.frontmatter[this.collectionKey]]);
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

  process(posts) {
    if (this.collectionKey) {
      const filtered = posts.filter(post => (
        Boolean(post.frontmatter[this.collectionKey]
      )));

      const grouped = this.groupBy(filtered);

      const {dirs, files} = Object.keys(grouped).reduce((obj, name) => {
        const dir = new Directory(pluralize(this.collectionKey), this.dir);

        obj.dirs[name] = dir;
        const posts = grouped[name];
        const postChunkes = chunk(posts, this.pager);
        const pageMaxCount = postChunkes.length;
        dir.posts = postChunkes.map((items, idx) => {
          const currentPage = idx + 1;
          const title = this.getTitle({name, currentPage, pageMaxCount});
          const description = this.getDescription({
            name, currentPage, pageMaxCount
          });

          const slug =
            `${pluralize(this.collectionKey)}:${name}:${currentPage}`;
          const post = new Post(this.dir, slug, '', {
            title,
            description
          }, currentPage);
          post.items = items;
          return post;
        });

        obj.files = dir.renderPosts(this.type);

        return obj;
      }, {
        dirs: {},
        files: []
      });

      return {dirs, files};
    }

    const dir = new Directory('', this.dir);
    const postChunkes = chunk(posts, this.pager);
    const pageMaxCount = postChunkes.length;
    dir.posts = postChunkes.map((items, idx) => {
      const currentPage = idx + 1;
      const description = this.getDescription({
        currentPage, pageMaxCount,
        name: ''
      });

      const post = new Post(this.dir, `:${currentPage}`, '', {
        title: '',
        description
      }, currentPage);
      post.items = items;
      return post;
    });

    const files = dir.renderPosts(this.type);
    return {posts: dir.posts, files};
  }
}
