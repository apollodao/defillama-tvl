export type WarchestAsset = {
  symbol: string;
  balance_query: (height: number) => Promise<number>;
  price_query: (height: number) => Promise<number>;
};
