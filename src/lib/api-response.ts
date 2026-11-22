import { NextResponse } from "next/server";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export function apiSuccess<T>(data: T, status = 200, message?: string) {
  return NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      data,
      message,
    },
    { status }
  );
}

export function apiError(error: string, status = 400) {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error,
    },
    { status }
  );
}
