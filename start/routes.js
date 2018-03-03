'use strict';

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

const Route = use('Route');

Route.on('/').render('welcome');

Route.post('/register', 'AuthController.register').as('auth.register');
Route.post('/login', 'AuthController.login').as('auth.login');
Route.get('/events', 'EventController.get').as('event.get');
Route.get('/event/:id', 'EventController.getDetail').as('event.get-detail');
Route.post('/event', 'EventController.create').as('event.create');
Route.post('/event/:id', 'EventController.update').as('event.update');
Route.delete('/event/:id', 'EventController.delete').as('event.delete');
Route.post('/buy-ticket/:event_id', 'EventController.buyTicket').as('event.buy-ticket');
Route.get('/tickets/:id', 'EventController.getTicketByUser').as('event.get-ticket');
Route.get('/reset', 'DatabaseController.resetDatabase').as('database.reset');
