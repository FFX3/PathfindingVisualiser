import React from 'react';

const Form = ({wandManager}) => {

  const selectHandler = (e) => {
    wandManager(e.target.value);
  }

  return(
    <form>
      <select onChange={selectHandler}>
        <option value="start">Start</option>
        <option value="end">End</option>
      </select>
    </form>
  )
}

export default Form