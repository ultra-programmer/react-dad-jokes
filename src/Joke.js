import React, { Component } from 'react';
import '@fortawesome/fontawesome-free/css/all.css';
import './Joke.css';

export default class Joke extends Component {
  // Method to chose border color
  getColor = () => {
    if (this.props.votes >= 15) {
      return '#4CAF50';
    } else if (this.props.votes >= 12) {
      return '#8BC34A';
    } else if (this.props.votes >= 9) {
      return '#CDDC39';
    } else if (this.props.votes >= 6) {
      return '#faed00';
    } else if (this.props.votes >= 3) {
      return '#FFC107';
    } else if (this.props.votes >= 0) {
      return '#FF9800';
    } else {
      return '#f44336';
    }
  };

  // Method to choose emoji
  getEmoji = () => {
    if (this.props.votes >= 15) {
      return 'em em-rolling_on_the_floor_laughing';
    } else if (this.props.votes >= 12) {
      return 'em em-laughing';
    } else if (this.props.votes >= 9) {
      return 'em em-smiley';
    } else if (this.props.votes >= 6) {
      return 'em em-slightly_smiling_face';
    } else if (this.props.votes >= 3) {
      return 'em em-neutral_face';
    } else if (this.props.votes >= 0) {
      return 'em em-expressionless';
    } else if (this.props.votes >= -3) {
      return 'em em-face_with_rolling_eyes';
    } else if (this.props.votes >= -6) {
      return 'em em-face_with_raised_eyebrow';
    } else if (this.props.votes >= -9) {
      return 'em em-cry';
    } else if (this.props.votes >= -12) {
      return 'em em-persevere';
    } else return 'em em-confounded';
  };

  // Method to upvote
  upvote = () => {
    this.props.vote(this.props.id, 1);
  };

  // Method to downvote
  downvote = () => {
    this.props.vote(this.props.id, -1);
  };

  // Method to render individual jokes
  render() {
    return (
      <div className='Joke'>
        <div className='Joke-btns'>
          <i className='fas fa-arrow-up' onClick={this.upvote} />
          <span className='Joke-votes' style={{ borderColor: this.getColor() }}>
            {this.props.votes}
          </span>
          <i className='fas fa-arrow-down' onClick={this.downvote} />
        </div>
        <div className='Joke-text'>{this.props.joke}</div>
        <div className='Joke-emoji'>
          <i className={`em ${this.getEmoji()}`} />
        </div>
      </div>
    );
  }
}
