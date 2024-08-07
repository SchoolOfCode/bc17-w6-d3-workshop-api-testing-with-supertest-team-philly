import express from "express";
import logger from "morgan";
import usersRouter from "./users/users.router.js";
// Router acts as a short cut for instructions 
const app = express();

/**
 * Useful for logging incoming requests (in case we need to check have we even received a request).
 */
app.use(logger("dev"));

/**
 * Useful for detecting and parsing JSON in incoming requests and attaching the parsed result to the request's body (for other request handlers to use).
 */
app.use(express.json());

/**
 * Useful for checking whether the server itself is running and can provide a simple response to a simple request.
 */
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    payload: "API is running correctly",
  });
});

/**
 * Useful to specify the path once here, as then we don't need to repeat "/api/users" for each route inside the router.
 */
app.use("/api/users", usersRouter);

/**
 * Overrides the default "not found" HTML response with a JSON response. This is useful as the caller/client only ever needs to work with JSON.
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    reason: `No resource found at ${req.path}, please re-check the path and try again.`,
  });
});

/**
 * Overrides the default "error" HTML response with a JSON response. This is useful as the caller/client only ever needs to work with JSON.
 */
app.use((error, _req, res, _next) => {
  console.error(error.stack);

  res.status(500).json({
    success: false,
    reason: "An unexpected error occurred, please try again later",
  });
});

export default app;
