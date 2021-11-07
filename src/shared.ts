import {Kicklog, KicklogConstructor} from '../types'

export type LoadKicklog = (
  ...args: Parameters<KicklogConstructor>
) => Promise<Kicklog | null>;

export interface LoadParams {
  debug: boolean;
}

export const initKicklog = (
  maybe: KicklogConstructor| null,
  args: Parameters<KicklogConstructor>
): Kicklog| null => {
  if (maybe === null) return null;

  const kicklog = maybe.apply(undefined, args);
  return kicklog;
};

let kicklogPromise: Promise<KicklogConstructor| null> | null = null;

export const loadScript = (
  params: null | LoadParams
): Promise<KicklogConstructor| null> => {
  if (kicklogPromise !== null) return kicklogPromise;

  kicklogPromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      resolve(null);
      return;
    }

    if (window.Kicklog) {
      resolve(window.Kicklog);
      return;
    }

    // if nothing script process here...
    try {
      let script = findScript();
      if (!script) script = injectScript();

      script.addEventListener("load", () => {
        if (window.Kicklog) resolve(window.Kicklog);
        reject(new Error("Kicklog.js not available."));
      });

      script.addEventListener("error", () => {
        reject(new Error("Failed to load Kicklog.js"));
      });
    } catch (error) {
      reject(error);
      return;
    }
  });

  return kicklogPromise;
};

const V1_URL = "https://kicklog.vercel.app/js/v0";
const V1_URL_REGEX = /^https:\/\/kicklog\.vercel\.app\/js\/v0\/?(\?.*)?$/;

const findScript = (): HTMLScriptElement | null => {
  const scripts = document.querySelectorAll<HTMLScriptElement>(
    `script[src^="${V1_URL}"]`
  );

  for (let i = 0; i < scripts.length; i++) {
    const script = scripts[i];

    if (!V1_URL_REGEX.test(script.src)) {
      continue;
    }

    return script;
  }

  return null;
};
const injectScript = (): HTMLScriptElement => {
  const script = document.createElement("script");
  script.src = `${V1_URL}`;

  const headOrBody = document.head || document.body;

  if (!headOrBody) {
    throw new Error(
      "Expected document.body not to be null. Kicklog.js requires a <body> element."
    );
  }

  headOrBody.appendChild(script);
  return script;
};