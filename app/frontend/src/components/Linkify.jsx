// framework used from react-linkify

import React, { Component } from 'react';

import defaultComponentDecorator from '../decorators/defaultComponentDecorator';
import defaultHrefDecorator from '../decorators/defaultHrefDecorator';
import defaultMatchDecorator from '../decorators/defaultMatchDecorator';
import defaultTextDecorator from '../decorators/defaultTextDecorator'
import Highlighter from 'react-highlight-words'

class Linkify extends Component {

  constructor(props) {
    super(props);
  }


  parseString(string: string) {
    if (string === '') {
      return (<Highlighter 
        searchWords={this.props.key_words}
        autoEscape={true}
        highlightTag='b'
        findChunks={this.defaultFindChunks}
        textToHighlight={string} />);
    }

    const matches = defaultMatchDecorator(string);
    if (!matches) {
      return (<Highlighter 
        searchWords={this.props.key_words}
        autoEscape={true}
        highlightTag='b'
        findChunks={this.defaultFindChunks}
        textToHighlight={string} />);
    }

    const elements = [];
    let lastIndex = 0;
    matches.forEach((match, i) => {
      // Push preceding text if there is any
      if (match.index > lastIndex) {
        const substring = string.substring(lastIndex, match.index)
        elements.push(<Highlighter 
          searchWords={this.props.key_words}
          autoEscape={true}
          highlightTag='b'
          findChunks={this.defaultFindChunks}
          textToHighlight={substring} />);
      }

      const decoratedHref = defaultHrefDecorator(match.url);
      const decoratedText = defaultTextDecorator(match.text);
      const decoratedComponent = defaultComponentDecorator(decoratedHref, decoratedText, i);
      elements.push(decoratedComponent);

      lastIndex = match.lastIndex;
    });

    // Push remaining text if there is any
    if (string.length > lastIndex) {
      const substring = string.substring(lastIndex)
      elements.push(<Highlighter 
        searchWords={this.props.key_words}
        autoEscape={true}
        highlightTag='b'
        findChunks={this.defaultFindChunks}
        textToHighlight={substring} />);
    }

    return (elements.length === 1) ? elements[0] : elements;
  }

  parse(children: any, key: number = 0) {
    if (typeof children === 'string') {
      return this.parseString(children);
    } else if (React.isValidElement(children) && (children.type !== 'a') && (children.type !== 'button')) {
      return React.cloneElement(children, {key: key}, this.parse(children.props.children));
    } else if (Array.isArray(children)) {
      return children.map((child, i) => this.parse(child, i));
    }

    return children;
  }
  defaultFindChunks({
    autoEscape,
    caseSensitive,
    sanitize,
    searchWords,
    textToHighlight
  }
  ) {
    return searchWords
      .reduce((chunks, searchWord) => {
  
        if (autoEscape) {
          searchWord = searchWord.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
        }
  
        const regex = new RegExp('\\b' + searchWord + '\\b', caseSensitive ? 'g' : 'gi');
        let match;
        while ((match = regex.exec(textToHighlight))) {
          let start = match.index
          let end = regex.lastIndex
          // We do not return zero-length matches
          if (end > start) {
            chunks.push({start, end})
          }
  
          // Prevent browsers like Firefox from getting stuck in an infinite loop
          // See http://www.regexguru.com/2008/04/watch-out-for-zero-length-matches/
          if (match.index == regex.lastIndex) {
            regex.lastIndex++
          }
        }
  
        return chunks
      }, [])
  }
  
  identity (value) {
    return value
  }

  render(): React.Node {
    return (
      <React.Fragment>
        {this.parse(this.props.children)}
      </React.Fragment>
    );
  }
}

export default Linkify;

