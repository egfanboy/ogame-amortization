import React from 'react';

import { Form, Modal } from 'antd';

import AddPlanetForm from './form';

class AddPlanetDialog extends React.Component {
    handleOk = () => {
        const { form, addPlanet, toggleDialog } = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                addPlanet({
                    name: values.name,
                    maxT: parseInt(values.maxT) || 0,
                    minT: parseInt(values.minT) || 0,
                    metalMine: parseInt(values.metalMine) || 0,
                    crystalMine: parseInt(values.crystalMine) || 0,
                    deutMine: parseInt(values.deutMine) || 0,
                });
                form.resetFields();
                toggleDialog();
            }
        });
    };

    render() {
        return (
            <Modal
                title="Add new planet"
                visible={this.props.visible}
                onOk={this.handleOk}
                onCancel={this.props.toggleDialog}
                okText="Add"
                maskClosable={false}
            >
                <AddPlanetForm form={this.props.form} />
            </Modal>
        );
    }
}

export default Form.create({})(AddPlanetDialog);
