import '../styles/TextEntry.css'

import * as focusTrap from 'focus-trap';

import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';

import ShowHideButton from './ShowHideButton';
import TextValidator from './TextValidator';
import passwordValidator from 'password-validator';
import { validate as validateEmail } from 'email-validator';

const TextEntry = forwardRef((props, ref) => {
    const [boxFocus, setBoxFocus] = useState(props.focused); // Is the text box focused
    const [emailError, setEmailError] = useState(false); // Is there an email error
    const [lastLetter, setLastLetter] = useState(); // The last letter entered in the password box
    const [showIconAction, setShowIconAction] = useState(false); // Flag for the state of the show hide the text
    const [passwordError, setPasswordError] = useState(false); // Flag to action the password error
    const [textBoxText, setTextBoxText] = useState(''); // State variable for the text entered from the parent component
    const textBoxRef = useRef();

    const defaultText = props.defaultText; // default text sent from the parent no need to store in the state as we dont ever change it
    
    /**
     * Handle the text and state variables when focusing the text box
     */
    const handleFocusBox = () => {
        setBoxFocus(true);

        const textValue = textBoxTextValue();
        props.setCurrentInputName(props.id)
        setTextBoxText(textValue);
    }

    /**
     * This is replicated in the calling component to set the last character and 
     * handle if we want to show asterik or text when the show hide compenent is clicked
     * for the password
     * @param {*} passwordRef 
     * @param {*} textValue 
     * @returns 
     */
    const handlePassword = (passwordRef, textValue) => {
        //Only do this if we have a password field with text and the show text action is false
        if(passwordRef.id.includes('password') && textValue !== '' && !showIconAction) {

            // Get the last letter
            setLastLetter(passwordRef.textBoxText.length > 0 && passwordRef.textBoxText.at(-1));
            const replacedTextValue = textValue.replace(/./gi, '*');
            const trimedText = replacedTextValue.length > 1 && replacedTextValue.substring(0, replacedTextValue.length - 1);

            // We have the string from the start to the last letter minus 1 and have a last letter
            if (trimedText && lastLetter) {
                passwordRef.setTextBoxText(trimedText + lastLetter);
                setTimeout(() => {
                    passwordRef.setTextBoxText(replacedTextValue);
                }, 1000);
                // If there is only 1 character then handle here
            } else if(textValue && textValue.length === 1) {
                setLastLetter(textValue.length > 0 && textValue.at(-1));
                passwordRef.current.setTextBoxText(textValue);
                setTimeout(() => {
                    passwordRef.current.setTextBoxText(replacedTextValue);
                }, 1000);
                // Catch all other cases and return the replaced text
            } else if(passwordRef.id.includes('password')) {
                setTextBoxText(replacedTextValue);
            }
            return replacedTextValue;
        } else { // We dont want to replace the text with asterik so just return what we have
            return textValue;
        }
    }

    /**
     * Handle the unfocused situation usually onBlur and set up the state variables
     */
    const handleUnFocusBox = () => {
        setBoxFocus(false);

        let textValue = textBoxTextValue();
        setTextBoxText(textValue);

        // We need to validate the an entered email address to see if its valid
        if(props.id.includes('userName')) {
            setTimeout(() => {
                const validEmail = validateEmail(textValue);
                setEmailError(validEmail);
            }, 100);
            // We need to handle the entered password to see if its valid
        } else if(props.id.includes('password')) {
            setTimeout(() => {
                const schema = new passwordValidator();
                
                schema
                    .is().min(8)                                    // Minimum length 8
                    .is().max(100)                                  // Maximum length 100
                    .has().uppercase()                              // Must have uppercase letters
                    .has().lowercase()                              // Must have lowercase letters
                    .has().digits(1)                                // Must have at least 1 digits
                    .has().not().spaces()                           // Should not have spaces
                    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values
                const validPassword = schema.validate(textValue);
                console.log('VALID PASSWORD ' + textValue)
                setPasswordError(validPassword);
            }, 100);
        }
    }

    /**
     * Functional method to return reguly used items saves having tests to make sure everything is there
     * and trying to stream line some of the bloated functions
     * @returns Object
     */
    const getProperties = () => {
        const parentRef = ref && ref.current;
        const parentBoxFocus = parentRef && parentRef.boxFocus;
        const parentDefaultText = parentRef && parentRef.defaultText;
        const parentInput = props.inputs &&  props.inputs[parentRef.id];
        const parentTextBoxText = parentRef && parentRef.textBoxText;
        const siblingRef = props.siblingRef && props.siblingRef.current;
        const siblingBoxFocus = siblingRef && siblingRef.boxFocus;
        const siblingDefaultText = siblingRef && siblingRef.defaultText;
        const siblingInput = props.inputs && props.inputs[siblingRef.id];
        const siblingTextBoxText = siblingRef && siblingRef.textBoxText;

        return {
            parentBoxFocus,
            parentDefaultText,
            parentInput,
            parentRef,
            parentTextBoxText,
            siblingBoxFocus,
            siblingDefaultText,
            siblingInput,
            siblingRef,
            siblingTextBoxText
        };
    }

    /**
     * Funtional method to get the default text to be used 
     * @returns Object
     */
    const getDefaults = () => {
        const {parentBoxFocus,
            parentInput,
            parentDefaultText,
            parentTextBoxText,
            siblingBoxFocus,
            siblingInput,
            siblingDefaultText,
            siblingTextBoxText} = getProperties();
        
        const hasValidParentText = parentInput &&
            siblingInput &&
            parentInput !== '' &&
            parentInput !== parentDefaultText &&
            parentInput !== siblingInput;
        const hasInvalidParentText = parentInput &&
            !siblingInput &&
            parentInput !== '' &&
            parentInput !== parentDefaultText &&
            parentInput !== siblingInput;
        const hasValidSiblingText = siblingInput &&
            parentInput &&
            siblingInput !== '' &&
            siblingInput !== siblingDefaultText &&
            siblingInput !== parentInput;
        const hasInvalidSiblingText = siblingInput &&
            !parentInput;

        let parentTextValue = (parentTextBoxText && parentTextBoxText !== '') ?
            parentTextBoxText : parentDefaultText;
        let siblingTextValue = (siblingTextBoxText && siblingTextBoxText !== '') ?
            siblingTextBoxText : siblingDefaultText;

        // Try to set the parent refernce text value
        if(hasValidParentText) {
            parentTextValue = parentInput;
            siblingTextValue = siblingInput;
        } else if(hasInvalidParentText) {
            parentTextValue = parentInput;
        }
        
        // Try to set the sibling refernce text value
        if(hasValidSiblingText) {
                siblingTextValue = siblingInput;
        } else if(hasInvalidSiblingText) {
                siblingTextValue = siblingInput;
        }
        return {parentTextValue, siblingTextValue};
    }

    /**
     * Work out the text to be shown in the text box.
     * @returns String 
     */
    const textBoxTextValue = () => {
        const {
            parentBoxFocus,
            parentDefaultText,
            parentInput,
            parentRef,
            siblingBoxFocus,
            siblingDefaultText,
            siblingRef,
        } = getProperties();

        let {parentTextValue, siblingTextValue} = getDefaults();
        let textValue = '';

        const hasValidSiblingText = siblingTextValue !== '' && siblingTextValue === siblingDefaultText;
        const hasInvalidSiblingText = siblingTextValue !== '' && siblingTextValue !== siblingDefaultText;
        console.log(hasValidSiblingText + '  ' + siblingTextValue)
        // There is valid text for the parent ref and it is in focus
        if(hasValidSiblingText &&
            parentTextValue !== '' &&
            parentTextValue !== parentDefaultText) {
                console.log('IN IF')
                siblingRef.setTextBoxText(siblingTextValue);
                textValue = parentTextValue;
        // Parent is out of focus but sibling is in focus and has valid text
        } else if(hasValidSiblingText &&
            siblingTextValue !== parentDefaultText) {
                console.log('IN ELSE IF 1')
                siblingRef.setTextBoxText(siblingTextValue);
                textValue = '';
        // Sibling is out of focus but does still have valid text so set to an empty string
        } else if(hasValidSiblingText) {
            console.log('IN ELSE IF 2')
                siblingRef.setTextBoxText(siblingTextValue);
                textValue = '';
        // Parent is in focus and there is valid sibling string so set both the parent and 
        // sibling text
        } else if(parentTextValue !== '' &&
            parentTextValue !== parentDefaultText &&
            hasInvalidSiblingText) {
                console.log('IN ELSE IF 3')
                parentRef.setTextBoxText(parentTextValue);
                siblingRef.setTextBoxText(siblingTextValue);
                textValue = parentTextValue;
        // Sibling is in focus and there is parent text that is not default so set the text
        } else if(siblingBoxFocus &&
            parentInput &&
            parentTextValue !== ''
        ) {
            console.log('IN ELSE IF 4')
            parentTextValue = parentInput;
            textValue = parentTextValue;
        }
        
        // The show hide for the password text box has been clicked so get the correct text 
        // and handle the timing for the last character
        if(!showIconAction &&
            props.id.includes('password')) {
                return handlePassword(parentRef, textValue);
        } else if((showIconAction || siblingRef.showIconAction) &&
            siblingTextValue !== '' &&
            siblingTextValue !== siblingDefaultText &&
            siblingRef.id.includes('password')) {
                return handlePassword(siblingRef, textValue);
        } else {
            return textValue;
        }
    }

    /**
     * Call back function used by the child show hide button to set the state of the action
     */
    const setIconAction = () => {
        const {parentRef} = getProperties();
        
        if(parentRef && parentRef.id.includes('password')) {
            setShowIconAction(!showIconAction);
        };
    }
    
    /**
     * As these text boxes are returned as referencies for ease of use set the functions and
     * variables needed to be used across other components.  Side effect of this is that when minipulating 
     * in this component extra functions and parameters in here have to be added for use
     */
    useImperativeHandle(ref, () => ({
        blur: () => {
            textBoxRef.current.blur();
        },
        focus: () => {
            textBoxRef.current.focus();
        },
        handleFocusBox,
        handleUnFocusBox,
        setBoxFocus,
        setEmailError,
        setIconAction,
        setShowIconAction,
        setTextBoxText,
        textBoxTextValue,
        boxFocus,
        defaultText,
        emailError,
        id: props.id,
        passwordError,
        showIconAction,
        textBoxText
    }), [])
    
    /**
     * The component has now been mounted.  As we dont really need this remounted theres no
     * need to add any state checks
     */
    useEffect(() => {
        const container = document.getElementById(props.textBoxWrapper)
        const trap = focusTrap.createFocusTrap(`#${props.textBoxWrapper}`, {
            onActivate: () => container.classList.add('is-active'),
            onDeactivate: () => container.classList.remove('is-active')
        });
        setEmailError(true);
        setPasswordError(true);
        if (props.focused) {
            setBoxFocus(true);
            trap.activate();
        } else if (!props.focused && !ref.current.boxFocus) {
            setBoxFocus(false);
            trap.deactivate();
        }
    }, []);
    
    return (
        <div className={`${props.id.includes('password') ? 'passwordBoxWrapper' : 'boxWrapper'}`}>
            <div 
                className={`textBox ${props.id.includes('password') ? 'password' : ''}`}
                contentEditable={true}
                id={props.id}
                onFocus={handleFocusBox}
                onBlur={handleUnFocusBox}
                ref={ref}
                suppressContentEditableWarning={true}
                tabIndex={props.tabIndex}
            >
                {textBoxText}
            </div>
            {
                ref &&
                ref.current &&
                ref.current.id.includes('password') &&
                <ShowHideButton
                    showIconAction={showIconAction}
                    id="showHideButton"
                    passwordId={props.id}
                    passwordRef={ref && ref.current}
                    passwordText={textBoxText}
                    setIconAction={() => setIconAction()}
                    tabIndex="3"
                />
            }
            <TextValidator
                id={props.id}
                errorMessage={props.errorMessage}
                emailValid={emailError}
                passwordValid={passwordError}
            ></TextValidator>
        </div>
    )
    }
)

export default TextEntry;