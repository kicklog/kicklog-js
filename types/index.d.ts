export * from './kicklog-js'

import { Kicklog, KicklogConstructor } from './kicklog-js'

export const loadKicklog: (clientKey: string) => Promise<Kicklog | null>  

declare global {
  interface Window {
    Kicklog?: KicklogConstructor;
  }
}