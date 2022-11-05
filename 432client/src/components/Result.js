import React from 'react'
import '../css/result.css'
import { PacmanLoader } from 'react-spinners'
export default function Result (props) {

  return (
    <div className='resultmain'>{props.loading == false ? null :
      <div className='back'>
        {props.count == null ?
          <span className='load'><PacmanLoader color="#36d7b7" /></span> :
          props.searching.map((i, n) => (<div key={i}>{i}{" : "} {props.count[n].count}{" "}car</div>))}</div>
    }
    </div>
  )
}
