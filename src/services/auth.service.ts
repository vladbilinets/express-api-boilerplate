import { IUser } from '../interfaces';
import { userRepository } from '../repositories';
import { ApiUnauthorizedError } from '../utils/errors';

const loginWithEmailAndPassword = async (email: IUser['email'], password: IUser['password'],): Promise<IUser> => {
    const user = await userRepository.getUserByEmailAndPassword(email, password);
    if (!user) {
        throw new ApiUnauthorizedError('Incorrect email or password');
    }
    return user;
};

const registerUser = async (email: IUser['email'], password: IUser['password']): Promise<IUser> => (
    userRepository.createUser(email, password)
);

export default {
    loginWithEmailAndPassword,
    registerUser,
};
