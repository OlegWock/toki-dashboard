import classNames from "classnames";
import React from "react";
import './Button.scss';

type ButtonSize = "normal" | "compact";

type ButtonType = 'normal' | 'subtle' | 'primary';

interface ButtonProps extends Omit<React.ComponentProps<"button">, "type"> {
    type?: ButtonType,
    size?: ButtonSize,
    block?: boolean,
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({type = 'normal', size = "normal", block = false,  ...props}, ref) => {
    return <button {...props} ref={ref} className={classNames('Button', {
        [`Button-${type}`]: true, 
        [`Button-size-${size}`]: true,
        [`Button-block`]: block,
    }, props.className)}/>
});

export const LinkButton = React.forwardRef<HTMLButtonElement, React.ComponentProps<"button">>((props, ref) => {
    return <button {...props} ref={ref} className={classNames('LinkButton', props.className)}/>
});