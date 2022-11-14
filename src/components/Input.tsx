import classNames from "classnames";
import React from "react";
import "./Input.scss";

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>((props: React.ComponentProps<"input">, ref) => {
    const {className, ...rest} = props;
    return (<input {...rest} className={classNames([className, 'Input'])} ref={ref} />); 
});