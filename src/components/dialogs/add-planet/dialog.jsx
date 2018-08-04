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
                    maxT: parseInt(values.maxT, 10) || 0,
                    minT: parseInt(values.minT, 10) || 0,
                    metalMine: parseInt(values.metalMine, 10) || 0,
                    crystalMine: parseInt(values.crystalMine, 10) || 0,
                    deutMine: parseInt(values.deutMine, 10) || 0,
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
