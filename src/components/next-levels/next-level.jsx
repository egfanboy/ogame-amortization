import React, { Component } from 'react';

export default class NextLevel extends Component {
    static defaultProps = {};

    render() {
        const { next } = this.props;

        if (!next.length) return null;
        // console.log(next);
        const { name, nextBuilding } =
            typeof next === 'array'
                ? next.pop()
                : { name: '-', nextBuilding: next };
        return <p>{`Planet:${name} building:${nextBuilding}.`}</p>;
    }
}
