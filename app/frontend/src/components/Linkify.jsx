// @flow

import React, { Component } from 'react';

import defaultComponentDecorator from '../decorators/defaultComponentDecorator';
import defaultHrefDecorator from '../decorators/defaultHrefDecorator';
import defaultMatchDecorator from '../decorators/defaultMatchDecorator';
import defaultTextDecorator from '../decorators/defaultTextDecorator'
import Highlighter from 'react-highlight-words'

class Linkify extends Component {

  constructor(props) {
    super(props);
    // this.defaultFindChunks = this.defaultFindChunks.bind(this);
    // this.identity = this.identity.bind(this);
  }


  parseString(string: string) {
    if (string === '') {
      return string;
    }

    const matches = defaultMatchDecorator(string);
    if (!matches) {
      // console.log('finding chunks now');
      console.log(string);
      // console.dir(defaultFindChunks);
      console.dir(this.props.key_words)
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
        elements.push(string.substring(lastIndex, match.index));
      }

      const decoratedHref = defaultHrefDecorator(match.url);
      const decoratedText = defaultTextDecorator(match.text);
      const decoratedComponent = defaultComponentDecorator(decoratedHref, decoratedText, i);
      elements.push(decoratedComponent);

      lastIndex = match.lastIndex;
    });

    // Push remaining text if there is any
    if (string.length > lastIndex) {
      elements.push(string.substring(lastIndex));
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



  render(): React.Node {
    return (
      <React.Fragment>
        {this.parse(this.props.children)}
      </React.Fragment>
    );
  }
}

export default Linkify;

export function escapeRegExpFn (str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
}


export function defaultFindChunks(
  autoEscape,
  caseSensitive,
  sanitize=identity,
  searchWords = [],
  textToHighlight
) {
  console.log(searchWords)
  console.log(textToHighlight);
  textToHighlight = sanitize(textToHighlight)

  return searchWords
    .filter(searchWord => searchWord) // Remove empty words
    .reduce((chunks, searchWord) => {
      searchWord = sanitize(searchWord)

      if (autoEscape) {
        searchWord = escapeRegExpFn(searchWord)
      }

      const regex = new RegExp(/\bsearchWord\b/, caseSensitive ? 'g' : 'gi')

      let match
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

export function identity (value) {
  return value
}