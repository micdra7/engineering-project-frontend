import { Box } from '@chakra-ui/react';
import { FilePondFile } from 'filepond';
import React from 'react';
import { FilePond } from 'react-filepond';

import 'filepond/dist/filepond.min.css';

type TFileInputProps = {
  files: FilePondFile[];
  setFiles: React.Dispatch<React.SetStateAction<FilePondFile[]>>;
};

const FileInput = ({ files, setFiles }: TFileInputProps): JSX.Element => (
  <Box mt={2}>
    <FilePond
      files={files.map(pondFile => pondFile.file)}
      onupdatefiles={pondFiles => setFiles(pondFiles)}
      allowMultiple={false}
    />
  </Box>
);

export default FileInput;
