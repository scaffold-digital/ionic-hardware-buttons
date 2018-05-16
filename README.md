# Ionic Hardware Buttons

If you've ever tried to catch hardware button events in Ionic and potentially override any default functionality you've probably found it less than straightforward. This package aims to make life easier by providing decorators that you can attach to your own view methods giving you an easy way to override the default behaviour (or not) to suit your application.

**PLEASE NOTE:** At this time only the @BackButton decorator is included. Support for additional buttons is planned.

## Getting Started

To use this package, simply install with npm, add the provider to your app module and initialize it somewhere nice and early. From there you can use the decorators anywhere in your application.

### Installing

First off, install the package with npm

```
npm install @scaffold-digital/ionic-hardware-buttons --save
```

Next, [add the package to your app's module](https://ionicframework.com/docs/native/#Add_Plugins_to_Your_App_Module)

```
...
import { HardwareButtons } from '@scaffold-digital/ionic-hardware-buttons';
...
@NgModule({
  ...
  providers: [
    ...
    HardwareButtons
    ...
  ]
  ...
})
export class AppModule { }
```

Next, initialize the provider somewhere early in your app (e.g. app.component.ts)

```
...
import { HardwareButtons } from '@scaffold-digital/ionic-hardware-buttons';
...

export class MyApp {
  constructor(
    ...
    hardwareButtons: HardwareButtons,
    platform: Platform,
    ...
  ) {
    platform.ready().then(() => {
      ...
      hardwareButtons.init();
      ...
    });
  }
}
```

And you're good to go! Simply add the relevant decorator for the hardware button you want to catch and write some code to be triggered.

## Example: Back Button

Here's a quick example of how you can override the default back button behavior from within a view

```
import { BackButton } from '@scaffold-digital/ionic-hardware-buttons';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    ...
    @BackButton()
    public onBackButton() {
        if (this.sideBarVisible) {
            this.hideSideBar();
            return false; // Blocks any further action from parent views, default behaviour etc
        }

        // If we don't return false then the back button event will continue to be handled as normal
    }
    ...
}
```

## Contributing

We always appreciate any feedback and improvements you might have. Feel free to submit any suggested changes as pull requests.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/scaffold-digital/ionic-hardware-buttons/tags). 

## Authors

* **Rob Sinton** - *Initial package* - [Rabamus](https://github.com/rabamus)

See also the list of [contributors](https://github.com/scaffold-digital/ionic-hardware-buttons/contributors) who participated in this project.
