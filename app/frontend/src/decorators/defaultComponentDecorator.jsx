// @flow

import * as React from 'react';

export default (decoratedHref: string, decoratedText, key: number): React.Node => {
  return (
    <a href={decoratedHref} target="_blank" key={key}>
      {decoratedText}
    </a>
  );
};
