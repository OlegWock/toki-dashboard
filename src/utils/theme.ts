import {darken} from 'polished';

const generateThemeForHue = (hueDark: number, hueMid: number, hueLight: number) => {
    return {
        '--dark-primary': `hsl(${hueDark}, 100%, 14%)`,
        '--dark-primary-muted': `hsla(${hueDark}, 100%, 14%, 0.4)`,
        '--mid-primary': `hsl(${hueMid}, 24%, 49%)`,
        '--mid-primary-muted': `hsla(${hueMid}, 24%, 49%, 0.4)`,
        '--light-primary': `hsl(${hueLight}, 69%, 91%)`,
        '--light-primary-darker': `hsl(${hueLight}, 69%, 81%)`,
    };
};

const generateTheme = (dark: string, mid: string, light: string) => {
    return {
        '--dark-primary': `hsl(${dark})`,
        '--dark-primary-muted': `hsla(${dark}, 0.4)`,
        '--mid-primary': `hsl(${mid})`,
        '--mid-primary-muted': `hsla(${mid}, 0.4)`,
        '--light-primary': `hsl(${light})`,
        '--light-primary-darker': darken(0.1, `hsl(${light})`),
    };
};

export const themes = {
    'green': generateTheme(
        '177, 100%, 14%',
        '113, 24%, 49%',
        '95, 69%, 91%'
    ),

    'violet': generateTheme(
        '270, 100%, 14%',
        '250, 24%, 49%',
        '220, 69%, 91%'
    ),

    'emerald': generateTheme(
        '180, 100%, 14%',
        '160, 24%, 49%',
        '130, 69%, 91%'
    ),

    'blue': generateTheme(
        '216, 85%, 30%',
        '202, 100%, 55%',
        '209, 100%, 95%'
    ),

    'orange': generateTheme(
        '41, 72%, 41%',
        '30, 79%, 42%',
        '60, 69%, 91%'
    ),
    'red': generateTheme(
        '0, 79%, 22%',
        '0, 46%, 51%',
        '0, 100%, 96%'
    ),
} as const;

export type Theme = keyof typeof themes;