const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('../services/mail-service')
const tokenService = require('../services/token-service')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions/qpi-error')

class UserService {
    async registration(email, password) {
        const candidate = await UserModel.findOne({email})
        if (candidate) {
            throw ApiError.BadRequets('User with this email exists')
        }
        const activationLink = uuid.v4()
        const hashPassword = await bcrypt.hash(password, 3)
        const user = await UserModel.create({email, password: hashPassword, activationLink})
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`)
        const userDto = new UserDto(user) // id, email, isActivated
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            ...tokens,
            user: UserDto
        }
    }

    async activate(activationLink) {
        const user = UserModel.findOne({activationLink})
        if (!user) {
            throw ApiError.BadRequets('Something is wrong')
        }
        user.isActivated = true
        await user.save()
    }

    async login(email, password) {
        const user = await UserModel.findOne({email})
        if (!user) {
            throw ApiError.BadRequets('User was not found')
        }
        const isPassEqual = await bcrypt.compare(password, user.password)
        if (!isPassEqual) {
            throw ApiError.BadRequets('Password is incorrect')
        }
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})

        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            ...tokens,
            user: UserDto
        }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken)
        return token
    }


    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError()
        }
        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDo = await tokenService.findToken(refreshToken)
        if (!userData || tokenFromDo) {
            throw ApiError.UnauthorizedError()
        }

        const user = await UserModel.findById(userData.id)

        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})

        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            ...tokens,
            user: UserDto
        }
    }

    async getAllUsers() {
        const users = await UserModel.find()
        return users
    }
}

module.exports = new UserService()