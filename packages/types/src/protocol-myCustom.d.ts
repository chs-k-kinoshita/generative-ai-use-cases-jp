export type DBRefRequest = DBRefTableInfo[];

export type DBRefColumnInfo = {
  name: string;
  value: string;
};

export type DBRefTableInfo = {
  table: string;
  cols: DBRefColumnInfo[];
};