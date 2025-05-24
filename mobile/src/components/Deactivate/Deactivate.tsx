import React, { useState } from 'react';
import { View, Alert ,Modal} from 'react-native';
import { handleDeleteUser } from '../../service/service'; 
import useAppContext  from '../../hooks/useAppContext';
import { styles } from './styles';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';
import { Button } from '../CustomButton/CustomButton';
import Title from '../Title/Title';
import CustomText from '../CustomText/CustomText';


export function Deactivate() {
  const [isModalVisible, setModalVisible] = useState(false);
 const { auth: { logout }  } = useAppContext();
const navigation = useTypedNavigation();
const handleDelete = async () => {
    try {
      await handleDeleteUser();
      logout();
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao deletar o perfil. Tente novamente.');
    }
  };

  return (
    <View>
      <Button.Root
        style={styles.triggerButton}
        type='ghost'
        onPress={() => setModalVisible(true)}
      >
       
        <Button.Label type='ghost'>Desativar Conta</Button.Label>
      </Button.Root>

      <Modal
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
        transparent
        
>
        <View style={styles.modalContent}>
          <Title style={styles.title}>TEM CERTEZA QUE DESEJA DESATIVAR SUA CONTA?</Title>
          <CustomText style={styles.paragraph}>
            Ao desativar sua conta, todos os seus dados e histórico de atividades serão permanentemente removidos.
          </CustomText>
          <CustomText style={[styles.paragraph, styles.bold]}>
            Esta ação é irreversível e não poderá ser desfeita.
          </CustomText>

          <View style={styles.buttonRow}>
            <Button.Root type='ghost' style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Button.Label >Cancelar</Button.Label>
            </Button.Root>

            <Button.Root  style={styles.confirmButton} onPress={handleDelete}>
              <Button.Label >Desativar</Button.Label>
            </Button.Root>
          </View>
        </View>
      </Modal>
    </View>
  );
}
