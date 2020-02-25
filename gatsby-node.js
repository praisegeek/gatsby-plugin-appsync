const fs = require("fs");
const path = require("path");

const nodeEnv = process.env.NODE_ENV;

const config = require("dotenv").config({
  path: `.env.${nodeEnv}`
});

exports.onPreBootstrap = ({ reporter }) => {
  const envString = `\
GATSBY_GRAPHQL_ENDPOINT=http://localhost:20002/graphql
GATSBY_REGION=eu-west-2
GATSBY_COGNITO_USER_POOL_ID=
GATSBY_COGNITO_IDENTITY_POOL_ID=
GATSBY_COGNITO_APP_CLIENT_ID=
GATSBY_S3_BUCKET
GATSBY_S3_REGION
GATSBY_AUTH_API_KEY=da2-fakeApiId123456
GATSBY_AUTH_TYPE=API_KEY
GATSBY_APOLLO_CLIENT_VERSION=WITH_HOOKS
`;

  const currEnv = path.join(`.env.${nodeEnv}`);
  const envPath = path.join(`.env.example`);

  if (!fs.existsSync(currEnv)) {
    reporter.info(
      "Ensure to create an env.[stage-name] using .env.example as a format"
    );
    fs.createWriteStream(envPath, { encoding: "UTF-8" }).write(envString);
  }
};
