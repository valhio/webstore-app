// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  stripeSecretKey:
    'sk_test_51LuaOkB6gdK47cnCWSZTWE4WsUhyUXCC3CJgtdU034FZteyDDWW1uswXJ6wZEzNhaazu70w8vT7T9OJtejSnO3Ff00ZEJbnYSr',
  stripePublicKey:
    'pk_test_51LuaOkB6gdK47cnCd6CKPCxYdW6DDHpDGEgdxymUIircc0PkOQmVF55FFXvjmJgVPG6bXgqv9OZaJJ3ZRrsh48Ts00xHAHqNYv',
  firebase: {
    projectId: 'webstore-184d5',
    appId: '1:807066658452:web:423f9067e8dd54659f3681',
    databaseURL: 'https://webstore-184d5-default-rtdb.europe-west1.firebasedatabase.app',
    storageBucket: 'webstore-184d5.appspot.com',
    apiKey: 'AIzaSyCExSV8Hq1X8SXVbaYLPXblTTbsOb5HP-g',
    authDomain: 'webstore-184d5.firebaseapp.com',
    messagingSenderId: '807066658452',
    measurementId: 'G-L046XL9N79',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
