import React from "react";

export const wrapRootElement = ({ element }, pluginOptions) => {
  if (pluginOptions.legacy) {
    const ApolloClient = require("./client-offline").default;
    return <ApolloClient>{element}</ApolloClient>;
  }

  const ApolloClient = require("./client").default;
  return <ApolloClient>{element}</ApolloClient>;
};
