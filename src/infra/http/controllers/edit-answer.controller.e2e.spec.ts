import { AnswerFactory } from "@/factories/make-answer";
import { QuestionFactory } from "@/factories/make-question";
import { StudentFactory } from "@/factories/make-student";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";

describe("Answer answer (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let answerFactory: AnswerFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    answerFactory = moduleRef.get(AnswerFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[PUT] /answers/:id", async () => {
    const user = await studentFactory.makePrismaStudent();

    const acessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const answer = await answerFactory.makePrismaAnswer({
        questionId: question.id,
        authorId: user.id
    })

    const answerId = answer.id.toString()

    const response = await request(app.getHttpServer())
      .put(`/answers/${answerId}`)
      .set("Authorization", `Bearer ${acessToken}`)
      .send({
        content: "New answer content",
      });

    expect(response.statusCode).toBe(204);

    const answerOnDatabase = await prisma.answer.findFirst({
      where: {
        content: "New answer content",
      },
    });

    expect(answerOnDatabase).toBeTruthy();
  });
});
