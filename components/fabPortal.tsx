import { useState } from 'react';
import { useColorScheme } from 'react-native';
import { FAB, Portal } from 'react-native-paper';
import { useTheme } from 'tamagui';

const PostFAB = () => {
  const [state, setState] = useState({ open: false });
  const onStateChange = ({ open }: { open: boolean }) => setState({ open });
  const { open } = state;

  const theme = useTheme();
  const iconColorScheme =
    useColorScheme() == "dark" ? "black" : "white";

  const tintColor = '#00cccc'

  return (
      <Portal>
        <FAB.Group
          open={open}
          visible
          icon={open ? 'close' : 'plus'}
          style={{paddingBottom: 0}}
          fabStyle={{backgroundColor: tintColor, shadowOpacity:0.20}}
          color={iconColorScheme}
          actions={[
            {
              icon: 'record-circle',
              label: 'Live Activity',
              color: tintColor,
              style: {shadowOpacity:0.2},
              onPress: () => console.log('Pressed notifications'),
            },
            {
              icon: 'pencil',
              label: 'Manual Activity',
              color: tintColor,
              style: {shadowOpacity:0.2},
              onPress: () => console.log('Pressed email'),
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