import { InMemoryQuestionsRepository } from "@/repositories/in-memory-questions-repository";
import { CreateQuestionUseCase } from "./create-question";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryQuestionAttachmentsRepository } from "@/repositories/in-memory-question-attachments-repository";
import { InMemoryAttachmentsRepository } from "@/repositories/in-memory-attachments-repository";
import { InMemoryStudentsRepository } from "@/repositories/in-memory-students-repository";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: CreateQuestionUseCase;

describe("Create Question", () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository
    );
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository);
  });

  it("should be able to create a question", async () => {
    const result = await sut.execute({
      authorId: "1",
      title: "Nova pergunta",
      content: "Conteúdo da perguntar",
      attachmentsIds: ["1", "2"],
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryQuestionsRepository.items[0]).toEqual(
      result.value?.question
    );
    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems
    ).toHaveLength(2);
    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId("1") }),
      expect.objectContaining({ attachmentId: new UniqueEntityId("2") }),
    ]);
  });

  it("should persist attachments when creating a new question", async () => {
    const result = await sut.execute({
      authorId: "1",
      title: "Nova pergunta",
      content: "Conteúdo da perguntar",
      attachmentsIds: ["1", "2"],
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(2);
    expect(inMemoryQuestionAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityId("1"),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityId("2"),
        }),
      ])
    );
  });
});
