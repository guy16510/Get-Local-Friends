import { ThemeProvider, Card, Heading, Text, Button, View, Image, Flex } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

const theme = {
  name: 'getLocalFriendsTheme',
  tokens: {
    colors: {
      background: {
        primary: { value: '#f9f9f9' },
      },
      font: {
        primary: { value: '#333' },
      },
    },
    components: {
      button: {
        primary: {
          backgroundColor: { value: '#5724ff' },
          color: { value: '#ffffff' },
          _hover: { backgroundColor: { value: '#003efa' } },
        },
      },
    },
  },
};

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <View
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f9f9f9',
          color: '#333',
          textAlign: 'center',
          padding: '2rem',
        }}
      >
        {/* Hero Image */}
        {/* <Image
          src="/homePageHero.png"
          alt="People Connecting"
          style={{ width: '100%', maxWidth: '800px', borderRadius: '12px', marginBottom: '2rem' }}
          /> */}

        {/* Main Heading */}
        <Heading level={1} style={{ fontSize: '3rem', fontWeight: 'bold' }}>
          Get Local Friends
        </Heading>
        <Text fontSize="1.2rem" margin="1rem 0">
          Meet new friends in your area—without the pressure of dating.
        </Text>

        {/* Call to Action */}
        <Button variation="primary" size="large">
          Coming Soon – Check Back!
        </Button>

        {/* Testimonials Section */}
        <Flex direction="column" gap="1rem" marginTop="2rem" width="100%" maxWidth="600px">
          <Card padding="1.5rem" borderRadius="12px" backgroundColor="#fff" boxShadow="0 4px 10px rgba(0, 0, 0, 0.1)">
            <Text fontStyle="italic">
              "I moved to a new city and met my best friend through Get Local Friends!"
            </Text>
            <Text fontWeight="bold" marginTop="0.5rem">— Alex R.</Text>
          </Card>

          <Card padding="1.5rem" borderRadius="12px" backgroundColor="#fff" boxShadow="0 4px 10px rgba(0, 0, 0, 0.1)">
            <Text fontStyle="italic">
              "Finally, an app that helps me find like-minded friends without the pressure of dating."
            </Text>
            <Text fontWeight="bold" marginTop="0.5rem">— Jamie L.</Text>
          </Card>

          <Card padding="1.5rem" borderRadius="12px" backgroundColor="#fff" boxShadow="0 4px 10px rgba(0, 0, 0, 0.1)">
            <Text fontStyle="italic">
              "As a parent, I wanted to find friends who understand my schedule – this site helped me!"
            </Text>
            <Text fontWeight="bold" marginTop="0.5rem">— Morgan S.</Text>
          </Card>
        </Flex>
      </View>
    </ThemeProvider>
  );
}