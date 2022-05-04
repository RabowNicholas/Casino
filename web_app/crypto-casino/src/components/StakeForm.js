import React, { Component } from 'react'
import './App.css'

class StakeForm extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }
  render() {
    return (
      <form>
        <label class="input-form">
          <label>WETH</label>
          <input type="number" placeholder="0" required/>
        </label>
        <button className='button'>Stake</button>
      </form>
    )
  }
}

  export default StakeForm;
