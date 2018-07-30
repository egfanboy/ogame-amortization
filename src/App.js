import React, { Component, Fragment } from 'react';
import './App.css';
import 'antd/dist/antd.css';

import { Anchor, Button } from 'antd';
import Amortization from './pages/amortization';

const App = () => (
    <Fragment>
        <Amortization />
    </Fragment>
);

export default App;
