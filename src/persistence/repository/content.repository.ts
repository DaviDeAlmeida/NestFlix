import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ContentEntity } from "@src/core/entity/content.entity";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";

@Injectable()
export class ContentRepository {
    private readonly model: PrismaService['content']

    constructor(private readonly prismaService: PrismaService){
        this.model = prismaService.content;
    }

    async create(content: ContentEntity): Promise<ContentEntity> {
        try {
          const movie = content.getMedia();
          if (!movie) {
            throw new Error('Movie must be provided');
          }
          const video = movie.getVideo();
    
          await this.model.create({
            data: {
              id: content.getId(),
              title: content.getTitle(),
              description: content.getDescription(),
              type: content.getType(),
              createdAt: content.getCreatedAt(),
              updatedAt: content.getUpdatedAt(),
              Movie: {
                create: {
                  id: movie.getId(),
                  Video: {
                    create: video.serialize(),
                  },
                  Thumbnail: {
                    create: movie.getThumbnail()?.serialize(),
                  },
                },
              },
            },
          });
          return content;
        } catch (error) {
          throw new ExceptionsHandler();
        }
      }
}