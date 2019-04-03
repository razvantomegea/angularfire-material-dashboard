## Introduction
Angularfire Material Dashboard is a cross platform dashboard with a full authentication system that uses [Angular](https://angular.io/) and [Angular Material](https://material.angular.io/) and Frontend frameworks and [Firebase](https://firebase.google.com/) ([Angularfire](https://github.com/angular/angularfire2)) as Backend framework.

It also uses [NgRx](https://ngrx.github.io/) as state management, [Electron](https://electronjs.org) as desktop portability framework, and [NativeScript](https://www.nativescript.org/) as mobile (Android and Ios) portability framework.

**Note**: The project UI (html to xml) is not implemented with NativeScript yet, but it can easily
 be done as the source code is shared.

## Features

## Preview
![Preivew](http://vma.isocked.com//static/preview/01_preview.png)

## Project Structure
``` bash

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