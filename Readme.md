# Gatsby Plugin AppSync

This plugin provides offline support and non-offline support with AWS Appysnc.

```bash
npm i gatsby-plugin-appsync
```

**This plugin uses Apollo Client and React Apollo Hooks as dependencies. To avoid clashes, remove those dependencies from your project before adding this plugin to package.json.**

## Configuration

Rename **.env.example** created by this plugin inside your root folder to your project's stage name.

Default

```
.env.development
```

Inside .env.development

```text
GATSBY_GRAPHQL_ENDPOINT=???
GATSBY_REGION=???
GATSBY_COGNITO_USER_POOL_ID=???
GATSBY_COGNITO_IDENTITY_POOL_ID=???
GATSBY_COGNITO_APP_CLIENT_ID=???
GATSBY_S3_BUCKET=???
GATSBY_S3_REGION=???
GATSBY_AUTH_API_KEY=???
GATSBY_AUTH_TYPE=API_KEY | AMAZON_COGNITO_USER_POOLS | AWS_IAM
GATSBY_APOLLO_CLIENT_VERSION=WITH_HOOKS | LEGACY
```

Inside node-config.js

```js
module.exports = {
  plugins: [
    resolve: {
      "gatsby-plugin-appsync",
      options: {
        mandatorySignIn: false // true | false
        oauth: {}, // optional for cognito hosted UI
        cookieStorage: {} // optional if you intend to use cookies. Default is localstorage for aws amplify Auth
        clientMetadata: {} // optional for aws amplify Auth
      }
    }
    ...
  ]
};
```

Refer to https://aws-amplify.github.io/docs/js/authentication#manual-setup for setting oauth, cookieStorage and clientMetadata options.

## Use cases

### React Apollo Hooks ( No offline support )

**Set `GATSBY_APOLLO_CLIENT_VERSION=WITH_HOOKS` as environment variables.**

This version uses React Apollo ( v 3+). No official offline support for AWS AppSynnc.

Using React Hooks & Components

```js
import { UseQuery, useLazyQuery, Query, graphql } from "react-apollo";

// or

import { useQuery, useLazyQuery } from "@apollo/react-hooks";
```

### Offline Support ( No React Apollo Hooks )

**Set `GATSBY_APOLLO_CLIENT_VERSION=LEGACY` as environment variables ( default )**

This version uses React Apollo ( v 2.6 )

Only React Apollo components are used

```js
import { Query, Mutation, Subscription, graphql } from "react-apollo-legacy";
```

## Next Steps

**AppSync Client**

This plugin exposes an AppSync client to be used anywhere based on the version set in environment variables

```js
import { client } from "gatsby-plugin-appsync";
```

**Custom Rehydrate component**

This is only useful for offline support, legacy mode.

```js
// Shadow copy ./src/gatsby-plugin-appsync/Rehydrate.js

import React from "react";
import { Rehydrated } from "aws-appsync-react";

export default function Rehydrate({ children }) {
  return <Rehydrated loading="loading...">{children}</Rehydrated>;
}
```

## Features

- React Apollo with Hooks
- Offline support in legacy version of React Apollo client
- SSR ready
- One point configuration without additional npm installs
- Provides Amplify Auth and Storage configs out of the box
- Available everywhere in your component tree

## TODO

- [ ] AWS AppSync Offline support in React Hooks in React Apollo v3+
