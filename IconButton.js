import { images } from './images';
import { TouchableOpacity, Image, StyleSheet } from "react-native";

const IconButton = ({ type }) => {
  return (
    <TouchableOpacity style={styles.iconbutton}>
      <Image source={type} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconbutton: {
    margin: 5,
    marginStart: 180,
  },
});

export default IconButton;