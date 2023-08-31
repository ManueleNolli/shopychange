import {} from 'framer-motion'
import React, { useRef } from 'react'
import {
  FormControl,
  FormLabel,
  AspectRatio,
  InputGroup,
  Box,
  Image,
} from '@chakra-ui/react'

import { MdDelete } from 'react-icons/md'
import { Placeholder } from '../../assets/AssetsManager'

type UploadImageProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpload: (event: any) => void
  cancelUpload: () => void
  currentImage: File | undefined
}

export default function UploadImage({
  onUpload,
  cancelUpload,
  currentImage,
}: UploadImageProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <FormControl isRequired>
      <FormLabel htmlFor="image">Image</FormLabel>
      <AspectRatio
        ratio={1}
        maxH={{ base: '40vh', md: '40vh' }}
        maxW={{ base: '40vh', md: '40vh' }}
        bg={'gray.100'}
        ml="auto"
        mr="auto"
      >
        {currentImage ? (
          <>
            <Image
              src={currentImage ? URL.createObjectURL(currentImage) : ''}
              alt="image"
            />
            <Box
              data-testid="delete-button"
              opacity={0}
              transition="opacity 0.3s"
              _groupHover={{ opacity: 0.5, cursor: 'pointer' }}
              onClick={cancelUpload}
            >
              <MdDelete fill="#FF4500" size={'50%'} />
            </Box>
          </>
        ) : (
          <InputGroup>
            <input
              data-testid="image-input"
              id="image"
              type="file"
              placeholder="image"
              accept="image/*"
              style={{ display: 'none' }}
              ref={inputRef}
              onChange={onUpload}
            />
            <Image
              data-testid="image-placeholder"
              src={Placeholder}
              w="100%"
              h="100%"
              onClick={() => {
                if (inputRef.current) {
                  inputRef.current.click()
                }
              }}
              _hover={{
                cursor: 'pointer',
                opacity: 0.5,
                transition: 'opacity 0.3s',
              }}
            />
          </InputGroup>
        )}
      </AspectRatio>
    </FormControl>
  )
}
