// src/components/HomePage.tsx
import React from 'react';
import {
  Flex,
  View,
  Heading,
  Text,
  Button,
  Image,
  Grid,
  useTheme,
} from '@aws-amplify/ui-react';

const HomePage: React.FC = () => {
  const { tokens } = useTheme();

  return (
    <View as="main">
      <Flex
        width="100%"
        height="80vh"
        position="relative"
        style={{
          backgroundImage: `url('https://media.istockphoto.com/id/643324804/photo/mature-friends-giving-piggybacks-in-backyard-together.jpg?s=612x612&w=0&k=20&c=zXKVxtWwxh-a7TrRi3cywkzIg5P5HapM1JxPkME7E_c=')`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
        alignItems="center"
        justifyContent="center"
      >
        <View
          className="hero-overlay"
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          backgroundColor="rgba(0,0,0,0.4)"
        />
        <Flex
          className="hero-content"
          direction="column"
          alignItems="center"
          gap={tokens.space.medium}
        >
          <Heading
            level={1}
            color="#fff"
            fontSize="2.5rem"
            textTransform="uppercase"
          >
            Find Your Local Crew
          </Heading>
          <Text color="#fff" fontSize="1.1rem">
            Genuine connections, real people, right in your neighborhood.
          </Text>
          <Button
            as="a"
            href="#"
            variation="primary"
            backgroundColor="var(--amplify-colors-brand-accent)"
            color="#fff"
          >
            Coming Soon
          </Button>
        </Flex>
      </Flex>

      {/* INTRO SECTION */}
      <View className="intro-section" maxWidth="1200px" margin="2rem auto" padding="0 1.5rem">
        <Flex className="intro-header" direction="column" alignItems="center" marginBottom="2rem">
          <Heading level={2} fontSize="2rem" fontWeight="700" marginBottom="1rem" textAlign="center">
            BUILDING CONNECTIONS THAT MATTER
          </Heading>
          <Text maxWidth="700px" textAlign="center" fontSize="1rem" lineHeight="1.6">
            Whether you're a new parent, recent transplant, or just looking to expand your circle, we're here to help you find your people—without the awkward algorithms.
          </Text>
        </Flex>

        <Grid
          className="intro-content"
          templateColumns={{ base: '1fr', medium: '1fr 1fr' }}
          gap="2rem"
          alignItems="center"
        >
          <Flex className="intro-text" direction="column" gap="1rem">
            <Text fontSize="1rem" lineHeight="1.5">
              <strong>Connect with Purpose:</strong> Meet like-minded people based on shared interests, hobbies, and life experiences—not just profiles.
            </Text>
            <Text fontSize="1rem" lineHeight="1.5">
              We make it easy to find local communities, meet other parents, explore activities, and create lasting friendships, without the pressure of dating.
            </Text>
            <Button
              as="a"
              href="#"
              variation="primary"
              className="cta-btn"
              alignSelf="flex-start"
            >
              Join the Community
            </Button>
          </Flex>

          <Flex
            className="intro-images"
            gap="1rem"
            wrap="wrap"
            justifyContent="center"
            alignItems="center"
          >
            <Image
              src="/girlsNight.jpg"
              alt="Group of friends"
              width="45%"
              borderRadius="50%"
              objectFit="cover"
            />
            <Image
              src="/girlsNight2.jpg"
              alt="Group gathering"
              width="45%"
              borderRadius="50%"
              objectFit="cover"
            />
          </Flex>
        </Grid>
      </View>

      {/* BE MORE SECTION */}
      <View
        className="be-more-section"
        maxWidth="1200px"
        margin="4rem auto"
        padding="0 1.5rem"
        textAlign="center"
      >
        <Heading level={2} fontSize="1.8rem" marginBottom="1.5rem">
          IT'S MORE THAN JUST MEETING PEOPLE
        </Heading>
        <Text
          className="be-more-text"
          maxWidth="800px"
          margin="0 auto"
          fontSize="1rem"
          lineHeight="1.6"
          color="#555"
        >
          We're not about swiping left or right. We're about creating meaningful connections, shared experiences, and real-life friendships. Meet parents, neighbors, hobbyists, or just someone who gets you.
        </Text>
      </View>

      {/* CHEMISTRY SECTION */}
      <View
        className="chemistry-section"
        maxWidth="1200px"
        margin="4rem auto"
        padding="0 1.5rem"
        textAlign="center"
      >
        <Heading level={2} marginBottom="1rem" fontSize="2rem">
          WHY WE'RE DIFFERENT: 
          <Text as="span" color="var(--amplify-colors-brand-accent)">
            COMMUNITY &gt;
          </Text> 
          ALGORITHMS
        </Heading>
        <Text
          className="chemistry-text"
          maxWidth="800px"
          margin="0.5rem auto 2rem"
          fontSize="1rem"
          lineHeight="1.6"
          color="#555"
        >
          Unlike other platforms, we're not here to match you with data points—we help you find real people. People you can grab coffee with, plan playdates, or join a weekend adventure. 
        </Text>
      </View>

      {/* THE CHEMISTRY IS REAL SECTION + CARDS */}
      <View
        className="chemistry-real-section"
        maxWidth="1200px"
        margin="4rem auto"
        padding="0 1.5rem"
      >
        <View className="chemistry-real-header" textAlign="center" marginBottom="2rem">
          <Heading level={2} fontSize="1.8rem" fontWeight="700">
            REAL CONNECTIONS, REAL COMMUNITY
          </Heading>
          <Text>
            Friendships, support systems, and communities—Get Local Friends is where genuine connections grow.
          </Text>
        </View>

        <Grid
          className="cards-container"
          templateColumns="repeat(auto-fit, minmax(220px, 1fr))"
          gap="2rem"
        >
          {/* Card 1 */}
          <Flex className="card" direction="column" border="1px solid #eee" borderRadius="8px" overflow="hidden" backgroundColor="rgb(217,217,217)" boxShadow="0 2px 6px rgba(0,0,0,0.08)" textAlign="center">
            <Image
              src="https://t3.ftcdn.net/jpg/02/14/36/84/360_F_214368481_jYlhuRT83m1xnnWig3va94rnu1B40W7Z.jpg"
              alt="Group meetup"
              height="200px"
              objectFit="cover"
            />
            <Heading level={3} fontSize="1.2rem" margin="1rem 0">
              CONNECTION BEYOND SCREENS
            </Heading>
            <Text padding="0 1rem 1rem" fontSize="0.95rem" lineHeight="1.4" color="#555">
              Meet in real life, build lasting friendships, and create memories with people in your area.
            </Text>
          </Flex>

          {/* Card 2 */}
          <Flex className="card" direction="column" border="1px solid #eee" borderRadius="8px" overflow="hidden" backgroundColor="rgb(217,217,217)" boxShadow="0 2px 6px rgba(0,0,0,0.08)" textAlign="center">
            <Image
              src="https://www2.byoplayground.com/blog/wp-content/uploads/2020/12/heart-disease-hero-img.jpg"
              alt="Family activities"
              height="200px"
              objectFit="cover"
            />
            <Heading level={3} fontSize="1.2rem" margin="1rem 0">
              FOR ALL STAGES OF LIFE
            </Heading>
            <Text padding="0 1rem 1rem" fontSize="0.95rem" lineHeight="1.4" color="#555">
              Whether you're a new parent, retiree, or just moved to town—there's a community waiting for you.
            </Text>
          </Flex>

          {/* Card 3 */}
          <Flex className="card" direction="column" border="1px solid #eee" borderRadius="8px" overflow="hidden" backgroundColor="rgb(217,217,217)" boxShadow="0 2px 6px rgba(0,0,0,0.08)" textAlign="center">
            <Image
              src="https://media.istockphoto.com/id/643137108/photo/ecstatic-group-enjoying-the-party.jpg?s=612x612&w=0&k=20&c=saW_oIf8jjuJ_rPjCrQkKHLcJqYxvYEA7_CiwbTktcs="
              alt="Friends having fun"
              height="200px"
              objectFit="cover"
            />
            <Heading level={3} fontSize="1.2rem" margin="1rem 0">
              NO ALGORITHMS, JUST REAL PEOPLE
            </Heading>
            <Text padding="0 1rem 1rem" fontSize="0.95rem" lineHeight="1.4" color="#555">
              Skip the endless swiping. Discover authentic relationships that grow beyond the screen.
            </Text>
          </Flex>
        </Grid>
      </View>
    </View>
  );
};

export default HomePage;
