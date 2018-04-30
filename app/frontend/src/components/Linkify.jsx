// from https://github.com/tasti/react-linkify/blob/master/src/components/Linkify.jsx

import * as React from 'react';
import StandardLinkify from 'react-linkify';


export default class Linkify extends React.Component {

  constructor(props) {
    super(props);
    this.embolden = this.embolden.bind(this);
  }

  embolden(input) {
    console.log(React.version)
    console.dir(input);
    return input;
  }

  render() {
    const linkifiedText = (
      <StandardLinkify properties={this.props.properties}>
        {this.props.text}
      </StandardLinkify>)

    const linkifiedAndBolded = this.embolden(linkifiedText);
    return (
      <div>
        {linkifiedAndBolded}
      </div>
    )
  }
}

