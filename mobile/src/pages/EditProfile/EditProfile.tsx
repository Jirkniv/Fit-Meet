import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';
import { Input } from '../../components/CustomImput/CustomImput';
import { Button } from '../../components/CustomButton/CustomButton';
import Category from '../../components/category/categoty';
import { styles } from './styles';
import KeyboardAvoidingContent from '../../components/KeyboardAvoidingContent/KeyboardAvoidingContent';
import ImagePicker from '../../components/ImagePicker/ImagePicker';
import useAppContext from '../../hooks/useAppContext';
import { handleUpdateProfile, handleUpdateAvatar, getUserPreferences } from '../../service/service';
import PreferencesModal from '../Preferences/Preferences';
import { Deactivate } from '../../components/Deactivate/Deactivate.tsx';
import Toast from 'react-native-toast-message';
import { showErrorToast, showSuccessToast } from '../../components/Toast/Toast';
import { GoBackArrow } from '../../components/GoBackArrow/GoBackArrow.tsx';
import Title from '../../components/Title/Title.tsx';
import { NotePencil } from 'phosphor-react-native';
import { fixUrl } from '../../api/fixUrl.ts';

const EditProfile = () => {
  const navigation = useTypedNavigation();
  const { auth: { user }, getUser } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState(user?.name || '');
  const [cpf] = useState(user?.cpf || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [newAvatar, setNewAvatar] = useState<any>(null);
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [userPreferences, setUserPreferences] = useState<string[]>([]);
  const [showPreferences, setShowPreferences] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        await getUser();
        const prefs = await getUserPreferences();
        setUserPreferences(prefs.map(p => p.typeId));
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: 'Erro ao carregar preferências.',
        });
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [getUser]);

  const isValidEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSave = async () => {
    let hasError = false;

    if (!isValidEmail(email)) {
      setEmailError(true);
      showErrorToast('Erro', 'E-mail inválido');
      hasError = true;
    }

    if (password && password.length < 6) {
      setPasswordError(true);
      showErrorToast('Erro', 'Senha deve ter pelo menos 6 caracteres');
      hasError = true;
    }

    if (!name.trim()) {
      showErrorToast('Erro', 'Nome é obrigatório');
      hasError = true;
    }

    if (hasError) return;

    try {
      if (isDataChanged) {
        await handleUpdateProfile(user.id, { name, email, password });
        showSuccessToast('Sucesso', 'Perfil atualizado com sucesso!');
        navigation.navigate('Profile');
      }

      if (newAvatar) {
        const updatedAvatar = await handleUpdateAvatar(user.id, newAvatar);
        setAvatar(updatedAvatar);
        showSuccessToast('Sucesso', 'Avatar atualizado!');
        navigation.navigate('Profile');
      }

      await getUser();
    } catch (error: any) {
      showErrorToast('Erro', error.message || 'Tente novamente.');
    }
  };


  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00BC7D" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingContent>
      <ScrollView contentContainerStyle={styles.main}>
        <View style={styles.header}>
          <Title >ATUALIZAR PERFIL</Title>
        </View>

        <View style={styles.avatarContainer}>
          <Image style={styles.avatar} source={{ uri: fixUrl(newAvatar?.uri) || fixUrl(avatar) }} />
          <TouchableOpacity style={styles.cameraContainer}>
            <ImagePicker
              defaultImage={require('../../assets/images/camera.png')}
              onImageSelected={(img) => {
                setNewAvatar(img);
                setIsDataChanged(true);
              }}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <Input.Root>
            <Input.Label required>Nome Completo</Input.Label>
            <Input.Input
              value={name}
              onChangeText={(text) => {
                setName(text);
                setIsDataChanged(true);
              }}
              placeholder="Ex: João Pessoa"
            />
          </Input.Root>

          <Input.Root>
            <Input.Label required>CPF</Input.Label>
            <Input.Input value={cpf} editable={false} />
          </Input.Root>

          <Input.Root isError={emailError}>
            <Input.Label required>E-mail</Input.Label>
            <Input.Input
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError(false);
                setIsDataChanged(true);
              }}
              placeholder="Ex: joao@email.com"
              autoCapitalize="none"
            />
            {emailError && (
              <Input.ErrorMessage style={{ marginTop: 6 }}>
                Digite um e-mail válido!
              </Input.ErrorMessage>
            )}
          </Input.Root>

          <Input.Root isError={passwordError}>
            <Input.Label>Senha</Input.Label>
            <Input.Input
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError(false);
                setIsDataChanged(true);
              }}
              placeholder="Nova senha"
              secureTextEntry
            />
          {passwordError ? (
                    <Input.ErrorMessage>Senha fraca, mínimo 6 caracteres.</Input.ErrorMessage>
                  ) : null}
                </Input.Root>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Title style={styles.subTitle}>PREFERÊNCIAS</Title>
            <TouchableOpacity style={styles.backIconContainer} onPress={() => setShowPreferences(true)}>
              <NotePencil style={styles.backIcon} />
            </TouchableOpacity>
          </View>
          <Category onPress={() => {}} selected={userPreferences} size={61}  />
        </View>

        <PreferencesModal
        visible={showPreferences}
        onClose={() => setShowPreferences(false)}
        canSkip={false}
        onPreferencesChange={(preferences) => setUserPreferences(preferences)}
      />

        <View style={styles.footer}>
          <Button.Root
            style={{ marginTop: 20, marginBottom: 18, width: '80%', height: 44, alignSelf: 'center' }}
            onPress={handleSave}
          >
            <Button.Label>Salvar</Button.Label>
          </Button.Root>

          <Deactivate />
        </View>
        <GoBackArrow/>
      </ScrollView>
    </KeyboardAvoidingContent>
  );
};

export default EditProfile;
