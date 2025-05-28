import { InMemoryQuestionsRepository } from "@/repositories/in-memory-questions-repository";
import { makeQuestion } from "@/factories/make-question";
import { InMemoryQuestionCommentsRepository } from "@/repositories/in-memory-question-comments-repository";
import { CommentOnQuestionUseCase } from "./comment-on-question";
import { InMemoryQuestionAttachmentsRepository } from "@/repositories/in-memory-question-attachments-repository";
import { InMemoryAttachmentsRepository } from "@/repositories/in-memory-attachments-repository";
import { InMemoryStudentsRepository } from "@/repositories/in-memory-students-repository";

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: CommentOnQuestionUseCase;

describe("Comment on Question", () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository(inMemoryStudentsRepository);
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository
    );
    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionCommentsRepository
    );
  });

  it("should be able to comment on question", async () => {
    const question = makeQuestion();

    await inMemoryQuestionsRepository.create(question);

    await sut.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      content: "Comentário 1",
    });

    expect(inMemoryQuestionCommentsRepository.items[0].content).toEqual(
      "Comentário 1"
    );
  });
});
