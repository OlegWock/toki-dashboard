import { useEffect } from "react";
import { TogglUser } from "./api";
import { useLocalStorage, useLocalStorageWithTtl } from "./hooks";
import { deserializeStats, serializeStats, TogglStats } from "./stats";
import { Theme, themes } from "./theme";

type UseAuthResult = {
    apiKey: null,
    loggedIn: false,
    setApiKey: (value: string | null) => void,
} | {
    apiKey: string,
    loggedIn: true,
    setApiKey: (value: string | null) => void,
};

export const useAuth = (): UseAuthResult => {
    const [apiKey, setApiKey] = useLocalStorage<string | null>('togglApiKey', null);

    return {
        apiKey: apiKey,
        loggedIn: !!apiKey,
        setApiKey,
    } as UseAuthResult;
};


export const useStatsFromStorage = () => {
    return useLocalStorageWithTtl<TogglStats>('togglStats', 1000 * 60 * 12, serializeStats, deserializeStats);
};

export const useDashboardTitle = () => {
    return useLocalStorage('dashboardTitle', '');
};

export const useCurrentUser = () => {
    return useLocalStorage('currentTogglUser', {} as TogglUser);
};

export const useTheme = () => {
    const [theme, setTheme] = useLocalStorage<Theme>('theme', 'green');

    useEffect(() => {
        const root = document.querySelector(':root') as HTMLElement;
        const selectedTheme = themes[theme];
        Object.entries(selectedTheme).forEach(([name, val]) => {
            root.style.setProperty(name, val);
        })
    }, [theme]);

    return [theme, setTheme] as const;
};