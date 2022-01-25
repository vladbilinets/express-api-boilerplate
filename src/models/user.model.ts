import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import bcryptjs from 'bcryptjs';
import { IUser } from '../interfaces';
import { toJSON } from './plugins';

const UserSchema: Schema = new Schema(
    {
        username: {
            type: String,
            required: false,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
            validate: [
                {
                    validator: (value: string) => validator.isEmail(value),
                    message: () => 'Invalid email',
                },
                {
                    async validator(this: IUser, email: string) {
                        return !await this.model('User').findOne({ email }).exec();
                    },
                    message: () => 'The specified email address is already in use.',
                },
            ],
        },
        password: {
            type: String,
            required: true,
            select: false,
            minlength: 8,
            private: true,
        },
    },
    {
        timestamps: true,
    },
);

UserSchema.plugin(toJSON);

UserSchema.pre('save', function preSaveFunction(this: IUser, next) {
    if (this.isNew || this.isModified('password')) {
        this.password = bcryptjs.hashSync(this.password, 10);
    }
    next();
});

export default mongoose.model<IUser>('User', UserSchema);
