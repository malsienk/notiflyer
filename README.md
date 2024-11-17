# **notiflyer Library Documentation**

notiflyer is a lightweight library built with RxJS for managing notifications in a reactive and type-safe manner.
It supports multiple notification statuses (`SUCCESS`, `FAILURE`, `IN_PROGRESS`, and `IDLE`) and allows you to
easily integrate, handle, and evaluate notifications in your application.

---

## **Features**

- **Reactive Design:** Built on RxJS for flexible and reactive notifications.
- **Type-Safe Notifications:** Strongly typed notification messages for robust development.
- **Custom Notifiers:** Easily manage multiple notification streams.
- **Utility Functions:** Simplified creation and evaluation of notifications.

---

## **Installation**

Install the library via npm:

```bash
npm install notiflyer
```

---

## **Usage**

### **1. Creating and Using a Notifier**

#### Example: Single Notifier

```typescript
import { createReactiveNotifier, NotifyFactory } from 'notiflyer';

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
```

---

### **2. Creating and Managing Multiple Notifiers**

#### Example: Notifier Group

```typescript
import { createReactiveNotifierGroup, NotifyFactory, NotifyMessage } from 'notiflyer';

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
```

---

### **3. Utility Functions**

notiflyer provides utility functions for creating and evaluating notification messages:

#### **Message Factories**

- `NotifyFactory.success<T>(data: T): NotifyMessage<T>` – Creates a success notification.
- `NotifyFactory.failure<T>(data: T): NotifyMessage<T>` – Creates a failure notification.
- `NotifyFactory.inProgress<T>(data: T): NotifyMessage<T>` – Creates an in-progress notification.
- `NotifyFactory.idle<T>(data: T): NotifyMessage<T>` – Creates an idle notification.

#### **State Checkers**

- `NotifyState.isSuccess<T>(message: NotifyMessage<T>): boolean` – Checks if a message is a success notification.
- `NotifyState.isFailure<T>(message: NotifyMessage<T>): boolean` – Checks if a message is a failure notification.
- `NotifyState.isInProgress<T>(message: NotifyMessage<T>): boolean` – Checks if a message is in progress.
- `NotifyState.isIdle<T>(message: NotifyMessage<T>): boolean` – Checks if a message is idle.

#### Example:

```typescript
import { NotifyFactory, NotifyState } from 'notiflyer';

const message = NotifyFactory.failure({ error: 'Operation failed!' });

if (NotifyState.isSuccess(message)) {
  console.log('The operation was successful!');
} else {
  console.error('The operation failed:', message);
}
```

---

## **API Reference**

### **ReactiveNotifier<T>**

A generic class to manage a single stream of notifications.

- **Methods**:
  - `notify(message: T): void` – Emits a notification to all subscribers.
  - `observeNotifications(callback: NotifyCallback<T>): Observable<T>` – Sets up callbacks for handling notification statuses.

---

### **createReactiveNotifier<T>()**

Creates a new reactive notifier for managing a single notification stream.

- **Returns:** `ReactiveNotifier<T>` – A notifier instance.

---

### **createReactiveNotifierGroup<T>()**

Creates a group of reactive notifiers for managing multiple notification streams.

- **Parameters:**

  - `keys: (keyof T)[]` – List of notifier keys.

- **Returns:** `{ [K in keyof T]: ReactiveNotifier<T[K]> }` – A group of notifier instances.

---

# Example

This repository contains an example TypeScript project.

## Prerequisites

- **Node.js**: Make sure you have Node.js installed. You can download it from [Node.js official website](https://nodejs.org/).
- **npm**: Comes with Node.js. Verify installation with:
  ```bash
  node -v
  npm -v
  ```

## Installation

1. Clone the repository and navigate to the project directory:

   ```bash
   git clone https://github.com/malsienk/notiflyer.git
   cd notiflyer
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

## Running the Example

To run the example script, use the following command:

```bash
./node_modules/.bin/ts-node examples/example.ts
```

## **License**

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
