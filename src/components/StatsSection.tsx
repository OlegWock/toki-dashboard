import { TogglStat } from '@utils/stats';
import { StatBlock } from './StatBlock';
import './StatsSection.scss';

interface StatsSectionProps {
    title: string,
    stats: TogglStat[],
    roundDuration?: boolean,
}

export const StatsSection = ({ title, stats, roundDuration = false }: StatsSectionProps) => {
    return (<div className="StatsSection">
        <h3>{title}</h3>
        <div className="stat-block">
            {stats.map(s => <StatBlock roundDuration={roundDuration} stat={s} key={s.project.id.toString()} />)}
        </div>
    </div>)
}