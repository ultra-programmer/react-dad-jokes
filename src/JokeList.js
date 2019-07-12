import React, { Component } from 'react';
import axios from 'axios';
import Joke from './Joke';
import uuid from 'uuid/v4';
import './JokeList.css';

export default class JokeList extends Component {
  // Default props
  static defaultProps = {
    numJokes: 10
  };

  // Constructor
  constructor(props) {
    super(props);
    // Initialize state
    this.state = {
      jokes: JSON.parse(window.localStorage.getItem('jokes') || '[]'),
      loadingJokes: !JSON.parse(window.localStorage.getItem('jokes'))
    };
    // Create a set of all current jokes
    this.usedJokes = new Set(this.state.jokes.map(joke => joke.joke));
  }

  // Method called when the component has been constructed and rendered
  componentDidMount() {
    if (!this.state.jokes.length) this.getJokes();
    // Sort jokes by votes
    this.setState(curState => ({
      jokes: curState.jokes.sort((a, b) => b.votes - a.votes)
    }));
  }

  // Method to fetch jokes
  getJokes = async () => {
    try {
      // Load jokes
      let jokes = [];
      while (jokes.length < this.props.numJokes) {
        // Get joke data from API
        let res = await axios.get('https://icanhazdadjoke.com/', {
          headers: { Accept: 'application/json' }
        });
        // Check if the joke has already been used
        if (!this.usedJokes.has(res.data.joke)) {
          // Add fetched joke to the array
          jokes.push({ joke: res.data.joke, votes: 0, id: uuid() });
          // Add fetched joke to the usedJokes set
          this.usedJokes.add(res.data.joke);
        }
      }
      // Add jokes to state
      this.setState(
        curState => ({
          jokes: [
            ...curState.jokes,
            ...jokes
          ].sort((a, b) => b.votes - a.votes),
          loadingJokes: false
        }),
        // Save votes to local storage
        () => window.localStorage.setItem('jokes', JSON.stringify(this.state.jokes))
      );
    } catch (err) {
      alert(`No jokes could be loaded. The API responded with the error: ${err}`);
      this.setState({ loadingJokes: false });
    }
  };

  // Method to handle voting
  handleVote = (id, delta) => {
    // Set the state with the new number of votes
    this.setState(
      curState => ({
        jokes: curState.jokes.map(joke => (joke.id === id ? { ...joke, votes: joke.votes + delta } : joke))
      }),
      // Save votes to local storage
      () => window.localStorage.setItem('jokes', JSON.stringify(this.state.jokes))
    );
  };

  // Method to clear window.localStorage of jokes
  handleClear = () => {
    // Clear local storage
    window.localStorage.clear();
    // Refresh application
    window.location.reload();
  };

  // New jokes button click method
  handleClick = () => {
    // Set loading jokes to true and get jokes after the state is set
    this.setState({ loadingJokes: true }, this.getJokes);
  };

  // Render the list of jokes
  render() {
    // Return loader if the jokes are currently being fetched
    if (this.state.loadingJokes) {
      return (
        <div className='JokeList-spinner'>
          <i className='far fa-8x fa-laugh fa-spin' />
          <h1 className='JokeList-title'>Loading Jokes...</h1>
        </div>
      );
    }

    return (
      <div className='JokeList'>
        <div className='JokeList-sidebar'>
          <h1 className='JokeList-title'>
            <span>Dad</span> Jokes
          </h1>
          <img
            src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg'
            alt='A laughing emojicon'
          />
          <button className='JokeList-btn get' onClick={this.handleClick}>
            New Jokes
          </button>
          <button className='JokeList-btn clear' onClick={this.handleClear}>
            Clear Jokes
          </button>
        </div>

        <div className='JokeList-jokes'>
          {this.state.jokes.map(joke => (
            <Joke votes={joke.votes} joke={joke.joke} key={joke.id} id={joke.id} vote={this.handleVote} />
          ))}
        </div>
      </div>
    );
  }
}
