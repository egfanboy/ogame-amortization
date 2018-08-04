import React from 'react';
import { Icon, Tooltip } from 'antd';

import { TitleMain } from './queue.styled';

export default class QueueTitle extends React.Component {
    render() {
        return (
            <TitleMain>
                <Tooltip
                    title=" This is the order of the next 25 buildings you should be
                    using. You can also press the download button to download a
                    csv file containing this information"
                >
                    <Icon
                        style={{
                            fontSize: '20px',
                            color: 'blue',
                            marginRight: '10px',
                        }}
                        type="info-circle"
                    />
                </Tooltip>
                <p>Next buildings</p>
            </TitleMain>
        );
    }
}
