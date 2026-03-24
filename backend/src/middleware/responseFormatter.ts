import { Response } from 'express';
import { ApiResponse, PaginatedResponse } from '@/types';

/**
 * Send successful response
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  status: number = 200,
  message?: string
): void {
  res.status(status).json({
    success: true,
    data,
    message,
  } as ApiResponse<T>);
}

/**
 * Send paginated response
 */
export function sendPaginated<T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  pages: number,
  status: number = 200
): void {
  res.status(status).json({
    success: true,
    data,
    total,
    page,
    pages,
  } as PaginatedResponse<T>);
}

/**
 * Send error response
 */
export function sendError(
  res: Response,
  error: string,
  status: number = 500,
  message?: string
): void {
  res.status(status).json({
    success: false,
    error,
    message,
  } as ApiResponse<null>);
}

/**
 * Send created response
 */
export function sendCreated<T>(
  res: Response,
  data: T,
  message: string = 'Resource created successfully'
): void {
  res.status(201).json({
    success: true,
    data,
    message,
  } as ApiResponse<T>);
}

/**
 * Send deleted response
 */
export function sendDeleted(
  res: Response,
  message: string = 'Resource deleted successfully'
): void {
  res.status(200).json({
    success: true,
    message,
  } as ApiResponse<null>);
}

/**
 * Send not found response
 */
export function sendNotFound(
  res: Response,
  resource: string = 'Resource'
): void {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `${resource} not found`,
  } as ApiResponse<null>);
}

/**
 * Send bad request response
 */
export function sendBadRequest(res: Response, message: string): void {
  res.status(400).json({
    success: false,
    error: 'Bad Request',
    message,
  } as ApiResponse<null>);
}

/**
 * Send validation error response
 */
export function sendValidationError(
  res: Response,
  errors: Record<string, string[]>
): void {
  res.status(422).json({
    success: false,
    error: 'Validation Error',
    message: 'One or more validation errors occurred',
    errors,
  } as any);
}

/**
 * Send unauthorized response
 */
export function sendUnauthorized(
  res: Response,
  message: string = 'Unauthorized'
): void {
  res.status(401).json({
    success: false,
    error: 'Unauthorized',
    message,
  } as ApiResponse<null>);
}

/**
 * Send forbidden response
 */
export function sendForbidden(
  res: Response,
  message: string = 'Forbidden'
): void {
  res.status(403).json({
    success: false,
    error: 'Forbidden',
    message,
  } as ApiResponse<null>);
}

/**
 * Send server error response
 */
export function sendServerError(
  res: Response,
  message: string = 'Internal server error'
): void {
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message,
  } as ApiResponse<null>);
}
