import { commonStyles } from '@/assets/styles/theme';
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';

export default function CreateContact() {
  return (
    <View style={commonStyles.container}>
      <TextInput placeholder="Name" />
      <TextInput placeholder="Phone" />
      <TextInput placeholder="Email" />
      <TextInput placeholder="Address" />
      <TextInput placeholder="City" />
      <TextInput placeholder="State" />
      <TextInput placeholder="Zip" />
      <TextInput placeholder="Country" />
    </View>
  );
}

