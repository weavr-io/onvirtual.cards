# onvirtual.cards

This is a demo application called **onvirtual.cards** used to illustrate how to integrate with Weavr.  This demo is also deployed and accessible at https://demo.onvirtual.cards.  To create an account visit https://demo.weavr.io.

**This app is made up of 2 parts:**
- **App**: A front-end implemented in Vue.js
- **Proxy**: A lightweight back-end (Nginx proxy) used to hide sensitive application data

# Configuration
1. Copy .env.example file to a new .env file in the project root and fill in the correct environment variables.  These values are available upon setting an Innovator integration with the Weavr Platform (https://docs.weavr.io/docs/step-by-step/).  For this application, you must choose the *Business Purchasing* payment model. Note that BASE_URL points to the proxy server (Dockerfile-proxy) while BASE_URL_SCRIPT should point to the Weavr **Build** environment. The CONSUMER variables can be ignored. 
2. Copy .proxy.conf.example to .proxy.conf file in the project root. Replace ${SECRET_KEY} with the **API Key** value in the Innovator Portal API Credentials.

# Running the App

**Note**: Docker and docker-compose are required.
``` bash
# run docker-compose in root folder
$ docker-compose up -d --build
```
Access application at **http://localhost**