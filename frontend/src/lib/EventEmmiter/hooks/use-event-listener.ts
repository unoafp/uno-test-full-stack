import { useEffect } from "react";
import eventEmitter, { type EventCallback } from "../EventEmitter";

const useEventListener = <T = any>(
  events: string | string[],
  callback: EventCallback<T>
) => {
  useEffect(() => {
    const eventArray = Array.isArray(events) ? events : [events];

    eventArray.forEach((event) => {
      eventEmitter.subscribe(event, callback);
    });

    return () => {
      eventArray.forEach((event) => {
        eventEmitter.unsubscribe(event, callback);
      });
    };
  }, [events, callback]);
};

export default useEventListener;
