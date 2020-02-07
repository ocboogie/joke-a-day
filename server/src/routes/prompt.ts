import { Request, Response } from "express";

export function handlerGetPrompt(req: Request, res: Response) {
  return res.json("hello world").status(200);
}
