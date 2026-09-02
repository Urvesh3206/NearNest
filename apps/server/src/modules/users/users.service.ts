import { prisma } from '../../config/database';
import { AppError } from '../../middleware/errorHandler';

export const getUserById = async (id: string, currentUserId?: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      profile: true,
      privacySettings: true,
    }
  });

  if (!user) throw new AppError('User not found', 404);

  // Privacy filtering
  const isSelf = currentUserId === id;
  const settings = user.privacySettings;

  if (!isSelf && settings) {
    if (settings.profileVisibility === 'PRIVATE') {
      return { id: user.id, name: user.name, avatar: user.avatar, private: true };
    }
    if (settings.hideEmail) user.email = '';
    if (settings.hidePhone) user.phone = null;
  }

  return user;
};

export const updateProfile = async (userId: string, data: any) => {
  return prisma.profile.update({
    where: { userId },
    data,
  });
};

export const updatePrivacy = async (userId: string, data: any) => {
  return prisma.privacySettings.update({
    where: { userId },
    data,
  });
};
