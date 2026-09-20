class ApiResponse<T = null> {
  public readonly statusCode: number;
  public readonly message: string;
  public readonly data: T | null;
  public readonly success: boolean;
  public readonly meta?: Record<string, unknown>;

  constructor(
    statusCode: number,
    data: T | null,
    message = "success",
    meta?: Record<string, unknown>
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode < 400;
    this.meta = meta;
  }

 static success<T>({
    statusCode,
    data,
    message = "success",
    meta,
  }: {
    statusCode: number;
    data: T;
    message?: string;
    meta?: Record<string, unknown>;
  }) {
    return new ApiResponse(
      statusCode,
      data,
      message,
      meta
    );
  }
}

export default ApiResponse;