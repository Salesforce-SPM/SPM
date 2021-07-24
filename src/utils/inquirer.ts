import inquirer = require('inquirer');

import { isValidURL, isValidEmail } from './validation'
import { errorMessage } from './string'

export async function input(message: string, error: string, defaultValue: string = null) {
    let validate = (resp: string) => {
        if (!resp || resp === '') return error ? errorMessage(error) : false;
        return true;
    }

    return (await inquirer.prompt({ type: 'input', name: 'resp', default: defaultValue, message, validate: validate })).resp;
}

export async function url(message: string, error: string, defaultValue: string = null,) {
    let validate = (resp: string) => {
        if (!isValidURL(resp)) return error ? errorMessage(error) : false;

        return true;
    }

    return (await inquirer.prompt({ type: 'input', name: 'resp', default: defaultValue, message, validate: validate })).resp;
}

export async function email(message: string, error: string) {
    let validate = (resp: string) => {
        if (!isValidEmail(resp)) return error ? errorMessage(error) : false;

        return true;
    }

    return (await inquirer.prompt({ type: 'input', name: 'resp', message, validate: validate })).resp;
}

export async function confirm(message: string, defaultValue: Boolean = false) {
    let validate = (input: any, ans: any) => {
        console.log(123);


        return true;
    }

    return (await inquirer.prompt({
        type: 'confirm', name: 'resp', default: defaultValue, message
    })).resp;
}