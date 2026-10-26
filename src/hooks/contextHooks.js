import {useContext} from 'react';
import {LanguageContext} from '../contexts/LanguageContext.jsx';

// Current recommendation is to use custom hook instead of the context directly
// this way we don't have errors when UserContext is not defined or null (thats why we have the if statement)

const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error(
      'useLanguageContext must be used within an LanguageProvider',
    );
  }

  return context;
};

export {useLanguageContext};
