import { Promise } from 'es6-promise';

function isLoaded(): boolean {
    return typeof window['require'] !== 'undefined';
}

function dojoPromise(modules: string[]): Promise<any> {
    return new Promise((resolve, reject) => {
        // If something goes wrong loading the esri/dojo scripts, reject with the error.
        window['require'].on('error', reject);
        window['require'](modules, (...args) => {
            // Resolve with the parameters from dojo require as an array.
            resolve(args);
        });
    });
}

const DEFAULT_URL:string= 'https://js.arcgis.com/4.5/';
let promise:Promise<any>;

export function esriBootstrap(url?: string, dojoConfig?: { [propName: string]: any }): Promise<any> {
    if(promise){
        return promise;
    }
    promise = new Promise((resolve, reject) => {
        if (isLoaded()) {
            // If the API is already loaded, reject with an error message.
            reject('The ArcGIS API for JavaScript has already been loaded!');
        }

        if (!url) {
            url = DEFAULT_URL;
        }

        if (dojoConfig) {
            window['dojoConfig'] = dojoConfig;
        }

        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onload = () => {
            // Resolve after the script is loaded.
            resolve();
        };
        // Reject if something goes wrong loading the script.
        script.onerror = reject;
        document.body.appendChild(script);
    });
    return promise;
}

export function esriPromise(modules: string[]): Promise<any> {
    if (!isLoaded()) {
        return esriBootstrap().then(() => dojoPromise(modules));
    } else {
        return dojoPromise(modules);
    }
}

export default esriPromise;
