import { IUser } from '../interfaces';
import { userRepository } from '../repositories';
import { ApiUnauthorizedError } from '../utils/errors';

const loginWithEmailAndPassword = async (
    email: IUser['email'],
    password: IUser['password'],
) => {
    const user = await userRepository.getUserByEmailAndPassword(email, password);
    if (!user) {
        throw new ApiUnauthorizedError('Incorrect email or password');
    }
    return user;
};

export default {
    loginWithEmailAndPassword,
};
