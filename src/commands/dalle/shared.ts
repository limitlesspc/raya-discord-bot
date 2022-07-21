import prisma from '$services/prisma';

export const WAIT_MILLIS = 1000 * 60 * 60 * 24;

export async function getLastUsedAt(userId: string) {
  const user = await prisma.user.findUnique({
    select: {
      lastDalleAt: true
    },
    where: {
      id: userId
    }
  });
  return user?.lastDalleAt;
}
