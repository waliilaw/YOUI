import express from "express";
import type { Request, Response } from "express";
import { TrainModel , GenerateImage , GenerateImagesFromPrompt } from "common";
import { prismaClient } from "db";
import dotenv from "dotenv";
import { FAL_KEY } from "./.env";
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
const USER_ID = "123";

app.post("/ai/training", (async (req: Request, res: Response) => {
  const parsedBody = TrainModel.safeParse(req.body);
  if(!parsedBody.success){
    res.status(400).json({error: parsedBody.error.message});
    return;
  }

  const data = await prismaClient.model.create({
    data: {
      name: parsedBody.data.name,
      type: parsedBody.data.type,
      age: parsedBody.data.age,
      ethnicity: parsedBody.data.ethnicity,
      eyeColor: parsedBody.data.eyeColor,
      bald: parsedBody.data.bald,
      userId: USER_ID,
    }
  });
  
  res.json({modelId: data.id});
}) as express.RequestHandler);

app.post("/ai/generate", (async (req : Request, res : Response) => {
    const parsedBody = GenerateImage.safeParse(req.body);
    if(!parsedBody.success){
        res.status(400).json({error: parsedBody.error.message});
        return;
    }
const data = await prismaClient.outputImages.create({
    data: {
        imageurl: "",
        modelId: parsedBody.data.modelId,
        userId: USER_ID,
        prompt: parsedBody.data.prompt,
        status: "PENDING"
    }
})
    res.json({outputImageId: data.id});
}))

app.post("/pack/generate", (async (req : Request, res : Response) => {

    const parsedBody = GenerateImagesFromPrompt.safeParse(req.body);
    if(!parsedBody.success){
        res.status(400).json({error: parsedBody.error.message});
        return;
    }

    const prompts = await prismaClient.packPrompt.findMany({
        where: {
            packId: parsedBody.data.packId
        }
    })

    const outputImages = await prismaClient.outputImages.createManyAndReturn({
        data: prompts.map((prompt) => ({
            imageurl: "",
            modelId: parsedBody.data.modelId,
            userId: USER_ID,
            prompt: prompt.prompt,
            status: "PENDING"
        }))
    })

    res.json({outputImageIds: outputImages.map((image: { id: any; }) => image.id)});
}))

app.get("/pack/bulk", (async (req : Request, res : Response) => {

const packs = await prismaClient.pack.findMany({})

    res.json({packs: packs.map((pack: { id: any; name: any; }) => ({id: pack.id, name: pack.name}))});
}))

app.get("/image/bulk", (async (req : Request, res : Response) => {
const images = req.body.outputImageIds as string[]
const limit = req.body.limit as string ?? "10"
const offset = req.body.offset as string ?? "0"
const outputImages = await prismaClient.outputImages.findMany({
    where: {
       id : {
        in: images
       },
       userId: USER_ID
    },
    skip: parseInt(offset),
    take: parseInt(limit)
})

res.json({outputImages: outputImages.map((image: { id: any; }) => image.id)});
}))

app.listen(PORT , () => {
  console.log("Server is running on port 3000");
});
