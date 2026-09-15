export function isNew(publishedAt: string | null): boolean {
  if (!publishedAt) {
    return false;
  }

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  return new Date(publishedAt) > sevenDaysAgo;
}