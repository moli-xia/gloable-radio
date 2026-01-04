export interface RadioSearchParams {
  name?: string;
  countrycode?: string;
  state?: string;
  language?: string;
  tag?: string;
  stationuuid?: string;
  limit?: number;
  offset?: number;
  order?: 'name' | 'clickcount' | 'clicktrend' | 'random';
  reverse?: boolean;
  hidebroken?: boolean;
} 