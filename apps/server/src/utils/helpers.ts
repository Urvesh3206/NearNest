export const generateSlug = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-');     // Replace multiple - with single -
};

export const paginate = (page: number, limit: number) => {
  const parsedPage = Math.max(1, page);
  const parsedLimit = Math.max(1, Math.min(limit, 100)); // Max limit 100
  const skip = (parsedPage - 1) * parsedLimit;
  return { skip, take: parsedLimit };
};
