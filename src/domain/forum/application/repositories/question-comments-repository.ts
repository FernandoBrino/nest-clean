import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionComment } from "../../enterprise/entities/question-comment";
import { CommentWithAuthor } from "../../enterprise/entities/value-objects/comment-with-author";

export abstract class QuestionCommentsRepository {
  abstract findById(id: string): Promise<QuestionComment | null>;
  abstract findManyByQuestionId(
    questionId: string,
    params: PaginationParams
  ): Promise<QuestionComment[]>;
  abstract findManyByQuestionIdWithAuthor(
    questionId: string,
    params: PaginationParams
  ): Promise<CommentWithAuthor[]>;
  abstract delete(question: QuestionComment): Promise<void>;
  abstract create(question: QuestionComment): Promise<void>;
}
