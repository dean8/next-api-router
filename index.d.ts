import { NextRequest, NextResponse } from 'next/server';

type RequestMethod = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'head' | 'all';

type RequestCallback = (req: NextRequest, res: NextResponse) => INextApiRouter;

type RouteParams = {
    method: RequestMethod;
    path: string;
    callback: RequestCallback;
};

interface INextApiRouter {
    prefix(prefix: string): INextApiRouter;
    get(path: string, callback: Function): INextApiRouter;
    post(path: string, callback: Function): INextApiRouter;
    put(path: string, callback: Function): INextApiRouter;
    patch(path: string, callback: Function): INextApiRouter;
    delete(path: string, callback: Function): INextApiRouter;
    head(path: string, callback: Function): INextApiRouter;
    all(path: string, callback: Function): INextApiRouter;
    use(router: INextApiRouter): INextApiRouter;
    route(request: NextRequest): NextResponse;
}

declare class NextApiRouter implements INextApiRouter {
    constructor();
    private readonly _routePrefix;
    private readonly _routes;
    private _addRoute(RouteParams): INextApiRouter;
    private _addRequestListener(method: RequestMethod, path: string, callback: RequestCallback): INextApiRouter;
    private _error(): NextResponse;
    private _route(request: NextRequest): NextResponse;
};

export default NextApiRouter;