const IsAuthenticated = () => {
    const Credentials = JSON.parse(localStorage.getItem('Credentials'));
    if (!Credentials) {
        return false;
    }
    
    return Credentials.IsLogined && new Date().getTime() < Credentials.ExpiredAt;
}

export default {
    IsAuthenticated
}
