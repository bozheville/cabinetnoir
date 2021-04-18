import React, {
  useEffect,
  useRef,
  useState
} from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  DuplicateIcon,
  IconButton,
  Heading,
  Label,
  Pane,
  Select,
  SwapHorizontalIcon,
} from 'evergreen-ui';

import styles from '../../../styles/Home.module.css';
import {
  Caesar,
  Morse,
  Playfair,
  Vigenere,
  encryptorsList,
} from '../../../components/Encryptors';
import { ExpandableTextArea, Footer } from '../../../components';

const Home: React.FC = () => {
  const [mode, setMode] = useState('caesar');
  const [processType, setProcessType] = useState<string>();
  const [isDecryptMode, setIsDecryptMode] = useState(false);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const { t } = useTranslation('common');
  const outputRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  const { algorythm, action } = router.query;

  useEffect(() => {
    if (!encryptorsList.includes(algorythm as string)) {
      router.push(`/`, undefined, { shallow: true });
    } else {
      setMode(algorythm as string);
    }
  }, [algorythm]);

  useEffect(() => {
    if (!['encrypt', 'decrypt'].includes(action as string)) {
      router.push(`/`, undefined, { shallow: true });
    }

    setIsDecryptMode(action === 'decrypt');
  }, [action]);

  const handleSwapMode = () => {
    const tmp = input;
    setInput(output);
    setOutput(tmp);
    router.push(
      `/encoder/${mode}/${action === 'encrypt' ? 'decrypt' : 'encrypt'}`,
      undefined,
      {
        shallow: true
      }
    );
  };

  const handleChangeAlgorythm = (event) => {
    router.push(
      `/encoder/${event.target.value}/${action}`,
      undefined,
      {
        shallow: true
      }
    );
  };

  const handleCopy = () => {
    outputRef?.current?.select();
    document.execCommand('copy');
  };

  const handleChangeLocale = (event) => {
    router.push(`/encoder/${mode}/${action}`, undefined, {
      locale: event.target.value,
    });
  };

  const EncryptionComponent =
    mode === 'caesar' ? Caesar :
    mode === 'playfair' ? Playfair :
    mode === 'vigenere' ? Vigenere :
    mode === 'morse' ? Morse :
    null;

  return (
    <>
      <Head>
        <title>{t(`processing.${mode}`)} ~ Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Pane
        marginBottom="36px"
        paddingX="24px"
        paddingY="16px"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        boxShadow="0px 0px 3px 0px #999"
      >
        <Heading>{t('welcome')} / {t(`processing.${mode}`)}</Heading>
        <Pane width="100px">
          <Select
            onChange={handleChangeLocale}
            defaultValue={router.locale}
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="ua">Українська</option>
          </Select>
        </Pane>
      </Pane>
      <Pane
        display="flex"
        flexDirection="column"
        justifyContent="center"
        position="relative"
        padding="16px"
        paddingBottom="48px"
        border="1px solid #aaa"
        borderRadius="8px"
        boxShadow="0px 2px 4px 0px #999"
        margin="24px"
      >
        <Pane
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <EncryptionComponent
            input={input}
            onProcessingEnd={({output, actionType}) => {
              setOutput(output);
              setProcessType(actionType);
            }}
            isDecryptMode={isDecryptMode}
          />
          <Pane maxWidth="200px">
            <Select
              onChange={handleChangeAlgorythm}
              defaultValue={algorythm}
            >
              {encryptorsList.map((item) => (
                <option key={`anlorythm-${item}`} value={item}>{t(`processing.${item}`)}</option>
              ))}
            </Select>
          </Pane>
        </Pane>
        <Pane
          display="flex"
          flexDirection="row"
          marginTop="24px"
        >
          <Pane
            display="flex"
            flexDirection="column"
            flexGrow={1}
          >
            <Label>{isDecryptMode ? t(`processType.${processType}`) : t(`message`)}</Label>
            <ExpandableTextArea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              ref={inputRef}
            />
          </Pane>
          <Pane width="1px" backgroundColor="#888" marginX="1em" />
          <Pane
            display="flex"
            flexDirection="column"
            flexGrow={1}
          >
            <Label>{isDecryptMode ? t(`message`) : t(`processType.${processType}`)}</Label>
            <ExpandableTextArea
              value={output}
              readOnly={true}
              ref={outputRef}
            />
          </Pane>
          <IconButton
            icon={SwapHorizontalIcon}
            position="absolute"
            bottom="36px"
            left="50%"
            transform="translateX(-50%)"
            zIndex={10}
            onClick={handleSwapMode}
          />
          <IconButton
            icon={DuplicateIcon}
            position="absolute"
            bottom="8px"
            right="8px"
            zIndex={10}
            onClick={handleCopy}
          />
        </Pane>
      </Pane>
      <Footer />
    </>
  );
};

export const getStaticPaths = async () => {

  return {
      paths: [], //indicates that no page needs be created at build time
      fallback: 'blocking' //indicates the type of fallback
  }
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common']),
  },
});

export default Home;
