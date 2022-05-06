import $api from "../http";
import {AxiosResponse} from 'axios'
import {AuthResponse} from "../models/response/AuthResponse";
import {User} from "../models/User";

export default class UserService {
    static fetchUsers():Promise<AxiosResponse<User[]>> {
        return $api.get<User[]>('/users')
    }
}