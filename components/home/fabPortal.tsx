import { router } from 'expo-router';
import { useState } from 'react';
import { useColorScheme } from 'react-native';
import { FAB, Portal } from 'react-native-paper';
import { useTheme } from 'tamagui';
import { LinearGradient } from 'tamagui/linear-gradient';

const PostFAB = ({visible}: {visible: boolean}) => {
  const [state, setState] = useState({ open: false });
  const onStateChange = ({ open }: { open: boolean }) => setState({ open });
  const { open } = state;
  const tintColor = '#00cccc'

  return (
      <Portal>
        <FAB.Group
          open={open}
          visible={visible}
          icon={open ? 'close' : 'plus'}
          style={{paddingBottom: 0}}
          fabStyle={{
            backgroundColor: tintColor, 
            shadowOpacity:0.20
          }}
          color={'white'}
          actions={[
            {
              icon: 'record-circle',
              label: 'Live Workout',
              color: tintColor,
              style: {shadowOpacity:0.2, backgroundColor: '#edf7f7'},
              onPress: () => router.navigate('/live'),
            },
            {
              icon: 'pencil',
              label: 'Manual Workout',
              color: tintColor,
              style: {shadowOpacity:0.2, backgroundColor: '#edf7f7'},
              onPress: () => router.navigate('/manual'),
            }
          ]}
          onStateChange={onStateChange}
          onPress={() => {
            if (open) {
              // do something if the speed dial is open
            }
          }}
        />
      </Portal>
  );
};

export default PostFAB;