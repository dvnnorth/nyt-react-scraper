import React from 'react';

const PageTitle = props => (
  <div className="col-12 mb-4" >
    <hr />
    <h1 className="text-center">{props.pageTitle}</h1>
    <hr />
  </div>
);

export default PageTitle;