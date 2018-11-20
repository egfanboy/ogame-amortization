import React from 'react';

import { Form, Modal } from 'antd';

import RenamePreset from './form';

class RenamePresetDialog extends React.Component {
    handleOk = () => {
        const { form, renamePreset, toggleDialog } = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                renamePreset(values.name);
                form.resetFields();
                toggleDialog();
            }
        });
    };

    render() {
        return (
            <Modal
                title={`Rename ${this.props.preset.name}`}
                visible={this.props.visible}
                onOk={this.handleOk}
                onCancel={this.props.toggleDialog}
                okText="Rename"
                maskClosable={false}
            >
                <RenamePreset form={this.props.form} />
            </Modal>
        );
    }
}

export default Form.create({})(RenamePresetDialog);
