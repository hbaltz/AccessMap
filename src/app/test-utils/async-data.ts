import { defer, Observable } from 'rxjs';

/**
 * Create async observable that emits-once
 * and completes after a JS engine turn.
 */
export function asyncData<T>(data: T): Observable<T> {
  return defer(() => Promise.resolve(data));
}
