type ErrorEntity = {
  field: string;
  message: string;
};

export type EntityErrorResponse = {
  message: string;
  errors: ErrorEntity[];
};

export type ErrorResponseDto = EntityErrorResponse & {
  statusCode: number;
};
