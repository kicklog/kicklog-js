type TrackRequest = {
  userId: string;
  customerId: string;
  action: string;
};

type CustomerRequest = {
  customerId: string;
  name?: string;
};

type UserRequest = {
  userId: string;
  customerId: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
};

export interface Kicklog {
  customer(req: CustomerRequest): Promise<any>;
  user(req: UserRequest): Promise<any>;
  track(req: TrackRequest): Promise<any>;
}

export interface KicklogConstructor {
  (key: string): Kicklog;
}
