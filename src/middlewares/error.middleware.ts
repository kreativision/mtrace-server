import { getEnv } from "@env/config";
import { TypedResponse } from "@mt-types/requests";
import { ErrorRequestHandler, NextFunction, Request } from "express";

const errorHandler: ErrorRequestHandler = (
  err: Error | undefined,
  _req: Request,
  res: TypedResponse,
  _next: NextFunction
) => {
  const { NODE_ENV } = getEnv();
  res.json({
    message: err?.message ?? "",
    stack: NODE_ENV === "development" ? err?.stack : null,
  });
};

export default errorHandler;
