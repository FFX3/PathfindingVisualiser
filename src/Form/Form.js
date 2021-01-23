import React from 'react';

const Form = ({wandManager}) => {

  const selectHandler = (e) => {
    wandManager(e.target.value);
  }

  return(
    <form className="inputs">
        <label>Start</label><input onClick={()=>{wandManager('start')}} type='radio' name='wandType' value='start'></input>    
        <label>End</label><input onClick={()=>{wandManager('end')}} type='radio' name='wandType' value='end'></input>
        <label>Wall</label><input onClick={()=>{wandManager('wall')}} type='radio' name='wandType' value='wall'></input>    
        <label>Erase</label><input onClick={()=>{wandManager('erase')}} type='radio' name='wandType' value='erase'></input>
    </form>
  )
}

export default Form