import esriPromise, { esriBootstrap } from '../index';

const package_path = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));

esriBootstrap('https://js.arcgis.com/4.3/', {
  async: true,
  packages: [
    {
      location: package_path + '/config',
      name: 'config'
    }
  ]
}).then(() => {
    esriPromise([
        'dojo/text!config/test.json'
    ]).then(([
        result
    ]) => {
        console.log(result);
    }).catch((e) => Promise.reject(e));
});
