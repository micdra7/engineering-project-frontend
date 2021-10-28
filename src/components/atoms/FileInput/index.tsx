import { Box } from '@chakra-ui/react';
import { FilePondFile } from 'filepond';
import React from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

import 'filepond/dist/filepond.min.css';

registerPlugin(FilePondPluginFileValidateType);

type TFileInputProps = {
  files: FilePondFile[];
  setFiles: React.Dispatch<React.SetStateAction<FilePondFile[]>>;
  required?: boolean;
  acceptedFileTypes?: string[];
};

const FileInput = ({
  files,
  setFiles,
  required,
  acceptedFileTypes,
}: TFileInputProps): JSX.Element => (
  <Box mt={2}>
    <FilePond
      files={files.map(pondFile => pondFile.file)}
      onupdatefiles={pondFiles => setFiles(pondFiles)}
      allowMultiple={false}
      required={required}
      acceptedFileTypes={acceptedFileTypes}
      fileValidateTypeLabelExpectedTypesMap={{
        'application/javascript': '.js',
        'text/plain': 'txt',
      }}
      fileValidateTypeDetectType={(file, type) =>
        new Promise(resolve => {
          if (!type) {
            resolve(file.fileExtension);
          } else {
            resolve(type);
          }
        })
      }
    />
  </Box>
);

export default FileInput;
