import mitt from 'mitt';

type AppEvents = {
  // events after generate image successfully
  'sidebar:submit-success': { data: any };
  'login:handleLogin': { isOpen: boolean };
};

export const emitter = mitt<AppEvents>();
