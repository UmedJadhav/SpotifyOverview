  import React from 'react';

const Scroll_to_Top = ({ children, location }) => {
  React.useEffect(() => window.scrollTo(0, 0), [location.pathname]);
  return children;
};

export default Scroll_to_Top;