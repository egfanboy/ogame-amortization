import React from 'react';

import { Input } from 'antd';

export default ({ plasmaLevel, onChange, toggleEditing }) => (
    <React.Fragment>
        <Input
            style={{ width: '100px' }}
            value={plasmaLevel}
            size="small"
            addonBefore="Level"
            onChange={onChange}
            onPressEnter={toggleEditing}
        />
    </React.Fragment>
);
