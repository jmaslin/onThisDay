angular.module('firebase.config', [])
  .constant('FBURL', 'https://thisdaywiki.firebaseio.com')
  .constant('SIMPLE_LOGIN_PROVIDERS', ['password','anonymous'])

  .constant('loginRedirectPath', '/login');
