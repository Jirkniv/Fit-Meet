import { View } from 'react-native';
import { styles } from './styles';
import Title from '../../components/Title/Title';
import CustomText from '../../components/CustomText/CustomText';
import { Input } from '../../components/CustomImput/CustomImput';
import { Button } from '../../components/CustomButton/CustomButton';
import TextLink from '../../components/TextLink/TextLink';
import KeyboardAvoidingContent from '../../components/KeyboardAvoidingContent/KeyboardAvoidingContent';
import { useState } from 'react';
import Toast from 'react-native-toast-message';
import useAppContext from '../../hooks/useAppContext';
import Logo from '../../components/logo/logo';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';
import  { showErrorToast, showSuccessToast } from '../../components/Toast/Toast';



export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useTypedNavigation();
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const { auth: { login }, } = useAppContext();

  function isEmailValid(email: string) {
    return email.includes('@') && email.includes('.');
  }



  async function handleLogin() {
    let isError = false;

    if (!isEmailValid(email)) {
      setEmailError(true);
      showErrorToast('Erro de Validação', 'Digite um e-mail válido.');
      isError = true;
    }

    if (password.length < 6) {
      setPasswordError(true);
      showErrorToast('Erro de Validação', 'A senha deve ter pelo menos 6 caracteres.');
      isError = true;
    }

    if (isError) return;

    try {
      await login(email, password);
      navigation.navigate('Home');
      showSuccessToast('Sucesso', 'Usuário logado com sucesso!');
      } catch (error: any) {
      showErrorToast('Houve um erro', error.message || 'Erro ao fazer login.');
    }
  }

  return (
    <KeyboardAvoidingContent>
      <View style={styles.container}>
        <Logo/>
        <View style={styles.header}>
          <Title>Faça Login e comece a treinar</Title>
          <CustomText style={styles.subTitle}>
            Encontre parceiros para treinar ao ar livre. Conecte-se e comece agora! 💪
          </CustomText>
        </View>
        <View style={styles.form}>
          <Input.Root isError={emailError}>
            <Input.Label required>E-mail</Input.Label>
            <Input.Input
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError(false);
              }}
              autoCapitalize="none"
              placeholder="Ex.: nome@email.com"
              autoComplete='email'
            />
            {emailError && (
              <Input.ErrorMessage style={{ marginTop: 6 }}>
                Digite um e-mail válido!
              </Input.ErrorMessage>
            )}
          </Input.Root>

          <Input.Root isError={passwordError}>
            <Input.Label required>Senha</Input.Label>
            <Input.Input
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError(false);
              }}
              placeholder="Ex.: nome123"
              autoCapitalize="none"
              autoComplete="off"
              secureTextEntry
            />
            {passwordError && (
              <Input.ErrorMessage style={{ marginTop: 6 }}>
                A senha deve ter pelo menos 6 caracteres!
              </Input.ErrorMessage>
            )}
          </Input.Root>

          <Button.Root
            style={{ marginTop: 40, marginBottom: 18, width: '80%', height: 44, alignSelf: 'center' }}
            onPress={handleLogin}
          >
            <Button.Label>Entrar</Button.Label>
          </Button.Root>

          <TextLink
            onPress={() => navigation.navigate('Register')}
            simpleText="Ainda não tem uma conta?"
            boldText=" Cadastre-se"
          />
        </View>
      </View>
    </KeyboardAvoidingContent>
  );
}
