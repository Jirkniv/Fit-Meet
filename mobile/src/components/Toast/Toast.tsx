 import Toast  from 'react-native-toast-message';
function showErrorToast(title: string, message: string) {
    Toast.show({
      type: 'error',
      text1: title,
      text2: message,
      visibilityTime: 5000,  
    });
  }
  function showSuccessToast(title: string, message: string) {
    Toast.show({
      type: 'success',
      text1: title,
      text2: message,
      visibilityTime: 8000,  
    });
  }
  export { showErrorToast, showSuccessToast };