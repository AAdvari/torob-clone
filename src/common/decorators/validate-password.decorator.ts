import {registerDecorator, ValidationOptions, ValidationArguments} from 'class-validator';

export function IsValidPassword() {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isValidPassword',
            target: object.constructor,
            propertyName: propertyName,
            options: {message: 'password must contain uppercase, lowercase and numeric letters'},
            validator: {
                validate(value: any, args: ValidationArguments) {
                    if (!value){
                        this.options = {message:'password cant be empty'}
                        return false;
                    }
                    let upperCasePresent: boolean = false;
                    let lowerCasePresent: boolean = false;
                    let numericPresent: boolean = false;
                    for (let i = 0; i < value.length; i++) {
                        let char = value.charAt(i)
                        console.log(char)
                        if (char >= '0' && char <= '9') {
                            numericPresent = true;
                            continue;
                        }
                        if (char === char.toUpperCase())
                            upperCasePresent = true;
                        else if (char === char.toLowerCase())
                            lowerCasePresent = true;

                    }
                    return upperCasePresent && lowerCasePresent && numericPresent;
                },
            },
        });
    };
}