import React from 'react';

import { Input } from 'antd';

import { FormItem } from './form.styled';

export default class AddPlanetForm extends React.Component {
    render() {
        const {
            form: { getFieldDecorator },
        } = this.props;

        return (
            <React.Fragment>
                <FormItem required label="Name">
                    {getFieldDecorator('name', {
                        rules: [
                            {
                                max: '20',
                                required: true,
                                message: 'Please enter a name!',
                            },
                        ],
                    })(<Input />)}
                </FormItem>
            </React.Fragment>
        );
    }
}
