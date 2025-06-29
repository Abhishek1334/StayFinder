export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  statusCode?: number;
  errors?: Array<{
    field: string;
    message: string;
  }>;
} 