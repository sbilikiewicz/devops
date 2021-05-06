import React, { Component } from "react";


class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boat: {}
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ boat: nextProps.boat });  
  }
  handleChange = (e) => {
    const {name, value} = e.target;
    let boat = {...this.state.boat};
    boat[name] = value;
    this.setState({boat})
  };

  render() {
    const {mode} = this.props;
    return (
      <div>
        <form onSubmit={(e) => {this.props.handleSubmit(e, this.state.boat); this.form.reset()}} className='form-control' ref={form => this.form = form}>
            <label htmlFor="name">Name
              <input type="text" name="name" value={this.state.boat.name} onChange={(e) => this.handleChange(e)} />
            </label>
            <label htmlFor="owner">Boat Owner
              <input type="text"  name="owner" value={this.state.boat.owner} onChange={(e) => this.handleChange(e)} />
            </label>
            <label htmlFor="type">Type
              <input type="text"  name="type" value={this.state.boat.type} onChange={(e) => this.handleChange(e)} />
            </label> 
            <button type="submit" className='btn'>{mode}</button>
            <button className='btn cancel' type="button" onClick={() => {this.props.clear(); this.form.reset()}}>Cancel</button>
        </form>
      </div>
    );
  }
}

export default Form;