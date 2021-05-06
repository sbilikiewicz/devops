import React, { Component } from "react";
import Form from "./Form";
import {TrashFill, PencilFill, Search} from 'react-bootstrap-icons';
const axios = require('axios')

class BoatsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boats: [],
      boatDetails: {},
      mode: 'Add Boat',
      handleSubmit: this.handleAdd.bind(this)
    };
    // This binding is necessary to make `this` work in the callback
  }
  // get list of all boats after component is ready 
  componentDidMount() {
    this.callAPI();
  }
  callAPI = async () => {
    await axios.get("http://localhost:8080/api/boats")
        .then(res => {
          return res.data;
        })
        .then(res => {
          console.log(res)
          this.setState({ boats: res })
        })
        .catch(error => {
          console.log(error.response)
        });
  };

  getBoatDetails = async (id) => {
    await axios.get(`http://localhost:8080/api/boats/${id}`)
    .then(res => {
      return res.data;
    })
    .then(res => {
      console.log(res)
      this.setState({ boatDetails: res })
    })
    .catch(error => {
      console.log(error.response)
    });
  }

  deleteBoat = async (id) => {
    await axios.delete(`http://localhost:8080/api/boats/${id}`)
        .then(res => {
          this.callAPI();
        })
        .catch(error => {
          console.log(error.response)
        });
  };
  handleEditBoat = async (event, boat) => {
    event.preventDefault();
    await axios.put(`http://localhost:8080/api/boats/${boat.id}`, boat)
        .then(res => {
          this.callAPI();
          this.formClear();
        })
        .catch(error => {
          console.log(error.response.data)
        });
  };
  handleAdd = async (event, boat) => {
    event.preventDefault();
    await axios.post("http://localhost:8080/api/boats", boat)
        .then( res => {
          this.callAPI();
          this.formClear();
        })
  };

  formClear = () => {
    this.setState({ boatDetails: {}, mode: 'Add Boat', handleSubmit: this.handleAdd.bind(this) })
  }

  render() {
    // ? if this.state.boats exists then map ob it
    const listOfBoats = this.state.boats?.map((boat) => {
        return (
          <tr key={boat.id}>
            <td>{boat.name}</td>
            <td>{boat.type}</td>
            <td>{boat.owner}</td>
            <td>
              <TrashFill onClick={() => this.deleteBoat(boat.id)}/>
              <PencilFill onClick={() => this.setState({ boatDetails: boat, mode: 'Edit Boat', handleSubmit: this.handleEditBoat.bind(this) })}/>
              <Search/>
            </td>
          </tr>
        )
      });

    return (
      <div>
        <Form handleSubmit={this.state.handleSubmit} mode={this.state.mode} boat={this.state.boatDetails} clear={this.formClear} />
        <table>
          <thead>
            <tr>
              <th>Boat Name</th>
              <th>Boat Type</th>
              <th>Boat Owner</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {listOfBoats}
          </tbody>
        </table>
      </div>
    );
  }
}

export default BoatsList;