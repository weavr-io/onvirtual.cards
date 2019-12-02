# Demo App - onvirtual.cards

## Common

Include `/app/secure/static/client.1.js` in the head section of your html. In the demo app (using VueJS) we do this by including it in the head > script section of the nuxt.config.js

## Language / Frameworks

### Using VueJS

For VueJS, we have included a plugin which is located in `plugins/weavr/security.client.ts` which includes the below:

- registration of all the components: WeavrForm, WeavrInput and WeavrSpan
- calls the `init` call on `OpcUxSecureClient`
- injects the `weavrSecurityAssociate` function into conext

If you are using VueJS for your front-end, you can re-use our plugin.

#### The `weavrSecurityAssociate` function

The `weavrSecurityAssociate` function is called every time the token is changed - in our Demo app this can be viewed in `authCookie.ts` in the middleware folder.

#### Components

##### Weavr Span

For an example, we use span in this Demo in `components/Card.vue`

##### Weavr Form & Input

Check out `pages/login/index.vue` for an example of Form and Input.

### Other Language / Framework

If you would like to implement your application in another language/framework, you need to replicate the plugin as shown in `plugins/weavr`.

This includes :
- The definition and implementation of these components
	- WeavrSpan
	- WeavrInput
	- WeavrForm
- Calling the `init` method on `OpcUxSecureClient` on app initiation
- Calling the `associate` method on `OpcUxSecureClient` on change of the user token