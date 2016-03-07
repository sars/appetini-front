import normalizeErrors from 'helpers/normalizeErrors';

export default function submit(lunch, submitFn) {
  lunch.dishes_attributes = lunch.dishes;

  return new Promise((resolve, reject) => {
    submitFn(lunch).then(response => {
      resolve(response);
    }).catch(response => {
      const errors = normalizeErrors(response.errors);
      reject({...errors, _error: errors});
    });
  });
}
