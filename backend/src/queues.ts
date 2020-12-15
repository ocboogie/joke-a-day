import Queue from "bull";
import Prompt from "./models/Prompt";

export const finishRound = new Queue<Prompt | null>("finishRound");
