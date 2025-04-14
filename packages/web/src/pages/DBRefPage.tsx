import React from 'react';
import useHttp from '../hooks/useHttp';

import { DBRefRequest, DBRefColumnInfo } from 'generative-ai-use-cases-jp';

const DBRefPage: React.FC = () => {
  const http = useHttp();

  function parseQueryParams(query: string): DBRefRequest {
    const params = new URLSearchParams(query);
    const keys = params.getAll("key");

    return keys.map((entry) => {
      const parts = entry.split(",");
      const table = parts[0];
      const cols: DBRefColumnInfo[] = parts.slice(1).map((colStr) => {
        const [name, value] = colStr.split(".");
        return { name, value };
      });

      return { table, cols };
    });
  }

  // 使用例
  // const query = "?key=TABLE_A,column_1.valueXXX,column_2.yyy&key=TABLE_B,column_1.valueYYY";
  const query = "?key=TABLE_A,column_1.valueXXX,column_2.yyy";
  const parsedResult = parseQueryParams(query);
  console.log(parsedResult);
  const onClickTest = async () => {
    const res = await http.post('dbRef', parsedResult);
    console.log(res.data);
  };
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <pre>{JSON.stringify(parsedResult, null, 2)}</pre>
      <button onClick={onClickTest}>ExecTest</button>
    </div>
  );
};

export default DBRefPage;
