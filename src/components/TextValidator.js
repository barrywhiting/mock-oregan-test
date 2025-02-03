import '../styles/TextValidator.css';

import React from 'react';

const TextValidator = (props) => {
    // Just added this to display a nice message to the user to let them know their 
    // choice is invalid.  For the password field I think it would be nicer to give a better message
    // listing what is actually needed for a valid password but at least there is something in 
    // place to help.
    return(
        <div
            id={`${props.id}error`}
            className={`errorText ${(props.id.includes('userName') &&
                props.emailValid) ||
                (props.id.includes('password') &&
                    props.passwordValid) ? 'hideError' : 'showError'}`}
        >{props.errorMessage}</div>

    )
}

export default TextValidator;