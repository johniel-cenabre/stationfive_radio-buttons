import React from 'react'

import MenuContextProvider from './context-providers/MenuContextProvider'
import MenuForm from './components/MenuForm'

import './App.css'

const App = () => {
    
    return (
        <div className="app card">
            <main className="app__content">
                <MenuContextProvider>
                    <MenuForm
                        class="form"
                        instruction="Please choose from the menu :"
                    />
                </MenuContextProvider>
            </main>
        </div>
    )
}

export default App
