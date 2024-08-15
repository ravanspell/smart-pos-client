/**
 * Typography control texts
 * it allows to use several type of html tags relted to texts
 * handles the translations with selected language
 */
import { ElementType } from 'react';

type TypographyIntrinsicElement = 'div' | 'time' | 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';

type TypographyProps<T extends TypographyIntrinsicElement> = {
    /**
     * text content of the typography
     */
    text: string
    /**
     * variant of the text content
     */
    type: string,
    /**
     * HTML tag definition
     */
    tag?: T
    /**
     * decoration of the text
     */
    decoration?: 'bold' | 'italic' | 'regular'
    /**
     * id of the text element
     * for unit tests and custom styles
     */
    id: string
    /**
     * axilary classname
     */
    className?: string
} & JSX.IntrinsicElements[T];

const Typography = <T extends TypographyIntrinsicElement = 'div'>(props: TypographyProps<T>): JSX.Element => {
    const {
        text,
        id,
        tag: elementType = "div" as T,
        decoration,
        className = '',
        type,
        ...rest
    } = props;
    const Component = elementType as ElementType;
    return (
        <Component
            {...rest}
            className={`typography-${type}-${decoration} ${className}   font-semibold `}
            id={id}
        >
            {text}
        </Component>
    );
}

export default Typography;