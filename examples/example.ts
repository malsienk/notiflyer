import {
  createCustomReactiveNotifier,
  createCustomReactiveNotifierGroup,
  createReactiveNotifier,
  createReactiveNotifierGroup,
  CustomNotifyMessage,
  NotifyFactory,
  NotifyMessage,
} from '../src';

export interface MessageNotification {
  message: string;
}

// Single
const notifier = createReactiveNotifier<MessageNotification>();

notifier
  .observeNotifications({
    success: (msg) => console.log('Success:', msg),
  })
  .subscribe();

notifier.notify(NotifyFactory.success({ message: 'Operation completed successfully!' }));

// Group
interface AppNotifications {
  taskNotifier: NotifyMessage<{ taskId: string }>;
  userNotifier: NotifyMessage<{ taskId: string }>;
}

const notifiers = createReactiveNotifierGroup<AppNotifications>(['taskNotifier', 'userNotifier']);

notifiers.taskNotifier
  .observeNotifications({
    inProgress: (msg) => console.log('Task in progress:', msg),
  })
  .subscribe();

notifiers.taskNotifier.notify(NotifyFactory.inProgress({ taskId: '123' }));

// Custom
type CustomStates = 'LOADING' | 'ERROR' | 'COMPLETED';
const customStates: CustomStates[] = ['LOADING', 'ERROR', 'COMPLETED'];
export interface CustomMessageNotification extends Record<string, unknown> {
  message: string;
}

// Custom single
const customNotifier = createCustomReactiveNotifier<CustomMessageNotification, CustomStates>(customStates);

customNotifier
  .observeNotifications({
    LOADING: (msg) => console.log('Loading:', msg),
    ERROR: (msg) => console.error('Error:', msg),
    COMPLETED: (msg) => console.log('Completed:', msg),
  })
  .subscribe();

customNotifier.notify({ status: 'LOADING', message: 'Fetching data...' });
customNotifier.notify({ status: 'COMPLETED', message: 'Data fetched successfully!' });
customNotifier.notify({ status: 'ERROR', message: 'Failed to fetch data.' });

// Custom group
interface CustomAppNotifications {
  taskNotifier: CustomNotifyMessage<{ taskId: number }, CustomStates>;
  userNotifier: CustomNotifyMessage<{ taskId: string }, CustomStates>;
}

const customNotifiers = createCustomReactiveNotifierGroup<CustomAppNotifications, CustomStates>(
  ['taskNotifier', 'userNotifier'],
  customStates,
);

customNotifiers.taskNotifier
  .observeNotifications({
    LOADING: (msg) => console.log('Loading:', msg),
    ERROR: (msg) => console.error('Error:', msg),
    COMPLETED: (msg) => console.log('Completed:', msg),
  })
  .subscribe();

customNotifiers.taskNotifier.notify({ status: 'LOADING', taskId: 1 });
customNotifiers.taskNotifier.notify({ status: 'COMPLETED', taskId: 1 });
customNotifiers.taskNotifier.notify({ status: 'ERROR', taskId: 1 });
