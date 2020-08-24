import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import * as serviceWorker from './serviceWorker';
import Form from 'react-bootstrap/Form';


class Pokemon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const pokemon = this.props.pokemon;
    if (pokemon == null) {
      return null;
    }
    return (
      <div className="poke-tile">
        <p className="poke-name">{pokemon.name}</p>
        <div className="poke-picture-div">
          <img className="poke-picture" src={pokemon.sprites.front_default} alt=""></img>
        </div>
        <p className="poke-stats"> Pokemon-ID: {pokemon.id}</p>
        <p className="poke-stats"> Grunderfahrung: {pokemon.base_experience}</p>
        <p className="poke-stats"> Größe: {pokemon.height}</p>
        <p className="poke-stats"> Gewicht: {pokemon.weight}</p>
      </div>
    );
  }
}

class Test extends React.Component {

  pokemonList = [];
  
  constructor(props) {

    super(props);

    this.state = {
      isLoading: true,
      pokemons: [],
      searchString: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    fetch('https://pokeapi.co/api/v2/pokemon?limit=150')
      .then(res => res.json())
      .then(res => { 
        Promise.all(res.results.map(p => {
          return fetch(p.url)
          .then(response => response.json())
          .then(json => this.pokemonList.concat([json]))
        })).then(poke => this.setState({
          pokemons: [].concat(...poke)
        })).then(this.setState({ isLoading: false}))
      })
      .then(() => console.log(this.pokemonList));
  }

  renderPokemon(poke) {
    return <Pokemon pokemon={poke} key={poke.id}/>;
  }

  handleChange(event) {
    this.setState({searchString: event.target.value});
  }


  render() {
    const { isLoading, pokemons, searchString } = this.state
    if (isLoading) {
      return <p> is Loading...</p>
    } else {
      return (
        <div>
          <div className="head">
            <div className="center">
              <img src={require('./pokemon-logo.png')} alt="" className="img-logo"></img>
            </div>
            <div className="center">
              <Form>
              <Form.Control placeholder="Enter search string" value={this.setState.searchString} onChange={this.handleChange}/>
              </Form>
            </div>
          </div>
            <div className="content">
            {pokemons.filter(p => p.name.includes(searchString))
              .map(res => this.renderPokemon(res))}
            </div>
        </div>
      );
    }
  }
}

ReactDOM.render(
  <Test />,
  document.getElementById('root')
);

serviceWorker.unregister();
