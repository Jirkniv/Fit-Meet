import React, { useState } from 'react';
import { Modal, View,  } from 'react-native';
import Category from '../../components/category/categoty';
import { Button } from '../../components/CustomButton/CustomButton';
import Title from '../../components/Title/Title';
import { defineUserPreferences } from '../../service/service';
import { showErrorToast, showSuccessToast } from '../../components/Toast/Toast';
import { GoBackArrow } from '../../components/GoBackArrow/GoBackArrow';
import { styles } from './styles';
import useAppContext from '../../hooks/useAppContext';

import { ActionTypes } from '../../context/reducer/reducer';
interface PreferencesModalProps {
  visible: boolean;
  onClose: () => void;
  canSkip: boolean;
  onPreferencesChange: (preferences: string[]) => void; 
}

function PreferencesModal({ visible, onClose, canSkip, onPreferencesChange }: PreferencesModalProps): React.JSX.Element {
  const safePadding = '5%';
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { auth } = useAppContext();


  function handleToggleCategory(id: string) {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id]
    );
  }

  async function handleSavePreferences() {
    try {
      await defineUserPreferences(selectedCategories);
      showSuccessToast('Sucesso', 'Preferências salvas com sucesso!');
      onPreferencesChange(selectedCategories);
      onClose();
    } catch (error) {
      showErrorToast('Erro', 'Erro ao salvar preferências. Tente novamente.');
    }
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View
        style={{
          padding: safePadding,
          backgroundColor: 'white',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-around',
        }}
      >
        {!canSkip && <GoBackArrow />}

        <Title style={styles.Title}>SELECIONE SEU TIPO FAVORITO</Title>

        <Category
          size={118}
          onPress={handleToggleCategory}
          selected={selectedCategories}
          pref
        />

        <Button.Root onPress={handleSavePreferences} style={{ width: '100%', height: 44 }}>
          <Button.Label type="default">Salvar</Button.Label>
        </Button.Root>

        {canSkip && (
          <Button.Root
            style={{
              backgroundColor: 'white',
              width: '100%',
              height: 44,
              marginTop: -30,
            }}
            onPress={() => {
              auth.skipPreferences?.(); // <-- importante!
              onClose();
            }}
            type="ghost"
          >
            <Button.Label type="ghost">Pular</Button.Label>
          </Button.Root>
        )}
      </View>
    </Modal>
  );
}

export default PreferencesModal;