import React, { Fragment } from 'react';
import spinner from './spinner.gif';

const Spinner = () => (
  <Fragment>
    <img 
    src={spinner} 
    style={{ width: '200px', height: '200px', display: 'block', margin: 'auto' }}
    alt="Loading ..." />
  </Fragment>
);

export default Spinner;