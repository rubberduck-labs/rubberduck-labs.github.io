import React, {ReactElement} from "react";

interface IconWrapperProps {
    width?: number | string;
    height?: number | string;
    color?: string;
    children: ReactElement<React.SVGProps<SVGSVGElement>>; // Correct type for SVG props
    className?: string;
    style?: React.CSSProperties;
}

const IconWrapper: React.FC<IconWrapperProps> = ({
                                                     width = 32,
                                                     height = 32,
                                                     color = "currentColor",
                                                     children,
                                                     ...props
                                                 }) => {

    return React.cloneElement(children, {
        width,
        height,
        fill: color,
        ...props,
    });
};

export default IconWrapper;
