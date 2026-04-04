export interface TestInvokeByAdminResponse {
  message: string;
}

export interface TestInvokeByAdminEvent {
  requestContext: {
    authorizer: {
      claims: {
        email: string;
        'cognito:username': string;
        'cognito:groups': string;
        [key: string]: string | undefined;
      };
    };
  };
}
