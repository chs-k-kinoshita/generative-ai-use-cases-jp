export type DBRefRequest = DBRefTableInfo[];
export type DBRefResponse = DBRefResult[];

export type DBRefColumnInfo = {
  name: string;
  value: string;
};

export type DBRefTableInfo = {
  table: string;
  cols: DBRefColumnInfo[];
};

export type DBRefResultCol = {
  cName: string;
  cComment?: string;
  cValue: any;
};

export type DBRefResult = {
  table: string;
  tableComment?: string;
  cValues: DBRefResultCol[];
};

