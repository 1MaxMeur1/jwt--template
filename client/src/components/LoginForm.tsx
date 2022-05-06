import React, {useContext, useState} from 'react'
import {Context} from "../index";
import {observer} from "mobx-react-lite";

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [isVisble, setIsVisible] = useState(false)
    const {store} = useContext(Context)
    return (
        <div>
            <input onChange={e => setEmail(e.target.value)} value={email} type="text" placeholder='Enter email'/>
            <input onChange={e => setPassword(e.target.value)}
                   value={password}
                   type={isVisble ? 'text' : 'password'}
                   placeholder='Enter password'/>

            <button onClick={() => store.login(email, password)}>Login</button>
            <button onClick={() => store.registration(email, password)}>Register</button>
            <button onClick={() => setIsVisible(!isVisble)}>Visible</button>
        </div>
    )
}

export default observer(LoginForm)