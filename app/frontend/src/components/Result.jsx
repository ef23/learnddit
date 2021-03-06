import React, { Component } from 'react';
import Truncate from 'react-truncate';

import { nsfwWords } from '../constants/constants.js'

import Linkify from './Linkify.jsx'


class Result extends Component {

  constructor(props){
    super(props);
    this.state = {
      expanded: false,
      showBreakdown: false,
      showExplicit: false
    }
    this.showScore = this.showScore.bind(this);
    this.roundNearest = this.roundNearest.bind(this);
    this.checkExplicit = this.checkExplicit.bind(this);
    this.explicit = this.checkExplicit(this.props.comment[0].body)
  }

  onClick(e) {
    e.preventDefault();
    this.setState({ showExplicit: true })
  }

  roundNearest(val) {
    let absVal = Math.abs(val);
    return Math.round(100*absVal)/100;
  }

  showScore() {
    let breakdown = this.props.comment[1];
    let showBreakdown = this.state.showBreakdown;
    this.setState({ showBreakdown: !showBreakdown })
  }

  checkExplicit(comment) {
    for (var i = 0; i < nsfwWords.length; i++) {
      let regex = new RegExp("(\\b" + nsfwWords[i] + "\\b)");
      let matches = comment.match(regex);
      if (regex.test(comment)) {
        return true;
      }
    }
    return false;
  }


  render() {
    let breakdownLabel = ["Cos-sim score:", " x # of noun terms:", " x # of query terms", ' x √(comment score):']
    let colors = ["blue", "purple", "green", "red"]

  	let comment = this.props.comment[0];
    let breakdown = this.props.comment[1];
    let irScore = this.roundNearest(breakdown[breakdown.length -1]);
    let visibilityState = this.state.showBreakdown ? "visible" : "hidden";


    let display = this.explicit && !this.state.showExplicit ?
      (<div className='explicit' onClick={this.onClick.bind(this)}>
        <p><strong>Warning:</strong> this content may be NSFW. Click to reveal.</p>
      </div>) : 
      (!this.state.expanded && comment.summary.length > 5 ?
        (<div className="comment-body">
          <Linkify properties={{target: '_blank', style: {fontWeight: 'bold'}}} key_words={this.props.key_words}>
            {comment.summary}
          </ Linkify>
            <button onClick={() => this.setState({expanded: true})}>read more</button>
         </div>) :
        (<div className="comment-body">
          <Linkify properties={{target: '_blank', style: {fontWeight: 'bold'}}} key_words={this.props.key_words}>
            {comment.body}
          </ Linkify>
          {comment.summary.length > 5 ? <button onClick={() => this.setState({expanded: false})}>read less</button> : null}
        </div>)
      )

    return (
    	<div className="comment" style={{backgroundColor: this.props.style}}>
    		<div className="comment-header">
    			<span className="author"><a href={"http://reddit.com/u/" + comment.author} target="_blank">{comment.author}</a></span>
    			<span className="score" onMouseEnter={this.showScore} onMouseLeave={this.showScore}>&nbsp; {comment.score} points &nbsp; IR score: {irScore}</span>
          <span className="score" style={{visibility: visibilityState}}>
            &nbsp;|{breakdownLabel.map((label, i) => <span key={i}>{label}<span style={{color: colors[i]}}> {this.roundNearest(breakdown[i])}</span></span>)}
          </span>
    		</div>
        { display }
	    	<a className="permalink" href={comment.permalink} target="_blank">permalink</a>
        <a className="permalink" href={comment.link_id} target="_blank">&nbsp; thread</a>
    	</div>);
  }
}

export default Result;
