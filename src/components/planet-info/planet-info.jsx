import React, { Component } from 'react';

import ReadOnly from './read-only';
import Editable from './editable';
import { Icon as AntDIcon, Form, Modal } from 'antd';
import { PlanetName, Main, Icon } from './planet-info.styled';

import { isInt } from 'validator';

export default Form.create({})(
    class PlanetInfo extends Component {
        state = { editing: false };
        validateInput = (context, i) => {
            const { onChange } = this.props;
            if (i.length > 3) return onChange(context, this.props[context]);
            if (i === '') return onChange(context, '');
            if (!isInt(i)) return onChange(context, this.props[context]);

            return onChange(context, parseInt(i, 10));
        };

        handleFormSubmit = () => {
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    this.props.onChange('name', values.name);
                    this.props.onChange('maxT', parseInt(values.maxT, 10));
                    this.props.onChange('minT', parseInt(values.minT, 10));

                    this.props.form.resetFields();
                    this.toggleEditing();
                }
            });
        };

        toggleEditing = () => this.setState({ editing: !this.state.editing });

        render() {
            const { name, maxT, minT, removePlanet, form } = this.props;

            return (
                <Main>
                    <AntDIcon type="global" />
                    {this.state.editing ? (
                        <Editable
                            name={name}
                            maxT={maxT}
                            minT={minT}
                            onNameChange={this.handleNameChange}
                            onChange={this.validateInput}
                            form={form}
                            toggleEditing={this.toggleEditing}
                        />
                    ) : (
                        <React.Fragment>
                            <PlanetName>{name}</PlanetName>
                            <ReadOnly maxT={maxT} minT={minT} />
                        </React.Fragment>
                    )}
                    <Icon
                        type={this.state.editing ? 'close' : 'edit'}
                        onClick={
                            this.state.editing
                                ? this.handleFormSubmit
                                : this.toggleEditing
                        }
                    />
                    {!this.state.editing && (
                        <Icon
                            type="delete"
                            hovercolor="red"
                            onClick={() => {
                                Modal.confirm({
                                    title: 'Confirm deletion',
                                    okType: 'danger',
                                    okText: 'Delete',
                                    onOk: () => removePlanet(),
                                    content:
                                        'You will have to recreate this planet if deleted',
                                });
                            }}
                        />
                    )}
                </Main>
            );
        }
    }
);
