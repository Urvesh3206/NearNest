import { prisma } from '../../config/database';
import { AppError } from '../../middleware/errorHandler';

export const createPost = async (userId: string, data: any) => {
  return prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
    include: {
      author: {
        select: { id: true, name: true, avatar: true },
      },
    },
  });
};

export const getPosts = async (filters: any, cursor?: string, limit: number = 10) => {
  const posts = await prisma.post.findMany({
    where: filters,
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { id: true, name: true, avatar: true } },
      _count: { select: { comments: true, likes: true } },
    },
  });

  let nextCursor: typeof cursor | undefined = undefined;
  if (posts.length > limit) {
    const nextItem = posts.pop();
    nextCursor = nextItem?.id;
  }

  return { posts, nextCursor };
};

export const getPostById = async (id: string) => {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, avatar: true } },
      comments: {
        where: { parentId: null },
        include: {
          author: { select: { id: true, name: true, avatar: true } },
          replies: true,
        },
        orderBy: { createdAt: 'desc' },
      },
      _count: { select: { likes: true, bookmarks: true } },
    },
  });

  if (!post) throw new AppError('Post not found', 404);
  return post;
};

export const updatePost = async (id: string, userId: string, data: any) => {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post || post.authorId !== userId) {
    throw new AppError('Not authorized or post not found', 403);
  }

  return prisma.post.update({
    where: { id },
    data,
  });
};

export const deletePost = async (id: string, userId: string) => {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post || post.authorId !== userId) {
    throw new AppError('Not authorized or post not found', 403);
  }

  await prisma.post.delete({ where: { id } });
};
