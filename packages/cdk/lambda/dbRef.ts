import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DBRefRequest, DBRefResponse } from 'generative-ai-use-cases-jp';
import { findRecords } from './utils/dbRef_util';

const DB_NAME = 'sample_db';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {

  let req: DBRefRequest = [];
  try {
    req = JSON.parse(event.body!);
    console.log('req', req);
    if (!req || !Array.isArray(req)) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ message: 'Invalid request format' }),
      };
    }
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ message: 'Invalid request format' }),
    };
  }

  try {
    const secretName = process.env.SECRETS_ID;
    const result: DBRefResponse = await findRecords(secretName!, DB_NAME, req)
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
