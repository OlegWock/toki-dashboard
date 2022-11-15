import { humanDuration, shortDuration } from '@utils/duration';
import { TogglStat } from '@utils/stats';
import classNames from 'classnames';
import { Duration } from 'luxon';
import './StatBlock.scss';
import { Tooltip } from './Tooltip';

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
            {shouldDisplayBadge && <Tooltip label='Compared to previous period'>
                <div className='badge'>+{shortDuration(Duration.fromMillis(comparedToPrevPeriod))}</div>
            </Tooltip>}
        </div>
    </div>)
};

export const StatBlockEmpty = () => {
    return (<div className={classNames({
        'StatBlock': true,
        'empty': true
    })}>
        <div className="project-title">Nothing here :(</div>
        <div className="project-duration">
            Maybe you forgot to make project public?<br />
            Or simply didn't track anything?
        </div>
    </div>)
};