import eventEmitter from "../EventEmitter";

const useEventEmitter = (event: string) => {
  const emit = (data?: any) => {
    eventEmitter.emit(event, data);
  };
  return { emit };
};

export default useEventEmitter;
