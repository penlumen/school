export default class ApiResponse {
  status: number;
  success: boolean;
  message: string;
  data: any | null;

  constructor(
    status: number,
    success: boolean,
    message: string,
    data: any | null = null,
  ) {
    this.status = status;
    this.success = success;
    this.message = message;
    this.data = data;
  }
}
