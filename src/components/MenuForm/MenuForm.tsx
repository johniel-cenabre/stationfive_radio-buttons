import React, { useContext } from 'react'

import { MenuContext } from '../../context-providers/MenuContextProvider'

import RadioSelection from '../RadioSelection/RadioSelection'
import Button from '../Button/Button'

import './MenuForm.css'

interface Props {
    class: string
    instruction?: string
}

const MenuForm = (props: Props) => {

    const { menu, hasIncompleteInput } = useContext(MenuContext)
    
    return (
        <form
            className={props.class}
            action="">
            <div className="form__header">
                <p>{props.instruction}</p>
            </div>
            <div className="form__content">
                {menu.map((_: any, index: number) =>
                    <RadioSelection
                        key={`selection-${index}`}
                        groupIndex={index}
                    />
                )}
            </div>
            <div className="form__actions">
                <Button
                    class="btn"
                    text="SUBMIT"
                    isDisabled={hasIncompleteInput}
                />
            </div>
        </form>
    )
}

export default MenuForm
