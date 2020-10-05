import React, { useReducer, useEffect, useState, useRef } from 'react'
import { List, Map } from 'immutable'

import fetchMenu from '../api/fetch-menu'

interface ContextState {
    menu: Array<any>
    hasIncompleteInput: boolean
    updateSelectedItems: Function
    updateMenuRestrictions: Function
}

export const MenuContext = React.createContext({} as ContextState);

interface Props {
    children: JSX.Element
}

const MenuContextProvider = ({ children }: Props) => {

    const [ menu, dispatch ] = useReducer(reducer, [])
    const [ rules, setRules ] = useState({})
    const [ hasIncompleteInput, setHasIncompleteInput ] = useState(true)
    const selectedItems = useRef({})

    useEffect(() => {
        fetchMenu().then((res: any) => {
            initializeMenu(res.menus)
            setRules(res.rules)
        })
    }, [])
    
    const initializeMenu = (payload: any) => {
        dispatch({
            type: 'initializeMenu',
            payload: [ ...payload ]
        })
    }

    const updateSelectedItems = (payload: any) => {
        selectedItems.current = (payload.selectedItem) ?
            Map(selectedItems.current).set(payload.groupIndex.toString(), payload.selectedItem).toJS() :
            Map(selectedItems.current).delete(payload.groupIndex.toString()).toJS()
            console.log(payload.selectedItem, selectedItems.current)
        setHasIncompleteInput(Map(selectedItems.current).toArray().length !== menu.length)
    }

    const updateMenuRestrictions = () => {
        console.log(selectedItems)
        dispatch({
            type: 'updateMenuRestrictions',
            payload: {
                selectedItems: { ...selectedItems.current },
                rules: { ...rules }
            },
            updateSelectedItems
        })
    }

    return (
        <MenuContext.Provider value={{
            menu,
            hasIncompleteInput,
            updateSelectedItems,
            updateMenuRestrictions
        }}>
            {children}
        </MenuContext.Provider>
    )
}

interface Action {
    type: string
    payload: any
    updateSelectedItems?: Function
}

interface Item {
    id: string
    value: string
    disabled?: boolean
    checked?:boolean
}

const reducer = (state: Array<any>, { type, payload, updateSelectedItems }: Action) => {
    switch (type) {
        case 'initializeMenu':
            return updateState(payload, (item: Item, groupIndex: number) => ({
                ...item,
                disabled: (groupIndex !== 0) // first group
            }))
        case 'updateMenuRestrictions':
            return updateState(state, (item: Item, groupIndex: number) => {
                const itemIsDisabled = checkIfItemIsRestricted(payload)(item)
                const itemIsSelected = checkIfItemIsSelected(payload)(item)(groupIndex)
                if (itemIsDisabled && itemIsSelected && updateSelectedItems) {
                    updateSelectedItems({ groupIndex })
                }
                return {
                    ...item,
                    checked: (itemIsSelected && (! itemIsDisabled)),
                    disabled: itemIsDisabled
                }
            })
        default:
            return [ ...state ]
    }
}

const updateState = (data: Array<any>, callBack: Function) => {
    return List(data).map((group: any, index: number) => {
        return group.map((item: Item) => {
            return callBack(item, index)
        })
    }).toArray()
}

const checkIfItemIsRestricted = (payload: any) => {
    return (item: Item) => {
        return Map(payload.selectedItems)
            .filter((selectedItem: any) => 
                restrictItem(payload.rules)(selectedItem)(item.id))
            .toArray().length > 0
    }
}

const checkIfItemIsSelected = (payload: any) => {
    return (item: Item) => {
        return (groupIndex: number) => {
            return (`${item.id}` === payload.selectedItems[groupIndex])
        }
    }
}

const restrictItem = (rules: any) => {
    return (selectedItem: string) => {
        return (currentItem: string) => {
            return rules[+selectedItem]?.includes(+currentItem) || false
        }
    }
}

export default MenuContextProvider
