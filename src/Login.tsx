import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { Loader } from '@components/Loader';
import { TogglApi } from '@utils/api';
import { useAuth } from '@utils/state';
import classNames from 'classnames';
import { useRef, useState } from 'react';
import './Login.scss';

export const Login = () => {
    const tryLogin = async () => {
        if (!draftKey) return;
        setLoading(true);
        try {
            const isCorrectKey = await TogglApi.checkApiKey(draftKey);
            if (isCorrectKey) {
                console.log('Setting api key');
                setApiKey(draftKey);
            } else {
                showError('Incorrect API key');
            }
        } catch (err: any) {
            showError(err.toString());
        } finally {
            setLoading(false);
        }
    };

    const showError = (text: string) => {
        if (errorTimer.current !== null) window.clearTimeout(errorTimer.current);
        setErrorMessage(text);
        errorTimer.current = window.setTimeout(() => {
            setErrorMessage('');
        }, 5000);
    };

    const [draftKey, setDraftKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const errorTimer = useRef<number | null>(null);
    const { setApiKey, apiKey } = useAuth();

    console.log("render login", apiKey)

    return (<div className={classNames({
        "Login": true,
        "loading": loading
    })}>
        <Loader />
        <h2>Please, enter your API key</h2>
        <div className='input-wrapper'>
            <Input className='api-key-input' value={draftKey} onChange={e => setDraftKey(e.target.value)} />
            <div className='hint'>You can find your API key <a href='https://track.toggl.com/profile' target="_blank">here</a>.</div>
        </div>
        <Button type='primary' disabled={loading} onClick={tryLogin}>Log In</Button>

        {!!errorMessage && <div className='error-message'>{errorMessage}</div>}
    </div>);
};