import './HelpPopover.scss';
import { PopoverRenderProps } from './Popover';

export const HelpPopover = ({}: PopoverRenderProps<null>) => {
    return (<>
        <p>This dashboard uses Toggl API to present concise summary how many time you spent on doing something for last 
            week, month, year and in total. You can bookmark this or even make it your home page and receive small dose of 
            serotonin every time you open new tab :)</p>
        <p>We only display project which visbility is set to 'public' here. And by default it's private, so make sure to change it for project you want to display here.</p>
        <p>All data saved only in your browser, and requests go directly to Toggl API. This app requires Toggl API key, you can obtain your <a target="_blank" href="https://track.toggl.com/profile">here</a>.</p>
        <p>Source code is open, check out <a target="_blank" href='https://github.com/OlegWock/toki-dashboard'>GitHub repo</a>!</p>        
    </>);
}