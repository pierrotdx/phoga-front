import { Observer, Subscribable, Unsubscribable } from 'rxjs';
import { ISubscriptionHandler } from '../models';

export class SubscriptionHandler<T> implements ISubscriptionHandler<T> {
  private subscription: Unsubscribable | undefined;
  private observable: Subscribable<T> | undefined;
  private readonly observer: Partial<Observer<T>>;

  constructor(
    onNext: (data: T) => void,
    onError?: (err: any) => void,
    onComplete?: () => void
  ) {
    this.observer = { next: onNext };
    if (onError) {
      this.observer.error = onError;
    }
    if (onComplete) {
      this.observer.complete = onComplete;
    }
  }

  subscribeTo(subject: Subscribable<T> | undefined): void {
    this.unsubscribe();
    this.observable = subject;
    this.subscription = this.observable?.subscribe(this.observer);
  }

  unsubscribe(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      delete this.subscription;
    }
  }
}
