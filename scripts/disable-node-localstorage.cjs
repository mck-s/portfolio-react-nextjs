// Disable Node's experimental localStorage when it is broken or unwanted.
// This prevents SSR/dev overlay from calling a nonstandard localStorage.
if (typeof globalThis.localStorage !== "undefined") {
  const hasGetItem = typeof globalThis.localStorage.getItem === "function";
  if (!hasGetItem) {
    try {
      delete globalThis.localStorage;
    } catch {
      globalThis.localStorage = undefined;
    }
  }
}
