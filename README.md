# next-api-router

Simple and intuitive configuration for nextjs api routing.

## Installation

```
npm i @sky/next-api-router --save
```

## Quick start

define single router, for example: `src/routes/images.js`

```
import Router from '@sky8/next-api-router';

const router = new Router();
router.prefix('/api/images');

router.get('/', async (req, res) => {
  // 获取图片列表
  return res.json({ success: true });
});

router.put('/', async (req, res) => {
  // 添加/更新图片
  return res.json({ success: true });
});

router.delete('/', async (req, res) => {
  // 删除图片
  return res.json({ success: true });
});

router.get('/list', async (req, res) => {
  // 获取图片列表
  return res.json({ success: true });
});

export default router;
```

you can use the router above directly or choose to export all define routers in a root router `src/routes/index.js`

```
import Router from '@sky/next-api-router';

import imageRouter from './images';

const router = new Router();

router.use(imageRouter);

export default router;
```

create `[...slug]/page.js` under `app/api` folder, and paste follow code:

```
import router from '@/src/routes';

// NOTICE: very important!!!
const route = router.route.bind(router);

export const GET = route;
export const POST = route;
export const DELETE = route;
export const PUT = route;

// export other support http method
```

### Support Methods

`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`

### Functions

* `prefix`: set router prefix
* `use`: import another router
```
router.use(imageRouter);
```
* `handler`: function to handle api request
* http method related functions, such as: get, post, etc...