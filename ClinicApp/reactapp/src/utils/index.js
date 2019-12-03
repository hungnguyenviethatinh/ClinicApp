import _ from 'lodash';

export const encodeId = (id, prefix) => {
    return `${prefix}${_.padStart(_.toString(id), 4, '0')}`;
};

export const decodeId = (id, prefix) => {
    return _.parseInt(_.trimStart(id.replace(prefix, ''), '0'), 10);
};
