## Introduction
Angularfire Material Dashboard is a cross platform dashboard with a full authentication system that uses [Angular](https://angular.io/) and [Angular Material](https://material.angular.io/) and Frontend frameworks and [Firebase](https://firebase.google.com/) ([Angularfire](https://github.com/angular/angularfire2)) as Backend framework.

It also uses [NgRx](https://ngrx.github.io/) as state management, [Electron](https://electronjs.org) as desktop portability framework, and [NativeScript](https://www.nativescript.org/) as mobile (Android and Ios) portability framework.

**Note**: The project UI (html to xml) is not implemented with NativeScript yet, but it can easily
 be done as the source code is shared.

## Features
The current scope of the dashboard is health and fitness tracker, with the purpose of showing the full app potential.

- Register and Login with Email and Password, Google, Facebook, Twitter, or Github;
- Two-factor authentication with phone number and reCAPTCHA;
- Email verification;
- Link/Unlink existing accounts (Google, Facebook, Twitter, or Github);
- Password reset;
- Phone number change;
- Profile update (Username, avatar, and other custom information);
- Day/Night mode switch;
- Dynamic forms;
- Body composition tracking;
- Movement tracking;
- Nutrition tracking;
- Sleep tracking;
- Biomarkers tracking (Blood ketones, lipids, glucose, and pressure).

## Preview
![Preivew](https://github.com/razvantomegea/angularfire-material-dashboard/blob/master/src/assets/img/preview.png)

## Project Structure
``` bash
├───.idea
│   ├───codeStyles
│   ├───dictionaries
│   └───inspectionProfiles
├───App_Resources
│   ├───Android
│   │   ├───drawable-hdpi
│   │   ├───drawable-ldpi
│   │   ├───drawable-mdpi
│   │   ├───drawable-nodpi
│   │   ├───drawable-xhdpi
│   │   ├───drawable-xxhdpi
│   │   ├───drawable-xxxhdpi
│   │   ├───values
│   │   └───values-v21
│   └───iOS
│       └───Assets.xcassets
│           ├───AppIcon.appiconset
│           ├───LaunchImage.launchimage
│           ├───LaunchScreen.AspectFill.imageset
│           └───LaunchScreen.Center.imageset
├───dist
├───e2e
│   └───src
├───hooks
│   ├───after-prepare
│   ├───after-watch
│   ├───before-cleanApp
│   ├───before-livesync
│   ├───before-prepare
│   ├───before-prepareJSApp
│   ├───before-preview-sync
│   ├───before-shouldPrepare
│   ├───before-watch
│   └───before-watchPatterns
├───platforms
└───src
    ├───api
    ├───app
    │   ├───admin
    │   │   ├───auth
    │   │   ├───model
    │   │   ├───services
    │   │   ├───shared
    │   │   │   └───auth-form
    │   │   ├───store
    │   │   │   ├───actions
    │   │   │   ├───effects
    │   │   │   └───reducers
    │   │   └───test
    │   │       ├───mocks
    │   │       └───stubs
    │   ├───core
    │   │   ├───firebase
    │   │   ├───services
    │   │   └───store
    │   │       ├───body-composition
    │   │       │   ├───actions
    │   │       │   ├───effects
    │   │       │   └───reducers
    │   │       ├───layout
    │   │       │   ├───actions
    │   │       │   ├───effects
    │   │       │   └───reducers
    │   │       ├───router
    │   │       │   └───reducers
    │   │       └───user
    │   │           ├───actions
    │   │           ├───effects
    │   │           └───reducers
    │   ├───dashboard
    │   │   ├───blood-glucose
    │   │   │   ├───core
    │   │   │   │   └───blood-glucose-details-dialog
    │   │   │   ├───model
    │   │   │   ├───services
    │   │   │   └───store
    │   │   │       ├───actions
    │   │   │       ├───effects
    │   │   │       └───reducers
    │   │   ├───blood-homocysteine
    │   │   │   ├───core
    │   │   │   │   └───blood-homocysteine-details-dialog
    │   │   │   ├───model
    │   │   │   ├───services
    │   │   │   └───store
    │   │   │       ├───actions
    │   │   │       ├───effects
    │   │   │       └───reducers
    │   │   ├───blood-ketones
    │   │   │   ├───core
    │   │   │   │   └───blood-ketones-details-dialog
    │   │   │   ├───model
    │   │   │   ├───services
    │   │   │   └───store
    │   │   │       ├───actions
    │   │   │       ├───effects
    │   │   │       └───reducers
    │   │   ├───blood-lipids
    │   │   │   ├───core
    │   │   │   │   └───blood-lipids-details-dialog
    │   │   │   ├───model
    │   │   │   ├───services
    │   │   │   └───store
    │   │   │       ├───actions
    │   │   │       ├───effects
    │   │   │       └───reducers
    │   │   ├───blood-pressure
    │   │   │   ├───core
    │   │   │   │   └───blood-pressure-details-dialog
    │   │   │   ├───model
    │   │   │   ├───services
    │   │   │   └───store
    │   │   │       ├───actions
    │   │   │       ├───effects
    │   │   │       └───reducers
    │   │   ├───body-composition
    │   │   │   ├───core
    │   │   │   │   ├───body-composition-calculations
    │   │   │   │   ├───body-composition-measurements
    │   │   │   │   └───body-measurements-edit-dialog
    │   │   │   ├───model
    │   │   │   └───services
    │   │   ├───core
    │   │   │   ├───model
    │   │   │   ├───sidenav
    │   │   │   └───toolbar
    │   │   ├───foods
    │   │   │   ├───food-details
    │   │   │   ├───food-edit
    │   │   │   ├───model
    │   │   │   ├───services
    │   │   │   ├───shared
    │   │   │   │   ├───food-filter
    │   │   │   │   └───foods-list
    │   │   │   └───store
    │   │   │       ├───actions
    │   │   │       ├───effects
    │   │   │       └───reducers
    │   │   ├───healthy-habits
    │   │   │   └───model
    │   │   ├───learn
    │   │   │   ├───learn-details
    │   │   │   ├───model
    │   │   │   └───services
    │   │   ├───movement
    │   │   │   ├───model
    │   │   │   ├───services
    │   │   │   ├───session-edit
    │   │   │   │   └───core
    │   │   │   │       ├───session-edit-details
    │   │   │   │       └───session-edit-details-dialog
    │   │   │   ├───shared
    │   │   │   │   ├───activity-list
    │   │   │   │   └───activity-select
    │   │   │   └───store
    │   │   │       ├───actions
    │   │   │       ├───effects
    │   │   │       └───reducers
    │   │   ├───nutrition
    │   │   │   ├───meal-edit
    │   │   │   │   └───core
    │   │   │   │       ├───meal-edit-details
    │   │   │   │       └───meal-edit-details-dialog
    │   │   │   ├───model
    │   │   │   ├───services
    │   │   │   ├───shared
    │   │   │   │   ├───food-list
    │   │   │   │   ├───food-select
    │   │   │   │   └───nutrition-details
    │   │   │   └───store
    │   │   │       ├───actions
    │   │   │       ├───effects
    │   │   │       └───reducers
    │   │   ├───settings
    │   │   │   └───core
    │   │   │       ├───account-settings
    │   │   │       ├───email-edit-dialog
    │   │   │       ├───phone-edit-dialog
    │   │   │       ├───preferences
    │   │   │       ├───profile-edit-dialog
    │   │   │       └───user-profile-settings
    │   │   ├───shared
    │   │   │   ├───mixins
    │   │   │   ├───model
    │   │   │   └───trends-filter-dialog
    │   │   └───sleep
    │   │       ├───core
    │   │       │   └───sleep-details-dialog
    │   │       ├───model
    │   │       ├───services
    │   │       └───store
    │   │           ├───actions
    │   │           ├───effects
    │   │           └───reducers
    │   └───shared
    │       ├───components
    │       │   ├───dynamic-form
    │       │   │   ├───dynamic-form-checkbox
    │       │   │   ├───dynamic-form-datepicker
    │       │   │   ├───dynamic-form-dialog
    │       │   │   ├───dynamic-form-group
    │       │   │   ├───dynamic-form-input
    │       │   │   ├───dynamic-form-select
    │       │   │   ├───dynamic-form-selection-list
    │       │   │   ├───dynamic-form-textarea
    │       │   │   ├───dynamic-form-timepicker
    │       │   │   └───models
    │       │   ├───loading-dialog
    │       │   ├───notification-dialog
    │       │   ├───notification-snackbar
    │       │   ├───prompt-dialog
    │       │   └───search-box
    │       ├───material
    │       ├───mixins
    │       ├───models
    │       └───utils
    ├───assets
    │   ├───articles
    │   └───img
    └───environments
```

## Prerequisites
Download and install [Node.js](https://nodejs.org/en/download/) v8.15.0 or higher.

## Project setup
```
npm install
```

## Firebase setup setup
Create a new [Firebase](https://console.firebase.google.com) project and add the web configuration data in `src/app/core/firebase/config.ts`.
![Firebase configuration](https://github.com/razvantomegea/angularfire-material-dashboard/blob/master/src/assets/img/firebase-config.png)

Enable sign-in methods. Currently, only Email/Password, Phone, Google, Facebook, Twitter, and Github are implemented.
![Firebase sign-in methods](https://github.com/razvantomegea/angularfire-material-dashboard/blob/master/src/assets/img/firebase-auth-methods.png)


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Lint

Run `ng lint` to lint the project files. It is done automatically before every build.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Desktop package

Run `npm run pack:osx|pack:win|pack:nix` to build and package the project for desktop using 
[Electron Packager](https://electronjs.org/docs/tutorial/application-packaging). The build 
artifacts will be stored in the `dist/platforms/` directory.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## References

## Donate
Did you find this project useful and interesting? I worked hard on it...
[Paypal Me](https://paypal.me/razvantomegea)

## License

[MIT](https://github.com/razvantomegea/angularfire-material-dashboard/blob/master/LICENSE)