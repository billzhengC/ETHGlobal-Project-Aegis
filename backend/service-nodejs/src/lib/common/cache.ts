import prisma from "./prisma";

export const getCache = async (cacheKey: string): Promise<string> => {
  const row = await prisma.t_go_caches.findUnique({
    select: { cache_value: true },
    where: { cache_key: cacheKey },
  });
  if (row) {
    return row.cache_value;
  }
  return "";
};

export const setCache = async (
  cacheKey: string,
  cacheValue: string
): Promise<void> => {
  await prisma.t_go_caches.upsert({
    where: { cache_key: cacheKey },
    create: { cache_key: cacheKey, cache_value: cacheValue },
    update: { cache_value: cacheValue },
  });
  return;
};
