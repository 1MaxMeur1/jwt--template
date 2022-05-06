import React, {useContext, useEffect, useState} from 'react';
import './App.css';
import LoginForm from './components/LoginForm'
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import {User} from "./models/User";
import UserService from "./services/UserService";

const App: React.FC = () => {
    const {store} = useContext(Context)
    const [users, setUsers] = useState<User[]>([])
    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth()
        }
    }, [])

    async function getUsers() {
        try {
            const response = await UserService.fetchUsers()
            setUsers(response.data)
        } catch (e) {
            console.log(e)
        }
    }

    if (store.isLoading) {
        return (
            <div>Loading...</div>
        )
    }

    if (!store.isAuth) {
        return (
            <LoginForm/>
        )
    }

    console.log(store)

  return (
    <div className="App">
        <h1>{store.isAuth ? `User is logged in` : 'User is not logged in'}</h1>
        <h1>{store.user ? 'User is activated': 'Activate the email'}</h1>
        <button onClick={() => store.logout()}>Log out</button>
        <div>
            <button onClick={() => getUsers()}>Get Users</button>
        </div>
        {
            users.map(user => <div key={user.email}>{user.email}</div>)
        }
    </div>
  );
}

export default observer(App);
