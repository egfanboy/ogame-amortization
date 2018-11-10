import React from 'react';

import { Input, Radio, Form } from 'antd';

import { FormItem } from './form.styled';

export default class SettingsForm extends React.Component {
    render() {
        const {
            form: { getFieldDecorator },
            geo,
            rates,
            speed,
        } = this.props;

        return (
            <React.Fragment>
                <FormItem required label="Universe speed">
                    {getFieldDecorator('speed', {
                        initialValue: speed.toString(),
                        rules: [
                            {
                                pattern: new RegExp(/(^[0-9]*$)/g),
                                message: 'Must be a number!',
                            },
                            {
                                max: 2,
                                message:
                                    'I am pretty sure univserses cannot be that fast',
                            },
                        ],
                    })(<Input style={{ width: '60px' }} />)}
                </FormItem>

                <FormItem label="Geologist">
                    {getFieldDecorator('geo', {
                        initialValue: geo,
                    })(
                        <Radio.Group>
                            <Radio value={0}>None</Radio>
                            <Radio value={0.1}>10%</Radio>
                            <Radio value={0.12}>12%</Radio>
                        </Radio.Group>
                    )}
                </FormItem>
                <FormItem label="Trading rates" />
                <Form layout="inline">
                    <FormItem label="Metal">
                        {getFieldDecorator('m', {
                            initialValue: rates.m.toString(),
                            rules: [
                                {
                                    pattern: new RegExp(
                                        /^([2]\.[0-9]{1})|^([2]*$)|^([3]*$)/g
                                    ),
                                    message: 'Can be 2-3',
                                },
                            ],
                        })(<Input style={{ width: '60px' }} />)}
                    </FormItem>
                    <FormItem label="Crystal">
                        {getFieldDecorator('c', {
                            initialValue: rates.c.toString(),
                            rules: [
                                {
                                    pattern: new RegExp(
                                        /^([1]\.[0-9]{1})|^([1]*$)|^([2]*$)/g
                                    ),
                                    message: 'Can be 1-2',
                                }
                            ],
                        })(<Input style={{ width: '60px' }} />)}
                    </FormItem>
                    <FormItem label="Deut">
                        {getFieldDecorator('d', {
                            initialValue: rates.d.toString(),
                            rules: [
                                {
                                    pattern: new RegExp(/^([1])$/g),
                                    message: 'Must be 1',
                                },
                            ],
                        })(<Input style={{ width: '60px' }} />)}
                    </FormItem>
                </Form>
            </React.Fragment>
        );
    }
}
