import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { styles } from './styles';
import { Button } from '../../components/CustomButton/CustomButton';
import { Input } from '../../components/CustomImput/CustomImput';
import TextLink from '../../components/TextLink/TextLink';
import Title from '../../components/Title/Title';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';
import CustomText from '../../components/CustomText/CustomText';
import { postRegister } from '../../service/service';
import Toast from 'react-native-toast-message';
import KeyboardAvoidingContent from '../../components/KeyboardAvoidingContent/KeyboardAvoidingContent';
import { showErrorToast, showSuccessToast } from '../../components/Toast/Toast';
import { GoBackArrow } from '../../components/GoBackArrow/GoBackArrow';


function Register(): React.JSX.Element {
  const navigation = useTypedNavigation();
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [nameError, setNameError] = useState(false);
  const [cpfError, setCpfError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const validateInputs = () => {
    let hasError = false;

    if (!name.trim() || name.length < 3) {
      setNameError(true);
      showErrorToast('Campo obrigatório', 'Informe seu nome completo.');
      hasError = true;
    }

    const cpfRegex = /^(\d{11}|\d{3}\.\d{3}\.\d{3}-\d{2})$/;
    if (!cpfRegex.test(cpf)) {
      setCpfError(true);
      showErrorToast('CPF inválido', 'Digite um CPF válido (11 números ou XXX.XXX.XXX-XX).');
      hasError = true;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setEmailError(true);
      showErrorToast('E-mail inválido', 'Digite um e-mail válido.');
      hasError = true;
    }

    if (password.length < 6) {
      setPasswordError(true);
      showErrorToast('Senha fraca', 'A senha deve ter pelo menos 6 caracteres.');
      hasError = true;
    }

    return !hasError;
  };

  const handleRegister = async () => {
    setNameError(false);
    setCpfError(false);
    setEmailError(false);
    setPasswordError(false);

    if (!validateInputs()) return;

    setLoading(true);
    try {
      await postRegister({ name, cpf, email, password });
      showSuccessToast('Sucesso', 'Usuário registrado com sucesso!');
      navigation.navigate('Login');
    } catch (error: any) {
      showErrorToast('Erro ao cadastrar', error.message || 'Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingContent>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Title>CRIE SUA CONTA</Title>
        </View>
        <CustomText style={styles.text}>
          Por favor preencha os dados para prosseguir!
        </CustomText>
        <Input.Root isError={nameError}>
          <Input.Label required>Nome Completo</Input.Label>
          <Input.Input
            value={name}
            onChangeText={(text) => {
              setName(text);
              setNameError(false);
            }}
            placeholder="Ex: João Pessoa"
            autoComplete='name'
          />
          {nameError ? (
            <Input.ErrorMessage>Informe seu nome completo!</Input.ErrorMessage>
          ) : null}
        </Input.Root>
        <Input.Root isError={cpfError}>
          <Input.Label required>CPF</Input.Label>
          <Input.Input
            value={cpf}
            onChangeText={(text) => {
              setCpf(text);
              setCpfError(false);
            }}
            placeholder="Ex: 111.111.111-12"
            autoComplete='off'
          />
          {cpfError ? (
            <Input.ErrorMessage>CPF inválido.</Input.ErrorMessage>
          ) : null}
        </Input.Root>
        <Input.Root isError={emailError}>
          <Input.Label required>E-mail</Input.Label>
          <Input.Input
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError(false);
            }}
            placeholder="Ex: nome@email.com"
            autoCapitalize="none"
            autoComplete='email'
          />
          {emailError ? (
            <Input.ErrorMessage>Digite um e-mail válido!</Input.ErrorMessage>
          ) : null}
        </Input.Root>
        <Input.Root isError={passwordError}>
          <Input.Label required>Senha</Input.Label>
          <Input.Input
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError(false);
            }}
            placeholder="Ex: nome123"
            secureTextEntry
            autoComplete='password'
          />
          {passwordError ? (
            <Input.ErrorMessage>Senha fraca, mínimo 6 caracteres.</Input.ErrorMessage>
          ) : null}
        </Input.Root>
        <Button.Root
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >
          <Button.Label>{loading ? 'Cadastrando...' : 'Cadastrar'}</Button.Label>
        </Button.Root>
        <Text style={styles.footer}>
         <TextLink
          onPress={() => navigation.navigate('Login')}
          simpleText='Ja possui uma conta? '
          boldText='Login'
         />
        </Text>
        <GoBackArrow/>
      </View>
    </KeyboardAvoidingContent>
  );
}

export default Register;
