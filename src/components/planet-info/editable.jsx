import React from 'react';

import { Input } from 'antd';

export default ({ maxT, minT, onChange, toggleEditing }) => (
    <React.Fragment>
        <Input
            style={{ width: '100px' }}
            value={minT}
            size="small"
            addonBefore="Min T"
            onChange={e => onChange('minT', e.target.value)}
            onPressEnter={toggleEditing}
        />
        <Input
            style={{ width: '100px' }}
            value={maxT}
            size="small"
            addonBefore="Max T"
            onChange={e => onChange('maxT', e.target.value)}
            onPressEnter={toggleEditing}
        />
    </React.Fragment>
);
