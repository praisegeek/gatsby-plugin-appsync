import React from "react";
import { Rehydrated } from "aws-appsync-react";

export default function rehydrate({ children }) {
  return <Rehydrated>{children}</Rehydrated>;
}
