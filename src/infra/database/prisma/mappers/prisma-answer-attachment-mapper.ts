import { Prisma, Attachment as PrismaAttachment } from "@prisma/client";

import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";

export class PrismaAnswerAttachmentMapper {
  static toDomain(raw: PrismaAttachment): AnswerAttachment {
    if (!raw.answerId) {
      throw new Error("Invalid attachment type.");
    }

    return AnswerAttachment.create(
      {
        attachmentId: new UniqueEntityId(raw.id),
        answerId: new UniqueEntityId(raw.answerId),
      },
      new UniqueEntityId(raw.id)
    );
  }

  static toPersistenceUpdateMany(
    attachments: AnswerAttachment[]
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentsIds = attachments.map((attachment) => {
      return attachment.attachmentId.toString();
    });

    return {
      where: {
        id: {
          in: attachmentsIds,
        },
      },
      data: {
        answerId: attachments[0].answerId.toString(),
      },
    };
  }
}
