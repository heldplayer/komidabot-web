export const CHANNEL_DAILY_MENUS = 'daily_menu';
export const CHANNEL_ADMINISTRATION = 'administration';

export interface SubscriptionChannel<T> {
  readonly name: string;
  readonly defaultData: T;
}

export class DailyMenuChannel implements SubscriptionChannel<any> {
  readonly name = CHANNEL_DAILY_MENUS;
  readonly defaultData = null;
}

export class AdministrationChannel implements SubscriptionChannel<void> {
  readonly name = CHANNEL_ADMINISTRATION;
  readonly defaultData = undefined;
}
