import '../styles/App.css';
import 'react-simple-keyboard/build/css/index.css';

import React, {useRef, useState} from 'react';

import Button from './Button';
import Keyboard from 'react-simple-keyboard';
import TextEntry from './TextEntry';

const App = () => {
  const userName = useRef(null);
  const password1 = useRef(null);
  const [inputs, setInputs] = useState({});
  const [layoutName, setLayoutName] = useState('default');
  const [inputName, setInputName] = useState('default');
  const[lastLetter, setLastLetter] = useState();
  const keyboard = useRef();

  const onChangeAll = (inputs) => {
    /**
     * Here we spread the inputs into a new object
     * If we modify the same object, react will not trigger a re-render
     */

    setInputs({ ...inputs });
    if(inputName === userName.current.id && userName.current.boxFocus) { // As we enter new content from the keyboard for the username populate
      userName.current.setTextBoxText(inputs[inputName]);
    } else if(inputName === password1.current.id && !password1.current.boxFocus) { // Do the same for the password field 
      const passwordValue = inputs[inputName];
      setLastLetter(passwordValue.length > 0 && passwordValue.at(-1));
      if(!password1.current.showIconAction) { // As the show the text is off for the keyboard get the last character hold for 1 second then change to an asterik 
        const replacedTextValue = passwordValue.replace(/./gi, '*');
        const trimedText = replacedTextValue.length > 1 && replacedTextValue.substring(0, replacedTextValue.length - 1);
        
        // We have a trimed by the last character string hold for 1 second then put
        // the last character at the back of the text as an asterik
        if (trimedText && lastLetter) {
          password1.current.setTextBoxText(trimedText + lastLetter);
          setTimeout(() => {
            password1.current.setTextBoxText(replacedTextValue);
          }, 1000);
        } else if(passwordValue && passwordValue.length === 1) { // Handle when there is just 1 charecter in the password field
          setLastLetter(passwordValue);
          password1.current.setTextBoxText(passwordValue);
          setTimeout(() => {
            password1.current.setTextBoxText(replacedTextValue);
          }, 1000);
        } else { // Safety net place what we have 
          password1.current.setTextBoxText(replacedTextValue);
        }
      } else { // Just show the default text no asterik
        password1.current.setTextBoxText(passwordValue);
      }
    }
  };

  /**
   * Returns the reference object password error
   * @returns boolean
   */
  const handlePasswordError = () => {
    return password1 && password1.current && password1.current.passwordError;
  }

  const handleShift = () => {
    const newLayoutName = layoutName === "default" ? "shift" : "default";
    setLayoutName(newLayoutName);
  };

  const onKeyPress = (button) => {
    /**
     * If you want to handle the shift and caps lock buttons
     */
    if (button === "{shift}" || button === "{lock}") handleShift();

  };

  const onChangeInput = (event) => {
    const inputVal = inputs[inputName];
    
    setInputs({
      ...inputs,
      [inputName]: inputVal
    });

    keyboard.current.setInput(inputVal);
  };

  /**
   * Take the input name and and set the state variable from out side this component
   * @param {*} inputName 
   */
  const setCurrentInputName = (inputName) => {
    setInputName(inputName);
  };
  
  return (
    <div className="app">
      <header>
        User Login
      </header>
      <section id='textBoxWrapper'>
        <TextEntry
          defaultText="Type Username Here"
          errorMessage={'Please enter a valid email for the User Name'}
          focused={true}
          id="userName"
          inputs={inputs}
          ref={userName}
          setCurrentInputName={() => setCurrentInputName('userName')}
          siblingRef={password1}
          tabIndex="1"
          textBoxWrapper={'textBoxWrapper'}
        />
        <TextEntry
          defaultText="Type Password Here"
          errorMessage={'Please enter a valid password for the Password'}
          focused={false}
          id="password1"
          inputs={inputs}
          lastLetter={lastLetter}
          ref={password1}
          setCurrentInputName={() => setCurrentInputName('password1')}
          siblingRef={userName}
          tabIndex="2"
          textBoxWrapper={'textBoxWrapper'}
        />
        <div className={`buttonWrapper ${handlePasswordError() ? 'passwordError' : ''}`}>
          <Button id="submitData" text="Sign In" tabIndex="4" inputs={inputs} />
        </div>
        <div> </div>
        <Keyboard
          inputName={inputName}
          keyboardRef={r => (keyboard.current = r)}
          layoutName={layoutName}
          onChangeAll={onChangeAll}
          onKeyPress={onKeyPress}
          preventMouseDownDefault={true}
          newLineOnEnter={false}
          tabCharOnTab={false}
          physicalKeyboardHighlight={true}
          layout={{
            default: [
              "` 1 2 3 4 5 6 7 8 9 0 - =",
              "q w e r t y u i o p",
              "a s d f g h j k l",
              "{shift} z x c v b n m {bksp}",
              " [ ] \\ {space} {enter}",
              ".com @gmail.com @yahoo.com"
            ],
            shift: [
              "~ ! @ # $ % ^ & * ( ) _ +",
              "Q W E R T Y U I O P",
              'A S D F G H J K L',
              "{shift} Z X C V B N M {bksp}",
              " [ ] \\ {space} {enter}",
              ".com @gmail.com @yahoo.com"
            ]
          }}
          display={
            {
              '{shift}': 'shift',
              '{space}': '&nbsp',
              '{enter}': 'enter',
              '{bksp}': '⌫',
              '{123}': '123',
              '{abc}': 'ABC',
            }
          }
        />
      </section>
    </div>
  );
}

export default App;
