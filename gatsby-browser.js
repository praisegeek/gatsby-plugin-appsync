import React from "react";
import { AppSyncProvider } from "./index";

export const wrapRootElement = ({ element }, options) => (
  <AppSyncProvider options={options}>{element}</AppSyncProvider>
);
