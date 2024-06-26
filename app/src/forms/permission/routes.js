const routes = require('express').Router();

const currentUser = require('../auth/middleware/userAccess').currentUser;

const controller = require('./controller');
const jwtService = require('../../components/jwtService');

routes.use(jwtService.protect('admin'));
routes.use(currentUser);

routes.get('/', async (req, res, next) => {
  await controller.list(req, res, next);
});

routes.post('/', async (req, res, next) => {
  await controller.create(req, res, next);
});

routes.get('/:code', async (req, res, next) => {
  await controller.read(req, res, next);
});

routes.put('/:code', async (req, res, next) => {
  await controller.update(req, res, next);
});

module.exports = routes;
