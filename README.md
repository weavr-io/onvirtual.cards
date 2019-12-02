# onvirtual.cards

This is a demo application called **onvirtual.cards** used to illustrate how to integrate with Weavr.  This demo is also deployed and accessible at https://demo.onvirtual.cards.  To create an account visit https://demo.weavr.io.

**This app is made up of 2 parts:**
- **App**: A front-end implemented in Vue.js
- **Proxy**: A lightweight back-end (Nginx proxy) used to hide sensitive application data

# App
Copy .env.example file to a new .env file in the project root and fill in the correct environment variables.  These values are available upon setting an Innovator integration with the Weavr Platform.  For this application, you must choose the *Business Purchasing* payment model.

Note that BASE_URL points to the proxy server (proxy folder) while BASE_URL_SCRIPT should point to the Weavr **Build** environment.

## Local Build
``` bash
# install dependencies
$ npm install
# serve with hot reload at localhost:3000
$ npm run dev
```
## Production Build
``` bash
# install dependencies
$ npm install
# generate minified static files for web server (dist folder)
$ npm run build
# generate docker image
$ docker build . -t weavr-demo-app
# run docker container (Served with nginx port 80)
$ docker run -p 80:80 weavr-demo-app -d
```

# Proxy

Under proxy folder a default.conf file needs to be generated from the provided template.

Two variables need to be substituted in the template file.

* ${SECRET_KEY};
* ${PROXY_PASS_URL};

``` bash
#Generate default.conf from template file in proxy folder
$ export SECRET_KEY=KEY_FROM_INNOVATOR_SETUP
$ export PROXY_PASS_URL=https://build.weavr.io
$ envsubst < default.conf.template > default.conf
# generate docker image
$ docker build . -t weavr-demo-app-proxy
# run docker container (Served with nginx port 81)
# matches BASE_URL in app .env file 
$ docker run -p 81:80 weavr-demo-app-proxy -d
```