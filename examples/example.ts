import { createReactiveNotifier, createReactiveNotifierGroup, NotifyFactory, NotifyMessage } from '../src';

export interface MessageNotification {
  message: string;
}

const notifier = createReactiveNotifier<MessageNotification>();

notifier
  .observeNotifications({
    success: (msg) => console.log('Success:', msg),
  })
  .subscribe();

notifier.notify(NotifyFactory.success({ message: 'Operation completed successfully!' }));

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
