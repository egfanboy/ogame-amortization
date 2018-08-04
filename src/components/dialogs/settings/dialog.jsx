import React from 'react';

import { Form, Modal } from 'antd';

import SettingsForm from './form';

class SettingsDialog extends React.Component {
    handleOk = () => {
        const { form, toggleDialog, updateSettings } = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                updateSettings({
                    rates: {
                        m: parseFloat(values.m) || 2,
                        c: parseFloat(values.c) || 1,
                        d: parseFloat(values.d) || 1,
                    },
                    geo: values.geo,
                    speed: parseInt(values.speed, 10),
                });
                form.resetFields();
                toggleDialog();
            }
        });
    };

    render() {
        const { form, rates, speed, geo } = this.props;
        return (
            <Modal
                title="Change settings"
                visible={this.props.visible}
                onOk={this.handleOk}
                onCancel={this.props.toggleDialog}
                okText="Save"
                maskClosable={false}
            >
                <SettingsForm
                    rates={rates}
                    speed={speed}
                    geo={geo}
                    form={form}
                />
            </Modal>
        );
    }
}

export default Form.create({})(SettingsDialog);
