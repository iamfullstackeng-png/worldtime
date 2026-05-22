import { createListenerMiddleware } from '@reduxjs/toolkit';

export const listenerMiddleware = createListenerMiddleware();
export const startAppListening = listenerMiddleware.startListening;
export const stopAppListening = listenerMiddleware.stopListening;
