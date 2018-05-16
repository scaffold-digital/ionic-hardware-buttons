import { Injectable } from '@angular/core';
import { App, NavController, Platform } from 'ionic-angular';

let callbacks = {};

/**
 * Defines a method that will be called when the hardware back button is pressed
 * and this view is visible. Returning false will prevent the default
 * functionality.
 */
export function BackButton() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        let name = target.constructor.name;
        callbacks[name] = propertyKey;
    }
}

@Injectable()
export class HardwareButtons {
    constructor(
        private app: App,
        private platform: Platform
    ) {

    }

    public init() {
        let platform = this.platform;

        platform.registerBackButtonAction(() => {
            let activeNav: NavController = this.app.getActiveNav();
            let navCtrl = activeNav;

            while (navCtrl) {
                let result: any = this.triggerCallbackForNavCtrl(navCtrl);
                if (result === false) return;
                navCtrl = navCtrl.parent;
            }

            if (activeNav.length() <= 1) {
                if (!activeNav.parent) platform.exitApp();
                else activeNav.parent.pop();
            }
            else activeNav.pop();
        });
    }

    public triggerCallbackForNavCtrl(navCtrl: NavController) {
        let active = navCtrl.getActive();
        let name = active.name;
        let method = callbacks[name];

        if (!method) return;

        let instance = active.instance;
        let result = instance[method]();

        return result;
    }
}
