const fs = require("fs");
const path = require("path");

const nodeEnv = process.env.NODE_ENV;

const config = require("dotenv").config({
  path: `.env.${nodeEnv}`
});

exports.onPreBootstrap = ({ reporter }) => {
  const envString = `GATSBY_AWS_REGION=eu-west-2
GATSBY_COGNITO_USER_POOL_ID=
GATSBY_COGNITO_APP_CLIENT_ID=
GATSBY_COGNITO_IDENTITY_POOL_ID=
GATSBY_AUTH_TYPE=API_KEY
GATSBY_AUTH_API_KEY=12345
GATSBY_GRAPHQL_ENDPOINT=http://localhost:4000/graphql
GATSBY_S3_BUCKET_URL=
GATSBY_S3_MAX_ATTACHMENT_SIZE=2000000`;

  const currEnv = path.join(`.env.${nodeEnv}`);
  const envPath = path.join(`.env.example`);

  if (!fs.existsSync(currEnv)) {
    reporter.info(
      "Ensure to create an env.[stage-name] using .env.example as a format"
    );
    fs.createWriteStream(envPath, { encoding: "UTF-8" }).write(envString);
  }
};
