import {
  Button,
  FormLabel,
  Spacer,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  useDisclosure,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react'
const FieldLabel = ({ field }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  if (field.moreInfo && !(field.moreInfo.title || field.moreInfo.body)) {
    throw `field ${field.name} has "moreInfo" but is missing "moreInfo.title" or "moreInfo.body".`
  }
  return (
    <Flex>
      <FormLabel htmlFor={field.name}>{field.prettyName}</FormLabel>
      {field.moreInfo && field.moreInfo.title && field.moreInfo.body && (
        <>
          <Spacer />
          <Button
            mb={2}
            colorScheme="green"
            type="button"
            size={'sm'}
            onClick={onOpen}
          >
            {field.moreInfo.title}
          </Button>

          <Modal onClose={onClose} isOpen={isOpen} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{field.moreInfo.title}</ModalHeader>
              <ModalBody>{field.moreInfo.body}</ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </Flex>
  )
}

export default FieldLabel
