# onvirtual.cards

This is a demo application called **onvirtual.cards** used to illustrate how to integrate with Weavr.  This demo is also deployed and accessible at https://demo.onvirtual.cards.

**This app is made up of 2 parts:**;81
- **App**: A front-end implemented in Vue.js
- **Proxy**: A lightweight back-end (Nginx proxy) used to hide sensitive application data

# Configuration
1. Copy .env.example file to a new .env file in the project root and fill in the correct environment variables(if necessary).  These values are available upon setting an Innovator integration with the Weavr Platform (https://docs.weavr.io/start/open-multi-sandbox-account).  For this application, you must choose the *Business Purchasing* payment model. 
<br> <br> *Note: MULTI_BASE_URL points to the proxy server (Dockerfile-proxy (i.e localhost:81)) while BASE_URL_SCRIPT should point to the Weavr **Sandbox** environment. The CONSUMER variables can be ignored.* <br> <br>
2. Copy .proxy.conf.example to .proxy.conf file in the project root**. Replace {{API_KEY}} with the **API Key** value in the Innovator Portal API Credentials.

** _(To run app on Local: Copy .proxy.conf.example to .proxy.conf file in  /development)_

# Running the App

**Note**: Docker and docker-compose are required**.
- launch docker application

 ``` bash
# run docker-compose in root folder
$ docker-compose up -d --build --force-recreate

# install and use nvm
$ nvm i
$ nvm use

$ npm i

$ npm run dev
```
When running Docker on **Windows** localhost is not accessible.

To access application call the following command and access at given ip:
``` bash
docker-machine ip default
```
<br> 

** _(to install docker on local)_
``` bash
$ brew install docker
$ brew install docker-compose
```
