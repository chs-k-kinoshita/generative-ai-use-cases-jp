import { TestInvokeByAdminEvent } from 'generative-ai-use-cases';

export const handler = async (event: TestInvokeByAdminEvent) => {
  try {
    console.log('Getting token usage statistics', { event });

    // Get groups and user from Cognito
    const adminEmail = event.requestContext.authorizer!.claims.email;
    const adminUserName =
      event.requestContext.authorizer!.claims['cognito:username'];
    const groups = event.requestContext.authorizer!.claims['cognito:groups'];

    if (!groups || !groups.includes('admin')) {
      return {
        statusCode: 403,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          message: 'Forbidden',
        }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: `invoked by admin user ${adminEmail}(${adminUserName}) with groups ${groups}`,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
