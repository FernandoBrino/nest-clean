import { faker } from "@faker-js/faker";

import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  Question,
  QuestionProps,
} from "@/domain/forum/enterprise/entities/question";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { PrismaQuestionMapper } from "@/infra/database/prisma/mappers/prisma-question-mapper";

export function makeQuestion(
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityId
) {
  const question = Question.create(
    {
      authorId: new UniqueEntityId(),
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      slug: Slug.create("example-question"),
      ...override,
    },
    id
  );

  return question;
}

@Injectable()
export class QuestionFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestion(data: Partial<QuestionProps> = {}): Promise<Question> {
    const question = makeQuestion(data)

    await this.prisma.question.create({
      data: PrismaQuestionMapper.toPersistence(question)
    })

    return question;
  }
}

