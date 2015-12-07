angular.module('firebase.config', [])
  .constant('FBURL', 'https://onthisday.firebaseio.com')
  .constant('SIMPLE_LOGIN_PROVIDERS', ['password','anonymous'])

  .constant('loginRedirectPath', '/login');
