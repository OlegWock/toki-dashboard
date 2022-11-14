import classNames from 'classnames';
import React from 'react';
import './Loader.scss';

export const Loader = ({className, size = 7, ...props}: {size?: number} & React.ComponentProps<"span">) => {
    return (<span className={classNames(["Loader", className], {
        [`Loader-size-${size}`]: true,
    })} {...props}></span>);
};