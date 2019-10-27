import { Users } from '../mocks';

const Login = (user) => {
    const matchedUser = Users.find(u => (u.username === user.username && u.password === user.password));
    if (matchedUser) {
        localStorage.setItem('Credentials', JSON.stringify({
            IsLogined: true,
            User: matchedUser,
            ExpiredAt: (86400 * 1000) + new Date().getTime(),
        }));
        return { ok: true, message: 'Bạn đã đăng nhập thành công!' };
    }

    return { ok: false, message: 'Tài khoản hoặc mật khẩu không đúng!' };
}

const Logout = () => {
    localStorage.removeItem('Credentials');
    
    return { ok: true, message: 'Bạn đã đăng xuất!' };
}

export default {
    Login,
    Logout
}
