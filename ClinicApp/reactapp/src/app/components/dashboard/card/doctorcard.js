import React from 'react';
import StatisticCard from '../../_shared/statisticcard';
import PeopleIcon from '@material-ui/icons/People';
import { DoctorServie } from '../../../services';

const People = () => {
    return <PeopleIcon />;
}

const DoctorCard = () => {
    const [doctorStat, setDoctorStat] = React.useState({});

    const prepareStat = () => {
        setDoctorStat({
            title: 'BÁC SĨ',
            totalCount: DoctorServie.Count(),
            details: [
                { status: 'Đang khám', count: DoctorServie.CountByStatus('Đang khám') },
                { status: 'Đang rảnh', count: DoctorServie.CountByStatus('Đang rảnh') },
            ]
        });
    }

    React.useEffect(() => {
        prepareStat();
    }, []);

    return (
        <StatisticCard 
            icon={People}
            statistic={doctorStat}
        />
    );
}

export default DoctorCard;