import { StyleSheet } from "react-native";
const safePadding = '5%';
export const styles = StyleSheet.create({
main: {
  width: '100%',
  padding: safePadding,
},
header: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 14,
  justifyContent: 'center',
},
backIcon: {
  width: 20,
  height: 20,
  marginRight: 20,
},
backIconContainer: {
  height: 30,
  alignSelf: 'center',
},
title: {
  flex: 1,
  textAlign: 'center',
  fontWeight: 'bold',
  fontSize: 20,
},

avatarContainer: {
  alignSelf: 'center',
  marginVertical: 20,
  width: 104,
  height: 104,
  position: 'relative',
},
avatar: {
  width: 104,
  height: 104,
  alignSelf: 'center',
  borderRadius: 50,
  position:'absolute',
  top: -13,
  right: 8,
},
cameraContainer: {
  position: 'absolute',
  bottom: 37,
  right: 27,
},
camera: {
  width: 46,
  height: 34,
},

form: {
  marginBottom: 20,
},

section: {
  marginBottom: 20,
},
sectionHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},
subTitle: {
  fontSize: 28,
  marginBottom: 14,
},

footer: {
  marginBottom: 40,
},
});