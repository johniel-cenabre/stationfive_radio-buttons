import React, { useContext } from 'react'

import { MenuContext } from '../../context-providers/MenuContextProvider'

import './RadioSelection.css'

interface Props {
    groupIndex: number
}

interface Item {
    id: string
    value: string
    disabled?: boolean
    checked?:boolean
}

const RadioSelection = ({ groupIndex }: Props) => {

    const { menu, updateSelectedItems, updateMenuRestrictions } = useContext(MenuContext)

    return (
        <ul className="radio-selection">
            {menu[groupIndex].map((item: Item) =>
                <li key={`field-${groupIndex}-${item.id}`} className="selection__item radio-default">
                    <input
                        type="radio"
                        name={`group-${groupIndex}`}
                        key={`radio-${groupIndex}-${item.id}`}
                        value={item.id}
                        id={item.id}
                        disabled={item.disabled}
                        checked={item.checked || false}
                        onChange={() => {
                            updateSelectedItems({
                                groupIndex,
                                selectedItem : item.id
                            })
                            updateMenuRestrictions()
                        }}
                    />
                    <span key={`custom-radio-${groupIndex}-${item.id}`}></span>
                    <label
                        key={`label-${groupIndex}-${item.id}`}
                        htmlFor={item.id}
                    >
                        {item.value}
                    </label>
                </li>
            )}
        </ul>
    )
}

export default RadioSelection
