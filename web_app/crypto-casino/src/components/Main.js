import React, {Component} from 'react';
import StakeForm from './StakeForm';

class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentForm: props.content
    }
  }

  render() {
    let content
    if(this.state.currentForm == 'stake') {
      content = <StakeForm/>
    }

    return (
      <>
        {content}
      </>
  )
  }
}

export default Main;
