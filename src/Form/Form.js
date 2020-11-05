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
        <option value="wall">Wall</option>
        <option value="erase">Erase</option>
      </select>
    </form>
  )
}

export default Form