import { Alert } from 'react-native';

export interface ErrorConfig {
  title?: string;
  message?: string;
  showAlert?: boolean;
}

export const handleError = (
  error: Error, 
  context: string, 
  config: ErrorConfig = {}
) => {
  const { 
    title = '错误', 
    message = '操作失败，请稍后重试', 
    showAlert = true 
  } = config;

  console.error(`[${context}]:`, error);

  if (showAlert) {
    Alert.alert(title, message);
  }
};