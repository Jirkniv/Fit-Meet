import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image, TouchableOpacity, Text, ActivityIndicator, } from 'react-native';
import Title from '../../components/Title/Title.tsx';
import Avatar from '../../components/avatar/avatar.tsx';
import { Button } from '../../components/CustomButton/CustomButton.tsx';
import { styles } from './styles.ts';
import {
  postSubscription,
  handleUnsubscribe,
  handleApprove,
  handleCheckIn,
  handleConclude,
  fetchParticipants,
} from '../../service/service.ts';
import useAppContext from '../../hooks/useAppContext.ts';
import { Input } from '../../components/CustomImput/CustomImput.tsx';
import { useRoute, RouteProp } from '@react-navigation/native';
import { MainStackParamList } from '../../routes/AppRoutes.tsx';
import { useTypedNavigation } from '../../hooks/useTypedNavigation.ts';
import { showErrorToast, showSuccessToast } from '../../components/Toast/Toast';
import { GoBackArrow } from '../../components/GoBackArrow/GoBackArrow';
import Map from '../../components/map/Map.tsx';
import {  UsersThree, CalendarDots, NotePencil, Heart, X } from 'phosphor-react-native';
import { fixUrl } from '../../api/fixUrl.ts';

interface ActivityDetailsRouteProp extends RouteProp<MainStackParamList, 'ActivityDetails'> {}

const ActivityDetails = () => {
  const route = useRoute<ActivityDetailsRouteProp>();
  const { activityData, activityId } = route.params;

  const [participants, setParticipants] = useState<any[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmationCodeInput, setConfirmationCodeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const meetingPoint = {
    latitude: activityData.address.latitude,
    longitude: activityData.address.longitude,
  };
  const { auth: { user } } = useAppContext();
  const navigation = useTypedNavigation();
 
  function startOfDay(d: Date): Date {
    const copy = new Date(d);
    copy.setHours(0, 0, 0, 0);
    return copy;
  }

  function isToday(d: Date): boolean {
    const today = startOfDay(new Date());
    return startOfDay(d).getTime() === today.getTime();
  }

  function isPast(d: Date): boolean {
    return startOfDay(d).getTime() < startOfDay(new Date()).getTime();
  }

  function isFuture(d: Date): boolean {
    return startOfDay(d).getTime() > startOfDay(new Date()).getTime();
  }

  const activityDate = new Date(activityData.scheduledDate);
  const today = isToday(activityDate);
  const alreadyPast = isPast(activityDate);
  const upcoming = isFuture(activityDate);

  useEffect(() => {
    async function loadParticipants() {
      try {
        const data = await fetchParticipants(activityId);
        setParticipants(data);

        const isUserSubscribed = data.some((participant) => participant.userId === user.id);
        setIsSubscribed(isUserSubscribed);

        const confirmed = data.some((participant) => participant.confirmedAt != null);
        setIsConfirmed(confirmed);

        if (activityData.creator.id === user.id) {
          setIsCreator(true);
        }
      } catch (error) {
        console.error(error);
      }
    }

    loadParticipants();
  }, [activityId, activityData.creator.id]);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      await postSubscription(activityData.id, activityData.private);
      showSuccessToast('Sucesso', 'Inscrição realizada com sucesso!');
      setIsSubscribed(true);
      navigation.goBack();
    } catch (error) {
      showErrorToast('Erro', 'Erro ao se inscrever na atividade.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribeClick = async () => {
    try {
      setLoading(true);
      await handleUnsubscribe(activityData.id);
      showSuccessToast('Sucesso', 'Desinscrição realizada com sucesso!');
      setIsSubscribed(false);
      navigation.goBack();
    } catch (error) {
      showErrorToast('Erro', 'Erro ao se desinscrever da atividade.');
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (participantId: string, approved: boolean) => {
    try {
      setLoading(true);
      await handleApprove(activityData.id, participantId, approved);
      showSuccessToast('Sucesso', `Participante ${approved ? 'aprovado' : 'rejeitado'} com sucesso!`);
    } catch (error) {
      showErrorToast('Erro', 'Erro ao aprovar/rejeitar participante.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckInClick = async () => {
    try {
      setLoading(true);
      await handleCheckIn(activityData.id, confirmationCodeInput);
      showSuccessToast('Sucesso', 'Check-in realizado com sucesso!');
      setIsConfirmed(true);
      navigation.goBack();
    } catch (error) {
      showErrorToast('Erro', 'Erro ao realizar check-in.');
    } finally {
      setLoading(false);
    }
  };

  const handleConcludeClick = async () => {
    try {
      setLoading(true);
      await handleConclude(activityData.id);
      showSuccessToast('Sucesso', 'Atividade encerrada com sucesso!');
      navigation.goBack();
    } catch (error) {
      showErrorToast('Erro', 'Erro ao encerrar atividade.');
    } finally {
      setLoading(false);
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
    <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
    <View style={styles.container}>
    <GoBackArrow/>

              {/* Se for o criador e a atividade ainda nao iniciou/terminou */}
              {isCreator && upcoming ? (
             <TouchableOpacity
             style={{     width: 30,
               height: 30,
               position: 'absolute',
               right: 25,
               top: 45,  
               zIndex: 1,
             }}
             
             onPress={() => navigation.navigate('EditActivity', { activityId: activityData.id })}
           >
             <NotePencil size={30} weight='bold' style={styles.editButton}/>
           </TouchableOpacity>
              
              ) : null}
              <View style={styles.modalHeader}>
                <Image source={{uri : fixUrl(activityData.image)}} style={styles.image} />
                <View style={styles.datas}>
                  <CalendarDots style={styles.icon}/>
                  <Text style={styles.text}>{new Date(activityData.scheduledDate).toLocaleString("default", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}</Text>
                  <View style={styles.separator} />
                  <Text>{activityData.private ? "Privado" : "Aberta"}</Text>
                  <View style={styles.separator} />
                  <UsersThree style={styles.icon}  />
                  <Text style={styles.text}>{activityData.participantCount}</Text>
                </View>
                {/* Se for o criador e a atividade iniciou e ainda nao terminou */}
                  {  !activityData.completedAt && isCreator && today ? (
                      <View style={styles.codeBox}>
                  <Text style={styles.codeTitle}>Codigo de Confirmação</Text>
                  <Text style={styles.codeText}>{activityData.confirmationCode}</Text>
                </View> 
                // Se estiver inscrito com status diferente de rejeitado e esperando, em uma atividade que ainda nao terminou */}
                  ) : isSubscribed && today && !isConfirmed && !activityData.completedAt && (!(activityData.userSubscriptionStatus === "REJECTED" || activityData.userSubscriptionStatus === "WAITING"))  ?  (
                    <View style={styles.codeBox}>
                        <Input.Root style={styles.inputCode}>
                        <Input.Label>Código de  Confirmação</Input.Label>
                        <Input.Input style={styles.inputInput} onChangeText={setConfirmationCodeInput}  ></Input.Input>
                        </Input.Root>
                        <Button.Root style={styles.confirmButton} onPress={handleCheckInClick} disabled={loading}>
                        <Button.Label>Confirmar Presença</Button.Label>
                        </Button.Root>
                    </View>
                  ) :
                  // Já confirmado
                  null}
             
                
                     
                <View style={styles.content}>
    
                    <View style={styles.titleContainer}>
                      <Title >{activityData.title}</Title>
                      <Text style={styles.text}>{activityData.description}</Text>
                    </View>
                    <Title style={{marginTop: 20}} >PONTO DE ENCONTRO</Title>
                    <View style={styles.mapContainer}>

                    <Map initialPosition={meetingPoint} editable={false} />

                    </View>
                    <Title>Participantes</Title>
                    <Avatar avatar={activityData.creator.avatar} name={activityData.creator.name} organizer id={activityData.creator.id} />
                    {participants.map((participant) => (
                    <View style={styles.participantsContainer}>
                      <Avatar avatar={participant.avatar} name={participant.name} id={participant.id} />
                      {/* Mostrar botoes de aprovar e rejeitar se o usuario for o criador e a atividade ainda não tiver iniciada */}
                      {isCreator && upcoming && (
                        <View style={styles.buttons}>
                          {!(participant.userSubscriptionStatus === "REJECTED") && (
                            <Button.Root
                              style={{ width: 30, height: 30, borderRadius: 50 }}
                              onPress={() => handleApproval(participant.id, false)}
                            >
                              <Button.Label>
                                <X  color='white'/>
                              </Button.Label>
                            </Button.Root>
                          )}

                          {!(participant.userSubscriptionStatus === "APPROVED") && (
                            <Button.Root
                              style={{ width: 30, height: 30, borderRadius: 50 }}
                              onPress={() => handleApproval(participant.id, true)}
                            >
                              <Button.Label>
                                <Heart color='white' />
                              </Button.Label>
                            </Button.Root>
                          )}
                        </View>
                      )}
                    </View>
                  ))}

                        <View style={styles.buttonContainer}>
                         
                            { //  Atividade Cancelada
                              activityData.deletedAt != null ? (
                              <Button.Root disabled style={styles.primaryButton}>
                                <Button.Label>Atividade cancelada</Button.Label>
                              </Button.Root>
                              // Atividade Concluida
                            ) : activityData.completedAt != null ? (
                              null
                              // Usuario rejeitado na atividade
                            ) : activityData.userSubscriptionStatus === "REJECTED" ? (
                              <Button.Root disabled style={styles.dangerButton}>
                                <Button.Label>Inscrição negada</Button.Label>
                              </Button.Root>
                              // O criador pode encerrar a atividade quando ela tiver iniciada
                            ) : (today || alreadyPast)  && isCreator ? (
                              <Button.Root onPress={handleConcludeClick} style={styles.primaryButton}>
                                <Button.Label>Finalizar atividade</Button.Label>
                              </Button.Root>
                              // Quando a atividade estiver em andamento não pode haver mais inscrições ou desinscrições
                            ) : (today || alreadyPast) && !isSubscribed ? (
                              <Button.Root disabled style={styles.primaryButton}>
                                <Button.Label>Atividade em andamento</Button.Label>
                              </Button.Root>
                              // Usuario aguardando aprovação
                            ) : activityData.userSubscriptionStatus === "WAITING" ? (
                              <Button.Root disabled style={styles.primaryButton}>
                                <Button.Label>Aguardando aprovação</Button.Label>
                              </Button.Root>
                              // Usuario ja fez check-in
                            ) : isConfirmed ? (
                              <View>
                                <Text style={styles.infoText}></Text>
                              </View>
                             
                          
                              // Usuario aprovado e pode desinscrever
                            ) : upcoming && isSubscribed &&
                              (activityData.userSubscriptionStatus === "APPROVED" ||
                                activityData.userSubscriptionStatus === undefined) ? (
                              <Button.Root onPress={handleUnsubscribeClick} style={styles.primaryButton}>
                                <Button.Label>Sair</Button.Label>
                              </Button.Root>
                            ) : !isCreator && !isSubscribed ? (
                              // O usuario pode se inscrever
                              <Button.Root onPress={handleSubscribe} style={styles.primaryButton}>
                                <Button.Label>Participar</Button.Label>
                              </Button.Root>
                            ) : null}
                            </View>
                        </View>     
                    </View>
            </View>
          </ScrollView>
  );
};
export default ActivityDetails;