import { humanDuration, shortDuration } from '@utils/duration';
import { TogglStat } from '@utils/stats';
import classNames from 'classnames';
import { Duration } from 'luxon';
import './StatBlock.scss';

interface StatBlockProps {
    stat: TogglStat,
    roundDuration: boolean,
}


export const StatBlock = ({ stat, roundDuration }: StatBlockProps) => {
    const inPrevPeriod = stat.totalInPreviousPeriod.toMillis();
    const comparedToPrevPeriod = stat.totalInPeriod.toMillis() - inPrevPeriod;
    const shouldDisplayBadge = comparedToPrevPeriod > 1000 * 3 && inPrevPeriod > 1000 * 3;
    return (<div className={classNames({
        'StatBlock': true,
        'with-badge': shouldDisplayBadge,
    })}>

        <div className="project-title">{stat.project.name}</div>
        <div className="project-duration">
            {humanDuration(stat.totalInPeriod, roundDuration)}
            {shouldDisplayBadge && <div className='badge'>+{shortDuration(Duration.fromMillis(comparedToPrevPeriod))}</div>}
        </div>
    </div>)
}