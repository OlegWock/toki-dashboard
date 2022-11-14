import { Button, LinkButton } from '@components/Button';
import { HelpPopover } from '@components/HelpPopover';
import { Popover } from '@components/Popover';
import { useAuth, useTheme } from '@utils/state';
import { useState } from 'react';
import './App.scss';
import { Dashboard } from './Dashboard';
import { Login } from './Login';
import { Preferences } from './Preferences';


type Screen = 'main' | 'preferences';

const App = () => {
    const { loggedIn, apiKey } = useAuth();
    const [screen, setScreen] = useState<Screen>('main');
    useTheme();

    return (<>
        <div className="menu">
            {loggedIn && <>
                {screen === 'main' && <Button size='compact' type='subtle' onClick={() => setScreen('preferences')}>Preferences</Button>}
                {screen === 'preferences' && <Button size='compact' type='subtle' onClick={() => setScreen('main')}>Back to dashboard</Button>}
            </>}
            <Popover
                trigger='click'
                additionalData={null}
                component={HelpPopover}
                placement='bottom-end'
                className='HelpPopover'
            >
                <Button size="compact" type="subtle">Help</Button>
            </Popover>
        </div>
        <div className="App">
            {!loggedIn && <Login />}
            {loggedIn && <>
                {screen === 'main' && <Dashboard apiKey={apiKey} />}
                {screen === 'preferences' && <Preferences onLogOut={() => setScreen('main')} />}
            </>}
        </div>
    </>);
}

export default App;
