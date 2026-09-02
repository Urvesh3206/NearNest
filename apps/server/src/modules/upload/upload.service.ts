import { generatePresignedUploadUrl } from '../../config/s3';
import { v4 as uuidv4 } from 'uuid';

export const getPresignedUrl = async (userId: string, contentType: string, folder: string = 'general') => {
  const extension = contentType.split('/')[1] || 'bin';
  const key = `${folder}/${userId}/${uuidv4()}.${extension}`;
  
  const uploadUrl = await generatePresignedUploadUrl(key, contentType);
  
  return {
    uploadUrl,
    key,
    publicUrl: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
  };
};
