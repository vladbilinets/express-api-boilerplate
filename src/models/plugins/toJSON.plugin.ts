/* eslint-disable no-param-reassign, no-underscore-dangle */
import { Schema, Document } from 'mongoose';

const toJSON = (schema: Schema | any) => {
    let transform: Function;
    if (schema?.options.toJSON && schema.options.toJSON.transform) {
        transform = schema.options.toJSON.transform;
    }

    schema.options.toJSON = Object.assign(schema.options.toJSON || {}, {
        transform(doc: Document, ret: Document, options: object) {
            Object.keys(schema.paths).forEach((path) => {
                if (schema.paths[path].options && schema.paths[path].options.private) {
                    if (Object.prototype.hasOwnProperty.call(ret, path)) {
                        delete (ret as any)[path];
                    }
                }
            });

            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;

            if (transform) {
                transform(doc, ret, options);
            }
        },
    });
};

export default toJSON;
