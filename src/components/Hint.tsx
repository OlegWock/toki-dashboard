import classNames from "classnames";
import React from "react";
import './Hint.scss';

export const Hint = ({ className, forHeading = 0, ...props }: {forHeading?: number} & React.ComponentProps<"div">) => {
    return (<div className={classNames(["Hint", className], {
        [`for-heading-${forHeading}`]: forHeading !== 0,
    })} {...props} />);
}