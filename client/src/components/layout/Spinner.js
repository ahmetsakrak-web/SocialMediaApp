import React from 'react'
import gif from "./anime.gif"
import { Fragment } from 'react'


const Spinner = (
  <Fragment>
        <img 
                src={gif}
                style={{width:"200px", margin:"auto",display:"block"}}
                alt="Loading..."
        />
     
 </Fragment>
)


export default Spinner;