import React from 'react';

import { Button, Form, Modal } from 'antd';

class AddPlanetDialog extends React.Component {
    handleOk = () => console.log('ok');

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
                form goes here
            </Modal>
        );
    }
}

export default Form.create({})(AddPlanetDialog);
