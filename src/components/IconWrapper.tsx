import React, {ReactElement} from "react";

interface IconWrapperProps {
    width?: number | string;
    height?: number | string;
    color?: string;
    children: ReactElement<React.SVGProps<SVGSVGElement>>;
    className?: string;
    style?: React.CSSProperties;
}

const IconWrapper: React.FC<IconWrapperProps> = ({
                                                     width,
                                                     height = 24,
                                                     color = 'currentColor',
                                                     children,
                                                     ...props
                                                 }) => {
    const forwarded: React.SVGProps<SVGSVGElement> = {
        ...props,
    };

    if (width !== undefined) forwarded.width = width;
    if (height !== undefined) forwarded.height = height;
    if (color !== undefined) forwarded.fill = color || undefined;

    return React.cloneElement(children, forwarded);
};

export default IconWrapper;
