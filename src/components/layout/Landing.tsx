import { Flex, Heading, Text } from '@chakra-ui/react';
import { COURSE_ID } from '../../utils/constants';
import TicketQueue from '../queue/TicketQueue';

/**
 * Sign in page UI.
 */
const Landing = ({ isAblyConnected }: { isAblyConnected: boolean }) => {
	console.log('isAblyConnected', isAblyConnected)
  return (
    <Flex direction='column' align='center' justify='center' p={8}>
      <Heading as='h1' size='xl' mb={4}>
        Welcome to the {COURSE_ID} Office Hours Queue
      </Heading>
      <Text mb={4}>Please sign in with your school email above to join or manage the queue.</Text>
  
      {isAblyConnected && (
        <TicketQueue isQueueOpen={true} isPendingStageEnabled={false} userRole='STUDENT' userId='1' />
      )}
    </Flex>
  );
};

export default Landing;
