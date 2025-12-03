import React from 'react';
import { TextInput, TextInputProps } from 'react-native';

const FormInput: React.FC<TextInputProps> = (props) => {
    return (
        <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-4 bg-red-300 text-base"
            {...props}
        />
    );
};

export default FormInput;
