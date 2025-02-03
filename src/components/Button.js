import '../styles/Button.css';

import React from 'react';

const Button = (props) => {
    /**
     * Build the url with the entered data from the form.
     * This is just for demonstration so just passing back to the dev webpack 
     * server with the added values.  
     */
    const handleUrl = () => {
        const keys = Object.keys(props.inputs);
        const keyValuePairs = keys.map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(props.inputs[key]);
          });

          const url = 'http://localhost:3000/?' + keyValuePairs.join('&')
          window.location = url;
    }

    return (
        <div
            id={props.id}
            className="button"
            onClick={(handleUrl)}
        >{props.text}</div>
    )
}

export default Button;