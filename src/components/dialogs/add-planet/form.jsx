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
                <FormItem label="Metal Mine">
                    {getFieldDecorator('metalMine', {
                        rules: [
                            {
                                pattern: new RegExp(/(^[0-9]*$)/g),
                                message: 'Must be a number!',
                            },
                            {
                                max: 2,
                                message:
                                    'I am pretty sure your metal mine level is not that high',
                            },
                        ],
                    })(<Input />)}
                </FormItem>
                <FormItem label="Crystal Mine">
                    {getFieldDecorator('crystalMine', {
                        rules: [
                            {
                                pattern: new RegExp(/(^[0-9]*$)/g),
                                message: 'Must be a number!',
                            },
                            {
                                max: 2,
                                message:
                                    'I am pretty sure your crystal mine level is not that high',
                            },
                        ],
                    })(<Input />)}
                </FormItem>
                <FormItem label="Deut Mine">
                    {getFieldDecorator('deutMine', {
                        rules: [
                            {
                                pattern: new RegExp(/(^[0-9]*$)/g),
                                message: 'Must be a number!',
                            },
                            {
                                max: 2,
                                message:
                                    'I am pretty sure your deut mine level is not that high',
                            },
                        ],
                    })(<Input />)}
                </FormItem>
                <FormItem label="Max Temp">
                    {getFieldDecorator('maxT', {
                        rules: [
                            {
                                pattern: new RegExp(/(^-*[0-9]*$)/g),
                                message: 'Must be a number!',
                            },
                            {
                                max: 4,
                                message:
                                    'Temperatures cannot be that high or low ',
                            },
                        ],
                    })(<Input />)}
                </FormItem>
                <FormItem label="Min Temp">
                    {getFieldDecorator('minT', {
                        rules: [
                            {
                                pattern: new RegExp(/(^-*[0-9]*$)/g),
                                message: 'Must be a number!',
                            },
                            {
                                max: 4,
                                message:
                                    'Temperatures cannot be that high or low ',
                            },
                        ],
                    })(<Input />)}
                </FormItem>
            </React.Fragment>
        );
    }
}
