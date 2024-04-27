import { NextResponse } from 'next/server';

const REQUEST_METHODS = ['get', 'post', 'put', 'patch', 'delete', 'head', 'all'];

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
    const finalPath = `${this._routePrefix}${path}`
      .replace(/\/{2,}/g, '/')
      .replace(/\/$/, '');
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
    const callback =
      this._routes?.[method.toLowerCase()]?.[pathname] ||
      this._routes?.['all']?.[pathname] ||
      this._error;
    request.query = Object.fromEntries([...searchParams]);
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
    try {
      const body = await request.json() || {};
      request.data = body;
    } catch (e) { }
    return await this._route(request) ||
      new NextResponse('');
  }
}

export default NextApiRouter;
