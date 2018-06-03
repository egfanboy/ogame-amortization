import React, { Component } from 'react';

export default class NextLevel extends Component {
    render() {
        const { next } = this.props;

        if (!next.length) return null;

        const { name, nextBuilding } =
            typeof next === 'object'
                ? next.pop()
                : { name: '-', nextBuilding: next };
        return <p>{`Planet:${name} building:${nextBuilding}.`}</p>;
    }
}
