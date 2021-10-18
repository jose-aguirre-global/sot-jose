// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // apiUrl: '/'
  apiUrl: 'https://localhost:44373/',
  //apiUrl          : 'http://hades.gmm.local:8070/',
  fingerprintAPI  : 'http://hades.gmm.local:3100/',
  socketServer    : 'http://hades.gmm.local:3100/'
  //socketServer    : 'http://10.0.20.145:3100/'

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
