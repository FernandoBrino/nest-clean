import { FakeHasher } from "@/cryptography/fake-hasher";
import { InMemoryStudentsRepository } from "@/repositories/in-memory-students-repository";
import { RegisterStudentUseCase } from "./register-student";
import { FakeEncrypter } from "@/cryptography/fake-encrypter";
import { AuthenticateStudentUseCase } from "./authenticate-student";
import { makeStudent } from "@/factories/make-student";

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateStudentUseCase;

describe("Authenticate Student", () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();

    sut = new AuthenticateStudentUseCase(
      inMemoryStudentsRepository,
      fakeHasher,
      fakeEncrypter
    );
  });

  it("should be able to authenticate a student", async () => {
    const student = makeStudent({
      email: "johndoe@example.com",
      password: await fakeHasher.hash("123456"),
    });

    inMemoryStudentsRepository.create(student);

    const result = await sut.execute({
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      access_token: expect.any(String),
    });
  });
});
