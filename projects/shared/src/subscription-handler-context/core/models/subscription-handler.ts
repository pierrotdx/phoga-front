import { Subject } from 'rxjs';

export interface ISubscriptionHandler<T> {
  subscribeTo(subject: Subject<T> | undefined): void;
  unsubscribe(): void;
}
