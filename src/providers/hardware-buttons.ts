import { Injectable } from '@angular/core';
import { App, Platform, ViewController } from 'ionic-angular';

let callbacks = {};

/**
 * Defines a method that will be called when the hardware back button is pressed
 * and this view is visible. Returning false will prevent the default
 * functionality.
 */
export function BackButton() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        let constructor = target.constructor;
        callbacks[constructor] = propertyKey;
    }
}

@Injectable()
export class HardwareButtons {

    private viewStack: ViewController[] = [];

    constructor(
        private app: App,
        private platform: Platform
    ) {

    }

    private getCallbackForViewCtrl(viewCtrl: ViewController) {
        let instance = viewCtrl.instance;
        let component = instance.constructor;
        let method = callbacks[component];

        if (!method) return null;

        let callback = instance[method]

        return callback;
    }

    private getCurrentViewCtrl(): ViewController {
        return this.viewStack.length > 0 ? this.viewStack[this.viewStack.length - 1] : null;
    }

    public init() {
        let app = this.app;
        let platform = this.platform;

        app.viewDidEnter.subscribe((viewCtrl: ViewController) => {
            this.viewStack.push(viewCtrl);
        });

        app.viewDidLeave.subscribe((viewCtrl: ViewController) => {
            let index = this.viewStack.lastIndexOf(viewCtrl);
            this.viewStack.splice(index, 1);
        });

        platform.registerBackButtonAction(() => {
            let viewCtrl = this.getCurrentViewCtrl();
            if (!viewCtrl) return this.app.goBack();

            let result: any = this.triggerCallbackForViewCtrl(viewCtrl);
            if (result === false) return;

            app.goBack();
        });
    }

    public triggerCallbackForViewCtrl(viewCtrl: ViewController) {
        let callback = this.getCallbackForViewCtrl(viewCtrl);
        if (!callback) return;

        return callback();
    }
}
