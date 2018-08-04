import React from 'react';

import { Input, Form } from 'antd';

export default ({ name, maxT, minT, form: { getFieldDecorator } }) => (
    <React.Fragment>
        <Form layout="inline">
            <Form.Item label="name" style={{ margin: '0 0 0 10px' }}>
                {getFieldDecorator('name', {
                    initialValue: name,
                    rules: [
                        {
                            required: true,
                            message: 'Please enter a name!',
                        },
                    ],
                })(<Input style={{ width: '100px' }} size="small" />)}
            </Form.Item>
            <Form.Item label="Min T" style={{ margin: '0 0 0 10px' }}>
                {getFieldDecorator('minT', {
                    initialValue: minT.toString(),
                    rules: [
                        {
                            pattern: new RegExp(/(^-*[0-9]*$)/g),
                            message: 'Must be a number!',
                        },
                        {
                            max: 4,
                            message: 'Temperatures cannot be that high or low ',
                        },
                    ],
                })(<Input style={{ width: '100px' }} size="small" />)}
            </Form.Item>
            <Form.Item label="Max T" style={{ margin: '0 0 0 10px' }}>
                {getFieldDecorator('maxT', {
                    initialValue: maxT.toString(),
                    rules: [
                        {
                            pattern: new RegExp(/(^-*[0-9]*$)/g),
                            message: 'Must be a number!',
                        },
                        {
                            max: 4,
                            message: 'Temperatures cannot be that high or low ',
                        },
                    ],
                })(<Input style={{ width: '100px' }} size="small" />)}
            </Form.Item>
        </Form>
    </React.Fragment>
);
