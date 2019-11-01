let Doctors = [
    { id: 1, name: 'Bác sĩ A', status: 'Đang khám' },
    { id: 2, name: 'Bác sĩ B', status: 'Đang khám' },
    { id: 3, name: 'Bác sĩ C', status: 'Đang rảnh' },
    { id: 4, name: 'Bác sĩ D', status: 'Đang rảnh' },
];


const GetDoctor = () => {
    return Doctors;
}

const GetDoctorByStatus = (status) => {
    return Doctors.filter(d => d.status === status);
}

const Count = () => {
    return Doctors.length;
}

const CountByStatus = (status) => {
    return Doctors.filter(d => d.status === status).length;
}

const Add = (doctor) => {
    Doctors.push(doctor);
}

const Remove = (id) => {
    Doctors = Doctors.filter(d => d.id !== id);
}

const Update = (doctor) => {
    Doctors.map(d => {
        if (d.id === doctor.id) {
            d.name = doctor.name;
            d.status = doctor.status;
        }
    });
}

export default {
    GetDoctor,
    GetDoctorByStatus,
    Count,
    CountByStatus,
    Add,
    Remove,
    Update
}
