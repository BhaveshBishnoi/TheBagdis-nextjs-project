import { NextResponse } from 'next/server';

export const successResponse = (data: any, status = 200) => {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
};

export const errorResponse = (message: string, status = 400) => {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status }
  );
};

export const validateFields = (obj: any, requiredFields: string[]) => {
  const missingFields = requiredFields.filter(field => !obj[field]);
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
};

export const handleApiError = (error: unknown) => {
  console.error('API Error:', error);
  if (error instanceof Error) {
    return errorResponse(error.message);
  }
  return errorResponse('An unexpected error occurred');
};
