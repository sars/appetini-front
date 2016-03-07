import normalizeErrors from 'helpers/normalizeErrors';

export default function submit(cook, submitFn) {
  return new Promise((resolve, reject) => {
    submitFn(cook).then(response => {
      resolve(response);
    }).catch(response => {
      const errors = normalizeErrors(response.errors);
      reject({...errors, _error: errors});
    });
  });
}
