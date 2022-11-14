import { Loader } from '@components/Loader';
import { StatsSection } from '@components/StatsSection';
import { TogglApi, TogglProject, TogglUser, useTogglApi } from '@utils/api';
import { useInterval, useLocalStorageWithTtl } from '@utils/hooks';
import { useCurrentUser, useDashboardTitle, useStatsFromStorage } from '@utils/state';
import { deserializeStats, getTogglStats, serializeStats, TogglStats } from '@utils/stats';
import classNames from 'classnames';
import { DateTime, Duration } from 'luxon';
import { useEffect, useState } from 'react';
import './Dashboard.scss';

interface DashboardProps {
    apiKey: string,
}

export const Dashboard = ({ apiKey }: DashboardProps) => {
    const [loading, setLoading] = useState(true);
    const [me, setMe] = useCurrentUser();
    const [title, _] = useDashboardTitle();
    const {
        value: stats,
        isPresent: statsPresent,
        setValue: setStats,
        isOutdated: isStatsOutdated
    } = useStatsFromStorage();
    const api = useTogglApi(apiKey);

    useEffect(() => {
        const main = async () => {
            const me = await api.getMe();
            setMe(me);
            const stats = await getTogglStats(api, me);
            setStats(stats);
            setLoading(false);
        };
        main();
    }, [apiKey]);

    useInterval(async () => {
        if (isStatsOutdated) {
            console.log('Updating in background');
            setLoading(true);
            const stats = await getTogglStats(api, me);
            console.log('Got stats', stats);
            setStats(stats);
            setLoading(false);
        } else {
            console.log('Tried to update stats, but they are still fresh');
        }
    }, 1000 * 60 * 1);


    return (<div className={classNames({
        'Dashboard': true,
        'loading': loading,
    })}>
        {statsPresent && <>
            {loading && <Loader size={2} />}
            <h1>{title || `${me.fullname} personal dashboard`}</h1>

            <StatsSection title='This week' stats={stats.thisWeek} />
            <StatsSection title='This month' stats={stats.thisMonth} />
            <StatsSection title='This year' roundDuration stats={stats.thisYear} />
            <StatsSection title='Total' roundDuration stats={stats.total} />
        </>}
    </div>)
};