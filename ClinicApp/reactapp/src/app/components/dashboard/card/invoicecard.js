import React from 'react';
import StatisticCard from '../../_shared/statisticcard';
import ReceiptIcon from '@material-ui/icons/Receipt';
import { InvoiceService } from '../../../services';

const Receipt = () => {
    return <ReceiptIcon />;
}

const DoctorCard = () => {
    const [invoiceStat, setInvoiceStat] = React.useState({});

    const prepareStat = () => {
        setInvoiceStat({
            title: 'ĐƠN THUỐC',
            totalCount: InvoiceService.Count(),
            details: [
                { status: 'Chưa in', count: InvoiceService.CountByStatus('Chưa in') },
                { status: 'Đã in', count: InvoiceService.CountByStatus('Đã in') },
            ]
        });
    }

    React.useEffect(() => {
        prepareStat();
    }, []);

    return (
        <StatisticCard 
            icon={Receipt}
            statistic={invoiceStat}
        />
    );
}

export default DoctorCard;