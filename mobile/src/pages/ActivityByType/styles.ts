import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: '5%',
    justifyContent: 'center',
  },
  backButton: {
    width: 16,
    height: 20,
  },
  title: {
    marginTop: -12,
  },
  categoryTitle: {
    fontSize: 28,
    marginBottom: 14,
    marginRight: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionHeaderText: {
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 10,
  },
  arrowIcon: {
    width: 16,
    height: 20,
  },
});