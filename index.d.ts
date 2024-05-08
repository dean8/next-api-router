import { NextRequest, NextResponse } from 'next/server';

export type RequestMethod = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'head' | 'all';

export type RequestCallback = (req: NextRequest, res: NextResponse) => INextApiRouter;

export type RouteParams = {
    method: RequestMethod;
    path: string;
    callback: RequestCallback;
};

interface INextApiRouter {
    prefix(prefix: string): INextApiRouter;
    get(path: string, callback: RequestCallback): INextApiRouter;
    post(path: string, callback: RequestCallback): INextApiRouter;
    put(path: string, callback: RequestCallback): INextApiRouter;
    patch(path: string, callback: RequestCallback): INextApiRouter;
    delete(path: string, callback: RequestCallback): INextApiRouter;
    head(path: string, callback: RequestCallback): INextApiRouter;
    all(path: string, callback: RequestCallback): INextApiRouter;
    use(router: INextApiRouter): INextApiRouter;
    route(request: NextRequest): NextResponse;
}

declare class NextApiRouter implements INextApiRouter {
    private readonly _routePrefix: string;
    private readonly _routes: Object;
    private _addRoute(RouteParams): INextApiRouter;
    private _addRequestListener(method: RequestMethod, path: string, callback: RequestCallback): INextApiRouter;
    private _error(): NextResponse;
    private _route(request: NextRequest): NextResponse;
};

export default NextApiRouter;