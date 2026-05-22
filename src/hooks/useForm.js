import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';

/**
 * Generic form state and validation runner.
 *
 * @typedef {Object} UseFormOptions
 * @property {Object} initialValues - Initial field values, keyed by field name.
 * @property {(values: Object) => Object} [validate] - Returns an errors object with the same
 *   keys as values; truthy string = error message, falsy = valid.
 *
 * @typedef {Object} UseFormReturn
 * @property {Object} values
 * @property {Object} errors - Only contains entries for fields the user can see errors on
 *   (touched or after submit attempt).
 * @property {Object} touched
 * @property {boolean} isSubmitting
 * @property {boolean} isValid - True when validate() returns no truthy errors, ignoring touched.
 * @property {(field: string) => (eventOrValue: Event | any) => void} handleChange -
 *   Accepts a DOM event (uses `.target.value` or `.target.checked`) or a bare value.
 * @property {(field: string) => () => void} handleBlur
 * @property {(onValid: (values: Object) => any) => (event: Event) => Promise<void>} handleSubmit
 * @property {(field: string, value: any) => void} setFieldValue
 * @property {(field: string, error: string | null | undefined) => void} setFieldError -
 *   Falsy values (`null`, `undefined`, `''`) clear the forced error.
 * @property {() => void} reset
 *
 * @param {UseFormOptions} options
 * @returns {UseFormReturn}
 *
 * @example
 *   const form = useForm({
 *     initialValues: { email: '', password: '' },
 *     validate: (v) => ({
 *       email: v.email.includes('@') ? null : 'Invalid email',
 *       password: v.password.length >= 6 ? null : 'Too short',
 *     }),
 *   });
 */

const noErrors = Object.freeze({});

const ACTIONS = {
  CHANGE: 'change',
  BLUR: 'blur',
  SET_VALUE: 'set-value',
  SET_ERROR: 'set-error',
  SUBMIT_START: 'submit-start',
  SUBMIT_END: 'submit-end',
  RESET: 'reset',
};

function init({ initialValues }) {
  return {
    values: { ...initialValues },
    touched: {},
    forcedErrors: {},
    submitAttempted: false,
    isSubmitting: false,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.CHANGE:
      return { ...state, values: { ...state.values, [action.field]: action.value } };
    case ACTIONS.BLUR:
      return { ...state, touched: { ...state.touched, [action.field]: true } };
    case ACTIONS.SET_VALUE:
      return { ...state, values: { ...state.values, [action.field]: action.value } };
    case ACTIONS.SET_ERROR:
      return { ...state, forcedErrors: { ...state.forcedErrors, [action.field]: action.error } };
    case ACTIONS.SUBMIT_START: {
      const allTouched = Object.keys(state.values).reduce((acc, k) => {
        acc[k] = true;
        return acc;
      }, {});
      return { ...state, touched: allTouched, submitAttempted: true, isSubmitting: true };
    }
    case ACTIONS.SUBMIT_END:
      return { ...state, isSubmitting: false };
    case ACTIONS.RESET:
      return init({ initialValues: action.initialValues });
    default:
      return state;
  }
}

export function useForm({ initialValues, validate }) {
  const [state, dispatch] = useReducer(reducer, { initialValues }, init);
  const initialValuesRef = useRef(initialValues);

  // `validate` is mirrored into a ref so `handleSubmit` can read the latest
  // one without re-creating the callback. React 19's `react-hooks/refs` rule
  // blocks reading `.current` during render, so `liveErrors` below depends on
  // `validate` directly.
  const validateRef = useRef(validate);
  useEffect(() => {
    validateRef.current = validate;
  }, [validate]);

  const liveErrors = useMemo(() => {
    if (typeof validate !== 'function') return noErrors;
    return validate(state.values) || {};
  }, [state.values, validate]);

  const visibleErrors = useMemo(() => {
    const out = {};
    const keys = new Set([...Object.keys(liveErrors), ...Object.keys(state.forcedErrors)]);
    for (const key of keys) {
      const forced = state.forcedErrors[key];
      if (forced) {
        out[key] = forced;
        continue;
      }
      const shouldShow = state.touched[key] || state.submitAttempted;
      if (shouldShow && liveErrors[key]) {
        out[key] = liveErrors[key];
      }
    }
    return out;
  }, [liveErrors, state.touched, state.forcedErrors, state.submitAttempted]);

  const isValid = useMemo(() => Object.values(liveErrors).every((v) => !v), [liveErrors]);

  const handleChange = useCallback(
    (field) => (event) => {
      const target = event && event.target;
      const next =
        target && target.type === 'checkbox' ? target.checked : target ? target.value : event;
      dispatch({ type: ACTIONS.CHANGE, field, value: next });
    },
    [],
  );

  const handleBlur = useCallback(
    (field) => () => {
      dispatch({ type: ACTIONS.BLUR, field });
    },
    [],
  );

  const setFieldValue = useCallback((field, value) => {
    dispatch({ type: ACTIONS.SET_VALUE, field, value });
  }, []);

  const setFieldError = useCallback((field, error) => {
    dispatch({ type: ACTIONS.SET_ERROR, field, error: error || null });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: ACTIONS.RESET, initialValues: initialValuesRef.current });
  }, []);

  const handleSubmit = useCallback(
    (onValid) => async (event) => {
      if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
      }
      dispatch({ type: ACTIONS.SUBMIT_START });

      const errs =
        typeof validateRef.current === 'function' ? validateRef.current(state.values) || {} : {};
      const hasErrors = Object.values(errs).some((v) => v);

      if (hasErrors) {
        dispatch({ type: ACTIONS.SUBMIT_END });
        return;
      }

      try {
        await onValid(state.values);
      } finally {
        dispatch({ type: ACTIONS.SUBMIT_END });
      }
    },
    [state.values],
  );

  return useMemo(
    () => ({
      values: state.values,
      errors: visibleErrors,
      touched: state.touched,
      isSubmitting: state.isSubmitting,
      isValid,
      handleChange,
      handleBlur,
      handleSubmit,
      setFieldValue,
      setFieldError,
      reset,
    }),
    [
      state.values,
      visibleErrors,
      state.touched,
      state.isSubmitting,
      isValid,
      handleChange,
      handleBlur,
      handleSubmit,
      setFieldValue,
      setFieldError,
      reset,
    ],
  );
}
