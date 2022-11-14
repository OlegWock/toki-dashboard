import { Button } from "@components/Button";
import { Hint } from "@components/Hint";
import { Input } from "@components/Input";
import { useAuth, useCurrentUser, useDashboardTitle, useTheme } from "@utils/state";
import { Theme, themes } from "@utils/theme";
import "./Preferences.scss";

export const Preferences = ({onLogOut}: {onLogOut: () => void}) => {
    const logOut = () => {
        setApiKey('');
        setTitle('');
        onLogOut();
    };

    const { setApiKey } = useAuth();
    const [title, setTitle] = useDashboardTitle();
    const [me, setMe] = useCurrentUser();
    const [theme, setTheme] = useTheme();

    return (<div className="Preferences">
        <h1 className="without-margin">Preferences</h1>
        <Hint forHeading={1}>Saved automatically</Hint>
        <div className="main-preferences">
            <div>
                <label htmlFor="dashboardTitle">Dashboard title</label>
                <Input
                    placeholder={`${me.fullname} personal dashboard`}
                    id="dashboardTitle"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
            </div>

            <div>
                <label>Color theme</label>
                <div className="theme-buttons">
                    {(Object.keys(themes) as Theme[]).map((name) => {
                        return (<Button
                            key={name}
                            type={name === theme ? 'primary' : 'normal'}
                            onClick={() => setTheme(name)}
                        >
                            {name[0].toUpperCase() + name.slice(1)}
                        </Button>);
                    })}
                </div>
            </div>
        </div>

        <Button block onClick={logOut}>Log out</Button>
    </div>)
}