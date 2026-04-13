import { uploadImage } from "@/controllers/media.controller.js";
import {
  UploadImageRes,
  UploadImageResType,
} from "@/schemaValidations/media.schema.js";
import fastifyMultipart from "@fastify/multipart";
import { FastifyInstance } from "fastify";

export default async function mediaRoutes(fastify: FastifyInstance) {
  fastify.register(fastifyMultipart);
  fastify.post<{ Reply: UploadImageResType }>(
    "/upload",
    {
      schema: {
        response: {
          200: UploadImageRes,
        },
      },
    },
    async (request, reply) => {
      const data = await request.file({
        limits: {
          fileSize: 1024 * 1024 * 10, // 10MB,
          fields: 1,
          files: 1,
        },
      });
      if (!data) {
        throw new Error("Không tìm thấy file");
      }
      const url = await uploadImage(data);
      return reply.send({ message: "Upload ảnh thành công", data: url });
    },
  );
}
