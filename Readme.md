## Gatsby Plugin AppSync

A Gatsby plugin that makes working with AWS AppSync Client and React Apollo a breeze.

## Quick Start

This plugin comes in two modes for Offline support and Apollo Hooks compatiblity respectively.

Install plugin

```bash
npm i gatsby-plugin-appsync
```

## Usage

Create an environment variable file which holds config params inside the root of your project

**.env.[stage-name]**

e.g

.env.development

```yaml
AWS_REGION=eu-west-2
COGNITO_USER_POOL_ID=
COGNITO_APP_CLIENT_ID=
COGNITO_IDENTITY_POOL_ID=
AUTH_TYPE=API_KEY # AWS_IAM, AMAZON_COGNITO_USER_POOLS, OPENID_CONNECT
AUTH_API_KEY=12345 # if using API_KEY
GRAPHQL_ENDPOINT=<AppSync GraphQL Endpoint>
S3_BUCKET_URL=<S3 Bucket URL>  # Required for s3 uploads using complexObjectsCredentials
S3_MAX_ATTACHMENT_SIZE=2000000
```

Add plugin in gatsby-config.js

**Usage with react hooks but no offline support yet**

```js
module.exports = {
  plugins: [
   "gatsby-plugin-appsync",
    ...
  ]
};
```

Same usage applies as using the latest version of React Apollo ( v 3+), with hooks.

e.g

```js
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
```

You can also use

```js
import { Query, graphql } from "react-apollo";
```

**For offline support, without apollo react hooks**

```js
module.exports = {
  plugins: [
    {
      resolve: "gatsby-plugin-appsync",
      options: {
        legacy: true // default: false
      }
    }
    ...
  ]
};
```

Since NPM drop in replacement was used to alias both apollo-client@2.6.4 and react-apollo@2.5.6 for offline support and cold install, Queries, Mutations or Subscriptions can then be imported using the hint below

e.g

```js
import { Query, Mutation, Subscription, graphql } from "react-apollo-legacy";
```

To enable offline support, ensure _`"legacy"`_ is set to `true` in your gatsby-config.js, and _`"react-apollo-legacy"`_ is the import used

## Next Steps

**Custom Rehydrate component**
For legacy mode only with offline support

```js
// Shadow copy ./src/gatsby-plugin-appsync/rehydrate.js

import React from "react";
import { Rehydrated } from "aws-appsync-react";

export default function rehydrate({ children }) {
  return <Rehydrated loading="loading...">{children}</Rehydrated>;
}
```

## Features

- Apollo 3+ support with Hooks
- Offline support ( currently available in legacy mode )
- SSR ready
- One point configuration without additional npm installs
