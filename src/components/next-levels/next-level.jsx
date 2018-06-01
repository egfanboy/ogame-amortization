import React, { Component } from 'react';

export default class NextLevel extends Component {
    static defaultProps = {};

    render() {
        const { next } = this.props;

        if (!next.length) return null;
        // console.log(next);
        const { name, nextBuilding } = next.pop();
        return <p>{`Planet:${name} building:${nextBuilding}.`}</p>;
    }
}
