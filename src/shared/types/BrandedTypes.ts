export type Branded<T, U> = T & { __brand: U; };

export type OrderId = Branded<string, 'OrderId'>;
export type ProductId = Branded<string, 'ProductId'>;