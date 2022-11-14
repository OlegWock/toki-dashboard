import { DateTime, Duration } from "luxon";
import { TogglApi, TogglProject, TogglUser } from "./api";
import { walkObject } from "./object";

export type TogglStat = {
    project: TogglProject,
    totalInPeriod: Duration,
    totalInPreviousPeriod: Duration,
}

export type TogglStats = {
    thisWeek: TogglStat[],
    thisMonth: TogglStat[],
    thisYear: TogglStat[],
    total: TogglStat[],
};

export const getTogglStats = async (api: TogglApi, user: TogglUser): Promise<TogglStats> => {
    const getReportForDaterange = async (from: DateTime, to: DateTime) => {
        const rep = await api.getSummaryReportForWorkspace(user.defaultWorkspaceId, from, to);
        return rep.map(r => {
            return {
                project: activePublicProjects.find(p => p.id === r.projectId)!,
                totalInPeriod: r.totalInPeriod,
            }
        }).filter(s => !!s.project).sort((a, b) => b.totalInPeriod.toMillis() - a.totalInPeriod.toMillis());
    };

    const projects = await api.getProjects(user.defaultWorkspaceId);
    const activePublicProjects = projects.filter(p => p.active && !p.isPrivate);
    
    const now = DateTime.now();
    const startOfWeek = now.startOf('week');
    const startOfMonth = now.startOf('month');
    const startOfYear = now.startOf('year');

    const startOfPrevWeek = startOfWeek.minus({'weeks': 1});
    const startOfPrevMonth = startOfMonth.minus({'months': 1});
    const startOfPrevYear = startOfYear.minus({'years': 1});
    const endOfPrevWeek = startOfPrevWeek.endOf('week');
    const endOfPrevMonth = startOfPrevMonth.endOf('month');
    const endOfPrevYear = startOfPrevYear.endOf('year');

    const [
        thisWeek,
        prevWeek,

        thisMonth,
        prevMonth,

        thisYear,
        prevYear,
    ] = await Promise.all([
        getReportForDaterange(startOfWeek, now),
        getReportForDaterange(startOfPrevWeek, endOfPrevWeek),

        getReportForDaterange(startOfMonth, now),
        getReportForDaterange(startOfPrevMonth, endOfPrevMonth),

        getReportForDaterange(startOfYear, now),
        getReportForDaterange(startOfPrevYear, endOfPrevYear),
    ]);

    return {
        thisWeek: thisWeek.map(stat => {
            const matchingRecordInPrevPeriod = prevWeek.find(r => r.project.id === stat.project.id);
            return {
                ...stat,
                totalInPreviousPeriod: matchingRecordInPrevPeriod ? matchingRecordInPrevPeriod.totalInPeriod : Duration.fromObject({seconds: 0}),
            }
        }),
        thisMonth: thisMonth.map(stat => {
            const matchingRecordInPrevPeriod = prevMonth.find(r => r.project.id === stat.project.id);
            return {
                ...stat,
                totalInPreviousPeriod: matchingRecordInPrevPeriod ? matchingRecordInPrevPeriod.totalInPeriod : Duration.fromObject({seconds: 0}),
            }
        }),
        thisYear: thisYear.map(stat => {
            const matchingRecordInPrevPeriod = prevYear.find(r => r.project.id === stat.project.id);
            return {
                ...stat,
                totalInPreviousPeriod: matchingRecordInPrevPeriod ? matchingRecordInPrevPeriod.totalInPeriod : Duration.fromObject({seconds: 0}),
            }
        }),
        total: activePublicProjects.map(p => {
            return {
                project: p,
                totalInPeriod: Duration.fromObject({hours: p.actualHours}),
                totalInPreviousPeriod: Duration.fromMillis(0),
            };
        }).filter(s => s.totalInPeriod.toMillis() >= 1000 * 60).sort((a, b) => b.totalInPeriod.toMillis() - a.totalInPeriod.toMillis()),
    };
};

export const serializeStats = (stats: TogglStats): any => {
    return stats;
};

export const deserializeStats = (stats: any): TogglStats => {
    walkObject(stats, (key, val) => {
        return ['totalInPeriod', 'totalInPreviousPeriod'].includes(key) ? Duration.fromISO(val) : val;
    });
    return stats as TogglStats;
};