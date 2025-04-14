import * as mysql from 'mysql2/promise';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';
import { DBRefRequest, DBRefResponse, DBRefTableInfo } from 'generative-ai-use-cases-jp';

const secretClient = new SecretsManagerClient({ region: 'ap-northeast-1' });

export async function findRecords(
  secretId: string,
  dbName: string,
  dbRefInfos: DBRefRequest,
): Promise<DBRefResponse> {
  // データベース接続設定
  console.log('connect dbName', dbName);
  const connection = await createConnection(dbName, secretId);
  const result: DBRefResponse = [];
  try {
    for (const dbRefInfo of dbRefInfos) {
      const rows = await selectValues(connection, dbRefInfo);
      const cValues = rows.map((row: any) => {
        return Object.keys(row).map((colName) => {
          return {
            cName: colName,
            // cComment: '',
            cValue: row[colName],
          };
        });
      });
      result.push({
        table: dbRefInfo.table,
        cValues,
      });
    }
  } finally {
    // 接続を閉じる
    await connection.end();
  }
  return result;
}

async function selectValues(connection: mysql.Connection, dbRefInfo: DBRefTableInfo) {
  const tableName = dbRefInfo.table;
  // 動的にWHERE句を構築
  const whereClause = dbRefInfo.cols.map(col => `${col.name} = ?`).join(' AND ');
  const values = dbRefInfo.cols.map(col => col.value);
  const query = `SELECT * FROM ${tableName} WHERE ${whereClause}`;
  const [rows] = await (connection as any).query(query, values);
  return rows;
}

async function createConnection(dbName: string, secretId: string) {
  const response = await secretClient.send(new GetSecretValueCommand({ SecretId: secretId }));
  if (!response.SecretString) {
    throw new Error('Secrets Managerからシークレット文字列を取得できませんでした。');
  }
  const secretValue = JSON.parse(response.SecretString);
  const connection = await mysql.createConnection({
    host: secretValue.host,
    user: secretValue.username,
    password: secretValue.password,
    database: dbName,
  });
  return connection;
}