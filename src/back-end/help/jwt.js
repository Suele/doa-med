import jsonwebtoken from 'jsonwebtoken';
import path from 'path';
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const generationToken = async (userId) => {
  try {
    const token = await jsonwebtoken.sign(
      { id: userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );
    return token;
  } catch (error) {
    return { message: 'Token não foi gerado.' };
  }
};

const checkTokenIsValid = async (token) => {
  try {
    await jsonwebtoken.verify(token, process.env.JWT_SECRET);
    return { messageSuccess: 'Token Válido.' };
  } catch (messageError) {
    return { messageError: 'Token inválido.' };
  }
};

export default { generationToken, checkTokenIsValid };
