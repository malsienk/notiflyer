import { Observable, Subject, tap } from 'rxjs';

export enum NotifyStatus {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  IN_PROGRESS = 'IN_PROGRESS',
  IDLE = 'IDLE',
}

export type NotifyMessage<T = Record<string, unknown>> = { status: NotifyStatus } & Record<string, unknown> & T;

export interface NotifyCallback<T = Record<string, unknown>> {
  success?: (msg: T) => void;
  failure?: (msg: T) => void;
  inProgress?: (msg: T) => void;
  idle?: (msg: T) => void;
  notify?: (msg: T) => void;
}

function handleNotifyMessage<T>(
  callback: NotifyCallback<T>,
): (source: Observable<NotifyMessage<T>>) => Observable<NotifyMessage<T>> {
  return (source: Observable<NotifyMessage<T>>) =>
    source.pipe(
      tap((message: NotifyMessage<T>) => {
        callback.notify?.(message);
        switch (message.status) {
          case NotifyStatus.SUCCESS: {
            callback.success?.(message);
            break;
          }
          case NotifyStatus.FAILURE: {
            callback.failure?.(message);
            break;
          }
          case NotifyStatus.IN_PROGRESS: {
            callback.inProgress?.(message);
            break;
          }
          case NotifyStatus.IDLE: {
            callback.idle?.(message);
            break;
          }
        }
      }),
    );
}

export class ReactiveNotifier<T extends NotifyMessage> {
  private readonly subject: Subject<T>;

  constructor() {
    this.subject = new Subject<T>();
  }

  public notify(message: T): void {
    this.subject.next(message);
  }

  public observeNotifications(callback: NotifyCallback<T>): Observable<T> {
    return this.subject.asObservable().pipe(handleNotifyMessage(callback));
  }
}

export function createReactiveNotifier<T>(): ReactiveNotifier<NotifyMessage<T>> {
  return new ReactiveNotifier<NotifyMessage<T>>();
}

export function createReactiveNotifierGroup<T extends Record<keyof T, NotifyMessage>>(
  keys: (keyof T)[],
): { [K in keyof T]: ReactiveNotifier<T[K]> } {
  // eslint-disable-next-line no-use-before-define
  const notifiers = {} as { [K in keyof T]: ReactiveNotifier<T[K]> };
  for (let i = 0; i < keys.length; i++) {
    notifiers[keys[i]] = new ReactiveNotifier<T[keyof T]>();
  }
  return notifiers;
}

export const NotifyState = {
  isSuccess: <T>(message: NotifyMessage<T>): boolean => message.status === NotifyStatus.SUCCESS,
  isFailure: <T>(message: NotifyMessage<T>): boolean => message.status === NotifyStatus.FAILURE,
  isInProgress: <T>(message: NotifyMessage<T>): boolean => message.status === NotifyStatus.IN_PROGRESS,
  isIdle: <T>(message: NotifyMessage<T>): boolean => message.status === NotifyStatus.IDLE,
};

export const NotifyFactory = {
  success: <T>(data: T): NotifyMessage<T> => ({ status: NotifyStatus.SUCCESS, ...data }),
  failure: <T>(data: T): NotifyMessage<T> => ({ status: NotifyStatus.FAILURE, ...data }),
  inProgress: <T>(data: T): NotifyMessage<T> => ({ status: NotifyStatus.IN_PROGRESS, ...data }),
  idle: <T>(data: T): NotifyMessage<T> => ({ status: NotifyStatus.IDLE, ...data }),
};

// custom
export type CustomNotifyMessage<T = Record<string, unknown>, S extends string = string> = { status: S } & T;

export type CustomNotifyCallback<T = Record<string, unknown>, S extends string = string> = {
  [K in S]?: (msg: T & { status: K }) => void;
} & {
  notify?: (msg: T & { status: S }) => void;
};

function handleCustomNotifyMessage<T, S extends string>(
  callback: CustomNotifyCallback<T, S>,
): (source: Observable<CustomNotifyMessage<T, S>>) => Observable<CustomNotifyMessage<T, S>> {
  return (source: Observable<CustomNotifyMessage<T, S>>) =>
    source.pipe(
      tap((message: CustomNotifyMessage<T, S>) => {
        callback.notify?.(message);
        const stateCallback = callback[message.status];
        if (stateCallback) {
          stateCallback(message);
        }
      }),
    );
}

export class CustomReactiveNotifier<T extends Record<string, unknown>, S extends string> {
  private readonly subject: Subject<CustomNotifyMessage<T, S>>;

  constructor() {
    this.subject = new Subject<CustomNotifyMessage<T, S>>();
  }

  public notify(message: CustomNotifyMessage<T, S>): void {
    this.subject.next(message);
  }

  public observeNotifications(callback: CustomNotifyCallback<T, S>): Observable<CustomNotifyMessage<T, S>> {
    return this.subject.asObservable().pipe(handleCustomNotifyMessage(callback));
  }
}

export function createCustomReactiveNotifier<T extends Record<string, unknown>, S extends string>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  states: S[],
): CustomReactiveNotifier<T, S> {
  return new CustomReactiveNotifier<T, S>();
}

export function createCustomReactiveNotifierGroup<T extends Record<keyof T, Record<string, unknown>>, S extends string>(
  keys: (keyof T)[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  states: S[],
): { [K in keyof T]: CustomReactiveNotifier<T[K], S> } {
  // eslint-disable-next-line no-use-before-define
  const notifiers = {} as { [K in keyof T]: CustomReactiveNotifier<T[K], S> };
  for (let i = 0; i < keys.length; i++) {
    notifiers[keys[i]] = new CustomReactiveNotifier<T[keyof T], S>();
  }
  return notifiers;
}
