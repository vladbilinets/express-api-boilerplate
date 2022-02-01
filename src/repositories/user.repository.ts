import bcryptjs from 'bcryptjs';
import { User } from '../models';
import { IUser } from '../interfaces';

const getUserByEmail = async (email: IUser['email']) => User.findOne({ email }).exec();

const getUserByEmailAndPassword = async (
    email: IUser['email'],
    password: IUser['password'],
) => {
    const user = await User.findOne({ email }).select('+password').exec();
    if (!user || !(await bcryptjs.compare(password, user.password))) {
        return null;
    }
    return user;
};

export default {
    getUserByEmail,
    getUserByEmailAndPassword,
};
