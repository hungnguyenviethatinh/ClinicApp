import React from 'react';
import StatisticCard from '../../_shared/statisticcard';
import PeopleIcon from '@material-ui/icons/People';
import { ClientService } from '../../../services';

const People = () => {
    return <PeopleIcon />;
}

const ClientCard = () => {
    const [clientStat, setClientStat] = React.useState({});

    const prepareStat = () => {
        setClientStat({
            title: 'KHÁCH HÀNG',
            totalCount: ClientService.Count(),
            details: [
                { status: 'Đang khám', count: ClientService.CountByStatus('Đang khám') },
                { status: 'Đang chờ', count: ClientService.CountByStatus('Đang chờ') },
            ]
        });
    }

    React.useEffect(() => {
        prepareStat();
    }, []);

    return (
        <StatisticCard 
            icon={People}
            statistic={clientStat}
        />
    );
}

export default ClientCard;