import { TestInvokeByAdminResponse } from 'generative-ai-use-cases';
import useHttp from './useHttp';

const useAdminOnlyApi = () => {
  const { api } = useHttp();

  const getFeedbacksForAdmin = async (): Promise<TestInvokeByAdminResponse> => {
    try {
      const response = await api.get<TestInvokeByAdminResponse>(
        `admin-only/test-invoke`
      );
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  return {
    getFeedbacksForAdmin,
  };
};

export default useAdminOnlyApi;
