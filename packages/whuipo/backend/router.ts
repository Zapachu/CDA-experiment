import {Router} from 'express';

import {RequestHandler} from './controller';

const apiRouter = Router();
apiRouter.get('/initInfo', RequestHandler.getInitInfo);
apiRouter.post('/login', RequestHandler.login);
apiRouter.post('/asGuest', RequestHandler.asGuest);

const rootRouter = Router();
rootRouter.use('/api', apiRouter);
rootRouter.get('/login', RequestHandler.renderLogin);
rootRouter.get('/*', RequestHandler.loggedIn, RequestHandler.renderIndex);

export default rootRouter;