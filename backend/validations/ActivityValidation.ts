import { z } from "zod";

const ActivityValidation = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
});

export default ActivityValidation;