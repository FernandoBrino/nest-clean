import { InMemoryAnswersRepository } from "@/repositories/in-memory-answers-repository";
import { makeAnswer } from "@/factories/make-answer";
import { InMemoryAnswerCommentsRepository } from "@/repositories/in-memory-answer-comments-repository";
import { CommentOnAnswerUseCase } from "./comment-on-answer";
import { InMemoryAnswerAttachmentsRepository } from "@/repositories/in-memory-answer-attachments-repository";
import { InMemoryStudentsRepository } from "@/repositories/in-memory-students-repository";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: CommentOnAnswerUseCase;

describe("Comment on Answer", () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(inMemoryStudentsRepository);
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository
    );
    sut = new CommentOnAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerCommentsRepository
    );
  });

  it("should be able to comment on answer", async () => {
    const answer = makeAnswer();

    await inMemoryAnswersRepository.create(answer);

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: "Comentário 1",
    });

    expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual(
      "Comentário 1"
    );
  });
});
