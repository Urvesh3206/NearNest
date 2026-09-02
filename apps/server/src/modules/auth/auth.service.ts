import { prisma } from '../../config/database';
import { firebaseAdmin } from '../../config/firebase';
import { AppError } from '../../middleware/errorHandler';
import { UserRole } from '@neighbourhub/shared';

export const registerUser = async (data: any) => {
  // Create user in Firebase first
  const firebaseUser = await firebaseAdmin.auth().createUser({
    email: data.email,
    password: data.password,
    displayName: data.name,
  });

  try {
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          firebaseUid: firebaseUser.uid,
          email: data.email,
          name: data.name,
          phone: data.phone,
          role: data.role || UserRole.RESIDENT,
        },
      });

      await tx.profile.create({
        data: { userId: newUser.id },
      });

      await tx.privacySettings.create({
        data: { userId: newUser.id },
      });

      return newUser;
    });

    return user;
  } catch (error) {
    // Rollback Firebase user if DB fails
    await firebaseAdmin.auth().deleteUser(firebaseUser.uid);
    throw new AppError('Error creating user in database', 500);
  }
};

export const loginUser = async (firebaseUid: string, ipAddress?: string, userAgent?: string) => {
  const user = await prisma.user.findUnique({ where: { firebaseUid } });
  if (!user) throw new AppError('User not found', 404);

  // In a full implementation, we'd generate JWTs and Session here
  return user;
};

export const logoutSession = async (sessionId: string) => {
  await prisma.session.update({
    where: { id: sessionId },
    data: { isActive: false },
  });
};
