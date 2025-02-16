import { z } from "zod";

export const TrainModel = z.object({
  name: z.string(),
  type: z.enum(["MAN", "WOMAN", "OTHER"]),
  age: z.number(),
  ethnicity: z.enum(["WHITE", "BLACK", "ASIAN_AMERICAN", "EAST_ASIAN", "SOUTH_ASIAN", "SOUTH_EAST_ASIAN", "MIDDLE_EASTERN", "PACIFIC", "HISPANIC"]),
  eyeColor: z.enum(["BROWN", "BLUE", "HAZEL", "GRAY"]),
  bald: z.boolean(),
  userId: z.string()
});

export type TrainModelType = z.infer<typeof TrainModel>;

export const GenerateImage = z.object({
  prompt: z.string(),
  modelId: z.string(),
  num: z.number(),
});

export const GenerateImagesFromPrompt = z.object({
  packId: z.string(),
  modelId: z.string(),
});
