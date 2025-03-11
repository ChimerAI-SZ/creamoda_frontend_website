import mitt from 'mitt';

type AppEvents = {
  // events after generate image successfully
  'sidebar:submit-success': { data: any };
};

export const emitter = mitt<AppEvents>();
