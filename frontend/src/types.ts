import type { router } from "./App";

export type NavigateOptions = Parameters<typeof router.navigate>[0];

export type ToUrlString = NavigateOptions["to"];
