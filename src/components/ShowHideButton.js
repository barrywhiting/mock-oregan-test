import '../styles/ShowHideButton.css';

import React, {useEffect, useState} from 'react';

const ShowHideButton = (props) => {
    const [iconClass, setIconClass] = useState('hideIcon');

    /**
     * Bit of a hacky way to do this I feel but quick and easy to implement the focus
     * when the Show Hide button is clicked to focus the password text box
     */
    const handleFocus = () => {
        const passwordElement = document.getElementById(props.passwordId);
        if(passwordElement !== document.activeElement) {
            passwordElement.focus();
        }
    }
    
    /**
     * Change the button image by checking the action in props sent from the 
     * parent component.  Also call the focus method to focus on the associated 
     * password sibling
     */
    const handleIcon = () => {
        handleFocus();
        props.setIconAction(!props.showIconAction);
        setIconClass(props.showIconAction ? 'showIcon' : 'hideIcon');
    }

    return (
        <div
            id={props.id}
            className={`icon ${iconClass}`}
            onClick={handleIcon}
        ></div>
    )
};

export default ShowHideButton;