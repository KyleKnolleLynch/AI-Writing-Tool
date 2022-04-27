import { prisma } from "~/db.server";
import type { User } from "@prisma/client";

export function addCompletion({
  userId,
  aiCompletion,
  prompt,
  tokens,
}: {
  userId: User["id"];
  aiCompletion: string;
  prompt: string;
  tokens: Number;
}) {
  return prisma.completion.create({
    data: {
      prompt,
      answer: aiCompletion,
      tokens: Number(tokens),
      user: {
        connect: { id: userId },
      },
    },
  });
}
