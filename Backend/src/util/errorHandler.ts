import express, { response } from "express";

export const sendErrorMessage = (
  message: string,
  code: number
): express.Response => {
  return response.status(code).json({ message: "message" });
};

// export const sendErrorMessage = (message: string, code: number): typeof response => {
//     return response.status(code).send({"message": `message`});
// }

// public static sendErrorJson(message: JSON, code : number) : typeof response {
//     return response.status(code).json(`message : ${message}`);
// }
