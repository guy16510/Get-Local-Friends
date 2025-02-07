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
// import '../App.css'; // Use your snippet-based CSS, or inline style props below

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
            Get Local Friends
          </Heading>
          <Text color="#fff" fontSize="1.1rem">
            Where your chemistry is more than an algorithm.
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
            GETTING YOU THE{' '}
            <Text as="span" color="var(--amplify-colors-brand-accent)">
              PERFECT PARTNER
            </Text>
          </Heading>
          <Text maxWidth="700px" textAlign="center" fontSize="1rem" lineHeight="1.6">
            Learn about our next-level connection-matching app. Isotope is an upcoming service
            focusing on connecting real people, bridging new relationships, and building communities.
            Ready to vibe with the right people?
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
              <strong>Start matching today:</strong> It&apos;s about more than just swiping. It&apos;s about
              genuine connections and real synergy.
            </Text>
            <Text fontSize="1rem" lineHeight="1.5">
              Here at Isotope, we understand that people don&apos;t just fit into neat little
              formulas. We aim to create a space where you can be yourself, connect organically,
              and spark relationships that go beyond the surface.
            </Text>
            <Button
              as="a"
              href="#"
              variation="primary"
              className="cta-btn"
              alignSelf="flex-start"
            >
              Start Matching Now
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
              alt="Couple"
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
          BE MORE THAN JUST YOURSELF
        </Heading>
        <Text
          className="be-more-text"
          maxWidth="800px"
          margin="0 auto"
          fontSize="1rem"
          lineHeight="1.6"
          color="#555"
        >
          Isotope is all about expanding the realm of possibility. We connect people across
          all corners, bridging new relationships, communities, and experiences in an
          organic way. Sure, maybe there&apos;s an app or an algorithm for everything these
          days, but maybe we need to step outside that box. Instead of letting a
          formulaic approach define our circles, let&apos;s put real synergy at the core.
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
          WHY WE ARE DIFFERENT:{' '}
          <Text as="span" color="var(--amplify-colors-brand-accent)">
            CHEMISTRY &gt;
          </Text>{' '}
          CALCULATIONS
        </Heading>
        <Text
          className="chemistry-text"
          maxWidth="800px"
          margin="0.5rem auto 2rem"
          fontSize="1rem"
          lineHeight="1.6"
          color="#555"
        >
          Isotope as an element comes from building blocks of the same element.
          In other words, there&apos;s a unique fundamental difference in the same group.
          No one is the same. But it&apos;s a way of feeling connected, not just a transactional
          relationship. We believe there&apos;s a real synergy that you can feel.
          If it were simply chemical, we wouldn&apos;t need a deeper approach. That&apos;s why we
          created Isotope: so you can be sure you&apos;re building a genuine connection.
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
            THE CHEMISTRY IS REAL
          </Heading>
          <Text>
            Friendship, dating, chemistry. That is the Isotope community. It’s about synergy, not just
            formulas.
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
              alt="Placeholder"
              height="200px"
              objectFit="cover"
            />
            <Heading level={3} fontSize="1.2rem" margin="1rem 0">
              MORE THAN AN ALGORITHM
            </Heading>
            <Text padding="0 1rem 1rem" fontSize="0.95rem" lineHeight="1.4" color="#555">
              Isotope takes into account that real connections can&apos;t be
              simplified into numbers alone.
            </Text>
          </Flex>

          {/* Card 2 */}
          <Flex className="card" direction="column" border="1px solid #eee" borderRadius="8px" overflow="hidden" backgroundColor="rgb(217,217,217)" boxShadow="0 2px 6px rgba(0,0,0,0.08)" textAlign="center">
            <Image
              src="https://www2.byoplayground.com/blog/wp-content/uploads/2020/12/heart-disease-hero-img.jpg"
              alt="Placeholder"
              height="200px"
              objectFit="cover"
            />
            <Heading level={3} fontSize="1.2rem" margin="1rem 0">
              MORE THAN AN ALGORITHM
            </Heading>
            <Text padding="0 1rem 1rem" fontSize="0.95rem" lineHeight="1.4" color="#555">
              We strive to keep things dynamic, allowing for real-time shifts in
              how people interact and build bonds.
            </Text>
          </Flex>

          {/* Card 3 */}
          <Flex className="card" direction="column" border="1px solid #eee" borderRadius="8px" overflow="hidden" backgroundColor="rgb(217,217,217)" boxShadow="0 2px 6px rgba(0,0,0,0.08)" textAlign="center">
            <Image
              src="https://media.istockphoto.com/id/643137108/photo/ecstatic-group-enjoying-the-party.jpg?s=612x612&w=0&k=20&c=saW_oIf8jjuJ_rPjCrQkKHLcJqYxvYEA7_CiwbTktcs="
              alt="Placeholder"
              height="200px"
              objectFit="cover"
            />
            <Heading level={3} fontSize="1.2rem" margin="1rem 0">
              MORE THAN AN ALGORITHM
            </Heading>
            <Text padding="0 1rem 1rem" fontSize="0.95rem" lineHeight="1.4" color="#555">
              Connection isn&apos;t just a match; it&apos;s a spark that can grow
              into something authentic and meaningful.
            </Text>
          </Flex>
        </Grid>
      </View>
    </View>
  );
};

export default HomePage;