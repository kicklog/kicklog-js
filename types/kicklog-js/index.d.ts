export interface Kicklog {
  customer(): Promise<any>
  user(): Promise<any>
  track(): Promise<any>
}

export interface KicklogConstructor {
  (key: string): Kicklog;
}