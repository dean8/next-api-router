# next-api-router

Simple and intuitive configuration for nextjs api routing.

## Installation

```
npm i @sky8/next-api-router --save
```

## Quick start

define single router, for example: `src/routes/images.js`

```
import Router from '@sky8/next-api-router';

const router = new Router();
router.prefix('/images');

router.get('/', async (req, res) => {
  return res.json({ success: true, ...req.data });
});

router.put('/', async (req, res) => {
  return res.json({ success: true });
});

router.delete('/', async (req, res) => {
  return res.json({ success: true });
});

router.post('/list', async (req, res) => {
  return res.json({ success: true, ...req.data });
});

export default router;
```

you can use the router above directly(change prefix to `/api/images`) or choose to export all define routers in a root router `src/routes/index.js`

```
import Router from '@sky8/next-api-router';

import imageRouter from './images';

const router = new Router();
router.prefix('/api')

router.use(imageRouter);

export default router;
```

create `[...slug]/page.js` under `app/api` folder, and paste follow code:

```
import router from '@/src/routes';
const { route } = router;

export const GET = route;
export const POST = route;
export const DELETE = route;
export const PUT = route;

// export other support http method
```

### dynamic parameters
```
import Router from '@sky8/next-api-router';

const router = new Router();
router.prefix('/api')

router.all('/params/:name/:gender', (req, res) => {
  return res.json(req.params);
});

export default router;
```

visit `/api/params/dean/male`, you will get:

```
{
  "name": "dean",
  "gender": "male"
}
```

### Support Methods

`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`

### Functions

* `prefix`: set router prefix
* `use`: import another router
```
router.use(imageRouter);
```
* `route`: function to handle api request
* http method related functions, such as: get, post, put, delete, etc...