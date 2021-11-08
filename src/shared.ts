import { Kicklog, KicklogConstructor } from "../types";

export type LoadKicklog = (
  ...args: Parameters<KicklogConstructor>
) => Promise<Kicklog | null>;

export interface LoadParams {
  debug: boolean;
}

export const initKicklog = (
  maybe: KicklogConstructor | null,
  args: Parameters<KicklogConstructor>
): Kicklog | null => {
  if (maybe === null) return null;

  const kicklog = maybe.apply(undefined, args);
  return kicklog;
};

let kicklogPromise: Promise<KicklogConstructor | null> | null = null;

export const loadScript = (): Promise<KicklogConstructor | null> => {
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

const V0_URL = "https://kicklog.co/js/v0";
const V0_URL_REGEX = /^https:\/\kicklog\.co\/js\/v0\/?(\?.*)?$/;

const findScript = (): HTMLScriptElement | null => {
  const scripts = document.querySelectorAll<HTMLScriptElement>(
    `script[src^="${V0_URL}"]`
  );

  for (let i = 0; i < scripts.length; i++) {
    const script = scripts[i];

    if (!V0_URL_REGEX.test(script.src)) {
      continue;
    }

    return script;
  }

  return null;
};
const injectScript = (): HTMLScriptElement => {
  const script = document.createElement("script");
  script.src = `${V0_URL}`;

  const headOrBody = document.head || document.body;

  if (!headOrBody) {
    throw new Error(
      "Expected document.body not to be null. Kicklog.js requires a <body> element."
    );
  }

  headOrBody.appendChild(script);
  return script;
};
