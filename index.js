import { NextResponse } from 'next/server';

const REQUEST_METHODS = ['get', 'post', 'put', 'patch', 'delete', 'head', 'all'];
const DYNAMIC_TAG = 'dynamic';

class NextApiRouter {
  constructor() {
    this._routePrefix = '';
    this._routes = {};
    const _this = this;
    if (new.target) {
      return new Proxy(_this, {
        get(_, key = '') {
          const item = _this[key];
          const method = key.toLowerCase();
          if (REQUEST_METHODS.includes(method)) {
            return (...args) => {
              _this['_addRequestListener'].bind(_this)(method, ...args);
              return _this;
            }
          }
          if (typeof item === 'function') {
            return item.bind(_this);
          }
          return item;
        }
      });
    }
  }

  _addRoute({ method, path, callback }) {
    let finalPath = `${this._routePrefix}${path}`
      .replace(/\/{2,}/g, '/')
      .replace(/\/$/, '');
    if (finalPath.includes(':')) {
      method = DYNAMIC_TAG;
    }
    if (!this._routes[method]) {
      this._routes[method] = {};
    }
    this._routes[method][finalPath] = callback;
    return this;
  }

  _addRequestListener(method, path, callback) {
    this._addRoute({ method, path, callback });
    return this;
  }

  _error() {
    return new NextResponse('Page not found!', { status: 404 });
  }

  async _route(request) {
    const { method, nextUrl } = request;
    const { pathname, searchParams } = nextUrl;

    request.params = {}; // dynamic parameter
    request.query = {}; // get query parameter
    request.data = {}; // post parameter

    // 精确匹配路径
    let callback =
      this._routes?.[method.toLowerCase()]?.[pathname] ||
      this._routes?.['all']?.[pathname];

    // 通过正则匹配路径
    if (!callback) {
      let lastMatchedSize = 0;
      Object.keys(this._routes[DYNAMIC_TAG]).forEach((path) => {
        const reg = new RegExp(path.replace(/:([^/$]*)/g, '(?<$1>[^/$]*)'));
        try {
          const matched = pathname.match(reg);
          if (matched && matched.length > lastMatchedSize) {
            const { groups = {} } = matched;
            request.params = groups;
            callback = this._routes[DYNAMIC_TAG][path];
          }
        } catch (e) {};
      });
    }

    // 错误处理
    if (!callback) {
      callback = this._error;
    }

    try {
      request.query = Object.fromEntries([...searchParams]);
      const body = await request.clone(true).json() || {};
      request.data = body;
    } catch (e) { }
    return await callback(request, NextResponse);
  }

  prefix(prefix) {
    this._routePrefix = prefix;
    return this;
  }

  use(router) {
    Object.keys(router._routes).forEach((method) => {
      Object.keys(router._routes[method]).forEach((path) => {
        this._addRoute({ method, path, callback: router._routes[method][path] });
      });
    });
    return this;
  }

  async route(request) {
    return await this._route(request) ||
      new NextResponse('');
  }
}

export default NextApiRouter;
