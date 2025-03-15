import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { QuestionFactory } from "@/factories/make-question";
import { StudentFactory } from "@/factories/make-student";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";

describe("Fetch recent questions (E2E)", () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[GET] /questions", async () => {
    const user = await studentFactory.makePrismaStudent();

    const acessToken = jwt.sign({ sub: user.id.toString() });

    await Promise.all([
      questionFactory.makePrismaQuestion({
        authorId: user.id,
        title: "Question 01",
        slug: Slug.create("question-01"),
      }),
      questionFactory.makePrismaQuestion({
        authorId: user.id,
        title: "Question 02",
        slug: Slug.create("question-02"),
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get("/questions")
      .set("Authorization", `Bearer ${acessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      questions: expect.arrayContaining([
        expect.objectContaining({ title: "Question 01" }),
        expect.objectContaining({ title: "Question 02" }),
      ]),
    });
  });
});
