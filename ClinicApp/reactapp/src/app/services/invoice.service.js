let Invoices = [
    {
        id: 1,
        customer: {
            name: 'Bệnh nhân A',
            address: 'TP. HCM',
            dob: '2000',
            phone: '000024244',
            gender: 'Nam',
        },
        drugs: [
            {
                name: 'Panadol 500mg',
                quantity: '12',
                unit: 'Viên',
                usage: 'Ngày uống 3 lần, sáng 1 viên, chiều 1 viên, tối 1 viên.'
            },
        ],
        result: 'Đau họng',
        doctor: 'Bác sĩ A',
        date: '2019-11-01',
        status: 'Chưa in'
    },
    {
        id: 2,
        customer: {
            name: 'Bệnh nhân B',
            address: 'TP. HCM',
            dob: '2000',
            phone: '000024244',
            gender: 'Nam',
        },
        drugs: [
            {
                name: 'Panadol 500mg',
                quantity: '12',
                unit: 'Viên',
                usage: 'Ngày uống 3 lần, sáng 1 viên, chiều 1 viên, tối 1 viên.'
            },
        ],
        result: 'Đau họng',
        doctor: 'Bác sĩ A',
        date: '2019-11-01',
        status: 'Chưa in'
    },
    {
        id: 3,
        customer: {
            name: 'Bệnh nhân C',
            address: 'TP. HCM',
            phone: '000024244',
            dob: '2000',
            gender: 'Nam',
        },
        drugs: [
            {
                name: 'Panadol 500mg',
                quantity: '12',
                unit: 'Viên',
                usage: 'Ngày uống 3 lần, sáng 1 viên, chiều 1 viên, tối 1 viên.'
            },
        ],
        result: 'Đau họng',
        doctor: 'Bác sĩ B',
        date: '2019-11-01',
        status: 'Chưa in'
    },
    {
        id: 4,
        customer: {
            name: 'Bệnh nhân D',
            address: 'TP. HCM',
            dob: '2000',
            phone: '000024244',
            gender: 'Nam',
        },
        drugs: [
            {
                name: 'Panadol 500mg',
                quantity: '12',
                unit: 'Viên',
                usage: 'Ngày uống 3 lần, sáng 1 viên, chiều 1 viên, tối 1 viên.'
            },
        ],
        result: 'Đau họng',
        doctor: 'Bác sĩ B',
        date: '2019-11-01',
        status: 'Chưa in'
    },
    {
        id: 5,
        customer: {
            name: 'Bệnh nhân B',
            address: 'TP. HCM',
            phone: '000024244',
            dob: '2000',
            gender: 'Nam',
        },
        drugs: [
            {
                name: 'Panadol 500mg',
                quantity: '12',
                unit: 'Viên',
                usage: 'Ngày uống 3 lần, sáng 1 viên, chiều 1 viên, tối 1 viên.'
            },
        ],
        result: 'Đau họng',
        doctor: 'Bác sĩ B',
        date: '2019-11-01',
        status: 'Đã in'
    },
];


const GetInvoice = () => {
    return Invoices;
}

const GetInvoiceByStatus = (status) => {
    return Invoices.filter(i => i.status === status);
}

const GetInvoiceByDoctor = (doctor) => {
    return Invoices.filter(i => i.doctor === doctor);
}

const Count = () => {
    return Invoices.length;
}

const CountByStatus = (status) => {
    return Invoices.filter(i => i.status === status).length;
}

const Add = (invoice) => {
    Invoices.push(invoice);
}

const Remove = (id) => {
    Invoices = Invoices.filter(i => i.id !== id);
}

const Update = (invoice) => {
    Invoices.map(i => {
       if (i.id === invoice.id) {
           i.customer = invoice.customer;
           i.date = invoice.date;
           i.doctor = invoice.doctor;
           i.drugs = invoice.drugs;
           i.result = invoice.result;
           i.status = invoice.status;
       }
    });
}

export default {
    GetInvoice,
    GetInvoiceByStatus,
    GetInvoiceByDoctor,
    Count,
    CountByStatus,
    Add,
    Remove,
    Update
}
