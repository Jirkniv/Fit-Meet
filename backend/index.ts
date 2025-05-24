import express from "express";
import cors from "cors";
import authRouter from "./routes/AuthRoutes";
import userRouter from "./routes/UserRoutes";
import activityRouter from "./routes/ActivityRoutes";
import { createBucket } from "./services/s3Service";
import swagger from "swagger-ui-express";
import {swaggerDocs} from "./swagger/indexSwagger"
import { seedAchievements, seedActivityTypes, seedDefaultAvatar } from "./seeds/seeds";


const server = express();
const port = 7777;



server.use(cors());
server.use(express.json());
createBucket();

server.use("/docs", swagger.serve, swagger.setup(swaggerDocs));

authRouter(server);
userRouter(server);
activityRouter(server); 

(async () => {
  await seedActivityTypes();
  await seedAchievements();
  await seedDefaultAvatar();
})();

server.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});
