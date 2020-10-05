import React from 'react'

interface Props {
    class: string
    text: string
    isDisabled?: boolean
}

const Button = (props: Props) => {
    
    return (
        <button
            className={props.class}
            disabled={props.isDisabled}
        >
            {props.text}
        </button>
    )
}

export default Button
