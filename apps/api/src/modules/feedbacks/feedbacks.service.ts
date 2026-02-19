import { db } from '../../db';
import { problemFeedbacks } from '../../db/schema/problem-feedbacks';
import { eq } from 'drizzle-orm';

export interface CreateFeedbackDto {
  problemId: string;
  userId: string;
  errorType: string;
  description: string;
}

export async function createFeedback(dto: CreateFeedbackDto) {
  const result = await db.insert(problemFeedbacks).values({
    problemId: dto.problemId,
    userId: dto.userId,
    errorType: dto.errorType,
    description: dto.description,
  }).returning();
  
  return result[0];
}
