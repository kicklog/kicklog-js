import { initKicklog, LoadKicklog, loadScript } from "./shared";

const kicklogPromise = Promise.resolve().then(() => loadScript(null));

let loadCalled = false;

kicklogPromise.catch((err: Error) => {
  if (!loadCalled) console.warn(err);
});

export const loadKicklog: LoadKicklog= (...args) => {
  loadCalled = true;
  return kicklogPromise.then(maybe => initKicklog(maybe, args));
}
