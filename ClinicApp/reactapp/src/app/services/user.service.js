import { GLOBALITEMS } from '../configs';

const GetCurrentUser = () => {
    const credential = JSON.parse(localStorage.getItem(GLOBALITEMS.CREDENTIAL));
    if (!credential) {
        return {};
    }

    return credential.User;
}

export default {
    GetCurrentUser,
}
