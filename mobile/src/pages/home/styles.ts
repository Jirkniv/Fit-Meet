import { StyleSheet } from 'react-native';
import { THEME } from '../../assets/THEME';


const safePadding = '5%';
export const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: safePadding,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: THEME.COLORS.mainGreen ,
    padding: 15,
    paddingTop: 30,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  headerText: {
    color: 'white',
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 14,
    color: 'white',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'white',
    width: 52,
    height: 33,
    padding: 8,
    gap: 5,
  },
  scoreIcon: {
    width: 16,
    height: 16,
  },
  avatar: {
    width: 61,
    height: 61,
    borderRadius: 50,
    borderWidth: 1,
  },
  sectionContainer: {
    padding: '5%',
  },
  sectionTitle: {
    fontSize: 28,
    marginBottom: 14,
    marginRight: 10,
  },
  sectionSeeMore:{
    marginLeft: 30,
  },
  categoryContainer: {
    marginTop: 10,
  },
  createActivity: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    zIndex: 10,
    backgroundColor: THEME.COLORS.mainGreen,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
    createActivityImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    color: 'white',
  },
});