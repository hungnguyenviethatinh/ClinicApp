let Clients = [
    { order: 1, name: 'Bệnh nhân A', id_no: '123456789', doctor: 'Bác sĩ A', status: 'Đang khám' },
    { order: 2, name: 'Bệnh nhân B', id_no: '123456788', doctor: 'Bác sĩ B', status: 'Đang khám' },
    { order: 3, name: 'Bệnh nhân C', id_no: '123456787', doctor: 'Bác sĩ A', status: 'Đang chờ' },
    { order: 4, name: 'Bệnh nhân D', id_no: '123456786', doctor: 'Bác sĩ B', status: 'Đang chờ' },
    { order: 5, name: 'Bệnh nhân E', id_no: '123456785', doctor: 'Bác sĩ A', status: 'Đang chờ' },
    { order: 6, name: 'Bệnh nhân F', id_no: '123456784', doctor: 'Bác sĩ B', status: 'Đang chờ' },
    { order: 7, name: 'Bệnh nhân G', id_no: '123456783', doctor: 'Bác sĩ A', status: 'Đang chờ' },
    { order: 8, name: 'Bệnh nhân H', id_no: '123456782', doctor: 'Bác sĩ B', status: 'Đang chờ' },
    { order: 9, name: 'Bệnh nhân I', id_no: '123456781', doctor: 'Bác sĩ A', status: 'Đang chờ' },
    { order: 10, name: 'Bệnh nhân J', id_no: '123456780', doctor: 'Bác sĩ B', status: 'Đang chờ' },
];

const GetClient = () => {
    return Clients;
}

const GetClientByStatus = (status) => {
    return Clients.filter(c => c.status === status);
}

const Count = () => {
    return Clients.length;
}

const CountByStatus = (status) => {
    return Clients.filter(c => c.status === status).length;
}

const Add = (client) => {
    Clients.push(client);
}

const Remove = (order) => {
    Clients = Clients.filter(c => c.order !== order);
}

const Update = (client) => {
    Clients.map(c => {
        if (c.order === client.order) {
            c.name = client.name;
            c.id_no = client.id_no;
            c.doctor = client.doctor;
            c.status = client.status;
        }
    });
}

export default {
    GetClient,
    GetClientByStatus,
    Count,
    CountByStatus,
    Add,
    Remove,
    Update
}
