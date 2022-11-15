import { DateTime, Duration } from "luxon";
import { useMemo } from "react";
import { PromisePool } from "./promise-pool";

const BASE_API_URL = `https://api.track.toggl.com/api`;
const BASE_REPORTS_URL = `https://api.track.toggl.com/reports/api`;

export type TogglUser = {
    id: number,
    fullname: string,
    timezone: string,
    beginningOfWeek: number, // "beginning_of_week"
    imageUrl: string, // image_url
    defaultWorkspaceId: number, // default_workspace_id
};


export type TogglProject = {
    id: number,
    workspaceId: number, // workspace_id
    name: string,
    isPrivate: boolean, // is_private
    active: boolean,
    color: string,
    actualHours: number, // actual_hours
};

export class TogglApi {
    apiKey: string;
    pool: PromisePool;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.pool = new PromisePool(3, 1000);
    }

    async makeRequest(method: 'GET' | 'POST' | 'PUT', relativeUrl: string, type: 'api' | 'reports' = 'api', data: any = undefined) {
        return this.pool.run(() => TogglApi.makeRequest(this.apiKey, method, relativeUrl, type, data));
    }

    async getMe(): Promise<TogglUser> {
        const me = await this.makeRequest('GET', '/v9/me');
        return {
            id: me.id,
            fullname: me.fullname,
            timezone: me.timezone,
            beginningOfWeek: me.beginning_of_week,
            imageUrl: me.image_url,
            defaultWorkspaceId: me.default_workspace_id,
        };
    }

    async getProjects(workspaceId: number | string): Promise<TogglProject[]> {
        const projects = await this.makeRequest('GET', `/v9/workspaces/${workspaceId}/projects`) as any[];
        return projects.map(p => {
            return {
                id: p.id,
                workspaceId: p.workspace_id,
                name: p.name,
                isPrivate: p.is_private,
                active: p.active,
                color: p.color,
                actualHours: p.actual_hours,
            };
        });
    }

    async getSummaryReportForProject(workspaceId: number | string, projectId: number | string, fromDate: DateTime, toDate: DateTime): Promise<Duration> {
        const report = await this.makeRequest('POST', `/v3/workspace/${workspaceId}/projects/${projectId}/summary`, 'reports', {
            "end_date": toDate.toFormat('yyyy-MM-dd'),
            "start_date": fromDate.toFormat('yyyy-MM-dd')
        });
        return Duration.fromObject({seconds: report.seconds});
    }

    async getSummaryReportForWorkspace(workspaceId: number | string, fromDate: DateTime, toDate: DateTime) {
        const reports = await this.makeRequest('POST', `/v3/workspace/${workspaceId}/projects/summary`, 'reports', {
            "end_date": toDate.toFormat('yyyy-MM-dd'),
            "start_date": fromDate.toFormat('yyyy-MM-dd')
        }) as any[];
        return reports.map((r) => {
            return {
                projectId: r.project_id as number,
                totalInPeriod: Duration.fromObject({"seconds": r.tracked_seconds}),
            }
        });
    }

    static async checkApiKey(key: string): Promise<boolean> {
        try {
            const me = await TogglApi.makeRequest(key, 'GET', '/v9/me');
            return true;
        } catch (err: any) {
            return false;
        }
    }

    static async makeRequest(key: string, method: 'GET' | 'POST' | 'PUT', relativeUrl: string, type: 'api' | 'reports' = 'api', data: any = undefined) {
        const url = (type === 'api' ? BASE_API_URL : BASE_REPORTS_URL) + relativeUrl;
        const response = await fetch(url, {
            method,
            credentials: 'include',
            body: data === undefined ? undefined : JSON.stringify(data),
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(key + ":" + 'api_token')
            }),
        });

        return response.json();
    }
}

export const useTogglApi = (apiKey: string): TogglApi => {
    return useMemo(() => new TogglApi(apiKey), [apiKey]);
}